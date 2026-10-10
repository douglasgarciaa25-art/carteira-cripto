const CACHE='cripto-radar-v17.6-candidate-balanced';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./notification-icon-192.png','./notification-icon-512.png','./badge-96.png','./ai-radar.js','./radar-worker.js'];
const DB_NAME='cripto-radar-bg-v2', DB_STORE='state';
const BG_TAG='radar-periodic', SYNC_TAG='radar-sync';

self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin===self.location.origin&&url.pathname.startsWith('/api/')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&url.origin===self.location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));
});

function dbOpen(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function dbGet(key){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readonly'),r=tx.objectStore(DB_STORE).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function dbSet(key,value){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}

async function broadcast(message){
  try{const ws=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const w of ws)w.postMessage({type:'RADAR_BG_STATUS',message})}catch(e){}
}
function pct(a,b){return a>0&&b>0?(b/a-1)*100:null}
function fmtPct(n){return Number.isFinite(n)?`${n>=0?'+':''}${n.toFixed(2)}%`:'—'}
function cleanSymbol(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').replace(/USDT$/,'').slice(0,16)}
async function fetchMarketSnapshot(){
  try{
    const u=new URL('/api/market',self.location.origin);u.searchParams.set('kind','snapshot');
    const r=await fetch(u.toString(),{cache:'no-store',headers:{Accept:'application/json'}});if(!r.ok)throw Error('api '+r.status);
    const j=await r.json();if(j?.ok&&Array.isArray(j.assets)&&j.assets.length)return j;
  }catch(e){}
  const sources=['https://data-api.binance.vision/api/v3/ticker/24hr','https://api.binance.com/api/v3/ticker/24hr'];
  for(const src of sources){
    try{
      const r=await fetch(src,{cache:'no-store'});if(!r.ok)continue;const rows=await r.json();if(!Array.isArray(rows))continue;
      const assets=rows.filter(x=>x?.symbol?.endsWith('USDT')&&Number(x.quoteVolume)>0).map(x=>({symbol:x.symbol.slice(0,-4),change24h:Number(x.priceChangePercent)||0,volume:Number(x.quoteVolume)||0,last:Number(x.lastPrice)||0,liquidityPct:0})).filter(x=>x.last>0);
      const sorted=[...assets].sort((a,b)=>a.volume-b.volume),n=sorted.length,rank=new Map(sorted.map((x,i)=>[x.symbol,n>1?Math.round(i/(n-1)*100):100]));
      assets.forEach(x=>x.liquidityPct=rank.get(x.symbol)||0);
      if(assets.length)return {ok:true,assets,source:'Binance direto',at:new Date().toISOString()};
    }catch(e){}
  }
  throw Error('mercado indisponível');
}
async function cooldownAllowed(key,minutes){
  const now=Date.now(),hist=(await dbGet('cooldowns'))||{},last=Number(hist[key]||0);if(now-last<minutes*60000)return false;
  hist[key]=now;const keys=Object.keys(hist).sort((a,b)=>hist[b]-hist[a]).slice(0,160),next={};for(const k of keys)next[k]=hist[k];await dbSet('cooldowns',next);return true;
}

async function fetchKlines(symbol,interval='15m',limit=80){
  const pair=cleanSymbol(symbol)+'USDT';if(pair==='USDT')throw Error('símbolo inválido');
  try{
    const u=new URL('/api/market',self.location.origin);u.searchParams.set('kind','klines');u.searchParams.set('pair',pair);u.searchParams.set('interval',interval);u.searchParams.set('limit',String(limit));
    const r=await fetch(u.toString(),{cache:'no-store',headers:{Accept:'application/json'}});if(r.ok){const j=await r.json();if(j?.ok&&Array.isArray(j.rows)&&j.rows.length>=40)return j.rows}
  }catch(e){}
  for(const base of ['https://data-api.binance.vision','https://api.binance.com']){
    try{const r=await fetch(`${base}/api/v3/klines?symbol=${encodeURIComponent(pair)}&interval=${encodeURIComponent(interval)}&limit=${Math.min(200,limit)}`,{cache:'no-store'});if(!r.ok)continue;const j=await r.json();if(Array.isArray(j)&&j.length>=40)return j}catch(e){}
  }
  throw Error('candles indisponíveis');
}
function ema(v,n){if(!v.length)return 0;const k=2/(n+1);let e=v[0];for(const x of v.slice(1))e=x*k+e*(1-k);return e}
function detectPullback(rows){
  if(!Array.isArray(rows)||rows.length<55)return null;const now=Date.now();let k=rows.filter(x=>{const ct=Number(x?.[6]);return !Number.isFinite(ct)||ct<=now+1500});if(k.length<50)return null;k=k.slice(-90);
  const close=k.map(x=>Number(x?.[4])),vol=k.map(x=>Number(x?.[5])||0),last=k.at(-1),lastClose=Number(last?.[4]),lastOpen=Number(last?.[1]);if(!(lastClose>0))return null;
  const e20=ema(close.slice(-70),20),e50=ema(close.slice(-90),50),lookback=8,prior=k.slice(Math.max(0,k.length-40),k.length-lookback);if(prior.length<20)return null;
  const resistance=Math.max(...prior.map(x=>Number(x?.[2])||0)),support=Math.min(...prior.map(x=>Number(x?.[3])||Infinity)),avgV=vol.slice(-28,-8).filter(x=>x>0),avg=avgV.length?avgV.reduce((a,b)=>a+b,0)/avgV.length:0;
  function build(side,level,bi){
    if(bi<0||bi>=k.length-2||!(level>0))return null;const after=k.slice(bi+1),bc=k[bi],bvol=Number(bc?.[5])||0;let rt=null;
    for(const c of after){const lo=Number(c?.[3]),hi=Number(c?.[2]),cl=Number(c?.[4]);if(side==='bull'){if(lo<=level*1.0045&&lo>=level*.994&&cl>=level*.997){rt=c;break}}else if(hi>=level*.9955&&hi<=level*1.006&&cl<=level*1.003){rt=c;break}}
    if(!rt)return null;const invalid=side==='bull'?after.some(c=>Number(c?.[4])<level*.992):after.some(c=>Number(c?.[4])>level*1.008);if(invalid)return null;
    const continuation=side==='bull'?lastClose>level*1.0015:lastClose<level*.9985;if(!continuation)return null;
    const ro=Number(rt?.[1]),rc=Number(rt?.[4]),rh=Number(rt?.[2]),rl=Number(rt?.[3]),body=Math.abs(rc-ro)||level*.0001,wick=side==='bull'?(Math.min(ro,rc)-rl):(rh-Math.max(ro,rc)),wickRatio=Math.max(0,wick/body),vr=avg>0?bvol/avg:1,dist=Math.abs((rc-level)/level)*100,trendOk=side==='bull'?e20>e50:e20<e50;
    let score=48;if(trendOk)score+=12;if(vr>=1)score+=7;if(vr>=1.5)score+=5;if(wickRatio>=.8)score+=7;if(wickRatio>=1.5)score+=4;if(dist<=.25)score+=7;if(side==='bull'&&lastClose>lastOpen)score+=5;if(side==='bear'&&lastClose<lastOpen)score+=5;score=Math.max(0,Math.min(96,Math.round(score)));if(score<68)return null;
    return{side,score,level,price:lastClose,volumeRatio:vr,candleTime:Number(last?.[0])||now,label:side==='bull'?'ALTA':'BAIXA'};
  }
  let bb=-1,sb=-1;for(let i=k.length-lookback;i<k.length-2;i++){const cl=Number(k[i]?.[4]);if(bb<0&&cl>resistance*1.0012)bb=i;if(sb<0&&cl<support*.9988)sb=i}
  const a=build('bull',resistance,bb),b=build('bear',support,sb);if(a&&b)return a.score>=b.score?a:b;return a||b||null;
}
async function confirmPullback(symbol,p){
  const all=(await dbGet('pullbackConfirm'))||{},key=symbol+':'+p.side,old=all[key]||{count:0,sample:0,seen:0};
  if(Number(old.sample)!==Number(p.candleTime)){old.count=(Date.now()-Number(old.seen||0)<55*60*1000)?Math.min(2,Number(old.count||0)+1):1;old.sample=Number(p.candleTime)||Date.now();old.seen=Date.now();all[key]=old}
  for(const [k,v] of Object.entries(all))if(Date.now()-Number(v.seen||0)>6*60*60*1000)delete all[k];await dbSet('pullbackConfirm',all);return{...p,confirmations:Number(old.count||1),confirmed:Number(old.count||1)>=2};
}
async function scanPullbacks(cfg,assets,watch){
  const held=(cfg?.context?.wallet||[]).map(x=>cleanSymbol(x.symbol)).filter(Boolean),top=[...assets].sort((a,b)=>(b.volume||0)-(a.volume||0)).slice(0,12).map(x=>cleanSymbol(x.symbol));
  const syms=[...new Set([...held,'BTC','ETH','SOL','BNB','LINK','SUI',...top])].filter(s=>watch.has(s)).slice(0,8);let sent=0;
  const jobs=await Promise.allSettled(syms.map(async s=>{const rows=await fetchKlines(s,'15m',80),raw=detectPullback(rows);if(!raw)return null;return{symbol:s,...await confirmPullback(s,raw)}}));
  for(const j of jobs){if(j.status!=='fulfilled'||!j.value)continue;const x=j.value;if(!x.confirmed||x.score<72)continue;const bull=x.side==='bull',mirror=cfg?.mirror||{},mirrorOn=mirror.mode==='alerts';let title=(bull?'↗️':'↘️')+' Falha de pullback: '+x.symbol;let body=`${x.label} • score técnico ${x.score}/100 • nível ${x.level.toPrecision(7)} • preço ${x.price.toPrecision(7)} • ${bull?'possível continuação da alta':'possível continuação da baixa'}`;if(mirrorOn){const cap=Number(cfg?.context?.portfolio?.totalBRL)||Number(mirror.userCapital)||100,riskPct=Math.max(.25,Math.min(2,Number(mirror.riskPct)||1)),stopPct=Math.max(.8,Math.min(4,Math.abs((x.price-x.level)/x.price)*100+.45)),allocPct=Math.max(2,Math.min(25,riskPct/stopPct*100)),alloc=cap*allocPct/100;title='🪞 Espelhamento: '+x.symbol;body=`${x.label} • ${x.score}/100 • simulação R$ ${alloc.toLocaleString('pt-BR',{maximumFractionDigits:2})} • risco ${riskPct.toLocaleString('pt-BR')}% • alvo técnico ~2R`}await notifyMarket((mirrorOn?'mirror-':'pullback-')+x.side+'-'+x.symbol,title,body);sent++;if(sent>=2)break}
  return sent;
}
async function notifyMarket(key,title,body){
  if(!(await cooldownAllowed(key, key.startsWith('fast-')?20:60)))return;
  await self.registration.showNotification(title,{body,icon:'./icon-192.png',badge:'./badge-96.png',tag:key,renotify:true,data:{url:'./'},vibrate:[180,80,180]});
}
async function scanConfiguredSignals(cfg){
  const opps=Array.isArray(cfg?.context?.opportunities)?cfg.context.opportunities:[];
  const good=opps.filter(x=>/good|confirm|forte|compra/i.test(String(x?.signalState||x?.signal||''))).slice(0,2);
  for(const x of good){const s=cleanSymbol(x.symbol);if(!s)continue;await notifyMarket('ctx-'+s,'🚀 Radar: oportunidade em '+s,String(x.reason||x.signal||'Sinal confirmado pelo Radar.').slice(0,220))}
}
async function runMarketScan(reason='background'){
  const cfg=(await dbGet('config'))||{};
  if(!cfg.enabled||!cfg.notifications){await broadcast('SW ativo • notificações desativadas');return}
  try{
    await scanConfiguredSignals(cfg);
    const snap=await fetchMarketSnapshot(),assets=Array.isArray(snap.assets)?snap.assets:[];
    const prev=(await dbGet('marketPrev'))||{at:0,prices:{}};const now=Date.now();
    const held=new Set((cfg?.context?.wallet||[]).map(x=>cleanSymbol(x.symbol)).filter(Boolean));
    const defaults=['BTC','ETH','BNB','SOL','XRP','DOGE','ADA','LINK','SUI','AVAX'];
    const topVol=[...assets].sort((a,b)=>(b.volume||0)-(a.volume||0)).slice(0,18).map(x=>cleanSymbol(x.symbol));
    const watch=new Set([...held,...defaults,...topVol]);
    const candidates=assets.filter(x=>watch.has(cleanSymbol(x.symbol))&&(Number(x.liquidityPct)||0)>=70).sort((a,b)=>(b.volume||0)-(a.volume||0));
    let sent=0;
    for(const x of candidates){
      if(sent>=3)break;const s=cleanSymbol(x.symbol),price=Number(x.last),change24=Number(x.change24h)||0,old=Number(prev.prices?.[s]);const move=pct(old,price);
      if(Number.isFinite(move)&&Math.abs(move)>=1.15){
        const up=move>0;await notifyMarket('fast-'+(up?'up-':'down-')+s,(up?'🚀 Alta rápida: ':'🔴 Queda rápida: ')+s,`${fmtPct(move)} desde a última checagem • 24h ${fmtPct(change24)} • fonte ${snap.source||'mercado'}`);sent++;continue;
      }
      if(Math.abs(change24)>=7.5){
        const up=change24>0;await notifyMarket('24h-'+(up?'up-':'down-')+s,(up?'🟢 Movimento forte: ':'🔴 Atenção no mercado: ')+s,`${fmtPct(change24)} em 24h • liquidez ${Math.round(Number(x.liquidityPct)||0)}/100`);sent++;
      }
    }
    const pullbackSent=await scanPullbacks(cfg,assets,watch).catch(()=>0);sent+=pullbackSent;
    const prices={};for(const x of assets){const s=cleanSymbol(x.symbol),p=Number(x.last);if(s&&p>0)prices[s]=p}
    await dbSet('marketPrev',{at:now,prices});await dbSet('lastScan',{at:now,reason,source:snap.source||'mercado',sent,pullbackSent});
    await broadcast(`mercado + pullback checados • ${new Date(now).toLocaleTimeString('pt-BR')} • ${sent} alerta(s)`);
  }catch(e){await dbSet('lastScan',{at:Date.now(),reason,error:String(e?.message||e)});await broadcast('SW ativo • mercado indisponível nesta checagem')}
}

self.addEventListener('message',e=>{
  const d=e.data||{};
  if(d.type==='RADAR_CONFIG')e.waitUntil((async()=>{await dbSet('config',d.payload||{});await broadcast('Worker + SW prontos para alertas')})());
  if(d.type==='RADAR_RUN_NOW')e.waitUntil(runMarketScan(d.reason||'manual'));
});
self.addEventListener('sync',e=>{if(e.tag===SYNC_TAG)e.waitUntil(runMarketScan('sync'))});
self.addEventListener('periodicsync',e=>{if(e.tag===BG_TAG)e.waitUntil(runMarketScan('periodic-sync'))});
self.addEventListener('push',e=>e.waitUntil((async()=>{
  let d={};try{d=e.data?.json?.()||{}}catch(_){d={body:e.data?.text?.()||''}}
  await self.registration.showNotification(d.title||'Cripto Radar',{body:d.body||'Novo alerta do mercado.',icon:'./icon-192.png',badge:'./badge-96.png',tag:d.tag||'radar-push',renotify:true,requireInteraction:!!d.requireInteraction,vibrate:[180,80,180],data:{url:d.url||'./',kind:d.kind||'market',symbol:d.symbol||null},actions:[{action:'open',title:'Abrir Radar'}]});
})()));
self.addEventListener('pushsubscriptionchange',e=>e.waitUntil((async()=>{
  try{
    const cfg=await fetch('./api/push-config',{cache:'no-store'}).then(r=>r.json());if(!cfg?.publicKey)return;
    const pad='='.repeat((4-cfg.publicKey.length%4)%4),b64=(cfg.publicKey+pad).replace(/-/g,'+').replace(/_/g,'/'),raw=atob(b64),key=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)key[i]=raw.charCodeAt(i);
    const sub=await self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
    await fetch('./api/push-subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscription:sub.toJSON()})});
  }catch(_){ }
})()));
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(async ws=>{const url=e.notification.data?.url||'./';if(ws[0]){await ws[0].focus();try{ws[0].navigate(url)}catch(_){ }return}return clients.openWindow(url)}))});
