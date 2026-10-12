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

// User-visible market events are localized on the server: push works even with the app closed.
const PUSH_TEXT={
 en:[['Push do servidor funcionando. Este canal continua disponível com o app fechado e a tela bloqueada.','Server Push is working. This channel remains available while the app is closed or the screen is locked.'],['Cripto Radar • Push real','Cripto Radar • Live Push'],['Teste automático recebido pelo servidor. Se você viu esta mensagem com o app fechado ou a tela bloqueada, o Push 24h está funcionando.','Automated test received. If this arrived while the app was closed or the screen locked, 24h Push is working.'],['Cripto Radar • tela bloqueada','Cripto Radar • locked screen'],['Movimento rápido:','Rapid move:'],['Queda rápida:','Rapid drop:'],['Movimento relevante:','Significant move:'],['Atenção no mercado:','Market alert:'],['desde a última varredura','since last scan'],['em 24h','over 24h'],['liquidez','liquidity'],['perfil','profile'],['Falha de pullback:','Failed pullback:'],['Confluência detectada pelo motor V18','Technical alignment detected by V18'],['Candidata técnica','Technical candidate'],['score técnico','technical score'],['nível','level'],['preço','price'],['possível continuação da alta','possible continuation higher'],['possível continuação da baixa','possible continuation lower'],['simulação','simulation'],['risco','risk'],['alvo técnico','technical target'],['Espelhamento:','Mirroring:'],['ALTA','UP'],['BAIXA','DOWN'],['SINAL FORTE DE COMPRA','STRONG BUY SIGNAL'],['COMPRA CONFIRMADA','CONFIRMED BUY'],['CANDIDATA A COMPRA','BUY CANDIDATE'],['Aguardando confirmação','Waiting for confirmation'],['mercado geral em baixa','broader market bearish'],['volume ainda baixo','volume remains low'],['risco técnico','technical risk'],['reserva','reserve'],['oportunidade em','opportunity in']],
 es:[['Push do servidor funcionando. Este canal continua disponível com o app fechado e a tela bloqueada.','Las notificaciones Push del servidor funcionan. Este canal sigue disponible con la app cerrada o la pantalla bloqueada.'],['Cripto Radar • Push real','Cripto Radar • Push real'],['Teste automático recebido pelo servidor. Se você viu esta mensagem com o app fechado ou a tela bloqueada, o Push 24h está funcionando.','Prueba automática recibida. Si llegó con la app cerrada o la pantalla bloqueada, Push 24 h funciona.'],['Cripto Radar • tela bloqueada','Cripto Radar • pantalla bloqueada'],['Movimento rápido:','Movimiento rápido:'],['Queda rápida:','Caída rápida:'],['Movimento relevante:','Movimiento relevante:'],['Atenção no mercado:','Atención al mercado:'],['desde a última varredura','desde el último análisis'],['em 24h','en 24 h'],['liquidez','liquidez'],['perfil','perfil'],['Falha de pullback:','Fallo de retroceso:'],['Confluência detectada pelo motor V18','Confluencia detectada por el motor V18'],['Candidata técnica','Candidata técnica'],['score técnico','puntuación técnica'],['nível','nivel'],['preço','precio'],['possível continuação da alta','posible continuación alcista'],['possível continuação da baixa','posible continuación bajista'],['simulação','simulación'],['risco','riesgo'],['alvo técnico','objetivo técnico'],['Espelhamento:','Replicación:'],['ALTA','ALZA'],['BAIXA','BAJA'],['SINAL FORTE DE COMPRA','SEÑAL FUERTE DE COMPRA'],['COMPRA CONFIRMADA','COMPRA CONFIRMADA'],['CANDIDATA A COMPRA','CANDIDATA A COMPRA'],['Aguardando confirmação','Esperando confirmación'],['mercado geral em baixa','mercado general bajista'],['volume ainda baixo','el volumen sigue bajo'],['risco técnico','riesgo técnico'],['reserva','reserva'],['oportunidade em','oportunidad en']]
};
function localizePush(payload,lang){
 if(!['en','es'].includes(lang))return {...payload,lang:'pt-BR'};
 const rows=[...PUSH_TEXT[lang]].sort((a,b)=>b[0].length-a[0].length);
 const convert=v=>{let out=String(v||'');for(const [pt,target] of rows)if(out.includes(pt))out=out.split(pt).join(target);return out};
 return {...payload,title:convert(payload.title),body:convert(payload.body),lang};
}

async function sendPush(req,record,payload){
  const vapid=await ensureVapid();webpush.setVapidDetails(vapidSubject(req),vapid.publicKey,vapid.privateKey);
  try{
    const result=await webpush.sendNotification(record.subscription,JSON.stringify(localizePush(payload,record?.language)),{TTL:240,urgency:'high'});
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
