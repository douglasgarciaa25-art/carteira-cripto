const {removeSubscription}=require('./push-server-lib');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
 try{const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};await removeSubscription(b.endpoint||b.id);return res.status(200).json({ok:true});}
 catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
};
