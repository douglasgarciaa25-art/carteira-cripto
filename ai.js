const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pct=n=>(Number(n)||0).toFixed(2);
async function market(){for(const b of ['https://data-api.binance.vision','https://api.binance.com'])try{const r=await fetch(b+'/api/v3/ticker/24hr');if(r.ok){const j=await r.json();if(Array.isArray(j))return j.filter(x=>x.symbol?.endsWith('USDT'))}}catch(e){}throw Error('market')}
async function globalMarket(){try{const r=await fetch('https://api.coingecko.com/api/v3/global');if(r.ok){const j=await r.json();return j.data||null}}catch(e){}return null}
async function fearGreed(){try{const r=await fetch('https://api.alternative.me/fng/?limit=1&format=json');if(r.ok){const j=await r.json();return j.data?.[0]||null}}catch(e){}return null}
async function kv(c){const u=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL,t=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;if(!u||!t)return null;try{const r=await fetch(u,{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(c)});return r.ok?(await r.json()).result:null}catch(e){return null}}
function probabilities(rows,g,fg){
 const btc=rows.find(x=>x.symbol==='BTC')||{}, eth=rows.find(x=>x.symbol==='ETH')||{};
 const adv=rows.length?rows.filter(x=>x.change24h>0).length/rows.length:.5;
 const breadth=(adv-.5)*30,btcMove=clamp(btc.change24h||0,-10,10)*1.8,ethMove=clamp(eth.change24h||0,-10,10)*.8;
 const mc=clamp(Number(g?.market_cap_change_percentage_24h_usd)||0,-8,8)*1.5;
 const fear=fg?clamp((Number(fg.value)-50)/50,-1,1)*5:0;
 let up=clamp(Math.round(45+breadth+btcMove+ethMove+mc+fear),12,78);
 let down=clamp(Math.round(38-breadth-btcMove*.8-ethMove*.5-mc-fear),10,75);
 if(up+down>88){const k=88/(up+down);up=Math.round(up*k);down=Math.round(down*k)}
 const sideways=100-up-down,confidence=clamp(Math.round(48+Math.abs(up-down)*.7+(g?8:0)+(fg?5:0)),45,86);
 return {up,sideways,down,confidence,horizon:'curto prazo'};
}
function portfolioText(wallet,all){
 if(!wallet.length)return 'Sua carteira ainda não foi enviada para a IA nesta leitura.';
 const map=new Map(all.map(x=>[x.symbol,x]));let total=0;
 const ps=wallet.map(w=>{const v=Number(w.valueBRL)||0;total+=v;const m=map.get(w.symbol);return {...w,server:m}});
 ps.sort((a,b)=>(b.valueBRL||0)-(a.valueBRL||0));
 const top=ps.slice(0,4).map(x=>{const share=total?100*(x.valueBRL||0)/total:0;return x.symbol+' '+share.toFixed(0)+'% da carteira, '+(x.server?pct(x.server.change24h):pct(x.change24h))+'% em 24h'+(x.direction?' • Radar: '+x.direction:'')}).join('; ');
 return 'Carteira: '+top+(total?' • valor aproximado R$ '+total.toLocaleString('pt-BR',{maximumFractionDigits:2}):'');
}
module.exports=async(req,res)=>{res.setHeader('Cache-Control','no-store');try{
 const raw=await market();
 const stable=new Set(['USDT','USDC','FDUSD','TUSD','DAI']);
 const base=raw.filter(x=>Number(x.quoteVolume)>0&&!stable.has(x.symbol.slice(0,-4))).map(x=>({symbol:x.symbol.slice(0,-4),change24h:+x.priceChangePercent||0,volume:+x.quoteVolume||0,last:+x.lastPrice||0}));
 const byVol=[...base].sort((a,b)=>a.volume-b.volume),n=byVol.length;
 let w={momentum:.42,liquidity:.43,stability:.15},s=await kv(['GET','radar:weights']);if(s)try{w={...w,...JSON.parse(s)}}catch(e){}
 const all=byVol.map((x,i)=>{const liq=n>1?i/(n-1):1,m=clamp((x.change24h+8)/20,0,1),st=1-clamp(Math.abs(x.change24h-3)/18,0,1);return{...x,score:Math.round(100*(w.momentum*m+w.liquidity*liq+w.stability*st)),liquidityPct:Math.round(liq*100)}}).sort((a,b)=>b.score-a.score),top=all.slice(0,8);
 const [g,fg]=await Promise.all([globalMarket(),fearGreed()]);
 const probs=probabilities(all,g,fg);
 const prev=await kv(['GET','radar:last']);let learning={enabled:!!((process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL)&&(process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN)),evaluated:0,hits:0};
 if(prev)try{const p=JSON.parse(prev),map=new Map(all.map(x=>[x.symbol,x])),ev=(p.top||[]).map(x=>map.get(x.symbol)).filter(Boolean);learning.evaluated=ev.length;learning.hits=ev.filter(x=>x.change24h>0).length;const hr=ev.length?learning.hits/ev.length:.5;if(ev.length>=3){w.momentum=clamp(w.momentum+(hr>.7?.015:hr<.45?-.02:0),.25,.60);w.liquidity=clamp(w.liquidity+(hr<.45?.015:hr>.7?-.01:0),.25,.60);w.stability=Math.max(.05,1-w.momentum-w.liquidity);await kv(['SET','radar:weights',JSON.stringify(w)])}}catch(e){}
 const ctx=req.body?.context||{},wallet=Array.isArray(ctx.wallet)?ctx.wallet.slice(0,100):[],radar=Array.isArray(ctx.opportunities)?ctx.opportunities.slice(0,20):[];
 const at=new Date().toISOString();await kv(['SET','radar:last',JSON.stringify({at,top:top.slice(0,5),weights:w,probabilities:probs})]);
 if(wallet.length)await kv(['SET','radar:wallet:last',JSON.stringify({at,wallet})]);
 const q=String(req.body?.question||req.query?.question||'').trim(),ql=q.toLowerCase(),lead=top[0],btc=all.find(x=>x.symbol==='BTC'),eth=all.find(x=>x.symbol==='ETH');
 const marketLine='Mercado agora: BTC '+(btc?pct(btc.change24h):'—')+'%, ETH '+(eth?pct(eth.change24h):'—')+'% em 24h'+(g?' • capitalização global '+pct(g.market_cap_change_percentage_24h_usd)+'% em 24h':'')+(fg?' • medo/ganância '+fg.value+' ('+fg.value_classification+')':'')+'.';
 const probLine=' Cenário estimado de curto prazo: alta '+probs.up+'%, lateral '+probs.sideways+'%, queda '+probs.down+'% (confiança '+probs.confidence+'/100).';
 let answer=marketLine+probLine+' '+portfolioText(wallet,all);
 const symbol=(q.toUpperCase().match(/\b[A-Z0-9]{2,10}\b/g)||[]).find(s=>all.some(x=>x.symbol===s));
 if(symbol){const x=all.find(y=>y.symbol===symbol),held=wallet.find(y=>y.symbol===symbol);answer=symbol+': '+pct(x.change24h)+'% em 24h, volume US$ '+Math.round(x.volume).toLocaleString('pt-BR')+', liquidez no percentil '+x.liquidityPct+' e score '+x.score+'/100.'+(held?' Você possui '+held.qty+' '+symbol+(held.direction?'; o Radar está marcando '+held.direction+'.':'.'):' Esse ativo não aparece na carteira enviada nesta leitura.')+probLine}
 if(/carteira|portf[oó]lio|tenho|meus ativos/.test(ql))answer=portfolioText(wallet,all)+'\n'+marketLine+probLine;
 if(/aprendeu|aprendizado|acerto|mem[oó]ria/.test(ql))answer=learning.enabled?'Memória ativa. Comparei '+learning.evaluated+' sinais anteriores; '+learning.hits+' estão positivos na leitura atual. Os pesos são ajustados gradualmente, e a última fotografia da carteira também pode ser preservada no banco.':'A análise está ativa, mas a memória permanente não está disponível nesta execução.';
 if(/risco|perigo/.test(ql)){const x=[...top].sort((a,b)=>Math.abs(b.change24h)-Math.abs(a.change24h))[0];answer=(x?'Maior cautela entre os destaques: '+x.symbol+', movimento de '+pct(x.change24h)+'% em 24h. ':'')+marketLine+probLine}
 if(/o que (fa[cç]o|fazer)|comprar|vender|aportar/.test(ql))answer=portfolioText(wallet,all)+'\n'+marketLine+probLine+' Use as probabilidades como cenário, não como garantia. Priorize risco, concentração e os sinais do Radar antes de decidir.';
 res.status(200).json({ok:true,at,answer,top,weights:w,learning,probabilities:probs,market:{btc24h:btc?.change24h??null,eth24h:eth?.change24h??null,globalCap24h:g?.market_cap_change_percentage_24h_usd??null,fearGreed:fg?{value:+fg.value,label:fg.value_classification}:null},contextReceived:{wallet:wallet.length,radar:radar.length}});
}catch(e){res.status(503).json({ok:false,error:'Mercado indisponível'})}};