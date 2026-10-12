const {getMarketState,kvReady}=require('./push-server-lib');
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  try{
    if(!kvReady())return res.status(200).json({ok:false,ready:false,error:'KV não configurado'});
    const s=await getMarketState();
    const at=Number(s?.at)||0;
    return res.status(200).json({ok:true,ready:true,lastRunAt:at||null,lastRunISO:at?new Date(at).toISOString():null,source:s?.source||null,ageSeconds:at?Math.max(0,Math.round((Date.now()-at)/1000)):null,lastAttemptAt:Number(s?.lastAttemptAt)||null,lastScanStatus:s?.lastScanStatus||null,lastScanError:s?.lastScanStatus==='failed'?String(s.lastScanError||'').slice(0,120):null});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};
