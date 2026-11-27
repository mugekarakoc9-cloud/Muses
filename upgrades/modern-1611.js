/* MUSES 0.16.11 modern Reader. Additive state; no storage keys are replaced. */
function mxAnnotationKey(book, page, para, word, occurrence) {
  const text=String(para);let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}const fingerprint=text.length+':'+(a>>>0).toString(16)+':'+(b>>>0).toString(16);
  return JSON.stringify([String(book), Number(page), fingerprint, String(word), Number(occurrence)]);
}
function mxDisplayGrade(stored) { return Number.isInteger(stored) && stored >= 1 && stored <= 5 ? 6-stored : null; }
function mxValidColor(color) { return /^#[0-9a-f]{6}$/i.test(String(color)); }
function installModern1611MX() {
  if (window.mxModern1611) return;
  window.mxModern1611 = true;
  const palette = ['#a8dfba','#88d8d2','#a6c8ff','#f5dc87','#f4b38e','#f1abd3','#c9b1ee'];
  const names = ['Yeşil','Turkuaz','Mavi','Sarı','Turuncu','Pembe','Mor'];
  const difficulty = ['#f1abd3','#f4b38e','#f5dc87','#a8dfba','#88d8d2'];
  const prefs = id => { const p=(S.mxReaderPrefs??={})[id]??={levels:['A1','A2','B1','B2','C1','C2'],meanings:false,phrases:true};p.colorMode??='level';p.colorStyle??='underline';return p; };
  const annotations = () => S.mxReaderHighlights??={};
  let selectedKeys=[];
  function words() { return [...document.querySelectorAll('#readerContent10 .readerWord10')]; }
  function decorate() {
    const a=readerCurrent10(); if(!a) return;
    const p=prefs(a.b.id),seen=new Map();
    for(const el of words()) {
      const para=el.closest('.readerPara10,.mx-source'),context=para?.textContent||'',word=el.dataset.word||el.textContent;
      const seqKey=JSON.stringify([context,word]),count=seen.get(seqKey)||0;seen.set(seqKey,count+1);
      const k=mxAnnotationKey(a.b.id,a.i,context,word,count);el.dataset.mxHighlightKey=k;
      let color=el.style.backgroundColor;
      const rows=findWords10(word)||[];
      const grades=rows.map(w=>mxDisplayGrade(S.mxVocabularyV2?.lastGrades?.[key4(w)]??Number(p4(w)?.level))).filter(n=>n!==null);
      if(p.colorMode==='difficulty') color=grades.length?difficulty[Math.min(...grades)-1]:'';
      if(p.colorMode==='off') color='';
      const manual=annotations()[k];if(manual&&mxValidColor(manual.color))color=manual.color;
      el.style.removeProperty('background');el.style.removeProperty('background-color');el.style.removeProperty('color');
      el.classList.remove('mx-reader-fill','mx-reader-line');el.style.removeProperty('--mx-mark');
      if(color){el.style.setProperty('--mx-mark',color);el.classList.add(manual||p.colorStyle==='fill'?'mx-reader-fill':'mx-reader-line');}
      const grade=grades.length?Math.min(...grades):null;
      if(p.colorMode==='difficulty'&&grade)el.title='Zorluk: '+grade+'/5 · '+['Çok zor','Zor','Orta','Kolay','Çok kolay'][grade-1];
    }
    const tools=document.querySelector('.readerTools9');if(tools&&!tools.querySelector('.mx-reader-options')){
      const b=document.createElement('button');b.type='button';b.className='mx-reader-options';b.textContent='Renk ve anlam';b.onclick=()=>mxReaderPreferences();tools.prepend(b);
      const tr=document.createElement('button');tr.type='button';tr.textContent=p.meanings?'TR açık':'TR kapalı';tr.setAttribute('aria-pressed',String(p.meanings));tr.onclick=()=>{p.meanings=!p.meanings;save();render();};tools.prepend(tr);
    }
    // Move preferences into the working toolbar; quiet reading used to hide this separate card.
    for(const b of document.querySelectorAll('#app section.card > button[onclick="mxReaderPreferences()"]'))b.parentElement.remove();
  }
  // Stored progress is indexed by key, never create a word merely to highlight it.
  function p4(w) { try { return st4(key4(w)); } catch { return null; } }
  const priorPrefs=window.mxReaderPreferences;
  window.mxReaderPreferences=function(){priorPrefs();const form=document.querySelector('#mx-reader-prefs'),a=readerCurrent10();if(!form||!a)return;const p=prefs(a.b.id);
    const div=document.createElement('div');div.className='mx-reader-color-settings';div.innerHTML='<label>Otomatik renk<select name="colorMode"><option value="level">CEFR seviyesi</option><option value="difficulty">Verdiğim zorluk puanı</option><option value="off">Kapalı</option></select></label><label>Görünüm<select name="colorStyle"><option value="underline">Renkli alt çizgi</option><option value="fill">Renkli arka plan</option></select></label><p class="muted">1 çok zor, 5 çok kolay. Puanı veya bilinen seviyesi olmayan kelimeler otomatik boyanmaz. Elle seçtiğin renkler korunur.</p>';
    form.prepend(div);form.elements.colorMode.value=p.colorMode;form.elements.colorStyle.value=p.colorStyle;
    form.addEventListener('submit',()=>{p.colorMode=form.elements.colorMode.value;p.colorStyle=form.elements.colorStyle.value;},true);
  };
  document.addEventListener('pointerdown',e=>{const word=e.target.closest?.('.readerWord10');if(word?.dataset.mxHighlightKey)selectedKeys=[word.dataset.mxHighlightKey];},true);
  document.addEventListener('pointerup',()=>{const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount)return;const range=selection.getRangeAt(0);if(!document.querySelector('#readerContent10')?.contains(selection.anchorNode))return;selectedKeys=words().filter(el=>range.intersectsNode(el)).map(el=>el.dataset.mxHighlightKey);},true);
  document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){const el=e.target.closest?.('.readerWord10');if(el)selectedKeys=[el.dataset.mxHighlightKey];}},true);
  function mark(color) {
    if(color!==null&&!mxValidColor(color))return;
    const a=readerCurrent10();if(!a||!selectedKeys.length)return;
    for(const key of selectedKeys){if(color===null)delete annotations()[key];else annotations()[key]={color,book:a.b.id,updated:new Date().toISOString()};}
    save();render();closeLens10();toast(color?'Vurgu kaydedildi':'Elle eklenen vurgu kaldırıldı');
  }
  const oldLens=renderLens10;
  renderLens10=function(){oldLens();const lens=document.querySelector('#lens10');if(!lens||lens.querySelector('.mx-highlight-palette'))return;
    const box=document.createElement('fieldset');box.className='mx-highlight-palette';const legend=document.createElement('legend');legend.textContent='Vurgu rengi';box.append(legend);
    palette.forEach((color,i)=>{const b=document.createElement('button');b.type='button';b.style.setProperty('--swatch',color);b.setAttribute('aria-label',names[i]+' ile vurgula');b.title=names[i];b.onclick=()=>mark(color);box.append(b);});
    const custom=document.createElement('input');custom.type='color';custom.value='#c9b1ee';custom.setAttribute('aria-label','Özel vurgu rengi');custom.onchange=()=>mark(custom.value);box.append(custom);
    const remove=document.createElement('button');remove.type='button';remove.className='mx-clear-highlight';remove.textContent='Vurguyu kaldır';remove.onclick=()=>mark(null);box.append(remove);lens.append(box);
  };
  const oldRender=render;render=function(){oldRender();decorate();};
  const oldHome=home;
  home=function(){const h=oldHome(),start=h.indexOf('<section class="mx-home-banner">'),end=h.indexOf('</section>',start);if(start<0||end<0)return h;
    const rows=agendaRows5(today()).filter(r=>r.kind!=='actual'&&!String(r.id).startsWith('time9:')),unique=[...new Map(rows.map(r=>[r.id,r])).values()],done=unique.filter(r=>r.done).length,total=unique.length,pct=total?Math.round(done/total*100):0;
    const routes=[['calendar','Ajanda','Gününü düzenle','calendar'],['resources','Öğren','Kaldığın yerden','book'],['p90','Hareket','Antrenman ve pole','move'],['habits','Yaşam','Rutinlerini takip et','leaf']];
    const icons={calendar:'<rect x="4" y="6" width="24" height="22" rx="5"/><path d="M10 3v6m12-6v6M4 13h24m-18 6h3m6 0h3m-12 5h3"/>',book:'<path d="M16 8c-5-4-10-3-12-2v20c5-2 9-1 12 1 3-2 7-3 12-1V6c-2-1-7-2-12 2Zm0 0v19"/>',move:'<path d="m8 24 16-16M4 17l11 11M17 4l11 11M3 23l6 6M23 3l6 6"/>',leaf:'<path d="M26 5C11 2 2 12 7 23c10 5 20-3 19-18ZM7 25l14-14m-8 8v-7m0 7h7"/>'};
    const banner='<section class="mx-modern-hero"><div><span class="mx-eyebrow">MUSES · 0.16.11</span><h1>Bugün, senin ritmin.</h1><p>'+esc(dateLabel5(today()))+'</p><button onclick="openPaletteP1()" class="mx-quick-entry">Ara veya görev ekle <kbd>⌘ / Ctrl K</kbd></button></div><button class="mx-day-ring" onclick="go(\'calendar\')" aria-label="Bugünün görevleri: '+done+' / '+total+'"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="mx-ring-track"/><circle cx="60" cy="60" r="50" class="mx-ring-value" pathLength="100" stroke-dasharray="'+pct+' 100"/></svg><b>'+done+'<small>/ '+total+'</small></b><span>görev tamamlandı</span></button><button class="mx-hero-update" onclick="mxCheckUpdate()" aria-label="Güncellemeleri denetle">↻</button></section><div class="mx-launch-grid">'+routes.map(([id,label,sub,icon])=>'<button onclick="go(\''+id+'\')"><svg viewBox="0 0 32 32" aria-hidden="true">'+icons[icon]+'</svg><div><b>'+label+'</b><small>'+sub+'</small></div></button>').join('')+'</div><div class="mx-shortcuts"><button onclick="go(\'english\')">Yol haritam</button><button onclick="go(\'flash\')">Flashcard</button><button onclick="go(\'library\')">Kitaplık</button><button onclick="go(\'atlas\')">Pole</button></div>';
    return h.slice(0,start)+banner+h.slice(end+10);
  };
  // Native assets are bundled: reloading localhost cannot install a new APK.
  if(window.Capacitor?.isNativePlatform?.()){
    window.mxCheckUpdate=async function(manual=true){if(manual)toast('Bu APK: 0.16.11. Yeni APK aynı imzayla kurulduğunda kayıtların korunur. Otomatik APK dağıtım adresi henüz bağlı değil.');};
  }
}
const priorModern1611MX=installStudioP1;installStudioP1=function(){priorModern1611MX();installModern1611MX();};
