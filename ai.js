const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pct=n=>(Number(n)||0).toFixed(2);
const BINANCE=['https://data-api.binance.vision','https://api.binance.com','https://api1.binance.com','https://api2.binance.com'];
const LEARNING_WINDOW_MS=15*60*1000;
async function fetchJson(url,ms=7500,options={}){
 const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
 try{const r=await fetch(url,{...options,signal:c.signal,headers:{Accept:'application/json','User-Agent':'Cripto-Radar/11',...(options.headers||{})}});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}
}
async function market(){
 try{
  let j=null;
  for(const group of [BINANCE.slice(0,2),BINANCE.slice(2)]){
   try{j=await Promise.any(group.map(async b=>{const x=await fetchJson(b+'/api/v3/ticker/24hr',6500);if(!Array.isArray(x)||!x.length)throw Error('vazio');return x}));break}catch(e){}
  }
  if(j){
   const rows=j.filter(x=>x?.symbol?.endsWith('USDT')).map(x=>({symbol:x.symbol.slice(0,-4),change24h:+x.priceChangePercent||0,volume:+x.quoteVolume||0,last:+x.lastPrice||0,source:'Binance'})).filter(x=>x.last>0&&x.volume>0);
   if(rows.length)return rows;
  }
 }catch(e){}
 try{
  const pages=await Promise.all([1,2].map(page=>fetchJson('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=250&page='+page+'&sparkline=false&price_change_percentage=24h',8000).catch(()=>[])));
  const seen=new Set(),out=[];
  for(const rows of pages)for(const x of Array.isArray(rows)?rows:[]){const symbol=String(x.symbol||'').toUpperCase();if(!symbol||seen.has(symbol))continue;seen.add(symbol);const last=+x.current_price,volume=+x.total_volume,change24h=+x.price_change_percentage_24h;if(last>0&&volume>0)out.push({symbol,change24h:Number.isFinite(change24h)?change24h:0,volume,last,source:'CoinGecko'})}
  if(out.length)return out;
 }catch(e){}
 throw Error('market');
}
async function globalMarket(){try{return (await fetchJson('https://api.coingecko.com/api/v3/global',6500))?.data||null}catch(e){return null}}
async function fearGreed(){try{return (await fetchJson('https://api.alternative.me/fng/?limit=1&format=json',6500))?.data?.[0]||null}catch(e){return null}}
async function kv(command){
 const u=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL,t=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!u||!t)return null;
 try{const j=await fetchJson(u,3500,{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(command)});return j?.result??null}catch(e){return null}
}
function probabilities(rows,g,fg){
 const btc=rows.find(x=>x.symbol==='BTC')||{},eth=rows.find(x=>x.symbol==='ETH')||{};
 const adv=rows.length?rows.filter(x=>x.change24h>0).length/rows.length:.5;
 const breadth=(adv-.5)*30,btcMove=clamp(btc.change24h||0,-10,10)*1.8,ethMove=clamp(eth.change24h||0,-10,10)*.8;
 const mc=clamp(Number(g?.market_cap_change_percentage_24h_usd)||0,-8,8)*1.5,fear=fg?clamp((Number(fg.value)-50)/50,-1,1)*5:0;
 let up=clamp(Math.round(45+breadth+btcMove+ethMove+mc+fear),12,78),down=clamp(Math.round(38-breadth-btcMove*.8-ethMove*.5-mc-fear),10,75);
 if(up+down>88){const k=88/(up+down);up=Math.round(up*k);down=Math.round(down*k)}
 const sideways=100-up-down,confidence=clamp(Math.round(48+Math.abs(up-down)*.7+(g?8:0)+(fg?5:0)),45,86);
 return {up,sideways,down,confidence,horizon:'curto prazo'};
}
function cleanWallet(raw){
 if(!Array.isArray(raw))return [];
 return raw.slice(0,100).map(w=>({
  symbol:String(w?.symbol||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,16),
  qty:Number(w?.qty)||0,priceBRL:Number(w?.priceBRL)||0,valueBRL:Number(w?.valueBRL)||0,positionPct:Number(w?.positionPct)||0,
  change24h:Number(w?.change24h)||0,volume24h:Number(w?.volume24h)||0,liquidityPct:Number(w?.liquidityPct)||0,
  direction:String(w?.direction||'').slice(0,80),reason:String(w?.reason||'').slice(0,500),
  buySignal:String(w?.buySignal||'').slice(0,80),buyState:String(w?.buyState||'').slice(0,30),buyScore:Number(w?.buyScore)||0,
  aiAction:String(w?.aiAction||'').slice(0,100),aiReason:String(w?.aiReason||'').slice(0,700),aiConfidence:Number(w?.aiConfidence)||0,
  canAdd:!!w?.canAdd,canReduce:!!w?.canReduce,dataFresh:w?.dataFresh!==false
 })).filter(w=>w.symbol);
}
function portfolioText(wallet,all){
 if(!wallet.length)return 'Sua carteira ainda não foi enviada para a IA nesta leitura.';
 const map=new Map(all.map(x=>[x.symbol,x]));let total=0;
 const ps=wallet.map(w=>{const v=Number(w.valueBRL)||0;total+=v;return {...w,server:map.get(String(w.symbol||'').toUpperCase())}}).sort((a,b)=>(b.valueBRL||0)-(a.valueBRL||0));
 const top=ps.slice(0,6).map(x=>{const share=total?100*(x.valueBRL||0)/total:0;return x.symbol+' '+share.toFixed(0)+'% da carteira, '+(x.server?pct(x.server.change24h):pct(x.change24h))+'% em 24h'+(x.direction?' • Radar: '+x.direction:'')}).join('; ');
 return 'Carteira: '+top+(total?' • valor aproximado R$ '+total.toLocaleString('pt-BR',{maximumFractionDigits:2}):'');
}
function cleanRadar(raw){
 if(!Array.isArray(raw))return [];
 return raw.slice(0,30).map(x=>({
  symbol:String(x?.symbol||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,16),
  change24h:Number(x?.change24h)||0,volume24h:Number(x?.volume24h)||0,score:Number(x?.score)||0,
  signal:String(x?.signal||'').slice(0,100),signalState:String(x?.signalState||'').slice(0,30),
  signalScore:Number(x?.signalScore)||0,reason:String(x?.reason||'').slice(0,500)
 })).filter(x=>x.symbol);
}
function portfolioPlan(wallet,radar,all){
 const items=wallet.map(w=>{
  let action=String(w.aiAction||w.direction||'AGUARDAR').toUpperCase();
  if(!w.dataFresh)action='AGUARDAR DADOS';
  const reason=String(w.aiReason||w.reason||'').trim()||'Aguardando confirmação do Radar.';
  let priority=1;
  if(w.canReduce||/VENDER|REDUZIR|REALIZAR/.test(action))priority=5;
  else if(w.canAdd||/APORTAR|COMPRA CONFIRMADA/.test(action))priority=4;
  else if(/MANTER/.test(action))priority=2;
  const concentration=Number(w.positionPct)||0;
  if(concentration>=40&&/APORTAR/.test(action)){action='MANTER • CONCENTRAÇÃO ALTA';priority=3}
  return {symbol:w.symbol,action,reason,confidence:clamp(Math.round(Number(w.aiConfidence)||Number(w.buyScore)||0),0,100),positionPct:+concentration.toFixed(1),priority};
 }).sort((a,b)=>b.priority-a.priority||b.confidence-a.confidence);
 const confirmedMarket=radar.filter(x=>x.signalState==='good'||/COMPRA CONFIRMADA|SINAL FORTE/.test(String(x.signal).toUpperCase())).sort((a,b)=>b.signalScore-a.signalScore).slice(0,3);
 const reductions=items.filter(x=>/VENDER|REDUZIR|REALIZAR/.test(x.action)).length;
 const buys=items.filter(x=>/^APORTAR$|COMPRA CONFIRMADA/.test(x.action)).length;
 const waiting=items.filter(x=>/AGUARDAR|ANÁLISE|OBSERVAR/.test(x.action)).length;
 let summary,reserve='';
 if(reductions)summary='A prioridade agora é proteção: '+reductions+' posição(ões) pedem redução/revisão antes de aumentar risco.';
 else if(buys)summary='Há '+buys+' posição(ões) da carteira com entrada confirmada pelo Radar.';
 else if(confirmedMarket.length)summary='Sua carteira não tem aporte liberado agora, mas existem '+confirmedMarket.length+' oportunidade(s) externa(s) confirmada(s) para observar.';
 else summary='Nenhuma compra está confirmada agora. A IA mantém o capital novo em espera em vez de forçar um aporte.';
 if(!buys)reserve='💵 Aporte novo: manter em reserva até surgir confirmação técnica.';
 return {summary,reserve,items:items.slice(0,8),confirmedMarket,counts:{buys,reductions,waiting}};
}
function portfolioPlanText(plan){
 if(!plan?.items?.length)return '';
 const rows=plan.items.slice(0,5).map(x=>x.symbol+': '+x.action+(x.confidence?' ('+x.confidence+'/100)':'')).join('; ');
 return plan.summary+' '+rows+'.'+(plan.reserve?' '+plan.reserve:'');
}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method&& !['GET','POST','HEAD'].includes(req.method))return res.status(405).json({ok:false,error:'Método não permitido'});
 try{
  const raw=await market(),stable=new Set(['USDT','USDC','FDUSD','TUSD','USDP','DAI','USDE','USDS','PYUSD','BUSD','BRL','EUR','TRY']);
  const base=raw.filter(x=>x.volume>0&&!stable.has(x.symbol)),byVol=[...base].sort((a,b)=>a.volume-b.volume),n=byVol.length;
  let w={momentum:.42,liquidity:.43,stability:.15},saved=await kv(['GET','radar:weights']);if(saved)try{w={...w,...JSON.parse(saved)}}catch(e){}
  const all=byVol.map((x,i)=>{const liq=n>1?i/(n-1):1,m=clamp((x.change24h+8)/20,0,1),st=1-clamp(Math.abs(x.change24h-3)/18,0,1);return{...x,score:Math.round(100*(w.momentum*m+w.liquidity*liq+w.stability*st)),liquidityPct:Math.round(liq*100)}}).sort((a,b)=>b.score-a.score),top=all.slice(0,8);
  const [g,fg]=await Promise.all([globalMarket(),fearGreed()]),probs=probabilities(all,g,fg),prevRaw=await kv(['GET','radar:last']);
  let learning={enabled:!!((process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL)&&(process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN)),evaluated:0,hits:0,windowMinutes:15,lastEvaluationMinutes:null};
  let prev=null;try{if(prevRaw)prev=JSON.parse(prevRaw)}catch(e){}
  const prevAt=Date.parse(prev?.at||''),elapsed=Number.isFinite(prevAt)?Date.now()-prevAt:Infinity;
  if(prev&&elapsed>=LEARNING_WINDOW_MS&&elapsed<24*60*60*1000){
   try{
    const map=new Map(all.map(x=>[x.symbol,x])),pairs=(prev.top||[]).map(old=>({old,cur:map.get(old.symbol)})).filter(x=>x.cur&&Number(x.old?.last)>0);
    learning.evaluated=pairs.length;learning.hits=pairs.filter(x=>Number(x.cur.last)>Number(x.old.last)).length;learning.lastEvaluationMinutes=Math.round(elapsed/60000);
    const hr=pairs.length?learning.hits/pairs.length:.5;
    if(pairs.length>=3){
     w.momentum=clamp(w.momentum+(hr>.7?.015:hr<.45?-.02:0),.25,.60);
     w.liquidity=clamp(w.liquidity+(hr<.45?.015:hr>.7?-.01:0),.25,.60);
     w.stability=Math.max(.05,1-w.momentum-w.liquidity);
     await kv(['SET','radar:weights',JSON.stringify(w)]);
    }
   }catch(e){}
  }
  const ctx=req.body?.context||{},wallet=cleanWallet(ctx.wallet),radar=cleanRadar(ctx.opportunities),plan=portfolioPlan(wallet,radar,all),at=new Date().toISOString();
  // Só gira a fotografia de aprendizado após a janela mínima; evita "aprender" a cada 30 s e oscilar pesos sem base temporal.
  if(!prev||elapsed>=LEARNING_WINDOW_MS||elapsed<0||elapsed>=24*60*60*1000)await kv(['SET','radar:last',JSON.stringify({at,top:top.slice(0,5),weights:w,probabilities:probs})]);
  if(wallet.length)await kv(['SET','radar:wallet:last',JSON.stringify({at,wallet})]);
  const q=String(req.body?.question||req.query?.question||'').trim().slice(0,500),ql=q.toLowerCase(),btc=all.find(x=>x.symbol==='BTC'),eth=all.find(x=>x.symbol==='ETH');
  const marketLine='Mercado agora: BTC '+(btc?pct(btc.change24h):'—')+'%, ETH '+(eth?pct(eth.change24h):'—')+'% em 24h'+(g?' • capitalização global '+pct(g.market_cap_change_percentage_24h_usd)+'% em 24h':'')+(fg?' • medo/ganância '+fg.value+' ('+fg.value_classification+')':'')+'.';
  const probLine=' Cenário estimado de curto prazo: alta '+probs.up+'%, lateral '+probs.sideways+'%, queda '+probs.down+'% (confiança '+probs.confidence+'/100).';
  let answer=marketLine+probLine+' '+portfolioText(wallet,all)+(wallet.length?'\n'+portfolioPlanText(plan):'');
  const symbol=(q.toUpperCase().match(/\b[A-Z0-9]{2,10}\b/g)||[]).find(s=>all.some(x=>x.symbol===s));
  if(symbol){const x=all.find(y=>y.symbol===symbol),held=wallet.find(y=>String(y.symbol).toUpperCase()===symbol);answer=symbol+': '+pct(x.change24h)+'% em 24h, volume US$ '+Math.round(x.volume).toLocaleString('pt-BR')+', liquidez no percentil '+x.liquidityPct+' e score '+x.score+'/100.'+(held?' Você possui '+held.qty+' '+symbol+(held.direction?'; o Radar está marcando '+held.direction+'.':'.'):' Esse ativo não aparece na carteira enviada nesta leitura.')+probLine}
  if(/carteira|portf[oó]lio|tenho|meus ativos/.test(ql))answer=portfolioText(wallet,all)+'\n'+portfolioPlanText(plan)+'\n'+marketLine+probLine;
  if(/aprendeu|aprendizado|acerto|mem[oó]ria/.test(ql))answer=learning.enabled?(learning.evaluated?'Memória ativa. Comparei '+learning.evaluated+' sinais de uma fotografia com pelo menos '+learning.windowMinutes+' minutos de intervalo; '+learning.hits+' avançaram. Os pesos são ajustados gradualmente.':'Memória ativa. A próxima avaliação só ocorre depois de uma janela mínima de '+learning.windowMinutes+' minutos para evitar aprendizado por ruído.'):'A análise está ativa, mas a memória permanente não está disponível nesta execução.';
  if(/risco|perigo/.test(ql)){const x=[...top].sort((a,b)=>Math.abs(b.change24h)-Math.abs(a.change24h))[0];answer=(x?'Maior cautela entre os destaques: '+x.symbol+', movimento de '+pct(x.change24h)+'% em 24h. ':'')+marketLine+probLine}
  if(/o que (fa[cç]o|fazer)|comprar|vender|aportar/.test(ql))answer=portfolioText(wallet,all)+'\n'+portfolioPlanText(plan)+'\n'+marketLine+probLine+' A IA não libera aporte quando o Radar ainda está em espera e não manda reduzir apenas por diferença de alocação.';
  res.status(200).json({ok:true,at,answer,top,weights:w,learning,probabilities:probs,portfolioPlan:plan,market:{btc24h:btc?.change24h??null,eth24h:eth?.change24h??null,globalCap24h:g?.market_cap_change_percentage_24h_usd??null,fearGreed:fg?{value:+fg.value,label:fg.value_classification}:null},contextReceived:{wallet:wallet.length,radar:radar.length}});
 }catch(e){res.status(503).json({ok:false,error:'Mercado indisponível',detail:String(e?.message||e),at:new Date().toISOString()})}
};
