const crypto=require('crypto');
const qs=o=>new URLSearchParams(Object.entries(o).map(([k,v])=>[k,String(v)])).toString();
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
 const apiKey=String(req.body?.apiKey||'').trim(), apiSecret=String(req.body?.apiSecret||'').trim();
 if(!apiKey||!apiSecret)return res.status(400).json({ok:false,error:'Informe API Key e Secret Key'});
 try{
  const params={timestamp:Date.now(),recvWindow:5000}; const query=qs(params); const signature=crypto.createHmac('sha256',apiSecret).update(query).digest('hex');
  const r=await fetch('https://api.binance.com/api/v3/account?'+query+'&signature='+signature,{headers:{'X-MBX-APIKEY':apiKey}});
  const j=await r.json(); if(!r.ok)return res.status(r.status).json({ok:false,error:j?.msg||'Binance recusou a consulta'});
  const wallet=(j.balances||[]).map(b=>({symbol:b.asset,qty:Number(b.free||0)+Number(b.locked||0)})).filter(x=>x.qty>0 && !['BRL','USDT','USDC','FDUSD','TUSD'].includes(x.symbol));
  return res.status(200).json({ok:true,mode:'read-only',canTrade:!!j.canTrade,withdrawEnabled:false,wallet});
 }catch(e){return res.status(503).json({ok:false,error:'Falha ao consultar a Binance'});}
};
