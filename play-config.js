module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'method_not_allowed'});
  const backendReady=Boolean(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON);
  return res.status(200).json({
    ok:true,
    version:'15.3.0',
    packageName:'br.com.criptoradar.app',
    productId:'cripto_radar_pro_anual',
    basePlanId:'anual',
    fallbackPrice:'R$ 99,90/ano',
    backendReady
  });
};
