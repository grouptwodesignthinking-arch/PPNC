const assert=require('node:assert/strict'),K=require('./dist/kitchen.js'),E=require('./dist/engine.js');let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
const ticket=(id,age=0,status='queued')=>({id,age,status,lines:[{id:'riceMain',qty:2}]});
test('every menu fixture has explicit planning recipe',()=>[...E.meals,...E.posCatalog].forEach(x=>assert(K.recipes[x.id])));
test('quantity-based ingredient requirements',()=>assert.deepEqual(K.needs([{id:'riceMain',qty:2},{id:'drink',qty:1}]),{chicken:2,rice:2,drink:2}));
test('unknown recipe never starts speculatively',()=>assert.equal(K.consume({status:'queued',lines:[{id:'missing',qty:1}]},K.stockDefaults()),null));
test('starting consumes once and preserves input stock',()=>{const t=ticket('x'),stock=K.stockDefaults(),next=K.consume(t,stock);assert.equal(next.chicken,6);assert.equal(stock.chicken,8);assert.equal(K.consume({...t,status:'preparing'},next),null);assert.equal(K.consume({...t,status:'ready'},next),null);});
test('insufficient stock rejects start without partial deduction',()=>{const stock={...K.stockDefaults(),rice:1};assert.equal(K.consume(ticket('x'),stock),null);assert.equal(stock.chicken,8);});
test('priority groups exclusive; stock gate overrides age',()=>{const a=ticket('old',90),b=ticket('young',45),c={...ticket('blocked',120),lines:[{id:'bucket2',qty:3}]};const p=K.plan([a,b,c],K.stockDefaults());assert.deepEqual(p.groups.urgent.map(x=>x.id),['old']);assert.deepEqual(p.groups.batch.map(x=>x.id),['young']);assert.deepEqual(p.groups.blocked.map(x=>x.id),['blocked']);});
test('forecast arithmetic and floor at zero',()=>{const p=K.plan([ticket('x')],K.stockDefaults(),1.2,1);assert(Math.abs(p.points[2].base-3)<1e-10);assert.equal(K.plan([ticket('x')],K.stockDefaults(),.6,1.6).points[2].base,0);p.points.forEach(x=>assert(x.low<=x.base&&x.high>=x.base));});
test('stale signal suppresses every forecast, retains queue shortage',()=>{const p=K.plan([ticket('x')],{...K.stockDefaults(),chicken:0},1.2,1,false);assert.equal(p.points.length,0);assert.equal(p.groups.blocked.length,1);assert(p.inventory.every(i=>i.demand10===null&&i.cover===null&&i.topUp===null));});
test('current queue reserved separately from future arrival demand',()=>{const p=K.plan([ticket('q'),ticket('p',30,'preparing')],K.stockDefaults(),1,1);const c=p.inventory.find(x=>x.id==='chicken');assert.equal(c.reserved,2);assert.equal(c.free,6);assert.equal(c.demand10,20);assert.equal(c.topUp,14);});
test('empty queue has no ingredient mix estimate',()=>{const p=K.plan([],K.stockDefaults());assert(p.inventory.every(i=>i.demand10===null));assert.equal(p.points[0].base,0);});
test('ready tickets do not reserve or forecast consumption',()=>{const p=K.plan([ticket('done',100,'ready')],K.stockDefaults());assert.equal(p.open.length,0);assert(p.inventory.every(i=>i.reserved===0));});
let matrix=0;for(const arrival of [.6,1.2,2.4])for(const pace of [.8,1,1.6])for(const fresh of [true,false])for(const chicken of [0,1,2,8,30]){const p=K.plan([ticket('one',70),ticket('two',20)],{...K.stockDefaults(),chicken},arrival,pace,fresh);assert.equal(p.groups.urgent.length+p.groups.batch.length+p.groups.blocked.length,2);for(const row of p.inventory){assert(row.onHand>=0);assert(row.topUp===null||row.topUp>=0);}for(const point of p.points)assert(point.base>=0&&point.low<=point.base&&point.high>=point.base);matrix++;}
console.log(`${count} kitchen planning tests and ${matrix} combinations passed. Synthetic engineering QA only.`);
test('workload counts actual recipe quantities; Ready excluded',()=>{const rows=K.workload([ticket('q'),ticket('p',0,'preparing'),ticket('r',0,'ready')]);assert.equal(rows.find(x=>x.id==='hot').total,4);assert.equal(rows.find(x=>x.id==='rice').queued,2);});
test('POS ranking responds to shared queue, preserves compatibility',()=>{const s={...E.defaults(),channel:'pos'},base=E.decide(s),stock=Object.fromEntries(K.ingredients.map(i=>[i.id,100]));const a=K.posAdvice(base,[{...ticket('d'),lines:[{id:'drink',qty:8}]}],stock,s.posLines);assert.notEqual(a.cards[0].id,'drink');const b=K.posAdvice(base,[{...ticket('c'),lines:[{id:'salad',qty:8},{id:'potato',qty:8},{id:'tart',qty:8},{id:'fries',qty:8},{id:'side',qty:8},{id:'cheese',qty:8}]}],stock,s.posLines);assert.equal(b.cards[0].id,'drink');assert(a.cards.every(x=>!s.basket.includes(x.category)));});
test('POS reserves queued recipes and current basket before extra',()=>{const s={...E.defaults(),channel:'pos'},d=K.posAdvice(E.decide(s),[ticket('q')],{...K.stockDefaults(),chicken:3},s.posLines);assert.equal(d.cards.length,0);});
test('fixed B order preserved; stale never ranks by workload',()=>{const s={...E.defaults(),channel:'pos',branch:'B'},b=E.decide(s),d=K.posAdvice(b,[],K.stockDefaults(),s.posLines);assert.equal(d.cards[0].id,b.cards[0].id);assert.equal(d.queueAware,false);assert.deepEqual(K.posAdvice(b,[],{},s.posLines,false).cards,b.cards);});
test('batch includes oldest feasible ticket, aggregate stock limits group',()=>{const q=[ticket('old',100),ticket('mid',70),ticket('new',10)];const stock={...K.stockDefaults(),chicken:4,rice:4};const b=K.batchSuggestions(q,stock);assert(b.length);assert.deepEqual(b[0].ids,['old','mid']);assert.equal(b[0].needs.chicken,4);assert.equal(K.batchSuggestions(q,stock,false).length,0);});
test('batch start is atomic and cannot double deduct',()=>{const q=[ticket('old',100),ticket('new',10)],stock=K.stockDefaults(),b=K.batchSuggestions(q,stock)[0];const next=K.startBatch(q,stock,b);assert.equal(next.stock.chicken,4);assert.equal(stock.chicken,8);assert(q.every(t=>t.status==='queued'));assert.equal(K.startBatch(q,{...stock,rice:3},b),null);assert.equal(K.startBatch(q,stock,b,false),null);assert.equal(K.startBatch(q.map(t=>({...t,status:'preparing'})),next.stock,b),null);});
test('different or blocked components never form false batch',()=>{const q=[ticket('old',100),{...ticket('new'),lines:[{id:'tart',qty:1}]}];assert.equal(K.batchSuggestions(q,K.stockDefaults()).length,0);assert.equal(K.batchSuggestions([ticket('a'),ticket('b')],{...K.stockDefaults(),chicken:1}).length,0);});
console.log(`${count} total kitchen and connected POS checks passed.`);

