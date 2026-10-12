const crypto=require('crypto');
const {acquireCronLock,listSubscriptions,saveSubscription,sendPush,getMarketState,setMarketState}=require('./push-server-lib');

function clean(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').replace(/USDT$/,'').slice(0,16)}
function pct(a,b){return a>0&&b>0?(b/a-1)*100:null}
function fmt(n){return Number.isFinite(n)?`${n>=0?'+':''}${n.toFixed(2)}%`:'—'}
function ema(v,n){if(!v.length)return 0;const k=2/(n+1);let e=v[0];for(const x of v.slice(1))e=x*k+e*(1-k);return e}

async function fetchJson(url,ms=8500){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{cache:'no-store',signal:c.signal,headers:{Accept:'application/json','User-Agent':'Cripto-Radar-V18.2'}});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}}
async function snapshot(){
 const sources=['https://data-api.binance.vision/api/v3/ticker/24hr','https://api.binance.com/api/v3/ticker/24hr'];
 for(const u of sources){try{const rows=await fetchJson(u);if(!Array.isArray(rows))continue;const assets=rows.filter(x=>x?.symbol?.endsWith('USDT')&&Number(x.quoteVolume)>0).map(x=>({symbol:x.symbol.slice(0,-4),change24h:Number(x.priceChangePercent)||0,volume:Number(x.quoteVolume)||0,last:Number(x.lastPrice)||0})).filter(x=>x.last>0);const sorted=[...assets].sort((a,b)=>a.volume-b.volume),n=sorted.length,rank=new Map(sorted.map((x,i)=>[x.symbol,n>1?Math.round(i/(n-1)*100):100]));assets.forEach(x=>x.liquidityPct=rank.get(x.symbol)||0);if(assets.length)return {assets,source:new URL(u).hostname}}catch(e){}}
 throw Error('Mercado indisponível');
}
async function klines(symbol,interval='15m',limit=80){const pair=clean(symbol)+'USDT';for(const base of ['https://data-api.binance.vision','https://api.binance.com']){try{const j=await fetchJson(`${base}/api/v3/klines?symbol=${encodeURIComponent(pair)}&interval=${encodeURIComponent(interval)}&limit=${limit}`);if(Array.isArray(j)&&j.length>=40)return j}catch(e){}}throw Error('Candles indisponíveis')}
function detectPullback(rows){
 if(!Array.isArray(rows)||rows.length<55)return null;const now=Date.now();let k=rows.filter(x=>{const ct=Number(x?.[6]);return !Number.isFinite(ct)||ct<=now+1500});if(k.length<50)return null;k=k.slice(-90);
 const close=k.map(x=>Number(x?.[4])),vol=k.map(x=>Number(x?.[5])||0),last=k.at(-1),lastClose=Number(last?.[4]),lastOpen=Number(last?.[1]);if(!(lastClose>0))return null;
 const e20=ema(close.slice(-70),20),e50=ema(close.slice(-90),50),lookback=8,prior=k.slice(Math.max(0,k.length-40),k.length-lookback);if(prior.length<20)return null;
 const resistance=Math.max(...prior.map(x=>Number(x?.[2])||0)),support=Math.min(...prior.map(x=>Number(x?.[3])||Infinity)),avgV=vol.slice(-28,-8).filter(x=>x>0),avg=avgV.length?avgV.reduce((a,b)=>a+b,0)/avgV.length:0;
 function build(side,level,bi){if(bi<0||bi>=k.length-2||!(level>0))return null;const after=k.slice(bi+1),bc=k[bi],bvol=Number(bc?.[5])||0;let rt=null;for(const c of after){const lo=Number(c?.[3]),hi=Number(c?.[2]),cl=Number(c?.[4]);if(side==='bull'){if(lo<=level*1.0045&&lo>=level*.994&&cl>=level*.997){rt=c;break}}else if(hi>=level*.9955&&hi<=level*1.006&&cl<=level*1.003){rt=c;break}}if(!rt)return null;const invalid=side==='bull'?after.some(c=>Number(c?.[4])<level*.992):after.some(c=>Number(c?.[4])>level*1.008);if(invalid)return null;const continuation=side==='bull'?lastClose>level*1.0015:lastClose<level*.9985;if(!continuation)return null;const ro=Number(rt?.[1]),rc=Number(rt?.[4]),rh=Number(rt?.[2]),rl=Number(rt?.[3]),body=Math.abs(rc-ro)||level*.0001,wick=side==='bull'?(Math.min(ro,rc)-rl):(rh-Math.max(ro,rc)),wickRatio=Math.max(0,wick/body),vr=avg>0?bvol/avg:1,dist=Math.abs((rc-level)/level)*100,trendOk=side==='bull'?e20>e50:e20<e50;let score=48;if(trendOk)score+=12;if(vr>=1)score+=7;if(vr>=1.5)score+=5;if(wickRatio>=.8)score+=7;if(wickRatio>=1.5)score+=4;if(dist<=.25)score+=7;if(side==='bull'&&lastClose>lastOpen)score+=5;if(side==='bear'&&lastClose<lastOpen)score+=5;score=Math.max(0,Math.min(96,Math.round(score)));if(score<68)return null;return{side,score,level,price:lastClose,candleTime:Number(last?.[0])||now,label:side==='bull'?'ALTA':'BAIXA'};}
 let bb=-1,sb=-1;for(let i=k.length-lookback;i<k.length-2;i++){const cl=Number(k[i]?.[4]);if(bb<0&&cl>resistance*1.0012)bb=i;if(sb<0&&cl<support*.9988)sb=i}const a=build('bull',resistance,bb),b=build('bear',support,sb);if(a&&b)return a.score>=b.score?a:b;return a||b||null;
}
function allowed(state,key,mins,commit=false){const now=Date.now(),last=Number(state.cooldowns?.[key]||0);if(now-last<mins*60000)return false;if(commit){state.cooldowns=state.cooldowns||{};state.cooldowns[key]=now}return true}
function prune(state){const now=Date.now();state.cooldowns=Object.fromEntries(Object.entries(state.cooldowns||{}).filter(([,v])=>now-Number(v)<36*3600000).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,1200));state.pullbacks=Object.fromEntries(Object.entries(state.pullbacks||{}).filter(([,v])=>now-Number(v?.seen||0)<8*3600000));}
function confirmPullback(state,symbol,p){state.pullbacks=state.pullbacks||{};const key=symbol+':'+p.side,old=state.pullbacks[key]||{count:0,sample:0,seen:0};if(Number(old.sample)!==Number(p.candleTime)){old.count=(Date.now()-Number(old.seen||0)<60*60000)?Math.min(2,Number(old.count||0)+1):1;old.sample=Number(p.candleTime);old.seen=Date.now();state.pullbacks[key]=old}return{...p,confirmations:Number(old.count||1),confirmed:Number(old.count||1)>=2}}
function userWatch(rec,assets){const held=(Array.isArray(rec?.context?.wallet)?rec.context.wallet:[]).map(x=>clean(x?.symbol)).filter(Boolean),defaults=['BTC','ETH','BNB','SOL','XRP','DOGE','ADA','LINK','SUI','AVAX'],top=[...assets].sort((a,b)=>b.volume-a.volume).slice(0,16).map(x=>clean(x.symbol));return new Set([...held,...defaults,...top])}
function mirrorBody(rec,x){const mirror=rec?.mirror||{},cap=Number(rec?.context?.portfolio?.totalBRL)||Number(mirror.userCapital)||100,riskPct=Math.max(.25,Math.min(2,Number(mirror.riskPct)||1)),stopPct=Math.max(.8,Math.min(4,Math.abs((x.price-x.level)/x.price)*100+.45)),allocPct=Math.max(2,Math.min(25,riskPct/stopPct*100)),alloc=cap*allocPct/100;return `${x.label} • ${x.score}/100 • simulação R$ ${alloc.toLocaleString('pt-BR',{maximumFractionDigits:2})} • risco ${riskPct.toLocaleString('pt-BR')}% • alvo técnico ~2R`}


