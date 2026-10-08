const crypto = require('crypto');
const webpush = require('web-push');

const NS='radar:v15:';
const VAPID_KEY=NS+'vapid';
const SUB_SET=NS+'subs';
const SUB_PREFIX=NS+'sub:';
const MARKET_STATE=NS+'market-state';
const CRON_LOCK=NS+'cron-lock';

function kvReady(){return !!(process.env.KV_REST_API_URL&&process.env.KV_REST_API_TOKEN)}
async function kv(args){
  if(!kvReady())throw new Error('KV_REST_API_URL/KV_REST_API_TOKEN ausentes');
  const r=await fetch(process.env.KV_REST_API_URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(args)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||j.error)throw new Error(j.error||`KV ${r.status}`);
  return j.result;
}
function parseJSON(v,fallback=null){try{return typeof v==='string'?JSON.parse(v):v??fallback}catch(_){return fallback}}
function subId(endpoint){return crypto.createHash('sha256').update(String(endpoint||'')).digest('hex').slice(0,32)}

async function ensureVapid(){
  const saved=parseJSON(await kv(['GET',VAPID_KEY]));
  if(saved?.publicKey&&saved?.privateKey)return saved;
  const fresh={...webpush.generateVAPIDKeys(),createdAt:new Date().toISOString()};
  const set=await kv(['SET',VAPID_KEY,JSON.stringify(fresh),'NX']);
  if(set)return fresh;
  const after=parseJSON(await kv(['GET',VAPID_KEY]));
  if(after?.publicKey&&after?.privateKey)return after;
  throw new Error('Não foi possível inicializar VAPID');
}
function vapidSubject(req){
  if(process.env.PUSH_VAPID_SUBJECT)return process.env.PUSH_VAPID_SUBJECT;
  const host=req?.headers?.['x-forwarded-host']||req?.headers?.host||'carteira-cripto-pi.vercel.app';
  return `https://${String(host).split(',')[0].trim()}`;
}
async function saveSubscription(record){
  const endpoint=record?.subscription?.endpoint;
  if(!endpoint)throw new Error('Subscription sem endpoint');
  const id=subId(endpoint),key=SUB_PREFIX+id;
  const old=parseJSON(await kv(['GET',key]),{})||{};
  const next={...old,...record,id,updatedAt:new Date().toISOString(),createdAt:old.createdAt||new Date().toISOString()};
  await kv(['SET',key,JSON.stringify(next)]);await kv(['SADD',SUB_SET,id]);
  return next;
}
async function getSubscriptionByEndpoint(endpoint){const id=subId(endpoint),raw=await kv(['GET',SUB_PREFIX+id]);return parseJSON(raw)}
async function getSubscription(id){return parseJSON(await kv(['GET',SUB_PREFIX+id]));}
async function removeSubscription(idOrEndpoint){
  const id=String(idOrEndpoint||'').startsWith('http')?subId(idOrEndpoint):String(idOrEndpoint||'');
  if(!id)return;await kv(['DEL',SUB_PREFIX+id]);await kv(['SREM',SUB_SET,id]);
}
async function listSubscriptions(){
  const ids=await kv(['SMEMBERS',SUB_SET])||[];const out=[];
  for(const id of ids){const x=await getSubscription(id);if(x?.subscription?.endpoint)out.push(x);else await kv(['SREM',SUB_SET,id]).catch(()=>{})}
  return out;
}
async function sendPush(req,record,payload){
  const vapid=await ensureVapid();webpush.setVapidDetails(vapidSubject(req),vapid.publicKey,vapid.privateKey);
  try{
    const result=await webpush.sendNotification(record.subscription,JSON.stringify(payload),{TTL:240,urgency:'high'});
    return {ok:true,statusCode:result?.statusCode||201};
  }catch(e){
    const statusCode=Number(e?.statusCode)||0;
    if(statusCode===404||statusCode===410)await removeSubscription(record.id||record.subscription.endpoint).catch(()=>{});
    return {ok:false,statusCode,error:String(e?.body||e?.message||e).slice(0,300)};
  }
}
async function getMarketState(){return parseJSON(await kv(['GET',MARKET_STATE]),{})||{}}
async function setMarketState(state){await kv(['SET',MARKET_STATE,JSON.stringify(state)])}
async function acquireCronLock(seconds=240){
  const r=await kv(['SET',CRON_LOCK,String(Date.now()),'NX','EX',String(seconds)]);return !!r;
}

module.exports={kvReady,kv,parseJSON,subId,ensureVapid,vapidSubject,saveSubscription,getSubscriptionByEndpoint,getSubscription,removeSubscription,listSubscriptions,sendPush,getMarketState,setMarketState,acquireCronLock};
