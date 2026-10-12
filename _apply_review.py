from pathlib import Path
import json,re
p=Path('/mnt/data/radar-v1960-five-review')
def change(fn,old,new):
 f=p/fn;s=f.read_text();assert old in s,(fn,old[:80]);f.write_text(s.replace(old,new),encoding='utf8')
# R1: test requests should not wipe persisted prefs/context/language
for fn in ('push-test.js','push-schedule-test.js'):
 s=(p/fn).read_text()
 start=s.index('saveSubscription({')
 end=s.index('});',start)+2
 orig=s[start:end]
 new="saveSubscription({subscription:b.subscription,lastSeenAt:new Date().toISOString()," + ("pendingLockedTest:true,pendingLockedTestAt:new Date().toISOString()," if fn=='push-schedule-test.js' else "") + "...(b.context!==undefined?{context:b.context}:{}),...(b.mirror!==undefined?{mirror:b.mirror}:{}),...(b.prefs!==undefined?{prefs:b.prefs}:{}),...(b.language!==undefined?{language:['en','es'].includes(String(b.language).toLowerCase())?String(b.language).toLowerCase():'pt-BR'}:{})})"
 assert 'prefs:b.prefs||{}' in orig,orig
 s=s[:start]+new+s[end:]
 (p/fn).write_text(s)
# R2: no abnormal closure when VAPID init is down
change('push-server-lib.js',"async function sendPush(req,record,payload){\n  const vapid=await ensureVapid();webpush.setVapidDetails(vapidSubject(req),vapid.publicKey,vapid.privateKey);\n  try{", "async function sendPush(req,record,payload){\n  try{\n    const vapid=await ensureVapid();webpush.setVapidDetails(vapidSubject(req),vapid.publicKey,vapid.privateKey);")
# R3: pending test counts against cap; reset only if sent, invalid test recovery no user threshold breach
change('push-cron.js',"  for(const rec of subs){\n   if(rec.pendingLockedTest)","  for(const rec of subs){\n   const prof=pushProfile(rec);let userSent=0;\n   if(rec.pendingLockedTest)")
change('push-cron.js',"if(r.ok){sent++;await saveSubscription({...rec,pendingLockedTest:false", "if(r.ok){sent++;userSent++;await saveSubscription({...rec,pendingLockedTest:false")
change('push-cron.js',"   const prof=pushProfile(rec),watch=userWatch(rec,assets),cand=assets.filter(x=>watch.has(clean(x.symbol))&&Number(x.liquidityPct)>=70).sort((a,b)=>b.volume-a.volume);let userSent=0;", "   const watch=userWatch(rec,assets),cand=assets.filter(x=>watch.has(clean(x.symbol))&&Number(x.liquidityPct)>=70).sort((a,b)=>b.volume-a.volume);")
# R4: localize arbitrary context reason safely by using complete per-locale template, no mixed Portuguese
change('push-server-lib.js',"function localizePush(payload,lang){\n if(!['en','es'].includes(lang))return {...payload,lang:'pt-BR'};", "function localizePush(payload,lang){\n if(!['en','es'].includes(lang))return {...payload,lang:'pt-BR'};\n if(payload.kind==='v18-signal'){\n   const match=String(payload.body||'').match(/(?:^|•)\\s*(\\d{1,3})\\/100/);\n   const score=match?Math.min(100,Math.max(0,Number(match[1]))):null;\n   return {...payload,lang,title:`🧠 Radar V18: ${String(payload.symbol||'').replace(/[^A-Z0-9]/gi,'').slice(0,16)}`,body:lang==='en'?`Confirmed technical signal${score===null?'':` • score ${score}/100`} • Review risk before making decisions`:`Señal técnica confirmada${score===null?'':` • puntuación ${score}/100`} • Evalúa el riesgo antes de decidir`};\n }")
# R5: static caching avoid cache growth for externally fetched resources, assure offline cache from own origin only
change('sw.js',"  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&url.origin===self.location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));", "  if(url.origin!==self.location.origin)return;\n  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));")
# version
for fn in ['index.html','i18n.js','sw.js','package.json']:
 f=p/fn;s=f.read_text().replace('19.5.9','19.6.0').replace('v19.5.9','v19.6.0');f.write_text(s)
(p/'LEIA-ME-V19.6.0-MAIS-5-RODADAS.txt').write_text('''CRIPTO RADAR V19.6.0 — 5 RODADAS ADICIONAIS DE REVISÃO\n\nBase: V19.5.9. Cinco rodadas independentes:\n1. Testes Push não apagam preferências, carteira nem idioma se os campos estiverem ausentes.\n2. Falhas ao iniciar VAPID são tratadas pelo emissor, sem exceções não capturadas.\n3. Notificação de teste agendado conta no limite de notificações por varredura.\n4. Sinais V18 enviados em inglês/espanhol não exibem justificativas portuguesas misturadas; exibem síntese técnica localizada.\n5. Cache offline não intercepta requisições a domínios externos; versão/cache atualizados.\n\nO relatório JSON inclui verificações estáticas e dinâmicas das cinco rodadas.\nPENDENTE: testes em Android real, Vercel, Play Billing, disponibilidade do provedor Push e qualidade de tradução de notícias externas. Não há garantia de que não existam falhas em produção.\nINSTALAÇÃO: extrair arquivos diretamente na raiz do repositório; não copiar esta pasta como subpasta.\n''',encoding='utf8')
print('5 alterações aplicadas')
