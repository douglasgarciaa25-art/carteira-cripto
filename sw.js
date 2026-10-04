const CACHE='cripto-radar-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request)));
});
self.addEventListener('push',e=>{
 let d={title:'Cripto Radar',body:'Novo alerta do Radar.',url:'./'};
 try{if(e.data)d={...d,...e.data.json()};}catch(err){if(e.data)d.body=e.data.text();}
 e.waitUntil(self.registration.showNotification(d.title||'Cripto Radar',{body:d.body||'Novo alerta do Radar.',icon:d.icon||'./icon.svg',badge:d.badge||'./icon.svg',tag:d.tag||'cripto-radar',renotify:true,data:{url:d.url||'./'}}));
});
self.addEventListener('notificationclick',e=>{
 e.notification.close();
 const target=e.notification.data?.url||'./';
 e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
  for(const w of ws){if('navigate'in w)w.navigate(target).catch(()=>{});if('focus'in w)return w.focus();}
  return clients.openWindow?clients.openWindow(target):undefined;
 }));
});
