const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const source=html.split('/* ===== Cripto Radar Adaptive Navigation ===== */')[1].split('</script>')[0];
function classes(){const s=new Set();return {add:(...v)=>v.forEach(x=>s.add(x)),remove:(...v)=>v.forEach(x=>s.delete(x)),toggle:(x,on)=>on?s.add(x):s.delete(x),contains:x=>s.has(x),[Symbol.iterator]:()=>s.values()}}
const elements=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],{classList:classes(),addEventListener(){},textContent:''}]));
const storage=new Map([['crRadarExperienceMode','amateur'],['ledger','preserve']]);
const document={body:{classList:classes()},documentElement:{lang:'pt'},getElementById:id=>elements.get(id),querySelectorAll:()=>[],addEventListener(){}};
const window={addEventListener(){},scrollTo(){}};
vm.runInNewContext(source,{document,window,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:f=>f()});
function visible(id){return elements.get(id).classList.contains('route-visible')}
window.crRadarOpenView('wallet');assert(visible('radarBinanceCard'));assert(!visible('simulationWorkspace'));assert(!visible('copyMirrorCard'));assert(!visible('healthWorkspace'));
window.crRadarOpenView('simulations');assert(visible('simulationWorkspace'));assert(visible('copyMirrorCard'));assert(!visible('radarBinanceCard'));assert(!visible('healthWorkspace'));
window.crRadarOpenView('health');assert(visible('healthWorkspace'));assert(!visible('simulationWorkspace'));
window.crRadarOpenView('paper');assert(visible('simulationWorkspace'));assert.equal(storage.get('crRadarRoute'),'simulations');
window.crRadarOpenView('unknown');assert(visible('homeDashboardCard'));assert.equal(storage.get('ledger'),'preserve');
assert(html.includes('id="simulationWorkspace" class="app-view-section route-hidden"'));
assert(fs.readFileSync('radar-trader-sim.js','utf8').includes("const parent=$('simulationWorkspace')"));
assert(fs.readFileSync('radar-health.js','utf8').includes("if(host)host.appendChild(el)"));
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);
console.log('PASS navegação: carteira, simulações, vistoria, atalho antigo, rota inválida, dados preservados, hosts dinâmicos e sintaxe inline');
