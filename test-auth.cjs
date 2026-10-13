const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let src=fs.readFileSync(__dirname+'/binance-wallet.js','utf8').split('/* RADAR TRADER 20.0')[0];
src=src.replace(" if(document.readyState==='loading')",' globalThis.testAuth={saveAuth,validToken,clearAuth,state};\n if(document.readyState===\'loading\')');
const makeStorage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
let calls=0,mode='ok';const localStorage=makeStorage(),sessionStorage=makeStorage();const b={localStorage,sessionStorage,window:{dispatchEvent:()=>{}},document:{readyState:'loading',getElementById:()=>null,addEventListener:()=>{}},navigator:{},Event:class{},Date,console,fetch:async()=>{calls++;if(mode==='network')throw Error('network');return {ok:mode==='ok',status:mode==='reject'?401:200,json:async()=>({access_token:'renewed',refresh_token:'renewed-r',expires_in:3600})}}};vm.createContext(b);vm.runInContext(src,b);const a=b.testAuth,key='radar:auth:1967';
(async()=>{
 a.state.conf={supabaseUrl:'https://example.supabase.co',publicKey:'pub'};a.saveAuth({access_token:'old',refresh_token:'old-r',expires_at:1});assert(localStorage.getItem(key));assert.equal(sessionStorage.getItem(key),null);
 await Promise.all([a.validToken(),a.validToken()]);assert.equal(calls,1);assert.equal(JSON.parse(localStorage.getItem(key)).access_token,'renewed');
 a.state.auth=null;assert.equal(await a.validToken(),'renewed');
 a.saveAuth({access_token:'old',refresh_token:'old-r',expires_at:1});mode='network';await assert.rejects(()=>a.validToken());assert(localStorage.getItem(key));
 mode='reject';await assert.rejects(()=>a.validToken());assert.equal(localStorage.getItem(key),null);
 console.log('5 verificações de sessão aprovadas: persistência, renovação única, reabertura, falha temporária e revogação.');
})().catch(e=>{console.error(e);process.exitCode=1});
