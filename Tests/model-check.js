const fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);
for(const file of ['characters.js','levels.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const crew=ctx.window.GAME_CREW, mission=ctx.window.GAME_MISSIONS[0];
function node(id){return mission.nodes.find(n=>n.id===id)}
function duration(c,n,p){let d=n.duration||15;if(n.requires===c.bonus)d=Math.max(12,Math.round(d*.62));if(p)d+=Math.max(5,Math.round(Math.hypot(n.x-p.x,n.y-p.y)/14));return d}
function actions(c,route){let time=0;return route.map((id,i)=>{const n=node(id),p=i?node(route[i-1]):null,start=time,d=i?duration(c,n,p):0;time+=d;return{node:n,start,end:time,duration:d}})}
const actors=Object.entries(mission.recommended).filter(([id])=>['emil','bruno','rudi'].includes(id)).map(([id,route])=>({id,route,a:actions(crew.find(c=>c.id===id),route)}));
if(!actors.every(x=>x.route[0]==='car'&&x.route.at(-1)==='car'))throw new Error('Referenzroute beginnt/endet nicht am Fluchtwagen');
const events=actors.flatMap(x=>x.a.filter(a=>a.node.objective).map(a=>({id:x.id,node:a.node.id,time:a.end}))).sort((a,b)=>a.time-b.time);
if(events.length!==2)throw new Error(`Erwartet 2 Zielereignisse, gefunden ${events.length}`);
const max=Math.max(...actors.map(x=>x.a.at(-1).end));
if(max<=0||max>600)throw new Error(`Unplausible Dauer: ${max}`);
console.log(JSON.stringify({events,maxDuration:max,initialSharedPosition:actors.every(x=>x.route[0]==='car')}));
