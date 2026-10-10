const {kvReady,ensureVapid}=require('./push-server-lib');
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  if(!kvReady())return res.status(503).json({ok:false,ready:false,storage:false,error:'Armazenamento KV não configurado na Vercel'});
  try{const v=await ensureVapid();return res.status(200).json({ok:true,ready:true,storage:true,publicKey:v.publicKey,scheduler:'supabase-1m',version:'v15.1'});}
  catch(e){return res.status(503).json({ok:false,ready:false,storage:true,error:String(e?.message||e)});}
};
