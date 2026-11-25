'use strict';

function installStudioP1() {
  const prefs = () => S.studioP1 ??= {};
  const originalHome = home;
  const originalRow = row5;
  const originalCalendar = cal5;
  const originalSettings = settings;
  const originalRender = render;
  let draggedTask = '';
  let treeScale = 1;

  function options() {
    return [
      ...nav.map(([id, icon, label]) => ({label, open: () => go(id)})),
      ...S.tasks.map(task => ({label: task.title, open: () => showQuick5(task.date, enc5(task.id))})),
      ...v5().challenges.map(goal => ({label: goal.title, open: () => {
        v10().treeDate = goal.start;
        v10().treeOpen[goal.id] = true;
        v10().treeFilter = 'All';
        go('english');
      }})),
      ...resourceRows().map(resource => ({label: resource.title, open: () => startSource9(resource.id)}))
    ];
  }

  function normalize(value) {
    return String(value).toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu, '').replace(/ı/g, 'i');
  }

  window.openPaletteP1 = function () {
    const entries = options();
    modal5(`<div class="modalhead5"><h2>Ara veya görev ekle</h2>
      <button aria-label="Kapat" onclick="close5()">×</button></div>
      <form id="paletteP1"><label>Arama veya yeni görev
        <input name="query" autocomplete="off" placeholder="Örn. Yarın 18:30 piyano" required>
      </label><button class="primary">Görev taslağı oluştur</button></form>
      <div id="resultsP1" class="p1-results"></div>`);
    const form = document.querySelector('#paletteP1');
    const input = form.elements.query;
    const results = document.querySelector('#resultsP1');
    const update = () => {
      const words = normalize(input.value.trim()).split(/\s+/);
      results.replaceChildren();
      for (const entry of entries.filter(item => words.every(word => normalize(item.label).includes(word))).slice(0, 10)) {
        const button = document.createElement('button');
        button.textContent = entry.label;
        button.addEventListener('click', () => { close5(); entry.open(); });
        results.append(button);
      }
      if (!results.childElementCount) results.textContent = 'Eşleşme bulunmadı.';
    };
    input.addEventListener('input', update);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const draft = parseSmart6(input.value, today());
      q5Id = '';
      q5Date = draft.date;
      q5Module = 'general';
      q5Target = '';
      q5Draft = {...draft, priority:'Orta', note:'', amount:1};
      quickForm5();
    });
    update();
    input.focus();
  };

  home = () => `<div class="p1-tools">
    <button onclick="openPaletteP1()">Ara veya görev ekle <kbd>${prefs().shortcut || 'K'}</kbd></button>
    <button onclick="fullscreenP1()">Tam ekran</button>
  </div>` + originalHome();

  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey ||
        event.key.toUpperCase() !== (prefs().shortcut || 'K')) return;
    event.preventDefault();
    openPaletteP1();
  });

  window.fullscreenP1 = async function () {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      toast('Bu tarayıcıda tam ekran açılamadı.');
    }
  };

  window.setStudioP1 = function (key, value) {
    prefs()[key] = value;
    persist();
  };

  settings = () => `<details class="card p1-appearance"><summary>Görünüm ve komut kısayolu</summary>
    <label>Tema <select onchange="setStudioP1('theme',this.value)">${opt5([['manual','Mevcut uygulama ayarı'],['system','Sistem'],['light','Açık'],['dark','Koyu']], prefs().theme || 'manual')}</select></label>
    <label>Yazı tipi <select onchange="setStudioP1('font',this.value)">${opt5([['default','Varsayılan'],['system','Sistem'],['serif','Serif']], prefs().font || 'default')}</select></label>
    <label>Yazı boyutu <select onchange="setStudioP1('size',this.value)">${opt5([['100','Varsayılan'],['112','Büyük'],['125','Çok büyük']], prefs().size || '100')}</select></label>
    <label>Renk paleti <select onchange="setStudioP1('palette',this.value)">${opt5([['default','Varsayılan'],['ocean','Deniz'],['plum','Mürdüm']], prefs().palette || 'default')}</select></label>
    <label>Komut paleti <select onchange="setStudioP1('shortcut',this.value)">${opt5(['K','J','P'].map(key => [key,'Ctrl / ⌘ + '+key]), prefs().shortcut || 'K')}</select></label>
  </details>` + originalSettings();

  const colorScheme = matchMedia('(prefers-color-scheme: dark)');
  function applyAppearance() {
    const {theme, font, size, palette} = prefs();
    if (theme && theme !== 'manual') document.body.dataset.theme =
      theme === 'system' ? (colorScheme.matches ? 'dark' : 'light') : theme;
    document.body.dataset.studioFont = font || 'default';
    document.body.dataset.studioPalette = palette || 'default';
    document.documentElement.style.fontSize = Number(size || 100) + '%';
    document.body.dataset.studioMotion = v5().animations ? 'on' : 'off';
  }
  colorScheme.addEventListener('change', () => {
    if (prefs().theme === 'system') applyAppearance();
  });

  function status(row) {
    if (row.done) return 'Tamamlandı';
    if (row.date < today() || v5().closed[row.date]) return 'Tamamlanmadı';
    return 'Planlandı';
  }

  row5 = function (row, compact = false) {
    const label = row.kind === 'actual' ? 'Gerçekleşen' : status(row);
    let html = originalRow(row, compact);
    const detail = compact ? '' : `<span class="p1-status">${label}</span>`;
    if (row.kind === 'task' && !row.done) {
      const key = enc5(row.id);
      html = html.replace('<div class="event5', `<div draggable="true" data-p1-task="${key}" class="event5`);
      return html.slice(0, -6) + detail + (compact ? '' :
        `<button class="p1-defer" onclick="deferDialogP1('${key}')">Ertele</button>`) + '</div>';
    }
    return html.slice(0, -6) + detail + '</div>';
  };

  function defer(key, date) {
    const task = S.tasks.find(item => item.id === dec5(key));
    if (!task || taskDone5(task) || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        date < today() || !Number.isFinite(Date.parse(date)) || task.date === date) return;
    if (linked5(task) && S.tasks.some(item => item !== task && item.date === date &&
        item.module === task.module && item.target === task.target)) {
      return toast('Bu çalışma seçilen günde zaten planlı.');
    }
    const history = Array.isArray(task.deferredFrom) ? task.deferredFrom : [];
    task.deferredFrom = [...history, task.date];
    task.date = date;
    selected = date;
    calMonth = date.slice(0, 7);
    close5();
    persist();
  }

  window.deferDialogP1 = function (key) {
    modal5(`<div class="modalhead5"><h2>Görevi ertele</h2>
      <button aria-label="Kapat" onclick="close5()">×</button></div>
      <form onsubmit="event.preventDefault();deferTaskP1('${key}',this.elements.date.value)">
      <label>Yeni tarih <input type="date" name="date" min="${today()}" value="${add(today(),1)}" required></label>
      <button class="primary">Yeni tarihe taşı</button></form>`);
  };
  window.deferTaskP1 = defer;

  document.addEventListener('dragstart', event => {
    const row = event.target.closest('[data-p1-task]');
    if (!row) return;
    draggedTask = row.dataset.p1Task;
    event.dataTransfer.setData('text/plain', draggedTask);
    event.dataTransfer.effectAllowed = 'move';
  });
  document.addEventListener('dragend', () => { draggedTask = ''; });
  document.addEventListener('dragover', event => {
    if (draggedTask && event.target.closest('[data-p1-date]')) event.preventDefault();
  });
  document.addEventListener('drop', event => {
    const cell = event.target.closest('[data-p1-date]');
    if (!cell || !draggedTask) return;
    event.preventDefault();
    const key = draggedTask;
    draggedTask = '';
    if (cell.dataset.p1Date >= today()) defer(key, cell.dataset.p1Date);
  });

  cal5 = function () {
    const html = originalCalendar().replace(/<div class="cell5 ([^"]*)"><div class="cellhead5"><button onclick="daySelect5\('(\d{4}-\d{2}-\d{2})'\)/g,
      (matched, classes, date) => matched.replace('<div class="cell5', `<div data-p1-date="${date}" class="cell5`));
    const entries = S.tasks.flatMap(task => Array.isArray(task.deferredFrom)
      ? task.deferredFrom.filter(date => date === selected).map(() => task) : []);
    return html + (entries.length ? `<section class="card p1-deferred"><h3>Ertelenenler</h3>
      ${entries.map(task => `<button onclick="showQuick5('${task.date}','${enc5(task.id)}')">${esc(task.title)} → ${esc(dateLabel5(task.date))}</button>`).join('')}</section>` : '');
  };

  function prepareTree() {
    const tree = document.querySelector('.treeStudio10');
    if (!tree) return;
    const viewport = document.createElement('div');
    viewport.className = 'p1-tree-viewport';
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', 'Hedef ağacı');
    tree.before(viewport);
    viewport.append(tree);
    const toolbar = document.createElement('div');
    toolbar.className = 'p1-tools';
    viewport.before(toolbar);
    function zoom(value) {
      treeScale = Math.min(1.6, Math.max(.7, value));
      tree.style.zoom = treeScale;
      requestAnimationFrame(drawTree10);
    }
    for (const [label, change] of [['Uzaklaştır', -.15], ['Yakınlaştır', .15], ['Ağaca odaklan', 0]]) {
      const button = document.createElement('button');
      button.textContent = label;
      button.addEventListener('click', () => {
        zoom(change ? treeScale + change : 1);
        if (!change) { viewport.scrollTo(0, 0); viewport.focus(); }
      });
      toolbar.append(button);
    }
    let origin;
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, summary, select, a, label')) return;
      origin = {x:event.clientX, y:event.clientY, left:viewport.scrollLeft, top:viewport.scrollTop};
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
      if (origin) viewport.scrollTo(origin.left + origin.x - event.clientX, origin.top + origin.y - event.clientY);
    });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) {
      viewport.addEventListener(type, () => { origin = null; });
    }
    zoom(treeScale);
  }

  render = function () {
    originalRender();
    applyAppearance();
    if (view === 'english') prepareTree();
  };
}


