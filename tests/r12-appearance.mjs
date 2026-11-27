import fs from 'node:fs';import assert from 'node:assert/strict';import vm from 'node:vm';
const script=fs.readFileSync('p1-activity.js','utf8'),css=fs.readFileSync('p1-studio.css','utf8'),v=JSON.parse(fs.readFileSync('deployment-version.json','utf8'));
new vm.Script(script);
assert(script.includes("MX_UI_RELEASE='"+v.release+"',MX_UI_REVISION="+v.revision));
const source=script.slice(script.indexOf('function mxLifetimeEntries('),script.indexOf('function installLifetimeAppearanceMX('));
const entries=vm.runInNewContext(source+';mxLifetimeEntries(state)',{state:{mxVocabularyV2:{actions:Array.from({length:12000},(_,i)=>({id:'a'+i,date:'2026-11-27',grade:5}))},mxFocus:{flashHistory:[{id:'s1'}]},reviews:[{key:'w',date:'2026-11-26'}]}});
assert.equal(entries.length,12002);assert.equal(new Set(entries.map(x=>x.id)).size,12002);
function lum(hex){return hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,b,i)=>a+b*[.2126,.7152,.0722][i],0);}
for(const theme of ['light','dark']){const line=css.split('\n').find(l=>l.startsWith('body[data-theme='+theme+']{--mx-neutral-surface:'));assert(line);
const value=k=>line.match(new RegExp('--'+k+':(#[0-9a-f]{6})'))[1];
for(let n=1;n<=5;n++){const l=[lum(value('mx-d'+n+'-bg')),lum(value('mx-d'+n+'-fg'))].sort((a,b)=>b-a);assert((l[0]+.05)/(l[1]+.05)>=4.5,theme+' grade '+n);}
for(let n=1;n<=4;n++){const l=[lum(value('mx-neutral-surface')),lum(value('mx-f'+n))].sort((a,b)=>b-a);assert((l[0]+.05)/(l[1]+.05)>=3,theme+' flag '+n);}
}
console.log('PASS: R12 syntax, version, 12002 archive entries retained, ten grade contrast pairs and eight flag contrast pairs');
