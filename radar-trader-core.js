/* Radar Trader 20.0 - engine de simulação local. Nenhuma chamada privada ou ordem real. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RadarTraderCore=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const VERSION='20.1.2',ALLOWED=['BTC','ETH','SOL','BNB','XRP','ADA','LINK','SUI','NEAR','AVAX','DOT'];
 const DEFAULT_LIMITS=Object.freeze({maxTradePct:5,maxVolatilePct:30,maxAssetPct:20,maxDailyLossPct:2,maxTradesPerDay:3,cooldownMinutes:15,feePct:0.1,slippagePct:0.1,minQuote:0});
 const rnd=(x,p=12)=>Number((Number(x)||0).toFixed(p));
 const good=x=>Number.isFinite(Number(x))&&Number(x)>0;
 const day=(at)=>new Date(at).toISOString().slice(0,10); // UTC date for deterministic daily reset
 const bounded=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
 const finiteValue=(x,fallback=0)=>Number.isFinite(Number(x))?Number(x):fallback;
 function createLedger(initialUSDT=1000){
  const cash=finiteValue(initialUSDT);if(!(cash>0&&cash<=1e7))throw Error('Capital fictício deve ser maior que zero.');
  return {version:VERSION,cash:rnd(cash),initialUSDT:rnd(cash),positions:{},lastPrices:{},orders:[],
   limits:{...DEFAULT_LIMITS},mode:'manual',autoEnabled:false,killed:false,killReason:'',
   day:day(Date.now()),dayStartNAV:cash,createdAt:new Date().toISOString(),lastScanAt:0};
 }
 function quoteFor(symbol,markets,ledger){
  const m=markets&&markets[symbol]||{};
  const fresh=Number.isFinite(Number(m.at))&&Date.now()-Number(m.at)>=-60000&&Date.now()-Number(m.at)<=120000;
  const price=Number(m.last??m.price);
  return {price:good(price)?price:finiteValue(ledger.lastPrices?.[symbol]),fresh:Boolean(fresh&&good(price)),
   volume:Number(m.volume),liquidity:Number(m.liquidityPct),source:String(m.source||'Mercado')};
 }
 function metrics(ledger,markets={}){
  let volatile=0,unknown=[],unrealized=0;const rows=[];
  for(const [symbol,pos] of Object.entries(ledger.positions||{})){
   if(!good(pos.qty))continue;
   const q=quoteFor(symbol,markets,ledger),price=q.price,valued=good(price),value=valued?pos.qty*price:0;
   if(!valued||!q.fresh)unknown.push(symbol);
   volatile+=value;unrealized+=value-pos.costUSDT;
   rows.push({symbol,qty:pos.qty,costUSDT:pos.costUSDT,price,value,unrealized:value-pos.costUSDT,fresh:q.fresh});
  }
  const nav=finiteValue(ledger.cash)+volatile;
  return {cash:rnd(ledger.cash),volatile:rnd(volatile),nav:rnd(nav),unrealized:rnd(unrealized),
   dailyPnl:rnd(nav-finiteValue(ledger.dayStartNAV,nav)),dailyPnlPct:finiteValue(ledger.dayStartNAV)>0?100*(nav-ledger.dayStartNAV)/ledger.dayStartNAV:0,
   exposurePct:nav>0?100*volatile/nav:0,rows,unknown};
 }
 function rollover(ledger,markets={},now=Date.now()){
  const d=day(now);
  if(ledger.day!==d){ledger.day=d;ledger.dayStartNAV=metrics(ledger,markets).nav;ledger.lastScanAt=0;
    // An emergency stop needs explicit user intervention: never reset the kill switch at midnight.
  }
  return ledger;
 }
 function todayOrders(ledger,now=Date.now()){
  return (ledger.orders||[]).filter(o=>day(Date.parse(o.at))===day(now));
 }
 function reasonForRisk(ledger,markets,now=Date.now()){
  const m=metrics(ledger,markets),lossPct=finiteValue(ledger.limits.maxDailyLossPct,2);
  if(m.unknown.length)return 'Cotação ausente ou desatualizada de posição aberta: '+m.unknown.slice(0,3).join(', ');
  if(m.dailyPnlPct<=-lossPct)return 'Limite diário de perda atingido ('+m.dailyPnlPct.toFixed(2)+'%).';
  return '';
 }
 function validate(ledger,order,markets={},now=Date.now()){
  if(ledger.killed)return {ok:false,reason:'Parada de emergência acionada. Use Retomar somente após revisar.'};
  if(!order||!['BUY','SELL'].includes(order.side))return {ok:false,reason:'Tipo de ordem inválido.'};
  const sym=String(order.symbol||'').toUpperCase(),amount=Number(order.amount);
  const protective=order.side==='SELL'&&order.auto===true&&order.protective===true&&ledger.mode==='auto'&&ledger.autoEnabled;
  if(!ALLOWED.includes(sym))return {ok:false,reason:'Ativo não autorizado neste simulador.'};
  if(!good(amount)||!Number.isFinite(amount)||amount>1e9)return {ok:false,reason:'Valor em USDT inválido.'};
   const q=quoteFor(sym,markets,ledger);
  if(!q.fresh)return {ok:false,reason:'Dados de mercado indisponíveis ou desatualizados.'};
  const m=metrics(ledger,markets),nav=m.nav;
  if(m.unknown.length&&!protective)return {ok:false,reason:'Há posições com cotações desatualizadas. Operação suspensa.'};
  if(order.side==='BUY'&&m.dailyPnlPct<=-ledger.limits.maxDailyLossPct)return {ok:false,reason:'Limite de perda diária atingido. Operação bloqueada.'};
  if(!protective&&amount>nav*ledger.limits.maxTradePct/100+1e-12)return {ok:false,reason:'Operação acima de '+ledger.limits.maxTradePct+'% do patrimônio virtual.'};
  if(order.side==='BUY'&&todayOrders(ledger,now).filter(o=>o.side==='BUY').length>=ledger.limits.maxTradesPerDay)return {ok:false,reason:'Limite de '+ledger.limits.maxTradesPerDay+' operações por dia atingido.'};
  const prior=todayOrders(ledger,now).filter(o=>o.symbol===sym).slice(-1)[0];
  if(!protective&&prior&&now-Date.parse(prior.at)<ledger.limits.cooldownMinutes*60000)return {ok:false,reason:'Proteção de intervalo de '+ledger.limits.cooldownMinutes+' min entre operações deste ativo.'};
  if(order.auto){
   if(ledger.mode!=='auto'||!ledger.autoEnabled)return {ok:false,reason:'Automático não ativado.'};
   if(!good(q.volume)||(!protective&&!(q.liquidity>=35)))return {ok:false,reason:'Liquidez insuficiente ou não verificada.'};
  }
  const fee=ledger.limits.feePct/100,slip=ledger.limits.slippagePct/100;
  if(order.side==='BUY'){
   if(amount>ledger.cash+1e-12)return {ok:false,reason:'USDT virtual insuficiente.'};
   if(m.volatile+amount>nav*ledger.limits.maxVolatilePct/100+1e-12)return {ok:false,reason:'Exposição total excederia '+ledger.limits.maxVolatilePct+'%.'};
   const current=m.rows.find(x=>x.symbol===sym)?.value||0;
   if(current+amount>nav*ledger.limits.maxAssetPct/100+1e-12)return {ok:false,reason:'Concentração do ativo excederia '+ledger.limits.maxAssetPct+'%.'};
   if(order.auto&&order.confirmed!==true)return {ok:false,reason:'Compra automática sem confirmação técnica independente.'};
   const quantity=(amount*(1-fee))/(q.price*(1+slip));
   if(!good(quantity)||rnd(quantity,12)<=0)return {ok:false,reason:'Quantidade inferior à precisão simulada.'};
  }else{
   const qty=amount/q.price;
   if(!good(ledger.positions?.[sym]?.qty)||qty>ledger.positions[sym].qty*(1+1e-10))return {ok:false,reason:'Saldo virtual do ativo insuficiente para venda.'};
  }
  return {ok:true,reason:'Ordem fictícia aceita',price:q.price};
 }
 function execute(ledger,order,markets={},now=Date.now()){
  rollover(ledger,markets,now);
  const accepted=validate(ledger,order,markets,now);if(!accepted.ok)return accepted;
  const symbol=String(order.symbol).toUpperCase(),amount=Number(order.amount),price=accepted.price;
  const protective=order.side==='SELL'&&order.auto===true&&order.protective===true&&ledger.autoEnabled&&ledger.mode==='auto';
  const feeRate=ledger.limits.feePct/100,slip=ledger.limits.slippagePct/100;
  let qty,fill,feeUSDT,realized=0;
  if(order.side==='BUY'){
   fill=price*(1+slip);feeUSDT=amount*feeRate;
   qty=rnd((amount-feeUSDT)/fill,12);
   if(!good(qty))return {ok:false,reason:'Quantidade simulada muito pequena.'};
   const before=ledger.positions[symbol]||{qty:0,costUSDT:0};
   ledger.positions[symbol]={qty:rnd(before.qty+qty,12),costUSDT:rnd(before.costUSDT+amount,12)};
   ledger.cash=rnd(ledger.cash-amount);
  }else{
   fill=price*(1-slip);qty=protective?ledger.positions[symbol].qty:rnd(amount/price,12);
   const before=ledger.positions[symbol],actualQty=Math.min(before.qty,qty);
   feeUSDT=actualQty*fill*feeRate;
   const revenue=actualQty*fill-feeUSDT;
   const basis=before.costUSDT*(actualQty/before.qty);
   realized=rnd(revenue-basis);
   ledger.cash=rnd(ledger.cash+revenue);
   const remaining=before.qty-actualQty;
   if(remaining<=0)delete ledger.positions[symbol];
   else ledger.positions[symbol]={qty:rnd(remaining,12),costUSDT:rnd(before.costUSDT-basis,12)};
   qty=actualQty;
  }
  ledger.lastPrices[symbol]=price;
  const result={id:String(now)+'-'+(ledger.orders.length+1),at:new Date(now).toISOString(),side:order.side,symbol,mode:order.auto?'AUTO':'MANUAL',
   amountUSDT:rnd(amount,12),quantity:rnd(qty,12),referencePrice:rnd(price,12),fillPrice:rnd(fill,12),feeUSDT:rnd(feeUSDT,12),realizedUSDT:realized,
   protectiveExit:!!protective,belowIllustrativeMin:false,
   note:'SIMULAÇÃO SEM ORDEM REAL; o mínimo de execução na Binance depende do par e deve ser validado separadamente'};
  ledger.orders.push(result);ledger.orders=ledger.orders.slice(-300);
  return {ok:true,order:result,metrics:metrics(ledger,markets)};
 }
 function checkRiskAndPause(ledger,markets={}){
  const r=reasonForRisk(ledger,markets);
  if(r){ledger.lastRiskReason=r;return r}
  return '';
 }
 return {VERSION,ALLOWED,DEFAULT_LIMITS,createLedger,quoteFor,metrics,rollover,todayOrders,reasonForRisk,validate,execute,checkRiskAndPause};
});
