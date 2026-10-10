const {saveSubscription,sendPush}=require('./push-server-lib');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};if(!b.subscription?.endpoint)return res.status(400).json({ok:false,error:'Subscription inválida'});
  const rec=await saveSubscription({subscription:b.subscription,context:b.context||{},mirror:b.mirror||{},prefs:b.prefs||{},language:String(b.language||'pt-BR').slice(0,12),lastSeenAt:new Date().toISOString()});
  const l=String(rec.language||'pt-BR').toLowerCase();const en=l.startsWith('en'),es=l.startsWith('es');
  const sent=await sendPush(req,rec,{title:en?'📡 Cripto Radar • Real push':es?'📡 Cripto Radar • Push real':'📡 Cripto Radar • Push real',body:en?'Server push is working. This channel remains available with the app closed and the screen locked.':es?'El push del servidor funciona. Este canal sigue disponible con la app cerrada y la pantalla bloqueada.':'Push do servidor funcionando. Este canal continua disponível com o app fechado e a tela bloqueada.',tag:'radar-server-push-test',url:'./',kind:'server-test'});
  return res.status(sent.ok?200:502).json({ok:sent.ok,...sent});
 }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};
