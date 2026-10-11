(()=>{
'use strict';
const STORE='https://play.google.com/billing';
const PRODUCT_ID='cripto_radar_pro_anual';
const PACKAGE_NAME='br.com.criptoradar.app';
const CACHE_KEY='crRadarProVerifiedV153';
let ownerVerified=false;
let service=null, config={productId:PRODUCT_ID,packageName:PACKAGE_NAME,fallbackPrice:'R$ 99,90/ano',backendReady:false}, active=false, expiry=null;
const $=id=>document.getElementById(id);
function cached(){try{const x=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');if(x?.verified&&x?.expiryTime&&Date.parse(x.expiryTime)>Date.now())return x}catch(e){}return null}
function setStatus(msg,kind=''){const el=$('proBillingStatus');if(el){el.textContent=msg;el.className='pro-billing-status '+kind}}
function setActive(on,data={}){
  active=!!on||ownerVerified;expiry=ownerVerified?null:(data.expiryTime||expiry);
  document.body.classList.toggle('pro-entitled',active);
  document.body.classList.toggle('pro-developer',ownerVerified);
  const chip=$('proAccessChip');if(chip){chip.textContent=ownerVerified?'DESENVOLVEDOR • PRO':(active?'PRO ATIVO':'PLANO ANUAL');chip.classList.toggle('active',active)}
  const btn=$('proSubscribeBtn');if(btn)btn.textContent=ownerVerified?'✓ ACESSO DO CRIADOR':(active?'✓ PRO ATIVO':'ASSINAR PRO ANUAL');
  const restore=$('proRestoreBtn');if(restore)restore.textContent=ownerVerified?'✓ ACESSO SEM COBRANÇA':(active?'VERIFICAR ASSINATURA':'RESTAURAR COMPRA');
  if(active&&!ownerVerified&&expiry){try{localStorage.setItem(CACHE_KEY,JSON.stringify({verified:true,expiryTime:expiry,checkedAt:Date.now()}))}catch(e){}}
  window.dispatchEvent(new CustomEvent('criptoradar:prochange',{detail:{active,expiryTime:expiry}}));
}
function isActive(){const c=cached();return ownerVerified||active||!!c}
function openPaywall(reason=''){if(isActive())return;const modal=$('proPaywallModal');if($('proPaywallReason'))$('proPaywallReason').textContent=reason?`Recurso solicitado: ${reason}`:'';modal?.classList.add('show')}
function closePaywall(){$('proPaywallModal')?.classList.remove('show')}
async function verifyToken(purchaseToken,itemId=PRODUCT_ID){
  const r=await fetch('/api/play-verify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({purchaseToken,productId:itemId})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok) throw new Error(j.error||'verification_failed');
  if(j.entitled){setActive(true,j);setStatus('✓ Assinatura PRO confirmada pelo Google Play.','ok');return true}
  setActive(false,j);return false;
}
async function loadStore(){
  if(!('getDigitalGoodsService' in window)) return false;
  service=await window.getDigitalGoodsService(STORE);
  return true;
}
async function loadPrice(){
  if(!service)return;
  try{
    const rows=await service.getDetails([PRODUCT_ID]);
    const item=rows?.find(x=>x.itemId===PRODUCT_ID)||rows?.[0];
    if(item?.price){const value=Number(item.price.value);const price=new Intl.NumberFormat(navigator.language||'pt-BR',{style:'currency',currency:item.price.currency}).format(value);document.querySelectorAll('[data-pro-price]').forEach(e=>e.textContent=price+'/ano')}
  }catch(e){}
}
async function restore(){
  if(ownerVerified){setStatus('✓ Licença do desenvolvedor ativa. Nenhuma cobrança será feita.','ok');return true}
  if(!service){setStatus('Abra o Cripto Radar instalado pela Google Play para restaurar a assinatura.','warn');return false}
  setStatus('Verificando sua assinatura…');
  try{
    const purchases=await service.listPurchases();
    const p=(purchases||[]).find(x=>x.itemId===PRODUCT_ID);
    if(!p){setActive(false);setStatus('Nenhuma assinatura PRO ativa encontrada nesta conta Google Play.','warn');return false}
    if(!config.backendReady){setStatus('Assinatura encontrada, mas a validação do servidor ainda precisa ser ativada no Play Console.','warn');return false}
    return await verifyToken(p.purchaseToken,p.itemId);
  }catch(e){setStatus('Não foi possível verificar a assinatura agora.','bad');return false}
}
async function buy(){
  if(isActive()){setStatus('Seu PRO Anual já está ativo.','ok');return}
  if(!service){setStatus('A compra é feita dentro do app instalado pela Google Play.','warn');return}
  if(!config.backendReady){setStatus('O faturamento está preparado, mas falta conectar a credencial da Google Play ao servidor.','warn');return}
  try{
    setStatus('Abrindo pagamento seguro do Google Play…');
    const request=new PaymentRequest([{supportedMethods:STORE,data:{sku:PRODUCT_ID}}],{total:{label:'Cripto Radar PRO Anual',amount:{currency:'BRL',value:'0'}}});
    const response=await request.show();
    const purchaseToken=response?.details?.purchaseToken;
    if(!purchaseToken)throw new Error('missing_purchase_token');
    const ok=await verifyToken(purchaseToken,PRODUCT_ID);
    await response.complete(ok?'success':'fail');
    if(ok){closePaywall();setTimeout(()=>location.reload(),500)}
  }catch(e){if(e?.name==='AbortError')setStatus('Compra cancelada.','warn');else setStatus('Não foi possível concluir a assinatura.','bad')}
}
function manage(){window.open(`https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(PRODUCT_ID)}&package=${encodeURIComponent(PACKAGE_NAME)}`,'_blank','noopener')}
function lockFeatures(){
  const ids=['copyMirrorCard','notifyCard','urgentRadarCard','v10CoreCard','v11LiveCard','v8BacktestCard','v7ValidationCard','sourcesCard'];
  ids.forEach(id=>{const el=$(id);if(!el||el.querySelector(':scope > .pro-lock-overlay'))return;el.classList.add('paid-pro-feature');const o=document.createElement('div');o.className='pro-lock-overlay';o.innerHTML=`<div class="pro-lock-box"><div class="pro-lock-icon">⭐</div><b>Recurso PRO</b><span>Disponível no plano anual do Cripto Radar.</span><button type="button" data-open-pro>VER PLANO PRO</button></div>`;el.appendChild(o)});
}
async function checkDeveloperAccess(){
  try{
    const r=await fetch('/api/owner-access',{method:'GET',credentials:'same-origin',cache:'no-store'});
    const j=await r.json();
    if(!r.ok)return false;
    if(!j.configured){setDevMessage('Ativação do criador: configure as chaves no Vercel.','warn');return false}
    if(j.owner){
      ownerVerified=true;
      setActive(true,{owner:true});closePaywall();
      setStatus('✓ Acesso do desenvolvedor liberado: PRO sem cobrança.','ok');
      setDevMessage('Acesso do criador ativo neste aparelho.','ok');
      return true;
    }
    setDevMessage('Digite sua chave de desenvolvedor para liberar o PRO sem pagar.');
  }catch(e){setDevMessage('Não foi possível verificar a licença do desenvolvedor.','warn')}
  return false;
}
function setDevMessage(msg,kind=''){
  const el=$('ownerAccessStatus');if(el){el.textContent=msg;el.className='pro-billing-status '+kind}
}
async function activateDeveloper(){
  const box=$('ownerAccessCode'),btn=$('ownerAccessBtn');const code=String(box?.value||'').trim();
  if(code.length<24){setDevMessage('Informe a chave segura configurada no Vercel (mínimo 24 caracteres).','warn');return}
  if(btn)btn.disabled=true;
  try{
    const r=await fetch('/api/owner-access',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||!j.owner){setDevMessage(r.status===503?'Configure a licença no Vercel primeiro.':'Chave de desenvolvedor inválida.','bad');return}
    if(box)box.value='';
    ownerVerified=true;setActive(true,{owner:true});closePaywall();
    setStatus('✓ Conta de desenvolvedor: PRO sem cobrança.','ok');
    setDevMessage('Licença de criador ativada. Recarregando o aplicativo…','ok');
    setTimeout(()=>location.reload(),450);
  }catch(e){setDevMessage('Erro de rede ao ativar a licença.','bad')}
  finally{if(btn)btn.disabled=false}
}
async function init(){
  lockFeatures();
  const c=cached();if(c)setActive(true,c);
  const owner=await checkDeveloperAccess();
  $('ownerAccessBtn')?.addEventListener('click',activateDeveloper);
  $('ownerAccessCode')?.addEventListener('keydown',e=>{if(e.key==='Enter')activateDeveloper()});
  try{const r=await fetch('/api/play-config',{cache:'no-store'});if(r.ok)config={...config,...await r.json()}}catch(e){}
  document.querySelectorAll('[data-pro-price]').forEach(e=>e.textContent=config.fallbackPrice||'R$ 99,90/ano');
  if(!owner){try{if(await loadStore()){await loadPrice();await restore()}else setStatus('Plano PRO disponível no aplicativo instalado pela Google Play.','warn')}catch(e){setStatus('Google Play Billing indisponível neste navegador.','warn')}}
  $('proSubscribeBtn')?.addEventListener('click',buy);$('proRestoreBtn')?.addEventListener('click',restore);$('proManageBtn')?.addEventListener('click',manage);$('proPaywallClose')?.addEventListener('click',closePaywall);$('proPaywallModal')?.addEventListener('click',e=>{if(e.target.id==='proPaywallModal')closePaywall()});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-open-pro]');if(b){e.preventDefault();openPaywall(b.dataset.reason||'Cripto Radar PRO')}});
}
window.CriptoRadarPro={isActive,isDeveloper:()=>ownerVerified,openPaywall,closePaywall,buy,restore,manage,refresh:restore,productId:PRODUCT_ID};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
