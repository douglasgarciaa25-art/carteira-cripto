const CACHE='cripto-radar-v12-bg-market-20261007-v6';
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
    const prices={};for(const x of assets){const s=cleanSymbol(x.symbol),p=Number(x.last);if(s&&p>0)prices[s]=p}
    await dbSet('marketPrev',{at:now,prices});await dbSet('lastScan',{at:now,reason,source:snap.source||'mercado',sent});
    await broadcast(`mercado checado • ${new Date(now).toLocaleTimeString('pt-BR')} • ${sent} alerta(s)`);
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
  await self.registration.showNotification(d.title||'Cripto Radar',{body:d.body||'Novo alerta do mercado.',icon:'./icon-192.png',badge:'./badge-96.png',tag:d.tag||'radar-push',renotify:true,data:{url:d.url||'./'}});
})()));
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws[0]?ws[0].focus():clients.openWindow(e.notification.data?.url||'./')))});
