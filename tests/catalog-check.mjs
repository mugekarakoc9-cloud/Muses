import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const files = execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean);
for (const file of files) {
  assert.ok(!/\.(?:bundle|epub|pdf|mp4|webm|xlsx|csv|zip|catalog\.json|backup\.json)$/i.test(file), file);
  if (!/\.(?:html|js|css|mjs|py|md|txt|json)$/i.test(file)) continue;
  const source = fs.readFileSync(file,'utf8');
  if (file.endsWith('.json')) {
    const data = JSON.parse(source);
    assert.ok(!['muses-local-catalog','muses-life-backup'].includes(data?.format) &&
      !(Array.isArray(data?.tasks) && Array.isArray(data?.words)), 'Private data: ' + file);
  }
  assert.doesNotMatch(source,/data:(?:image|audio|video)\/[\w.+-]+;base64,[A-Za-z0-9+/=]{120,}/, file);
  assert.doesNotMatch(source,/https?:\/\/(?:docs|drive)\.google\.com\/[^\s'"]*(?:\/d\/|id=)[\w-]{20,}/, file);
}
const studio = fs.readFileSync('studio.js','utf8');
for (const key of ['BOOK_SEED','RESOURCE_SEED','DB4','DRIVE_CATALOG7','DATA9','ATLAS_LOCAL8'])
  assert.ok(studio.includes('const '+key+' = catalog.'+key),key);
console.log('PASS: public assets and locally supplied catalog references');
