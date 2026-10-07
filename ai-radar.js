(function(){
const esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
function radarContext(){
 try{
  const raw=(typeof printWallet!=='undefined'&&Array.isArray(printWallet))?printWallet:[];
  const values=raw.map(w=>{
   const s=String(w.symbol||'').toUpperCase(),p=(typeof walletPrices!=='undefined'&&walletPrices[s])||0;
   return {s,w,p:Number(p)||0,value:(Number(p)||0)*(Number(w.qty)||0)};
  });
  const totalBRL=values.reduce((a,x)=>a+x.value,0);
  const wallet=values.map(({s,w,p,value})=>{
   const m=(typeof walletMarketData!=='undefined'&&walletMarketData[s])||{};
   let direction=null,buy=null,brain=null;
   try{direction=typeof walletDirection==='function'?walletDirection(s):null}catch(e){}
   try{buy=typeof walletBuySignal==='function'?walletBuySignal(s):null}catch(e){}
   try{brain=typeof portfolioAIDecision==='function'?portfolioAIDecision(s):null}catch(e){}
   return {
    symbol:s,qty:Number(w.qty)||0,priceBRL:p,valueBRL:value,positionPct:totalBRL?100*value/totalBRL:0,
    change24h:Number(m.change24h)||0,volume24h:Number(m.volume)||0,liquidityPct:Number(m.liquidityPct)||0,
    direction:direction?.action||'',reason:direction?.why||'',buySignal:buy?.label||'',buyState:buy?.state||'',
    buyScore:Number(buy?.score)||0,aiAction:brain?.action||direction?.action||'',aiReason:brain?.why||direction?.why||'',
    aiConfidence:Number(brain?.confidence)||Number(buy?.score)||0,canAdd:!!brain?.canAdd,canReduce:!!brain?.canReduce,
    dataFresh:brain?.dataFresh!==false
   };
  });
  const opportunities=(typeof latestOpportunities!=='undefined'?latestOpportunities:[]).slice(0,8).map(x=>{
   const s=String(x.symbol||'').toUpperCase();let sig=null;try{sig=typeof walletBuySignal==='function'?walletBuySignal(s):null}catch(e){}
   return {symbol:s,change24h:Number(x.change)||0,volume24h:Number(x.volume)||0,score:Number(x.score)||0,
    signal:sig?.label||'',signalState:sig?.state||'',signalScore:Number(sig?.score)||0,reason:sig?.why||''};
  });
  const portfolio={
   totalBRL,
   confirmedBuys:wallet.filter(x=>x.canAdd).length,
   reductions:wallet.filter(x=>x.canReduce).length,
   waiting:wallet.filter(x=>!x.canAdd&&!x.canReduce).length
  };
  return {wallet,opportunities,portfolio,clientAt:new Date().toISOString()};
 }catch(e){return {wallet:[],opportunities:[],portfolio:{totalBRL:0,confirmedBuys:0,reductions:0,waiting:0},clientAt:new Date().toISOString()}}
}
let asking=false,lastManualAt=0;
async function ask(q='',auto=false){
 if(auto&&(asking||Date.now()-lastManualAt<12000))return;
 if(!auto)lastManualAt=Date.now();
 asking=true;
 const st=document.getElementById('aiStatus'),box=document.getElementById('aiMessages'),inp=document.getElementById('aiQuestion');
 if(st)st.textContent='IA analisando mercado + carteira…';
 try{
  const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);
  let r;
  try{r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,context:radarContext()}),signal:c.signal})}finally{clearTimeout(t)}
  const j=await r.json();if(!r.ok||!j.ok)throw Error(j?.error||'IA indisponível');
  let probs='';
  if(j.probabilities)probs='<div class="ai-top"><span>📈 Alta '+j.probabilities.up+'%</span><span>↔️ Lateral '+j.probabilities.sideways+'%</span><span>📉 Queda '+j.probabilities.down+'%</span><span>Confiança '+j.probabilities.confidence+'/100</span></div>';
  let plan='';
  if(j.portfolioPlan?.items?.length){
   const rows=j.portfolioPlan.items.slice(0,6).map(x=>'<div style="display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid #253955"><span><b>'+esc(x.symbol)+'</b><br><span class="small">'+esc(x.reason||'')+'</span></span><b>'+esc(x.action)+'</b></div>').join('');
   plan='<div class="ai-msg" style="margin-top:8px;border-color:#7c3aed88"><b>🧠 Plano unificado da carteira</b><br><span class="small">'+esc(j.portfolioPlan.summary||'')+'</span>'+rows+(j.portfolioPlan.reserve?'<div style="margin-top:7px;color:#fde68a;font-weight:800">'+esc(j.portfolioPlan.reserve)+'</div>':'')+'</div>';
   window.aiPortfolioPlan=j.portfolioPlan;
  }
  if(box)box.innerHTML='<div class="ai-msg"><b>🤖 IA Radar</b><br>'+esc(j.answer).replace(/\n/g,'<br>')+'</div>'+plan+probs+'<div class="ai-top">'+(j.top||[]).slice(0,5).map((x,i)=>'<span>'+(i+1)+'º '+esc(x.symbol)+' • '+x.score+'/100</span>').join('')+'</div>';
  if(st)st.textContent='● IA ativa • '+new Date(j.at).toLocaleTimeString('pt-BR')+(j.learning?.enabled?' • memória ativa':' • memória permanente não configurada');
  if(inp&&!auto&&q)inp.value='';
  if(!auto&&q&&!/^Analise o mercado e minha carteira agora$/i.test(q))speak(j.answer);
 }catch(e){if(st)st.textContent='IA temporariamente indisponível • nova tentativa automática';}
 finally{asking=false}
}
let voiceAuto=localStorage.getItem('aiRadarVoice')!=='off';
function speak(t){
 if(!('speechSynthesis' in window)||!voiceAuto||!t)return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(String(t).replace(/%/g,' por cento '));u.lang='pt-BR';u.rate=.98;u.pitch=1;
 const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/^pt-BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null;speechSynthesis.speak(u);
}
function addVoiceControls(){
 const inp=document.getElementById('aiQuestion'),askBtn=document.getElementById('aiAsk');
 if(!inp||document.getElementById('aiMic'))return;
 const wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
 const mic=document.createElement('button');mic.id='aiMic';mic.type='button';mic.textContent='🎙️ Falar';
 const audio=document.createElement('button');audio.id='aiVoiceToggle';audio.type='button';audio.textContent=voiceAuto?'🔊 Voz ligada':'🔇 Voz desligada';
 [mic,audio].forEach(x=>x.style.cssText='padding:10px 12px;border-radius:10px;cursor:pointer');wrap.append(mic,audio);(askBtn?.parentElement||inp.parentElement).appendChild(wrap);
 audio.onclick=()=>{voiceAuto=!voiceAuto;localStorage.setItem('aiRadarVoice',voiceAuto?'on':'off');audio.textContent=voiceAuto?'🔊 Voz ligada':'🔇 Voz desligada';if(!voiceAuto&&'speechSynthesis'in window)speechSynthesis.cancel()};
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){mic.disabled=true;mic.textContent='🎙️ Voz não suportada';return}
 const rec=new SR();rec.lang='pt-BR';rec.interimResults=false;rec.maxAlternatives=1;
 rec.onstart=()=>mic.textContent='🔴 Ouvindo…';rec.onend=()=>mic.textContent='🎙️ Falar';rec.onerror=()=>mic.textContent='🎙️ Falar';
 rec.onresult=e=>{const q=e.results?.[0]?.[0]?.transcript||'';if(q){inp.value=q;ask(q,false)}};mic.onclick=()=>{try{if('speechSynthesis'in window)speechSynthesis.cancel();rec.start()}catch(e){}};
}
function init(){
 const b=document.getElementById('aiAsk'),i=document.getElementById('aiQuestion');if(i)i.placeholder='Pergunte sobre mercado, uma moeda ou sua carteira…';
 if(b)b.onclick=()=>ask(i?.value||'',false);if(i)i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ask(i.value,false)}};addVoiceControls();
 ask('Analise o mercado e minha carteira agora',true);setInterval(()=>ask('Atualize a análise do mercado e da minha carteira',true),30000);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
