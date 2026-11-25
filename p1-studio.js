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
 window.mxArchiveBook=function(k){const id=dec5(k),b=bookRows().find(x=>x.id===id)||readerList9().find(x=>x.id===id);if(!b||!confirm('Kitap kaldırılsın mı? Okuma geçmişi korunur; geri yükleyebilirsin.'))return;archive()[id]={title:b.title};if(v9().readerId===id){readerStop9();v9().readerId='';}bookSelected='';persist();};
 window.mxRestoreBook=function(k){delete archive()[dec5(k)];close5();persist();};
 window.mxArchiveList=function(){modal5(`<div class="modalhead5"><h2>Kaldırılan kitaplar</h2><button onclick="close5()">×</button></div>${Object.entries(archive()).map(([id,b])=>`<div class="card"><b>${H(b.title)}</b> <button onclick="mxRestoreBook('${enc5(id)}')">Geri yükle</button></div>`).join('')||'<p>Boş</p>'}`);};
 const oldOpen=openReader9;openReader9=function(id){if(archive()[id])return toast('Bu kaynak kaldırılmış. Önce geri yükle.');return oldOpen(id);};
 const oldLib=libraryView;libraryView=function(){if(v9().readerId&&archive()[v9().readerId])v9().readerId='';if(v9().readerId)return oldLib();const el=document.createElement('div');el.innerHTML=oldLib();el.querySelector('.importReader9')?.remove();const shelf=el.querySelector('.readerShelf9');if(shelf){shelf.replaceChildren();for(const b of readerList9().filter(x=>!archive()[x.id])){const btn=document.createElement('button');btn.setAttribute('onclick',`openReader9('${enc5(b.id)}')`);const img=document.createElement('img');img.src=b.cover||cover(b.title);img.alt=b.title;img.loading='lazy';const title=document.createElement('b');title.textContent=b.title;btn.append(img,title);shelf.append(btn);}}return `<section class="card"><h3>Yerel kitaplık</h3><div class="flex"><button class="primary" onclick="mxImportLibrary()">＋ Metin / dosya / ses</button><button onclick="mxArchiveList()">Kaldırılanlar</button>${bookSelected&&bookRows().some(b=>b.id===bookSelected)?`<button onclick="mxArchiveBook('${enc5(bookSelected)}')">Kitabı kaldır</button>`:''}</div></section>`+el.innerHTML;};
 const oldReader=readerView9;readerView9=function(){const b=readerList9().find(x=>x.id===v9().readerId),h=oldReader();if(!b)return h;const audio=b.mxAudio?`<section class="card" data-mx-audio="${H(b.mxAudio)}" data-mx-book="${H(b.id)}"><h3>Ses ve altyazı</h3><audio controls preload="metadata" style="width:100%"></audio><p class="mx-caption" style="background:#342d47;color:white;padding:14px;text-align:center;border-radius:10px;white-space:pre-wrap">${b.mxCues?.length?'Altyazı sesle eşleşir.':'Altyazı yüklenmemiş.'}</p></section>`:'';return h.replace('</div><div class="readerTools9">',`<button onclick="mxArchiveBook('${enc5(b.id)}')">Kitabı kaldır</button></div><div class="readerTools9">`).replace('<div class="readerPage9"',audio+'<div class="readerPage9"');};
 let url=null;const previousRender=render;render=function(){if(url){URL.revokeObjectURL(url);url=null;}previousRender();const p=document.querySelector('[data-mx-audio]');if(!p)return;const b=readerList9().find(x=>x.id===p.dataset.mxBook),a=p.querySelector('audio'),cap=p.querySelector('.mx-caption');get6('media',p.dataset.mxAudio).then(blob=>{if(!p.isConnected)return;if(!(blob instanceof Blob)){cap.textContent='Ses dosyası bulunamadı.';return;}url=URL.createObjectURL(blob);a.src=url;a.ontimeupdate=()=>{cap.textContent=(b.mxCues||[]).filter(c=>c.start<=a.currentTime&&a.currentTime<c.end).map(c=>c.text).join('\n')||(b.mxCues?.length?'':'Altyazı yüklenmemiş.');};}).catch(()=>{if(p.isConnected)cap.textContent='Ses dosyası okunamadı.';});};
}
const originalStudioInstallMXLibrary = installStudioP1;
installStudioP1 = function(){originalStudioInstallMXLibrary();installLocalLibraryMX();};
