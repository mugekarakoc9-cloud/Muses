import fs from 'node:fs';
import assert from 'node:assert/strict';
const html = fs.readFileSync('index.html','utf8');
const m=html.match(/const DRIVE_CATALOG7=(\[.*?\]);\n/s);
assert.ok(m);
const catalog=JSON.parse(m[1]).filter(x=>x.tree.length);
const walk=a=>a.flatMap(n=>[n,...walk(n.children||[])]);
assert.equal(catalog.length,59);
for(const r of catalog){const ids=walk(r.tree).map(n=>n.id);assert.equal(ids.length,new Set(ids).size,r.title);}
const f=catalog.find(r=>r.title.includes('Fono'));
assert.equal(f.tree.length,104);assert.equal(f.tree.filter(n=>n.checked).length,46);
assert.ok(f.tree.find(n=>n.title==='47. Bulmaca').checked);assert.ok(!f.tree.find(n=>n.title==='46. Bulmaca').checked);
console.log('PASS: 59 Drive source groups, unique IDs, 104 Fono items / 46 checked');
