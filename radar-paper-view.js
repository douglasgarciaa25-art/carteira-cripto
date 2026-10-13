/* Radar 20.1.5: legacy panel is a view of the current user's local paper ledger. */
(function(){'use strict';
 const $=id=>document.getElementById(id);
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=x=>Number(x||0).toLocaleString('pt-BR',{maximumFractionDigits:8});
 function snapshot(){
  const x=window.RadarTraderSim?.inspect();if(!x)return null;
  const {ledger:s,metrics:m}=x;
  const trades=[...Object.entries(s.positions||{}).map(([symbol,p])=>({symbol,status:'OPEN',qty:p.qty,entry:p.costUSDT/p.qty,positionValue:m.rows.find(r=>r.symbol===symbol)?.value||0})),
   ...s.orders.filter(o=>o.side==='SELL').map(o=>({id:o.id,symbol:o.symbol,status:'CLOSED',closedAt:Date.parse(o.at),pnl:o.realizedUSDT,qty:o.quantity}))];
  return {...x,capital:s.binanceReference?.freeUSDT??0,trades};
 }
 function metrics(){const x=snapshot(),closed=x?.trades.filter(t=>t.status==='CLOSED')||[],wins=closed.filter(t=>t.pnl>0),gain=wins.reduce((a,t)=>a+t.pnl,0),loss=-closed.filter(t=>t.pnl<0).reduce((a,t)=>a+t.pnl,0),total=closed.reduce((a,t)=>a+t.pnl,0);return {count:closed.length,win:closed.length?100*wins.length/closed.length:0,total,pf:loss?gain/loss:null,expectancy:closed.length?total/closed.length:0,maxDD:null}}
 function render(){
  if(!$('paperStats'))return;const x=snapshot(),s=x?.ledger,m=x?.metrics;
  if($('paperCapital'))$('paperCapital').value=x?.capital??0;
  if($('paperRisk'))$('paperRisk').value=s?.limits.maxTradePct??5;
  if($('paperRiskWarning'))$('paperRiskWarning').textContent='Saldo, limites e histórico do Trader local. A conta do servidor é independente.';
  if($('paperEngineStatus'))$('paperEngineStatus').textContent=!x?'Entre na conta Radar e conecte a Binance.':s.killed?'Parada de emergência local ativa.':x.referenceError||x.risk||(s.autoEnabled?'Automático local ativado.':'Automático local desligado; use o Trader para ativar.');
  const vals=[['Patrimônio virtual',m?fmt(m.nav)+' USDT':'—'],['Caixa virtual',m?fmt(m.cash)+' USDT':'—'],['Posições',m?.rows.length??0],['Resultado do dia',m?fmt(m.dailyPnl)+' USDT':'—']];
  $('paperStats').innerHTML=vals.map(([label,value])=>'<div class="v7-stat"><span class="small">'+esc(label)+'</span><b>'+esc(value)+'</b></div>').join('');
  if($('paperOpen'))$('paperOpen').innerHTML=m?.rows.length?m.rows.map(p=>'<div class="v7-row"><b>'+esc(p.symbol)+'</b> • '+fmt(p.qty)+' un. • '+fmt(p.value)+' USDT</div>').join(''):'Nenhuma posição fictícia nesta conta.';
  if($('paperJournal'))$('paperJournal').innerHTML=s?.orders.length?[...s.orders].slice(-30).reverse().map(o=>'<div class="v7-row"><b>'+esc(o.side==='BUY'?'COMPRA':'VENDA')+' '+esc(o.symbol)+'</b> • '+fmt(o.amountUSDT)+' USDT<div class="small">'+esc(o.at)+' • '+esc(o.mode)+'</div></div>').join(''):'Nenhuma ordem fictícia nesta conta.';
 }
 function start(){
  $('paperReset')?.addEventListener('click',()=>window.RadarTraderSim?.reset());
  render();setInterval(render,5000);window.addEventListener('criptoradar:paperchange',render);window.addEventListener('criptoradar:authchange',render);
 }
 window.CriptoRadarPaperView={snapshot,render};window.v7PaperMetrics=metrics;
 window.v7PaperScan=()=>{window.RadarTraderSim?.scan();render()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
