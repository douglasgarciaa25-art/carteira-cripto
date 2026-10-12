'use strict';
module.exports=(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'method_not_allowed'});
 const supabaseUrl=String(process.env.SUPABASE_URL||'').replace(/\/+$/,'');
 const publicKey=String(process.env.SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY||'');
 if(!/^https:\/\/[a-z0-9.-]+$/i.test(supabaseUrl)||!publicKey)return res.status(503).json({ok:false,error:'auth_not_configured'});
 return res.status(200).json({ok:true,supabaseUrl,publicKey});
};
