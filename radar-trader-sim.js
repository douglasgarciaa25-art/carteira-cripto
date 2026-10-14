/* Radar Trader 20.0 — interface de ordens fictícias; NÃO ENVIA ordens à Binance. */
(function(){
 'use strict';
 const C=window.RadarTraderCore;if(!C)return;
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
 const fmt=(n,d=2)=>{const x=Number(n)||0,ax=Math.abs(x);if(d===2&&ax>0&&ax<0.01){if(ax<1e-8)return x.toExponential(2);d=Math.min(8,Math.max(4,Math.ceil(-Math.log10(ax))+1))}return x.toLocaleString('pt-BR',{minimumFractionDigits:d===2?2:0,maximumFractionDigits:d})};
 const num=n=>Number.isFinite(Number(n))?Number(n):0;
 let ledger=null,storageKey='',lastMessage='Simulação pronta. Nenhuma ordem real pode ser enviada.',lastScanMsg='Automático desligado.';
 let lastAutoRenderAt=0,busy=false;
 const now=()=>Date.now();
 function accountKey(){return 'radar:paper:20:uid:'+(window.CriptoRadarAuth?.userId()||'signed-out')}
 function migrateBoundLedger(){
  const uid=window.CriptoRadarAuth?.userId(),email=String(window.CriptoRadarAuth?.userEmail?.()||'').trim().toLowerCase();
  if(!uid||!email)return null;
  let h=2166136261;for(let i=0;i<email.length;i++){h^=email.charCodeAt(i);h=Math.imul(h,16777619)}
  const old=JSON.parse(localStorage.getItem('radar:paper:20:'+((h>>>0).toString(16)))||'null');
  return old?.binanceReference?.userId===uid?cleanLoaded(old):null;
 }
 function persist(){if(!ledger||!window.CriptoRadarAuth?.userId())return;try{localStorage.setItem(storageKey,JSON.stringify(ledger))}catch(e){lastMessage='Não foi possível salvar o simulador neste navegador.'}}
 function cleanLoaded(x){
  if(!x||!x.limits||!Number.isFinite(Number(x.cash))||(!x.positions||typeof x.positions!=='object')||!Array.isArray(x.orders))return null;
  // Ignore stored risk overrides: tested hard limits cannot be silently weakened by changing localStorage.
  x.limits={...C.DEFAULT_LIMITS};x.autoEnabled=false;x.mode='manual';
  if(!x.lastPrices||typeof x.lastPrices!=='object')x.lastPrices={};
  if(!Number.isFinite(x.dayStartNAV))x.dayStartNAV=C.metrics(x,{}).nav;
  return x;
 }
 function load(){
  const key=accountKey();if(key===storageKey&&ledger)return;
  storageKey=key;
  let found=null;try{found=cleanLoaded(JSON.parse(localStorage.getItem(key)||'null'))||migrateBoundLedger();if(found?.binanceReference?.userId!==window.CriptoRadarAuth?.userId())found=null}catch(e){}
  ledger=found||C.createLedger(1);if(!found){ledger.cash=0;ledger.initialUSDT=0;ledger.dayStartNAV=0;}ledger.autoEnabled=false;ledger.mode='manual';
  persist();lastMessage='Conta virtual carregada. Botão automático desligado por segurança.';
 }
 function syncReference(){
  const b=window.CriptoRadarBinanceSnapshot;
  try{if(!b||b.userId!==window.CriptoRadarAuth?.userId())throw Error('binance_account_mismatch');C.syncBinanceReference(ledger,b);persist();return true;}
  catch(_){ledger.binanceSyncError='Saldo Binance pendente';return false;}
 }
 function market(){return window.walletMarketData||{}}
 function snap(){return window.CriptoRadarBinanceSnapshot||null}
 function latestSignal(symbol){
  try{
   const s=window.CriptoRadarMarketIntelligence?.scoreAsset?.(symbol);
   if(!s||!s.ready||!s.dataFresh)return {confirmed:false,ready:false,score:0,label:'Dados técnicos pendentes'};
   return {confirmed:s.canBuy===true,ready:true,score:Number(s.quality)||0,label:String(s.statusLabel||'OBSERVAR'),risk:s.riskScore!=null&&Number.isFinite(Number(s.riskScore))?Number(s.riskScore):100};
  }catch(e){return {confirmed:false,ready:false,score:0,label:'Motor técnico indisponível'}}
 }
 function pricesFresh(){
  return !C.metrics(ledger,market()).unknown.length;
 }
 function updateAuto(){
  if(!ledger||!ledger.autoEnabled||ledger.killed||document.visibilityState==='hidden'||busy)return;
  busy=true;
  try{
   if(!syncReference()){lastScanMsg="Aguardando saldo atualizado da Binance.";return;}
   C.rollover(ledger,market());
   const m=C.metrics(ledger,market());
   // Manage existing virtual positions first. Stop and profit values are illustrative, based on average simulated cost.
   for(const p of m.rows){
    const q=C.quoteFor(p.symbol,market(),ledger);if(!q.fresh||!p.qty||!p.costUSDT)continue;
    const change=(q.price/(p.costUSDT/p.qty)-1)*100;
    if(change<=-4||change>=8){
     const side='SELL',amount=p.qty*q.price;
     const done=C.execute(ledger,{side,symbol:p.symbol,amount,auto:true,protective:true},market());
     if(done.ok){lastMessage=`AUTO SIMULADO: venda ${p.symbol} (${change.toFixed(1)}% desde a compra).`;
       lastScanMsg=lastMessage;persist();return}
     lastScanMsg='Saída de '+p.symbol+' não executada: '+done.reason;
    }
   }
   const error=C.checkRiskAndPause(ledger,market());
   if(error){lastScanMsg='NOVAS COMPRAS PAUSADAS: '+error;lastMessage=lastScanMsg;persist();return}
   // No guessing: purchases require market freshness, independent technical confirmation and liquidity.
   let tried=0;
   for(const symbol of C.ALLOWED){
    const sig=latestSignal(symbol);if(!sig.ready||!sig.confirmed||sig.risk>=75)continue;
    const quote=C.quoteFor(symbol,market(),ledger);if(!quote.fresh||!(quote.volume>0)||!(quote.liquidity>=35))continue;
    if(ledger.positions[symbol]?.qty>0)continue;
    const amount=Math.min(ledger.cash,m.nav*.03,m.nav*ledger.limits.maxTradePct/100);
    const result=C.execute(ledger,{side:'BUY',symbol,amount,auto:true,confirmed:true},market());
    tried++;
    if(result.ok){lastMessage='AUTO SIMULADO: compra '+symbol+' • '+fmt(amount)+' USDT, sinal técnico confirmado.';
      lastScanMsg=lastMessage;persist();return}
    lastScanMsg=symbol+': '+result.reason;
   }
   if(!tried)lastScanMsg='Sem compra tecnicamente confirmada ou liquidez suficiente. Saldos pequenos são permitidos na simulação.';
  }finally{ledger.lastScanAt=now();persist();busy=false;updateUI()}
 }
 function renderStatic(){
  const parent=$('simulationWorkspace')||$('radarBinanceCard');if(!parent)return false;
  if($('radarTrader20'))return true;
  const shell=document.createElement('section');shell.id='radarTrader20';shell.className='rt20';shell.innerHTML=`
   <div class="rt20-head"><div><small>🧪 RADAR TRADER 20.0</small><h3>Operações simuladas</h3></div><span class="rt20-pill">SEM DINHEIRO REAL</span></div>
   <p class="rt20-muted">Treine as duas modalidades com saldo virtual. O aplicativo não tem função de enviar ordens reais. A Binance continua somente leitura.</p>
   <div class="rt20-kpis"><div><small>Patrimônio virtual</small><strong id="rt20NAV">—</strong></div><div><small>USDT virtual livre</small><strong id="rt20Cash">—</strong></div><div><small>Resultado do dia</small><strong id="rt20Day">—</strong></div><div><small>Exposição em ativos</small><strong id="rt20Exposure">—</strong></div></div>
   <div id="rt20Safety" class="rt20-alert" role="status"></div>
   <div class="rt20-mode" role="group" aria-label="Modalidades simuladas"><button type="button" data-rt="mode-manual" class="rt20-choice">✋ Manual simulado</button><button type="button" data-rt="mode-auto" class="rt20-choice">🤖 Automático simulado</button></div>
   <div class="rt20-box"><b>Limites obrigatórios</b><p class="rt20-muted">5% por ordem • 30% de exposição volátil • 20% por ativo • perda diária máxima 2% • 3 ordens/dia • intervalo de 15 min por moeda</p><p class="rt20-muted">Taxa simulada: 0,1% • slippage simulado: 0,1% • sem saldo mínimo na simulação. Na Binance real, cada par tem filtros mínimos próprios.</p></div>
   <div class="rt20-box" id="rt20ManualPanel">
    <b>Ordem fictícia com confirmação</b>
    <div class="rt20-grid-input"><label>Tipo<select id="rt20Side"><option value="BUY">Comprar</option><option value="SELL">Vender</option></select></label><label>Moeda<select id="rt20Symbol">${C.ALLOWED.map(s=>`<option>${s}</option>`).join('')}</select></label></div>
    <label class="rt20-field">Valor da ordem em USDT <input id="rt20Amount" type="number" inputmode="decimal" min="0" step="any" value="0.25"/></label>
    <button class="rt20-primary" type="button" data-rt="manual-preview">Revisar ordem simulada</button>
   </div>
   <div class="rt20-box" id="rt20AutoPanel" hidden>
    <b>Motor automático de teste</b><p class="rt20-muted">Procura sinais de compra confirmados e monitora stop fictício (-4%) e realização fictícia (+8%). Só funciona enquanto esta tela está aberta. Se não houver confirmação ou houver falha, não negocia.</p>
    <label class="rt20-switch"><input type="checkbox" id="rt20AutoEnable"/> Ativar robô fictício nesta sessão</label>
    <button type="button" data-rt="scan">Fazer verificação simulada agora</button>
    <p class="rt20-muted" id="rt20Scan">Automático desligado.</p>
   </div>
   <div class="rt20-actions"><button class="rt20-danger" type="button" data-rt="kill">⛔ PARADA DE EMERGÊNCIA</button><button type="button" data-rt="resume">Rearmar (com confirmação)</button></div>
   <div class="rt20-box"><div class="rt20-row"><b>Posições virtuais</b><span id="rt20Count"></span></div><div id="rt20Positions">Nenhuma posição.</div></div>
   <div class="rt20-box"><div class="rt20-row"><b>Histórico local das ordens</b><button type="button" data-rt="export">Exportar CSV</button></div><div id="rt20History">Sem operações simuladas.</div></div>
   <details class="rt20-box"><summary>Base Binance e histórico fictício</summary><p class="rt20-muted">Iniciar um novo teste apaga somente as operações virtuais deste navegador. Não altera Binance nem a carteira manual.</p><p class="rt20-muted">Todas as ordens usam o USDT livre da Binance como base. Compras fictícias consomem a reserva virtual; atualizar o saldo não repõe valores já utilizados.</p><input id="rt20Capital" type="hidden"/><button type="button" data-rt="copy-cash">Atualizar referência Binance</button><button type="button" class="rt20-danger" data-rt="reset">Reiniciar simulação</button></details>
   <p class="rt20-disclaimer">CONTAS DIFERENTES: este painel é LOCAL, guardado apenas neste navegador. O Radar Trader 20.1 (abaixo) é a NUVEM, com operações fictícias próprias. Os botões de emergência são independentes. Resultados são simulados a partir de cotações indicativas; não garantem retorno. Sem envio de ordens à Binance, sem chaves de negociação e sem execução com o aplicativo fechado.</p>
  `;
  parent.appendChild(shell);
  shell.addEventListener('click',onClick);
  shell.addEventListener('change',onChange);
  return true;
 }
 function updateUI(){
  if(!ledger||!$('rt20NAV'))return;
  const m=C.metrics(ledger,market());
  $('rt20NAV').textContent=fmt(m.nav)+' USDT';
  $('rt20Cash').textContent=fmt(m.cash)+' USDT';
  $('rt20Day').textContent=(m.dailyPnl>=0?'+':'')+fmt(m.dailyPnl)+' USDT';
  $('rt20Day').className=m.dailyPnl<0?'rt20-negative':'rt20-positive';
  $('rt20Exposure').textContent=fmt(m.exposurePct,1)+'%';
  $('rt20Count').textContent=m.rows.length+' moeda(s)';
  $('rt20ManualPanel').hidden=ledger.mode!=='manual';
  $('rt20AutoPanel').hidden=ledger.mode!=='auto';
  for(const key of ['manual','auto'])$('radarTrader20').querySelector('[data-rt="mode-'+key+'"]').classList.toggle('is-active',ledger.mode===key);
  const check=$('rt20AutoEnable');if(check)check.checked=ledger.autoEnabled;
  $('rt20Scan').textContent=lastScanMsg;
  const risk=C.reasonForRisk(ledger,market());
  const kill=ledger.killed?'⛔ EMERGÊNCIA ATIVA: '+(ledger.killReason||'ordens bloqueadas'):'';
  $('rt20Safety').textContent=kill||risk||lastMessage;
  $('rt20Safety').className='rt20-alert'+(kill||risk?' rt20-alert-danger':'');
  const tbody=$('rt20Positions');
  tbody.innerHTML=m.rows.length?m.rows.map(p=>`<div class="rt20-pos"><div><b>${esc(p.symbol)}</b><small>${fmt(p.qty,12)} un. • médio ${fmt(p.costUSDT/p.qty,5)} USDT</small></div><div><b>${fmt(p.value)} USDT</b><small class="${p.unrealized<0?'rt20-negative':'rt20-positive'}">${p.unrealized>=0?'+':''}${fmt(p.unrealized)} USDT ${p.fresh?'':'• cotação antiga'}</small></div></div>`).join(''):'<p class="rt20-muted">Sem posições virtuais. Os USDT estão em reserva.</p>';
  if($('rt20Safety'))$('rt20Safety').textContent=(kill||risk||C.referenceError(ledger)||lastMessage)+' • '+(!ledger.binanceReference?'Saldo Binance pendente':('Base Binance: '+fmt(ledger.binanceReference.freeUSDT)+' USDT livres • atualizada '+new Date(ledger.binanceReference.updatedAt).toLocaleTimeString('pt-BR')+' • reserva virtual desconta as operações fictícias.'));
  if(m.pendingWithdrawalUSDT>0)$('rt20Safety').textContent+=' Ajuste de retirada pendente: '+fmt(m.pendingWithdrawalUSDT)+' USDT; próximas vendas fictícias/entradas compensam esse ajuste.';
  window.dispatchEvent(new Event('criptoradar:paperchange'));
  $('rt20History').innerHTML=ledger.orders.length?[...ledger.orders].slice(-8).reverse().map(o=>`<div class="rt20-order"><span><b>${o.side==='BUY'?'🟢 COMPRA':'🔴 VENDA'} ${esc(o.symbol)}</b><small>${esc(o.mode)} • ${esc(o.at.replace('T',' ').slice(0,16))} UTC</small></span><span>${fmt(o.amountUSDT)} USDT<small>${fmt(o.fillPrice,5)} / un.</small></span></div>`).join(''):'<p class="rt20-muted">Nenhuma ordem simulada executada.</p>';
 }
 function manualPreview(){
  syncReference();
  const side=$('rt20Side').value,symbol=$('rt20Symbol').value,amount=Number($('rt20Amount').value);
  const draft={side,symbol,amount,auto:false};
  C.rollover(ledger,market());
  const test=C.validate(ledger,draft,market());
  if(!test.ok){lastMessage='⛔ Ordem fictícia bloqueada: '+test.reason;updateUI();return}
  const slippage=ledger.limits.slippagePct/100,fee=ledger.limits.feePct/100;
  const estimatedPrice=test.price*(side==='BUY'?1+slippage:1-slippage);
  const qty=side==='BUY'?(amount*(1-fee))/estimatedPrice:amount/test.price;
  const txt=`SIMULAÇÃO, NENHUMA ORDEM REAL.\n${side==='BUY'?'Comprar':'Vender'} ${symbol}\nValor: ${fmt(amount)} USDT\nPreço indicativo: ${fmt(test.price,6)} USDT\nPreço simulado: ${fmt(estimatedPrice,6)} USDT\nQuantidade aprox.: ${fmt(qty,12)}\nTaxa estimada 0,1% e slippage 0,1%.\nConfirmar operação fictícia?`;
  if(!window.confirm(txt))return;
  syncReference();
  const outcome=C.execute(ledger,draft,market());
  lastMessage=outcome.ok?'✅ Ordem fictícia registrada. Nenhum dinheiro real foi movimentado.':'⛔ '+outcome.reason;
  persist();updateUI();
 }
 function reset(){
  if(!syncReference()){lastMessage='Aguarde a sincronização Binance antes de reiniciar.';updateUI();return;}
  const val=Number(snap()?.freeUSDT);
  if(!Number.isFinite(val)||val<0||val>1e7){lastMessage='Capital virtual inválido.';updateUI();return}
  if(!window.confirm('Apagar histórico e posições APENAS SIMULADOS desta conta? A Binance não será modificada.'))return;
  const killed=ledger.killed,killReason=ledger.killReason;ledger=C.createLedger(val||1);ledger.cash=val;ledger.initialUSDT=val;ledger.dayStartNAV=val;ledger.killed=killed;ledger.killReason=killReason;syncReference();ledger.autoEnabled=false;lastScanMsg='Automático desligado.';
  lastMessage='Simulação zerada, com '+fmt(val)+' USDT fictícios.';persist();updateUI();
 }
 function copyCash(){syncReference();lastMessage=C.referenceError(ledger)||'Referência Binance atualizada; histórico e posições fictícias preservados.';updateUI();}
 function downloadCSV(){
  const header=['data_utc','modo','tipo','ativo','valor_usdt','quantidade','preco_execucao_usdt','taxa_usdt','pnl_realizado_usdt','observacao'];
  const rows=ledger.orders.map(o=>[o.at,o.mode,o.side,o.symbol,o.amountUSDT,o.quantity,o.fillPrice,o.feeUSDT,o.realizedUSDT,'SIMULADO']);
  const csv='\ufeff'+[header,...rows].map(row=>row.map(c=>'"'+String(c??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const file=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download='Radar_Trader_20_simulacao.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
 }
 function onClick(e){
  const b=e.target.closest('button[data-rt]');if(!b||!ledger)return;
  const act=b.dataset.rt;
  if(act==='manual-preview')return manualPreview();
  if(act==='mode-manual'||act==='mode-auto'){
   ledger.mode=act==='mode-auto'?'auto':'manual';ledger.autoEnabled=false;lastScanMsg='Automático desligado.';
   lastMessage=ledger.mode==='auto'?'Modo automático apenas fictício. Habilite conscientemente para testar.':'Modo manual fictício selecionado.';
  }else if(act==='scan'){updateAuto();}
  else if(act==='kill'){ledger.killed=true;ledger.autoEnabled=false;ledger.killReason='Acionada manualmente pelo usuário.';lastMessage='PARADA DE EMERGÊNCIA ATIVA. Nenhuma nova operação virtual será executada.';}
  else if(act==='resume'){
   if(!window.confirm('Rearmar a simulação? O automático continuará desligado até nova autorização.'))return;
   ledger.killed=false;ledger.killReason='';ledger.autoEnabled=false;lastMessage='Simulador rearmado. Automático desligado.';
  }else if(act==='copy-cash')return copyCash();
  else if(act==='reset')return reset();
  else if(act==='export')return downloadCSV();
  persist();updateUI();
 }
 function onChange(e){if(!ledger||e.target?.id!=='rt20AutoEnable')return;
  const next=!!e.target.checked;
  if(next){
   if(ledger.killed){lastMessage='Parada de emergência ativa. Rearme após revisar os riscos.';e.target.checked=false;updateUI();return}
   if(!window.confirm('ATENÇÃO: ativar apenas o robô SIMULADO, sem dinheiro real. Ele poderá registrar operações fictícias somente com o app aberto e dentro dos limites?')){e.target.checked=false;return}
   ledger.mode='auto';ledger.autoEnabled=true;lastScanMsg='Auto simulado ativado. Aguardando confirmação técnica.';
  }else{ledger.autoEnabled=false;lastScanMsg='Auto simulado desligado.'}
  persist();updateUI();
  if(ledger.autoEnabled)updateAuto();
 }
 function init(){if(!renderStatic())return;load();syncReference();updateUI();
  const tick=()=>{
   if(accountKey()!==storageKey){load();updateUI()}
   if(!ledger)return;syncReference();C.rollover(ledger,market());
   if(ledger.autoEnabled&&document.visibilityState!=='hidden'&&now()-ledger.lastScanAt>=30000)updateAuto();
   if(now()-lastAutoRenderAt>10000){updateUI();lastAutoRenderAt=now()}
  };
  setInterval(tick,5000);
  window.addEventListener('criptoradar:binancesync',tick);
  window.addEventListener('criptoradar:authchange',tick);
  window.addEventListener('criptoradar:walletchange',tick);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')tick()});
  window.RadarTraderSim={inspect:()=>{load();if(!window.CriptoRadarAuth?.userId())return null;syncReference();return {ledger:JSON.parse(JSON.stringify(ledger)),metrics:C.metrics(ledger,market()),referenceError:C.referenceError(ledger),risk:C.reasonForRisk(ledger,market())}},scan:()=>{load();if(now()-ledger.lastScanAt>=30000)updateAuto()},reset:()=>{load();reset()},review:()=>{load();ledger.mode='manual';ledger.autoEnabled=false;persist();updateUI();$('rt20Amount').value=Math.max(0,Math.min(ledger.cash,C.metrics(ledger,market()).nav*.05));window.crRadarOpenView?.('simulations');$('radarTrader20').scrollIntoView({behavior:'smooth'});},status:()=>({mode:ledger?.mode,autoEnabled:!!ledger?.autoEnabled,simulationOnly:true,orders:ledger?.orders.length||0})};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

