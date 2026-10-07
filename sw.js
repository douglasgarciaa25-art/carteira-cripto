const CACHE='cripto-radar-v11-adaptive-20261007-v1';
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

function bgKlineMetrics(rows){
 if(!Array.isArray(rows)||rows.length<3)return null;const last=rows[rows.length-1],close=Number(last?.[4]);if(!(close>0))return null;
 const ret=m=>{const i=Math.max(0,rows.length-1-m),b=Number(rows[i]?.[4]);return b>0?(close/b-1)*100:null};
 const vols=rows.slice(Math.max(0,rows.length-11),-1).map(x=>Number(x?.[7]??x?.[5])).filter(x=>Number.isFinite(x)&&x>=0),lv=Number(last?.[7]??last?.[5]),avg=vols.length?vols.reduce((a,b)=>a+b,0)/vols.length:0;
 return {r1:ret(1),r5:ret(5),r15:ret(15),vr:avg>0&&Number.isFinite(lv)?lv/avg:null,price:close};
}
async function bgTech(symbol){try{const r=await fetch('./api/market?kind=klines&pair='+encodeURIComponent(symbol+'USDT')+'&interval=1m&limit=20',{cache:'no-store',headers:{Accept:'application/json'}});if(!r.ok)throw Error('klines '+r.status);const j=await r.json();return bgKlineMetrics(j?.rows)}catch(e){return null}}
async function bgConfirm(key,active,score){
 const k='alarmv2:confirm:'+key,now=Date.now(),st=await dbGet(k)||{count:0,last:0};if(!active){await dbSet(k,{count:0,last:now});return false}
 const count=now-Number(st.last||0)<2*60*60*1000?Math.min(2,Number(st.count||0)+1):1;await dbSet(k,{count,last:now,score});return count>=2;
}
function bgRiskScore(w,t){let s=0,ch=Number(w.change24h)||0,liq=Number(w.liquidityPct)||0,share=Number(w.positionPct)||0;if(t){if(Number.isFinite(t.r1)&&t.r1<=-.7)s+=14;if(Number.isFinite(t.r1)&&t.r1<=-1.5)s+=10;if(Number.isFinite(t.r5)&&t.r5<=-1.6)s+=18;if(Number.isFinite(t.r5)&&t.r5<=-3)s+=10;if(Number.isFinite(t.r15)&&t.r15<=-2.5)s+=18;if(Number.isFinite(t.vr)&&t.vr>=1.5)s+=10;if(Number.isFinite(t.vr)&&t.vr>=2.5)s+=7}if(ch<=-4)s+=9;if(ch<=-8)s+=7;if(liq>=80)s+=12;else if(liq>=55)s+=8;else if(liq>=25)s+=4;s+=5;if(share>=20)s+=6;if(share>=35)s+=5;return Math.min(99,s)}
function bgOppScore(a,t){let s=0,ch=Number(a.change24h)||0,liq=Number(a.liquidityPct)||0,vol=Number(a.volume)||0;if(t){if(Number.isFinite(t.r1)&&t.r1>=.5)s+=12;if(Number.isFinite(t.r1)&&t.r1>=1.2)s+=8;if(Number.isFinite(t.r5)&&t.r5>=1.3)s+=18;if(Number.isFinite(t.r5)&&t.r5>=2.5)s+=8;if(Number.isFinite(t.r15)&&t.r15>=2.2)s+=17;if(Number.isFinite(t.vr)&&t.vr>=1.5)s+=13;if(Number.isFinite(t.vr)&&t.vr>=2.5)s+=7}if(ch>=.5&&ch<=12)s+=10;if(liq>=80)s+=12;else if(liq>=55)s+=8;if(vol>=1e8)s+=4;if(ch>15)s-=12;if(t&&Number.isFinite(t.r5)&&t.r5>7)s-=14;return Math.max(0,Math.min(99,s))}
async function runBackground(reason='sync'){
 const cfg=await dbGet('config');if(!cfg?.enabled)return;
 try{
  const r=await fetch('./api/market?kind=snapshot&bg=1',{cache:'no-store',headers:{Accept:'application/json'}});if(!r.ok)throw Error('market '+r.status);const snap=await r.json();
  const ctx=normalizeContext(cfg,snap),nowState={at:Date.now(),prices:{}};
  const walletTech=await Promise.all((ctx.wallet||[]).slice(0,8).map(async w=>({w,t:await bgTech(w.symbol)})));
  for(const {w,t} of walletTech){
   const a=(snap.assets||[]).find(x=>String(x.symbol).toUpperCase()===w.symbol);if(!a)continue;const p=Number(a.last)||0;nowState.prices[w.symbol]=p;const score=bgRiskScore(w,t),confirmed=await bgConfirm('risk:'+w.symbol,score>=70,score);
   if(cfg.notifications&&confirmed&&score>=70){const critical=score>=84,title=(critical?'🚨 CRÍTICO: ':'🟠 ALERTA: ')+w.symbol,body='Score '+score+'/100 • 1m '+(Number.isFinite(t?.r1)?t.r1.toFixed(2)+'%':'—')+' • 5m '+(Number.isFinite(t?.r5)?t.r5.toFixed(2)+'%':'—')+' • 15m '+(Number.isFinite(t?.r15)?t.r15.toFixed(2)+'%':'—')+' • revisar proteção da posição.';await notify('bg-alarm-v2-risk-'+(critical?'critical-':'strong-')+w.symbol,title,body,critical?4*60*1000:8*60*1000)}
  }
  const marketCandidates=(snap.assets||[]).filter(x=>Number(x.liquidityPct)>=55&&Number(x.change24h)>=.5&&Number(x.change24h)<=15).sort((a,b)=>(Number(b.change24h)||0)-(Number(a.change24h)||0)).slice(0,4);
  const marketTech=await Promise.all(marketCandidates.map(async a=>({a,t:await bgTech(String(a.symbol).toUpperCase())})));
  for(const {a,t} of marketTech){const symbol=String(a.symbol).toUpperCase(),score=bgOppScore(a,t),confirmed=await bgConfirm('opp:'+symbol,score>=82,score);if(cfg.notifications&&confirmed&&score>=82){const body='Score '+score+'/100 • 1m '+(Number.isFinite(t?.r1)?t.r1.toFixed(2)+'%':'—')+' • 5m '+(Number.isFinite(t?.r5)?t.r5.toFixed(2)+'%':'—')+' • 15m '+(Number.isFinite(t?.r15)?t.r15.toFixed(2)+'%':'—')+' • oportunidade confirmada pelo Radar.';await notify('bg-alarm-v2-opp-'+symbol,'🚀 OPORTUNIDADE: '+symbol,body,10*60*1000)}}
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
