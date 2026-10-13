
/* Radar Trader 20.1. PAPER ONLY: nunca envia ordens reais Binance. */
const URL_BASE=(Deno.env.get('SUPABASE_URL')||'').replace(/\/$/,'');
const SRK=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const ORIGINS=['https://carteira-cripto-pi.vercel.app','https://carteira-cripto-douglasgarciaa25-5926.vercel.app','http://localhost:3000','http://localhost:5173'];
const SYMBOLS=['BTC','ETH','SOL','BNB','XRP'];
const LIMITS={maxTradePct:5,maxVolatilePct:30,maxAssetPct:20,maxDailyLossPct:2,maxTradesPerDay:3,cooldownMinutes:15,feePct:0.1,slippagePct:0.1,minQuote:0,stopLossPct:4,takeProfitPct:8};
function hdr(req){const o=req.headers.get('origin');return {'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-radar-cron-token','Access-Control-Allow-Methods':'GET,POST,OPTIONS',...(o&&ORIGINS.includes(o)?{'Access-Control-Allow-Origin':o}:{})};}
function out(req,n,v){return new Response(JSON.stringify(v),{status:n,headers:hdr(req)});}
function err(req,n,e){return out(req,n,{ok:false,error:e});}
const nowDate=ms=>new Date(ms).toISOString().slice(0,10);
const r8=x=>Number((Number(x)||0).toFixed(12));
const good=x=>Number.isFinite(Number(x))&&Number(x)>0;
const dbHeaders=p=>({apikey:SRK,Authorization:'Bearer '+SRK,'Content-Type':'application/json',...(p?{Prefer:p}:{})});
async function db(method,table,query='',value=null,prefer=''){const r=await fetch(URL_BASE+'/rest/v1/'+table+query,{method,headers:dbHeaders(prefer),body:value?JSON.stringify(value):undefined,signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('db_'+r.status);return await r.json().catch(()=>null);}

 function syncBinanceReference(s,b,now=Date.now()){
  const at=Date.parse(b?.updatedAt||''),free=Number(b?.freeUSDT);
  if(typeof b?.userId!=='string'||!b.userId||b?.source!=='binance_spot'||!Number.isFinite(at)||at>now+60000||now-at>180000||!Number.isFinite(free)||free<0)throw Error('binance_balance_stale');
  if(s.binanceReference?.userId&&s.binanceReference.userId!==b.userId)throw Error('binance_account_mismatch');
  const previous=s.binanceReference;
  if(previous&&at<Date.parse(previous.updatedAt))throw Error('binance_balance_stale');
  const delta=free-(previous?Number(previous.freeUSDT):Number(s.initialUSDT));
  if(!Number.isFinite(delta))throw Error('binance_reference_invalid');
  s.cash=Number((Number(s.cash)+delta).toFixed(12));
  s.dayStartNAV=Number((Number(s.dayStartNAV)+delta).toFixed(12));
  s.initialUSDT=Number((Number(s.initialUSDT)+delta).toFixed(12));
  s.capitalSource='binance_spot';
  s.binanceReference={userId:b.userId,freeUSDT:free,updatedAt:b.updatedAt};
  s.binanceSyncError='';
  return s;
 }
 function referenceError(s,now=Date.now()){
  const b=s.binanceReference,at=Date.parse(b?.updatedAt||'');
  if(s.binanceSyncError||!b||!Number.isFinite(at)||now-at>180000||at>now+60000)return 'Saldo Binance indisponível ou desatualizado. Aguarde a sincronização.';
  return '';
 }
function create(cap=1000){cap=Number(cap);if(!Number.isFinite(cap)||cap<=0||cap>1e7)throw Error('invalid_capital');return {version:'20.1.3',createdAt:new Date().toISOString(),initialUSDT:cap,cash:cap,positions:{},orders:[],lastPrices:{},lastMarket:{},limits:{...LIMITS},mode:'manual',autoEnabled:false,killed:false,killReason:'',day:nowDate(Date.now()),dayStartNAV:cap,lastTradeAt:0,lastTick:0,lastStatus:'Aguardando leitura do servidor'};}
function stats(s,m){let invested=0,stale=[];for(const [symbol,p] of Object.entries(s.positions||{})){const q=m[symbol],valid=q&&good(q.price)&&Math.abs(Date.now()-q.at)<180000;const px=valid?q.price:s.lastPrices?.[symbol];if(!valid)stale.push(symbol);invested+=good(px)?px*Number(p.qty):0;}const nav=r8(s.cash+invested),start=Number(s.dayStartNAV)||s.initialUSDT;return {nav,invested,stale,dailyPnlPct:start?100*(nav-start)/start:0};}
function available(s,m,sym,side,amount,auto,at,protective=false){
 const exit=protective&&auto&&side==='SELL'&&!!s.positions?.[sym];
 if(referenceError(s,at))return 'binance_balance_stale';
 if(s.killed)return 'emergency_active';
 if(auto&&(!s.autoEnabled||s.mode!=='auto'))return 'automatic_disabled';
 if(!SYMBOLS.includes(sym)||!['BUY','SELL'].includes(side))return 'unsupported_symbol';
 if(!Number.isFinite(amount)||amount<=0)return 'invalid_virtual_quote';
 const q=m[sym];if(!q||!good(q.price)||Math.abs(at-q.at)>180000)return 'stale_price';
 if(exit){if(!(q.volume>0)||!(q.spread>=0&&q.spread<=1))return 'protective_exit_no_liquidity';}
 else if(!(q.volume>=3000000)||!(q.spread>=0&&q.spread<=0.3))return 'insufficient_liquidity';
 const st=stats(s,m);
 if(st.stale.length&&!exit)return 'stale_open_position';
 if(side==='BUY'&&st.dailyPnlPct<=-s.limits.maxDailyLossPct)return 'daily_loss_limit';
 if(side==='BUY'&&s.orders.filter(o=>o.at.slice(0,10)===nowDate(at)&&o.side==='BUY').length>=s.limits.maxTradesPerDay)return 'daily_orders_limit';
 if(!exit&&at-Number(s.lastTradeAt||0)<s.limits.cooldownMinutes*60000)return 'cooldown';
 if(!exit&&amount>st.nav*s.limits.maxTradePct/100+1e-12)return 'single_order_limit';
 if(side==='BUY'){
  if(amount>s.cash+1e-12)return 'insufficient_virtual_cash';
  if(st.invested+amount>st.nav*s.limits.maxVolatilePct/100+1e-12)return 'total_exposure_limit';
  const cur=Number(s.positions?.[sym]?.qty||0)*q.price;
  if(cur+amount>st.nav*s.limits.maxAssetPct/100+1e-12)return 'asset_concentration_limit';
 }else if(!s.positions?.[sym]||amount>s.positions[sym].qty*q.price*(1+1e-10))return 'insufficient_virtual_asset';
 return '';
}
function trade(s,side,sym,amount,market,auto,reason,at,protective=false){
 const exit=protective&&auto&&side==='SELL'&&!!s.positions?.[sym];
 if(exit)amount=s.positions[sym].qty*Number(market[sym]?.price||0);
 const why=available(s,market,sym,side,amount,auto,at,exit);if(why)return {ok:false,reason:why};
 const px=market[sym].price,slip=s.limits.slippagePct/100,rate=s.limits.feePct/100;
 let qty,fee,pnl=0,fill;
 if(side==='BUY'){fill=px*(1+slip);fee=amount*rate;qty=r8((amount-fee)/fill);if(!(qty>0))return {ok:false,reason:'quantity_precision_unavailable'};const p=s.positions[sym]||{qty:0,cost:0};s.positions[sym]={qty:r8(p.qty+qty),cost:r8(p.cost+amount)};s.cash=r8(s.cash-amount);}
 else{const p=s.positions[sym];fill=px*(1-slip);qty=exit?p.qty:Math.min(p.qty,r8(amount/px));fee=qty*fill*rate;const basis=p.cost*qty/p.qty;const proceeds=qty*fill-fee;pnl=r8(proceeds-basis);s.cash=r8(s.cash+proceeds);const left=r8(p.qty-qty);if(left<=0)delete s.positions[sym];else s.positions[sym]={qty:left,cost:r8(p.cost-basis)};}
 s.lastTradeAt=at;s.lastPrices[sym]=px;
 const order={binanceFreeUSDT:s.binanceReference.freeUSDT,binanceUpdatedAt:s.binanceReference.updatedAt,id:String(at)+'-'+String(s.orders.length+1),at:new Date(at).toISOString(),side,symbol:sym,quote:r8(amount),qty,price:r8(fill),fee:r8(fee),realized:pnl,source:auto?'AUTO':'MANUAL',reason,paper:true,protectiveExit:!!exit,belowIllustrativeMin:false,
  disclaimer:'Somente simulação. Ordem real abaixo do mínimo do par pode ser rejeitada pela Binance.'};
 s.orders.push(order);s.orders=s.orders.slice(-200);return {ok:true,order};
}
const ema=(a,len)=>{let v=a.slice(0,len).reduce((x,y)=>x+y,0)/len;for(let i=len;i<a.length;i++)v=(a[i]-v)*2/(len+1)+v;return v;};
function rsi(a){let g=0,l=0;for(let i=a.length-14;i<a.length;i++){const d=a[i]-a[i-1];if(d>0)g+=d;else l-=d;}return l<=0?100:100-100/(1+g/l);}
async function pub(path){for(const root of ['https://data-api.binance.vision','https://api.binance.com'])try{const r=await fetch(root+path,{signal:AbortSignal.timeout(4500),headers:{Accept:'application/json'}});if(r.ok)return await r.json();}catch(_){}throw Error('market_source_down');}
async function quote(sym,at){
 const pair=sym+'USDT';
 const [k15,k60,t,b]=await Promise.all([pub('/api/v3/klines?symbol='+pair+'&interval=15m&limit=48'),pub('/api/v3/klines?symbol='+pair+'&interval=1h&limit=48'),pub('/api/v3/ticker/24hr?symbol='+pair),pub('/api/v3/ticker/bookTicker?symbol='+pair)]);
 if(!Array.isArray(k15)||!Array.isArray(k60)||k15.length<35||k60.length<35)throw Error('kline_missing');
 const a=k15.slice(0,-1),h=k60.slice(0,-1),pr=a.map(x=>Number(x[4])),hr=h.map(x=>Number(x[4]));
 if(!pr.every(good)||!hr.every(good)||Math.abs(at-Number(a.at(-1)[6]))>35*60000)throw Error('kline_old');
 const price=Number(t.lastPrice),volume=Number(t.quoteVolume),bid=Number(b.bidPrice),ask=Number(b.askPrice);
 if(!good(price)||!good(volume)||!good(bid)||!good(ask))throw Error('price_missing');
 const spread=100*(ask-bid)/((bid+ask)/2);
 const v=Number(a.at(-1)[5]),prior=a.slice(-21,-1).reduce((sum,x)=>sum+Number(x[5]),0)/20;
 const bull=ema(pr,9)>ema(pr,21)&&ema(hr,9)>ema(hr,21);
 const bear=ema(pr,9)<ema(pr,21)&&ema(hr,9)<ema(hr,21);
 return {symbol:sym,price,volume,spread,at,confirmed:bull&&rsi(pr)>=45&&rsi(pr)<=67&&v>=prior*1.1&&volume>=3000000&&spread<=0.3,bear};
}
async function allMarket(at){const list=await Promise.allSettled(SYMBOLS.map(sym=>quote(sym,at)));const ret={};for(let i=0;i<list.length;i++)if(list[i].status==='fulfilled')ret[SYMBOLS[i]]=list[i].value;return ret;}
function scan(s,market,at){s.lastTick=at;
 if(s.day!==nowDate(at)){s.day=nowDate(at);s.dayStartNAV=stats(s,market).nav;}
 s.lastMarket=market;for(const [k,x] of Object.entries(market))if(good(x.price))s.lastPrices[k]=x.price;
 const st=stats(s,market);
 if(s.killed||!s.autoEnabled||s.mode!=='auto'){s.lastStatus=s.killed?'Emergência ativa':'Robô desligado';return null;}
 for(const [symbol,pos] of Object.entries(s.positions||{})){const q=market[symbol];if(!q||!good(q.price)||Math.abs(at-q.at)>180000){s.lastStatus='Cotação indisponível para proteção de '+symbol;continue;}const ret=100*(q.price/(pos.cost/pos.qty)-1);
  if(ret<=-s.limits.stopLossPct||ret>=s.limits.takeProfitPct||q.bear){const reason=ret<=-s.limits.stopLossPct?'Stop fictício':ret>=s.limits.takeProfitPct?'Take profit fictício':'Tendência de baixa';const amount=pos.qty*q.price;const done=trade(s,'SELL',symbol,amount,market,true,reason,at,true);s.lastStatus=done.ok?'Venda fictícia '+symbol:'Venda bloqueada: '+done.reason;return done.ok?done:null;}}
 if(st.stale.length){s.lastStatus='Posições sem cotação recente: '+st.stale.join(', ');return null;}
 if(st.dailyPnlPct<=-s.limits.maxDailyLossPct){s.lastStatus='Limite de perda diário: compras pausadas; proteção segue monitorada';return null;}
 if(Object.keys(market).length!==SYMBOLS.length){s.lastStatus='Mercado parcial: novas compras suspensas';return null;}
 for(const q of Object.values(market).filter(x=>x.confirmed&&!s.positions?.[x.symbol]).sort((a,b)=>a.spread-b.spread)){const amount=r8(Math.min(s.cash,st.nav*s.limits.maxTradePct/100,st.nav*s.limits.maxVolatilePct/100-st.invested,st.nav*s.limits.maxAssetPct/100));if(!(amount>0))continue;const done=trade(s,'BUY',q.symbol,amount,market,true,'Confluência confirmada 15m/1h',at);if(done.ok){s.lastStatus='Compra fictícia '+q.symbol;return done;}}
 s.lastStatus='Nenhuma compra confirmada dentro do risco';return null;
}
const fields='user_id,ledger,version,auto_enabled,last_tick,last_status,updated_at';
const accountQuery=uid=>'?user_id=eq.'+uid+'&select='+fields;
async function get(uid){const a=await db('GET','radar_paper_cloud_accounts',accountQuery(uid));return a?.[0]||null;}
async function save(row,s,at){const q='?user_id=eq.'+row.user_id+'&version=eq.'+row.version+'&select='+fields;const updated=await db('PATCH','radar_paper_cloud_accounts',q,{ledger:s,version:Number(row.version)+1,auto_enabled:!!s.autoEnabled,last_tick:at??row.last_tick,last_status:s.lastStatus,updated_at:new Date().toISOString()},'return=representation');return updated?.[0]||null;}
async function user(req){const m=/^Bearer\s+(\S+)$/i.exec(req.headers.get('authorization')||'');if(!m||m[1].length>8192)return null;const r=await fetch(URL_BASE+'/auth/v1/user',{headers:{apikey:SRK,Authorization:'Bearer '+m[1]},signal:AbortSignal.timeout(7000)});if(!r.ok)return null;const u=await r.json();return /^[a-f0-9-]{36}$/i.test(String(u?.id||''))&&u?.email_confirmed_at?u:null;}
async function cronAuth(req){const token=req.headers.get('x-radar-cron-token')||'';if(token.length<48)return false;const r=await fetch(URL_BASE+'/rest/v1/rpc/radar_paper_cron_authorized',{method:'POST',headers:dbHeaders(),body:JSON.stringify({supplied:token})});return r.ok&&(await r.json())===true;}
async function syncBalance(req,uid,s,cron=false){
 const headers=cron?{Authorization:'Bearer '+SRK,'x-radar-cron-token':req.headers.get('x-radar-cron-token'),'x-radar-user-id':uid}:{Authorization:req.headers.get('authorization')||''};
 const r=await fetch('https://carteira-cripto-pi.vercel.app/api/binance-wallet',{headers,signal:AbortSignal.timeout(25000),redirect:'error'});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||!j.ok||!Array.isArray(j.balances))throw Error('binance_sync_unavailable');
 const entry=j.balances.find(x=>x.symbol==='USDT');
 syncBinanceReference(s,{source:'binance_spot',userId:uid,freeUSDT:entry?Number(entry.free):0,updatedAt:j.updatedAt});
}
async function runCron(req){
 if(!await cronAuth(req))return err(req,401,'cron_not_authorized');
 const rows=await db('GET','radar_paper_cloud_accounts','?select='+fields+'&order=last_tick.asc.nullsfirst&limit=8');
 if(!rows?.length)return out(req,200,{ok:true,checked:0,orders:0,paper:true});
 const at=Date.now(),market=await allMarket(at);let checked=0,orders=0,paused=0;
 for(let start=0;start<rows.length;start+=4)await Promise.all(rows.slice(start,start+4).map(async row=>{try{
  const state=structuredClone(row.ledger),prior=state.orders?.at(-1)?.id;state.limits={...LIMITS,...state.limits,minQuote:0};
  try{await syncBalance(req,row.user_id,state,true);scan(state,market,Date.now());}
  catch(_){state.binanceSyncError='binance_sync_unavailable';state.lastStatus='Saldo Binance indisponível: ordens fictícias pausadas';paused++;}
  const saved=await save(row,state,new Date().toISOString());if(saved){checked++;if(state.orders?.at(-1)?.id!==prior)orders++;}
 }catch(_){} }));
 return out(req,200,{ok:true,checked,orders,paused,marketSymbols:Object.keys(market).length,paper:true});
}
async function handle(req,u,payload){
 let row=await get(u.id);
 if(req.method==='GET')return out(req,200,{ok:true,account:row,paper:true});
 const action=String(payload.action||'');
 if(action==='init'||(action==='sync-balance'&&!row)){if(!row){const state=create(1);await syncBalance(req,u.id,state);const made=await db('POST','radar_paper_cloud_accounts','?on_conflict=user_id&select='+fields,{user_id:u.id,ledger:state,version:1,auto_enabled:false,last_status:state.lastStatus},'resolution=ignore-duplicates,return=representation');row=made?.[0]||await get(u.id);}return out(req,200,{ok:true,account:row,paper:true});}
 if(!row)return err(req,404,'paper_account_not_initialized');
 const s=structuredClone(row.ledger);s.limits={...LIMITS,...s.limits,minQuote:0};let order=null;
 if(action==='mode'){s.mode=payload.mode==='auto'?'auto':'manual';s.autoEnabled=false;s.lastStatus='Modo alterado; automático desligado';}
 else if(action==='auto'){if(payload.enabled===true){if(s.killed||s.mode!=='auto')return err(req,409,'emergency_or_manual_mode');s.autoEnabled=true;s.lastStatus='Robô fictício do servidor ativado';}else{s.autoEnabled=false;s.lastStatus='Robô fictício desligado';}}
 else if(action==='kill'){s.killed=true;s.autoEnabled=false;s.killReason='Acionado pelo usuário';s.lastStatus='PARADA DE EMERGÊNCIA ATIVA';}
 else if(action==='resume'){s.killed=false;s.autoEnabled=false;s.killReason='';s.lastStatus='Rearmado; automático desligado';}
 else if(action==='reset'){const fresh=create(1);await syncBalance(req,u.id,fresh);if(s.killed){fresh.killed=true;fresh.killReason='Parada mantida';}Object.assign(s,fresh);s.lastStatus='Conta fictícia reiniciada';}
 else if(action==='limits'){const safe={maxTradePct:5,maxVolatilePct:30,maxAssetPct:20,maxDailyLossPct:2,maxTradesPerDay:3,cooldownMinutes:1440,stopLossPct:4,takeProfitPct:12};for(const [k,v] of Object.entries(payload.limits||{})){const n=Number(v);if(!(k in safe)||!Number.isFinite(n)||n<=0||n>safe[k]||(k==='cooldownMinutes'&&n<15)||(k==='maxTradesPerDay'&&!Number.isInteger(n)))return err(req,400,'invalid_limits');s.limits[k]=n;}s.autoEnabled=false;s.lastStatus='Limites alterados; automático desligado';}
 else if(action==='manual'){if(s.mode!=='manual')return err(req,409,'select_manual_mode');await syncBalance(req,u.id,s);const market=await allMarket(Date.now());if(!Object.keys(market).length)return err(req,503,'market_data_unavailable');const result=trade(s,String(payload.side||'').toUpperCase(),String(payload.symbol||'').toUpperCase(),Number(payload.quote),market,false,'Manual autorizado pelo usuário',Date.now());if(!result.ok)return out(req,422,{ok:false,error:'trade_blocked',reason:result.reason,paper:true});order=result.order;s.lastMarket=market;s.lastStatus='Ordem fictícia manual registrada';}
 else if(action==='scan'){if(s.mode!=='auto'||!s.autoEnabled)return err(req,409,'auto_not_enabled');await syncBalance(req,u.id,s);const market=await allMarket(Date.now());if(!Object.keys(market).length)return err(req,503,'market_data_unavailable');const done=scan(s,market,Date.now());order=done?.order||null;}
 else if(action==='sync-balance'){await syncBalance(req,u.id,s);s.lastStatus='Saldo Binance atualizado para todas as ordens fictícias';}
 else return err(req,400,'invalid_action');
 const saved=await save(row,s,action==='scan'?new Date().toISOString():undefined);return saved?out(req,200,{ok:true,account:saved,order,paper:true}):err(req,409,'state_changed_retry');
}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:hdr(req)});
 if(!['GET','POST'].includes(req.method))return err(req,405,'method_not_allowed');
 const origin=req.headers.get('origin');if(origin&&!ORIGINS.includes(origin))return err(req,403,'origin_forbidden');
 if(!URL_BASE||!SRK)return err(req,503,'server_not_configured');
 try{const raw=req.method==='POST'?await req.text():'';if(raw.length>3500)return err(req,413,'request_too_large');const body=raw?JSON.parse(raw):{};if(req.method==='POST'&&body.action==='cron')return await runCron(req);const u=await user(req);if(!u)return err(req,401,'login_required');return await handle(req,u,body);}catch(e){if(String(e.message)==='invalid_capital')return err(req,400,'invalid_parameters');if(String(e.message).startsWith('binance_'))return err(req,503,'binance_sync_unavailable');return err(req,503,'paper_worker_temporarily_unavailable');}
});