/* Local reader import and book archive; no personal content. */
function installLocalLibraryMX(){
 if(window.mxLibraryInstalled)return;window.mxLibraryInstalled=true;
 const st=()=>S.mxLibrary??={archived:{}},archive=()=>st().archived??={};
 const H=v=>esc(String(v??''));
 function cover(title){
  const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const lines=String(title).slice(0,100).match(/.{1,18}(?:\s|$)|.{1,18}/g)||['MUSES'];
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 330"><rect width="240" height="330" rx="12" fill="#e8dff0"/><rect x="12" y="12" width="216" height="306" rx="9" fill="none" stroke="#9883b4"/><circle cx="120" cy="68" r="30" fill="#a9c7b0"/>'+lines.slice(0,7).map((s,i)=>'<text x="120" y="'+(130+i*23)+'" font-family="Georgia,serif" font-size="16" text-anchor="middle" fill="#493660">'+xml(s.trim())+'</text>').join('')+'<text x="120" y="306" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#685680">MUSES · LIBRARY</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 }
 function normalize(t,ext){
  t=String(t).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
  if(/^(html?|xhtml)$/.test(ext)){const d=new DOMParser().parseFromString(t,'text/html');d.querySelectorAll('script,style,iframe,object,embed,template,noscript,svg').forEach(n=>n.remove());t=d.body.textContent;}
  if(ext==='json'){const flatten=(x,n=0)=>n>20?'':typeof x==='string'?x:Array.isArray(x)?x.map(v=>flatten(v,n+1)).join('\n\n'):x&&typeof x==='object'?Object.entries(x).map(([k,v])=>k+': '+flatten(v,n+1)).join('\n'):String(x??'');t=flatten(JSON.parse(t));}
  if(t.includes('\u0000'))throw Error('İkili dosya: metin olarak dışa aktar.');return t.trim();
 }
 function pages(t){let result=[];while(t.length){let i=t.length<=1800?t.length:t.lastIndexOf(' ',1800);if(i<900&&t.length>1800)i=1800;const x=t.slice(0,i).trim();if(x)result.push({title:'Bölüm '+(result.length+1),text:x});t=t.slice(i).trim();}return result;}
 function cues(t){
  const time=s=>{const p=s.trim().replace(',','.').split(':').map(Number);return p.length>=2&&p.length<=3&&p.every(v=>Number.isFinite(v)&&v>=0)?p.reduce((a,v)=>60*a+v,0):NaN;};
  return String(t).replace(/\r/g,'').split(/\n\s*\n/).flatMap(b=>{const a=b.split('\n'),i=a.findIndex(x=>x.includes('-->'));if(i<0)return [];const [l,r]=a[i].split('-->'),start=time(l),end=time(r.trim().split(/\s+/)[0]),text=a.slice(i+1).join('\n').replace(/<[^>]*>/g,'').trim();return Number.isFinite(start)&&Number.isFinite(end)&&end>start&&text?[{start,end,text}]:[];}).sort((a,b)=>a.start-b.start);
 }
 window.mxImportLibrary=function(){
  modal5(`<div class="modalhead5"><h2>Metin ve ses ekle</h2><button onclick="close5()">×</button></div><form id="mx-lib-form" class="card"><label>Başlık<input name="title" maxlength="160"></label><label>Dil<select name="language"><option value="en">İngilizce</option><option value="tr">Türkçe</option><option value="other">Diğer</option></select></label><label>Kategori<input name="category" value="Kişisel kaynak"></label><label>Metni yapıştır<textarea name="text" style="width:100%;min-height:150px" placeholder="Metni buraya yapıştır"></textarea></label><label>Metin dosyası<input name="file" type="file" accept=".txt,.md,.markdown,.html,.htm,.xhtml,.csv,.tsv,.json"></label><label>Ses<input name="audio" type="file" accept="audio/*,.m4a,.mp3,.wav,.ogg"></label><label>Altyazı (SRT/VTT)<input name="subtitle" type="file" accept=".srt,.vtt"></label><p class="muted">TXT, Markdown, HTML, CSV, TSV ve JSON okunabilir metne dönüştürülür. Kapak otomatik oluşturulur. PDF/EPUB/DOCX dönüşümü ve ses çözümleme henüz yok; senkron altyazı için SRT/VTT ekle.</p><button class="primary">İçe aktar</button><p role="status"></p></form>`);
  const f=document.querySelector('#mx-lib-form');
  f.onsubmit=async e=>{e.preventDefault();const status=f.querySelector('[role=status]'),button=f.querySelector('button.primary');button.disabled=true;let key=null,book=null;
   try{const file=f.elements.file.files[0],audio=f.elements.audio.files[0],sub=f.elements.subtitle.files[0];let t=f.elements.text.value.trim(),cc=[];
    if(file){const ext=file.name.split('.').pop().toLowerCase();if(!/^(txt|md|markdown|html?|xhtml|csv|tsv|json)$/.test(ext))throw Error('Desteklenmeyen biçim. TXT/HTML olarak dışa aktar.');if(file.size>1500000)throw Error('Metin dosyası 1,5 MB sınırını aşıyor.');t=normalize(await file.text(),ext);}
    if(sub){if(sub.size>1000000)throw Error('Altyazı çok büyük.');cc=cues(await sub.text());if(!cc.length)throw Error('Geçerli altyazı zaman kodu yok.');}
    if(!t&&cc.length)t=cc.map(c=>c.text).join('\n\n');
    if(!t&&!audio)throw Error('Metin veya ses ekle.');if(t.length>1500000)throw Error('Metni daha küçük bölümlere ayır.');
    const id='mx-reader-'+uid(),title=f.elements.title.value.trim()||(file||audio)?.name.replace(/\.[^.]+$/,'')||'Yeni metin',category=f.elements.category.value.trim()||'Kişisel kaynak';
    if(audio){if(audio.size>150*1024*1024)throw Error('Ses dosyası 150 MB sınırını aşıyor.');const est=await navigator.storage?.estimate?.();if(est?.quota&&est.quota-est.usage<audio.size*1.2)throw Error('Depolama alanı yetersiz.');key='mx-audio-'+id;await put6('media',key,audio);}
    book={id,title,author:'',category,language:f.elements.language.value,kind:audio?'Ses / metin':'Metin bölümü',cover:cover(title),pages:t?pages(t):[{title:'Ses kaydı',text:''}],source:'Kullanıcı dosyası',mxAudio:key,mxCues:cc};
    v9().customReaders.push(book);save();close5();openReader9(id);toast('Kaynak eklendi.');
   }catch(err){if(book)v9().customReaders=v9().customReaders.filter(x=>x!==book);if(key)try{await put6('media',key,null);}catch{}status.textContent=err.message;button.disabled=false;}
  };
 };
 const oldRows=bookRows;bookRows=function(){const rows=oldRows();for(const [id,b] of Object.entries(v2().bookMeta||{}))if(b?.local&&!rows.some(x=>x.id===id))rows.push({...b,id});return rows.filter(b=>!archive()[b.id]).map(b=>{const r=readerList9().find(x=>x.id===b.id);return {...b,category:r?.category||b.category,language:r?.language||b.language};});};
 const oldCover=coverHtml;coverHtml=function(b){if(/^https?:\/\//i.test(b.cover||''))return oldCover(b);return `<img class="bookcover" src="${H(/^data:image\/svg\+xml;charset=utf-8,/.test(b.cover||'')?b.cover:cover(b.title))}" alt="${H(b.title)}" loading="lazy">`;};
 window.mxArchiveBook=function(k){const id=dec5(k),b=bookRows().find(x=>x.id===id)||readerList9().find(x=>x.id===id);if(v5().challenges.some(g=>g.module==='book'&&g.target===id)||S.tasks.some(t=>t.module==='book'&&t.target===id))return toast('Önce bu kitaba bağlı hedef ve görevleri kaldır. Okuma geçmişi korunur.');if(!b||!confirm('Kitap kaldırılsın mı? Okuma geçmişi korunur; geri yükleyebilirsin.'))return;archive()[id]={title:b.title};if(v9().readerId===id){readerStop9();v9().readerId='';}bookSelected='';persist();};
 window.mxRestoreBook=function(k){delete archive()[dec5(k)];close5();persist();};
 window.mxArchiveList=function(){modal5(`<div class="modalhead5"><h2>Kaldırılan kitaplar</h2><button onclick="close5()">×</button></div>${Object.entries(archive()).map(([id,b])=>`<div class="card"><b>${H(b.title)}</b> <button onclick="mxRestoreBook('${enc5(id)}')">Geri yükle</button></div>`).join('')||'<p>Boş</p>'}`);};
 const oldOpen=openReader9;openReader9=function(id){if(archive()[id])return toast('Bu kaynak kaldırılmış. Önce geri yükle.');return oldOpen(id);};
 const oldLib=libraryView;libraryView=function(){if(v9().readerId&&archive()[v9().readerId])v9().readerId='';if(v9().readerId)return oldLib();const el=document.createElement('div');el.innerHTML=oldLib();el.querySelector('.importReader9')?.remove();const shelf=el.querySelector('.readerShelf9');if(shelf){shelf.replaceChildren();for(const b of readerList9().filter(x=>!archive()[x.id])){const btn=document.createElement('button');btn.setAttribute('onclick',`openReader9(dec5('${enc5(b.id)}'))`);const img=document.createElement('img');img.src=b.cover||cover(b.title);img.alt=b.title;img.loading='lazy';const title=document.createElement('b');title.textContent=b.title;btn.append(img,title);shelf.append(btn);}}return `<section class="card"><h3>Yerel kitaplık</h3><div class="flex"><button class="primary" onclick="mxImportLibrary()">＋ Metin / dosya / ses</button><button onclick="mxArchiveList()">Kaldırılanlar</button>${bookSelected&&bookRows().some(b=>b.id===bookSelected)?`<button onclick="mxArchiveBook('${enc5(bookSelected)}')">Kitabı kaldır</button>`:''}</div></section>`+el.innerHTML;};
 const oldReader=readerView9;readerView9=function(){const b=readerList9().find(x=>x.id===v9().readerId),h=oldReader();if(!b)return h;const audio=b.mxAudio?`<section class="card" data-mx-audio="${H(b.mxAudio)}" data-mx-book="${H(b.id)}"><h3>Ses ve altyazı</h3><audio controls preload="metadata" style="width:100%"></audio><p class="mx-caption" style="background:#342d47;color:white;padding:14px;text-align:center;border-radius:10px;white-space:pre-wrap">${b.mxCues?.length?'Altyazı sesle eşleşir.':'Altyazı yüklenmemiş.'}</p></section>`:'';return h.replace('</div><div class="readerTools9">',`<button onclick="mxArchiveBook('${enc5(b.id)}')">Kitabı kaldır</button></div><div class="readerTools9">`).replace('<div class="readerPage9"',audio+'<div class="readerPage9"');};
 let url=null;const previousRender=render;render=function(){if(url){URL.revokeObjectURL(url);url=null;}previousRender();const p=document.querySelector('[data-mx-audio]');if(!p)return;const b=readerList9().find(x=>x.id===p.dataset.mxBook),a=p.querySelector('audio'),cap=p.querySelector('.mx-caption');get6('media',p.dataset.mxAudio).then(blob=>{if(!p.isConnected)return;if(!(blob instanceof Blob)){cap.textContent='Ses dosyası bulunamadı.';return;}url=URL.createObjectURL(blob);a.src=url;a.ontimeupdate=()=>{cap.textContent=(b.mxCues||[]).filter(c=>c.start<=a.currentTime&&a.currentTime<c.end).map(c=>c.text).join('\n')||(b.mxCues?.length?'':'Altyazı yüklenmemiş.');};}).catch(()=>{if(p.isConnected)cap.textContent='Ses dosyası okunamadı.';});};
}
const originalStudioInstallMXLibrary = installStudioP1;
installStudioP1 = function(){originalStudioInstallMXLibrary();installLocalLibraryMX();};


/* Unit controls and multi-section goals. */
function installPacedGoalsMX(){
 if(window.mxPacedGoalsInstalled)return;window.mxPacedGoalsInstalled=true;
 const state=()=>S.mxGoalControls??={},prefs=()=>state().habitUnits??={},scopes=()=>state().scopes??={},H=x=>esc(String(x??''));
 const units={adet:['count',1],kez:['count',1],oturum:['session',1],bardak:['glass',1],fincan:['cup',1],ml:['volume',1],litre:['volume',1000],L:['volume',1000],dakika:['time',1],saat:['time',60],saniye:['time',1/60],metre:['distance',1],km:['distance',1000],cm:['distance',.01],gram:['mass',1],kg:['mass',1000],sayfa:['page',1],bölüm:['chapter',1],kelime:['word',1],tekrar:['rep',1]};
 const daysUI=()=>`<div style="display:flex;flex-wrap:wrap;gap:10px">${['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'].map((d,i)=>`<label style="display:flex;align-items:center;gap:4px"><input type="checkbox" name="mxDay" value="${i}" checked>${d}</label>`).join('')}</div>`;
 const daysOf=f=>[...f.querySelectorAll('[name=mxDay]:checked')].map(x=>Number(x.value));
 function eligible(start,n,days){if(!/^\d{4}-\d\d-\d\d$/.test(start)||!Number.isInteger(n)||n<1||n>3660||!days.length)return [];let dates=[];for(let i=0;i<3660&&dates.length<n;i++){let d=add(start,i);if(days.includes(new Date(d+'T12:00:00').getDay()))dates.push(d);}return dates;}
 function applyUnits(){for(const h of habits){const p=prefs()[h[0]];if(p){h[1]=p.target;h[2]=p.unit;h[3]=p.step;}}}
 applyUnits();
 window.mxHabitUnits=function(){
  const entries=habits.map(h=>[h[0],h[0]]);
  modal5(`<div class="modalhead5"><h2>Alışkanlık birimleri</h2><button onclick="close5()">×</button></div><form id="mx-unit-form" class="card"><label>Alışkanlık<select name="habit">${opt5(entries,entries[0]?.[0])}</select></label><label>Ölçü birimi<select name="unit">${opt5(Object.keys(units).map(u=>[u,u]),'adet')}</select></label><label>Günlük hedef<input name="target" type="number" min="0" step="any" required></label><label>Artış miktarı<input name="step" type="number" min="0.000001" step="any" required></label><p class="muted">Uyumlu birimler eski kayıtları sayısal olarak dönüştürür. Bardak/fincan hacmi bilinmediği için otomatik litre dönüşümü yapılmaz. Ortak kayda bağlı oturumlar korunur.</p><button class="primary">Kaydet</button></form>`);
  const f=document.querySelector('#mx-unit-form'),find=()=>habits.find(h=>h[0]===f.elements.habit.value);
  function load(){const h=find();if(!h)return;const sel=f.elements.unit;if(![...sel.options].some(x=>x.value===h[2]))sel.add(new Option(h[2],h[2]));sel.value=h[2];f.elements.target.value=h[1];f.elements.step.value=h[3];}
  f.elements.habit.onchange=load;f.elements.unit.onchange=()=>{const h=find(),a=units[h?.[2]],b=units[f.elements.unit.value];if(a&&b&&a[0]===b[0]){const factor=a[1]/b[1];f.elements.target.value=Number((h[1]*factor).toPrecision(12));f.elements.step.value=Number((h[3]*factor).toPrecision(12));}};load();
  f.onsubmit=e=>{e.preventDefault();const h=find();if(!h)return;const n=h[0],old=h[2],u=f.elements.unit.value,target=Number(f.elements.target.value),step=Number(f.elements.step.value),a=units[old],b=units[u];if(!Number.isFinite(target)||target<0||!Number.isFinite(step)||step<=0)return toast('Geçerli miktar ve artış gir.');
   if(['P90X','İngilizce','Kitap okuma','Piyano','Effortless English','Konuşma pratiği'].includes(n)&&u!==old)return toast('Bu sayaç ortak etkinlik kayıtlarına bağlı; birimi değiştirilemez.');
   const records=Object.values(S.habits).filter(row=>row&&Object.hasOwn(row,n)),goals=v5().challenges.filter(g=>g.module==='habit'&&g.target===n),tasks=S.tasks.filter(t=>t.module==='habit'&&t.target===n);
   if(u!==old&&(records.length||goals.length||tasks.length)&&(!a||!b||a[0]!==b[0]))return toast('Eski kayıtlarla uyumsuz birim. Farklı isimle yeni alışkanlık oluştur.');
   if(u!==old&&a&&b&&a[0]===b[0]){const factor=a[1]/b[1],convert=v=>Number((Number(v)*factor).toPrecision(12));if(!confirm('Eski miktarlar ve bağlı hedefler '+old+' biriminden '+u+' birimine dönüştürülsün mü?'))return;records.forEach(r=>r[n]=convert(r[n]));for(const g of goals){g.amount=convert(g.amount);const p=v9().plans[g.id];if(p)for(const d of Object.values(p.dates||{}))d.amount=convert(d.amount);}tasks.forEach(t=>{if(Number.isFinite(Number(t.amount)))t.amount=convert(t.amount);});}
   prefs()[n]={unit:u,target,step};applyUnits();close5();persist();
  };
 };
 const habitUI=habitCards;habitCards=function(){applyUnits();return `<div class="flex"><button onclick="mxHabitUnits()">Ölçü birimini düzenle</button></div>`+habitUI();};
 const prevScope=scope6;scope6=function(key){const s=scopes()[String(key)];if(!s)return prevScope(key);const base=prevScope(s.resource);if(!base.r)return base;const ids=new Set(s.ids),items=base.items.filter(n=>ids.has(n.id));return {...base,items,tree:items,node:{id:s.id,title:s.title,children:items}};};
 const prevChoices=choices5;choices5=function(m){const rows=prevChoices(m);if(m==='resource')for(const [key,s] of Object.entries(scopes())){const r=scope6(key).r;if(r&&!rows.some(a=>a[0]===key))rows.push([key,r.title+' › '+s.title]);}return rows;};
 const prevDays=challengeDays5;challengeDays5=function(g){return Array.isArray(g.mxWeekdays)&&g.mxWeekdays.length?range5(g.start,g.end).filter(d=>g.mxWeekdays.includes(new Date(d+'T12:00:00').getDay())):prevDays(g);};
 const prevSchedule=schedule9;schedule9=function(g){if(!g?.mxPace||v9().plans[g.id])return prevSchedule(g);const dates={},ds=challengeDays5(g),itemMode=g.module==='resource',items=itemMode?scope6(g.target).items.filter(x=>!leafDone(x)).slice(0,g.amount):[],total=itemMode?items.length:g.amount;let i=0;for(const d of ds){if(i>=total)break;const amount=Math.min(g.mxPace,total-i);dates[d]={amount,ids:itemMode?items.slice(i,i+amount).map(n=>n.id):[]};i+=amount;}return v9().plans[g.id]={dates,itemMode,created:today(),unallocated:itemMode?items.slice(i).map(x=>x.id):[]};};
 const prevRoute=route5;route5=function(m,t,d){if(m==='resource'&&scopes()[t]){const s=scopes()[t],g=v5().challenges.find(x=>x.target===t),items=scope6(t).items,ids=g?schedule9(g).dates?.[d]?.ids||[]:[],item=ids.map(id=>items.find(x=>x.id===id)).find(x=>x&&!leafDone(x))||items.find(x=>!leafDone(x));return prevRoute(m,s.resource+(item?'~'+item.id:''),d);}return prevRoute(m,t,d);};
 window.mxFinishGoal=function(mode='resource'){
  const isBook=mode==='book',rs=resourceRows(),bs=bookRows().filter(b=>!b.reader&&Number(b.pages)>Number(v2().books[b.id]||0)),entries=isBook?bs.map(b=>[b.id,b.title]):rs.map(r=>[r.id,r.title]);
  modal5(`<div class="modalhead5"><h2>${isBook?'Sayfa bazlı kitap hedefi':'Birden fazla alt bölümü bitir'}</h2><button onclick="close5()">×</button></div><form id="mx-finish" class="card"><label>${isBook?'Kitap':'Kaynak'}<select name="source">${opt5(entries,entries.some(x=>x[0]===(isBook?bookSelected:sourceSelected))?(isBook?bookSelected:sourceSelected):entries[0]?.[0])}</select></label>${isBook?'<p class="muted">Yalnızca toplam sayfa sayısı bilinen bitmemiş kitaplar.</p>':'<p class="muted">Bir veya daha fazla gerçek alt bölüm seç. Tamamlananlar tekrar planlanmaz.</p><div class="flex"><button type="button" data-all>Tümünü seç</button><button type="button" data-none>Temizle</button></div><div data-list style="max-height:300px;overflow:auto;border:1px solid var(--line);padding:10px;border-radius:12px"></div>'}<label>Hedef adı<input name="title" maxlength="120"></label><label>Başlangıç tarihi<input name="start" type="date" value="${today()}" required></label><label>Her çalışma gününde ${isBook?'sayfa':'bölüm'}<input type="number" name="pace" min="1" max="10000" step="1" value="1" required></label>${daysUI()}<p role="status"></p><button class="primary">Hedefi oluştur</button></form>`);
  const f=document.querySelector('#mx-finish'),list=f.querySelector('[data-list]'),status=f.querySelector('[role=status]');
  const chosen=()=>list?[...list.querySelectorAll('input:checked')].map(x=>x.value):[];
  function calc(){const source=f.elements.source.value,ids=chosen(),b=isBook?bs.find(x=>x.id===source):null,total=isBook?(b?Number(b.pages)-Number(v2().books[b.id]||0):0):ids.length,pace=Number(f.elements.pace.value),days=daysOf(f),n=Math.ceil(total/pace),dates=eligible(f.elements.start.value,n,days);status.textContent=total>0&&Number.isInteger(pace)&&pace>0&&dates.length===n?`${total} ${isBook?'sayfa':'bölüm'} · ${n} çalışma günü · Bitiş: ${dates.at(-1)}`:'Miktar, kaynak ve çalışma günlerini seç.';return {source,ids,b,total,pace,days,dates,n};}
  function load(){if(list){list.replaceChildren();const x=prevScope(f.elements.source.value);for(const n of x.items.filter(x=>!leafDone(x))){const label=document.createElement('label'),cb=document.createElement('input');label.style.cssText='display:flex;gap:9px;padding:5px;align-items:flex-start';cb.type='checkbox';cb.value=n.id;label.append(cb,document.createTextNode(n.title));list.append(label);}}calc();}
  f.elements.source.onchange=load;f.addEventListener('input',calc);if(list){f.querySelector('[data-all]').onclick=()=>{list.querySelectorAll('input').forEach(x=>x.checked=true);calc();};f.querySelector('[data-none]').onclick=()=>{list.querySelectorAll('input').forEach(x=>x.checked=false);calc();};}load();
  f.onsubmit=e=>{e.preventDefault();const p=calc(),start=f.elements.start.value;if(!p.total||!Number.isInteger(p.pace)||p.pace<1||!p.dates.length||p.dates.length!==p.n)return toast('Geçerli bir hedef seç.');const end=p.dates.at(-1),wanted=new Set(p.ids);
   if(v5().challenges.some(g=>g.module===mode&&g.start<=end&&g.end>=start&&(isBook?g.target===p.source:scope6(g.target).items.some(n=>wanted.has(n.id)))))return toast('Seçili içerikler mevcut hedefle çakışıyor.');
   const name=f.elements.title.value.trim()||(isBook?p.b.title+' · Bitirme':(prevScope(p.source).r?.title||'Kaynak')+' · Seçili bölümler'),id='mx-goal-'+uid();let target=p.source;
   if(!isBook){const sid='mx-scope-'+uid();target=p.source+'~'+sid;scopes()[target]={id:sid,resource:p.source,ids:p.ids,title:name};}
   const goal={id,title:name,module:mode,target,kind:'total',amount:p.total,start,end,rhythm:'all',time:'',alarm:'',mxPace:p.pace,mxWeekdays:p.days};v5().challenges.push(goal);schedule9(goal);close5();persist();
  };
 };
 const prevGoals=goalsView;goalsView=function(){return `<section class="card"><h3>Otomatik bitiş tarihi</h3><div class="flex"><button class="primary" onclick="mxFinishGoal('resource')">Seçili alt bölümleri bitir</button><button onclick="mxFinishGoal('book')">Sayfa bazlı kitap hedefi</button></div></section>`+prevGoals();};
 const prevResources=resourcesView;resourcesView=function(){return `<div class="flex"><button onclick="mxFinishGoal('resource')">Seçili alt bölümlerden hedef oluştur</button></div>`+prevResources();};
 const priorGoalDay=goalDay5;goalDay5=function(k,d){const g=v5().challenges.find(x=>x.id===dec5(k));if(g?.mxPace&&g.module==='book'){const p=schedule9(g).dates?.[d],amount=p?.amount||g.mxPace;return record5('book',g.target,d,amount,g.title);}return priorGoalDay(k,d);};
 const prevDelete=challengeDelete5;challengeDelete5=function(k){const id=dec5(k);prevDelete(k);if(!v5().challenges.some(g=>g.id===id)){delete v9().plans[id];save();}};
}
const originalStudioInstallMXGoals = installStudioP1;
installStudioP1 = function(){originalStudioInstallMXGoals();installPacedGoalsMX();};


/* Bilingual reader and flashcard interaction polish. */
function installBilingualCardsMX(){
 if(window.mxBilingualInstalled)return;window.mxBilingualInstalled=true;
 const css=document.createElement('style');css.textContent=`
 #readerContent10 .mx-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:.4rem 0}
 #readerContent10:not(.parallel10) .mx-pair{grid-template-columns:minmax(0,1fr)}
 #readerContent10 .mx-sentence{padding:.45rem;border-radius:8px;overflow-wrap:anywhere;min-width:0}
 #readerContent10 .mx-lit{background:#dbbb6150;box-shadow:inset 3px 0 #c8a04a}
 #fcstudio4 .face4{--mx-ink:#28243b;--mx-panel:#fffcfa;--mx-line:#dfd5e9;--mx-purple:#6c509f;--mx-green:#316c58;--mx-blue:#38688e;--mx-gold:#8a642f;background:linear-gradient(145deg,#f3edf9,#fffdf9 55%,#eaf4ed);color:var(--mx-ink);border-radius:24px;border:1px solid var(--mx-line);padding:clamp(15px,3vw,32px);gap:10px;min-width:0;text-align:left;overflow-wrap:anywhere;justify-content:flex-start}
 body[data-theme=dark] #fcstudio4 .face4{--mx-ink:#f3edf7;--mx-panel:#292d39;--mx-line:#504861;--mx-purple:#d4bdf9;--mx-green:#abd6b9;--mx-blue:#a9cdeb;--mx-gold:#e5c38d;background:linear-gradient(145deg,#30283e,#202831 58%,#253630)}
 #fcstudio4 .mx-field{background:var(--mx-panel);width:100%;box-sizing:border-box;border:1px solid var(--mx-line);border-left:3px solid var(--mx-purple);border-radius:12px;padding:10px 14px;color:var(--mx-ink);font-size:1rem;line-height:1.55;min-width:0;text-align:left;white-space:pre-wrap}
 #fcstudio4 .mx-field small{display:block;color:var(--mx-purple);font-size:.7rem;font-weight:700;letter-spacing:.07em;margin-bottom:4px;text-transform:uppercase}
 #fcstudio4 .mx-main{font-family:Georgia,serif;font-size:clamp(1.8rem,5vw,3.4rem);text-align:center;font-weight:650;background:transparent;border:0;color:var(--mx-purple)}
 #fcstudio4 .mx-tr{border-left-color:var(--mx-green)}#fcstudio4 .mx-tr small{color:var(--mx-green)}
 #fcstudio4 .mx-ex{border-left-color:var(--mx-blue);font-style:italic}#fcstudio4 .mx-ex small{color:var(--mx-blue);font-style:normal}
 #fcstudio4 .mx-meta{border-left-color:var(--mx-gold)}#fcstudio4 .mx-meta small{color:var(--mx-gold)}
 #fcstudio4 .mx-text{user-select:text;-webkit-user-select:text;cursor:text}
 .mx-voice{background:transparent!important;border-color:transparent!important;opacity:.75;float:right;font-size:.75rem!important}
 #fcstudio4 .mx-dock{width:100%;margin-top:auto;padding-top:12px;border-top:1px solid var(--mx-line)}
 #fcstudio4 .mx-dock .controls4,#fcstudio4 .mx-dock .ratings4{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;background:transparent;margin:4px 0}
 #fcstudio4 .mx-dock button{background:transparent!important;box-shadow:none!important;color:var(--mx-ink)!important;opacity:.8;min-height:36px;flex:1 1 60px;white-space:normal;font-size:.8rem}
 #fcstudio4 .mx-dock button:hover{opacity:1;background:var(--mx-panel)!important}
 #fcstudio4 .face4 .eyebrow{display:none}
 @media(max-width:650px){#readerContent10 .mx-pair{gap:4px}#readerContent10 .mx-sentence{font-size:.9em}}
 `;document.head.append(css);
 const H=x=>esc(String(x??'')),en=()=>s4().lang==='en-US'?'en-US':'en-GB';
 const tr=new Set(['Türkçe Anlam','Türkçe Yakın Telaffuz','Grammar & Usage Note (TR — Longman style)','Reader Translation']);
 const ambiguous=new Set(['Note','Usage Difference','Root / Etymology','Category','Source','Usage / Collocation','Similarity','Example Sentence']);
 const mute=new Set(['Image URL','IPA (BrE)']);
 function say(parts,rate=1){
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return toast('Seslendirme desteklenmiyor.');
  speechSynthesis.cancel();
  for(const p of parts){if(!p.text?.trim())continue;const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()===p.lang.toLowerCase())||speechSynthesis.getVoices().find(v=>v.lang.split('-')[0]===p.lang.split('-')[0]);const u=new SpeechSynthesisUtterance(p.text);u.lang=p.lang;u.rate=rate;if(voice)u.voice=voice;speechSynthesis.speak(u);}
 }
 function partsFor(v,f){const text=String(v),lang=tr.has(f)?'tr-TR':en();if(f==='Example Sentence'){const m=text.match(/[.!?]\s*[,|]\s*(?=[A-Za-zÇĞİÖŞÜçğıöşü])/);if(m){const i=m.index+1;return [{text:text.slice(0,i),lang:en()},{text:text.slice(i+1).replace(/^[,|\s]+/,''),lang:'tr-TR'}];}}return [{text,lang}];}
 const oldField=fieldHtml4;fieldHtml4=function(w,f){const v=label4(w,f);if(!v)return '';if(f==='Image URL')return oldField(w,f);
  const kind=f==='Word / Phrase'?'mx-main':tr.has(f)?'mx-tr':/Example|Context/.test(f)?'mx-ex':/POS|IPA|Root|Prefix|Suffix|Source|Category/.test(f)?'mx-meta':'',parts=partsFor(v,f);
  return `<div class="fcfield4 mx-field ${kind}" data-mx-field="${H(f)}">${f==='Word / Phrase'?'':`<small>${H(fLabel4(f))}</small>`}${parts.map(p=>`<div class="mx-part" lang="${p.lang}">${mute.has(f)?'':ambiguous.has(f)&&parts.length===1?`<button type="button" class="mx-voice" data-mx-voice="tr-TR" aria-label="Türkçe seslendir">TR ◖</button><button type="button" class="mx-voice" data-mx-voice="${en()}" aria-label="İngilizce seslendir">EN ◖</button>`:`<button type="button" class="mx-voice" data-mx-voice="${p.lang}" aria-label="Seslendir">${p.lang.startsWith('tr')?'TR':'EN'} ◖</button>`}<div class="mx-text">${H(p.text)}</div></div>`).join('')}</div>`;
 };
 voice4=function(f){const w=cur4();if(!w)return;const visible=side4?s4().back:s4().front,field=f||(s4().mode==='listen'?s4().write:visible.find(x=>!mute.has(x)&&label4(w,x)));if(!field||mute.has(field))return;const parts=partsFor(label4(w,field),field);if(ambiguous.has(field)&&parts.length===1)return toast('Bu alanda TR veya EN sesini seç.');say(parts);};
 function seg(t){return typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(t)].map(x=>x.segment.trim()).filter(Boolean):String(t).match(/[^.!?]+(?:[.!?]+|$)/g)||[t];}
 const oldSpeak=readerSpeak9;readerSpeak9=function(){const a=readerCurrent10();if(a?.b.language==='tr'&&a.p.text)return say(seg(a.p.text).map(text=>({text,lang:'tr-TR'})),Number(v9().readerRate)||1);return oldSpeak();};
 parallelHtml10=function(p){const parallel=v10().readerMode==='parallel',a=readerCurrent10(),sourceTR=a?.b.language==='tr';return `<div class="readerColumns10 ${parallel?'parallel10':''}" id="readerContent10">${readerParas10(p).flatMap((t,i)=>seg(t).map((sentence,j)=>{const id=i+'-'+j,translation=v10().translations[readerNorm10(sentence)]||'';return `<div class="mx-pair">${parallel&&!sourceTR?`<div class="mx-sentence trPara10" data-para="${i}" data-mx-pair="${id}" lang="tr-TR"><button class="mx-voice" data-mx-voice="tr-TR">TR ◖</button><span class="mx-translation">${H(translation||'Cümleyi seç · TR')}</span></div>`:''}<div class="readerPara10 mx-sentence" data-para="${i}" data-mx-pair="${id}" lang="${sourceTR?'tr-TR':en()}"><button class="mx-voice" data-mx-voice="${sourceTR?'tr-TR':en()}">◖</button><span class="mx-source">${sourceTR?H(sentence):tokens10(sentence)}</span></div></div>`;})).join('')}</div>`;};
 const oldContext=readerContext10;readerContext10=function(el){return el?.closest('.mx-sentence')?.querySelector('.mx-source')?.textContent||oldContext(el);};
 let pinned=null,pageKey='',timer=null;const pending=new Set();
 function highlight(id){document.querySelectorAll('[data-mx-pair]').forEach(el=>el.classList.toggle('mx-lit',el.dataset.mxPair===id));}
 async function ensure(id){if(!id)return;const a=readerCurrent10(),source=document.querySelector(`.readerPara10[data-mx-pair="${id}"] .mx-source`),target=document.querySelector(`.trPara10[data-mx-pair="${id}"] .mx-translation`);if(!a||!source||!target)return;const t=source.textContent,key=a.key+'|'+id,cached=v10().translations[readerNorm10(t)];if(cached){target.textContent=cached;return;}if(pending.has(key))return;if(!v10().remote&&!window.Translator){target.textContent='Çeviri için okuyucu ayarlarını aç.';return;}pending.add(key);target.textContent='Çevriliyor…';try{const result=await translate10(t);if(target.isConnected&&readerCurrent10()?.key===a.key)target.textContent=result;}catch(e){if(target.isConnected)target.textContent=e.message||'Çeviri alınamadı.';}finally{pending.delete(key);}}
 translatePage10=async function(){const first=document.querySelector('.readerPara10[data-mx-pair]');if(first)await ensure(first.dataset.mxPair);};
 document.addEventListener('pointerover',e=>{const el=e.target.closest?.('.mx-sentence');if(el&&!el.contains(e.relatedTarget))highlight(el.dataset.mxPair);});
 document.addEventListener('pointerout',e=>{const el=e.target.closest?.('.mx-sentence');if(el&&!el.contains(e.relatedTarget))highlight(pinned);});
 document.addEventListener('pointerup',e=>{const el=e.target.closest?.('.mx-sentence');if(!el||e.target.closest('button'))return;pinned=el.dataset.mxPair;highlight(pinned);ensure(pinned);clearTimeout(timer);timer=setTimeout(()=>{pinned=null;highlight(null);},3500);});
 document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-mx-voice]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();const block=btn.closest('.mx-part,.mx-sentence'),text=block?.querySelector('.mx-text,.mx-source,.mx-translation')?.textContent;if(text&&!/^Cümleyi seç|^Çevriliyor/.test(text))say([{text,lang:btn.dataset.mxVoice}]);},true);
 let pop=null;function closePop(){pop?.remove();pop=null;}
 function selection(){
  const s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount)return;const a=s.anchorNode?.parentElement?.closest('.mx-part'),b=s.focusNode?.parentElement?.closest('.mx-part');if(!a||a!==b)return;
  const value=s.toString().trim().replace(/^[\s.,!?;:"“”()\[\]]+|[\s.,!?;:"“”()\[\]]+$/g,'');if(!value||value.length>160||!/[\p{L}]/u.test(value))return;
  closePop();const rect=s.getRangeAt(0).getBoundingClientRect(),isTR=a.lang.startsWith('tr'),context=a.querySelector('.mx-text')?.textContent||'';
  const panel=document.createElement('aside');panel.className='card';panel.style.cssText='position:fixed;z-index:999999;width:min(360px,calc(100vw - 24px));box-sizing:border-box;max-height:80vh;overflow:auto;box-shadow:0 12px 36px #0003';panel.innerHTML=`<h3>${H(value)}</h3><form><label>İngilizce ifade<input name="word" required value="${H(isTR?'':value)}" maxlength="160"></label><label>Türkçe anlam<input name="meaning" required value="${H(isTR?value:'')}" maxlength="600"></label><label>Kelime türü<input name="pos" maxlength="40"></label><p role="status"></p><div class="flex"><button type="submit" class="primary">Flashcard'a ekle</button><button type="button" data-existing hidden>Mevcut kartı aç</button><button type="button" data-close>Kapat</button></div></form>`;
  pop=panel;(document.fullscreenElement||document.body).append(panel);panel.style.left=Math.max(12,Math.min(rect.left,innerWidth-panel.offsetWidth-12))+'px';panel.style.top=Math.max(12,Math.min(rect.bottom+6,innerHeight-panel.offsetHeight-12))+'px';
  const f=panel.querySelector('form'),word=f.elements.word,existing=f.querySelector('[data-existing]'),add=f.querySelector('[type=submit]'),status=f.querySelector('[role=status]'),dups=()=>findWords10(word.value.trim());
  function sync(){const found=dups();add.disabled=!word.value.trim()||!!found.length;existing.hidden=!found.length;status.textContent=found.length?'Bu kelime arşivde zaten var. Tekrar eklenemez.':'Yeni ifade · Türkçe anlamı doğrula.';}word.oninput=sync;sync();
  f.querySelector('[data-close]').onclick=closePop;existing.onclick=()=>{const found=dups();if(found.length){closePop();choose4(key4(found[0]));}};
  f.onsubmit=e=>{e.preventDefault();if(dups().length){sync();return;}const text=word.value.trim(),meaning=f.elements.meaning.value.trim();if(!text||!meaning)return;S.words.push({'Word / Phrase':text,'Türkçe Anlam':meaning,POS:f.elements.pos.value.trim(),Source:'Flashcard selection','Example Sentence':!isTR&&/Example|Context/.test(a.closest('.mx-field')?.dataset.mxField||'')?context:''});refresh4();save();closePop();window.getSelection()?.removeAllRanges();toast('Flashcard eklendi.');};
 }
 document.addEventListener('pointerup',e=>{if(e.target.closest?.('.mx-text'))selection();});
 document.addEventListener('keyup',e=>{if(e.shiftKey&&e.key.startsWith('Arrow'))selection();});
 document.addEventListener('keydown',e=>{if(pop&&e.key==='Escape'){closePop();e.preventDefault();e.stopImmediatePropagation();}},true);
 const oldRender=render;render=function(){closePop();oldRender();const key=readerCurrent10()?.key||'';if(key!==pageKey){pinned=null;pageKey=key;}const face=document.querySelector('#fcstudio4 .face4');if(!face||s4().mode!=='flash')return;
  face.querySelector(':scope > .eyebrow')?.remove();face.querySelectorAll(':scope > small').forEach(n=>{if(/Kartı çevirmek/.test(n.textContent))n.remove();});face.removeAttribute('onclick');face.removeAttribute('onkeydown');face.setAttribute('role','group');
  const studio=face.closest('#fcstudio4'),dock=document.createElement('div');dock.className='mx-dock';for(const c of ['.controls4','.ratings4']){const el=studio.querySelector(c);if(el)dock.append(el);}face.append(dock);face.onclick=e=>{if(e.target.closest('button,input,select,a,.mx-field,.mx-dock')||window.getSelection()?.toString().trim())return;flip4();};
 };
}
const originalStudioInstallMXCards = installStudioP1;
installStudioP1 = function(){originalStudioInstallMXCards();installBilingualCardsMX();};


