module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'method_not_allowed'});
  const backendReady=Boolean(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON);
  return res.status(200).json({
    ok:true,
    version:'19.5.8',
    packageName:'br.com.criptoradar.app',
    productId:'cripto_radar_pro_anual',
    basePlanId:'anual',
    fallbackPrice:'R$ 99,90/ano',
    backendReady
  });
};

// CriptoRadar shared auth configuration endpoint (Vercel Hobby function limit).
const radarLegacyPlayConfigHandler = module.exports;
module.exports = function sharedPlayOrAuthConfig(req,res){
  const raw=String(req.url||'');
  const route=String(req.query?._radar_api||'');
  if (route==='auth-config' || /\/api\/radar-auth-config(?:\?|$)/.test(raw) || /[?&]_radar_api=auth-config(?:&|$)/.test(raw))
    return require('./radar-public-config')(req,res);
  return radarLegacyPlayConfigHandler(req,res);
};
