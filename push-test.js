const {saveSubscription,sendPush}=require('./push-server-lib');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};if(!b.subscription?.endpoint)return res.status(400).json({ok:false,error:'Subscription inválida'});
  const rec=await saveSubscription({subscription:b.subscription,context:b.context||{},mirror:b.mirror||{},prefs:b.prefs||{},lastSeenAt:new Date().toISOString()});
  const sent=await sendPush(req,rec,{title:'📡 Cripto Radar • Push real',body:'Push do servidor funcionando. Este canal continua disponível com o app fechado e a tela bloqueada.',tag:'radar-server-push-test',url:'./',kind:'server-test'});
  return res.status(sent.ok?200:502).json({ok:sent.ok,...sent});
 }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};
