/* Vistoria 24h: somente leitura dos serviços e gravação do próprio relatório. */
const URL_BASE=(Deno.env.get('SUPABASE_URL')||'').replace(/\/$/,'');
const SRK=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const ORIGINS=['https://carteira-cripto-pi.vercel.app','https://carteira-cripto-douglasgarciaa25-5926.vercel.app','http://localhost:3000','http://localhost:5173'];
const dbHeaders=p=>({apikey:SRK,Authorization:'Bearer '+SRK,'Content-Type':'application/json',...(p?{Prefer:p}:{})});
function hdr(req){const o=req.headers.get('origin');return {'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-radar-cron-token','Access-Control-Allow-Methods':'GET,POST,OPTIONS',...(o&&ORIGINS.includes(o)?{'Access-Control-Allow-Origin':o}:{})};}
function out(req,n,v){return new Response(JSON.stringify(v),{status:n,headers:hdr(req)});}
function err(req,n,e){return out(req,n,{ok:false,error:e});}
async function db(method,table,query='',value=null,prefer=''){const r=await fetch(URL_BASE+'/rest/v1/'+table+query,{method,headers:dbHeaders(prefer),body:value?JSON.stringify(value):undefined,signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('db_'+r.status);return await r.json().catch(()=>null);}
async function pub(path){for(const root of ['https://data-api.binance.vision','https://api.binance.com'])try{const r=await fetch(root+path,{signal:AbortSignal.timeout(4500),headers:{Accept:'application/json'}});if(r.ok)return await r.json();}catch(_){}throw Error('market_source_down');}
async function user(req){const m=/^Bearer\s+(\S+)$/i.exec(req.headers.get('authorization')||'');if(!m||m[1].length>8192)return null;const r=await fetch(URL_BASE+'/auth/v1/user',{headers:{apikey:SRK,Authorization:'Bearer '+m[1]},signal:AbortSignal.timeout(7000)});if(!r.ok)return null;const u=await r.json();return /^[a-f0-9-]{36}$/i.test(String(u?.id||''))&&u?.email_confirmed_at?u:null;}
async function cronAuth(req){const token=req.headers.get('x-radar-cron-token')||'';if(token.length<48)return false;const r=await fetch(URL_BASE+'/rest/v1/rpc/radar_paper_cron_authorized',{method:'POST',headers:dbHeaders(),body:JSON.stringify({supplied:token}),signal:AbortSignal.timeout(8000)});return r.ok&&(await r.json())===true;}

const SITE='https://carteira-cripto-pi.vercel.app';
const item=(name,status,detail)=>({name,status,detail});
const fresh=(date,at,max)=>{const t=Date.parse(date||'');return Number.isFinite(t)&&t<=at+60000&&at-t<=max};
const nonnegative=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
function inspectPaper(row,uid,at){
 if(!row)return [item('Robô na nuvem','info','Simulação no servidor ainda não iniciada.')];
 const s=row.ledger,checks=[];
 if(!s||typeof s!=='object')return [item('Simulador','error','Dados da simulação inválidos.')];
 checks.push(item('Robô na nuvem',s.killed?'warning':!s.autoEnabled?'info':fresh(row.last_tick,at,12*60000)?'ok':'error',s.killed?'Parada de emergência ativa.':!s.autoEnabled?'Automático desligado por configuração.':fresh(row.last_tick,at,12*60000)?'Execução recente registrada.':'Execução atrasada há mais de 12 minutos ou sem registro.'));
 checks.push(item('Base do simulador',s.binanceReference?.userId!==uid?'error':s.binanceSyncError?'error':'ok',s.binanceReference?.userId!==uid?'Referência Binance ausente ou de outra conta.':s.binanceSyncError?'O robô registrou falha ao sincronizar o saldo.':'Referência vinculada à sua conta.'));
 const positions=s.positions,orders=s.orders;
 const validPositions=positions&&typeof positions==='object'&&!Array.isArray(positions)&&Object.values(positions).every(p=>p&&nonnegative(p.qty)&&nonnegative(p.cost));
 const validOrders=Array.isArray(orders)&&orders.every(o=>o&&o.paper===true&&['BUY','SELL'].includes(o.side)&&typeof o.symbol==='string'&&nonnegative(o.qty)&&o.qty>0&&nonnegative(o.quote)&&o.quote>0&&Number.isFinite(Date.parse(o.at)));
 checks.push(item('Contabilidade e ordens fictícias',nonnegative(s.cash)&&nonnegative(s.pendingWithdrawalUSDT??0)&&validPositions&&validOrders?'ok':'error',nonnegative(s.cash)&&nonnegative(s.pendingWithdrawalUSDT??0)&&validPositions&&validOrders?'Reserva, posições e histórico passaram pela verificação de consistência.':'Há dados inconsistentes na reserva, posições ou histórico.'));
 if(s.pendingWithdrawalUSDT>0)checks.push(item('Retirada real','warning','Existe ajuste pendente na simulação; não representa saldo real disponível.'));
 return checks;
}
async function globals(){
 return await Promise.all([
  (async()=>{try{const r=await fetch(SITE+'/api/radar-auth-config',{cache:'no-store',signal:AbortSignal.timeout(8000)});const j=await r.json();return item('Serviço do app',r.ok&&j.supabaseUrl===URL_BASE&&!!j.publicKey?'ok':'error',r.ok&&j.supabaseUrl===URL_BASE&&!!j.publicKey?'Serviço de configuração respondeu corretamente.':'Serviço indisponível ou configuração divergente.')}catch(_){return item('Serviço do app','error','Sem resposta válida do serviço do app.')}})(),
  (async()=>{try{const r=await fetch(SITE+'/api/market?kind=price&symbol=BTC',{cache:'no-store',signal:AbortSignal.timeout(15000)}),j=await r.json();if(!r.ok||!j.ok||j.symbol!=='BTC'||!(Number(j.price)>0)||j.stale||!fresh(j.at,Date.now(),180000))throw Error();return item('Mercado do app','ok','Preço BTC/USDT recente confirmado pelo serviço usado no aplicativo.')}catch(_){return item('Mercado do app','error','Serviço de preços do app indisponível ou com cotação desatualizada.')}})(),
  (async()=>{try{const checks=await Promise.all([['/','radar-health.js'],['/radar-health.js','radarHealth'],['/binance-wallet.js','CriptoRadarAuth'],['/radar-trader-core.js','RadarTraderCore']].map(async([path,marker])=>{const r=await fetch(SITE+path,{cache:'no-store',signal:AbortSignal.timeout(8000)});return r.ok&&(await r.text()).includes(marker)}));if(!checks.every(Boolean))throw Error();return item('Arquivos do aplicativo','ok','Página inicial e scripts essenciais disponíveis.')}catch(_){return item('Arquivos do aplicativo','error','A página inicial ou um arquivo essencial não carregou corretamente.')}})()
 ]);
}
async function balance(req,uid,cron,at){
 try{
  const headers=cron?{Authorization:'Bearer '+SRK,'x-radar-cron-token':req.headers.get('x-radar-cron-token'),'x-radar-user-id':uid}:{Authorization:req.headers.get('authorization')||''};
  const r=await fetch(SITE+'/api/binance-wallet',{headers,cache:'no-store',signal:AbortSignal.timeout(25000),redirect:'error'}),j=await r.json();
  const valid=r.ok&&j.ok&&Array.isArray(j.balances)&&fresh(j.updatedAt,Date.now(),180000)&&j.balances.every(b=>b.free!==null&&b.free!==''&&Number.isFinite(Number(b.free))&&Number(b.free)>=0);
  return item('Conexão e saldo Binance',valid?'ok':'error',valid?'Saldo Spot lido com sucesso e atualizado (até 3 minutos).':'Saldo indisponível, inválido ou desatualizado. Confira a conexão Binance.');
 }catch(_){return item('Conexão e saldo Binance','error','Não foi possível confirmar o saldo Binance dentro do prazo.');}
}
async function readReport(uid){return (await db('GET','radar_health_reports','?user_id=eq.'+uid+'&select=checked_at,report'))?.[0]||null;}
async function audit(req,uid,cron,common){
 const at=Date.now(),stamp=new Date(at).toISOString();
 const [rows,b]=await Promise.all([db('GET','radar_paper_cloud_accounts','?user_id=eq.'+uid+'&select=ledger,last_tick'),balance(req,uid,cron,at)]);
 const checks=[...common,b,...inspectPaper(rows?.[0],uid,at)];
 const report={version:'20.1.7',checkedAt:stamp,source:'server',status:checks.some(c=>c.status==='error')?'error':checks.some(c=>c.status==='warning')?'warning':'ok',checks};
 await db('POST','radar_health_reports','?on_conflict=user_id',{user_id:uid},'resolution=ignore-duplicates');
 // A resposta de uma execução antiga nunca substitui um relatório mais novo.
 await db('PATCH','radar_health_reports','?user_id=eq.'+uid+'&or=(checked_at.is.null,checked_at.lt.'+encodeURIComponent(stamp)+')',{checked_at:stamp,report});
 return await readReport(uid);
}
async function handleHealth(req){
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:hdr(req)});
 if(!['GET','POST'].includes(req.method))return err(req,405,'method_not_allowed');
 const origin=req.headers.get('origin');if(origin&&!ORIGINS.includes(origin))return err(req,403,'origin_forbidden');
 if(!URL_BASE||!SRK)return err(req,503,'server_not_configured');
 try{
  const raw=req.method==='POST'?await req.text():'';if(raw.length>256)return err(req,413,'request_too_large');
  const body=raw?JSON.parse(raw):{};
  if(body.action==='cron'){
   if(!await cronAuth(req))return err(req,401,'cron_not_authorized');
   const rows=await db('POST','rpc/radar_health_candidates','',{}),common=await globals();let checked=0,failed=0;
   for(let i=0;i<(rows||[]).length;i+=4)await Promise.all(rows.slice(i,i+4).map(async row=>{try{await audit(req,row.user_id,true,common);checked++;}catch(_){failed++;}}));
   return out(req,failed?503:200,{ok:failed===0,checked,failed,readOnly:true});
  }
  const u=await user(req);if(!u)return err(req,401,'login_required');
  const prior=await readReport(u.id);
  if(req.method==='GET')return out(req,200,{ok:true,health:prior});
  if(body.action!=='check')return err(req,400,'invalid_action');
  if(prior&&fresh(prior.checked_at,Date.now(),30000))return out(req,200,{ok:true,health:prior,cached:true});
  return out(req,200,{ok:true,health:await audit(req,u.id,false,await globals())});
 }catch(_){return err(req,503,'health_service_unavailable');}
}
Deno.serve(handleHealth);