// v1.12 ready-item ranking remains behind validity, stock and High load gates.
{
 const E=require('./dist/engine.js');
 const state={...E.defaults(),channel:'pos'},base=E.decide(state),stock=Object.fromEntries(K.ingredients.map(i=>[i.id,100]));
 const ready=K.posAdvice(base,[],stock,state.posLines,true,{tart:4});
 assert.equal(ready.cards[0].id,'tart');assert.equal(ready.cards[0].readyCount,4);
 const invalid=E.decide({...state,unavailable:['tart']});assert(!K.posAdvice(invalid,[],stock,state.posLines,true,{tart:4}).eligible.some(x=>x.id==='tart'));
 const high=E.decide({...state,age:135,highSeconds:120});assert.equal(K.posAdvice(high,[],stock,state.posLines,true,{tart:4}).cards.length,0);
 const stale=E.decide({...state,freshness:61});assert.equal(K.posAdvice(stale,[],stock,state.posLines,false,{tart:4}).cards[0].id,stale.cards[0].id);
 const fixed=E.decide({...state,branch:'B'});assert.equal(K.posAdvice(fixed,[],stock,state.posLines,true,{tart:4}).cards[0].id,fixed.cards[0].id);
 console.log('PASS ready-first ranking, unavailable item exclusion, High suppression, stale and fixed-order fallback');
}

// v1.13 variant recipe mapping and ready-item holding assumption.
{
 assert.deepEqual(K.needs([{id:'classic',qty:1,variant:{chicken:'Spicy',drink:'7UP'}}]),{chicken:2,rice:2,drink:2,spicy:2});
 assert.deepEqual(K.needs([{id:'classic',qty:2,variant:{chicken:'Original'}}]),{chicken:4,rice:4,drink:4});
 assert.equal(K.needs([{id:'light',qty:1,variant:{chicken:'Spicy'}}]).spicy,2,'only meals with chicken in the recipe use marinade');
 const t={id:'s',status:'queued',lines:[{id:'family',qty:1,variant:{chicken:'Spicy'}}]},stock={...K.stockDefaults(),chicken:20,spicy:5};
 assert.equal(K.consume(t,stock),null,'Spicy start blocked when marinade is short (6 needed, 5 on hand)');
 const ok=K.consume({...t,lines:[{id:'solo',qty:1,variant:{chicken:'Spicy'}}]},stock);assert.equal(ok.spicy,4);assert.equal(ok.chicken,19);
 assert.equal(K.consume({...t,status:'preparing'},stock),null);
 console.log('PASS variant recipe mapping deducts marinade once and blocks short Spicy starts');
 assert.deepEqual(K.rankableReady({potato:3,tart:2},{potato:K.HOLD_LIMIT_S,tart:K.HOLD_LIMIT_S+1}),{potato:3,tart:0});
 assert.deepEqual(K.rankableReady({potato:3},{}),{potato:3});
 const s={...E.defaults(),channel:'pos'},stock2=Object.fromEntries(K.ingredients.map(i=>[i.id,100]));
 const stale=K.posAdvice(E.decide(s),[],stock2,s.posLines,true,K.rankableReady({tart:4},{tart:K.HOLD_LIMIT_S+30}));
 assert.equal(stale.cards[0].readyCount,0);
 console.log('PASS ready portions past the hold assumption drop out of ready-first ranking');
}
