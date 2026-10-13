/* Vistoria 24h: o servidor executa; este painel apenas consulta os resultados. */
(function(){'use strict';
const $=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let result=null,error='',busy=false,epoch=0,lastRead=0,controller=null;
const uid=()=>window.CriptoRadarAuth?.userId?.();
function shell(){
 if($('radarHealth'))return true;
 const anchor=$('radarTraderCloud21')||$('radarTrader20');if(!anchor)return false;
 const el=document.createElement('section');el.id='radarHealth';el.className='rt21';
 el.innerHTML='<div class="rt21-title"><span>🛠 VISTORIA 24H</span><b>Saúde do aplicativo</b><small>Verificação no servidor a cada 5 minutos, mesmo com o app fechado ou o celular bloqueado.</small></div><div id="radarHealthBody" aria-live="polite"></div><div class="rt21-actions"><button type="button" id="radarHealthCheck">Verificar agora</button></div><p class="rt21-muted">Inspeciona serviços, saldo Binance e simulação na nuvem. Não cria ordens nem altera configurações. Dados locais do celular não são inspecionados com o app fechado.</p>';
 anchor.insertAdjacentElement('afterend',el);$('radarHealthCheck').addEventListener('click',()=>refresh(true));return true;
}
function render(){
 if(!shell())return;
 const btn=$('radarHealthCheck');btn.disabled=busy||!uid();btn.textContent=busy?'Verificando…':'Verificar agora';
 const box=$('radarHealthBody');if(!uid()){box.innerHTML='<p>Entre na conta Radar para consultar sua vistoria.</p>';return;}
 const r=result?.report,at=Date.parse(result?.checked_at||''),age=Date.now()-at,stale=!Number.isFinite(at)||age>8*60000||age< -60000;
 let html=error?'<p role="alert">⚠ '+esc(error)+'</p>':'';
 if(!r){box.innerHTML=html+'<p>Aguardando a primeira vistoria do servidor. Você também pode tocar em Verificar agora.</p>';return;}
 const title=stale?'⚠ Relatório desatualizado — verifique a conexão ou o agendamento':r.status==='error'?'🔴 Problemas encontrados':r.status==='warning'?'🟡 Atenção necessária':'🟢 Sem falhas nos itens verificados';
 html+='<p><strong>'+title+'</strong></p><p>Última vistoria: '+esc(Number.isFinite(at)?new Date(at).toLocaleString('pt-BR'):'data inválida')+'</p>';
 for(const c of Array.isArray(r.checks)?r.checks:[])html+='<div class="rt21-section"><b>'+({ok:'✅',warning:'⚠',error:'🔴',info:'ℹ'}[c.status]||'ℹ')+' '+esc(c.name)+'</b><p>'+esc(c.detail)+'</p></div>';
 box.innerHTML=html;
}
async function refresh(manual=false){
 if(busy||document.visibilityState==='hidden')return;
 if(!uid()){result=null;render();return;}
 const account=uid(),run=epoch;busy=true;error='';controller=new AbortController();const active=controller,timeout=setTimeout(()=>active.abort(),45000);render();
 try{
  const conf=await fetch('./api/radar-auth-config',{cache:'no-store',signal:active.signal});if(!conf.ok)throw Error();const c=await conf.json();
  const token=await window.CriptoRadarAuth.getToken();if(!token||account!==uid()||run!==epoch)return;
  const response=await fetch(c.supabaseUrl+'/functions/v1/radar-health-worker',{method:manual?'POST':'GET',headers:{apikey:c.publicKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:manual?JSON.stringify({action:'check'}):undefined,cache:'no-store',signal:active.signal});
  const data=await response.json();if(!response.ok||!data.ok)throw Error();if(run!==epoch||account!==uid())return;
  result=data.health;lastRead=Date.now();
 }catch(_){if(run===epoch)error='Não foi possível consultar a vistoria. O resultado anterior pode estar desatualizado.';}
 finally{clearTimeout(timeout);if(run===epoch){busy=false;controller=null;render();}}
}
function start(){
 render();refresh();setTimeout(()=>{render();if(!result)refresh()},4000);
 setInterval(()=>{render();if(Date.now()-lastRead>=60000)refresh()},30000);
 window.addEventListener('criptoradar:authchange',()=>{epoch++;controller?.abort();controller=null;busy=false;result=null;error='';lastRead=0;render();refresh()});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){render();refresh()}});
 window.addEventListener('online',()=>refresh());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
