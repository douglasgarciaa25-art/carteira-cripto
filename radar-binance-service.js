'use strict';
// Private Vercel-only helpers (user-JWT RLS access). Never include this file in the static build or service worker.
const crypto = require('node:crypto');
const BINANCE = 'https://api.binance.com';
const isStr = x => typeof x === 'string' && x.length > 0;
class ApiError extends Error {
 constructor(status,code,details={}){
  super(code);this.status=status;this.code=code;
  // Numeric Binance error and affected stage only; never expose credentials or raw messages.
  if(Number.isInteger(details.binanceCode)&&details.binanceCode<0)this.binanceCode=details.binanceCode;
  if(['permissions','balances'].includes(details.stage))this.stage=details.stage;
 }
}
function env(){
 const url=String(process.env.SUPABASE_URL||'').replace(/\/+$/,'');
 const publicKey=String(process.env.SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY||'');
 const encryption=String(process.env.RADAR_BINANCE_ENCRYPTION_KEY||'');
 if(!/^https:\/\/[a-z0-9.-]+$/i.test(url)||!publicKey||!encryption)throw new ApiError(503,'service_not_configured');
 let master;
 try{master=Buffer.from(encryption,'base64')}catch(_){}
 if(!master||master.length!==32)throw new ApiError(503,'encryption_not_configured');
 return {url,publicKey,master};
}
function encrypt(value,master){
 const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',master,iv);
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
 return [iv,cipher.getAuthTag(),ciphertext].map(x=>x.toString('base64')).join('.');
}
function decrypt(value,master){
 const parts=String(value||'').split('.');
 if(parts.length!==3)throw new ApiError(503,'encrypted_data_invalid');
 try{
  const [iv,tag,enc]=parts.map(x=>Buffer.from(x,'base64'));
  if(iv.length!==12||tag.length!==16)throw Error('invalid');
  const decipher=crypto.createDecipheriv('aes-256-gcm',master,iv);decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(enc),decipher.final()]).toString('utf8'));
 }catch(_){throw new ApiError(503,'encrypted_data_invalid')}
}
function getBearer(req){const m=/^Bearer\s+([^\s]+)$/i.exec(String(req.headers?.authorization||''));return m?.[1]||''}
async function authUser(req,conf=env()){
 const token=getBearer(req);
 if(!token||token.length>8192)throw new ApiError(401,'login_required');
 let r;
 try{r=await fetch(conf.url+'/auth/v1/user',{headers:{apikey:conf.publicKey,Authorization:'Bearer '+token},signal:AbortSignal.timeout(7000),cache:'no-store'})}catch(_){throw new ApiError(503,'auth_service_unavailable')}
 if(!r.ok)throw new ApiError(401,'session_invalid');
 const user=await r.json();
 if(!/^[0-9a-f-]{36}$/i.test(String(user.id||''))||!user.email||!user.email_confirmed_at)throw new ApiError(403,'email_confirmation_required');
 return user;
}
async function db(method,userId,body,conf=env(),token){
 if(!token||typeof token!=='string'||token.length>8192)throw new ApiError(401,'login_required');
 if(!/^[0-9a-f-]{36}$/i.test(userId))throw new ApiError(400,'invalid_user');
 const url=new URL(conf.url+'/rest/v1/radar_binance_connections');
 if(method!=='POST')url.searchParams.set('user_id','eq.'+userId);
 if(method==='GET')url.searchParams.set('select','user_id,encrypted_credentials,api_fingerprint,connected_at,last_synced_at,encrypted_snapshot');
 if(method==='POST')url.searchParams.set('on_conflict','user_id');
 let r;
 try{r=await fetch(url.toString(),{method,headers:{apikey:conf.publicKey,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:method==='POST'?'resolution=merge-duplicates,return=minimal':'return=minimal'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(8500),cache:'no-store'})}catch(_){throw new ApiError(503,'database_unavailable')}
 if(!r.ok)throw new ApiError(503,r.status===404?'database_schema_missing':[401,403].includes(r.status)?'database_permission_denied':'database_unavailable');
 return method==='GET'?(await r.json())[0]||null:null;
}
const decimal=v=>{
 const s=String(v??'');if(!/^\d+(?:\.\d+)?$/.test(s))return null;
 const n=Number(s);return Number.isFinite(n)&&n>=0?n:null;
};
async function signedRequest(path,key,secret,offset=0){
 const q=new URLSearchParams({timestamp:String(Date.now()+offset),recvWindow:'5000'}).toString();
 const signature=crypto.createHmac('sha256',secret).update(q).digest('hex');
 let r,body;
 try{
  r=await fetch(BINANCE+path+'?'+q+'&signature='+signature,{method:'GET',headers:{'X-MBX-APIKEY':key,Accept:'application/json'},signal:AbortSignal.timeout(9000),cache:'no-store'});
  body=await r.json().catch(()=>null);
 }catch(_){throw new ApiError(502,'binance_unavailable')}
 const stage=path.includes('apiRestrictions')?'permissions':'balances';
 if(!r.ok){
  const code=Number.isInteger(body?.code)?body.code:null;
  let status=502,reason='binance_request_rejected';
  if(r.status===429||r.status===418||code===-1003){status=429;reason='binance_rate_limited'}
  else if(code===-2015){status=403;reason='binance_key_ip_or_permission'}
  else if(code===-2014){status=400;reason='binance_key_format_invalid'}
  else if(code===-1021)reason='binance_clock_invalid';
  else if(code===-1022)reason='binance_signature_invalid';
  else if(r.status===403){status=403;reason='binance_access_forbidden'}
  throw new ApiError(status,reason,{binanceCode:code,stage});
 }
 if(!body||typeof body!=='object')throw new ApiError(502,'binance_invalid_response',{stage});
 return body;
}
async function offset(){
 try{const r=await fetch(BINANCE+'/api/v3/time',{signal:AbortSignal.timeout(4500),cache:'no-store'});if(r.ok){const d=await r.json();if(Number.isFinite(+d.serverTime))return +d.serverTime-Date.now()}}catch(_){}
 return 0;
}
async function restrictions(key,secret){
 const timeOffset=await offset();
 const perms=await signedRequest('/sapi/v1/account/apiRestrictions',key,secret,timeOffset);
 // Reject unknown/missing permission fields (fail closed).
 if(perms?.enableReading!==true)throw new ApiError(403,'read_access_required');
 if(['enableSpotAndMarginTrading','enableWithdrawals'].some(k=>typeof perms[k]!=='boolean'))throw new ApiError(403,'read_only_key_required');
 const dangerous=['enableSpotAndMarginTrading','enableWithdrawals','enableFutures','enableMargin','permitsUniversalTransfer','enableVanillaOptions','enableInternalTransfer','enablePortfolioMarginTrading','enableFixApiTrade','enableFixApiTrading'];
 if(dangerous.some(k=>perms[k]===true))throw new ApiError(403,'read_only_key_required');
 return timeOffset;
}
async function balances(key,secret,timeOffset){
 const data=await signedRequest('/api/v3/account',key,secret,timeOffset);
 if(!Array.isArray(data?.balances))throw new ApiError(502,'binance_invalid_response');
 const result=[];
 for(const x of data.balances){
  const symbol=String(x?.asset||'').toUpperCase();const free=decimal(x?.free),locked=decimal(x?.locked);
  if(!/^[A-Z0-9]{2,18}$/.test(symbol)||free===null||locked===null||free+locked<=0)continue;
  result.push({symbol,free,locked,qty:free+locked});
 }
 return result.sort((a,b)=>a.symbol.localeCompare(b.symbol));
}
function getCredentials(input){
 const key=String(input?.apiKey||'').trim(),secret=String(input?.apiSecret||'').trim();
 if(!/^[A-Za-z0-9_-]{20,160}$/.test(key)||!/^[A-Za-z0-9_-]{20,160}$/.test(secret))throw new ApiError(400,'invalid_api_credentials');
 return {key,secret};
}
function respond(res,status,data){res.status(status).json(data)}
function guardOrigin(req){
 const origin=String(req.headers?.origin||'');
 if(!origin)return;
 const host=String(req.headers?.['x-forwarded-host']||req.headers?.host||'');
 try{const u=new URL(origin);if(u.protocol==='https:'&&u.host===host)return;if(process.env.NODE_ENV!=='production'&&u.protocol==='http:'&&u.host===host)return;}catch(_){}
 throw new ApiError(403,'origin_forbidden');
}
module.exports={ApiError,env,encrypt,decrypt,getBearer,authUser,db,decimal,signedRequest,restrictions,balances,getCredentials,respond,guardOrigin};
