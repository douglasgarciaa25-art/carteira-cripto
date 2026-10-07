/* Cripto Radar V11 — worker auxiliar de segundo plano.
   Mantém um heartbeat separado da UI enquanto o navegador permitir a execução. */
let intervalMs=4000;
let timer=null;
function start(){
  if(timer)clearInterval(timer);
  timer=setInterval(()=>postMessage({type:'RADAR_TICK',at:Date.now()}),intervalMs);
  postMessage({type:'RADAR_WORKER_READY',at:Date.now(),intervalMs});
}
onmessage=e=>{
  const d=e.data||{};
  if(d.type==='SET_INTERVAL'){
    const n=Number(d.ms);
    if(Number.isFinite(n)&&n>=3000&&n<=60000){intervalMs=n;start();}
  }else if(d.type==='PING'){
    postMessage({type:'RADAR_TICK',at:Date.now(),manual:true});
  }
};
start();