function pushProfile(rec){
 const mode=String(rec?.prefs?.alertFrequency||'important');
 if(mode==='all'||mode==='frequent')return {fastMove:.28,fastCooldown:12,dayMove:3.8,dayCooldown:45,pullbackScore:68,pullbackCooldown:35,maxPerRun:3};
 if(mode==='balanced')return {fastMove:.38,fastCooldown:15,dayMove:4.8,dayCooldown:55,pullbackScore:72,pullbackCooldown:45,maxPerRun:3};
 return {fastMove:.50,fastCooldown:20,dayMove:6.0,dayCooldown:70,pullbackScore:76,pullbackCooldown:55,maxPerRun:2};
}
function contextSignal(rec){
 const seen=Date.parse(rec?.lastSeenAt||rec?.updatedAt||'');
 const age=Date.now()-seen;
 if(!Number.isFinite(seen)||age< -60000||age>60*60*1000)return [];
 const xs=Array.isArray(rec?.context?.opportunities)?rec.context.opportunities:[];
 return xs.filter(x=>{
   // Never infer confirmation from a label or a high score: a candidate remains a candidate.
   const st=String(x?.signalState||x?.state||'').trim().toLowerCase();
   const label=String(x?.label||x?.signal||'').toLowerCase();
   const sc=Number(x?.score??x?.confidence??0);
   return ['confirmed','strong','good','confirmado','confirmada'].includes(st)
      && !/candidat|aguardando|waiting|pending|pendente|watch|observ/i.test(label)
      && Number.isFinite(sc)&&sc>=72&&sc<=100;
 }).sort((a,b)=>Number(b?.score??b?.confidence??0)-Number(a?.score??a?.confidence??0)).slice(0,2);
}

