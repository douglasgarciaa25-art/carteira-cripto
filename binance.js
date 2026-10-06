const crypto=require('crypto');
const BASE='https://api.binance.com';
function env(){const key=process.env.BINANCE_API_KEY,secret=process.env.BINANCE_SECRET_KEY;if(!key||!secret)throw new Error('Configure BINANCE_API_KEY e BINANCE_SECRET_KEY na Vercel.');return {key,secret};}
function sign(params,secret){const q=new URLSearchParams(params).toString();const sig=crypto.createHmac('sha256',secret).update(q).digest('hex');return q+'&signature='+sig;}
async function signed(path,method='GET',params={}){const {key,secret}=env();const qs=sign({...params,recvWindow:'5000',timestamp:String(Date.now())},secret);const r=await fetch(BASE+path+'?'+qs,{method,headers:{'X-MBX-APIKEY':key,'Accept':'application/json'}});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.msg||('Binance HTTP '+r.status));return data;}
async function pub(path){const r=await fetch(BASE+path,{headers:{Accept:'application/json'}});const d=await r.json();if(!r.ok)throw new Error(d.msg||'Falha Binance');return d;}
function cleanSymbol(s){s=String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!s)throw new Error('Símbolo inválido.');return s.endsWith('USDT')?s:s+'USDT';}
function floorStep(v,step){const n=Number(v),s=Number(step);if(!Number.isFinite(n)||n<=0)return 0;if(!Number.isFinite(s)||s<=0)return n;const p=Math.max(0,(String(step).split('.')[1]||'').replace(/0+$/,'').length);return Number((Math.floor((n+1e-12)/s)*s).toFixed(p));}
module.exports=async(req,res)=>{res.setHeader('Cache-Control','no-store');if(req.method==='OPTIONS')return res.status(204).end();try{
 const action=String((req.method==='GET'?req.query?.action:req.body?.action)||'balance');
 if(action==='balance'){
   const a=await signed('/api/v3/account');
   const balances=(a.balances||[]).map(x=>({asset:x.asset,free:Number(x.free),locked:Number(x.locked),total:Number(x.free)+Number(x.locked)})).filter(x=>x.total>0);
   return res.status(200).json({ok:true,canTrade:!!a.canTrade,balances});
 }
 if(action==='permissions'){
   const p=await signed('/sapi/v1/account/apiRestrictions');
   return res.status(200).json({ok:true,enableReading:!!p.enableReading,enableSpotAndMarginTrading:!!p.enableSpotAndMarginTrading,enableWithdrawals:!!p.enableWithdrawals});
 }
 if(action==='order'){
   if(req.method!=='POST')return res.status(405).json({ok:false,error:'Use POST.'});
   const side=String(req.body?.side||'').toUpperCase();if(!['BUY','SELL'].includes(side))throw new Error('Lado da ordem inválido.');
   const symbol=cleanSymbol(req.body?.symbol);
   const info=await pub('/api/v3/exchangeInfo?symbol='+encodeURIComponent(symbol));const si=info.symbols?.[0];if(!si||si.status!=='TRADING')throw new Error('Par não disponível para negociação.');
   const params={symbol,side,type:'MARKET',newOrderRespType:'FULL'};
   if(side==='BUY'){
     const quote=Number(req.body?.quoteOrderQty);if(!Number.isFinite(quote)||quote<=0)throw new Error('Informe o valor em USDT para comprar.');params.quoteOrderQty=String(quote);
   }else{
     let qty=Number(req.body?.quantity);if(!Number.isFinite(qty)||qty<=0)throw new Error('Informe a quantidade para vender.');const lot=si.filters?.find(f=>f.filterType==='LOT_SIZE');qty=floorStep(qty,lot?.stepSize);if(qty<=0)throw new Error('Quantidade abaixo do mínimo permitido.');params.quantity=String(qty);
   }
   const order=await signed('/api/v3/order','POST',params);return res.status(200).json({ok:true,order});
 }
 return res.status(400).json({ok:false,error:'Ação inválida.'});
}catch(e){return res.status(400).json({ok:false,error:e.message||'Falha na Binance'});}};
