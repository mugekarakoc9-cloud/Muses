import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const file='index.html', patch=fs.readFileSync('upgrades/v0.11.js','utf8');
const marker='\nrefresh4();\n\nrender();\n', start='/* MUSES_V011_BEGIN */', end='/* MUSES_V011_END */';
let html=fs.readFileSync(file,'utf8');
if(html.includes(start)){let a=html.indexOf(start),b=html.indexOf(end,a);assert.ok(b>a);html=html.slice(0,a)+html.slice(b+end.length)}
assert.ok(html.includes(marker),'Expected insertion anchor absent');
html=html.replace(marker,'\n'+start+'\n'+patch+'\n'+end+marker);
for(const [,code] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(code);
html=html.replace(/<title>MUSES Life Studio v[^<]+<\/title>/,'<title>MUSES Life Studio v0.12</title>');
fs.writeFileSync(file,html);
const sw='sw.js';let src=fs.readFileSync(sw,'utf8');assert.match(src,/muses-life-v[\w.-]+/);src=src.replace(/muses-life-v[\w.-]+/,'muses-life-v0120');new vm.Script(src);fs.writeFileSync(sw,src);
console.log('PASS: integrated v0.11 and parsed scripts');
