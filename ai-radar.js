(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
async function ask(q=''){
 const st=document.getElementById('aiStatus'),box=document.getElementById('aiMessages'); if(st)st.textContent='IA analisando…';
 try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const j=await r.json();if(!r.ok||!j.ok)throw 0;
 box.innerHTML='<div class="ai-msg"><b>🤖 IA Radar</b><br>'+esc(j.answer)+'</div><div class="ai-top">'+j.top.slice(0,5).map((x,i)=>'<span>'+(i+1)+'º '+esc(x.symbol)+' • '+x.score+'/100</span>').join('')+'</div>';
 st.textContent='● IA ativa • '+new Date(j.at).toLocaleTimeString('pt-BR')+(j.learning.enabled?' • memória ativa':' • memória permanente não configurada');
 }catch(e){if(st)st.textContent='IA temporariamente indisponível.'}
}
function init(){const b=document.getElementById('aiAsk'),i=document.getElementById('aiQuestion');if(b)b.onclick=()=>ask(i.value);if(i)i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ask(i.value)}};ask('Analise agora');setInterval(()=>ask('Atualize a análise'),60000)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();