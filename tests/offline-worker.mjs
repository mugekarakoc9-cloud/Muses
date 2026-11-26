import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('sw.js','utf8'),scope='https://muses.example/';
function worker(fetcher){
 const handlers={},values=new Map(),puts=[];
 const key=r=>typeof r==='string'?r:r.href||r.url;
 const cache={match:async r=>values.get(key(r))?.clone(),put:async(r,v)=>{puts.push(key(r));values.set(key(r),v.clone());}};
 vm.runInNewContext(source,{URL,Request,Response,AbortController,Set,Promise,
   setTimeout:fn=>setTimeout(fn,10),clearTimeout,
   caches:{open:async()=>cache,keys:async()=>[],delete:async()=>true},fetch:fetcher,
   self:{registration:{scope},location:new URL(scope),addEventListener:(n,f)=>handlers[n]=f,
    skipWaiting:async()=>{},clients:{claim:async()=>{}}}});
 return {handlers,values,puts};
}
async function navigate(w){let promise;w.handlers.fetch({request:{method:'GET',url:scope,mode:'navigate'},respondWith:p=>promise=p});return promise;}
for(const status of [401,403,404,500,502,503]){
 const w=worker(async()=>new Response('tunnel unavailable',{status}));
 w.values.set(scope+'index.html',new Response('installed application'));
 assert.equal(await (await navigate(w)).text(),'installed application');
 assert.equal(w.puts.length,0);
}
for(const mode of ['redirect','offline','timeout']){
 const w=worker(async(req,options)=>{
  assert.equal(options.redirect,'error');
  if(mode==='timeout')return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Error('timeout'))));
  throw Error(mode);
 });
 w.values.set(scope+'index.html',new Response('installed application'));
 assert.equal(await (await navigate(w)).text(),'installed application');
 assert.equal(w.puts.length,0);
}
const failed=worker(async()=>{throw Error('missing file');});let install;
failed.handlers.install({waitUntil:p=>install=p});await assert.rejects(install);assert.equal(failed.puts.length,0);
const online=worker(async()=>new Response('new application'));
assert.equal(await(await navigate(online)).text(),'new application');assert.equal(online.puts.length,1);
console.log('PASS: offline fallback, private tunnel errors, redirects, timeout and failed installation');
