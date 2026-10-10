const {kvReady,ensureVapid,saveSubscription}=require('./push-server-lib');
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
  if(!kvReady())return res.status(503).json({ok:false,error:'KV não configurado'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};if(!b.subscription?.endpoint)return res.status(400).json({ok:false,error:'Subscription inválida'});
    await ensureVapid();
    const payload={subscription:b.subscription,userAgent:String(req.headers['user-agent']||'').slice(0,300),lastSeenAt:new Date().toISOString()};
    if(b.context!==undefined)payload.context=b.context||{};if(b.mirror!==undefined)payload.mirror=b.mirror||{};if(b.prefs!==undefined)payload.prefs=b.prefs||{};if(b.language!==undefined)payload.language=String(b.language||'pt-BR').slice(0,12);if(b.pendingLockedTest!==undefined)payload.pendingLockedTest=!!b.pendingLockedTest;
    const rec=await saveSubscription(payload);
    return res.status(200).json({ok:true,id:rec.id,pendingLockedTest:!!rec.pendingLockedTest});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};
