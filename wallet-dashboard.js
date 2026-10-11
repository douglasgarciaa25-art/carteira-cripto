/* Cripto Radar V18.7 • Painel de carteira. 100% local: não envia posições nem preços médios a terceiros. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const STORE='crRadarWalletCostV187';
const STABLE=new Set(['USDT','USDC','FDUSD','TUSD','USDP','DAI','USDE','USDS','PYUSD','BUSD','BRL','EUR','TRY']);
const money=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2});
const numBR=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:8});
const pct=v=>`${v>0?'+':''}${v.toFixed(2)}%`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const symbol=v=>{try{return normalizeWalletSymbol(v)}catch(e){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}};
const sane=v=>Number.isFinite(Number(v))?Number(v):0;
let costs={},sort='value',filter='all',query='',openSymbol='',lastSignature='',refreshBusy=false;
try{const raw=JSON.parse(localStorage.getItem(STORE)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))costs=raw}catch(e){}
function fresh(m){
  if(!m)return false;
  try{if(typeof marketDataFresh==='function')return marketDataFresh(m)}catch(e){}
  const age=Date.now()-Number(m.at);return Number.isFinite(age)&&age>=-60000&&age<120000;
}
function snapshot(){
  const wallet=Array.isArray(window.printWallet)?window.printWallet:[];
  const market=window.walletMarketData||{},prices=window.walletPrices||{};
  const aggregated=new Map();
  for(const item of wallet){
    const s=symbol(item.symbol),qty=Number(item.qty);
    if(!s||!Number.isFinite(qty)||qty<=0)continue;
    aggregated.set(s,(aggregated.get(s)||0)+qty);
  }
  const rows=[...aggregated].map(([s,qty])=>{
    const m=market[s]||{},p=Number(prices[s]||m.priceBRL||m.brl||0),hasPrice=Number.isFinite(p)&&p>0;
    const stable=STABLE.has(s),isFresh=fresh(m);
    const value=hasPrice?qty*p:0,change=Number(m.change24h);
    const hasChange=isFresh&&!stable&&Number.isFinite(change)&&change>-99&&change<10000;
    const prior=hasChange?value/(1+change/100):0;
    const cost=Number(costs[s]),hasCost=Number.isFinite(cost)&&cost>0;
    const investment=hasCost?qty*cost:0;
    let analysis=null;
    if(!stable&&isFresh){try{analysis=window.CriptoRadarMarketIntelligence?.scoreAsset?.(s)||null}catch(e){}}
    const status=stable?'Reserva estável':!isFresh||!analysis?.ready?'Dados pendentes':analysis.statusLabel||'OBSERVAR';
    const confirmed=!stable&&isFresh&&analysis?.canBuy===true;
    const caution=!stable&&isFresh&&(analysis?.status==='avoid'||Number(analysis?.riskScore)>=75);
    return {s,qty,p,hasPrice,value,change,hasChange,prior,delta24:hasChange?value-prior:0,m,isFresh,stable,hasCost,cost,investment,
      pnl:hasCost&&hasPrice?value-investment:null,analysis,status,confirmed,caution,share:0};
  });
  const total=rows.reduce((sum,r)=>sum+r.value,0),priced=rows.filter(r=>r.hasPrice),unpriced=rows.filter(r=>!r.hasPrice);
  rows.forEach(r=>{r.share=total>0?r.value/total*100:0});
  const stableValue=rows.filter(r=>r.stable).reduce((sum,r)=>sum+r.value,0);
  const ranked=[...rows].filter(r=>!r.stable).sort((a,b)=>b.value-a.value),big=ranked[0]||null;
  const tracked=rows.filter(r=>r.hasCost&&r.hasPrice),trackedInvestment=tracked.reduce((sum,r)=>sum+r.investment,0);
  const trackedPnL=tracked.reduce((sum,r)=>sum+r.pnl,0),trackedValue=tracked.reduce((sum,r)=>sum+r.value,0);
  const changeRows=rows.filter(r=>r.hasChange&&r.hasPrice),changedValue=changeRows.reduce((sum,r)=>sum+r.value,0);
  const change24=changeRows.reduce((sum,r)=>sum+r.delta24,0),prior=changedValue-change24;
  const freshPriceRows=rows.filter(r=>r.isFresh&&r.hasPrice);
  const staleValue=rows.filter(r=>!r.isFresh&&r.hasPrice).reduce((sum,r)=>sum+r.value,0);
  const concentration=big?.share||0;
  const warnings=[];
  if(unpriced.length)warnings.push(`${unpriced.length} ativo(s) sem cotação: não incluídos no valor total`);
  if(staleValue>0)warnings.push('Há cotações desatualizadas no valor estimado');
  if(concentration>=45)warnings.push(`${big.s} ocupa ${concentration.toFixed(1)}% da carteira: concentração elevada`);
  else if(concentration>=30)warnings.push(`${big.s} ocupa ${concentration.toFixed(1)}% da carteira: acompanhar concentração`);
  if(ranked.length>0&&stableValue/Math.max(total,.01)<.05)warnings.push('Reserva de moedas estáveis abaixo de 5% da carteira');
  const riskRows=rows.filter(r=>r.caution);
  if(riskRows.length)warnings.push(`${riskRows.length} ativo(s) com bloqueio ou risco técnico elevado`);
  return {rows,total,stableValue,stablePct:total?stableValue/total*100:0,priced,unpriced,big,change24,prior,changedValue,
    deltaCoverage:total?changedValue/total:0,trackedInvestment,trackedPnL,trackedValue,
    pnlCoverage:total?trackedValue/total:0,concentration,warnings,riskRows,staleValue,freshCount:freshPriceRows.length};
}
function badge(row){
 if(row.stable)return '<span class="wd-badge wd-reserve">RESERVA</span>';
 if(!row.isFresh||!row.analysis?.ready)return '<span class="wd-badge wd-muted">DADOS PENDENTES</span>';
 if(row.confirmed)return '<span class="wd-badge wd-positive">COMPRA CONFIRMADA</span>';
 if(row.caution)return '<span class="wd-badge wd-negative">EVITAR ENTRADA</span>';
 if(row.analysis?.status==='candidate')return '<span class="wd-badge wd-warning">CANDIDATA • AGUARDANDO</span>';
 return '<span class="wd-badge wd-muted">OBSERVAR</span>';
}
function rowHtml(r){
 const emphasis=r.pnl==null?'':r.pnl>=0?'wd-up':'wd-down';
 const reasons=r.analysis?.missingConfirmations||r.analysis?.blocks||r.analysis?.cautions||[];
 const note=r.stable?'Moeda estável, usada como reserva. Ainda pode variar em BRL.':
  !r.isFresh?'A cotação não está atualizada. Não há sinal de compra válido.':
  r.confirmed?'Sinal técnico confirmado pelo motor atual. Não é garantia de retorno.':
  reasons.length?'Falta confirmar: '+reasons.slice(0,3).join('; '):
  (r.analysis?.summary||'Aguardando mais confluência técnica para uma entrada.');
 return `<article class="wd-asset">
   <button type="button" class="wd-asset-toggle" data-wd-open="${esc(r.s)}" aria-expanded="${openSymbol===r.s}">
    <span class="wd-token">${esc(r.s.slice(0,3))}</span>
    <span class="wd-asset-name"><strong>${esc(r.s)}</strong><small>${numBR.format(r.qty)} un. • ${r.share.toFixed(1).replace('.',',')}% do total</small></span>
    <span class="wd-asset-value"><strong>${r.hasPrice?money.format(r.value):'Sem cotação'}</strong><small class="${r.hasChange?(r.change>=0?'wd-up':'wd-down'):''}">${r.hasChange?pct(r.change)+' em 24h':r.isFresh?'Variação indisponível':'Dados não atualizados'}</small></span>
    <span class="wd-chevron" aria-hidden="true">${openSymbol===r.s?'⌃':'⌄'}</span>
   </button>
   <div class="wd-weight"><i style="width:${Math.max(0,Math.min(100,r.share)).toFixed(2)}%"></i></div>
   <div class="wd-asset-badge">${badge(r)}</div>
   ${openSymbol===r.s?`<div class="wd-details">
      <p>${esc(note)}</p>
      <div class="wd-detail-grid"><span>Preço atual <b>${r.hasPrice?money.format(r.p):'—'}</b></span><span>Quantidade <b>${numBR.format(r.qty)}</b></span><span>Qualidade técnica <b>${r.stable?'—':r.analysis?.ready?Math.round(sane(r.analysis.quality))+'/100':'Pendente'}</b></span><span>Risco técnico <b>${r.stable?'—':r.analysis?.ready?esc(r.analysis.riskLabel||'—'):'—'}</b></span></div>
      <div class="wd-cost-box"><label for="wd-cost-${esc(r.s)}">Preço médio de compra (R$ por unidade)</label><div class="wd-cost-input"><input id="wd-cost-${esc(r.s)}" type="number" min="0" step="any" inputmode="decimal" placeholder="Ex.: 12,50" value="${r.hasCost?r.cost:''}"><button type="button" data-wd-save="${esc(r.s)}">Salvar</button><button type="button" class="wd-secondary" data-wd-clear="${esc(r.s)}">Limpar</button></div><small>Opcional e salvo apenas neste aparelho; ajuste se comprar ou vender ativos.</small></div>
      <div class="wd-pnl-row"><span>Resultado não realizado ${r.hasCost?'':'(sem preço médio)'}</span><b class="${emphasis}">${r.pnl==null?'—':`${r.pnl>=0?'+':''}${money.format(r.pnl)} (${pct((r.pnl/r.investment)*100)})`}</b></div>
   </div>`:''}
 </article>`;
}
function sortRows(rows){return rows.slice().sort((a,b)=>{
 if(sort==='alpha')return a.s.localeCompare(b.s);
 if(sort==='change')return (b.hasChange?b.change:-99999)-(a.hasChange?a.change:-99999)||b.value-a.value;
 if(sort==='risk')return (Number(b.analysis?.riskScore)||0)-(Number(a.analysis?.riskScore)||0)||b.value-a.value;
 if(sort==='pnl')return (b.pnl??-Infinity)-(a.pnl??-Infinity);
 return b.value-a.value;
});}
function paint(){
 const box=$('wdBody');if(!box)return;
 const snap=snapshot(),{rows,total,stableValue,stablePct,big,change24,prior,deltaCoverage,trackedInvestment,trackedPnL,pnlCoverage}=snap;
 const hasEnoughData=total>0&&deltaCoverage>=.70&&prior>0;
 const hasTracked=trackedInvestment>0;
 const indicators=[
  ['Valor estimado',total>0?money.format(total):rows.length?'Sem preços válidos':money.format(0),snap.staleValue>0?'Inclui cotação desatualizada':'Posições cadastradas'],
  ['Mudança estimada em 24h',hasEnoughData?`${change24>=0?'+':''}${money.format(change24)}`:'—',hasEnoughData?pct(change24/prior*100)+' • '+Math.round(deltaCoverage*100)+'% dos ativos em valor':'Dados 24h insuficientes'],
  ['Resultado não realizado',hasTracked?`${trackedPnL>=0?'+':''}${money.format(trackedPnL)}`:'—',hasTracked?`${pct(trackedPnL/trackedInvestment*100)} • ${Math.round(pnlCoverage*100)}% da carteira rastreada`:'Cadastre os preços médios'],
  ['Reserva estável',money.format(stableValue),`${stablePct.toFixed(1).replace('.',',')}% da carteira`]
 ];
 $('wdKpis').innerHTML=indicators.map((x,i)=>`<div class="wd-kpi"><small>${esc(x[0])}</small><strong class="${i===1&&hasEnoughData?(change24>=0?'wd-up':'wd-down'):i===2&&hasTracked?(trackedPnL>=0?'wd-up':'wd-down'):''}">${esc(x[1])}</strong><span>${esc(x[2])}</span></div>`).join('');
 $('wdUpdated').textContent=snap.staleValue||snap.unpriced.length?'⚠️ Dados parciais':'● Atualização de mercado';
 const risky=snap.concentration>=45;
 $('wdSummary').innerHTML=rows.length?`<strong>${rows.length} ativo(s) • ${snap.priced.length} com cotação</strong><span>${big?`Maior posição: ${esc(big.s)} (${big.share.toFixed(1).replace('.',',')}%). `:''}${risky?'Sua carteira está concentrada.': 'Distribuição monitorada pelo Radar.'}</span>`:
  '<strong>Sua carteira está vazia.</strong><span>Importe um print ou adicione moedas manualmente para começar.</span>';
 const groups=[...sortRows(rows)].filter(r=>r.hasPrice&&r.value>0).slice(0,10);
 const shade=['#4d8dff','#40c9a2','#f7b955','#be8fff','#f07c8c','#5bd5df','#7f9ed2','#bdc95b','#df9d5a','#a7b4cb'];
 $('wdDonut').innerHTML=total>0?`<div class="wd-track" role="img" aria-label="Distribuição percentual da carteira">${groups.map((r,i)=>`<span style="width:${r.share.toFixed(3)}%;background:${shade[i]}"></span>`).join('')}</div><div class="wd-legend">${groups.map((r,i)=>`<span><i style="background:${shade[i]}"></i>${esc(r.s)} ${r.share.toFixed(1).replace('.',',')}%</span>`).join('')}</div>`:
  '<div class="wd-empty">Sem posições precificadas para mostrar a distribuição.</div>';
 $('wdWarnings').innerHTML=snap.warnings.length?`<strong>⚠️ Pontos de atenção</strong>${snap.warnings.slice(0,4).map(w=>`<p>${esc(w)}</p>`).join('')}`:
  `<strong>🛡️ Monitoramento da carteira</strong><p>${rows.length?'Sem alertas de concentração extrema ou de dados ausentes nesta leitura.':'Adicione seus ativos para iniciar o monitoramento.'}</p>`;
 const visible=sortRows(rows).filter(r=>r.s.toLowerCase().includes(query.trim().toLowerCase())).filter(r=>filter==='all'||
  (filter==='stable'&&r.stable)||(filter==='confirmed'&&r.confirmed)||(filter==='attention'&&(r.caution||r.share>=30||!r.isFresh)));
 $('wdAssets').innerHTML=visible.length?visible.map(rowHtml).join(''):'<div class="wd-empty">Nenhuma moeda corresponde a este filtro.</div>';
 $('wdNote').textContent='Valor e variação de 24h são estimativas de mercado. Resultado não realizado usa apenas posições com preço médio cadastrado; não inclui taxas ou impostos. Pontuação técnica não é probabilidade de lucro.';
}
function signature(){
 try{
  const wallet=window.printWallet||[],md=window.walletMarketData||{},prices=window.walletPrices||{};
  return wallet.map(w=>{const s=symbol(w.symbol),m=md[s]||{};let a='';try{const t=window.CriptoRadarMarketIntelligence?.scoreAsset?.(s);a=t?`${t.status}:${t.quality}:${t.canBuy}`:''}catch(e){};
   return [s,w.qty,prices[s],m.at,m.change24h,a,costs[s]].join(':')}).join('|')+'#'+sort+'#'+filter+'#'+query+'#'+openSymbol;
 }catch(e){return String(Date.now())}
}
function tick(force=false){if(!$('wdBody'))return;const next=signature();if(force||next!==lastSignature){lastSignature=next;paint()}}
function exportCSV(){
 const snap=snapshot();if(!snap.rows.length)return;
 const head=['Moeda','Quantidade','Preco atual BRL','Valor estimado BRL','Participacao %','Variacao 24h %','Preco medio compra BRL','Resultado nao realizado BRL','Status'];
 const csv=[head,...snap.rows.map(r=>[r.s,r.qty,r.hasPrice?r.p:'',r.hasPrice?r.value:'',r.share,r.hasChange?r.change:'',r.hasCost?r.cost:'',r.pnl??'',r.status])]
  .map(row=>row.map(v=>'"'+String(typeof v==='number'?v.toString().replace('.',','):v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const blob=new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='carteira-cripto-radar.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function refresh(){if(refreshBusy)return;refreshBusy=true;const b=$('wdRefresh');if(b){b.disabled=true;b.textContent='Atualizando…'}
 try{if(typeof refreshMarketNow==='function')await refreshMarketNow()}catch(e){}
 try{if(typeof refreshRadarTechnicals==='function')await refreshRadarTechnicals()}catch(e){}
 refreshBusy=false;if(b){b.disabled=false;b.textContent='↻ Atualizar dados'}tick(true);
}
function bind(){
 const panel=$('walletDashboardCard');if(!panel)return;
 panel.addEventListener('click',e=>{
   const open=e.target.closest('[data-wd-open]');if(open){openSymbol=open.dataset.wdOpen===openSymbol?'':open.dataset.wdOpen;tick(true);return}
   const save=e.target.closest('[data-wd-save]');if(save){const s=save.dataset.wdSave,input=$('wd-cost-'+s);if(!input)return;
     const value=Number(String(input.value).replace(',','.'));if(!(value>0&&Number.isFinite(value))){input.setCustomValidity('Informe um preço maior que zero');input.reportValidity();input.setCustomValidity('');return}
     costs[s]=value;try{localStorage.setItem(STORE,JSON.stringify(costs))}catch(e){};tick(true);return}
   const clear=e.target.closest('[data-wd-clear]');if(clear){delete costs[clear.dataset.wdClear];try{localStorage.setItem(STORE,JSON.stringify(costs))}catch(e){};tick(true);return}
 });
 $('wdSort')?.addEventListener('change',e=>{sort=e.target.value;tick(true)});
 $('wdFilter')?.addEventListener('change',e=>{filter=e.target.value;tick(true)});
 $('wdSearch')?.addEventListener('input',e=>{query=e.target.value;tick(true)});
 $('wdExport')?.addEventListener('click',exportCSV);
 $('wdRefresh')?.addEventListener('click',refresh);
 $('wdCapture')?.addEventListener('click',()=>{$('walletCaptureCard')?.scrollIntoView({behavior:'smooth',block:'start'});});
 $('wdSimulate')?.addEventListener('click',()=>{$('marketIntelligenceCard')?.scrollIntoView({behavior:'smooth',block:'start'});$('miAmount')?.focus({preventScroll:true})});
 tick(true);
}
document.addEventListener('DOMContentLoaded',bind);
window.addEventListener('criptoradar:walletchange',()=>{try{tick(true)}catch(e){}});
setInterval(()=>{try{tick()}catch(e){}},6000);
window.CriptoRadarWalletV187={snapshot,render:()=>tick(true)};
})();