module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 // When a cron secret is configured, accept a bearer token from the scheduler.
 // Existing public cron URLs remain compatible until the operator configures it.
 const secret=String(process.env.CRON_SECRET||'');
 if(secret){
  const auth=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');
  const a=crypto.createHash('sha256').update(auth).digest(),b=crypto.createHash('sha256').update(secret).digest();
  if(!auth||!crypto.timingSafeEqual(a,b))return res.status(401).json({ok:false,error:'unauthorized_cron'});
 }
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
 try{
  if(!(await acquireCronLock(50)))return res.status(200).json({ok:true,skipped:true,reason:'scan já executado recentemente'});
  const subs=await listSubscriptions();if(!subs.length){
   const state=await getMarketState();state.at=Date.now();state.lastAttemptAt=state.at;state.source='no-subscribers';state.lastScanStatus='ok';state.lastFailedCount=0;state.lastDataErrors=0;delete state.lastScanError;
   await setMarketState(state);
   return res.status(200).json({ok:true,subscriptions:0,sent:0,at:new Date(state.at).toISOString(),source:state.source});
  }
  const snap=await snapshot(),assets=snap.assets,state=await getMarketState();state.cooldowns=state.cooldowns||{};state.pullbacks=state.pullbacks||{};const oldPrices=state.prevPrices||{},newPrices={};for(const x of assets)newPrices[clean(x.symbol)]=Number(x.last)||0;
  const kcache=new Map();let sent=0,failed=0,dataErrors=0;
  for(const rec of subs){
   const prof=pushProfile(rec);let userSent=0;
   if(rec.pendingLockedTest){const r=await sendPush(req,rec,{title:'🔒 Cripto Radar • tela bloqueada',body:'Teste automático recebido pelo servidor. Se você viu esta mensagem com o app fechado ou a tela bloqueada, o Push 24h está funcionando.',tag:'radar-locked-test',url:'./',kind:'locked-test'});if(r.ok){sent++;userSent++;await saveSubscription({...rec,pendingLockedTest:false,pendingLockedTestSentAt:new Date().toISOString()})}else failed++;}
   const watch=userWatch(rec,assets),cand=assets.filter(x=>watch.has(clean(x.symbol))&&Number(x.liquidityPct)>=70).sort((a,b)=>b.volume-a.volume);
   for(const x of (rec?.prefs?.market===false?[]:cand)){if(userSent>=prof.maxPerRun)break;const s=clean(x.symbol),price=Number(x.last),move=pct(Number(oldPrices[s]),price),ch=Number(x.change24h)||0;
    const fastKey=rec.id+':fast:'+s+(move>0?':up':':down');
    if(Number.isFinite(move)&&Math.abs(move)>=prof.fastMove&&allowed(state,fastKey,prof.fastCooldown)){const r=await sendPush(req,rec,{title:(move>0?'🚀 Movimento rápido: ':'🔴 Queda rápida: ')+s,body:`${fmt(move)} desde a última varredura • 24h ${fmt(ch)} • liquidez ${Math.round(Number(x.liquidityPct)||0)}/100`,tag:'server-fast-'+s,url:'./#urgentRadarCard',kind:'market-fast',symbol:s});if(r.ok){allowed(state,fastKey,prof.fastCooldown,true);sent++;userSent++}else failed++;continue}
    const dayKey=rec.id+':24h:'+s+(ch>0?':up':':down');
    if(Math.abs(ch)>=prof.dayMove&&Number(x.liquidityPct)>=75&&allowed(state,dayKey,prof.dayCooldown)){const r=await sendPush(req,rec,{title:(ch>0?'🟢 Movimento relevante: ':'🔴 Atenção no mercado: ')+s,body:`${fmt(ch)} em 24h • liquidez ${Math.round(Number(x.liquidityPct)||0)}/100 • perfil ${String(rec?.prefs?.alertFrequency||'important')}`,tag:'server-24h-'+s,url:'./#urgentRadarCard',kind:'market-24h',symbol:s});if(r.ok){allowed(state,dayKey,prof.dayCooldown,true);sent++;userSent++}else failed++;}
   }
   if(rec?.prefs?.portfolio!==false&&userSent<prof.maxPerRun){
    for(const x of contextSignal(rec)){if(userSent>=prof.maxPerRun)break;const s=clean(x.symbol);if(!s)continue;const sc=Math.round(Number(x.score??x.confidence??0));const key=rec.id+':ctx-v18:'+s; if(!allowed(state,key,90))continue;
     const r=await sendPush(req,rec,{title:'🧠 Radar V18: '+s,body:`${String(x.label||x.signal||'Compra confirmada')} • ${sc}/100 • ${String(x.reason||x.why||'Confluência detectada pelo motor V18').slice(0,150)}`,tag:'server-v18-'+s,url:'./#marketIntelligenceCard',kind:'v18-signal',symbol:s});
     if(r.ok){allowed(state,key,90,true);sent++;userSent++}else failed++;
    }
   }
   const held=(Array.isArray(rec?.context?.wallet)?rec.context.wallet:[]).map(x=>clean(x?.symbol)).filter(Boolean),tops=[...assets].sort((a,b)=>b.volume-a.volume).slice(0,8).map(x=>clean(x.symbol)),syms=[...new Set([...held,'BTC','ETH','SOL','BNB','LINK','SUI',...tops])].filter(s=>watch.has(s)).slice(0,8);
   for(const s of (rec?.prefs?.pullback===false?[]:syms)){if(userSent>=prof.maxPerRun)break;try{let rows=kcache.get(s);if(!rows){rows=await klines(s);kcache.set(s,rows)}const raw=detectPullback(rows);if(!raw)continue;const p=confirmPullback(state,s,raw);if(!p.confirmed||p.score<prof.pullbackScore)continue;const k=rec.id+':pullback:'+s+':'+p.side;if(!allowed(state,k,prof.pullbackCooldown))continue;const mirrorOn=rec?.mirror?.mode==='alerts';const r=await sendPush(req,rec,{title:mirrorOn?'🪞 Espelhamento: '+s:(p.side==='bull'?'↗️ Falha de pullback: ':'↘️ Falha de pullback: ')+s,body:mirrorOn?mirrorBody(rec,p):`${p.label} • score técnico ${p.score}/100 • nível ${Number(p.level).toPrecision(7)} • preço ${Number(p.price).toPrecision(7)} • possível continuação ${p.side==='bull'?'da alta':'da baixa'}`,tag:'server-pullback-'+s+'-'+p.side,url:'./#urgentRadarCard',kind:'pullback',symbol:s});if(r.ok){allowed(state,k,prof.pullbackCooldown,true);sent++;userSent++}else failed++;}catch(e){dataErrors++}
   }
  }
  state.prevPrices=newPrices;state.at=Date.now();state.lastAttemptAt=state.at;state.lastScanStatus=(failed||dataErrors)?'partial':'ok';state.lastFailedCount=failed;state.lastDataErrors=dataErrors;state.lastScanError=failed?'push_delivery_failed':dataErrors?'market_candles_unavailable':undefined;state.source=snap.source;prune(state);await setMarketState(state);
  return res.status(200).json({ok:true,subscriptions:subs.length,sent,failed,dataErrors,at:new Date().toISOString(),source:snap.source});
 }catch(e){
  // A scheduler may run yet fail to fetch market data; preserve that distinction.
  try{const state=await getMarketState();state.lastAttemptAt=Date.now();state.lastScanStatus='failed';state.lastScanError=String(e?.message||e).slice(0,120);await setMarketState(state)}catch(_){}
  return res.status(500).json({ok:false,error:'scan_failed',at:new Date().toISOString()});
 }
};
