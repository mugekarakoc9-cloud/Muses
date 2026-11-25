import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html = fs.readFileSync('index.html', 'utf8');
const worker = fs.readFileSync('sw.js', 'utf8');
const files = new vm.Script(worker.slice(0,worker.indexOf('self.addEventListener')) + '\nFILES').runInNewContext();
assert.equal(files.length,new Set(files).size,'duplicate entries prevent offline installation');
const scripts = [...html.matchAll(/<script src="\.\/(.*?)"><\/script>/g)].map(match => match[1]);
for (const file of [...scripts, 'studio.js', 'sw.js']) {
  new vm.Script(fs.readFileSync(file, 'utf8'), {filename:file});
  if (file !== 'sw.js') assert.ok(worker.includes('./'+file), 'Offline cache: ' + file);
}
assert.ok(html.includes('rel="manifest"'));
assert.ok(fs.readFileSync('studio.js','utf8').includes("serviceWorker.register('./sw.js')"));
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
for (const file of [manifest.start_url, ...manifest.icons.map(icon=>icon.src)]) assert.ok(fs.existsSync(file), file);
console.log('PASS: public application scripts, offline cache and manifest');
