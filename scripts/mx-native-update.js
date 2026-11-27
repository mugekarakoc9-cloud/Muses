/* Native only: never reload bundled assets as a substitute for an APK update. */
(function(){
'use strict';
const releases='https://github.com/mugekarakoc9-cloud/Muses/releases/latest';
const key='muses.native.update.feed.v1';
function feedURL(value){
  const u=new URL(value);
  if(u.protocol!=='https:'||u.username||u.password||u.hash||u.search) throw Error('Use a private HTTPS feed URL without credentials or query parameters.');
  return u.href;
}
function validate(local,remote){
  if(!local||!remote||!Number.isSafeInteger(local.buildCode)||local.buildCode<=0||!Number.isSafeInteger(remote.buildCode)||remote.buildCode<=0||
    !/^\d+\.\d+\.\d+$/.test(remote.version)||remote.appId!==local.appId||
    !/^[a-f0-9]{64}$/.test(local.certificateSHA256)||remote.certificateSHA256!==local.certificateSHA256) throw Error('APK identity or signing certificate not verified.');
  const url=new URL(remote.downloadUrl);
  if(url.origin!=='https://github.com'||url.username||url.password||url.search||url.hash||
     !/^\/mugekarakoc9-cloud\/Muses\/releases\/download\/android-\d+-\d+\/MUSES\.apk$/.test(url.pathname)) throw Error('Invalid APK download URL.');
  return remote.buildCode>local.buildCode;
}
if(typeof module==='object'&&module.exports){module.exports={validate,feedURL};return;}
const local=window.MUSES_NATIVE_BUILD;
if(!local)return;
let pending=null,busy=false,checked=0,notice='',lastNotified=0;
function getFeed(){try{return localStorage.getItem(key)||'';}catch{return '';}}
function showMessage(message){notice=message;const el=document.querySelector('#mx-native-update-status');if(el)el.textContent=message;}
async function openPrivate(url){
  if(typeof mxFlushStudyState!=='function'||!await mxFlushStudyState()) {showMessage('Kayıt doğrulanamadı. Güncelleme ertelendi.');return;}
  if(!window.confirm('Önce Ayarlar bölümünden tam yedek al. APK’yi eski uygulamayı silmeden kur. GitHub hesabında oturum açman gerekebilir. Devam edilsin mi?'))return;
  window.location.assign(url);
}
function showPanel(){
  if(typeof modal5!=='function')return;
  modal5('<div class="modalhead5"><h2>Android güncellemeleri</h2><button onclick="close5()">×</button></div><div class="card"><p id="mx-native-current"></p><p id="mx-native-update-status" role="status"></p><button id="mx-native-release">Özel GitHub sürümlerini aç</button> <button id="mx-native-download" hidden>Yeni APK’yı indir</button><p>Kurulumdan önce Ayarlar’dan tam yedek al. Uygulamayı kaldırma.</p></div><div class="card"><label for="mx-native-feed">Otomatik kontrol için özel HTTPS sürüm adresi (isteğe bağlı)</label><input id="mx-native-feed" type="url" placeholder="https://…/android-update.json"><button id="mx-native-feed-save">Kaydet ve kontrol et</button><small>GitHub özel depo oturumu tarayıcıdadır. Erişilebilir bir sürüm adresi tanımlanmadıkça otomatik kontrol yapılamaz.</small></div>');
  document.querySelector('#mx-native-current').textContent='Kurulu sürüm '+local.version+' R'+(local.revision??0)+' · derleme '+(local.buildCode||'doğrulanmadı');
  document.querySelector('#mx-native-update-status').textContent=notice||'Özel yayın henüz kontrol edilmedi.';
  document.querySelector('#mx-native-feed').value=getFeed();
  document.querySelector('#mx-native-release').onclick=()=>openPrivate(releases).catch(()=>showMessage('Özel sürüm sayfası açılamadı.'));
  const download=document.querySelector('#mx-native-download');download.hidden=!pending;
  download.onclick=()=>{if(pending)openPrivate(pending.downloadUrl).catch(()=>showMessage('APK bağlantısı açılamadı.'));};
  document.querySelector('#mx-native-feed-save').onclick=()=>{try{const raw=document.querySelector('#mx-native-feed').value.trim();if(raw)localStorage.setItem(key,feedURL(raw));else localStorage.removeItem(key);checked=0;pending=null;check(false,true);}catch{showMessage('Geçerli HTTPS adresi kullan; token veya parola ekleme.');}};
}
async function check(manual=true,force=false){
  if(manual)showPanel();
  const feed=getFeed();if(!feed){showMessage('Otomatik kontrol adresi bağlı değil. Özel GitHub sürümlerini açarak kontrol edebilirsin.');return;}
  if(busy||(!manual&&!force&&Date.now()-checked<180000))return;
  busy=true;checked=Date.now();
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch(feedURL(feed),{cache:'no-store',credentials:'omit',redirect:'error',signal:controller.signal});
    if(!response.ok)throw Error('Feed unavailable');
    const remote=await response.json();pending=validate(local,remote)?remote:null;
    showMessage(pending?'Yeni APK hazır: '+pending.version+' R'+(pending.revision??0)+' · '+pending.buildCode:'Kurulu derlemeden daha yeni APK yok.');
    const download=document.querySelector('#mx-native-download');if(download)download.hidden=!pending;
    if(pending&&lastNotified!==pending.buildCode){lastNotified=pending.buildCode;if(typeof toast==='function')toast('Yeni Android güncellemesi hazır. Ana sayfada ↻ ile aç.');}
  }catch{pending=null;const download=document.querySelector('#mx-native-download');if(download)download.hidden=true;showMessage('Yeni APK doğrulanamadı. Özel sürüm sayfasını kontrol et.');}
  finally{clearTimeout(timer);busy=false;}
}
function install(){
  window.mxCheckUpdate=check;
  if(typeof settings==='function'&&!window.mxNativeSettingsInstalled){const previous=settings;settings=function(){return '<section class="card"><h3>Android güncellemeleri</h3><button onclick="mxCheckUpdate()">Sürümü kontrol et</button></section>'+previous();};window.mxNativeSettingsInstalled=true;}
  check(false);
}
if(document.readyState==='complete')setTimeout(install,0);else window.addEventListener('load',()=>setTimeout(install,0),{once:true});
})();
