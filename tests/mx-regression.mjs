import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const studio=readFileSync(new URL('../p1-studio.js',import.meta.url),'utf8');
const activity=readFileSync(new URL('../p1-activity.js',import.meta.url),'utf8');
for(const file of ['p1-studio.js','p1-activity.js','p1-planning.js','sw.js'])new Function(readFileSync(new URL('../'+file,import.meta.url),'utf8'));
function extract(source,name,next){const i=source.indexOf('function '+name+'('),j=source.indexOf('function '+next+'(',i+1);assert(i>=0&&j>i);return new Function(source.slice(i,j)+';return '+name)();}
const unique=extract(studio,'dailyNewKeysMX','installDailyLearningMX');
assert.deepEqual(unique(['a','b','b','c'],['a'],2),['b','c']);assert.deepEqual(unique(['a'],[],0),[]);
const hit=extract(studio,'notesStrokeMX','installNotesMX');
assert(hit([{x:0,y:0},{x:20,y:0}],10,2,3));assert(!hit([{x:0,y:0},{x:20,y:0}],10,8,3));
const review=extract(studio,'nextReviewMX','installUniversalReviewMX');
const add=(d,n)=>{const a=new Date(d+'T12:00:00Z');a.setUTCDate(a.getUTCDate()+n);return a.toISOString().slice(0,10);};
const row={last:'2026-11-25',due:'2026-11-29',stage:0};
assert.equal(review(row,'2026-11-28',2,true,add).advanced,false);assert.equal(review(row,'2026-11-29',2,true,add).due,'2026-12-11');assert.equal(review(row,'2026-11-29',2,false,add).due,'2026-11-30');
const reward=extract(studio,'mimoRewardEligibleMX','installMimoRewardsMX');assert(reward({target:5},5));assert(!reward({target:5},4));
const path=extract(studio,'pathStatusMX','pathVideoMX');assert.deepEqual(path([{done:true},{done:false},{done:false}]).map(x=>x.state),['done','open','locked']);
const step=extract(activity,'focusStepMX','installFocusSessionsMX');const a={phase:'work',status:'running',done:0,rounds:2,at:0,end:60000,work:60000,rest:10000};
assert.deepEqual(step(a,60000,true).credit,[0,60000]);assert.equal(step(a,70000,true).credit,null);assert.equal(step(a,130000,true).finished,true);
console.log('MUSES regression: syntax, unique words, ink geometry, SRS, rewards, path and focus passed.');

const hour=extract(studio,'mxHourSlot','installHourlyAgendaMX');for(const [t,n] of [['00:00',0],['18:15',18],['23:59',23],['24:00',-1],['12:60',-1],['',-1]])assert.equal(hour(t),n);
const key=extract(studio,'mxBackupMediaKey','mxValidPack');for(const k of ['p90-2','mx-original-mx-reader-abc','mx-audio-mx-reader-abc','mx-focus-sound-break','mx-mimo-character-pack-v2'])assert(key(k));for(const k of ['__proto__','unknown','p90-13'])assert(!key(k));
console.log('PASS: calendar hours and full-media backup key validation');

const current=extract(studio,'pathCurrentMX','pathVideoMX');
const puzzle=Array.from({length:60},(_,i)=>({id:i+1,done:i<17||i===46,active:i===47}));assert.equal(current(puzzle),47);assert.equal(path(puzzle)[47].state,'open');assert.equal(path(puzzle)[48].state,'open');assert.equal(path(puzzle)[49].state,'locked');assert.equal(current([{done:false},{done:true},{done:false}]),2);assert.equal(path([{done:false},{done:true},{done:false}])[2].state,'open');console.log('PASS: active puzzle 48 and progression despite earlier gaps');

// Path skip is a resolved navigation state, never a completed study.
assert.deepEqual(path([{skipped:true},{done:false},{done:false}]).map(x=>x.state),['skipped','open','locked']);
assert.equal(current([{done:true},{skipped:true},{done:false}]),2);
assert.deepEqual(path([{done:false},{unlocked:true},{done:false}]).map(x=>x.state),['open','open','open']);
assert.equal(current([{skipped:true,active:true},{done:false}]),1);
console.log('PASS: skipped and explicitly unlocked path states');

