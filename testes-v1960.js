'use strict';
// Deterministic offline regression suite for five review rounds.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const root=__dirname;
function mockRequire(file,lib,mocks={}){
  const filename=path.join(root,file);
  delete require.cache[filename];
  const original=Module._load;
  Module._load=function(request,parent,isMain){
    if(request==='./push-server-lib')return lib;
    if(mocks[request])return mocks[request];
    return original.apply(this,arguments);
  };
  try{return require(filename)}finally{Module._load=original}
}
function mkRes(){return {code:0,data:null,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(c){this.code=c;return this},json(data){this.data=data;return this}}}
async function test(){const results=[];
 const add=(round,name)=>results.push({round,name,result:'PASS'});
 // Round 1: omitted settings stay omitted in test requests, rather than overriding saved prefs.
 {
  const saves=[];const lib={saveSubscription:async x=>{saves.push(x);return {id:'testid',language:'es',prefs:{market:false},...x}},sendPush:async()=>({ok:true})};
  for(const file of ['push-test.js','push-schedule-test.js']){
   const handler=mockRequire(file,lib);const res=mkRes();await handler({method:'POST',body:{subscription:{endpoint:'https://push.example/1'}}},res);
   assert.equal(res.code,200,file);assert.equal('prefs' in saves.at(-1),false);assert.equal('context' in saves.at(-1),false);assert.equal('mirror' in saves.at(-1),false);assert.equal('language' in saves.at(-1),false);add(1,file+' preserves omitted fields');
  }
  const h=mockRequire('push-test.js',lib);const res=mkRes();await h({method:'POST',body:{subscription:{endpoint:'https://push.example/1'},prefs:{market:false},language:'en'}},res);
  assert.equal(saves.at(-1).prefs.market,false);assert.equal(saves.at(-1).language,'en');add(1,'explicit settings still accepted');
 }
 // Round 2: VAPID initialization errors are returned rather than thrown (no external dependency).
 {
  const originalFetch=global.fetch; const origUrl=process.env.KV_REST_API_URL,origToken=process.env.KV_REST_API_TOKEN;
  delete process.env.KV_REST_API_URL;delete process.env.KV_REST_API_TOKEN;
  const lib=mockRequire('push-server-lib.js',null,{'web-push':{generateVAPIDKeys:()=>({publicKey:'p',privateKey:'s'}),setVapidDetails:()=>{},sendNotification:async()=>({statusCode:201})}});
  const r=await lib.sendPush({headers:{}},{id:'abc',subscription:{endpoint:'https://fcm.googleapis.com/fcm/send/test',keys:{p256dh:'p',auth:'a'}}},{title:'x'});
  assert.equal(r.ok,false);assert.match(r.error,/ausentes/);add(2,'missing VAPID/KV configuration is handled');
  if(origUrl!==undefined)process.env.KV_REST_API_URL=origUrl;if(origToken!==undefined)process.env.KV_REST_API_TOKEN=origToken;global.fetch=originalFetch;
 }
 // Round 3: pending test consumes one slot; market alerts cannot overflow user per-scan limit.
 {
  const originalFetch=global.fetch;const priorSecret=process.env.CRON_SECRET;delete process.env.CRON_SECRET;
  const sent=[];const state={prevPrices:{BTC:100},cooldowns:{},pullbacks:{}};
  const lib={acquireCronLock:async()=>true,listSubscriptions:async()=>[{id:'person-1',language:'en',pendingLockedTest:true,prefs:{market:true,pullback:false,portfolio:false,alertFrequency:'important'},context:{wallet:[{symbol:'BTC'}]}}],saveSubscription:async rec=>rec,sendPush:async(r,rec,payload)=>{sent.push(payload);return {ok:true}},getMarketState:async()=>state,setMarketState:async s=>Object.assign(state,s)};
  global.fetch=async()=>({ok:true,json:async()=>[{symbol:'BTCUSDT',quoteVolume:'1000000',priceChangePercent:'20',lastPrice:'110'},{symbol:'ETHUSDT',quoteVolume:'1000',priceChangePercent:'20',lastPrice:'100'}]});
  const cron=mockRequire('push-cron.js',lib);const res=mkRes();await cron({method:'GET',headers:{}},res);
  assert.equal(res.code,200,JSON.stringify(res.data));assert(sent.some(x=>x.kind==='locked-test'));
  assert(sent.length<=2,'Too many alerts for important profile: '+sent.length);add(3,'test notification counts against per-scan cap');
  assert.equal(res.data.failed,0);add(3,'cron produces consistent send counters');
  global.fetch=originalFetch;if(priorSecret!==undefined)process.env.CRON_SECRET=priorSecret;
 }
 // Round 4: contextual V18 signals never display user-supplied PT explanations to EN/ES recipients.
 {
  const origFetch=global.fetch, oldURL=process.env.KV_REST_API_URL, oldToken=process.env.KV_REST_API_TOKEN;
  process.env.KV_REST_API_URL='https://mockkv.example';process.env.KV_REST_API_TOKEN='dummy';
  global.fetch=async()=>({ok:true,json:async()=>({result:JSON.stringify({publicKey:'fakepublic',privateKey:'fakeprivate'})})});
  let payload;
  const lib=mockRequire('push-server-lib.js',null,{'web-push':{generateVAPIDKeys:()=>({publicKey:'p',privateKey:'s'}),setVapidDetails:()=>{},sendNotification:async(_,body)=>{payload=JSON.parse(body);return {statusCode:201}}}});
  for(const language of ['en','es']){
   const result=await lib.sendPush({headers:{host:'my.example'}},{id:'123',language,subscription:{endpoint:'https://fcm.googleapis.com/fcm/send/test',keys:{p256dh:'key',auth:'key'}}},{kind:'v18-signal',title:'🧠 Radar V18: BTC',symbol:'BTC',body:'Compra confirmada • 87/100 • Moeda com tendência em alta'});
   assert.equal(result.ok,true);assert.equal(payload.lang,language);assert(!/Compra confirmada|Moeda com tendência/i.test(payload.body));assert(payload.body.includes('87/100'));add(4,'V18 alert fully localized for '+language);
  }
  global.fetch=origFetch;if(oldURL===undefined)delete process.env.KV_REST_API_URL;else process.env.KV_REST_API_URL=oldURL;
  if(oldToken===undefined)delete process.env.KV_REST_API_TOKEN;else process.env.KV_REST_API_TOKEN=oldToken;
 }
 // Round 5: service worker only caches first party, and core resources exist.
 {
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  assert(sw.includes('if(url.origin!==self.location.origin)return;'));
  assert(/const CACHE='cripto-radar-[^']+'/.test(sw));
  const core=sw.match(/const CORE=(\[[^;]+\]);/);assert(core,'CORE missing');
  const paths=JSON.parse(core[1].replaceAll("'",'"'));
  for(const resource of paths){if(resource==='./')continue;assert(fs.existsSync(path.join(root,resource.replace(/^\.\//,''))),resource)}
  add(5,'offline resources and first-party boundary');
  const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  for(const x of vercel.builds)assert(fs.existsSync(path.join(root,x.src)),x.src);
  for(const x of manifest.icons)assert(fs.existsSync(path.join(root,x.src)),x.src);
  assert(/^\d+\.\d+\.\d+$/.test(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version));
  add(5,'Vercel assets, PWA manifest and package versions');
 }
 return {version:'19.6.0',source:'19.5.9',rounds:5,passed:results.length,failed:0,results,pending:['Device Push and lockscreen tests','Vercel deployment and cloud KV','Google Play Billing','Foreign-language source news','Live Android UI regression']};
}
test().then(x=>{console.log(JSON.stringify(x,null,2));}).catch(e=>{console.error(e.stack);process.exitCode=1});
