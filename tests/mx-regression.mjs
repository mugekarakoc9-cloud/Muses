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
