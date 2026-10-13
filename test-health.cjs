'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let passed=0;async function test(name,fn){await fn();passed++;console.log('PASS '+name)}
const uid='11111111-1111-1111-1111-111111111111',at=Date.now();
const box={Deno:{env:{get:k=>k==='SUPABASE_URL'?'https://auth.test':'test-server-key'},serve:()=>{}},Response,Request,AbortSignal,Date,URL,console};vm.createContext(box);
vm.runInContext(fs.readFileSync(__dirname+'/radar-health-worker.ts','utf8')+';globalThis.api={inspectPaper,handleHealth,balance,audit};',box);
const row=()=>({last_tick:new Date(at).toISOString(),ledger:{cash:0,pendingWithdrawalUSDT:0,positions:{},orders:[],autoEnabled:true,binanceReference:{userId:uid},binanceSyncError:''}});
(async()=>{
 await test('saldo zero e nenhuma ordem não são falhas',()=>assert(box.api.inspectPaper(row(),uid,at).every(x=>x.status==='ok')));
 await test('robô atrasado é detectado',()=>{const r=row();r.last_tick='2020-01-01';assert.equal(box.api.inspectPaper(r,uid,at)[0].status,'error')});
 await test('automático desligado é informativo',()=>{const r=row();r.ledger.autoEnabled=false;assert.equal(box.api.inspectPaper(r,uid,at)[0].status,'info')});
 await test('conta divergente e ordem inconsistente detectadas',()=>{const r=row();r.ledger.binanceReference.userId='other';r.ledger.orders=[{paper:false}];const c=box.api.inspectPaper(r,uid,at);assert.equal(c[1].status,'error');assert.equal(c[2].status,'error')});
 await test('vistoria não modifica ledger',()=>{const r=row(),before=JSON.stringify(r);box.api.inspectPaper(r,uid,at);assert.equal(JSON.stringify(r),before)});
 await test('cron sem segredo bloqueado sem consultar banco',async()=>{box.fetch=()=>{throw Error('unexpected fetch')};const r=await box.api.handleHealth(new Request('https://worker.test',{method:'POST',body:'{"action":"cron"}'}));assert.equal(r.status,401)});
 await test('leitura sem autenticação rejeitada',async()=>{const r=await box.api.handleHealth(new Request('https://worker.test'));assert.equal(r.status,401)});
 await test('origem não autorizada rejeitada',async()=>{const r=await box.api.handleHealth(new Request('https://worker.test',{headers:{origin:'https://evil.test'}}));assert.equal(r.status,403)});
 await test('saldo válido zero aceito, saldo antigo rejeitado',async()=>{for(const [date,status] of [[new Date().toISOString(),'ok'],['2020-01-01','error']]){box.fetch=async()=>new Response(JSON.stringify({ok:true,balances:[{symbol:'USDT',free:'0'}],updatedAt:date}));assert.equal((await box.api.balance(new Request('https://worker.test'),uid,false,at)).status,status)}});
 await test('consulta limita relatório ao usuário autenticado',async()=>{const urls=[];box.fetch=async(url)=>{urls.push(url);return new Response(JSON.stringify(url.includes('/auth/v1/user')?{id:uid,email_confirmed_at:'2020-01-01'}:[]))};const r=await box.api.handleHealth(new Request('https://worker.test?user_id=other',{headers:{authorization:'Bearer test'}}));assert.equal(r.status,200);assert(urls.at(-1).includes('user_id=eq.'+uid));assert(!urls.at(-1).includes('other'))});
 await test('auditoria só grava na tabela de relatórios',async()=>{const writes=[];box.fetch=async(url,opt={})=>{if(opt.method&&opt.method!=='GET')writes.push(url);if(url.includes('/api/binance-wallet'))return new Response(JSON.stringify({ok:true,balances:[],updatedAt:new Date().toISOString()}));if(url.includes('radar_paper_cloud_accounts'))return new Response(JSON.stringify([row()]));return new Response('[]')};await box.api.audit(new Request('https://worker.test'),uid,false,[]);assert.equal(writes.length,2);assert(writes.every(x=>x.includes('/radar_health_reports')))});
 console.log(passed+' testes da vistoria aprovados');
})().catch(e=>{console.error(e);process.exitCode=1});
