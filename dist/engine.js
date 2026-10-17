/* ComboFlow deterministic fixture engine. No learned model, network, or customer data. */
(function(root){
const VERIFY='[Verify KFC VN menu]';
const meals=[
{id:'classic',name:'Classic share',desc:'Crispy chicken • rice • side',price:139000,people:2,service:1,priority:['full'],value:1,promo:false},
{id:'ready',name:'Easy share',desc:'Two rice meals • side',price:145000,people:2,service:2,priority:['full','fast'],value:2,promo:false},
{id:'light',name:'Light share',desc:'A light meal for two',price:119000,people:2,service:0,priority:['value','fast'],value:3,promo:false},
{id:'promo',name:'Share special',desc:'Sharing meal • illustrative offer',price:129000,people:2,service:2,priority:['full','value'],value:4,promo:true},
{id:'solo',name:'Solo meal',desc:'A meal for one',price:69000,people:1,service:1,priority:['full','value','fast'],value:1,promo:false},
{id:'group',name:'Together box',desc:'A sharing meal for four',price:269000,people:4,service:2,priority:['full','value'],value:2,promo:false},
{id:'single',name:'Small bite',desc:'Single item • small portion',price:39000,people:1,service:0,priority:['value','fast'],value:1,promo:false}
];
meals.forEach((x,i)=>{x.retail=[159000,160000,129000,169000,79000,299000,45000][i];x.categories=x.id==='group'?['main','drink','side']:['main','drink'];});
meals.find(x=>x.id==='classic').desc='Crispy chicken • rice • drinks';
meals.find(x=>x.id==='ready').desc='Two chicken rice meals • drinks';
const addons=[
{id:'side',name:'Side pair',desc:'Two side portions',category:'side',price:35000,service:2,promo:false},
{id:'drink',name:'Drink pair',desc:'Two drinks',category:'drink',price:30000,service:0,promo:false},
{id:'salad',name:'Salad pair',desc:'Two salad portions',category:'side',price:39000,service:1,promo:false},
{id:'dessert',name:'Sweet pair',desc:'Two dessert portions',category:'dessert',price:42000,service:3,promo:true}
];
// Expanded illustrative choices. These are not verified KFC menu bundles.
meals.push(
{id:'pasta2',name:'Pasta Together',desc:'Chicken & pasta • made for sharing',price:159000,people:2,service:2,priority:['full','value'],promo:false,retail:179000,categories:['main','drink']},
{id:'bucket2',name:'Crispy Duo Bucket',desc:'A chicken sharing selection for two',price:179000,people:2,service:2,priority:['full'],promo:false,retail:199000,categories:['main','drink']},
{id:'shrimp2',name:'Shrimp Burger Duo',desc:'Two shrimp burger meals • drinks',price:149000,people:2,service:1,priority:['value','fast'],promo:false,retail:164000,categories:['main','drink']},
{id:'rice1',name:'Chicken Rice Solo',desc:'Chicken rice • a drink',price:59000,people:1,service:1,priority:['full','value'],promo:false,retail:69000,categories:['main','drink']},
{id:'burger1',name:'Burger Solo',desc:'A burger meal for one',price:79000,people:1,service:0,priority:['fast','value'],promo:false,retail:89000,categories:['main','drink']},
{id:'pasta1',name:'Pasta Solo',desc:'Chicken & pasta • a drink',price:89000,people:1,service:2,priority:['full'],promo:false,retail:99000,categories:['main','drink']},
{id:'family',name:'Family Chicken Feast',desc:'A generous chicken meal for four',price:329000,people:4,service:2,priority:['full'],promo:false,retail:359000,categories:['main','drink']},
{id:'familyrice',name:'Rice Together Box',desc:'Four chicken rice meals • drinks',price:249000,people:4,service:1,priority:['fast','value'],promo:false,retail:269000,categories:['main','drink']});
addons.push(
{id:'fries',name:'Golden Fries',desc:'A crisp side to share',category:'side',price:25000,service:2,promo:false},
{id:'cheese',name:'Cheesy Bites',desc:'A cheesy little extra',category:'side',price:29000,service:2,promo:false},
{id:'potato',name:'Mashed Potato',desc:'A smooth, savory side',category:'side',price:19000,service:1,promo:false},
{id:'tart',name:'Egg Tart',desc:'A sweet finish',category:'dessert',price:20000,service:1,promo:false});
// v1.13 simulated variant fixtures. Availability is scenario-controlled; not verified KFC flavors or drinks.
const variants={chicken:[{id:'Original',desc:'Classic & crispy'},{id:'Spicy',desc:'A little extra kick'}],drink:[{id:'Pepsi',color:'#15589c'},{id:'7UP',color:'#178453'},{id:'Mirinda',color:'#eb8122'}]};
const chickenMeals=['classic','ready','solo','group','bucket2','rice1','family','familyrice','pasta1','pasta2','promo'];
meals.forEach(x=>{x.variantGroups=[...(chickenMeals.includes(x.id)?['chicken']:[]),...(x.categories.includes('drink')?['drink']:[])];});
const variantAvailable=(id,s)=>!(s.unavailableVariants||[]).includes(id);
function defaultVariants(meal,s){const out={};for(const g of meal?.variantGroups||[]){const v=variants[g].find(v=>variantAvailable(v.id,s));if(v)out[g]=v.id;}return out;}
function variantValidity(meal,choice,s){for(const g of meal?.variantGroups||[]){if(!variants[g].some(v=>variantAvailable(v.id,s)))return g==='chicken'?'No chicken flavor available':'No drink option available';const c=choice?.[g];if(choice&&(!c||!variants[g].some(v=>v.id===c)))return 'Choose a '+g+' option';if(c&&!variantAvailable(c,s))return c+' unavailable';}return null;}
// v1.14 POS order intent: portion size of extras and combos orderable at the counter. Simulated fixtures.
addons.forEach(x=>{x.share=['side','drink','salad','dessert'].includes(x.id);});
meals.forEach(x=>{x.category='combo';});
const posMains=[{id:'riceMain',name:'Chicken Rice',desc:'Single rice meal',price:69000,category:'main',service:1,promo:false},{id:'burgerMain',name:'Chicken Burger',desc:'Single burger',price:56000,category:'main',service:1,promo:false},{id:'chickenMain',name:'Crispy Chicken',desc:'One chicken portion',price:37000,category:'main',service:2,promo:false}];
const posCatalog=[...posMains,...addons,...meals];
function quotePOS(s,extra=null){const lines=(s.posLines||[]).map(l=>({item:posCatalog.find(x=>x.id===l.id),qty:l.qty})).filter(l=>l.item&&Number.isInteger(l.qty)&&l.qty>0);const subtotal=lines.reduce((v,l)=>v+l.item.price*l.qty,0)+(extra?extra.price:0);const hasSide=lines.some(l=>l.item.category==='side')||extra?.category==='side';const valid=lines.length>0&&lines.every(l=>!validity(l.item,{...s,channel:'pos'}))&&(!extra||!validity(extra,{...s,channel:'pos'}));const eligible=valid&&subtotal>=150000&&hasSide&&!s.expired;const discount=s.applyPromo&&eligible?10000:0;return {lines,subtotal,discount,total:subtotal-discount,eligible,valid};}
const defaults=()=>({channel:'kiosk',branch:'C_sim',party:2,budgetBand:'low',budget:199999,hardBudget:true,priority:'full',age:45,freshness:5,highSeconds:0,previousHigh:false,recoverySeconds:0,rankingDown:false,expired:false,unavailable:[],stockStale:false,verifiedFixture:false,override:'none',orderType:'meal',unavailableVariants:[],basket:['main'],posLines:[{id:'riceMain',qty:2}],applyPromo:false});
function budgetPreset(party,range){return {budgetBand:range,budget:range==='low'?party*100000-1:range==='mid'?party*200000:null,hardBudget:range!=='high'};}
function band(s){if(s.freshness>60||s.rankingDown||s.override==='safe')return 'Safe fallback';if(s.previousHigh&&s.recoverySeconds<300)return 'High';if(s.age>=120&&s.highSeconds>=120)return 'High';return s.age>=90?'Elevated':'Normal';}
function validity(item,s){if(s.stockStale)return 'Availability not confirmed';if(s.unavailable.includes(item.id))return 'Item unavailable';if(item.promo&&s.expired)return 'Promotion expired';if(item.variantGroups&&variantValidity(item,null,s))return variantValidity(item,null,s);if(s.channel==='kiosk'&&s.hardBudget&&item.price>s.budget)return 'Over budget';return null;}
function fit(item,s){if(s.channel==='pos')return s.basket.includes(item.category)?0:2;const matches=item.people===s.party;return !matches?0:item.priority.includes(s.priority)?2:1;}
function decide(s){const load=band(s),safe=load==='Safe fallback',base=(s.channel==='pos'?addons:meals).map(x=>({...x,service:(load==='Elevated'||load==='High')?(x.id==='classic'?2:x.id==='ready'?0:x.service):x.service}));const rejected=[];let valid=base.filter(x=>{const reason=validity(x,s);if(reason)rejected.push({id:x.id,reason});return !reason;});let eligible=valid.filter(x=>fit(x,s)>=(s.channel==='pos'?2:1));if(s.channel==='pos'&&!posHasBase(s))eligible=[];const before=eligible.map(x=>x.id);if(load==='High')eligible=eligible.filter(x=>x.service<=1);if(s.channel==='pos'&&(s.override==='suppress'||load==='High'))eligible=[];
const fixed=s.branch==='B'||safe;
if(!fixed)eligible.sort((a,b)=>fit(b,s)-fit(a,s)||(s.channel==='pos'?portionFit(a,s)-portionFit(b,s)||(s.priority==='value'?a.price-b.price:0)||(s.priority==='fast'?a.service-b.service:0):0)||((s.channel==='pos'&&load==='Normal')?((a.id==='drink'?-1:addons.findIndex(x=>x.id===a.id))-(b.id==='drink'?-1:addons.findIndex(x=>x.id===b.id))):0)||((load==='Elevated'||load==='High'||s.priority==='fast')?a.service-b.service:0)||((s.priority==='value')?a.price-b.price:0)||a.service-b.service);
let cards=[];
if(s.channel==='pos')cards=eligible.slice(0,1).map(x=>({...x,label:fixed?'Valid option':'Recommended for this order'}));
else if(fixed)cards=eligible.slice(0,3).map(x=>({...x,label:'Valid option'}));
else if(eligible.length){const first=eligible[0];cards.push({...first,label:'Best Fit'});if(s.verifiedFixture){const best=[...eligible].sort((a,b)=>(b.retail-b.price)-(a.retail-a.price))[0];const existing=cards.find(x=>x.id===best.id);if(existing)existing.label+=' · Best Value';else cards.push({...best,label:'Best Value'});}if(!safe){const fast=[...eligible].sort((a,b)=>a.service-b.service)[0];const existing=cards.find(x=>x.id===fast.id);if(existing)existing.label+=' · Fastest to Serve';else cards.push({...fast,label:'Fastest to Serve'});}for(const x of eligible){if(cards.length>=3)break;if(!cards.some(c=>c.id===x.id))cards.push({...x,label:'Also fits your meal'});}cards.sort((a,b)=>eligible.findIndex(x=>x.id===a.id)-eligible.findIndex(x=>x.id===b.id));}
return {band:load,fixed,cards,valid,eligible,rejected,before,highSuppressed:before.length-eligible.length,intent:s.channel==='pos'?{party:s.party,orderType:s.orderType||'meal',priority:s.priority}:null};}
// POS: a snack order may start without a main; meals and sharing orders need one before any extra.
function posHasBase(s){return (s.basket||[]).includes('main')||((s.orderType||'meal')==='snack'&&(s.basket||[]).length>0);}
// Lower is better: sharing / four people prefer two-portion extras, one person prefers single portions.
function portionFit(x,s){return (s.orderType==='sharing'||s.party>=4)?(x.share?0:1):s.party===1?(x.share?1:0):0;}
// Up to three starting picks for the counter before the basket has a base. Same Rules and Load Gate as the kiosk.
function posPicks(s){if(posHasBase(s))return [];const load=band(s),fixed=s.branch==='B'||load==='Safe fallback';
 if((s.orderType||'meal')==='snack'){let c=[meals.find(m=>m.id==='single'),...addons.filter(a=>a.category!=='drink')].filter(x=>!validity(x,{...s,channel:'pos'}));if(load==='High')c=c.filter(x=>x.service<=1);if(!fixed)c.sort((a,b)=>portionFit(a,s)-portionFit(b,s)||(s.priority==='value'?a.price-b.price:0)||a.service-b.service||a.price-b.price);return c.slice(0,3).map((x,i)=>({...x,label:fixed?'Valid option':i?'Also a good snack':'Snack pick'}));}
 return decide({...s,channel:'kiosk',hardBudget:false,party:s.orderType==='sharing'?Math.max(2,s.party):s.party}).cards.slice(0,3);}
function kioskUpsell(s,meal){
 const load=band(s),fixed=s.branch==='B'||load==='Safe fallback';
 if(!meal||validity(meal,s))return {band:load,fixed,cards:[],eligible:[],reason:'meal_invalid'};
 if(load==='Safe fallback')return {band:load,fixed,cards:[],eligible:[],reason:'safe_fallback'};
 if(load==='High')return {band:load,fixed,cards:[],eligible:[],reason:'high_load'};
 if(s.override==='suppress')return {band:load,fixed,cards:[],eligible:[],reason:'manager_suppressed'};
 let eligible=addons.filter(x=>x.category!=='drink'&&!(meal.categories||[]).includes(x.category)&&!validity(x,s)&&(!s.hardBudget||meal.price+x.price<=s.budget));
 if(load==='High')eligible=eligible.filter(x=>x.service<=1);
 if(!fixed&&(load==='Elevated'||load==='High'))eligible.sort((a,b)=>a.service-b.service);
 return {band:load,fixed,eligible,cards:eligible.slice(0,1).map(x=>({...x,label:fixed?'Valid add-on':'Suggested side'})),reason:eligible.length?'eligible':'no_eligible_addon'};
}
function medianTicketAge(tickets){const ages=tickets.filter(x=>x.status!=='ready').map(x=>x.age).sort((a,b)=>a-b);const n=ages.length;return n?Math.round(n%2?ages[(n-1)/2]:(ages[n/2-1]+ages[n/2])/2):0;}
// Same-content illustrative comparison. Extras keep the same price on both sides.
function comboQuote(meal,extra=null){if(!meal)return null;const extraPrice=extra?extra.price:0;const comparable=Number.isFinite(meal.retail)&&Number.isFinite(meal.price)&&meal.retail>=meal.price;return {total:meal.price+extraPrice,comparison:comparable?meal.retail+extraPrice:null,saving:comparable?meal.retail-meal.price:null};}
const api={posHasBase,portionFit,posPicks,variants,defaultVariants,variantValidity,medianTicketAge,VERIFY,meals,addons,posCatalog,quotePOS,comboQuote,defaults,band,budgetPreset,validity,fit,decide,kioskUpsell};root.ComboEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
