/* Cripto Radar V18.9 — Central de Alertas em tempo real, sem sinais inventados. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const KEY='crRadarV189AlertHistory', MAX_HISTORY=100;
const STABLE=new Set(['USDT','USDC','FDUSD','TUSD','USDP','DAI','USDE','USDS','PYUSD','BUSD','BRL','EUR','TRY']);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').trim().toUpperCase().replace(/USDT$/,'').replace(/[^A-Z0-9]/g,'');
const within=(x,a,b)=>Math.max(a,Math.min(b,Number(x)||0));
const num=n=>Number.isFinite(Number(n))?Number(n):null;
const short=(s,len=215)=>String(s||'').trim().slice(0,len);
const shownPct=x=>x==null?'—':`${x>=0?'+':''}${x.toFixed(2)}%`;
const fmtScore=x=>x==null?'—':Math.round(x)+'/100';
const stamp=ms=>ms?new Date(ms).toLocaleString(window.CriptoRadarI18n?.getLanguage?.()||'pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
let filter='all',query='',alerts=[],lastTick=0,lastSeenDataset=false;
let history=loadHistory();
function loadHistory(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(a=>a&&a.id&&a.at).slice(0,MAX_HISTORY):[]}catch(e){return []}}
function storeHistory(){try{localStorage.setItem(KEY,JSON.stringify(history.slice(0,MAX_HISTORY)))}catch(e){}}
function wallet(){try{return Array.isArray(printWallet)?printWallet:[]}catch(e){return []}}
function market(){try{return walletMarketData||{}}catch(e){return {}}}
function fresh(m){try{return Boolean(m)&&typeof marketDataFresh==='function'&&marketDataFresh(m)}catch(e){return false}}
function direction(s){try{return typeof walletDirection==='function'?walletDirection(s):null}catch(e){return null}}
function buySignal(s){try{return typeof walletBuySignal==='function'?walletBuySignal(s):null}catch(e){return null}}
function aiDecision(s){try{return typeof portfolioAIDecision==='function'?portfolioAIDecision(s):null}catch(e){return null}}
function urgentRisk(s){
 try{
  if(typeof urgentSignal!=='function')return null;
  const x=urgentSignal(s,true);
  return x?.kind==='risk' && x.confirmed && ['strong','critical'].includes(x.level)?x:null;
 }catch(e){return null}
}
function buildAlerts(){
 const results=[], held=new Set(),md=market(),positions=wallet();
 for(const w of positions){
  const s=clean(w?.symbol); if(!s || held.has(s) || STABLE.has(s))continue;
  held.add(s);const data=md[s];if(!fresh(data))continue;
  const ch=num(data.change24h),now=Date.now(),ai=aiDecision(s),dir=direction(s),sig=buySignal(s),risk=urgentRisk(s);
  const label=String(ai?.action||dir?.action||'').toUpperCase();
  let score=num(sig?.score)??num(ai?.confidence);
  let kind='',severity=0,title='',reason='',action='';
  if(risk){kind='risk';score=num(risk.score);severity=risk.level==='critical'?100:92;title=risk.level==='critical'?'RISCO CRÍTICO':'QUEDA FORTE CONFIRMADA';reason=`Movimento confirmado em duas leituras; score de risco ${risk.score}/100.`;action='Revisar proteção e concentração antes de movimentar.'}
  else if(ai?.canReduce===true||/VENDER|REDUZIR|REALIZAR/.test(label)){
   kind='sell';severity=/VENDER|REDUZIR/.test(label)?89:76;title=/REALIZAR/.test(label)?'AVALIAR REALIZAÇÃO':'REVISAR REDUÇÃO';reason=short(ai?.why||dir?.why||'Condição de redução sinalizada pela carteira.');action='Conferir posição, risco e taxas antes de decidir.';
  }else if(ai?.canAdd===true&&sig?.state==='confirmed'){
   kind='buy';severity=67;title='COMPRA CONFIRMADA';reason=short(sig?.why||ai?.why||'Confluência validada pelo Radar.');action='Confira valor do aporte e limite de concentração.';
  }else if(sig?.state==='candidate'){
   kind='watch';severity=35;title='CANDIDATA • AGUARDANDO';reason=short(sig?.why||'Faltam critérios para liberar a compra.');action='Aguardar confirmação, sem aporte automático.';
  }
  if(kind)results.push({id:`wallet:${s}:${kind}:${title}`,symbol:s,kind,title,severity,source:'Minha carteira',held:true,score,change:ch,reason,action,at:num(data.at)||now});
 }
 let opportunities=[];
 try{if(Array.isArray(latestOpportunities))opportunities=latestOpportunities}catch(e){}
 for(const x of opportunities.slice(0,20)){
  const s=clean(x?.symbol);if(!s||held.has(s)||STABLE.has(s)||results.some(a=>a.symbol===s))continue;
  const data=md[s];if(!fresh(data))continue;
  const sig=buySignal(s),state=String(sig?.state||'').toLowerCase();
  if(!['candidate','confirmed'].includes(state))continue;
  const kind=state==='confirmed'?'buy':'watch';
  const title=kind==='buy'?'COMPRA CONFIRMADA':'CANDIDATA • AGUARDANDO';
  results.push({id:`market:${s}:${kind}:${title}`,symbol:s,kind,title,severity:kind==='buy'?62:25,source:'Mercado',held:false,score:num(sig?.score),change:num(data.change24h),reason:short(sig?.why||'Esperando confluência adicional.'),action:kind==='buy'?'Avaliar liquidez e risco antes de investir.':'Aguardar fechamento das confirmações técnicas.',at:num(data.at)||Date.now()});
 }
 return results.sort((a,b)=>b.severity-a.severity||((b.score||0)-(a.score||0))).slice(0,35);
}
function recordTransitions(items){
 const existing=new Map();for(const e of history)if(!existing.has(e.symbol+'|'+e.source))existing.set(e.symbol+'|'+e.source,e);
 let changed=false;
 for(const a of items){
  const prev=existing.get(a.symbol+'|'+a.source);
  if(prev&&prev.id===a.id)continue;
  const at=Date.now();const item={id:a.id,symbol:a.symbol,source:a.source,title:a.title,kind:a.kind,at,read:false};
  history.unshift(item);existing.set(a.symbol+'|'+a.source,item);changed=true;
 }
 if(changed){history=history.slice(0,MAX_HISTORY);storeHistory()}
}
function isRead(a){const e=history.find(e=>e.id===a.id);return Boolean(e?.read)}
function setRead(id){for(const h of history)if(h.id===id)h.read=true;storeHistory();render()}
function readAll(){for(const h of history)h.read=true;storeHistory();render()}
const kinds={risk:'RISCO',sell:'VENDA / PROTEÇÃO',buy:'COMPRA CONFIRMADA',watch:'EM OBSERVAÇÃO'};
const icons={risk:'🔴',sell:'🟠',buy:'🟢',watch:'🟡'};
function showItem(a){const read=isRead(a);return `<article class="ac-item ac-type-${a.kind}${read?' ac-read':''}">
  <div class="ac-item-head"><div><div class="ac-coin">${icons[a.kind]||'🔵'} ${esc(a.symbol)}</div><span class="ac-source">${esc(a.source)}${read?' • Lido':' • Novo sinal'}</span></div><span class="ac-tag">${esc(a.title)}</span></div>
  <div class="ac-stats"><span>Score <b>${fmtScore(a.score)}</b></span><span>24h <b>${shownPct(a.change)}</b></span><span>Tipo <b>${esc(kinds[a.kind])}</b></span></div>
  <p class="ac-reason">${esc(a.reason)}</p><div class="ac-action"><b>Orientação:</b> ${esc(a.action)}</div>
  <div class="ac-foot"><span>Atualizado ${stamp(a.at)}</span><button type="button" data-ac-read="${esc(a.id)}" ${read?'disabled':''}>${read?'✓ Lido':'Marcar como lido'}</button></div>
 </article>`}
function renderPush(){
 const perm=typeof Notification==='undefined'?'indisponível':Notification.permission;
 const local=(()=>{try{return localStorage.getItem('radarNotifications')==='on'}catch(e){return false}})();
 const s=perm==='granted'&&local?'Permitidas no navegador':perm==='denied'?'Bloqueadas no aparelho':perm==='default'?'Aguardando autorização':'Indisponíveis';
 const el=$('acPushStatus');if(el)el.innerHTML=`📡 <b>Notificações:</b> ${esc(s)} • <span>Push 24h: verificar servidor abaixo</span>`;
}
function render(){
 const all=alerts,ready=lastSeenDataset,visible=all.filter(a=>{
  if(filter==='wallet'&&!a.held)return false;
  if(!['all','wallet'].includes(filter)&&a.kind!==filter)return false;
  return !query||a.symbol.toLowerCase().includes(query)||a.title.toLowerCase().includes(query);
 });
 const count=k=>all.filter(a=>a.kind===k).length;
 const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
 set('acRiskCount',count('risk')+count('sell'));set('acBuyCount',count('buy'));set('acWatchCount',count('watch'));set('acUnreadCount',all.filter(x=>!isRead(x)).length);
 const live=$('acLive');if(live){live.className='ac-live '+(ready?'ok':'bad');live.lastElementChild.textContent=ready?`Dados recebidos • ${new Date(lastTick).toLocaleTimeString(window.CriptoRadarI18n?.getLanguage?.()||'pt-BR',{hour:'2-digit',minute:'2-digit'})}`:'Aguardando dados recentes'}
 const top=$('acPriority');if(top){
  const first=all[0];const style=first?['risk','sell'].includes(first.kind)?'risk':first.kind==='buy'?'buy':'pending':'pending';
  const heading=first?`${first.symbol} • ${first.title}`:ready?'Nenhum sinal confirmado agora':'Aguardando dados recentes';
  const reason=first?short(first.reason,300):ready?'Sem alertas que atendam aos critérios atuais. A análise continua monitorando o mercado.':'Quando preço e dados técnicos forem atualizados, o Radar mostrará os alertas verificáveis.';
  top.className='ac-priority '+style;
  top.innerHTML=`<div class="ac-p-eyebrow">${first?'MAIOR PRIORIDADE AGORA':'STATUS DA CARTEIRA'}</div><h3>${esc(heading)}</h3><p>${esc(reason)}</p>`;
 }
 set('acCount',`${visible.length} sinal(is) exibido(s) • ${all.length} ativo(s) em acompanhamento${filter!=='all'?' • filtrado':''}`);
 const list=$('acList');if(list)list.innerHTML=visible.length?visible.map(showItem).join(''):`<div class="ac-empty"><div class="ac-ico">🛡️</div>${ready?'Nenhum sinal corresponde ao filtro selecionado.':'Ainda sem dados recentes ou sinais verificáveis.'}</div>`;
 const h=$('acHistory');if(h)h.innerHTML=history.length?history.slice(0,6).map(e=>`<div class="ac-hist-row"><div>${icons[e.kind]||'🔵'} <b>${esc(e.symbol)}</b> • ${esc(e.title)} ${e.read?'✓':''}</div><span>${stamp(e.at)}</span></div>`).join(''):'<div class="ac-empty">Nenhuma mudança registrada neste aparelho ainda.</div>';
 renderPush();
 for(const id of ['acPushStatus','acLive','acPriority','acCount','acList','acHistory'])window.CriptoRadarI18n?.localizeNode?.($(id));
}
function sync(){
 if(!$('alertCenterCard'))return;
 const md=market();lastSeenDataset=Object.values(md).some(fresh);lastTick=Date.now();
 const current=buildAlerts();recordTransitions(current);alerts=current;render();
}
function init(){
 if(!$('alertCenterCard'))return;
 $('acFilters')?.addEventListener('click',e=>{
  const b=e.target.closest('[data-ac-filter]');if(!b)return;
  filter=b.dataset.acFilter||'all';document.querySelectorAll('#acFilters [data-ac-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();
 });
 $('acSearch')?.addEventListener('input',e=>{query=String(e.target.value||'').trim().toLowerCase().slice(0,40);render()});
 $('acList')?.addEventListener('click',e=>{const b=e.target.closest('[data-ac-read]');if(b)setRead(b.dataset.acRead)});
 $('acMarkAll')?.addEventListener('click',readAll);
 $('acEnablePush')?.addEventListener('click',()=>$('enableNotifications')?.click());
 $('acTestPush')?.addEventListener('click',()=>$('testServerPush')?.click());
 $('acRefresh')?.addEventListener('click',async()=>{
  const b=$('acRefresh');if(b){b.disabled=true;b.textContent='Atualizando…'}
  try{if(typeof refreshMarketNow==='function')await refreshMarketNow();if(typeof refreshRadarTechnicals==='function')await refreshRadarTechnicals();}
  catch(e){}finally{sync();if(b){b.disabled=false;b.textContent='↻ Atualizar'}}
 });
 window.addEventListener('storage',e=>{if(e.key===KEY){history=loadHistory();render()}});
 window.addEventListener('criptoradar:languagechange',()=>{try{render()}catch(e){}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
 sync();setTimeout(sync,2600);setInterval(sync,9000);
}
window.CriptoRadarAlertsV189={refresh:sync,buildAlerts,getHistory:()=>history.map(x=>({...x})),markRead:setRead};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
