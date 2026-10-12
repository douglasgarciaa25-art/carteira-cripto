/* Cripto Radar V19.6 — Tradução no servidor ANTES de criar as análises.
 * Nenhuma tradução automática de valores, símbolos ou identificadores técnicos.
 */
'use strict';
const labels={
 'pt-BR':{
  market:'Mercado agora',global:'capitalização global',fear:'medo/ganância',in24:'em 24h',short:'Cenário estimado de curto prazo',up:'alta',side:'lateral',down:'queda',conf:'confiança',
  noWallet:'Sua carteira ainda não foi enviada para a IA nesta leitura.',wallet:'Carteira',ofWallet:'da carteira',approx:'valor aproximado',radar:'Radar',
  nowait:'Nenhuma compra está confirmada agora. A IA mantém o capital novo em espera em vez de forçar um aporte.',
  protect:n=>'A prioridade agora é proteção: '+n+' posição(ões) pedem redução/revisão antes de aumentar risco.',
  buying:n=>'Há '+n+' posição(ões) da carteira com entrada confirmada pelo Radar.',
  external:n=>'Sua carteira não tem aporte liberado agora, mas existem '+n+' oportunidade(s) externa(s) confirmada(s) para observar.',
  reserve:'💵 Aporte novo: manter em reserva até surgir confirmação técnica.',
  warn:'A IA não libera aporte quando o Radar ainda está em espera e não manda reduzir apenas por diferença de alocação.',
  note:'Os sinais são informativos, não executam ordens e não garantem retorno.',
  liquidity:'liquidez no percentil',has:'Você possui',marked:'o Radar está marcando',notHeld:'Esse ativo não aparece na carteira enviada nesta leitura.',
  learningOff:'A análise está ativa, mas a memória permanente não está disponível nesta execução.',
  learningWait:n=>'Memória ativa. A próxima avaliação só ocorre depois de uma janela mínima de '+n+' minutos para evitar aprendizado por ruído.',
  learningDone:(n,m,h)=>`Memória ativa. Comparei ${n} sinais com pelo menos ${m} minutos de intervalo; ${h} avançaram. Os pesos são ajustados gradualmente.`,
  caution:'Maior cautela entre os destaques',movement:'movimento de',
  baseReason:'Análise técnica do Radar; confirme condições de mercado e risco antes de operar.',
  concentration:'Concentração alta; revise o risco antes de aumentar a exposição.',
  action:{'AGUARDAR':'AGUARDAR','MANTER':'MANTER','AGUARDAR DADOS':'AGUARDAR DADOS','AGUARDAR ENTRADA':'AGUARDAR ENTRADA','AVALIAR ALTA':'AVALIAR ALTA','COMPRAR / APORTAR':'COMPRAR / APORTAR','VENDER / REDUZIR':'VENDER / REDUZIR','ATENÇÃO PARA VENDA':'ATENÇÃO PARA VENDA','MANTER • CONCENTRAÇÃO ALTA':'MANTER • CONCENTRAÇÃO ALTA','COMPRA CONFIRMADA':'COMPRA CONFIRMADA'}
 },
 en:{
  market:'Market now',global:'global market cap',fear:'fear/greed',in24:'over 24h',short:'Estimated short-term scenario',up:'up',side:'sideways',down:'down',conf:'confidence',
  noWallet:'No portfolio has been shared with the AI for this reading.',wallet:'Portfolio',ofWallet:'of portfolio',approx:'approximate value',radar:'Radar',
  nowait:'No buy is confirmed right now. The AI keeps new funds in reserve rather than forcing an entry.',
  protect:n=>`Risk protection comes first: ${n} position(s) need review before increasing exposure.`,
  buying:n=>`${n} portfolio position(s) have Radar-confirmed entry conditions.`,
  external:n=>`No new portfolio allocation is approved, but ${n} confirmed external opportunity(ies) can be monitored.`,
  reserve:'💵 New contributions: keep funds in reserve until technical confirmation.',
  warn:'The AI does not allow new contributions while Radar is waiting and does not suggest reducing solely due to allocation differences.',
  note:'Signals are informational, do not execute orders, and do not guarantee returns.',
  liquidity:'liquidity percentile',has:'You hold',marked:'Radar currently indicates',notHeld:'This asset is not part of the portfolio shared in this reading.',
  learningOff:'Analysis is active, but persistent memory is not available for this session.',
  learningWait:n=>`Memory is active. The next evaluation needs at least ${n} minutes to avoid learning from noise.`,
  learningDone:(n,m,h)=>`Memory is active. I compared ${n} signals at least ${m} minutes apart; ${h} advanced. Weights are adjusted gradually.`,
  caution:'Highest caution among highlighted assets',movement:'24h move of',
  baseReason:'Radar technical assessment; verify market conditions and risk before trading.',
  concentration:'High concentration; review risk before increasing exposure.',
  action:{'AGUARDAR':'WAIT','MANTER':'HOLD','AGUARDAR DADOS':'WAIT FOR DATA','AGUARDAR ENTRADA':'WAIT FOR ENTRY','AVALIAR ALTA':'REVIEW STRONG RISE','COMPRAR / APORTAR':'BUY / ADD FUNDS','VENDER / REDUZIR':'SELL / REDUCE','ATENÇÃO PARA VENDA':'WATCH SELL PRESSURE','MANTER • CONCENTRAÇÃO ALTA':'HOLD • HIGH CONCENTRATION','COMPRA CONFIRMADA':'CONFIRMED BUY'}
 },
 es:{
  market:'Mercado ahora',global:'capitalización global',fear:'miedo/codicia',in24:'en 24 h',short:'Escenario estimado a corto plazo',up:'alza',side:'lateral',down:'baja',conf:'confianza',
  noWallet:'No se ha enviado ninguna cartera a la IA en esta lectura.',wallet:'Cartera',ofWallet:'de la cartera',approx:'valor aproximado',radar:'Radar',
  nowait:'No hay compras confirmadas ahora. La IA mantiene el capital nuevo en reserva en lugar de forzar una entrada.',
  protect:n=>`La protección del riesgo es prioritaria: ${n} posición(es) necesitan revisión antes de aumentar la exposición.`,
  buying:n=>`Hay ${n} posición(es) de la cartera con entradas confirmadas por Radar.`,
  external:n=>`No hay aportes aprobados para la cartera, pero puedes vigilar ${n} oportunidad(es) externa(s) confirmada(s).`,
  reserve:'💵 Aporte nuevo: mantener en reserva hasta una confirmación técnica.',
  warn:'La IA no permite aportes mientras Radar esté esperando ni aconseja reducir solo por diferencias de distribución.',
  note:'Las señales son informativas, no ejecutan órdenes ni garantizan ganancias.',
  liquidity:'percentil de liquidez',has:'Tienes',marked:'Radar indica',notHeld:'Este activo no figura en la cartera compartida en esta lectura.',
  learningOff:'El análisis está activo, pero la memoria persistente no está disponible en esta sesión.',
  learningWait:n=>`La memoria está activa. La próxima evaluación requiere al menos ${n} minutos para evitar aprender del ruido.`,
  learningDone:(n,m,h)=>`La memoria está activa. Comparé ${n} señales separadas por al menos ${m} minutos; ${h} avanzaron. Los pesos se ajustan gradualmente.`,
  caution:'Mayor precaución entre los activos destacados',movement:'movimiento en 24 h de',
  baseReason:'Evaluación técnica de Radar; verifica condiciones del mercado y riesgo antes de operar.',
  concentration:'Alta concentración; revisa el riesgo antes de aumentar la exposición.',
  action:{'AGUARDAR':'ESPERAR','MANTER':'MANTENER','AGUARDAR DADOS':'ESPERAR DATOS','AGUARDAR ENTRADA':'ESPERAR ENTRADA','AVALIAR ALTA':'REVISAR SUBIDA FUERTE','COMPRAR / APORTAR':'COMPRAR / APORTAR','VENDER / REDUZIR':'VENDER / REDUCIR','ATENÇÃO PARA VENDA':'ATENCIÓN A LA PRESIÓN VENDEDORA','MANTER • CONCENTRAÇÃO ALTA':'MANTENER • ALTA CONCENTRACIÓN','COMPRA CONFIRMADA':'COMPRA CONFIRMADA'}
 }
};
function locale(lang){return labels[lang]||labels['pt-BR']}
function translateAction(action,lang){const val=String(action||'');return locale(lang).action[val]||val}
function formatPlan(plan,lang){
 if(lang==='pt-BR')return plan;
 const t=locale(lang),{buys=0,reductions=0}=plan.counts||{},external=plan.confirmedMarket?.length||0;
 const summary=reductions?t.protect(reductions):buys?t.buying(buys):external?t.external(external):t.nowait;
 const items=(plan.items||[]).map(x=>({...x,action:translateAction(x.action,lang),reason:x.action?.includes('CONCENTRAÇÃO')?t.concentration:t.baseReason}));
 return {...plan,summary,reserve:buys?'':t.reserve,items};
}
function portfolioLine(wallet,all,lang){
 const t=locale(lang);if(!wallet.length)return t.noWallet;
 const map=new Map(all.map(x=>[x.symbol,x])),total=wallet.reduce((s,w)=>s+(Number(w.valueBRL)||0),0);
 const top=[...wallet].sort((a,b)=>(b.valueBRL||0)-(a.valueBRL||0)).slice(0,6).map(w=>{
  const change=map.get(w.symbol)?.change24h??w.change24h;
  const position=total?100*(Number(w.valueBRL)||0)/total:0;
  const dir=w.direction?' • '+t.radar+': '+translateAction(w.direction,lang):'';
  return `${w.symbol} ${position.toFixed(0)}% ${t.ofWallet}, ${Number(change||0).toFixed(2)}% ${t.in24}${dir}`;
 }).join('; ');
 return t.wallet+': '+top+(total?' • '+t.approx+' R$ '+total.toLocaleString(lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',{maximumFractionDigits:2}):'');
}
function planLine(plan,lang){if(!plan?.items?.length)return '';
 const rows=plan.items.slice(0,5).map(x=>x.symbol+': '+x.action+(x.confidence?' ('+x.confidence+'/100)':'')).join('; ');
 return plan.summary+' '+rows+'.'+(plan.reserve?' '+plan.reserve:'');
}
function marketLine({btc,eth,g,fg},lang){const t=locale(lang);const p=x=>Number(x||0).toFixed(2);
 const classifications={en:{'Extreme Fear':'Extreme Fear','Fear':'Fear','Neutral':'Neutral','Greed':'Greed','Extreme Greed':'Extreme Greed'},'pt-BR':{'Extreme Fear':'Medo extremo','Fear':'Medo','Neutral':'Neutro','Greed':'Ganância','Extreme Greed':'Ganância extrema'},es:{'Extreme Fear':'Miedo extremo','Fear':'Miedo','Neutral':'Neutro','Greed':'Codicia','Extreme Greed':'Codicia extrema'}};
 const mood=fg?classifications[lang]?.[fg.value_classification]||fg.value_classification:null;
 return `${t.market}: BTC ${btc?p(btc.change24h):'—'}%, ETH ${eth?p(eth.change24h):'—'}% ${t.in24}`+
  (g?' • '+t.global+' '+p(g.market_cap_change_percentage_24h_usd)+'% '+t.in24:'')+
  (fg?' • '+t.fear+' '+fg.value+' ('+mood+')':'')+'.';}
function probabilityLine(probs,lang){const t=locale(lang);
 return ` ${t.short}: ${t.up} ${probs.up}%, ${t.side} ${probs.sideways}%, ${t.down} ${probs.down}% (${t.conf} ${probs.confidence}/100).`;
}
module.exports={locale,translateAction,formatPlan,portfolioLine,planLine,marketLine,probabilityLine};
