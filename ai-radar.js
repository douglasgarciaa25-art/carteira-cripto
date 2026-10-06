(function(){
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let chatHistory=[];
function radarContext(){
 try{
  const wallet=(typeof printWallet!=='undefined'?printWallet:[]).map(w=>{
   const s=String(w.symbol||'').toUpperCase(),m=(typeof walletMarketData!=='undefined'&&walletMarketData[s])||{},p=(typeof walletPrices!=='undefined'&&walletPrices[s])||0;
   let direction=null;try{direction=typeof walletDirection==='function'?walletDirection(s):null}catch(e){}
   return {symbol:s,qty:Number(w.qty)||0,priceBRL:Number(p)||0,valueBRL:(Number(p)||0)*(Number(w.qty)||0),change24h:Number(m.change24h)||0,volume24h:Number(m.volume)||0,liquidityPct:Number(m.liquidityPct)||0,direction:direction?.action||'',reason:direction?.why||''};
  });
  const opportunities=(typeof latestOpportunities!=='undefined'?latestOpportunities:[]).slice(0,8).map(x=>({symbol:x.symbol,change24h:Number(x.change)||0,volume24h:Number(x.volume)||0,score:Number(x.score)||0}));
  return {wallet,opportunities,chatHistory:chatHistory.slice(-8),clientAt:new Date().toISOString()};
 }catch(e){return {wallet:[],opportunities:[],clientAt:new Date().toISOString()}}
}
async function ask(q=''){
 const st=document.getElementById('aiStatus'),box=document.getElementById('aiMessages'),inp=document.getElementById('aiQuestion'); if(st)st.textContent='IA analisando mercado + carteira…';
 try{
  const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,context:radarContext()})});
  const j=await r.json();if(!r.ok||!j.ok)throw 0;
  let probs='';
  if(j.probabilities) probs='<div class="ai-top"><span>📈 Alta '+j.probabilities.up+'%</span><span>↔️ Lateral '+j.probabilities.sideways+'%</span><span>📉 Queda '+j.probabilities.down+'%</span><span>Confiança '+j.probabilities.confidence+'/100</span></div>';
  if(q&&!/^Atualize a análise/i.test(q)&&!/^Analise o mercado e minha carteira agora$/i.test(q)){chatHistory.push({role:'user',content:q},{role:'assistant',content:j.answer});chatHistory=chatHistory.slice(-8);}
  box.innerHTML='<div class="ai-msg"><b>🤖 IA Radar'+(j.mode==='hibrido'?' • Híbrida':'')+'</b><br>'+esc(j.answer).replace(/\n/g,'<br>')+'</div>'+probs+'<div class="ai-top">'+(j.top||[]).slice(0,5).map((x,i)=>'<span>'+(i+1)+'º '+esc(x.symbol)+' • '+x.score+'/100</span>').join('')+'</div>';
  st.textContent='● '+(j.mode==='hibrido'?'IA híbrida':'IA Radar')+' ativa • '+new Date(j.at).toLocaleTimeString('pt-BR')+(j.learning?.enabled?' • memória ativa':' • memória permanente não configurada');
  if(inp&&q)inp.value='';
  if(q && !/^Atualize a análise/i.test(q) && !/^Analise o mercado e minha carteira agora$/i.test(q)) speak(j.answer);
 }catch(e){if(st)st.textContent='IA temporariamente indisponível.'}
}
let voiceAuto=localStorage.getItem('aiRadarVoice')!=='off';
function speak(t){
 if(!('speechSynthesis' in window)||!voiceAuto||!t)return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(String(t).replace(/%/g,' por cento '));
 u.lang='pt-BR';u.rate=.98;u.pitch=1;
 const vs=speechSynthesis.getVoices();
 u.voice=vs.find(v=>/^pt-BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null;
 speechSynthesis.speak(u);
}
function addVoiceControls(){
 const inp=document.getElementById('aiQuestion'),askBtn=document.getElementById('aiAsk');
 if(!inp||document.getElementById('aiMic'))return;
 const wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
 const mic=document.createElement('button');mic.id='aiMic';mic.type='button';mic.textContent='🎙️ Falar';
 const audio=document.createElement('button');audio.id='aiVoiceToggle';audio.type='button';audio.textContent=voiceAuto?'🔊 Voz ligada':'🔇 Voz desligada';
 [mic,audio].forEach(x=>x.style.cssText='padding:10px 12px;border-radius:10px;cursor:pointer');
 wrap.append(mic,audio);(askBtn?.parentElement||inp.parentElement).appendChild(wrap);
 audio.onclick=()=>{voiceAuto=!voiceAuto;localStorage.setItem('aiRadarVoice',voiceAuto?'on':'off');audio.textContent=voiceAuto?'🔊 Voz ligada':'🔇 Voz desligada';if(!voiceAuto&&'speechSynthesis'in window)speechSynthesis.cancel()};
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){mic.disabled=true;mic.textContent='🎙️ Voz não suportada';return}
 const rec=new SR();rec.lang='pt-BR';rec.interimResults=false;rec.maxAlternatives=1;
 rec.onstart=()=>mic.textContent='🔴 Ouvindo…';rec.onend=()=>mic.textContent='🎙️ Falar';rec.onerror=()=>mic.textContent='🎙️ Falar';
 rec.onresult=e=>{const q=e.results?.[0]?.[0]?.transcript||'';if(q){inp.value=q;ask(q)}};
 mic.onclick=()=>{try{if('speechSynthesis'in window)speechSynthesis.cancel();rec.start()}catch(e){}};
}
function init(){
 const b=document.getElementById('aiAsk'),i=document.getElementById('aiQuestion');
 if(i)i.placeholder='Pergunte sobre mercado, uma moeda ou sua carteira…';
 if(b)b.onclick=()=>ask(i.value);
 if(i)i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ask(i.value)}};
 addVoiceControls();
 ask('Analise o mercado e minha carteira agora');
 setInterval(()=>ask('Atualize a análise do mercado e da minha carteira'),15000);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();