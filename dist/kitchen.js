/* Illustrative queue and ingredient planning. Deterministic what-if arithmetic, not learned AI. */
(function(root){
const ingredients=[['chicken','Chicken','pieces',8,'chicken-main.jpg'],['rice','Cooked rice','portions',8,'rice-main.jpg'],['bun','Burger buns','buns',2,'burger-main.jpg'],['fries','Fries','portions',8,'fries.jpg'],['salad','Salad','portions',5,'salad.jpg'],['drink','Drinks','cups',16,'pepsi.jpg'],['cheese','Cheesy bites','portions',6,'cheese.jpg'],['potato','Mashed potato','portions',6,'potato.jpg'],['tart','Egg tarts','pieces',8,'tart.jpg']].map(([id,name,unit,start,image])=>({id,name,unit,start,image}));
const recipes={classic:{chicken:2,rice:2,drink:2},ready:{chicken:2,rice:2,drink:2},light:{chicken:2,bun:2,drink:2},promo:{chicken:2,rice:2,drink:2},solo:{chicken:1,rice:1,drink:1},group:{chicken:4,fries:2,drink:4},single:{chicken:1},pasta2:{chicken:2,rice:2,drink:2},bucket2:{chicken:4,drink:2},shrimp2:{chicken:2,bun:2,drink:2},rice1:{chicken:1,rice:1,drink:1},burger1:{chicken:1,bun:1,drink:1},pasta1:{chicken:1,rice:1,drink:1},family:{chicken:6,drink:4},familyrice:{chicken:4,rice:4,drink:4},riceMain:{chicken:1,rice:1},burgerMain:{chicken:1,bun:1},chickenMain:{chicken:1},side:{chicken:1},drink:{drink:2},salad:{salad:2},dessert:{tart:2},fries:{fries:1},cheese:{cheese:1},potato:{potato:1},tart:{tart:1}};
// Recipe fixtures describe planning units, not verified recipes. Distinct ingredients avoid false substitutions.
Object.assign(recipes,{promo:{chicken:2,pasta:2,drink:2},pasta2:{chicken:2,pasta:2,drink:2},pasta1:{chicken:1,pasta:1,drink:1},shrimp2:{shrimp:2,bun:2,drink:2}});
ingredients.push({id:'pasta',name:'Pasta',unit:'portions',start:6,image:'pasta-share.jpg'},{id:'shrimp',name:'Shrimp patties',unit:'patties',start:4,image:'shrimp-combo.jpg'});
// v1.13 variant mapping: Spicy uses the same chicken pieces plus one marinade portion per piece. Drink flavors share cups. Simulated fixture.
ingredients.push({id:'spicy',name:'Spicy marinade',unit:'portions',start:6,image:'chicken-main.jpg'});
const stockDefaults=()=>Object.fromEntries(ingredients.map(i=>[i.id,i.start]));
function needs(lines){const out={};for(const l of lines||[]){if(!recipes[l.id])return null;for(const [id,q]of Object.entries(recipes[l.id]))out[id]=(out[id]||0)+q*l.qty;if(l.variant?.chicken==='Spicy'&&recipes[l.id].chicken)out.spicy=(out.spicy||0)+recipes[l.id].chicken*l.qty;}return out;}
function shortage(ticket,stock){const req=needs(ticket.lines);return req?Object.entries(req).filter(([k,q])=>q>(stock[k]||0)).map(([id,q])=>({id,qty:q-(stock[id]||0)})):[{id:'unknown',qty:1}];}
function station(t){const n=needs(t.lines);return n?.bun?'Burger station':n?.rice||n?.pasta?'Rice & pasta':'Chicken & sides';}
function consume(ticket,stock){if(ticket.status!=='queued'||shortage(ticket,stock).length)return null;const next={...stock};for(const [id,q]of Object.entries(needs(ticket.lines)))next[id]-=q;return next;}
function plan(tickets,stock,arrival=1.2,completion=1,fresh=true){const open=tickets.filter(t=>t.status!=='ready'),queued=open.filter(t=>t.status==='queued');const reserved={},mix={};for(const t of queued)for(const [id,q]of Object.entries(needs(t.lines)||{}))reserved[id]=(reserved[id]||0)+q;for(const t of open)for(const [id,q]of Object.entries(needs(t.lines)||{}))mix[id]=(mix[id]||0)+q;
const inventory=ingredients.map(i=>{const demandRate=open.length?(mix[i.id]||0)/open.length*arrival:0,held=reserved[i.id]||0,free=(stock[i.id]||0)-held,demand10=fresh&&open.length?Math.ceil(demandRate*10-1e-9):null;return {...i,onHand:stock[i.id]||0,reserved:held,free,demand10,topUp:demand10===null?null:Math.max(0,demand10-free),cover:fresh&&demandRate>0?Math.max(0,Math.floor(free/demandRate)):null};});
const groups={urgent:[],batch:[],blocked:[]};queued.forEach(t=>groups[shortage(t,stock).length?'blocked':t.age>=60?'urgent':'batch'].push(t));for(const list of Object.values(groups))list.sort((a,b)=>(b.teamPriority||0)-(a.teamPriority||0)||b.age-a.age);
const points=fresh?[0,5,10,15].map(min=>({min,base:Math.max(0,open.length+(arrival-completion)*min),low:Math.max(0,open.length+(arrival*.75-completion*1.2)*min),high:Math.max(0,open.length+(arrival*1.25-completion*.8)*min)})):[];
return {open,queued,groups,inventory,points,arrival,completion,fresh};}
// Synthetic preparation units are counts, never utilization or processing times.
const stations=[['hot','Chicken fryer',['chicken','shrimp']],['burger','Burger assembly',['bun']],['rice','Rice & pasta',['rice','pasta']],['sides','Sides fryer',['fries','cheese']],['cold','Cold / ready sides',['salad','potato']],['drinks','Drinks',['drink']],['bakery','Bakery',['tart']]].map(([id,name,keys])=>({id,name,keys}));
function workload(tickets){return stations.map(st=>{let queued=0,preparing=0;for(const t of tickets){const n=needs(t.lines)||{},q=st.keys.reduce((a,k)=>a+(n[k]||0),0);if(t.status==='queued')queued+=q;if(t.status==='preparing')preparing+=q;}return {...st,queued,preparing,total:queued+preparing};});}
function posAdvice(base,tickets,stock,basket,fresh=true,readyExtras={}){
 const loads=workload(tickets),reserved=needs(tickets.filter(t=>t.status==='queued').flatMap(t=>t.lines)),basketNeeds=needs(basket);
 if(base.band==='High')return {...base,loads,queueAware:false,stockRejected:[],eligible:[],cards:[]};
 if(!fresh)return {...base,loads,queueAware:false,stockRejected:[]};
 const stockRejected=[];const eligible=base.eligible.map(item=>{const req=needs([{id:item.id,qty:1}]),short=!req||!reserved||!basketNeeds||Object.entries({...basketNeeds,...req}).some(([id])=>(stock[id]||0)-(reserved?.[id]||0)-(basketNeeds?.[id]||0)-(req?.[id]||0)<0);if(short){stockRejected.push(item.id);return null;}const touched=loads.filter(st=>st.keys.some(id=>req[id]));const pressure=Math.max(0,...touched.map(st=>st.total));const readyCount=Math.max(0,(readyExtras[item.id]||0)-basket.filter(l=>l.id===item.id).reduce((n,l)=>n+l.qty,0)),prepMatch=tickets.filter(t=>t.status==='preparing'&&t.lines.some(l=>Object.keys(needs([l])||{}).some(id=>req[id]&&id!=='drink'))).length;return {...item,pressure,readyCount,prepMatch,stationNames:touched.map(st=>st.name),workUnits:Object.values(req).reduce((a,q)=>a+q,0)};}).filter(Boolean);const it=base.intent||{},pf=x=>(it.orderType==='sharing'||it.party>=4)?(x.share?0:1):it.party===1?(x.share?1:0):0;if(!base.fixed)eligible.sort((a,b)=>pf(a)-pf(b)||(it.priority==='value'?a.price-b.price:0)||Number(b.readyCount>0)-Number(a.readyCount>0)||(it.priority==='fast'?a.service-b.service:0)||a.pressure-b.pressure||b.prepMatch-a.prepMatch||a.service-b.service||a.price-b.price);
 return {...base,loads,queueAware:!base.fixed,stockRejected,eligible,cards:eligible.slice(0,1).map(x=>({...x,label:'Kitchen-aware suggestion'}))};
}
function batchSuggestions(tickets,stock,fresh=true){
 if(!fresh)return [];const queued=tickets.filter(t=>t.status==='queued').sort((a,b)=>(b.teamPriority||0)-(a.teamPriority||0)||b.age-a.age);
 const anchor=queued.find(t=>!shortage(t,stock).length);if(!anchor)return [];
 const plans=[];for(const key of ['chicken','shrimp','rice','pasta','fries','cheese','tart']){if(!(needs(anchor.lines)||{})[key])continue;const group=[anchor];let remaining=consume(anchor,stock);for(const t of queued){if(t===anchor||group.length>=3||!(needs(t.lines)||{})[key])continue;const next=consume(t,remaining);if(next){group.push(t);remaining=next;}}if(group.length<2)continue;const req=needs(group.flatMap(t=>t.lines));plans.push({key,ids:group.map(t=>t.id),units:req[key],needs:req,oldest:anchor.age});}
 return plans.sort((a,b)=>b.ids.length-a.ids.length||b.units-a.units);
}
function startBatch(tickets,stock,proposal,fresh=true){
 if(!fresh||!proposal)return null;const valid=batchSuggestions(tickets,stock,fresh).find(b=>b.key===proposal.key&&b.ids.join('|')===proposal.ids.join('|'));if(!valid)return null;
 let next={...stock};for(const id of valid.ids){next=consume(tickets.find(t=>t.id===id),next);if(!next)return null;}return {stock:next,ids:valid.ids,needs:valid.needs};
}
// Ready portions past the documented holding assumption need a staff re-check before ready-first ranking. [Assumption], not a food-safety rule.
const HOLD_LIMIT_S=600;
function rankableReady(ready,ages,limit=HOLD_LIMIT_S){return Object.fromEntries(Object.entries(ready||{}).map(([id,n])=>[id,(ages?.[id]||0)<=limit?n:0]));}
// v1.14 live demo feed. Deterministic synthetic traffic: seeded arrivals on a 30-minute wave, a simulated crew that
// starts and finishes background tickets only, scheduled deliveries. Demo clock only; not a capacity or wait model.
const liveMenu=[['riceMain',2,'2 × Chicken Rice'],['classic',1,'Crispy Chicken Combo'],['light',1,'Burger Combo'],['ready',1,'Chicken Rice Combo'],['solo',1,'Solo Combo'],['rice1',1,'Chicken Rice Solo'],['burger1',1,'Burger Solo'],['bucket2',1,'Crispy Duo Bucket'],['pasta1',1,'Pasta Solo'],['chickenMain',3,'3 × Crispy Chicken']];
function rng(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function median(xs){const a=[...xs].sort((x,y)=>x-y),n=a.length;return n?Math.round(n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2):0;}
function liveWorld(o={}){return {clock:0,seq:200,seed:7,arrivalAcc:0,arrivalRate:1.2,crewSlots:3,prepSeconds:70,deliveryEvery:120,deliveryFloor:12,deliverOnStart:true,history:[],...o};}
function liveStep(world,tickets,stock,dt=15){
 const w={...world},events=[];let list=tickets.map(t=>({...t})),inv={...stock};const r=rng(w.seed+w.clock);
 w.clock+=dt;
 for(const t of list)if(t.status!=='ready'){t.age+=dt;if(t.status==='preparing')t.prep=(t.prep??Math.max(0,t.age-dt))+dt;}
 const rate=w.arrivalRate*(1+.6*Math.sin(2*Math.PI*w.clock/1800));w.arrivalAcc+=rate*dt/60;let arrived=0;
 while(w.arrivalAcc>=1){w.arrivalAcc-=1;const [id,qty,label]=liveMenu[Math.floor(r()*liveMenu.length)];const ch=['Counter','Kiosk','Delivery'][Math.floor(r()*3)];list.push({id:'D'+(++w.seq),age:Math.floor(r()*dt),status:'queued',channel:ch,label,lines:[{id,qty}],fixture:true,live:true});arrived++;events.push({type:'arrival',id:'D'+w.seq});}
 for(const t of list)if(t.fixture&&t.status==='preparing'&&(t.prep||0)>=w.prepSeconds){t.status='ready';t.readyAt=w.clock;events.push({type:'ready',id:t.id});}
 let busy=list.filter(t=>t.fixture&&t.status==='preparing').length;const queuedNow=list.filter(t=>t.fixture&&t.status==='queued').length,slots=w.crewSlots+(queuedNow>6?2:queuedNow>3?1:0);
 for(const t of [...list].filter(t=>t.fixture&&t.status==='queued').sort((a,b)=>(b.teamPriority||0)-(a.teamPriority||0)||b.age-a.age)){if(busy>=slots)break;const after=consume(t,inv);if(!after)continue;inv=after;t.status='preparing';t.prep=0;busy++;events.push({type:'start',id:t.id});}
 // The first live tick also brings a delivery so the demo opens with workable stock.
 if((w.deliverOnStart&&world.clock===0)||Math.floor(w.clock/w.deliveryEvery)>Math.floor((w.clock-dt)/w.deliveryEvery)){const got={};for(const i of ingredients){const target=Math.max(i.start,w.deliveryFloor);if((inv[i.id]||0)<target){got[i.id]=target-(inv[i.id]||0);inv[i.id]=target;}}if(Object.keys(got).length)events.push({type:'delivery',got});}
 const ready=list.filter(t=>t.status==='ready').sort((a,b)=>(b.readyAt||0)-(a.readyAt||0));const drop=new Set(ready.slice(8).filter(t=>t.fixture).map(t=>t.id));list=list.filter(t=>!drop.has(t.id));
 const open=list.filter(t=>t.status!=='ready');
 w.history=[...w.history,{clock:w.clock,open:open.length,age:median(open.map(t=>t.age)),arrived}].slice(-240);
 return {world:w,tickets:list,stock:inv,events};
}
// Synthetic 60-minute lead-in so the trend chart has history at start. Uses its own scratch tickets and stock.
function seedHistory(world,minutes=60){let w={...world,clock:-minutes*60,history:[]},tk=[],st=stockDefaults();for(let i=0;i<minutes*4;i++){const r=liveStep(w,tk,st,15);w=r.world;tk=r.tickets;st=r.stock;}return {...world,history:w.history};}
const api={liveWorld,liveStep,seedHistory,HOLD_LIMIT_S,rankableReady,ingredients,recipes,stockDefaults,needs,shortage,station,consume,plan,stations,workload,posAdvice,batchSuggestions,startBatch};root.KitchenPlanner=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
