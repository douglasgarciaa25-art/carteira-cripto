const crypto=require('crypto');
const PACKAGE_NAME='br.com.criptoradar.app';
const PRODUCT_ID='cripto_radar_pro_anual';
const ALLOWED_STATES=new Set([
  'SUBSCRIPTION_STATE_ACTIVE',
  'SUBSCRIPTION_STATE_IN_GRACE_PERIOD',
  'SUBSCRIPTION_STATE_CANCELED'
]);
function b64url(input){return Buffer.from(input).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}
function readServiceAccount(){
  const raw=process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if(!raw) return null;
  try{return JSON.parse(raw)}catch(e){}
  try{return JSON.parse(Buffer.from(raw,'base64').toString('utf8'))}catch(e){}
  return null;
}
async function accessToken(sa){
  const now=Math.floor(Date.now()/1000);
  const header=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const payload=b64url(JSON.stringify({
    iss:sa.client_email,
    scope:'https://www.googleapis.com/auth/androidpublisher',
    aud:'https://oauth2.googleapis.com/token',
    iat:now,exp:now+3300
  }));
  const unsigned=header+'.'+payload;
  const signer=crypto.createSign('RSA-SHA256');signer.update(unsigned);signer.end();
  const sig=signer.sign(sa.private_key).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const jwt=unsigned+'.'+sig;
  const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt});
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.access_token) throw new Error('oauth_failed');
  return j.access_token;
}
async function getSubscription(token,access){
  const url=`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(PACKAGE_NAME)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(token)}`;
  const r=await fetch(url,{headers:{Authorization:`Bearer ${access}`}});
  const j=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error('play_verify_failed_'+r.status);
  return j;
}
async function acknowledge(token,access){
  const url=`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(PACKAGE_NAME)}/purchases/subscriptions/${encodeURIComponent(PRODUCT_ID)}/tokens/${encodeURIComponent(token)}:acknowledge`;
  const r=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${access}`,'content-type':'application/json'},body:'{}'});
  if(!r.ok && r.status!==409){const t=await r.text().catch(()=>String(r.status));throw new Error('ack_failed_'+r.status+'_'+t.slice(0,120))}
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  const sa=readServiceAccount();
  if(!sa?.client_email||!sa?.private_key) return res.status(503).json({ok:false,ready:false,error:'play_backend_not_configured'});
  let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body)}catch(e){body={}}}
  const purchaseToken=String(body.purchaseToken||'').trim();
  const productId=String(body.productId||PRODUCT_ID).trim();
  if(productId!==PRODUCT_ID||purchaseToken.length<16) return res.status(400).json({ok:false,error:'invalid_purchase'});
  try{
    const access=await accessToken(sa);
    const sub=await getSubscription(purchaseToken,access);
    const items=Array.isArray(sub.lineItems)?sub.lineItems:[];
    const item=items.find(x=>x?.productId===PRODUCT_ID);
    const expiry=item?.expiryTime||null;
    const notExpired=expiry?Date.parse(expiry)>Date.now():false;
    const entitled=Boolean(item&&notExpired&&ALLOWED_STATES.has(sub.subscriptionState));
    let acknowledged=sub.acknowledgementState==='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';
    if(entitled&&!acknowledged){await acknowledge(purchaseToken,access);acknowledged=true}
    return res.status(200).json({ok:true,ready:true,entitled,state:sub.subscriptionState||null,expiryTime:expiry,productId:PRODUCT_ID,acknowledged});
  }catch(e){
    console.error('play-verify',e);
    return res.status(502).json({ok:false,ready:true,error:'play_api_error'});
  }
};
