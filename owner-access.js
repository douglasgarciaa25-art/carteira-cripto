/* Cripto Radar — licença de desenvolvedor, verificada no servidor.
   Configurar as variáveis RADAR_OWNER_ACCESS_CODE e RADAR_OWNER_SESSION_SECRET
   no ambiente Vercel. Nunca colocá-las nos arquivos públicos ou no GitHub. */
'use strict';
const crypto=require('crypto');
const COOKIE='radar_owner_access';
const LIFE=365*24*60*60;
const b64=x=>Buffer.from(x).toString('base64url');
const secret=()=>String(process.env.RADAR_OWNER_SESSION_SECRET||'');
const configured=()=>String(process.env.RADAR_OWNER_ACCESS_CODE||'').length>=24 && secret().length>=32;
function safeEqual(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function sign(data){return crypto.createHmac('sha256',secret()).update(data).digest('base64url')}
function mint(){const now=Math.floor(Date.now()/1000);const payload=b64(JSON.stringify({role:'developer',iat:now,exp:now+LIFE}));return payload+'.'+sign(payload)}
function valid(token){
 if(!configured()||typeof token!=='string'||token.length>1500)return false;
 const items=token.split('.');if(items.length!==2||!safeEqual(items[1],sign(items[0])))return false;
 try{const p=JSON.parse(Buffer.from(items[0],'base64url').toString('utf8'));const now=Math.floor(Date.now()/1000);
   return p.role==='developer'&&Number.isInteger(p.iat)&&Number.isInteger(p.exp)&&p.iat<=now&&p.exp>now&&p.exp-p.iat<=LIFE;
 }catch(e){return false}
}
function cookies(req){const h=String(req.headers?.cookie||'');const out={};for(const field of h.split(';')){const k=field.indexOf('=');if(k<=0)continue;const name=field.slice(0,k).trim();if(name!==COOKIE)continue;try{out[name]=decodeURIComponent(field.slice(k+1).trim())}catch(e){out[name]=''}}return out}
function cookieLine(value,maxAge){const secure=(process.env.VERCEL==='1'||process.env.NODE_ENV==='production')?'; Secure':'';return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='GET'){
   if(!configured())return res.status(200).json({ok:true,configured:false,owner:false});
   return res.status(200).json({ok:true,configured:true,owner:valid(cookies(req)[COOKIE])});
 }
 if(req.method==='DELETE'){
   res.setHeader('Set-Cookie',cookieLine('',0));
   return res.status(200).json({ok:true,owner:false});
 }
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'method_not_allowed'});
 if(!configured())return res.status(503).json({ok:false,error:'developer_access_not_configured'});
 let body=req.body||{};
 if(typeof body==='string'){try{body=JSON.parse(body)}catch(e){body={}}}
 const input=String(body?.code||'');
 if(input.length<24||input.length>256)return res.status(401).json({ok:false,error:'invalid_developer_code'});
 // Hashes have fixed length, and comparison is timing safe.
 const expected=crypto.createHash('sha256').update(process.env.RADAR_OWNER_ACCESS_CODE).digest('hex');
 const given=crypto.createHash('sha256').update(input).digest('hex');
 if(!safeEqual(expected,given))return res.status(401).json({ok:false,error:'invalid_developer_code'});
 res.setHeader('Set-Cookie',cookieLine(mint(),LIFE));
 return res.status(200).json({ok:true,owner:true,role:'developer'});
};

// Checagem de sessão para endpoints privados. Não expõe a credencial no navegador.
module.exports.isOwnerRequest=req=>configured()&&valid(cookies(req)[COOKIE]);
