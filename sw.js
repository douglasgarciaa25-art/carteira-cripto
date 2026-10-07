const CACHE='cripto-radar-v11-background-20261007-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./ai-radar.js','./radar-worker.js'];
const DB='cripto-radar-background',STORE='kv';

function dbOpen(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function dbGet(key){try{const db=await dbOpen();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}catch(e){return null}}
async function dbSet(key,val){try{const db=await dbOpen();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(val,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch(e){}}
async function clientsStatus(message){try{for(const c of await self.clients.matchAll({type:'window',includeUncontrolled:true}))c.postMessage({type:'RADAR_BG_STATUS',message})}catch(e){}}

self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();await clientsStatus('SW atualizado • segundo plano pronto')})()));

self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin===self.location.origin&&url.pathname.startsWith('/api/')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return r}).catch(()=>caches.match('./index.html')));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>{if(r.ok&&url.origin===self.location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));
});

async function canNotify(key,cooldown){
 const now=Date.now(),k='notify:'+key,last=Number(await dbGet(k)||0);if(now-last<cooldown)return false;await dbSet(k,now);return true;
}
async function notify(key,title,body,cooldown=15*60*1000){
 if(!(await canNotify(key,cooldown)))return;
 try{await self.registration.showNotification(title,{body,icon:'./icon-192.png',badge:'./icon-192.png',tag:key,renotify:true,data:{url:'./'}})}catch(e){}
}
function normalizeContext(cfg,snap){
 const ctx=cfg?.context||{},assets=Array.isArray(snap?.assets)?snap.assets:[],map=new Map(assets.map(x=>[String(x.symbol||'').toUpperCase(),x])),brl=Number(snap?.usdbrl)||0;
 const wallet=(Array.isArray(ctx.wallet)?ctx.wallet:[]).map(w=>{const symbol=String(w.symbol||'').toUpperCase(),a=map.get(symbol),priceBRL=a&&brl?Number(a.last)*brl:Number(w.priceBRL)||0,qty=Number(w.qty)||0;return {...w,symbol,qty,priceBRL,valueBRL:priceBRL*qty,change24h:a?Number(a.change24h)||0:Number(w.change24h)||0,volume24h:a?Number(a.volume)||0:Number(w.volume24h)||0,liquidityPct:a?Number(a.liquidityPct)||0:Number(w.liquidityPct)||0,dataFresh:!snap?.stale}});
 const total=wallet.reduce((a,x)=>a+(Number(x.valueBRL)||0),0);wallet.forEach(w=>w.positionPct=total?100*w.valueBRL/total:0);
 return {...ctx,wallet,portfolio:{...(ctx.portfolio||{}),totalBRL:total},clientAt:new Date().toISOString()};
}
async function runBackground(reason='sync'){
 const cfg=await dbGet('config');if(!cfg?.enabled)return;
 try{
  const r=await fetch('./api/market?kind=snapshot&bg=1',{cache:'no-store',headers:{Accept:'application/json'}});if(!r.ok)throw Error('market '+r.status);const snap=await r.json();
  const ctx=normalizeContext(cfg,snap),prev=await dbGet('last-market')||{},nowState={at:Date.now(),prices:{}};
  for(const w of ctx.wallet||[]){
   const a=(snap.assets||[]).find(x=>String(x.symbol).toUpperCase()===w.symbol);if(!a)continue;const p=Number(a.last)||0,ch=Number(a.change24h)||0;nowState.prices[w.symbol]=p;
   const old=Number(prev?.prices?.[w.symbol])||0,move=old>0?(p/old-1)*100:null;
   if(cfg.notifications&&ch<=-6)await notify('bg-risk-'+w.symbol,'🚨 '+w.symbol+' — risco forte',ch.toFixed(2)+'% em 24h. Radar verificou em segundo plano.',10*60*1000);
   if(cfg.notifications&&Number.isFinite(move)&&Math.abs(move)>=2.5)await notify('bg-move-'+w.symbol,(move<0?'🔴 ':'🚀 ')+w.symbol+' — movimento rápido',(move>=0?'+':'')+move.toFixed(2)+'% desde a última leitura em segundo plano.',5*60*1000);
  }
  await dbSet('last-market',nowState);
  try{
   const aiRes=await fetch('./api/ai',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'Atualize a análise da minha carteira em segundo plano',context:ctx})});
   if(aiRes.ok){const ai=await aiRes.json();await dbSet('last-ai',{at:Date.now(),ai});if(cfg.notifications&&ai?.portfolioPlan?.items){for(const x of ai.portfolioPlan.items.slice(0,8)){const action=String(x.action||'').toUpperCase(),conf=Number(x.confidence)||0;if(/VENDER|REDUZIR/.test(action))await notify('bg-ai-sell-'+x.symbol,'🔴 '+x.symbol+' — IA pede revisão',action+' • confiança '+conf+'/100',15*60*1000);else if(/APORTAR|COMPRA CONFIRMADA/.test(action)&&conf>=65)await notify('bg-ai-buy-'+x.symbol,'🟢 '+x.symbol+' — entrada confirmada',action+' • confiança '+conf+'/100',15*60*1000)}}}
  }catch(e){}
  await dbSet('last-run',{at:Date.now(),reason});await clientsStatus('ativo • última leitura '+new Date().toLocaleTimeString('pt-BR'));
 }catch(e){await dbSet('last-error',{at:Date.now(),error:String(e?.message||e)});await clientsStatus('aguardando rede • proteção preparada')}
}

self.addEventListener('message',e=>{
 const d=e.data||{};
 if(d.type==='RADAR_CONFIG')e.waitUntil(dbSet('config',d.payload||{}));
 else if(d.type==='RADAR_RUN_NOW')e.waitUntil(runBackground(d.reason||'message'));
 else if(d.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('sync',e=>{if(e.tag==='radar-sync')e.waitUntil(runBackground('background-sync'))});
self.addEventListener('periodicsync',e=>{if(e.tag==='radar-periodic')e.waitUntil(runBackground('periodic-sync'))});
self.addEventListener('push',e=>{e.waitUntil((async()=>{let d={};try{d=e.data?.json?.()||{}}catch(x){d={body:e.data?.text?.()||''}}await self.registration.showNotification(d.title||'Cripto Radar',{body:d.body||'Novo alerta do Radar.',icon:'./icon-192.png',badge:'./icon-192.png',tag:d.tag||'radar-push',data:{url:d.url||'./'}})})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws[0]?ws[0].focus():clients.openWindow(e.notification?.data?.url||'./')))});
