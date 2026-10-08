/* Cripto Radar • heartbeat de segundo plano.
   Mantém o app acordado enquanto o navegador permitir. O Android pode suspender
   workers quando o app fica inativo por muito tempo; o Service Worker cobre
   eventos de sync/periodic sync quando disponíveis. */
let intervalMs = 8000;
let timer = null;
function pulse(){
  try { self.postMessage({type:'RADAR_TICK', at:Date.now()}); } catch(e) {}
}
function start(){
  if(timer) clearInterval(timer);
  timer = setInterval(pulse, intervalMs);
  pulse();
}
self.onmessage = (event) => {
  const d = event.data || {};
  if(d.type === 'RADAR_SET_INTERVAL'){
    const n = Number(d.ms);
    if(Number.isFinite(n)) intervalMs = Math.max(4000, Math.min(60000, n));
    start();
  } else if(d.type === 'RADAR_PING') pulse();
};
start();
try { self.postMessage({type:'RADAR_WORKER_READY', at:Date.now()}); } catch(e) {}
