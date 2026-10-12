/* Cripto Radar V19.6.8 — Binance multiusuário, Spot somente leitura. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const SESSION_KEY='radar:auth:1967';
 const OLD_IMPORT='crRadarBinanceImportedV1966';
 const I18N={
  'pt-BR':{title:'Binance • Minha carteira',desc:'Cada pessoa conecta sua própria conta. Apenas leitura Spot, sem ordens ou saques.',check:'Consultar saldos',import:'Usar saldos na carteira',auto:'Sincronizar a cada 2 minutos com o app aberto',keep:'Os saldos são exibidos apenas durante sua sessão. A carteira manual fica preservada neste aparelho.',backup:'Voltar à carteira manual',signedOut:'Entre ou crie sua conta Radar para conectar sua Binance.',connect:'Conectar minha Binance',disconnect:'Desconectar Binance',signup:'Criar conta',signin:'Entrar',logout:'Sair da conta',email:'E-mail',password:'Senha (mínimo 8 caracteres)',apikey:'Binance API Key (somente leitura)',apisecret:'Binance Secret Key',account:'Conta Radar',tutorial:'Como criar uma chave de somente leitura na Binance',loading:'Consultando seus saldos…',connecting:'Verificando permissões da chave…',ready:n=>`${n} ativo(s) encontrado(s). Revise antes de importar.`,empty:'Nenhum saldo Spot positivo.',synced:'Saldos importados apenas para esta sessão.',connected:'Binance conectada à sua conta.',notConnected:'Sua Binance ainda não foi conectada.',confirmed:'Confira sua caixa de e-mail e confirme o cadastro antes de entrar.',logged:'Conta conectada.',bye:'Você saiu. Carteira manual restaurada.',removed:'Conexão Binance excluída.',saved:'Sua chave foi validada e guardada criptografada no servidor.',confirm:'Exibir os saldos Spot na sua carteira? A carteira manual não será excluída.',confirmRemove:'Remover a conexão Binance desta conta? Você precisará cadastrar outra chave para reconectar.',manual:'Carteira manual restaurada.',error:'Não foi possível concluir. Verifique sua conexão e tente novamente.',authError:'E-mail ou senha inválidos, conta não confirmada ou sessão expirada.',readOnly:'Rejeitamos chaves com permissão de negociação, transferência ou saque.',keys:'Crie a chave na Binance com apenas “Enable Reading”. Nunca informe senha ou código 2FA neste aplicativo.',notConfigured:'A autenticação ainda precisa ser configurada pelo administrador.',busy:'Aguarde…'},
  en:{title:'Binance • My portfolio',desc:'Each person connects their own account. Read-only Spot access; no trades or withdrawals.',check:'Check balances',import:'Use balances in portfolio',auto:'Sync every 2 minutes while app is open',keep:'Balances are displayed only during your session. Your manual portfolio stays on this device.',backup:'Return to manual portfolio',signedOut:'Sign in or create a Radar account to connect Binance.',connect:'Connect my Binance',disconnect:'Disconnect Binance',signup:'Create account',signin:'Sign in',logout:'Sign out',email:'Email',password:'Password (at least 8 characters)',apikey:'Binance API Key (read only)',apisecret:'Binance Secret Key',account:'Radar account',tutorial:'How to create a read-only Binance key',loading:'Checking balances…',connecting:'Checking API permissions…',ready:n=>`${n} asset(s) found. Review before importing.`,empty:'No positive Spot balances.',synced:'Balances imported for this session only.',connected:'Binance connected to your account.',notConnected:'Binance not connected yet.',confirmed:'Check your email to verify your new account before signing in.',logged:'Signed in.',bye:'Signed out. Manual portfolio restored.',removed:'Binance connection removed.',saved:'Your key was validated and encrypted on the server.',confirm:'Show your Spot balances in your portfolio? Your manual portfolio will be preserved.',confirmRemove:'Remove your Binance connection? A new key will be required.',manual:'Manual portfolio restored.',error:'Request failed. Check your connection and try again.',authError:'Incorrect credentials, unverified account or expired session.',readOnly:'Trading, transfer and withdrawal permissions are not allowed.',keys:'Create a Binance key with “Enable Reading” only. Never enter a password or 2FA code here.',notConfigured:'The app administrator must configure authentication first.',busy:'Please wait…'},
  es:{title:'Binance • Mi cartera',desc:'Cada persona conecta su propia cuenta. Spot de solo lectura, sin operaciones ni retiros.',check:'Consultar saldos',import:'Usar saldos en la cartera',auto:'Sincronizar cada 2 minutos con la app abierta',keep:'Los saldos solo aparecen durante la sesión. Su cartera manual se conserva en este dispositivo.',backup:'Volver a la cartera manual',signedOut:'Inicie sesión o cree una cuenta Radar para conectar Binance.',connect:'Conectar mi Binance',disconnect:'Desconectar Binance',signup:'Crear cuenta',signin:'Iniciar sesión',logout:'Cerrar sesión',email:'Correo electrónico',password:'Contraseña (mínimo 8 caracteres)',apikey:'Clave API Binance (solo lectura)',apisecret:'Clave secreta Binance',account:'Cuenta Radar',tutorial:'Cómo crear una clave Binance de solo lectura',loading:'Consultando saldos…',connecting:'Verificando permisos…',ready:n=>`${n} activo(s) encontrado(s). Revíselos antes de importar.`,empty:'Sin saldos Spot positivos.',synced:'Saldos importados solo para esta sesión.',connected:'Binance conectada a su cuenta.',notConnected:'Binance aún no conectada.',confirmed:'Revise su correo para confirmar el registro antes de entrar.',logged:'Sesión iniciada.',bye:'Sesión cerrada. Cartera manual restaurada.',removed:'Conexión Binance eliminada.',saved:'Clave validada y cifrada en el servidor.',confirm:'¿Mostrar los saldos Spot en su cartera? Se conservará la cartera manual.',confirmRemove:'¿Eliminar la conexión Binance? Deberá ingresar otra clave.',manual:'Cartera manual restaurada.',error:'No se pudo completar. Revise la conexión.',authError:'Credenciales incorrectas, cuenta sin confirmar o sesión vencida.',readOnly:'No se aceptan permisos de negociación, transferencia ni retiro.',keys:'Cree una clave Binance solo con “Enable Reading”. Nunca introduzca contraseñas ni códigos 2FA aquí.',notConfigured:'El administrador debe configurar la autenticación.',busy:'Espere…'}
 };
 const lang=()=>{const x=String(window.CriptoRadarI18n?.getLanguage?.()||document.documentElement.lang||'pt-BR');return x.startsWith('en')?'en':x.startsWith('es')?'es':'pt-BR'};
 const t=()=>I18N[lang()];
 const state={conf:null,auth:null,user:null,connected:false,busy:false,latest:null,importedFor:null,lastFetched:0};
 const autoKey=()=>state.user?'radar:binance:auto:'+state.user.id:'';
 const importKey=()=>state.user?'radar:binance:import:'+state.user.id:'';
 const hasAuto=()=>!!state.user&&localStorage.getItem(autoKey())==='on';
 const isVisible=()=>document.visibilityState!=='hidden';
 function message(txt,isError=false){const el=$('radarBinanceStatus');if(el){el.textContent=txt;el.classList.toggle('error',isError)}}
 function renderText(){
  document.querySelectorAll('[data-radar-binance-t]').forEach(el=>{const value=t()[el.dataset.radarBinanceT];if(typeof value==='string')el.textContent=value});
  document.querySelectorAll('[data-radar-binance-placeholder]').forEach(el=>{const value=t()[el.dataset.radarBinancePlaceholder];if(typeof value==='string')el.placeholder=value});
  view();
 }
 function view(){
  const logged=!!state.user;
  const signup=$('radarBinanceAuth'),link=$('radarBinanceLink'),profile=$('radarBinanceProfile');
  if(signup)signup.hidden=logged;
  if(link)link.hidden=!logged||state.connected;
  if(profile)profile.hidden=!logged;
  if($('radarBinanceAccountLabel'))$('radarBinanceAccountLabel').textContent=logged?state.user.email:'';
  if($('radarBinanceConnectedLabel'))$('radarBinanceConnectedLabel').textContent=state.connected?t().connected:t().notConnected;
  if($('radarBinanceDisconnect'))$('radarBinanceDisconnect').hidden=!logged||!state.connected;
  if($('radarBinanceCheck'))$('radarBinanceCheck').disabled=!logged||!state.connected||state.busy;
  if($('radarBinanceImport'))$('radarBinanceImport').disabled=!logged||!state.connected||!state.latest?.balances?.length||state.busy;
  if($('radarBinanceAuto')){$('radarBinanceAuto').disabled=!logged||!state.connected;$('radarBinanceAuto').checked=hasAuto();}
  if($('radarBinanceRestore'))$('radarBinanceRestore').hidden=!state.importedFor;
  if(!logged&&$('radarBinancePreview'))$('radarBinancePreview').replaceChildren();
 }
 function saveAuth(auth){
  if(auth?.access_token&&auth?.refresh_token){const stored={access_token:auth.access_token,refresh_token:auth.refresh_token,expires_at:Number(auth.expires_at)||Math.floor(Date.now()/1000)+Number(auth.expires_in||3600)};state.auth=stored;sessionStorage.setItem(SESSION_KEY,JSON.stringify(stored));return true}return false;
 }
 function clearAuth(){state.auth=null;state.user=null;state.connected=false;state.latest=null;sessionStorage.removeItem(SESSION_KEY);}
 async function initializeConfig(){
  if(state.conf)return state.conf;
  const r=await fetch('./api/radar-auth-config',{cache:'no-store'});
  if(!r.ok)throw Error('auth_config');
  const j=await r.json();if(!j.ok||!/^https:\/\//.test(j.supabaseUrl)||!j.publicKey)throw Error('auth_config');
  state.conf=j;return j;
 }
 async function authRequest(path,body,token){
  const conf=await initializeConfig();
  const r=await fetch(conf.supabaseUrl+'/auth/v1/'+path,{method:body?'POST':'GET',headers:{apikey:conf.publicKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw Error('auth_rejected');return j;
 }
 async function validToken(){
  if(!state.auth)return null;
  if(Date.now()/1000>Number(state.auth.expires_at||0)-90){
   try{const renew=await authRequest('token?grant_type=refresh_token',{refresh_token:state.auth.refresh_token});if(!saveAuth(renew))throw Error('refresh_error')}
   catch(e){detach();clearAuth();view();return null}
  }
  return state.auth.access_token;
 }
 async function requireToken(){const token=await validToken();if(!token)throw Error('login_required');return token}
 function manualWallet(){try{const saved=JSON.parse(localStorage.getItem('crWallet')||'[]');return Array.isArray(saved)?saved:[]}catch(_){return []}}
 function detach(){
  state.importedFor=null;
  window.CriptoRadarBinanceActiveImport=false;
  if(Array.isArray(window.printWallet)){window.printWallet=manualWallet();if(typeof renderPrintWallet==='function')renderPrintWallet();try{window.dispatchEvent(new Event('criptoradar:walletchange'))}catch(_){}}
 }
 async function loadUser(){
  const token=await validToken();if(!token)return null;
  try{const user=await authRequest('user',null,token);if(!user?.id||!user?.email)throw Error('invalid_user');
   if(state.user?.id&&state.user.id!==user.id)detach();
   state.user={id:user.id,email:user.email};return state.user;
  }catch(_){detach();clearAuth();return null}
 }
 async function callApi(method='GET',data=null,action=''){
  const token=await requireToken();
  const url='./api/binance-wallet'+(action?'?action='+encodeURIComponent(action):'');
  const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,Accept:'application/json',...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined,cache:'no-store',credentials:'same-origin'});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok){
   // Only accept structured error codes, never show raw server messages.
   const code=typeof j.error==='string'&&/^[a-z][a-z0-9_]{2,64}$/.test(j.error)?j.error:r.status===404?'endpoint_unavailable':'http_'+r.status;
   const e=new Error(code);e.status=r.status;
   if(Number.isInteger(j.binanceCode)&&j.binanceCode<0)e.binanceCode=j.binanceCode;
   if(['permissions','balances'].includes(j.stage))e.stage=j.stage;
   throw e;
  }
  return j;
 }
 const DIAGNOSTICS={
  'pt-BR':{
   binance_key_ip_or_permission:'Binance: chave API inválida, IP não autorizado ou permissão insuficiente. Verifique a API Spot, leitura e restrições de IP.',
   binance_api_key_invalid:'Binance: chave inválida, IP não autorizado ou permissão insuficiente.',
   binance_key_format_invalid:'Binance: formato da API Key inválido.',
   binance_clock_invalid:'Binance: o horário da solicitação não foi aceito. É necessário conferir o relógio do servidor.',
   binance_signature_invalid:'Binance: assinatura incorreta. Confira se a API Key e a Secret Key pertencem ao mesmo par.',
   binance_rate_limited:'Binance: muitas requisições. Tente novamente mais tarde.',
   binance_access_forbidden:'Binance: acesso bloqueado. Confira restrições da conta ou região.',
   binance_request_rejected:'Binance recusou a solicitação. Anote o código exibido.',
   binance_unavailable:'Não foi possível comunicar com a Binance neste momento.',
   binance_invalid_response:'A Binance retornou uma resposta inesperada.',
   read_access_required:'Binance: ative somente a permissão Enable Reading, de leitura.',
   read_only_key_required:'Binance: a chave deve ser somente leitura; desative negociação, saques e transferências.',
   invalid_api_credentials:'API Key ou Secret Key em formato inválido. Copie as credenciais da área de gerenciamento de API da Binance.',
   database_permission_denied:'Radar: o banco recusou a permissão para salvar sua conexão.',
   database_schema_missing:'Radar: tabela da Binance não encontrada no banco Supabase.',
   database_unavailable:'Radar: banco de dados temporariamente indisponível.',
   auth_service_unavailable:'Radar: serviço de autenticação indisponível.',
   service_not_configured:'Radar: a conexão ainda não está configurada na Vercel.',
   encryption_not_configured:'Radar: chave de criptografia não configurada na Vercel.',
   encrypted_data_invalid:'Radar: dados salvos não puderam ser decifrados. Será necessário reconectar.',
   origin_forbidden:'Radar: origem não autorizada. Abra pelo endereço oficial do aplicativo.',
   endpoint_unavailable:'Radar: função de conexão não encontrada no servidor.',
   binance_not_connected:'Nenhuma conta Binance conectada.',
   http_500:'Radar: erro interno no servidor.',
   http_502:'Radar: falha de comunicação no servidor.',
   http_503:'Radar: serviço temporariamente indisponível.'
  },
  en:{
   binance_key_ip_or_permission:'Binance: invalid API key, unauthorized IP, or insufficient permissions. Check Spot reading access and allowed IPs.',
   binance_api_key_invalid:'Binance: invalid key, IP restriction, or insufficient permissions.',
   binance_key_format_invalid:'Binance: invalid API key format.',
   binance_clock_invalid:'Binance: request timestamp rejected. Check server time.',
   binance_signature_invalid:'Binance: invalid signature. Use API Key and Secret Key from the same pair.',
   binance_rate_limited:'Binance: too many requests. Retry later.',
   binance_access_forbidden:'Binance: access forbidden. Check account or regional restrictions.',
   binance_request_rejected:'Binance: request rejected. Note the displayed error code.',
   binance_unavailable:'Binance is currently unavailable.',
   binance_invalid_response:'Binance returned an unexpected response.',
   read_access_required:'Binance: enable only reading permission.',
   read_only_key_required:'Binance: disable trading, withdrawals, and transfers. A read-only key is required.',
   invalid_api_credentials:'Invalid API Key or Secret Key format.',
   database_permission_denied:'Radar: database permission was denied for your account.',
   database_schema_missing:'Radar: Binance database table is missing.',
   database_unavailable:'Radar: database unavailable.',
   auth_service_unavailable:'Radar: login service is unavailable.',
   service_not_configured:'Radar: server-side connection not configured.',
   encryption_not_configured:'Radar: server-side encryption not configured.',
   encrypted_data_invalid:'Radar: stored credentials could not be decrypted. Reconnect the account.',
   origin_forbidden:'Radar: unauthorized site origin.',
   endpoint_unavailable:'Radar: Vercel connection endpoint not found.',
   binance_not_connected:'No Binance account connected.',
   http_500:'Radar: internal server error.',
   http_502:'Radar: gateway error.',
   http_503:'Radar: service temporarily unavailable.'
  },
  es:{
   binance_key_ip_or_permission:'Binance: clave inválida, IP no autorizada o permisos insuficientes. Compruebe la lectura Spot y la IP.',
   binance_api_key_invalid:'Binance: clave, IP o permisos no autorizados.',
   binance_key_format_invalid:'Binance: formato de clave API inválido.',
   binance_clock_invalid:'Binance: hora de solicitud inválida. Revise el reloj del servidor.',
   binance_signature_invalid:'Binance: firma incorrecta. Compruebe que API Key y Secret Key sean del mismo par.',
   binance_rate_limited:'Binance: demasiadas solicitudes. Intente más tarde.',
   binance_access_forbidden:'Binance: acceso bloqueado. Revise restricciones de la cuenta.',
   binance_request_rejected:'Binance: solicitud rechazada. Anote el código mostrado.',
   binance_unavailable:'Binance no está disponible.',
   binance_invalid_response:'Respuesta inesperada de Binance.',
   read_access_required:'Binance: active solo el permiso de lectura.',
   read_only_key_required:'Binance: desactive operaciones, retiros y transferencias.',
   invalid_api_credentials:'Formato inválido de API Key o Secret Key.',
   database_permission_denied:'Radar: acceso denegado a la base de datos.',
   database_schema_missing:'Radar: falta la tabla de Binance.',
   database_unavailable:'Radar: base de datos no disponible.',
   auth_service_unavailable:'Radar: servicio de acceso no disponible.',
   service_not_configured:'Radar: conexión no configurada en el servidor.',
   encryption_not_configured:'Radar: cifrado no configurado.',
   encrypted_data_invalid:'Radar: credenciales guardadas ilegibles. Vuelva a conectar.',
   origin_forbidden:'Radar: origen no autorizado.',
   endpoint_unavailable:'Radar: función no encontrada en Vercel.',
   binance_not_connected:'Ninguna cuenta Binance conectada.',
   http_500:'Radar: error interno del servidor.',
   http_502:'Radar: error de conexión con el servidor.',
   http_503:'Radar: servicio no disponible.'
  }
 };
 function friendlyError(err){
  const code=String(err?.message||'');
  if(/^(login_required|session_invalid|email_confirmation_required|auth_rejected)$/.test(code))return t().authError;
  const detail=(DIAGNOSTICS[lang()]||DIAGNOSTICS['pt-BR'])[code];
  if(detail)return detail+(Number.isInteger(err?.binanceCode)&&err.binanceCode<0?' (Código Binance: '+err.binanceCode+')':'');
  if(code==='auth_config'||code==='request_failed')return t().notConfigured;
  return t().error;
 }
 function renderBalances(){
  const el=$('radarBinancePreview');if(!el)return;
  el.replaceChildren();if(!state.latest)return;
  const heading=document.createElement('p');heading.className='small';heading.textContent=new Date(state.latest.updatedAt).toLocaleString(lang());el.appendChild(heading);
  const nf=new Intl.NumberFormat(lang(),{maximumFractionDigits:8});
  for(const item of state.latest.balances.slice(0,80)){
   const line=document.createElement('div');line.className='radar-binance-line';
   const name=document.createElement('b');name.textContent=item.symbol;
   const qty=document.createElement('span');qty.textContent=nf.format(item.qty);
   line.append(name,qty);el.appendChild(line);
  }
 }
 function useBalances(ask=true){
  if(!state.user||!state.latest?.balances?.length)return false;
  if(ask&&!confirm(t().confirm))return false;
  const next=state.latest.balances.map(x=>({symbol:x.symbol,qty:x.qty}));
  window.CriptoRadarBinanceActiveImport=true;
  state.importedFor=state.user.id;
  window.printWallet=next;
  if(typeof renderPrintWallet==='function')renderPrintWallet();
  if(typeof updateWalletPrices==='function')Promise.resolve(updateWalletPrices()).catch(()=>{});
  try{window.dispatchEvent(new Event('criptoradar:walletchange'))}catch(_){}
  sessionStorage.setItem(importKey(),'yes');
  if(ask&&localStorage.getItem(autoKey())===null)localStorage.setItem(autoKey(),'on');
  view();message(t().synced);return true;
 }
 async function check(silent=false){
  if(state.busy||!state.user||!state.connected||!isVisible())return false;
  state.busy=true;if(!silent)message(t().loading);view();
  try{
   const data=await callApi();
   const list=(Array.isArray(data.balances)?data.balances:[]).filter(x=>/^[A-Z0-9]{2,18}$/.test(String(x.symbol||''))&&Number.isFinite(Number(x.qty))&&Number(x.qty)>0).map(x=>({symbol:x.symbol,free:+x.free,locked:+x.locked,qty:+x.qty}));
   state.latest={balances:list,updatedAt:data.updatedAt};state.lastFetched=Date.now();
   renderBalances();if(!silent)message(list.length?t().ready(list.length):t().empty);
   if(hasAuto()&&sessionStorage.getItem(importKey())==='yes'&&list.length)useBalances(false);
   return true;
  }catch(e){if(e?.status===401){detach();clearAuth();view()}if(!silent)message(friendlyError(e),true);return false}
  finally{state.busy=false;view()}
 }
 async function status(){
  if(!state.user)return;
  try{const data=await callApi('GET',null,'status');state.connected=!!data.connected;message(state.connected?t().connected:t().notConnected);view();
    if(state.connected&&hasAuto())await check(true);
  }catch(e){message(friendlyError(e),true);view()}
 }
 async function enter(mode){
  if(state.busy)return;
  const email=String($('radarBinanceEmail')?.value||'').trim(),password=String($('radarBinancePassword')?.value||'');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||password.length<8){message(t().authError,true);return}
  state.busy=true;message(t().busy);view();
  try{
   const session=await authRequest(mode==='signup'?'signup':'token?grant_type=password',{email,password});
   $('radarBinancePassword').value='';
   if(!saveAuth(session)) {message(t().confirmed);return;}
   if(await loadUser()){message(t().logged);view();await status()}
   else message(t().authError,true);
  }catch(e){message(t().authError,true)}finally{state.busy=false;view()}
 }
 async function link(){
  if(state.busy||!state.user)return;
  const apiKey=String($('radarBinanceApiKey')?.value||'').trim(),apiSecret=String($('radarBinanceApiSecret')?.value||'').trim();
  if(apiKey.length<20||apiSecret.length<20){message(t().keys,true);return}
  state.busy=true;message(t().connecting);view();
  try{await callApi('POST',{apiKey,apiSecret});state.connected=true;
   $('radarBinanceApiKey').value='';$('radarBinanceApiSecret').value='';
   message(t().saved);state.busy=false;view();await check(false);
  }catch(e){message(friendlyError(e),true)}finally{if($('radarBinanceApiKey'))$('radarBinanceApiKey').value='';if($('radarBinanceApiSecret'))$('radarBinanceApiSecret').value='';state.busy=false;view()}
 }
 async function unlink(){
  if(!state.user||state.busy||!confirm(t().confirmRemove))return;
  state.busy=true;view();
  try{await callApi('DELETE');detach();state.connected=false;state.latest=null;localStorage.removeItem(autoKey());sessionStorage.removeItem(importKey());
   $('radarBinancePreview').replaceChildren();message(t().removed);view();
  }catch(e){message(friendlyError(e),true)}finally{state.busy=false;view()}
 }
 async function logout(){
  try{const token=await validToken();if(token)await authRequest('logout',{},token)}catch(_){}
  detach();clearAuth();$('radarBinancePreview').replaceChildren();message(t().bye);view();
 }
 async function init(){
  // Remove old V19.6.6 shared/developer session import, if present.
  try{if(localStorage.getItem(OLD_IMPORT)==='yes'){const back=JSON.parse(localStorage.getItem('crRadarBinanceManualBackupV1966')||'null');if(Array.isArray(back))localStorage.setItem('crWallet',JSON.stringify(back));localStorage.removeItem(OLD_IMPORT);localStorage.removeItem('crRadarBinanceAutoSyncV1966')}}catch(_){}
  $('radarBinanceSignin')?.addEventListener('click',()=>enter('signin'));
  $('radarBinanceSignup')?.addEventListener('click',()=>enter('signup'));
  $('radarBinanceConnect')?.addEventListener('click',link);
  $('radarBinanceDisconnect')?.addEventListener('click',unlink);
  $('radarBinanceLogout')?.addEventListener('click',logout);
  $('radarBinanceCheck')?.addEventListener('click',()=>check(false));
  $('radarBinanceImport')?.addEventListener('click',()=>useBalances(true));
  $('radarBinanceRestore')?.addEventListener('click',()=>{detach();if(state.user)sessionStorage.removeItem(importKey());message(t().manual);view()});
  $('radarBinanceAuto')?.addEventListener('change',e=>{if(state.user)localStorage.setItem(autoKey(),e.target.checked?'on':'off')});
  window.addEventListener('criptoradar:languagechange',renderText);
  document.addEventListener('visibilitychange',()=>{if(isVisible()&&hasAuto()&&Date.now()-state.lastFetched>120000)check(true)});
  window.setInterval(()=>{if(isVisible()&&hasAuto()&&Date.now()-state.lastFetched>120000)check(true)},120000);
  try{const stored=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');if(stored?.access_token&&stored?.refresh_token)state.auth=stored;
   if(await loadUser())await status();else message(t().signedOut);
  }catch(e){message(t().notConfigured,true)}
  renderText();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
