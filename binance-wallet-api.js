/* Cripto Radar 19.6.8 — conexão Spot por usuário autenticado, leitura apenas. */
'use strict';
const crypto=require('node:crypto');
const lib=require('./radar-binance-service');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('Vary','Authorization');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 try{
  if(!['GET','POST','DELETE'].includes(req.method))throw new lib.ApiError(405,'method_not_allowed');
  lib.guardOrigin(req);
  const conf=lib.env();
  const user=await lib.authUser(req,conf);
  const userToken=lib.getBearer(req);
  if(req.method==='POST'){
   if(Number(req.headers?.['content-length']||0)>8192)throw new lib.ApiError(413,'payload_too_large');
   let input=req.body;
   if(typeof input==='string')try{input=JSON.parse(input)}catch(_){throw new lib.ApiError(400,'invalid_body')}
   if(input&&JSON.stringify(input).length>8192)throw new lib.ApiError(413,'payload_too_large');
   const creds=lib.getCredentials(input);
   const offset=await lib.restrictions(creds.key,creds.secret);
   await lib.balances(creds.key,creds.secret,offset); // Test connection before saving.
   const encrypted=lib.encrypt(creds,conf.master);
   const fingerprint=crypto.createHash('sha256').update(creds.key).digest('hex').slice(0,12);
   await lib.db('POST',user.id,{user_id:user.id,encrypted_credentials:encrypted,api_fingerprint:fingerprint,connected_at:new Date().toISOString(),last_synced_at:null,encrypted_snapshot:null},conf,userToken);
   return lib.respond(res,200,{ok:true,connected:true,readOnly:true});
  }
  if(req.method==='DELETE'){
   await lib.db('DELETE',user.id,null,conf,userToken);
   return lib.respond(res,200,{ok:true,connected:false});
  }
  const row=await lib.db('GET',user.id,null,conf,userToken);
  if(new URL(req.url,'https://radar.invalid').searchParams.get('action')==='status')return lib.respond(res,200,{ok:true,connected:!!row,readOnly:true,connectedAt:row?.connected_at||null,lastSyncedAt:row?.last_synced_at||null});
  if(!row)throw new lib.ApiError(404,'binance_not_connected');
  if(row.last_synced_at&&row.encrypted_snapshot&&Date.now()-Date.parse(row.last_synced_at)<110000){
   try{const cached=lib.decrypt(row.encrypted_snapshot,conf.master);if(Array.isArray(cached.balances))return lib.respond(res,200,{ok:true,source:'Binance Spot (cache privado)',scope:'spot',readOnly:true,updatedAt:row.last_synced_at,balances:cached.balances})}catch(_){}
  }
  const creds=lib.decrypt(row.encrypted_credentials,conf.master);
  const offset=await lib.restrictions(creds.key,creds.secret); // Re-check permissions even after initial enrollment.
  const list=await lib.balances(creds.key,creds.secret,offset);
  const updatedAt=new Date().toISOString();
  await lib.db('PATCH',user.id,{last_synced_at:updatedAt,encrypted_snapshot:lib.encrypt({balances:list},conf.master)},conf,userToken);
  return lib.respond(res,200,{ok:true,source:'Binance Spot',scope:'spot',readOnly:true,updatedAt,balances:list});
 }catch(err){
  const status=err instanceof lib.ApiError?err.status:500;
  const error=err instanceof lib.ApiError?err.code:'internal_error';
  return lib.respond(res,status,{ok:false,error,
   ...(Number.isInteger(err?.binanceCode)?{binanceCode:err.binanceCode}:{}),
   ...(['permissions','balances'].includes(err?.stage)?{stage:err.stage}:{})
  });
 }
};
