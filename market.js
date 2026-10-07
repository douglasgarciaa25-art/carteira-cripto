const BINANCE_SOURCES=[
  'https://data-api.binance.vision',
  'https://api.binance.com',
  'https://api1.binance.com',
  'https://api2.binance.com',
  'https://api3.binance.com',
  'https://api4.binance.com'
];

const mem={snapshot:null,snapshotAt:0,klines:new Map(),prices:new Map()};
const SNAPSHOT_TTL=3500, STALE_SNAPSHOT_MAX=15*60*1000, KLINES_TTL=20000, PRICE_TTL=2500;
const STABLE=new Set(['USDT','USDC','FDUSD','TUSD','USDP','DAI','USDE','USDS','PYUSD','BUSD','BRL','EUR','TRY']);

function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function safeSymbol(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,24)}
function safeInterval(v){const s=String(v||'');return /^(1m|3m|5m|15m|30m|1h|2h|4h|6h|8h|12h|1d|3d|1w|1M)$/.test(s)?s:'15m'}
function putBounded(map,key,value,max=80){map.set(key,value);while(map.size>max)map.delete(map.keys().next().value)}
async function fetchJson(url,ms=7500){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
  try{
    const r=await fetch(url,{signal:c.signal,headers:{Accept:'application/json','User-Agent':'Cripto-Radar/11'}});
    if(!r.ok)throw Error('HTTP '+r.status);
    return await r.json();
  }finally{clearTimeout(t)}
}
async function firstJson(path,ms=7500,validate=()=>true){
  for(const group of [BINANCE_SOURCES.slice(0,2),BINANCE_SOURCES.slice(2)]){
    const jobs=group.map(async base=>{
      const json=await fetchJson(base+path,ms);
      if(!validate(json))throw Error('resposta inválida');
      return {json,source:base};
    });
    try{return await Promise.any(jobs)}catch(e){}
  }
  throw Error('Binance indisponível');
}
async function usdBrl(){
  try{
    const {json}=await firstJson('/api/v3/ticker/price?symbol=USDTBRL',4500,j=>Number(j?.price)>0);
    const p=Number(json.price);if(p>0)return p;
  }catch(e){}
  try{
    const j=await fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl',6000);
    const p=Number(j?.tether?.brl);if(Number.isFinite(p)&&p>0)return p;
  }catch(e){}
  return 0;
}
function finalizeAssets(base){
  const byVol=[...base].filter(x=>x.volume>0&&!STABLE.has(x.symbol)).sort((a,b)=>a.volume-b.volume),n=byVol.length;
  const liq=new Map(byVol.map((x,i)=>[x.symbol,n>1?Math.round(i/(n-1)*100):100]));
  return base.map(x=>({...x,liquidityPct:STABLE.has(x.symbol)?0:(liq.get(x.symbol)||0)}));
}
async function snapshotFromBinance(){
  const {json:rows,source}=await firstJson('/api/v3/ticker/24hr',8000,j=>Array.isArray(j)&&j.length>0);
  const base=rows.filter(x=>x?.symbol?.endsWith('USDT')&&Number(x.quoteVolume)>0).map(x=>({
    symbol:x.symbol.slice(0,-4),name:x.symbol.slice(0,-4),change24h:Number(x.priceChangePercent)||0,
    volume:Number(x.quoteVolume)||0,last:Number(x.lastPrice)||0
  })).filter(x=>x.symbol&&x.symbol.length<=15&&x.last>0);
  if(!base.length)throw Error('Binance sem ativos');
  return {assets:finalizeAssets(base),source:'Binance '+source.replace(/^https?:\/\//,'')};
}
async function snapshotFromCoinGecko(){
  const pages=await Promise.all([1,2].map(page=>fetchJson('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=250&page='+page+'&sparkline=false&price_change_percentage=24h',8000).catch(()=>[])));
  const seen=new Set(),base=[];
  for(const rows of pages){
    if(!Array.isArray(rows))continue;
    for(const x of rows){
      const symbol=String(x?.symbol||'').toUpperCase();
      if(!symbol||seen.has(symbol))continue;seen.add(symbol);
      const last=Number(x.current_price),volume=Number(x.total_volume),change24h=Number(x.price_change_percentage_24h);
      if(!(last>0)||!(volume>0))continue;
      base.push({symbol,name:String(x.name||symbol),change24h:Number.isFinite(change24h)?change24h:0,volume,last});
    }
  }
  if(!base.length)throw Error('CoinGecko vazio');
  return {assets:finalizeAssets(base),source:'CoinGecko'};
}
async function getSnapshot(){
  if(mem.snapshot&&Date.now()-mem.snapshotAt<SNAPSHOT_TTL)return mem.snapshot;
  try{
    let core;try{core=await snapshotFromBinance()}catch(e){core=await snapshotFromCoinGecko()}
    const brl=await usdBrl();
    mem.snapshot={ok:true,stale:false,at:new Date().toISOString(),source:core.source,usdbrl:brl,assets:core.assets};
    mem.snapshotAt=Date.now();return mem.snapshot;
  }catch(e){
    if(mem.snapshot&&Date.now()-mem.snapshotAt<STALE_SNAPSHOT_MAX){
      return {...mem.snapshot,stale:true,warning:'Fontes ao vivo indisponíveis; última leitura preservada.'};
    }
    throw e;
  }
}
async function getPrice(symbol){
  symbol=safeSymbol(symbol).replace(/USDT$/,'');if(!symbol)throw Error('Símbolo inválido');
  const cached=mem.prices.get(symbol);if(cached&&Date.now()-cached.at<PRICE_TTL)return cached.value;
  try{
    const {json,source}=await firstJson('/api/v3/ticker/price?symbol='+encodeURIComponent(symbol+'USDT'),5500,j=>Number(j?.price)>0);
    const price=Number(json.price);
    const value={ok:true,symbol,price,source:'Binance '+source.replace(/^https?:\/\//,''),at:new Date().toISOString()};
    putBounded(mem.prices,symbol,{at:Date.now(),value},120);return value;
  }catch(e){
    const snap=await getSnapshot(),x=snap.assets.find(a=>a.symbol===symbol);
    if(x?.last>0)return {ok:true,symbol,price:x.last,source:snap.source,at:snap.at,stale:!!snap.stale};
    throw e;
  }
}
async function getKlines(pair,interval,limit){
  pair=safeSymbol(pair);interval=safeInterval(interval);limit=clamp(Number(limit)||100,40,3000);
  if(!pair)throw Error('Par inválido');
  const key=pair+'|'+interval+'|'+limit,cached=mem.klines.get(key);
  if(cached&&Date.now()-cached.at<KLINES_TTL)return cached.value;

  let remaining=limit,endTime=null,rows=[],source='';
  while(remaining>0){
    const chunk=Math.min(1000,remaining);
    const qs='?symbol='+encodeURIComponent(pair)+'&interval='+encodeURIComponent(interval)+'&limit='+chunk+(endTime?'&endTime='+endTime:'');
    const r=await firstJson('/api/v3/klines'+qs,9000,j=>Array.isArray(j)&&j.length>=2);
    source=source||r.source;
    const batch=r.json;
    rows=batch.concat(rows);
    const first=Number(batch[0]?.[0]);
    if(!Number.isFinite(first)||batch.length<chunk)break;
    endTime=first-1;remaining-=batch.length;
    if(batch.length===0)break;
  }
  const uniq=[...new Map(rows.map(x=>[Number(x?.[0]),x])).values()].sort((a,b)=>Number(a?.[0])-Number(b?.[0])).slice(-limit);
  if(uniq.length<2)throw Error('Candles indisponíveis');
  const value={ok:true,pair,interval,rows:uniq,source:'Binance '+source.replace(/^https?:\/\//,''),at:new Date().toISOString(),requested:limit,returned:uniq.length};
  putBounded(mem.klines,key,{at:Date.now(),value},60);return value;
}
async function getDerivatives(symbol){
  symbol=safeSymbol(symbol).replace(/USDT$/,'');if(!symbol)throw Error('Símbolo inválido');
  const pair=symbol+'USDT',base='https://fapi.binance.com';
  const [premiumR,oiR,ratioR]=await Promise.allSettled([
    fetchJson(base+'/fapi/v1/premiumIndex?symbol='+encodeURIComponent(pair),6500),
    fetchJson(base+'/fapi/v1/openInterest?symbol='+encodeURIComponent(pair),6500),
    fetchJson(base+'/futures/data/globalLongShortAccountRatio?symbol='+encodeURIComponent(pair)+'&period=5m&limit=2',6500)
  ]);
  const premium=premiumR.status==='fulfilled'?premiumR.value:null,oi=oiR.status==='fulfilled'?oiR.value:null,ratio=ratioR.status==='fulfilled'?ratioR.value:null;
  const funding=Number(premium?.lastFundingRate)*100,openInterest=Number(oi?.openInterest),longShort=Array.isArray(ratio)&&ratio.length?Number(ratio[ratio.length-1]?.longShortRatio):NaN;
  if(!Number.isFinite(funding)&&!Number.isFinite(openInterest)&&!Number.isFinite(longShort))throw Error('Derivativos indisponíveis');
  return {ok:true,symbol,funding:Number.isFinite(funding)?funding:null,openInterest:Number.isFinite(openInterest)?openInterest:null,longShort:Number.isFinite(longShort)?longShort:null,partial:[premiumR,oiR,ratioR].some(x=>x.status!=='fulfilled'),source:'Binance Futures',at:new Date().toISOString()};
}

module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method&& !['GET','HEAD'].includes(req.method))return res.status(405).json({ok:false,error:'Método não permitido'});
  try{
    const kind=String(req.query?.kind||'snapshot').toLowerCase();
    if(kind==='price')return res.status(200).json(await getPrice(req.query?.symbol));
    if(kind==='klines')return res.status(200).json(await getKlines(req.query?.pair||req.query?.symbol,req.query?.interval,req.query?.limit));
    if(kind==='derivatives')return res.status(200).json(await getDerivatives(req.query?.symbol));
    return res.status(200).json(await getSnapshot());
  }catch(e){
    res.status(503).json({ok:false,error:'Mercado indisponível',detail:String(e?.message||e),at:new Date().toISOString()});
  }
};