// Date-range resource planning preserves every selected unit and true page spans.
const pageSource=studio.slice(studio.indexOf('function mxPageSpanMX('),studio.indexOf('/* Unit controls and multi-section goals. */'));
const pageFns=new Function(pageSource+';return {span:mxPageSpanMX,weighted:mxWeightedPlanMX}')();assert.deepEqual(pageFns.span({note:'s.38–41'}),[38,41]);assert.equal(pageFns.span({title:'Unit 4'}),null);const pagePlan=pageFns.weighted([{id:'a',weight:4},{id:'b',weight:2},{id:'c',weight:6}],['d1','d2']);assert.equal(pagePlan.reduce((n,x)=>n+x.weight,0),12);assert.deepEqual(pagePlan.flatMap(x=>x.items.map(y=>y.id)),['a','b','c']);console.log('PASS: weighted goal planning and page metadata');

 // Flashcard presentation numbers are the inverse of the persisted legacy SRS grade.
 const vocabStudio=studio.slice(studio.indexOf('function installVocabularyStudioV2(){'),studio.indexOf('const previousStudioVocabularyV2='));
 const mapping=vocabStudio.match(/const gradeFromDisplay=n=>6-n;\s+const ratingKeys=\{a:1,s:2,d:3,g:4,f:5\};/)[0];
 const ratings=new Function(mapping+'return {gradeFromDisplay,ratingKeys};')();
 assert.deepEqual([1,2,3,4,5].map(ratings.gradeFromDisplay),[5,4,3,2,1]);
 assert.deepEqual(ratings.ratingKeys,{a:1,s:2,d:3,g:4,f:5});
 assert(vocabStudio.includes("cfg.mode==='flash'&&s.side?"));
 assert(vocabStudio.includes("start(keys,'type',false,true)"));
 assert(vocabStudio.includes("d.lastReviewSession=s.id"));
 console.log('PASS: reversed display grade and explicit practice routing');

const reviewEvents=extract(studio,'mxvReviewEvents','mxvTally');
const reviewRows=Array.from({length:450},(_,i)=>[{session:'fixture',key:'card'+i,type:'rating',grade:3},{session:'fixture',key:'card'+i,type:'answer',selfAssessment:true,mode:'flash'}]).flat();
assert.equal(reviewEvents(reviewRows).length,450);
assert.equal(reviewEvents([...reviewRows,reviewRows[0]]).length,450);
assert.equal(reviewEvents([{type:'answer',selfAssessment:true,mode:'flash',id:'legacy'}]).length,1);
assert.equal(reviewEvents([{type:'answer',mode:'type',ok:true}]).length,0);
assert.equal(reviewEvents([...reviewRows,{session:'second',key:'card0',type:'rating',grade:2}]).length,451);
console.log('Review history regression: 450 cards, deduplication, legacy fallback and repeated session passed.');

const currentPath=extract(studio,'pathCurrentMX','pathVideoMX');
const stalePath=Array.from({length:50},(_,i)=>({done:i<47&&i!==17,active:i===17}));
assert.equal(currentPath(stalePath),47);
assert.equal(currentPath([{done:false},{done:true}]),1);
assert.equal(currentPath([]),-1);
console.log('Path regression: stale stop cannot override later progress.');


const measure = new Function(studio.slice(studio.indexOf('const MX_MEASURE_UNITS='),studio.indexOf('/* Unit controls and multi-section goals. */'))+';return mxConvertMeasure')();
assert.equal(measure('2,5','litre','ml'),2500);
assert.equal(measure(1.5,'kg','gram'),1500);
assert.equal(measure(.5,'saat','dakika'),30);
assert.equal(measure(1,'bardak','litre'),null);
assert.equal(measure(1,'sayfa','kg'),null);
const reconcile=new Function(studio.slice(studio.indexOf('function mxvReviewEvents('),studio.indexOf('/* Isolated vocabulary workspace */'))+';return mxReviewCountWithReported')();
const date='2026-11-26',dated=reviewRows.map(x=>({...x,date}));
assert.equal(reconcile(dated,{[date]:450},date,date),450);
assert.equal(reconcile(dated.slice(0,40),{[date]:450},date,date),450);
assert.equal(reconcile(dated,{[date]:20},date,date),450);
assert.equal(reconcile(dated,{[date]:450},'2026-11-27','2026-11-27'),0);
console.log('PASS: reported daily totals reconcile without inventing card events; compatible unit conversions');


const ink=new Function(studio.slice(studio.indexOf('function mxHighlightInk('),studio.indexOf('async function mxFlushStudyState('))+';return mxHighlightInk')();
assert.equal(ink('#000000'),'#ffffff');
assert.equal(ink('#ffffff'),'#000000');
assert.equal(ink('rgb(22, 24, 32)'),'#ffffff');
assert.equal(ink('#f1abd3'),'#000000');
assert.equal(measure(1,'bulmaca','ders'),null);
const habitCode=studio.slice(studio.indexOf('function mxHabitGoalMet('));
const habitFactory=new Function('actual5','today','hasValue5','v5',habitCode+';return mxHabitGoalMet');
const h=(value,exists,closed)=>habitFactory(()=>value,()=> '2026-11-27',()=>exists,()=>({closed:{'2026-11-27':closed}}));
assert.equal(h(5,true,false)('Sigara','2026-11-26',15,'max'),true);
assert.equal(h(0,false,true)('Sigara','2026-11-26',15,'max'),false);
assert.equal(h(16,true,true)('Sigara','2026-11-27',15,'max'),false);
assert.equal(h(5,true,false)('Sigara','2026-11-27',15,'max'),false);
assert.equal(h(0,true,true)('Sigara','2026-11-27',0,'max'),true);
assert.equal(h(1,true,false)('Su','2026-11-27',1,'min'),true);
assert.equal(h(1,true,true)('Su','2026-11-28',1,'min'),false);
console.log('PASS: reader highlight contrast and minimum/maximum habit semantics');
