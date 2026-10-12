
/* Cripto Radar V18 — Market Intelligence & Allocation Lab
   Camada analítica adicional. Não executa ordens e não promete retorno. */
(function(){
'use strict';

const API = {};
// Preserva o sinal técnico V5 como segunda opinião independente.
const legacyBuySignal = typeof window.walletBuySignal === 'function' ? window.walletBuySignal : null;
const $ = id => document.getElementById(id);
const clamp = (n,a=0,b=100) => Math.max(a, Math.min(b, Number(n)||0));
const n = v => Number(v);
const finite = v => Number.isFinite(Number(v));
const fmtBRL = v => Number(v||0).toLocaleString(window.CriptoRadarI18n?.getLanguage?.()||'pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2});
const fmtPct = v => `${Number(v||0)>=0?'+':''}${Number(v||0).toLocaleString(window.CriptoRadarI18n?.getLanguage?.()||'pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}%`;
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => { try{return normalizeWalletSymbol(s)}catch(e){return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'')} };

const STORE='crRadarV18AllocationPrefs';
const DEFAULTS={profile:'balanced',objective:'balance',entry:'phased',reserve:null};
const PROFILE = {
  conservative:{label:'Conservador',candidateMin:78,reserve:.30,maxAsset:.24,riskPenalty:1.35,altsPenalty:.82},
  balanced:{label:'Equilibrado',candidateMin:72,reserve:.18,maxAsset:.30,riskPenalty:1.00,altsPenalty:1.00},
  aggressive:{label:'Agressivo',candidateMin:68,reserve:.10,maxAsset:.36,riskPenalty:.78,altsPenalty:1.13}
};
const OBJECTIVE = {
  protect:{label:'Proteção',reserveDelta:.10,btcEth:1.35,growth:.78},
  balance:{label:'Equilíbrio',reserveDelta:0,btcEth:1.08,growth:1.00},
  growth:{label:'Crescimento',reserveDelta:-.05,btcEth:.95,growth:1.18}
};

function readPrefs(){
  try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){return {...DEFAULTS}}
}
function savePrefs(p){try{localStorage.setItem(STORE,JSON.stringify(p))}catch(e){}}

function getTech(symbol){
  const s=norm(symbol);
  try{
    const a=radarV5Cache?.get?.(s)?.data;
    if(a && (!window.radarTechFresh || radarTechFresh(a))) return a;
  }catch(e){}
  try{
    const b=radarTechCache?.get?.(s)?.data;
    if(b && (!window.radarTechFresh || radarTechFresh(b))) return b;
  }catch(e){}
  return null;
}
function getMarket(symbol){
  const s=norm(symbol);
  try{return walletMarketData?.[s]||null}catch(e){return null}
}
function marketUniverse(){
  let syms=[];
  try{syms=Object.keys(walletMarketData||{})}catch(e){}
  const base=['BTC','ETH','SOL','BNB','XRP','SUI','NEAR','APT','OP','ADA','LINK'];
  for(const s of base) if(!syms.includes(s)) syms.push(s);
  try{for(const x of (printWallet||[])){const s=norm(x.symbol);if(s&&!syms.includes(s))syms.push(s)}}catch(e){}
  return syms.filter(Boolean).filter(s=>{try{return !walletStable?.has?.(s)}catch(e){return !/^(USDT|USDC|BUSD|DAI|FDUSD)$/.test(s)}});
}
function volumePercentile(symbol){
  const s=norm(symbol), m=getMarket(s), v=n(m?.volume||m?.total_volume||0);
  if(!(v>0)) return .35;
  const arr=marketUniverse().map(x=>n(getMarket(x)?.volume||0)).filter(x=>x>0).sort((a,b)=>a-b);
  if(!arr.length) return .35;
  return arr.filter(x=>x<=v).length/arr.length;
}
function regime(){
  try{
    const r=typeof radarMarketRegimeV5==='function'?radarMarketRegimeV5():typeof radarMarketRegime==='function'?radarMarketRegime():null;
    if(r) return r;
  }catch(e){}
  const btc=getMarket('BTC'), ch=n(btc?.change24h);
  return {key:ch>1?'bull':ch<-1?'bear':'range',label:ch>1?'ALTA':ch<-1?'BAIXA':'LATERAL'};
}
function riskObj(t){
  try{if(t && typeof radarRisk==='function')return radarRisk(t)}catch(e){}
  return {label:'Médio',score:50};
}

function scoreAsset(symbol){
  const s=norm(symbol), t=getTech(s), m=getMarket(s), reg=regime();
  const change=finite(m?.change24h)?n(m.change24h):0;
  const vp=volumePercentile(s);
  const positives=[], cautions=[], blocks=[];

  if(!t){
    let fallback=45;
    fallback += clamp((vp-.35)*30,-8,15);
    fallback += change>0&&change<6?6:change>12?-8:0;
    return {
      symbol:s,ready:false,quality:Math.round(clamp(fallback,25,62)),status:'pending',
      statusLabel:'ANÁLISE PENDENTE',riskLabel:'—',riskScore:55,change,
      dimensions:{trend:45,momentum:45,liquidity:Math.round(35+vp*55),timing:45,risk:45,regime:reg.key==='bear'?25:55},
      positives:['liquidez e preço monitorados'],cautions:['faltam indicadores multi-timeframe'],blocks:[],
      summary:'Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.'
    };
  }

  const risk=riskObj(t);
  // Trend quality.
  let trend=50;
  if(t.h4?.structure?.key==='bull'){trend+=24;positives.push('estrutura 4h HH/HL')}
  if(t.h4?.structure?.key==='bear'){trend-=30;blocks.push('estrutura 4h baixista')}
  if((t.d1?.trend||0)>0){trend+=18;positives.push('tendência 1d positiva')}
  if((t.d1?.trend||0)<0){trend-=24;cautions.push('tendência 1d desfavorável')}
  if((t.h4?.trend||0)>0) trend+=8;
  trend=clamp(trend);

  // Momentum quality: reward controlled momentum, not pure vertical chasing.
  let momentum=45;
  const rsi=n(t.m15?.rsi||50), adx=n(t.m15?.adx||0), rs=n(t.relativeStrength||0);
  momentum += clamp((adx-14)*1.6,-12,24);
  if(rsi>=45&&rsi<=64){momentum+=17;positives.push('RSI em faixa saudável')}
  else if(rsi>64&&rsi<72){momentum+=7;cautions.push('RSI já aquecido')}
  else if(rsi>=72){momentum-=20;cautions.push('RSI esticado')}
  else if(rsi<38){momentum-=10;cautions.push('momentum ainda fraco')}
  momentum += clamp(rs*1.15,-15,18);
  if(rs>3) positives.push('força relativa acima do BTC');
  if(rs<-2) cautions.push('fraqueza relativa ao BTC');
  momentum=clamp(momentum);

  // Liquidity / participation.
  let liquidity=30+vp*55;
  const vr=n(t.m15?.vr||0);
  liquidity += clamp((vr-1)*20,-12,16);
  if(vr>=1) positives.push('volume confirmando');
  else if(vr<.75) cautions.push('volume abaixo do ideal');
  liquidity=clamp(liquidity);

  // Timing: VWAP, 24h stretch and mean-reversion risk.
  const vwap=n(t.m15?.vwapPct||0);
  let timing=72;
  if(vwap>=-1.5&&vwap<=4){timing+=13;positives.push('preço próximo de zona técnica')}
  else if(vwap>8){timing-=22;cautions.push('distante do VWAP')}
  else if(vwap<-5){timing-=8;cautions.push('abaixo do VWAP; reversão ainda não confirmada')}
  if(change>15){timing-=24;cautions.push('movimento 24h muito esticado')}
  else if(change>9){timing-=13;cautions.push('alta 24h acelerada')}
  else if(change>=1&&change<=7){timing+=7}
  else if(change<-8){timing-=12;cautions.push('queda 24h relevante')}
  timing=clamp(timing);

  const riskScore=clamp(n(risk?.score||50));
  const riskQuality=clamp(100-riskScore);
  if(riskScore<=35) positives.push('risco técnico baixo');
  if(riskScore>=70){blocks.push('risco técnico elevado')}

  const regimeScore=reg.key==='bull'?88:reg.key==='bear'?28:60;
  if(reg.key==='bull') positives.push('regime geral favorável');
  if(reg.key==='bear') blocks.push('mercado geral defensivo');

  // Weighted composite, deliberately balanced to avoid chasing only score/momentum.
  const quality=Math.round(clamp(
    trend*.25 + momentum*.20 + liquidity*.14 + timing*.16 + riskQuality*.15 + regimeScore*.10
  ));

  // Original V5 score is a secondary vote, not the whole decision.
  const v5=finite(t.score)?clamp(t.score):50;
  const blended=Math.round(clamp(quality*.72+v5*.28));

  const severe=blocks.length>0;
  let status='watch', statusLabel='OBSERVAR';
  const structureBull = t.h4?.structure?.key==='bull';
  const mixedStructure = !structureBull && t.h4?.structure?.key!=='bear';
  const extended24h = change>=12;
  const stretched = rsi>=72 || vwap>8 || extended24h;
  if(!severe && blended>=90 && structureBull && trend>=72 && momentum>=65 && liquidity>=58 && timing>=52 && !stretched){
    status='strong';statusLabel='SINAL FORTE';
  }else if(!severe && blended>=85 && structureBull && trend>=62 && momentum>=55 && timing>=42 && riskScore<72 && !stretched){
    status='confirmed';statusLabel='COMPRA CONFIRMADA';
  }else if(!severe && blended>=70 && trend>=50 && riskScore<72){
    status='candidate';statusLabel='CANDIDATA A COMPRA';
  }else if(severe || blended<48){
    status='avoid';statusLabel='EVITAR ENTRADA';
  }
  if(mixedStructure && blended>=85 && status==='candidate'){
    cautions.push('estrutura 4h ainda mista; falta confirmação');
  }
  if(extended24h && blended>=85){
    cautions.push('movimento 24h já avançado; evitar perseguir preço');
  }

  return {
    symbol:s,ready:true,quality:blended,v5Score:Math.round(v5),status,statusLabel,
    riskLabel:risk?.label||'Médio',riskScore,change,
    dimensions:{trend:Math.round(trend),momentum:Math.round(momentum),liquidity:Math.round(liquidity),timing:Math.round(timing),risk:Math.round(riskQuality),regime:Math.round(regimeScore)},
    positives:[...new Set(positives)].slice(0,5),
    cautions:[...new Set(cautions)].slice(0,5),
    blocks:[...new Set(blocks)].slice(0,4),
    summary:makeAssetSummary(s,blended,statusLabel,positives,cautions,blocks)
  };
}
function makeAssetSummary(s,q,label,pos,cau,blo){
  if(blo.length) return `${s}: ${label.toLowerCase()} por ${blo.slice(0,2).join(' e ')}.`;
  if(label==='COMPRA CONFIRMADA'||label==='SINAL FORTE') return `${s}: confluência forte; ${pos.slice(0,2).join(' e ')}.`;
  if(label==='CANDIDATA A COMPRA') return `${s}: boa base técnica, mas ainda merece confirmação de ${cau[0]||'preço/volume'}.`;
  return `${s}: cenário incompleto; aguardar melhora antes de elevar a exposição.`;
}

function portfolioSnapshot(){
  let rows=[];
  try{
    rows=(printWallet||[]).map(x=>{
      const s=norm(x.symbol), qty=n(x.qty), m=getMarket(s);
      const px=n(m?.priceBRL||walletPrices?.[s]||0);
      return {symbol:s,qty,value:qty*px,stable:/^(USDT|USDC|BUSD|DAI|FDUSD)$/.test(s),analysis:scoreAsset(s)};
    }).filter(x=>x.symbol&&x.qty>0);
  }catch(e){}
  const total=rows.reduce((a,x)=>a+x.value,0);
  rows.forEach(x=>x.weight=total>0?x.value/total:0);
  const invest=rows.filter(x=>!x.stable);
  const cash=rows.filter(x=>x.stable).reduce((a,x)=>a+x.value,0);
  const maxWeight=invest.length?Math.max(...invest.map(x=>x.weight)):0;
  const hhi=invest.reduce((a,x)=>a+x.weight*x.weight,0);
  const diversification=invest.length?clamp(100-(maxWeight*90+hhi*80),20,100):50;
  const quality=total>0?invest.reduce((a,x)=>a+x.analysis.quality*x.weight,0)/(invest.reduce((a,x)=>a+x.weight,0)||1):0;
  const riskQ=total>0?invest.reduce((a,x)=>(a+x.analysis.dimensions.risk*x.weight),0)/(invest.reduce((a,x)=>a+x.weight,0)||1):50;
  const cashPct=total>0?cash/total:0;
  const reserveQuality=clamp(100-Math.abs(cashPct-.15)*250,35,100);
  const health=total>0?Math.round(clamp(diversification*.35+quality*.35+riskQ*.20+reserveQuality*.10)):null;
  let risk='Médio';
  if(riskQ>=72)risk='Baixo'; else if(riskQ<46)risk='Alto';
  const notes=[];
  if(maxWeight>.45)notes.push('carteira concentrada em uma posição');
  if(cashPct<.05&&total>0)notes.push('reserva muito baixa');
  if(cashPct>.35)notes.push('reserva alta; pode haver capital ocioso');
  if(diversification<50)notes.push('diversificação limitada');
  if(quality>=72)notes.push('qualidade técnica média positiva');
  if(riskQ<48)notes.push('risco agregado elevado');
  return {rows,total,cash,cashPct,maxWeight,hhi,diversification,quality,riskQ,health,risk,notes};
}

function rankedUniverse(){
  return marketUniverse().map(scoreAsset)
    .filter(x=>x.ready)
    .sort((a,b)=>b.quality-a.quality);
}

function paramsFor(profile,objective){
  const p=PROFILE[profile]||PROFILE.balanced,o=OBJECTIVE[objective]||OBJECTIVE.balance;
  return {...p,...o,reserve:clamp((p.reserve+o.reserveDelta)*100,5,45)/100};
}
function currentWeightMap(p){
  const m={}; for(const x of p.rows||[])m[x.symbol]=x.weight||0; return m;
}

function scenarioAllocation(amount,profile,objective){
  amount=Math.max(0,n(amount));
  const pp=paramsFor(profile,objective), snap=portfolioSnapshot(), cw=currentWeightMap(snap);
  const ranked=rankedUniverse();
  const core=new Set(['BTC','ETH']);
  let pool=ranked.filter(x=>{
    if(!x.canBuy||!x.dataFresh)return false;
    if(x.riskScore>=78)return false;
    return ['strong','confirmed'].includes(x.status);
  }).slice(0,12);

  // Ensure high-quality wallet holdings are considered.
  for(const x of snap.rows){
    if(x.stable)continue;
    const a=x.analysis;
    if(a.ready&&a.canBuy&&a.riskScore<78&&!pool.some(y=>y.symbol===a.symbol))pool.push(a);
  }

  const intendedInvest=Math.max(0,amount*(1-pp.reserve));
  // O limite é da carteira FINAL, não apenas do dinheiro que está entrando.
  // Um ativo já concentrado não pode receber mais até o patrimônio se diluir.
  const futureTotal=snap.total+amount;
  let weighted=pool.map(a=>{
    const current=cw[a.symbol]||0;
    const currentValue=snap.rows.find(x=>x.symbol===a.symbol)?.value||0;
    const maxByPortfolio=Math.max(0,futureTotal*pp.maxAsset-currentValue);
    const cap=Math.max(0,Math.min(maxByPortfolio,amount*pp.maxAsset));
    const statusFactor=a.status==='strong'?1.25:1.15;
    const coreFactor=core.has(a.symbol)?pp.btcEth:pp.growth*pp.altsPenalty;
    const riskFactor=clamp((105-a.riskScore*pp.riskPenalty)/100,.25,1.05);
    const timingFactor=clamp(a.dimensions.timing/75,.45,1.15);
    const diversificationFactor=clamp(1-current/(pp.maxAsset||.3),.18,1);
    const raw=Math.pow(a.quality/100,2)*statusFactor*coreFactor*riskFactor*timingFactor*diversificationFactor;
    return {a,raw,current,cap,value:0};
  }).filter(x=>x.raw>0&&x.cap>.001).sort((a,b)=>b.raw-a.raw).slice(0,6);
  let remaining=intendedInvest;
  for(let pass=0;pass<12&&remaining>.001;pass++){
    const eligible=weighted.filter(x=>x.cap-x.value>.001);
    if(!eligible.length)break;
    const sum=eligible.reduce((t,x)=>t+x.raw,0);
    let allocated=0;
    for(const x of eligible){
      const room=x.cap-x.value;
      const add=Math.max(0,Math.min(room,remaining*x.raw/sum));
      x.value+=add;allocated+=add;
    }
    if(allocated<.001)break;
    remaining=Math.max(0,remaining-allocated);
  }
  const committed=weighted.reduce((sum,x)=>sum+x.value,0);
  const alloc=weighted.map(x=>({...x,weight:committed>0?x.value/committed:0,
    plan:entryPlan(x.a,statusForPlan(x.a),x.value)}))
    .filter(x=>x.value>=Math.min(5,amount*.02));
  const realCommit=alloc.reduce((sum,x)=>sum+x.value,0);
  return {amount,profile,objective,params:pp,reserveAmt:Math.max(0,amount-realCommit),
    investable:realCommit,alloc,snapshot:snap};
}
function statusForPlan(a){return a.status}
function entryPlan(a,status,value){
  let parts;
  if(status==='strong'||status==='confirmed')parts=[.45,.25,.30];
  else if(status==='candidate')parts=[.20,.35,.45];
  else parts=[0,.35,.65];
  return {
    now:value*parts[0],
    pullback:value*parts[1],
    confirm:value*parts[2],
    labels:['Agora','Em correção','Na confirmação']
  };
}

function allScenarios(amount){
  return [
    scenarioAllocation(amount,'conservative','protect'),
    scenarioAllocation(amount,'balanced','balance'),
    scenarioAllocation(amount,'aggressive','growth')
  ];
}

function statusClass(s){
  return s==='strong'||s==='confirmed'?'good':s==='candidate'?'candidate':s==='avoid'?'bad':s==='pending'?'pending':'watch';
}
function bar(label,val){
  const v=Math.round(clamp(val));
  return `<div class="mi-dim"><span>${label}<b>${v}</b></span><i><em style="width:${v}%"></em></i></div>`;
}
function portfolioNarrative(snap,reg){
  const lang=window.CriptoRadarI18n?.getLanguage?.()||'pt-BR';
  // Compose market commentary in the selected language, using the same numeric risk assessments.
  if(lang==='en'||lang==='es'){
    const english=lang==='en';
    if(!snap.total)return english?'Add your portfolio so Radar can assess concentration, aggregate risk and the impact of a new contribution.':'Añade tu cartera para que Radar evalúe la concentración, el riesgo agregado y el impacto de un nuevo aporte.';
    const bits=[];
    if(snap.health>=75)bits.push(english?'The portfolio is structurally healthy':'La cartera está estructuralmente saludable');
    else if(snap.health>=58)bits.push(english?'The portfolio has a moderate overall condition':'La cartera se encuentra en una condición intermedia');
    else bits.push(english?'The portfolio needs rebalancing before taking on more risk':'La cartera necesita reequilibrarse antes de aumentar el riesgo');
    if(snap.maxWeight>.45)bits.push(english?'one position has excessive weight':'una posición presenta concentración elevada');
    else if(snap.diversification>=70)bits.push(english?'diversification is adequate':'la diversificación es adecuada');
    if(snap.cashPct<.06)bits.push(english?'reserves are low':'las reservas son bajas');
    if(reg.key==='bear')bits.push(english?'the overall market calls for a defensive stance':'el mercado general exige una postura defensiva');
    else if(reg.key==='bull')bits.push(english?'the broader market regime is favorable':'el régimen general del mercado es favorable');
    return bits.join('; ')+'.';
  }
  if(!snap.total)return 'Adicione sua carteira para o Radar medir concentração, risco agregado e impacto de um novo aporte.';
  const bits=[];
  if(snap.health>=75)bits.push('A carteira está estruturalmente saudável');
  else if(snap.health>=58)bits.push('A carteira está em condição intermediária');
  else bits.push('A carteira merece reequilíbrio antes de aumentar risco');
  if(snap.maxWeight>.45)bits.push('há concentração elevada em uma posição');
  else if(snap.diversification>=70)bits.push('a diversificação está boa');
  if(snap.cashPct<.06)bits.push('a reserva está baixa');
  if(reg.key==='bear')bits.push('e o mercado geral pede postura defensiva');
  else if(reg.key==='bull')bits.push('com regime de mercado favorável');
  return bits.join('; ')+'.';
}

function render(){
  const root=$('marketIntelligenceCard'); if(!root)return;
  const prefs=readPrefs();
  const L=x=>window.CriptoRadarI18n?.t?.(x)||x;
  const aporteEl=$('aporte');
  const amount=Math.max(1,n(aporteEl?.value||prefs.amount||100));
  prefs.amount=amount; savePrefs(prefs);

  const snap=portfolioSnapshot(), reg=regime(), ranked=rankedUniverse();
  const btc=ranked.find(x=>x.symbol==='BTC')||scoreAsset('BTC');
  const top=ranked.slice(0,8);
  const avoid=ranked.filter(x=>x.status==='avoid'||x.riskScore>=75||x.dimensions.timing<38).slice(0,5);
  const rec=scenarioAllocation(amount,prefs.profile,prefs.objective);
  const scenarios=allScenarios(amount);

  root.innerHTML=`
  <div class="mi-head">
    <div><div class="mi-kicker">V19.5.5 • INTELIGÊNCIA DE MERCADO</div><div class="coin">🧠 Central de Mercado & Aporte</div>
    <div class="small">Cruza tendência, momentum, volume, liquidez, VWAP, força vs BTC, risco, regime e composição da sua carteira.</div></div>
    <div class="mi-live"><i></i> análise ativa</div>
  </div>

  <div class="mi-metrics">
    <div><span>Regime</span><b>${esc(reg.label||'—')}</b><small>${reg.key==='bear'?'Defensivo':reg.key==='bull'?'Favorável':'Seletivo'}</small></div>
    <div><span>BTC</span><b>${btc.ready?btc.quality+'/100':'—'}</b><small>${esc(btc.statusLabel)}</small></div>
    <div><span>Saúde da carteira</span><b>${snap.health==null?'—':snap.health+'/100'}</b><small>${esc(snap.risk)} risco</small></div>
    <div><span>Reserva atual</span><b>${snap.total?Math.round(snap.cashPct*100)+'%':'—'}</b><small>${snap.total?fmtBRL(snap.cash):'carteira vazia'}</small></div>
  </div>

  <div class="mi-narrative"><b>Leitura da IA/Radar</b><span>${esc(portfolioNarrative(snap,reg))}</span></div>

  <div class="mi-section">
    <div class="mi-section-head"><div><b>Simulação inteligente de aporte</b><span>Compare perfis antes de decidir como distribuir capital novo.</span></div></div>
    <div class="mi-controls">
      <label><span>Valor do aporte</span><input id="miAmount" type="number" min="1" inputmode="decimal" value="${amount}"></label>
      <label><span>Perfil de aporte</span><select id="miProfile">
        <option value="conservative"${prefs.profile==='conservative'?' selected':''}>Conservador</option>
        <option value="balanced"${prefs.profile==='balanced'?' selected':''}>Equilibrado</option>
        <option value="aggressive"${prefs.profile==='aggressive'?' selected':''}>Agressivo</option>
      </select></label>
      <label><span>Objetivo</span><select id="miObjective">
        <option value="protect"${prefs.objective==='protect'?' selected':''}>Proteção</option>
        <option value="balance"${prefs.objective==='balance'?' selected':''}>Equilíbrio</option>
        <option value="growth"${prefs.objective==='growth'?' selected':''}>Crescimento</option>
      </select></label>
      <label><span>Entrada</span><select id="miEntry">
        <option value="phased"${prefs.entry==='phased'?' selected':''}>Parcelada</option>
        <option value="confirmation"${prefs.entry==='confirmation'?' selected':''}>Só após confirmação</option>
        <option value="immediate"${prefs.entry==='immediate'?' selected':''}>Mais imediata</option>
      </select></label>
    </div>

    <div class="mi-scenarios">${scenarios.map(s=>scenarioCard(s,prefs.profile)).join('')}</div>
    ${scenarios.every(s=>!s.alloc.length)?'<p class="mi-scenarios-hint">Todos os perfis estão em espera porque não há compras tecnicamente confirmadas. Os perfis mudam limites e riscos, mas não inventam sinais.</p>':''}
  </div>

  <div class="mi-section">
    <div class="mi-section-head"><div><b>Divisão sugerida — ${esc(PROFILE[prefs.profile]?.label||'Equilibrado')}</b>
      <span>Reserva + ativos priorizados com limite de concentração.</span></div>
      <div class="mi-total">${fmtBRL(amount)}</div>
    </div>
    ${allocationHtml(rec,prefs.entry)}
  </div>

  <div class="mi-section">
    <div class="mi-section-head"><div><b>Ranking técnico do mercado</b><span>Qualidade do sinal, não previsão de lucro.</span></div></div>
    <div class="mi-ranking">${top.map(assetCard).join('')||'<div class="small">Aguardando dados técnicos suficientes…</div>'}</div>
  </div>

  <div class="mi-section">
    <div class="mi-section-head"><div><b>O que evitar ou esperar</b><span>Ativos com risco, timing ruim ou bloqueios técnicos.</span></div></div>
    <div class="mi-avoid">${avoid.length?avoid.map(x=>`<div><b>${esc(x.symbol)}</b><span>${esc(x.blocks[0]||x.cautions[0]||'timing desfavorável')}</span><em>${x.quality}/100</em></div>`).join(''):'<div class="small">Nenhum bloqueio forte entre os ativos analisados agora.</div>'}</div>
  </div>

  <div class="mi-disclaimer">Simulação informativa. O Cripto Radar não executa ordens, não garante lucro e não substitui avaliação financeira individual.</div>
  `;

  window.CriptoRadarI18n?.localizeNode?.(root);
  bind();
  updateHomeSummary(snap,reg,top);
}
function scenarioCard(s,selected){
  const name=PROFILE[s.profile].label;
  const tops=s.alloc.slice(0,3).map(x=>`${x.a.symbol} ${Math.round(s.amount>0?x.value/s.amount*100:0)}%`).join(' • ')||'Aguardar';
  return `<button type="button" class="mi-scenario ${selected===s.profile?'active':''}" data-mi-profile="${s.profile}">
    <span>${name}</span><b>Reserva ${s.amount?Math.round(s.reserveAmt/s.amount*100):100}%</b><small>${esc(tops)}</small>
  </button>`;
}
function allocationHtml(s,entryMode){
  if(!s.alloc.length){
    // O Radar nunca transforma candidatas em compras confirmadas só para preencher a simulação.
    const ready=rankedUniverse();
    const observations=ready.filter(a=>a.dataFresh&&a.ready&&a.status==='candidate'&&!a.canBuy)
      .slice(0,3);
    const waiting=ready.filter(a=>a.ready&&a.dataFresh&&!a.canBuy);
    const missing=observations.length?observations[0].missingConfirmations||[]:[];
    const watch=observations.length?`<div class="mi-watchlist"><strong>Ativos sob observação (não são compras)</strong>
      ${observations.map(a=>`<div class="mi-watch-row"><b>${esc(a.symbol)}</b><span>${a.quality}/100 · ${esc(a.statusLabel)}</span></div>`).join('')}
      <small>Exemplo do que falta para avançar: ${esc(missing.slice(0,2).join(' • ')||'confluência técnica e validação dos sinais')}. As entradas só entram na divisão após confirmação.</small></div>`:'';
    const why=waiting.length?`${waiting.length} ativo(s) monitorado(s) não passaram pelos critérios obrigatórios de compra.`:'Ainda não há dados técnicos suficientes e atualizados para liberar uma entrada.';
    return `<div class="mi-empty"><b>Reserva de ${fmtBRL(s.amount)} (100%) — aguardando confirmação</b>
      <span>${esc(why)} A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.</span>
      ${watch}<span class="mi-recheck">Aguarde nova leitura do mercado ou atualize os dados. Não há aporte obrigatório.</span></div>`;
  }
  const reservePct=s.amount?Math.round(s.reserveAmt/s.amount*100):100;
  let rows=s.alloc.map(x=>{
    let p=x.plan;
    if(entryMode==='confirmation')p={...p,now:0,pullback:x.value*.25,confirm:x.value*.75};
    if(entryMode==='immediate'&&(x.a.status==='confirmed'||x.a.status==='strong'))p={...p,now:x.value*.65,pullback:x.value*.15,confirm:x.value*.20};
    return `<div class="mi-alloc-row">
      <div class="mi-alloc-main"><b>${esc(x.a.symbol)}</b><span class="mi-status ${statusClass(x.a.status)}">${esc(x.a.statusLabel)}</span></div>
      <div class="mi-alloc-value"><b>${fmtBRL(x.value)}</b><span>${Math.round(s.amount>0?x.value/s.amount*100:0)}% do aporte</span></div>
      <div class="mi-alloc-score"><b>${x.a.quality}/100</b><span>qualidade</span></div>
      <div class="mi-tranches">
        <span><i>Agora</i><b>${fmtBRL(p.now)}</b></span>
        <span><i>Correção</i><b>${fmtBRL(p.pullback)}</b></span>
        <span><i>Confirmação</i><b>${fmtBRL(p.confirm)}</b></span>
      </div>
      <div class="mi-alloc-why">${esc(x.a.summary)}</div>
    </div>`;
  }).join('');
  return `<div class="mi-reserve"><span>🛡️ Reserva estratégica</span><b>${fmtBRL(s.reserveAmt)} • ${reservePct}%</b></div>${rows}`;
}
function assetCard(a){
  const positives=a.positives.slice(0,2).map(x=>`<span class="ok">✓ ${esc(x)}</span>`).join('');
  const cautions=[...a.blocks,...a.cautions].slice(0,2).map(x=>`<span class="warn">! ${esc(x)}</span>`).join('');
  return `<div class="mi-asset">
    <div class="mi-asset-head"><div><b>${esc(a.symbol)}</b><span>${fmtPct(a.change)} 24h</span></div>
      <div><strong>${a.quality}/100</strong><em class="${statusClass(a.status)}">${esc(a.statusLabel)}</em></div></div>
    <div class="mi-dims">
      ${bar('Tendência',a.dimensions.trend)}
      ${bar('Momentum',a.dimensions.momentum)}
      ${bar('Liquidez',a.dimensions.liquidity)}
      ${bar('Timing',a.dimensions.timing)}
      ${bar('Risco',a.dimensions.risk)}
    </div>
    <div class="mi-tags">${positives}${cautions}</div>
    <div class="mi-summary">${esc(a.summary)}</div>
    ${(!a.canBuy&&a.missingConfirmations?.length)?`<div class="mi-summary"><b>Para confirmar:</b> ${esc(a.missingConfirmations.slice(0,3).join(' • '))}</div>`:''}
  </div>`;
}
function bind(){
  const amount=$('miAmount'), profile=$('miProfile'), objective=$('miObjective'), entry=$('miEntry');
  const handler=()=>{
    const p=readPrefs();
    p.amount=Math.max(1,n(amount?.value||p.amount||100));
    p.profile=profile?.value||p.profile;
    p.objective=objective?.value||p.objective;
    p.entry=entry?.value||p.entry;
    savePrefs(p);
    const aporte=$('aporte'); if(aporte)aporte.value=p.amount;
    render();
  };
  amount?.addEventListener('change',handler);
  amount?.addEventListener('keyup',e=>{if(e.key==='Enter')handler()});
  profile?.addEventListener('change',handler);
  objective?.addEventListener('change',handler);
  entry?.addEventListener('change',handler);
  document.querySelectorAll('[data-mi-profile]').forEach(b=>b.addEventListener('click',()=>{
    const p=readPrefs();p.profile=b.dataset.miProfile;savePrefs(p);render();
  }));
}
function updateHomeSummary(snap,reg,top){
  try{
    const market=$('v17MarketSummary'); if(market){
      const cand=top.filter(x=>['candidate','confirmed','strong'].includes(x.status)).length;
      market.textContent=`${reg.label||'Mercado'} • ${cand} sinal(is) úteis`;
    }
    const ai=$('v17AiSummary'); if(ai)ai.textContent=snap.health==null?'Aguardando carteira':`Saúde ${snap.health}/100 • risco ${snap.risk}`;
  }catch(e){}
}

let lastSignature='';
function signature(){
  try{
    const syms=marketUniverse().slice(0,20).map(s=>{
      const m=getMarket(s),t=getTech(s);return `${s}:${Math.round(n(m?.change24h)*10)}:${Math.round(n(t?.score)||0)}`
    }).join('|');
    const w=(printWallet||[]).map(x=>`${x.symbol}:${x.qty}`).join('|');
    return syms+'#'+w+'#'+($('aporte')?.value||'');
  }catch(e){return String(Date.now())}
}
function tick(){
  const sig=signature();
  if(sig!==lastSignature){lastSignature=sig;render()}
}

/* ===== V18.6 • Confirmação convergente e diagnóstico da entrada =====
   Score NÃO é previsão de lucro. É necessário consenso com o motor V5.
*/
const baseScoreAsset = scoreAsset;
scoreAsset = function(rawSymbol){
  const s=norm(rawSymbol),a=baseScoreAsset(s),t=getTech(s),m=getMarket(s),r=regime();
  let legacy=null;
  try{if(legacyBuySignal)legacy=legacyBuySignal(s)}catch(e){}
  const marketFresh=(()=>{
    try{return typeof marketDataFresh==='function'?marketDataFresh(m):Boolean(m?.at&&Date.now()-Number(m.at)<120000)}
    catch(e){return false}
  })();
  const missing=[];
  const add=(condition,why)=>{if(condition&&!missing.includes(why))missing.push(why)};
  if(!a.ready||!t||!marketFresh){
    if(!a.ready||!t)missing.push('indicadores 15m, 4h e diário atualizados');
    if(!marketFresh)missing.push('cotação e volume de mercado atualizados');
    return {...a,status:'pending',statusLabel:'ANÁLISE PENDENTE',ready:false,dataFresh:false,canBuy:false,
      missingConfirmations:missing,summary:'Dados insuficientes: '+missing.join('; ')+'.'};
  }
  const cfg=typeof radarModeCfg==='function'?radarModeCfg():{buy:70,adx:20,vol:1.08,riskMax:75};
  const h4=t.h4?.structure?.key;
  const dayTrend=Number(t.d1?.trend);
  const v15=t.m15||{};
  const vr=Number(v15.vr), adx=Number(v15.adx), rsi=Number(v15.rsi), vwap=Number(v15.vwapPct);
  const rel=Number(t.relativeStrength), ch=Number(m?.change24h);
  const vol=Number(m?.volume), risk=Number(a.riskScore);
  const vp=volumePercentile(s);
  add(!t.bull,'tendência de alta alinhada entre os tempos gráficos');
  add(h4!=='bull','estrutura de alta HH/HL no gráfico 4h');
  add(!Number.isFinite(dayTrend)||dayTrend<0,'tendência diária favorável');
  add(r.key==='bear'||r.key==='wait','regime BTC/ETH favorável');
  add(!Number.isFinite(adx)||adx<Math.max(16,Number(cfg.adx)-3),'força ADX suficiente no 15m');
  add(!Number.isFinite(vr)||vr<Math.max(.85,Number(cfg.vol)-.15),'volume 15m confirmando a entrada');
  add(!Number.isFinite(vol)||vol<=0||vp<.35,'liquidez de mercado suficiente');
  add(!Number.isFinite(rsi)||rsi<38||rsi>=72,'RSI fora de extremo de compra/venda');
  add(!Number.isFinite(vwap)||vwap< -1.5||vwap>4,'preço próximo de zona saudável do VWAP');
  add(!Number.isFinite(ch)||ch>=12,'alta de 24h menos esticada (aguardar correção)');
  add(!Number.isFinite(rel)||rel< -2,'força relativa ao BTC');
  add(!Number.isFinite(risk)||risk>Number(cfg.riskMax),'risco dentro do perfil');
  add(Number(a.quality)<85,'qualidade técnica mínima de 85/100');
  add(!legacy||legacy.state!=='confirmed','confirmação final do motor técnico V5');
  if(Array.isArray(legacy?.hardBlocks))for(const why of legacy.hardBlocks.slice(0,2))add(true,why);
  if(Array.isArray(legacy?.softBlocks))for(const why of legacy.softBlocks.slice(0,2))add(true,why);
  const confirmed=missing.length===0&&['strong','confirmed'].includes(a.status);
  const status=confirmed?a.status:a.status==='avoid'?'avoid':a.quality>=70?'candidate':'watch';
  const label=confirmed?(status==='strong'?'SINAL FORTE DE COMPRA':'COMPRA CONFIRMADA'):
    status==='avoid'?'EVITAR ENTRADA':status==='candidate'?'CANDIDATA • AGUARDANDO':'OBSERVAR';
  const next=missing.slice(0,4).join('; ');
  const summary=confirmed?('Confluência confirmada no Radar V5 e no mercado; '+a.positives.slice(0,2).join(' e ')+'.'):
    (status==='avoid'?'Entrada bloqueada. ':'Sem compra confirmada. ')+(next?'Falta confirmar: '+next+'.':'Aguardar nova leitura.');
  return {...a,status,statusLabel:label,dataFresh:true,canBuy:confirmed,
    missingConfirmations:missing,summary,cautions:[...new Set([...(a.cautions||[]),...missing])].slice(0,6)};
};
// Uma só decisão para carteira, alertas, oportunidades e simulações.
if(legacyBuySignal){
  window.walletBuySignal=function(rawSymbol){
    const s=norm(rawSymbol),a=scoreAsset(s);
    let old=null;try{old=legacyBuySignal(s)}catch(e){}
    const core={score:a.quality,technicalReady:a.ready,hardBlocks:a.blocks||[],
      softBlocks:a.missingConfirmations||[],why:a.summary};
    if(!a.ready||!a.dataFresh)return {...core,label:'ANÁLISE PENDENTE',state:'pending',score:null};
    if(a.canBuy)return {...core,label:a.statusLabel,state:'confirmed',hardBlocks:[],softBlocks:[],
      why:a.summary+(old?.why?' • '+old.why:'')};
    if(a.status==='avoid')return {...core,label:'EVITAR ENTRADA',state:'blocked'};
    if(a.status==='candidate')return {...core,label:'CANDIDATA A COMPRA',state:'candidate'};
    return {...core,label:'OBSERVAR',state:'watch'};
  };
}

API.render=render;
API.scoreAsset=scoreAsset;
API.portfolioSnapshot=portfolioSnapshot;
API.scenarioAllocation=scenarioAllocation;
window.CriptoRadarMarketIntelligence=API;

document.addEventListener('DOMContentLoaded',()=>setTimeout(render,1600));
window.addEventListener('criptoradar:languagechange',()=>{try{render()}catch(e){}});
setTimeout(render,2200);
setInterval(tick,5000);
})();
