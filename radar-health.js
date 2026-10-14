/* Vistoria 24h: o servidor executa; este painel apenas consulta os resultados. */
(function(){'use strict';
const $=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let result=null,error='',busy=false,epoch=0,lastRead=0,controller=null;
const uid=()=>window.CriptoRadarAuth?.userId?.();
function summary(data,problem='',online=true,now=Date.now()){
 const r=data?.report,at=Date.parse(data?.checked_at||''),checks=Array.isArray(r?.checks)?r.checks:[];
 if(!online)return {tone:'warning',title:'Sem conexão neste aparelho',hint:'A vistoria continua no servidor. Reconecte para consultar o resultado.'};
 if(problem)return {tone:'warning',title:'Não foi possível confirmar o estado atual',hint:problem};
 if(!r)return {tone:'info',title:'Aguardando primeira vistoria',hint:'Toque em Verificar agora ou aguarde o próximo ciclo do servidor.'};
 if(!Number.isFinite(at)||at>now+60000||now-at>480000)return {tone:'warning',title:'Resultado desatualizado',hint:'Toque em Verificar agora. Se persistir, o serviço ou o agendamento pode estar indisponível.'};
 if(!['ok','warning','error'].includes(r.status)||!checks.length||checks.some(c=>!c||!['ok','warning','error','info'].includes(c.status)))return {tone:'warning',title:'Resultado incompleto',hint:'Faça uma nova verificação para confirmar o estado do app.'};
 if(r.status==='error'||checks.some(c=>c.status==='error'))return {tone:'error',title:'Problemas encontrados',hint:'Confira primeiro os itens em vermelho abaixo.'};
 if(r.status==='warning'||checks.some(c=>c.status==='warning'))return {tone:'warning',title:'Atenção necessária',hint:'Confira os avisos abaixo antes de usar a simulação.'};
 return {tone:'ok',title:'Verificações concluídas',hint:'Nenhuma falha nos itens verificados. Atualização automática no servidor a cada 5 minutos.'};
}
function guidance(c){
 if(!c||!['error','warning'].includes(c.status))return '';
 if(c.name==='Conexão e saldo Binance')return 'Na seção Binance, consulte o saldo e confira a conexão da sua conta.';
 if(c.name==='Robô na nuvem')return /emergência/i.test(c.detail)?'Confira a parada de emergência. Só rearme quando você decidir.':'Confira a última execução no painel do robô na nuvem.';
 if(c.name==='Retirada real')return 'Confira o ajuste pendente no simulador; o saldo virtual pode ser diferente do saldo real.';
 if(c.name==='Contabilidade e ordens fictícias'||c.name==='Base do simulador')return 'Revise o simulador na nuvem antes de novas operações. Preserve o histórico para análise.';
 return 'Tente Verificar agora. Se persistir, envie uma captura deste painel para análise.';
}
function shell(){
 if($('radarHealth'))return true;
 const anchor=$('healthWorkspace')||$('radarTraderCloud21')||$('radarTrader20');if(!anchor)return false;
 const el=document.createElement('section');el.id='radarHealth';el.className='rt21';
 el.innerHTML='<div class="rt21-title"><span>🛠 VISTORIA 24H</span><b>Saúde do aplicativo</b><small>Verificação no servidor a cada 5 minutos, mesmo com o app fechado ou o celular bloqueado.</small></div><div id="radarHealthBody" aria-live="polite"></div><div class="rt21-actions"><button type="button" id="radarHealthCheck">Verificar agora</button></div><p class="rt21-muted">Inspeciona serviços, arquivos do app, saldo Binance e simulação na nuvem. O horário exibido é do seu aparelho. Dados locais e todas as interações das telas não são cobertos por esta vistoria.</p>';
 const host=$('healthWorkspace');if(host)host.appendChild(el);else anchor.insertAdjacentElement('afterend',el);$('radarHealthCheck').addEventListener('click',()=>refresh(true));return true;
}
function render(){
 if(!shell())return;
 const btn=$('radarHealthCheck');btn.disabled=busy||!uid()||navigator.onLine===false;btn.textContent=busy?'Verificando…':'Verificar agora';
 const box=$('radarHealthBody');if(!uid()){box.innerHTML='<p>Entre na conta Radar para consultar sua vistoria.</p>';return;}
 const r=result?.report,at=Date.parse(result?.checked_at||''),state=summary(result,error,navigator.onLine!==false);
 let html='<div class="rh-summary rh-'+state.tone+'"><strong>'+esc(state.title)+'</strong><p>'+esc(state.hint)+'</p></div>';
 if(Number.isFinite(at))html+='<p class="rh-time">Última vistoria: '+esc(new Date(at).toLocaleString('pt-BR'))+' • há '+Math.max(0,Math.floor((Date.now()-at)/60000))+' min</p>';
 const order={error:0,warning:1,info:2,ok:3};
 for(const c of (Array.isArray(r?.checks)?r.checks:[]).filter(c=>c&&typeof c==='object').slice().sort((a,b)=>(order[a.status]??4)-(order[b.status]??4)))html+='<div class="rt21-section rh-check"><b>'+({ok:'✅',warning:'⚠',error:'🔴',info:'ℹ'}[c.status]||'ℹ')+' '+esc(c.name)+'</b><p>'+esc(c.detail)+'</p>'+(guidance(c)?'<p class="rh-help">'+esc(guidance(c))+'</p>':'')+'</div>';
 box.innerHTML=html;
}
async function refresh(manual=false){
 if(busy||document.visibilityState==='hidden')return;
 if(navigator.onLine===false){render();return;}
 if(!uid()){result=null;render();return;}
 const account=uid(),run=epoch;busy=true;error='';controller=new AbortController();const active=controller,timeout=setTimeout(()=>active.abort(),45000);render();
 try{
  const conf=await fetch('./api/radar-auth-config',{cache:'no-store',signal:active.signal});if(!conf.ok)throw Error();const c=await conf.json();
  const token=await Promise.race([window.CriptoRadarAuth.getToken(),new Promise((_,reject)=>{if(active.signal.aborted)reject(Error('timeout'));else active.signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true})})]);if(account!==uid()||run!==epoch)return;if(!token)throw Error('session');
  const response=await fetch(c.supabaseUrl+'/functions/v1/radar-health-worker',{method:manual?'POST':'GET',headers:{apikey:c.publicKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:manual?JSON.stringify({action:'check'}):undefined,cache:'no-store',signal:active.signal});
  const data=await response.json();if(!response.ok||!data.ok)throw Error();if(run!==epoch||account!==uid())return;
  result=data.health;lastRead=Date.now();
 }catch(e){if(run===epoch){lastRead=Date.now();error=e.message==='session'?'Entre novamente na conta Radar para consultar a vistoria.':'Não foi possível consultar a vistoria. Tente novamente; o resultado anterior não confirma o estado atual.';}}
 finally{clearTimeout(timeout);if(run===epoch){busy=false;controller=null;render();}}
}
function start(){
 render();refresh();setTimeout(()=>{render();if(!result)refresh()},4000);
 setInterval(()=>{render();if(Date.now()-lastRead>=60000)refresh()},30000);
 window.addEventListener('criptoradar:authchange',()=>{epoch++;controller?.abort();controller=null;busy=false;result=null;error='';lastRead=0;render();refresh()});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){render();refresh()}});
 window.addEventListener('online',()=>refresh());
 window.addEventListener('offline',render);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