/* Progressive path studio, media, companion. Code only. */
function pathStatusMX(rows,strict=true){
 let pending=false;
 return rows.map(x=>{const state=x.done?'done':strict&&pending?'locked':'open';if(!x.done)pending=true;return {...x,state};});
}
function pathVideoMX(raw){
 const m=String(raw||'').trim().match(/^https:\/\/([a-z0-9.-]+)(?::443)?(\/[^?#\s]*)?(?:\?([^#\s]*))?(?:#[^\s]*)?$/i);
 if(!m)return null;
 const host=m[1].toLowerCase().replace(/^www\./,''),path=m[2]||'/',params=Object.create(null);
 try{for(const p of (m[3]||'').split('&')){const [k,...v]=p.split('=');params[decodeURIComponent(k)]=decodeURIComponent(v.join('='));}}catch{return null;}
 if(['youtube.com','m.youtube.com','youtube-nocookie.com','youtu.be'].includes(host)){
   const id=host==='youtu.be'?path.split('/')[1]:params.v||path.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
   if(!/^[\w-]{11}$/.test(id||''))return null;
   const rawTime=params.start||params.t||'',h=rawTime.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
   const t=/^\d+$/.test(rawTime)?+rawTime:h?(+h[1]||0)*3600+(+h[2]||0)*60+(+h[3]||0):0;
   return {kind:'embed',provider:'YouTube',src:'https://www.youtube-nocookie.com/embed/'+id+(t?'?start='+t:''),url:'https://www.youtube.com/watch?v='+id};
 }
 if(['dailymotion.com','dai.ly'].includes(host)){
   const id=host==='dai.ly'?path.split('/')[1]:path.match(/^\/(?:embed\/)?video\/([a-z0-9]+)/i)?.[1];
   if(!/^[a-z0-9]{5,20}$/i.test(id||''))return null;
   return {kind:'embed',provider:'Dailymotion',src:'https://www.dailymotion.com/embed/video/'+id,url:'https://www.dailymotion.com/video/'+id};
 }
 if(/\.(mp4|webm|ogv|mp3|wav|m4a|ogg)$/i.test(path))return {kind:/\.(mp3|wav|m4a|ogg)$/i.test(path)?'audio':'video',src:String(raw).trim(),url:String(raw).trim(),provider:'Medya'};
 return null;
}
function installPalaceMX(){
 if(window.mxPalaceReady)return;window.mxPalaceReady=true;
 const H=x=>esc(String(x??'')),K=x=>enc5(String(x??'')),D=x=>dec5(x),P=()=>S.mxPalace??={category:'',nodes:{},media:{},notes:{},evidence:{},strict:true,zoom:1,sound:true};
 const p=P();for(const k of ['nodes','media','notes','evidence'])p[k]??={};
 const glyphs=['M3 4h5a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H3z M21 4h-5a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h5z','M4 4h16v16H4z M9 8l6 4-6 4z','M3 12v-2a9 9 0 0 1 18 0v2 M3 12h4v8H5a2 2 0 0 1-2-2z M21 12h-4v8h2a2 2 0 0 0 2-2z','M4 12l5 5L20 6','M7 10V7a5 5 0 0 1 10 0v3 M5 10h14v11H5z','M4 8v8 M7 5v14 M17 5v14 M20 8v8 M7 12h10','M5 4h14v16H5z M8 8h8 M8 12h8','M12 3v18 M3 12h18 M5 5l14 14 M19 5L5 19'];
 const icon=(i,n=24)=>`<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="${glyphs[i]||glyphs[0]}"/></svg>`;
 function tone(t){t=String(t).toLowerCase();return /audio|listen|effortless|dinleme/.test(t)?['#597eab',2]:/course|video|kurs/.test(t)?['#8266b5',1]:/vocab|root|kelime/.test(t)?['#3e8b76',6]:/p90|pole|swim|spor/.test(t)?['#b5677e',5]:/book|reading|story|kitap/.test(t)?['#ad844e',0]:['#8175ae',0];}
 const css=document.createElement('style');css.textContent=`
 .mx-palace{min-width:0}.mx-palace-hero{padding:24px;border-radius:24px;background:linear-gradient(130deg,#eae0f3,#e0eee5);color:#3d334d;display:flex;align-items:center;justify-content:space-between;gap:15px;margin:10px 0 18px}
 body[data-theme=dark] .mx-palace-hero{background:linear-gradient(130deg,#42354f,#2b3d35);color:#f3edf7}
 .mx-palace-hero h2{font-family:Georgia,serif;font-size:clamp(1.4rem,3vw,2.2rem);margin:5px 0}.mx-palace-hero p{max-width:62ch;line-height:1.5}
 .mx-palace-hero .mimo{width:76px!important;height:auto!important;max-width:20%;min-width:48px}
 .mx-palace-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(210px,100%),1fr));gap:15px}
 .mx-palace-tile{display:flex!important;flex-direction:column;align-items:flex-start;gap:10px;text-align:left!important;white-space:normal!important;min-width:0;min-height:124px;padding:17px!important;border-radius:18px!important;background:var(--paper)!important;border:1px solid var(--line)!important;box-shadow:0 5px 0 color-mix(in srgb,var(--mx-color) 25%,var(--line))!important;color:var(--ink)!important}
 .mx-palace-tile b{overflow-wrap:anywhere;line-height:1.45;font-size:1.03rem}.mx-palace-tile:hover{transform:translateY(-2px)}
 .mx-palace-icon{display:grid;place-items:center;width:42px;height:42px;background:color-mix(in srgb,var(--mx-color) 17%,var(--paper));border-radius:12px;color:var(--mx-color)}
 .mx-palace-bar{height:6px;background:var(--line);border-radius:8px;overflow:hidden;width:100%}.mx-palace-bar i{display:block;height:100%;background:var(--mx-color,#8272b4)}
 .mx-palace-tools,.mx-crumb{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0}.mx-crumb button{background:transparent!important;border:0!important;white-space:normal!important}
 .mx-road-view{overflow:auto;position:relative;max-height:68vh;min-height:220px;overscroll-behavior:contain;border:1px solid var(--line);border-radius:23px;cursor:grab;background:radial-gradient(ellipse at 20% 25%,#8eae9620,transparent 70%),radial-gradient(ellipse at 90% 80%,#a78dc620,transparent 65%),var(--bg)}
 .mx-road{position:relative;min-width:290px;padding:24px 14px 35px;isolation:isolate}.mx-road svg.mx-road-line{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
 .mx-stop{min-height:105px;display:grid;grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr);align-items:center;gap:10px;position:relative}
 .mx-stop[data-side=left] .mx-stop-label{grid-column:1;text-align:right}.mx-stop[data-side=right] .mx-stop-label{grid-column:3;text-align:left}.mx-stop-label{grid-row:1;overflow-wrap:anywhere;min-width:0;border:1px solid var(--line);border-radius:14px;padding:10px;background:var(--paper);font-size:.88rem;box-shadow:0 4px 12px #2921360c}
 .mx-stop-label button{background:transparent!important;border:0!important;padding:0!important;white-space:normal!important;text-align:inherit;color:var(--ink)!important}.mx-stop-label small{display:block;font-size:.74rem;margin-top:4px;color:var(--muted)}
 .mx-stop .mx-node{grid-column:2;grid-row:1;justify-self:center;width:63px;height:57px;border-radius:22px!important;display:grid;place-items:center;background:linear-gradient(145deg,color-mix(in srgb,var(--mx-color) 74%,white),var(--mx-color))!important;color:white!important;border:1px solid color-mix(in srgb,var(--mx-color) 70%,white)!important;box-shadow:0 8px 0 color-mix(in srgb,var(--mx-color) 65%,#30253b),0 13px 18px #30253b25!important;transform:rotate(-9deg);padding:0!important}
 .mx-stop[data-state=done] .mx-node{--mx-color:#478d74}.mx-stop[data-state=locked] .mx-node{--mx-color:#8a939f;opacity:.7}.mx-stop[data-state=locked] .mx-stop-label{opacity:.65}
 .mx-stop .mx-node:hover{transform:translateY(-3px) rotate(-9deg)}.mx-node:focus-visible{outline:3px solid #d1a24b;outline-offset:4px}
 .mx-next-cat{position:absolute;top:-7px;left:calc(50% + 27px);width:56px;pointer-events:none;z-index:2;animation:mx-cat-arrive .5s ease-out,mx-cat-breathe 3s ease-in-out .6s infinite}.mx-stop[data-side=right] .mx-next-cat{left:auto;right:calc(50% + 27px)}.mx-next-cat .mimo{width:100%!important;height:auto!important}
 .mx-floating-cat{position:fixed;right:16px;bottom:85px;width:58px;height:66px;padding:0!important;border:0!important;background:transparent!important;z-index:8989;filter:drop-shadow(0 4px 4px #0002)}.mx-floating-cat .mimo{width:100%!important;height:auto!important;animation:mx-cat-breathe 3s ease-in-out infinite}.mx-floating-cat[data-win=true] .mimo{animation:mx-cat-hop .7s ease-in-out 2}
 .mx-lesson-layout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:14px}.mx-lesson-layout .card{min-width:0;overflow-wrap:anywhere}.mx-lesson-layout textarea{width:100%;box-sizing:border-box}
 .mx-lesson-player{width:100%;aspect-ratio:16/9;border:0;border-radius:14px;background:#20202a;display:block}
 @keyframes mx-cat-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes mx-cat-arrive{from{transform:translateX(-20px);opacity:.3}to{transform:none;opacity:1}}@keyframes mx-cat-hop{0%,100%{transform:none}45%{transform:translateY(-14px) rotate(-6deg)}}
 @media(max-width:720px){.mx-stop{grid-template-columns:minmax(0,1fr) 58px minmax(0,1fr);gap:5px;min-height:112px}.mx-stop .mx-node{width:49px;height:45px;border-radius:16px!important}.mx-stop-label{padding:6px;font-size:.8rem}.mx-next-cat{width:42px}.mx-lesson-layout{grid-template-columns:minmax(0,1fr)}.mx-floating-cat{bottom:145px;width:46px;right:10px}}
 @media(prefers-reduced-motion:reduce){.mx-palace *, .mx-floating-cat *{animation:none!important;transition:none!important}}
 `;document.head.append(css);
 const cat=()=>catSvg();
 let pet=null,petTimer=null,blobURL=null,localVideo=null;
 function meow(kind='step'){
   if(pet){pet.dataset.win=kind==='win'?'true':'false';clearTimeout(petTimer);petTimer=setTimeout(()=>{if(pet)pet.dataset.win='false';},1600);}
   if(!P().sound||!v2().sound)return;
   try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=window.musesAudio||(window.musesAudio=new A());if(c.state==='suspended')c.resume().catch(()=>{});
     const seq=kind==='win'?[[650,980,520,.23],[780,1090,600,.29]]:kind==='focus'?[[360,580,300,.3]]:[[510,790,410,.21]];
     let t=c.currentTime;for(const [a,b,d,len] of seq){const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(a,t);o.frequency.exponentialRampToValueAtTime(b,t+len*.4);o.frequency.exponentialRampToValueAtTime(d,t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.037,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+len+.02);t+=len+.075;}
   }catch{}
 }
 window.mxPalaceReact=meow;
 window.mxCatSound=()=>{P().sound=!P().sound;save();if(P().sound)meow();render();};
 window.mxCatHide=()=>{P().hideCat=!P().hideCat;save();render();};
 function paintCat(){if(!pet){pet=document.createElement('button');pet.type='button';pet.className='mx-floating-cat';pet.title='Mimo · ses ve görünüm';pet.setAttribute('aria-label','Mimo ayarları');pet.onclick=()=>{modal5(`<div class="modalhead5"><h2>Mimo</h2><button onclick="close5()">×</button></div><p>Kediye benzeyen sentezlenmiş kısa tepkiler.</p><button onclick="close5();mxCatSound()">${P().sound?'Sesi kapat':'Sesi aç'}</button><button onclick="close5();mxCatHide()">Gizle</button>`);meow();};}
   const parent=document.fullscreenElement||document.body;if(pet.parentNode!==parent)parent.append(pet);pet.hidden=!!P().hideCat;if(!pet.childElementCount||pet.dataset.outfit!==String(v2().outfit)){pet.innerHTML=cat();pet.dataset.outfit=String(v2().outfit);}}
 function bar(a,b){return `<div class="mx-palace-bar"><i style="width:${b?Math.min(100,100*a/b):0}%"></i></div>`;}
 function hero(t,s){return `<div class="mx-palace-hero"><div><small>MUSES · MEMORY PALACE</small><h2>${H(t)}</h2><p>${H(s)}</p></div>${P().hideCat?'':cat()}</div>`;}
 function tile(t,s,c,i,action,a=0,b=0){return `<button class="mx-palace-tile" style="--mx-color:${c}" onclick="${action}"><span class="mx-palace-icon">${icon(i)}</span><b>${H(t)}</b><small>${H(s)}</small>${b?bar(a,b):''}</button>`;}
 function road(rows,color,act){
   const all=pathStatusMX(rows,P().strict!==false),page=Math.min(Math.max(0,P().page||0),Math.max(0,Math.ceil(all.length/18)-1)),start=page*18,next=all.findIndex(x=>!x.done);
   return `<div class="mx-palace-tools"><button onclick="mxPalacePage(-1)" ${page?'':'disabled'}>‹</button><small>${all.length?start+1:0}–${Math.min(start+18,all.length)} / ${all.length}</small><button onclick="mxPalacePage(1)" ${start+18>=all.length?'disabled':''}>›</button><button onclick="mxPalaceZoom(-.1)">−</button><button onclick="mxPalaceZoom(0)">%${Math.round((P().zoom||1)*100)}</button><button onclick="mxPalaceZoom(.1)">+</button><button onclick="mxPalaceStrict()">${P().strict!==false?'Sıralı · kilitli':'Serbest erişim'}</button></div><div class="mx-road-view" tabindex="0" aria-label="Öğrenme yolu"><div class="mx-road" style="--mx-color:${color};zoom:${P().zoom||1}"><svg class="mx-road-line" aria-hidden="true"></svg>${all.slice(start,start+18).map((x,i)=>{const cmd=act(x),status=x.state==='done'?'Tamamlandı':x.state==='locked'?'Kilitli · önceki durak':x.started?'Devam ediyor':'Açık';return `<div class="mx-stop" data-state="${x.state}" data-side="${i%2?'right':'left'}" style="transform:translateX(${Math.sin(i*1.5)*12}px)"><button class="mx-node" aria-label="${H(x.title+' · '+status)}" onclick="${cmd}">${icon(x.state==='done'?3:x.state==='locked'?4:x.icon||0)}</button><div class="mx-stop-label"><button onclick="${cmd}"><b>${H(x.title)}</b><small>${H(x.sub||'')}</small><small>${status}</small></button></div>${start+i===next&&!P().hideCat?`<div class="mx-next-cat">${cat()}</div>`:''}</div>`;}).join('')||'<p>Bu dalda kayıtlı durak yok.</p>'}</div></div>`;
 }
 window.mxPalacePage=n=>{P().page=Math.max(0,(P().page||0)+n);render();};
 window.mxPalaceZoom=n=>{P().zoom=n?Math.max(.7,Math.min(1.5,Math.round(((P().zoom||1)+n)*10)/10)):1;save();render();};
 window.mxPalaceStrict=()=>{P().strict=P().strict===false;save();render();};
 function lineage(tree,id,chain=[]){for(const n of tree){const a=[...chain,n];if(n.id===id)return a;const b=lineage(n.children||[],id,a);if(b)return b;}return [];}
 function select(rid,nid=''){const r=resourceRows().find(x=>x.id===rid);if(!r||nid&&!findNode6(sourceTree(r),nid))return false;sourceSelected=rid;P().nodes[rid]=nid;P().category=r.type||'Diğer';P().page=0;P().classic=false;save();return true;}
 window.mxPalaceCategory=k=>{sourceSelected='';P().category=D(k);P().page=0;sourceFilter='';save();go('resources');};
 window.mxPalaceOpen=(rk,nk='',locked=false)=>{if(locked&&P().strict!==false)return toast('Önce önceki durağı tamamla. Serbest erişim ile çalışma sırasını değiştirebilirsin.');if(select(D(rk),D(nk))){meow('step');go('resources');window.scrollTo(0,0);}};
 window.mxPalaceClassic=()=>{P().classic=!P().classic;save();render();};
 const oldSourceOpen=sourceOpen6;sourceOpen6=function(id){if(!P().classic&&select(id))return go('resources');return oldSourceOpen(id);};
 const oldRoute=route5;route5=function(m,t,d){if(m==='resource'){const [rid,nid='']=String(t).split('~');if(select(rid,nid)){selected=d||today();calMonth=selected.slice(0,7);return go('resources');}}return oldRoute(m,t,d);};
 function node(rid,nid){const r=resourceRows().find(x=>x.id===rid);return {r,n:r&&nid?findNode6(sourceTree(r),nid):null};}
 const target=(r,n)=>r.id+(n?'~'+n.id:'');
 function getMedia(r,n){const key=target(r,n);if(Object.hasOwn(P().media,key))return P().media[key];const obj=n||r;
   // Public publisher metadata: exact course and lesson-title matches only.
   const published=[
     ['Türkçe - İngilizce CÜMLE ALIŞTIRMALARI','https://www.youtube.com/watch?v=v2PfdZ-SZu8'],
     ['İngilizce Cümle Alıştırmaları - Tüm Zamanlar - ÇEVİRİ TAKTİKLERİ','https://www.youtube.com/watch?v=lDRnktYqfHo'],
     ['İngilizce Uzun Cümleler Kurma Tekniği - UYGULAMALI','https://www.youtube.com/watch?v=aPOOmVJd-vM']
   ];
   if(n&&/Bahrom.*Alıştırmalar/i.test(r.title)){const name=String(n.title).replace(/^Ders\s+\d+\s+—\s+DERS:\s*\d+\s*-\s*/i,'').trim();const match=published.find(([title])=>title===name);if(match)return pathVideoMX(match[1]);}
   for(const f of ['video','videoUrl','videoURL','url','URL','link','note','detail']){for(const u of typeof obj[f]==='string'?(obj[f].match(/https:\/\/[^\s<>"']+/g)||[]):[]){const m=pathVideoMX(u.replace(/[),.;]+$/,''));if(m)return m;}}return null;}
 window.mxLessonAdd=(rk,nk)=>{const {r,n}=node(D(rk),D(nk));if(!r)return;const key=target(r,n),m=getMedia(r,n);modal5(`<div class="modalhead5"><h2>${H(n?.title||r.title)}</h2><button onclick="close5()">×</button></div><form id="mx-lesson-form"><label>Video bağlantısı<input type="url" name="url" value="${H(m?.url||'')}" placeholder="YouTube, Dailymotion, MP4"></label><label>veya yetkili yerel video<input type="file" name="file" accept="video/*,.mp4,.webm"></label><p>Gömme izni gerekir. Yerel video çevrimdışı çalışabilir.</p><button class="primary">Kaydet</button><p role="status"></p></form>`);
   const f=document.querySelector('#mx-lesson-form');f.onsubmit=async e=>{e.preventDefault();const button=f.querySelector('.primary');button.disabled=true;try{const file=f.elements.file.files[0];let m;if(file){if(file.size>300*1024*1024)throw Error('300 MB dosya sınırı.');const estimate=await navigator.storage?.estimate?.();if(estimate?.quota&&estimate.quota-estimate.usage<file.size*1.15)throw Error('Depolama alanı yetersiz.');const k='mx-lesson-'+uid();await put6('media',k,file);m={kind:'local',key:k,name:file.name};}else{m=pathVideoMX(f.elements.url.value);if(!m)throw Error('Geçerli desteklenen HTTPS medya adresi gir.');}P().media[key]=m;save();close5();render();}catch(err){f.querySelector('[role=status]').textContent=err.message;button.disabled=false;}};};
 window.mxLessonRemove=k=>{if(!confirm('Video bağlantısı kaldırılsın mı? Çalışma kayıtları korunur.'))return;P().media[D(k)]=null;save();render();};
 window.mxLessonPlay=k=>{const key=D(k),[rid,nid='']=key.split('~'),{r,n}=node(rid,nid),m=r&&getMedia(r,n);if(m?.kind!=='embed')return;const box=[...document.querySelectorAll('[data-mx-lesson]')].find(e=>e.dataset.mxLesson===k);if(!box||box.querySelector('iframe'))return;const frame=document.createElement('iframe');frame.className='mx-lesson-player';frame.src=m.src;frame.title=n?.title||r.title;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';box.replaceChildren(frame);};
 function media(r,n){const k=K(target(r,n)),m=getMedia(r,n);return `<section class="card"><h3>${icon(1,18)} Ders videosu</h3>${m?`<div data-mx-lesson="${k}">${m.kind==='embed'?`<button class="primary" onclick="mxLessonPlay('${k}')">▶ Uygulama içinde oynat</button>`:m.kind==='local'?`<video class="mx-lesson-player" controls playsinline preload="metadata"></video><small>Yerel video</small>`:m.kind==='audio'?`<audio controls preload="none" src="${H(m.src)}"></audio>`:`<video class="mx-lesson-player" controls playsinline preload="none" src="${H(m.src)}"></video>`}</div><p class="muted"> ${m.kind==='local'?'Yerel dosya':'İnternet ve yayıncı gömme izni gerekir.'}</p>`:'<p class="muted">Doğrulanmış ders videosu henüz kayıtlı değil.</p>'}<div class="mx-palace-tools"><button onclick="mxLessonAdd('${K(r.id)}','${K(n?.id||'')}')">${m?'Değiştir':'Video / bağlantı ekle'}</button>${m?`<button onclick="mxLessonRemove('${k}')">Kaldır</button>`:''}</div></section>`;}
 window.mxPalaceFocus=k=>{const t=D(k);if(typeof window.mxStartLinkedFocus==='function')window.mxStartLinkedFocus('resource',t);else if(typeof window.toggleActivityP1==='function')window.toggleActivityP1('resource',K(t));else toast('Pomodoro modülü bulunamadı.');};
 window.mxPalaceStop=k=>{const t=D(k);if(typeof window.mxStopLinkedFocus==='function'&&window.mxStopLinkedFocus('resource',t)){for(const e of document.querySelectorAll('[data-mx-path-time]'))if(e.dataset.mxPathTime===k)e.textContent=fmtTime9(seconds9(today(),'resource',t));toast('Çalışma süresi kaydedildi.');}else toast('Bu durağın çalışan sayacı yok.');};
 window.mxPalaceComplete=(rk,nk)=>{const {r,n}=node(D(rk),D(nk));if(!r||!n||n.children?.length||leafDone(n))return;const key=target(r,n);modal5(`<div class="modalhead5"><h2>Gerçek çalışma kaydı</h2><button onclick="close5()">×</button></div><p>${H(n.title)}</p><form id="mx-palace-complete"><label>Çalışma türü<select name="method"><option>Alıştırma çözdüm</option><option>Okudum ve hatırladım</option><option>İzledim / dinledim ve pratik yaptım</option><option>Yazma / konuşma pratiği</option><option>Uygulama dışında çalıştım</option></select></label><label>Yaptığın çalışma<textarea name="note" required minlength="3" maxlength="4000"></textarea></label><label><input name="confirmed" type="checkbox" required> Bu bölümü gerçekten çalıştım.</label><p class="muted">Pomodoro veya video oynatma tek başına tamamlanma sayılmaz.</p><button class="primary">Kaydet ve sonraki durağı aç</button></form>`);
   const f=document.querySelector('#mx-palace-complete');f.onsubmit=e=>{e.preventDefault();const note=f.elements.note.value.trim();if(note.length<3||!f.elements.confirmed.checked||leafDone(n))return;P().evidence[key]={method:f.elements.method.value,note,date:today(),reported:true};v2().chapterDone[n.id]=true;s4().chapterDates[n.id]=today();v6().resourceStarted[r.id]=true;if(typeof window.mxStopLinkedFocus==='function')window.mxStopLinkedFocus('resource',key);const chain=lineage(sourceTree(r),n.id),parent=chain.at(-2),siblings=parent?parent.children:sourceTree(r),next=siblings.findIndex(x=>leaves([x]).some(y=>!leafDone(y)));select(r.id,parent?.id||'');P().page=next<0?0:Math.floor(next/18);save();close5();render();meow('win');toast('Çalışma kaydedildi. Sonraki uygun durak açıldı.');};};
 window.mxPalaceUndo=(rk,nk)=>{const {r,n}=node(D(rk),D(nk));if(!r||!n||n.children?.length||!confirm('Tamamlanma geri alınsın mı? Süre kaydı korunur.'))return;delete P().evidence[target(r,n)];v2().chapterDone[n.id]=false;delete s4().chapterDates[n.id];persist();};
 window.mxLessonNote=(k,value)=>{P().notes[D(k)]=String(value).slice(0,50000);save();};
 function detail(r,n){const k=target(r,n),e=P().evidence[k];return `<div class="mx-lesson-layout"><div>${media(r,n)}<section class="card"><h3>Çalışma</h3><p>${H(n.note||'Kaynakta süre belirtilmemiş.')}</p>${n.detail?`<p>${H(n.detail)}</p>`:''}<p>Bugün kayıtlı süre: <b data-mx-path-time="${K(k)}">${H(fmtTime9(seconds9(today(),'resource',k)))}</b></p><div class="mx-palace-tools">${leafDone(n)?`<button onclick="mxPalaceUndo('${K(r.id)}','${K(n.id)}')">Tamamlanmayı geri al</button>`:`<button class="primary" onclick="mxPalaceComplete('${K(r.id)}','${K(n.id)}')">Çalışmayı kaydet ve bitir</button>`}</div>${e?`<p>${H(e.method)} · ${H(e.date)}</p><p>${H(e.note)}</p>`:leafDone(n)?'<p>Önceden tamamlanmış kayıt.</p>':''}</section></div><section class="card"><h3>Çalışma notları</h3><textarea rows="8" placeholder="Notların…" onchange="mxLessonNote('${K(k)}',this.value)">${H(P().notes[k]||'')}</textarea><button onclick="go('flash')">Kelime çalışması</button></section></div>`;}
 const oldResources=resourcesView;
 resourcesView=function(){
   if(P().classic)return `<button onclick="mxPalaceClassic()">Hafıza sarayına dön</button>`+oldResources();
   const all=resourceRows(),r=all.find(x=>x.id===String(sourceSelected||'').split('~')[0]),catg=P().category||'';
   if(r){const tree=sourceTree(r),id=String(sourceSelected).includes('~')?String(sourceSelected).split('~')[1]:P().nodes[r.id]||'',chain=lineage(tree,id),n=chain.at(-1),children=n?n.children||[]:tree,[c,i]=tone(r.type),s=state6(r);
     return `<div class="mx-palace"><div class="mx-crumb"><button onclick="mxPalaceCategory('${K(r.type||'Diğer')}')">‹ Kaynaklar</button><button onclick="mxPalaceOpen('${K(r.id)}')">${H(r.title)}</button>${chain.map(x=>`<span>›</span><button onclick="mxPalaceOpen('${K(r.id)}','${K(x.id)}')">${H(x.title)}</button>`).join('')}</div>${hero(n?.title||r.title,n?n.children?.length?'Alt durakları seç':'Çalışma alanın':r.method||'Bölümlerini seçerek ilerle.')}<div class="mx-palace-tools"><button class="primary" onclick="mxPalaceFocus('${K(target(r,n))}')">◷ Pomodoro başlat / devam et</button><button onclick="mxPalaceStop('${K(target(r,n))}')">Süreyi kaydet ve durdur</button><button onclick="resourceGoal6('${K(r.id)}','${K(n?.id||'')}')">Hedef oluştur</button>${typeof window.mxFinishGoal==='function'?`<button onclick="mxFinishGoal('resource')">Çoklu bölüm hedefi</button>`:''}<button onclick="mxPalaceClassic()">Klasik görünüm</button></div><p>${s.n}/${s.total} kaynak geneli</p>${bar(s.n,s.total)}${children.length?road(children.map(x=>{const a=leaves([x]),done=a.filter(leafDone).length;return {id:x.id,title:x.title,sub:[x.note,a.length>1?done+'/'+a.length+' alt konu':''].filter(Boolean).join(' · '),done:a.length>0&&done===a.length,started:done>0,icon:x.children?.length?0:i};}),c,x=>`mxPalaceOpen('${K(r.id)}','${K(x.id)}',${x.state==='locked'})`):n?detail(r,n):'<p>Gerçek bölüm listesi henüz yok.</p>'}<details class="card"><summary>Kaynağı düzenle</summary><form class="flex" onsubmit="addNested(event,'${K(n?.id||'')}')"><input name="title" required placeholder="Yeni bölüm"><button>＋ Ekle</button></form>${!n?media(r,null):''}</details></div>`;
   }
   const types=[...new Set(all.map(x=>x.type||'Diğer'))].sort((a,b)=>a.localeCompare(b,'tr'));
   return `<div class="mx-palace">${hero(catg||'Öğrenme sarayım',catg?'Bir kaynak seç.':'Öğrenme alanı → kaynak → bölüm → çalışma.')}<div class="mx-palace-tools">${catg?'<button onclick="mxPalaceCategory(\'\')">‹ Alanlar</button>':''}<button onclick="go('english')">Benim Yolum</button><button onclick="mxPalaceClassic()">Klasik katalog</button><button onclick="mxCatHide()">${P().hideCat?'Mimo göster':'Mimo gizle'}</button></div>${catg?`<div class="card"><input id="resSearch6" placeholder="Kategori içinde ara" value="${H(sourceFilter)}" oninput="sourceFilter=this.value;searchRender(this)"></div>`:''}<div class="mx-palace-grid">${catg?all.filter(x=>(x.type||'Diğer')===catg&&(!sourceFilter||x.title.toLocaleLowerCase('tr').includes(sourceFilter.toLocaleLowerCase('tr')))).map(x=>{const a=state6(x),[c,i]=tone(x.type);return tile(x.title,`${a.n}/${a.total} çalışma birimi`,c,i,`mxPalaceOpen('${K(x.id)}')`,a.n,a.total);}).join(''):types.map(t=>{const [c,i]=tone(t);return tile(t,all.filter(x=>(x.type||'Diğer')===t).length+' kaynak',c,i,`mxPalaceCategory('${K(t)}')`);}).join('')}</div></div>`;
 };
 const oldEnglish=english;
 window.mxJourneyClassic=()=>{P().journeyClassic=!P().journeyClassic;save();render();};
 window.mxJourneyGoal=k=>{P().goal=D(k);P().day='';P().page=0;save();render();};
 window.mxJourneyDate=(k,d,locked)=>{if(locked&&P().strict!==false)return toast('Önce önceki durağı bitir veya serbest erişimi seç.');P().goal=D(k);P().day=d;P().page=0;save();render();};
 window.mxJourneyStart=(k,d)=>{const g=v5().challenges.find(x=>x.id===D(k));if(g)treeDay10(g.id,d);};
 english=function(){
   if(P().journeyClassic)return `<button onclick="mxJourneyClassic()">Yeni yol görünümü</button>`+oldEnglish();
   const periods=treePeriod10(),from=periods[0].start,to=periods.at(-1).end,gs=v5().challenges.filter(g=>g.start<=to&&g.end>=from),g=gs.find(x=>x.id===P().goal);
   const tools=`<div class="mx-palace-tools"><button onclick="go('goals')">＋ Hedef</button><button onclick="go('resources')">Kaynaklar</button><button onclick="mxJourneyClassic()">Klasik plan / 116 hafta</button><button onclick="mxCatSound()">${P().sound?'Kedi sesi açık':'Kedi sesi kapalı'}</button><button onclick="mxCatHide()">${P().hideCat?'Mimo göster':'Mimo gizle'}</button></div><div class="mx-palace-tools">${[['week','Hafta'],['month','Ay'],['year','12 ay']].map(([k,l])=>`<button class="${v10().treeScale===k?'primary':''}" onclick="v10().treeScale='${k}';render()">${l}</button>`).join('')}<button onclick="shiftTree10(-1)">‹</button><button onclick="v10().treeDate=today();render()">Bugün</button><button onclick="shiftTree10(1)">›</button><small>${H(dateLabel5(from))} – ${H(dateLabel5(to))}</small></div>`;
   if(!g)return `<div class="mx-palace">${hero('Benim Yolum','Gerçek hedeflerin ve çalışma kayıtlarınla açılan yollar.')}${tools}<div class="mx-palace-grid">${gs.map(g=>{const [c,i]=tone(g.module),s=challengeInfo5(g);return tile(g.title,`${s.count}/${s.target} · ${tag5(g.module)[0]}`,c,i,`mxJourneyGoal('${K(g.id)}')`,s.count,s.target);}).join('')||'<p>Bu dönemde hedef yok.</p>'}${tile('Ajanda görevleri','Günlük çalışmalar','#728d9d',6,`go('calendar')`)}</div></div>`;
   const [c,i]=tone(g.module),plan=schedule9(g),dates=Object.keys(plan.dates).filter(d=>d>=from&&d<=to).sort(),d=P().day,st=dates.includes(d)?planStat9(g,d):null;
   const crumb=`<div class="mx-crumb"><button onclick="mxJourneyGoal('')">‹ Benim Yolum</button><button onclick="mxJourneyGoal('${K(g.id)}')">${H(g.title)}</button></div>`;
   if(st){const ns=g.module==='resource'?scope6(g.target).items.filter(n=>st.ids.includes(n.id)):[];return `<div class="mx-palace">${crumb}${hero(dateLabel5(d),g.title)}${tools}${ns.length?road(ns.map(n=>({id:n.id,title:n.title,done:leafDone(n),sub:n.note,icon:i})),c,x=>`mxPalaceOpen('${K(g.target.split('~')[0])}','${K(x.id)}',${x.state==='locked'})`):`<div class="card"><p>${st.n}/${st.amount} ${H(unit5(g.module,g.target))}</p><button class="primary" onclick="mxJourneyStart('${K(g.id)}','${d}')">Çalışmayı aç</button></div>`}</div>`;}
   return `<div class="mx-palace">${crumb}${hero(g.title,'Plan durakları · gerçek tamamlanma ile ilerle')}${tools}${road(dates.map(d=>{const s=planStat9(g,d);return {id:d,title:dateLabel5(d),done:s.ok,started:s.n>0,sub:s.n+'/'+s.amount+' '+unit5(g.module,g.target),icon:i};}),c,x=>`mxJourneyDate('${K(g.id)}','${x.id}',${x.state==='locked'})`)}</div>`;
 };
 // Keep legacy catalog access, but do not allow its checkbox to bypass the work record.
 if(typeof markNode==='function'){markNode=function(nid,done){
   const rid=String(sourceSelected||'').split('~')[0],{r,n}=node(rid,nid);
   if(!r||!n)return;
   if(n.children?.length){mxPalaceOpen(K(rid),K(nid));return toast('Tamamlanma alt çalışmaların gerçek kayıtlarından hesaplanır.');}
   if(done){mxPalaceOpen(K(rid),K(nid));mxPalaceComplete(K(rid),K(nid));}
   else mxPalaceUndo(K(rid),K(nid));
 };}
 const oldActual=actual5;actual5=function(m,t,d){if(m==='resource')return scope6(t).items.filter(n=>leafDone(n)&&s4().chapterDates[n.id]===d).length;return oldActual(m,t,d);};
 if(typeof markPlanLeaf9==='function'){markPlanLeaf9=function(gid,nid,done){const g=v5().challenges.find(x=>x.id===D(gid));if(!g)return;const rid=g.target.split('~')[0];close5();mxPalaceOpen(K(rid),nid);if(done)mxPalaceComplete(K(rid),nid);else mxPalaceUndo(K(rid),nid);};}
 function wire(){
   for(const road of document.querySelectorAll('.mx-road')){const svg=road.querySelector('.mx-road-line'),ns=[...road.querySelectorAll('.mx-node')];if(!ns.length)continue;const r=road.getBoundingClientRect(),w=road.offsetWidth,h=road.offsetHeight,scale=r.width/w||1,pts=ns.map(n=>{const b=n.getBoundingClientRect();return [(b.left+b.width/2-r.left)/scale,(b.top+b.height/2-r.top)/scale];});let line=`M ${pts[0][0]} ${pts[0][1]}`;for(let j=1;j<pts.length;j++){let a=pts[j-1],b=pts[j],y=(a[1]+b[1])/2;line+=` C ${a[0]+(j%2?44:-44)} ${y},${b[0]+(j%2?-44:44)} ${y},${b[0]} ${b[1]}`;}svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.innerHTML=`<path d="${line}" fill="none" stroke="#51475e" opacity=".15" stroke-width="15" stroke-linecap="round" transform="translate(0 5)"/><path d="${line}" fill="none" stroke="#a7a0b4" opacity=".65" stroke-width="12" stroke-linecap="round"/><path d="${line}" fill="none" stroke="white" opacity=".65" stroke-width="2" stroke-dasharray="4 9"/>`;}
   for(const v of document.querySelectorAll('.mx-road-view')){if(v.dataset.wired)continue;v.dataset.wired='1';let o=null;v.onpointerdown=e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button,input,a'))return;o={x:e.clientX,y:e.clientY,l:v.scrollLeft,t:v.scrollTop};v.setPointerCapture(e.pointerId);};v.onpointermove=e=>{if(o)v.scrollTo(o.l+o.x-e.clientX,o.t+o.y-e.clientY);};v.onpointerup=v.onpointercancel=v.onlostpointercapture=()=>{o=null;};}
   if(blobURL&&(!localVideo||!localVideo.isConnected)){URL.revokeObjectURL(blobURL);blobURL=null;localVideo=null;}
   const local=document.querySelector('[data-mx-lesson] video:not([src])');if(local){const k=D(local.closest('[data-mx-lesson]').dataset.mxLesson),m=P().media[k];if(m?.kind==='local')get6('media',m.key).then(blob=>{if(!local.isConnected)return;if(!(blob instanceof Blob)){local.nextElementSibling.textContent='Yerel video bulunamadı.';return;}if(blobURL)URL.revokeObjectURL(blobURL);blobURL=URL.createObjectURL(blob);localVideo=local;local.src=blobURL;}).catch(()=>{if(local.isConnected)local.nextElementSibling.textContent='Dosya açılamadı.';});}
 }
 const oldRender=render;render=function(){oldRender();paintCat();requestAnimationFrame(wire);};
 window.addEventListener('resize',()=>requestAnimationFrame(wire));document.addEventListener('fullscreenchange',paintCat);
}
const previousStudioInstallerMXPalace=installStudioP1;
installStudioP1=function(){previousStudioInstallerMXPalace();installPalaceMX();};
