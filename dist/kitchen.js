/* Illustrative queue and ingredient planning. Deterministic what-if arithmetic, not learned AI. */
(function(root){
const ingredients=[['chicken','Chicken','pieces',8,'chicken-main.jpg'],['rice','Cooked rice','portions',8,'rice-main.jpg'],['bun','Burger buns','buns',2,'burger-main.jpg'],['fries','Fries','portions',8,'fries.jpg'],['salad','Salad','portions',5,'salad.jpg'],['drink','Drinks','cups',16,'pepsi.jpg'],['cheese','Cheesy bites','portions',6,'cheese.jpg'],['potato','Mashed potato','portions',6,'potato.jpg'],['tart','Egg tarts','pieces',8,'tart.jpg']].map(([id,name,unit,start,image])=>({id,name,unit,start,image}));
const recipes={classic:{chicken:2,rice:2,drink:2},ready:{chicken:2,rice:2,drink:2},light:{chicken:2,bun:2,drink:2},promo:{chicken:2,rice:2,drink:2},solo:{chicken:1,rice:1,drink:1},group:{chicken:4,fries:2,drink:4},single:{chicken:1},pasta2:{chicken:2,rice:2,drink:2},bucket2:{chicken:4,drink:2},shrimp2:{chicken:2,bun:2,drink:2},rice1:{chicken:1,rice:1,drink:1},burger1:{chicken:1,bun:1,drink:1},pasta1:{chicken:1,rice:1,drink:1},family:{chicken:6,drink:4},familyrice:{chicken:4,rice:4,drink:4},riceMain:{chicken:1,rice:1},burgerMain:{chicken:1,bun:1},chickenMain:{chicken:1},side:{chicken:1},drink:{drink:2},salad:{salad:2},dessert:{tart:2},fries:{fries:1},cheese:{cheese:1},potato:{potato:1},tart:{tart:1}};
// Recipe fixtures describe planning units, not verified recipes. Distinct ingredients avoid false substitutions.
Object.assign(recipes,{promo:{chicken:2,pasta:2,drink:2},pasta2:{chicken:2,pasta:2,drink:2},pasta1:{chicken:1,pasta:1,drink:1},shrimp2:{shrimp:2,bun:2,drink:2}});
ingredients.push({id:'pasta',name:'Pasta',unit:'portions',start:6,image:'pasta-share.jpg'},{id:'shrimp',name:'Shrimp patties',unit:'patties',start:4,image:'shrimp-combo.jpg'});
const stockDefaults=()=>Object.fromEntries(ingredients.map(i=>[i.id,i.start]));
function needs(lines){const out={};for(const l of lines||[]){if(!recipes[l.id])return null;for(const [id,q]of Object.entries(recipes[l.id]))out[id]=(out[id]||0)+q*l.qty;}return out;}
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
 const stockRejected=[];const eligible=base.eligible.map(item=>{const req=needs([{id:item.id,qty:1}]),short=!req||!reserved||!basketNeeds||Object.entries({...basketNeeds,...req}).some(([id])=>(stock[id]||0)-(reserved?.[id]||0)-(basketNeeds?.[id]||0)-(req?.[id]||0)<0);if(short){stockRejected.push(item.id);return null;}const touched=loads.filter(st=>st.keys.some(id=>req[id]));const pressure=Math.max(0,...touched.map(st=>st.total));const readyCount=Math.max(0,(readyExtras[item.id]||0)-basket.filter(l=>l.id===item.id).reduce((n,l)=>n+l.qty,0)),prepMatch=tickets.filter(t=>t.status==='preparing'&&t.lines.some(l=>Object.keys(needs([l])||{}).some(id=>req[id]&&id!=='drink'))).length;return {...item,pressure,readyCount,prepMatch,stationNames:touched.map(st=>st.name),workUnits:Object.values(req).reduce((a,q)=>a+q,0)};}).filter(Boolean);if(!base.fixed)eligible.sort((a,b)=>Number(b.readyCount>0)-Number(a.readyCount>0)||a.pressure-b.pressure||b.prepMatch-a.prepMatch||a.service-b.service||a.price-b.price);
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
const api={ingredients,recipes,stockDefaults,needs,shortage,station,consume,plan,stations,workload,posAdvice,batchSuggestions,startBatch};root.KitchenPlanner=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
