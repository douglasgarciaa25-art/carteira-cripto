const SOURCES=[
  'https://data-api.binance.vision',
  'https://api.binance.com',
  'https://api1.binance.com',
  'https://api2.binance.com',
  'https://api3.binance.com',
  'https://api4.binance.com'
];
async function fetchJson(url,ms=7500){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(url,{signal:c.signal,headers:{Accept:'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}
}
async function binanceTickers(){
  for(const base of SOURCES){
    try{const j=await fetchJson(base+'/api/v3/ticker/24hr');if(Array.isArray(j)&&j.length)return {rows:j,source:base}}catch(e){}
  }
  throw Error('Binance indisponível');
}
async function usdBrl(){
  for(const base of SOURCES){
    try{const j=await fetchJson(base+'/api/v3/ticker/price?symbol=USDTBRL',4500);const p=Number(j?.price);if(Number.isFinite(p)&&p>0)return p}catch(e){}
  }
  try{const j=await fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl',6000);const p=Number(j?.tether?.brl);if(Number.isFinite(p)&&p>0)return p}catch(e){}
  return 0;
}
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store, max-age=0');
  try{
    const [{rows,source},brl]=await Promise.all([binanceTickers(),usdBrl()]);
    const base=rows.filter(x=>x?.symbol?.endsWith('USDT')&&Number(x.quoteVolume)>0).map(x=>({
      symbol:x.symbol.slice(0,-4),
      change24h:Number(x.priceChangePercent)||0,
      volume:Number(x.quoteVolume)||0,
      last:Number(x.lastPrice)||0
    })).filter(x=>x.symbol&&x.symbol.length<=15&&x.last>0);
    const byVol=[...base].sort((a,b)=>a.volume-b.volume),n=byVol.length;
    const liq=new Map(byVol.map((x,i)=>[x.symbol,n>1?Math.round(i/(n-1)*100):100]));
    const assets=base.map(x=>({...x,liquidityPct:liq.get(x.symbol)||0}));
    res.status(200).json({ok:true,at:new Date().toISOString(),source,usdbrl:brl,assets});
  }catch(e){
    res.status(503).json({ok:false,error:'Mercado indisponível',detail:String(e?.message||e)});
  }
};
