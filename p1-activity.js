'use strict';

function installActivityP1() {
  const originalContext = context9;
  const originalGo = go;
  const originalPause = clockToggle9;
  const originalTimeTitle = titleTime9;
  const originalAction = rowAction5;
  const originalSummary = timeSummary9;
  const originalCalendar = calendar;
  const originalP90 = p90View;
  const originalAtlas = atlasView;
  const originalReader = readerView9;
  const originalFlash = flash;
  const originalAwards = awards;
  const originalPlayDVD = playDVD6;
  const labels = {
    p90: 'P90X', pole: 'Pole Dance', speaking: 'Konuşma', listening: 'Dinleme'
  };
  let active;
  let microphone;
  let video;
  const isGraded = review => ['correct','incorrect','wrong'].includes(review.result);

  function clearActivity() {
    if (!active) return;
    clockFlush9();
    active = null;
    clock9 = null;
  }

  context9 = function () {
    if (!paused9 && !document.hidden) {
      if (active && view === active.view) return [active.module, active.target];
      if (view === 'p90' && video && !video.element.paused && video.day === pday) return ['p90', String(pday)];
      if (view === 'flash' && microphone) return ['speaking', 'All'];
      if (view === 'library' && v9().readerId && readerPlaying9) return ['listening', v9().readerId];
    }
    return originalContext();
  };

  go = function (next) {
    if (next !== view) clearActivity();
    originalGo(next);
  };

  clockToggle9 = function () {
    if (active) clearActivity();
    originalPause();
  };

  window.toggleActivityP1 = function (module, key) {
    const target = dec5(key);
    const stopping = active?.module === module && active.target === target;
    clearActivity();
    clockFlush9();
    if (!stopping) {
      active = {module, target, view};
      paused9 = false;
      lastInput9 = Date.now();
    }
    clock9 = null;
    clockTick9();
    render();
  };

  function activityButton(module, target) {
    const running = active?.module === module && active.target === target;
    return `<button aria-pressed="${running}" onclick="toggleActivityP1('${module}','${enc5(target)}')">
      ${running ? 'Süreyi kaydet ve durdur' : labels[module] + ' süresini başlat'}
    </button>`;
  }

  function activityTools(module, target) {
    return `<div class="p1-tools">${activityButton(module, target)}
      ${active?.module === module ? '<small>Gizli sekmede veya 2 dk hareketsizlikte sayaç durur.</small>' : ''}
    </div>`;
  }

  window.bindMicP1 = function (recognition) {
    recognition.addEventListener('audiostart', () => {
      if (view !== 'flash') return;
      clockFlush9();
      microphone = recognition;
      clockTick9();
    });
    recognition.addEventListener('audioend', () => {
      if (microphone !== recognition) return;
      clockFlush9();
      microphone = null;
      clockTick9();
    });
    recognition.addEventListener('end', () => {
      if (microphone !== recognition) return;
      clockFlush9();
      microphone = null;
      clockTick9();
    });
  };

  playDVD6 = async function (dvd) {
    const day = pday;
    await originalPlayDVD(dvd);
    const element = document.querySelector('#dialog5 video.player6');
    if (!element || view !== 'p90') return;
    for (const event of ['play','pause','ended']) {
      element.addEventListener(event, () => {
        video = {element, day};
        lastInput9 = Date.now();
        clockTick9();
      });
    }
  };
  document.querySelector('#dialog5').addEventListener('close', () => {
    if (!video) return;
    clockFlush9();
    video = null;
    clockTick9();
  });

  p90View = () => activityTools('p90', String(pday)) + originalP90();
  const originalP90Set = p90Set;
  p90Set = function (key, value) {
    if (key === 'done' && value && active?.module === 'p90') clearActivity();
    originalP90Set(key, value);
  };
  atlasView = () => activityTools('pole', atlasSelected || 'all') + originalAtlas();
  readerView9 = () => activityTools('listening', v9().readerId) + originalReader();
  flash = () => originalFlash();
  const originalFinish = finish4;
  finish4 = function () {
    if (active?.module === 'speaking') clearActivity();
    originalFinish();
  };

  titleTime9 = row => labels[row.m] ? (row.m === 'p90'
    ? `P90X · ${row.t}. gün`
    : labels[row.m]) : originalTimeTitle(row);

  rowAction5 = function (date, key) {
    const id = dec5(key);
    const row = id.startsWith('time9:') && agendaRows5(date).find(item => item.id === id);
    if (!row || !labels[row.module]) return originalAction(date, key);
    selected = date;
    calMonth = date.slice(0, 7);
    if (row.module === 'p90') {
      pday = +row.target;
      return go('p90');
    }
    if (row.module === 'pole') {
      atlasSelected = row.target === 'all' ? '' : row.target;
      return go('atlas');
    }
    if (row.module === 'listening') return openReader9(row.target);
    return route5('vocab', 'All', date);
  };

  timeSummary9 = function (dates) {
    const html = originalSummary(dates);
    const entries = Object.entries(labels).map(([module, label]) => ({
      module, label, seconds: dates.reduce((sum, date) => sum + seconds9(date, module), 0)
    })).filter(entry => entry.seconds > 0);
    const seconds = dates.reduce((sum, date) => sum + seconds9(date), 0);
    return html.replace(/<\/h2><\/div><strong>[^<]*<\/strong>/,
      `</h2></div><strong>${seconds ? fmtTime9(seconds) : 'Kayıt bulunamadı'}</strong>`)
      .replace(/<b>0 sn<\/b>/g, '<b>Kayıt yok</b>')
      .replace('</div><small>Aktif çalışma süresi', entries.map(entry =>
        `<button onclick="openTimeDetail9('${entry.module}')"><span>${entry.label}</span><b>${fmtTime9(entry.seconds)}</b></button>`).join('') +
        '</div><small>Aktif çalışma süresi');
  };

  window.reviewDetailP1 = function (date) {
    const reviews = S.reviews.filter(review => review.date === date && isGraded(review));
    modal5(`<div class="modalhead5"><h2>${esc(dateLabel5(date))} · Cevaplar</h2>
      <button aria-label="Kapat" onclick="close5()">×</button></div>
      ${reviews.length ? `<ul>${reviews.map(review => {
        const word = by4.get(review.key);
        return `<li>${esc(word ? word['Word / Phrase'] : review.key)} · ${review.result === 'correct' ? 'Doğru' : 'Yanlış'}</li>`;
      }).join('')}</ul>` : '<p>Kayıt bulunamadı.</p>'}`);
  };

  function annualActivity() {
    const year = selected.slice(0, 4);
    const minutes = new Map();
    const reviews = new Map();
    for (const review of S.reviews) {
      if (!review.date?.startsWith(year) || !isGraded(review)) continue;
      const row = reviews.get(review.date) || {correct: 0, total: 0};
      row.total++;
      row.correct += Number(review.result === 'correct');
      reviews.set(review.date, row);
    }
    for (const date of Object.keys(v9().time).filter(date => date.startsWith(year))) {
      const seconds = seconds9(date);
      if (seconds >= 1) minutes.set(date, seconds);
    }
    const dates = [...new Set([...minutes.keys(), ...reviews.keys()])].sort().reverse();
    return `<details class="card p1-analytics"><summary>${year} · Çalışma süresi ve kart cevapları</summary>
      ${dates.length ? `<ul>${dates.map(date => {
        const answers = reviews.get(date);
        const seconds = minutes.get(date);
        return `<li><button onclick="graphJump5('${date}')">${esc(dateLabel5(date))}${seconds ? ' · '+fmtTime9(seconds) : ''}</button>
          ${answers ? `<button onclick="reviewDetailP1('${date}')">${answers.correct} / ${answers.total} doğru</button>` : ''}</li>`;
      }).join('')}</ul>` : '<p>Bu yıl için kayıt bulunamadı.</p>'}
    </details>`;
  }

  const originalGraph = graph5;
  graph5 = function () {
    const days = v5().graphDays;
    const hasMetric = range5(add(selected, -2 * days + 1), selected).some(date => {
      const item = metricRows5(date);
      return chartMetric5 === 'done' ? item.planned > 0 : Number(item[chartMetric5]) > 0 ||
        (['smoke','coffee'].includes(chartMetric5) && item[chartMetric5] != null);
    });
    const html = originalGraph();
    if (hasMetric) return html;
    const picker = html.match(/<select[^>]*>[\s\S]*?<\/select>/)?.[0] || '';
    return `<section class="card"><h2>İlerlemen</h2>${picker}<p>Seçilen ölçüm ve dönem için kayıt bulunamadı.</p></section>`;
  };

  function weeklyAchievements() {
    const dates = range5(weekStart5(today()), today());
    const completed = dates.filter(date => agendaRows5(date).some(row =>
      row.done && row.kind !== 'actual') || seconds9(date) >= 60);
    const openAchievements = [
      [completed.includes(today()), 'Bugünkü adım', 'Bugün bir işi tamamladın veya en az bir dakika çalıştın.'],
      [completed.length >= 3, 'Haftanın üç günü', 'Bu hafta üç farklı günde çalışma kaydın var.']
    ].filter(([unlocked]) => unlocked);
    return `<section class="card"><h2>Mimo ile bu hafta</h2>
      ${openAchievements.length ? `<ul>${openAchievements.map(([,title, description]) =>
        `<li><strong>${title}</strong> · ${description}</li>`).join('')}</ul>` :
        '<p>İlk küçük adımınla başlayabilirsin.</p>'}</section>`;
  }

  awards = () => weeklyAchievements() + originalAwards();
  function periodInsights() {
    const end = selected > today() ? today() : selected;
    const days = v5().graphDays;
    const start = add(end, 1 - days);
    const previous = new Map();
    const learned = new Set();
    const probeDates = new Set();
    let recallAttempts = 0;
    let missedRecalls = 0;
    const reviews = S.reviews.filter(review => review.key && review.date <= end && isGraded(review))
      .sort((a, b) => a.date.localeCompare(b.date));
    for (const review of reviews) {
      const last = previous.get(review.key);
      const correct = review.result === 'correct';
      if (review.date >= start) {
        if (correct && !last?.everCorrect) learned.add(review.key);
        if (last?.correct && last.date < review.date) {
          recallAttempts++;
          missedRecalls += Number(!correct);
          probeDates.add(review.date);
        }
      }
      previous.set(review.key, {date:review.date, correct, everCorrect:correct || last?.everCorrect});
    }
    const resources = resourceRows().map(state6).filter(item => item.total && item.status !== 'new');
    const duration = endDate => range5(add(endDate, 1 - days), endDate).reduce((sum, date) => sum + seconds9(date), 0);
    const currentSeconds = duration(end);
    const previousSeconds = duration(add(start, -1));
    return `<details class="card p1-analytics"><summary>Kaynak, hatırlama ve dönem karşılaştırması</summary>
      <p>${esc(dateLabel5(start))} – ${esc(dateLabel5(end))}</p>
      <div class="p1-tools">
        <button onclick="graphJump5('${end}')">Bu dönem · ${currentSeconds ? fmtTime9(currentSeconds) : 'Kayıt yok'}</button>
        <button onclick="graphJump5('${add(start,-1)}')">Önceki dönem · ${previousSeconds ? fmtTime9(previousSeconds) : 'Kayıt yok'}</button>
      </div>
      <h3>Flashcard</h3>
      ${reviews.some(review => review.date >= start)
        ? `<p>${learned.size} kelime için ilk doğru yanıt kaydedildi.</p>`
        : '<p>Bu dönem için cevap kaydı bulunamadı.</p>'}
      ${recallAttempts ? `<p>Önceki bir günde doğru cevaplanan kelimelerin sonraki tekrarlarında
        ${missedRecalls} / ${recallAttempts} yanlış yanıt (%${Math.round(100*missedRecalls/recallAttempts)}).</p>
        <div class="p1-tools">${[...probeDates].map(date =>
          `<button onclick="reviewDetailP1('${date}')">${esc(dateLabel5(date))}</button>`).join('')}</div>`
        : '<p>Günler arasında hatırlamayı ölçmek için yeterli kayıt yok.</p>'}
      <h3>Başlanan kaynaklar</h3>
      ${resources.length ? `<ul>${resources.map(({r,n,total}) =>
        `<li><button onclick="sourceOpen6(dec5('${enc5(r.id)}'))">${esc(r.title)} · %${Math.round(100*n/total)}</button></li>`
      ).join('')}</ul>` : '<p>Başlanan kaynak kaydı bulunamadı.</p>'}
    </details>`;
  }

  calendar = () => originalCalendar() + periodInsights() + annualActivity();
}


/* Linked focus timer and finite Flashcard session. No personal data. */
function focusStepMX(a,now,auto){
 if(!a||a.status!=="running")return {};
 const end=Math.min(now,a.end),start=Math.min(a.at,a.end),credit=a.phase==="work"&&end>start?[start,end]:null;
 if(end>start)a.at=end;
 a.left=Math.max(0,a.end-now);
 if(now<a.end)return {credit};
 if(a.phase==="work"){
  a.done++;
  if(a.done>=a.rounds){a.status="finished";return {credit,changed:true,finished:true};}
  a.phase="break";a.left=a.rest;
 }else{a.phase="work";a.left=a.work;}
 a.at=now;a.end=now+a.left;a.status=auto?"running":"paused";
 return {credit,changed:true};
}
function installFocusSessionsMX(){
 if(window.mxFocusSessionsInstalled)return;
 window.mxFocusSessionsInstalled=true;
 const H=x=>esc(String(x??"")), D=()=>S.mxFocus??={prefs:{work:25,rest:5,rounds:5,auto:true,voice:true},active:null,history:[],flash:null,flashHistory:[]};
 const prefs=()=>{let p=D().prefs??={};for(const [k,v] of Object.entries({work:25,rest:5,rounds:5,auto:true,voice:true}))if(p[k]===undefined)p[k]=v;D().history??=[];D().flashHistory??=[];return p;};
 prefs();
 const active=()=>D().active,fs=()=>D().flash, id=()=>String(uid()), fmt=n=>{let s=Math.max(0,Math.ceil(n/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");};
 const day=t=>{let p=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(t).map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day;};
 let lastSave=0,dock=null,mini=false,lastSpoken="",endTimer=0,ending=false;
 const baseContext=context9;context9=function(){return active()||fs()?null:baseContext();};
 function credit(a,start,end){
  // One common actual-time ledger, split at Istanbul midnight; focus history is its subset.
  while(start<end){const d=day(start),until=Math.min(end,Date.parse(d+"T00:00:00+03:00")+86400000),sec=(until-start)/1000;
   if(!(sec>0))break;const rows=v9().time[d]??={},k=timeKey9(a.module,a.target);rows[k]=(Number(rows[k])||0)+sec;a.days??={};a.days[d]=(a.days[d]||0)+sec;a.seconds=(a.seconds||0)+sec;start=until;}
 }
 function archive(a,reason){
  if(D().history.some(x=>x.id===a.id))return;
  D().history.push({id:a.id,module:a.module,target:a.target,title:a.title,started:a.started,ended:Date.now(),seconds:a.seconds||0,done:a.done,rounds:a.rounds,session:a.session||"",days:a.days||{},reason});
  for(const [date,seconds] of Object.entries(a.days||{}))if(seconds>0&&!v7().focus.some(x=>x.id===a.id+":"+date))v7().focus.push({id:a.id+":"+date,title:a.title,date,seconds,linked:true,module:a.module,target:a.target});
 }
 function tick(now=Date.now(),notify=true){
  let a=active();if(!a){paint();return;}
  let before=a.phase,r=focusStepMX(a,now,prefs().auto&&!document.hidden&&now-a.end<2000);
  if(r.credit)credit(a,...r.credit);
  if(r.changed){
   if(before==="work"&&notify){try{sound("win");}catch{}toast(r.finished?"Pomodoro setleri tamamlandı.":"Odak seti tamamlandı. Mola zamanı.");}
   if(r.finished){archive(a,"sets-complete");D().active=null;clock9=null;paused9=true;}
   save();lastSave=now;
  }else if(r.credit&&now-lastSave>=10000){save();lastSave=now;}
  paint();
 }
 function stop(reason="manual"){tick(Date.now(),false);const a=active();if(a){archive(a,reason);D().active=null;clock9=null;paused9=true;save();}paint();}
 function pause(){tick(Date.now(),false);const a=active();if(!a)return;if(a.status==="running"){a.left=Math.max(0,a.end-Date.now());a.status="paused";}else{a.at=Date.now();a.end=a.at+a.left;a.status="running";}save();paint();}
 function label(m,t){
  if(m==="task")return S.tasks.find(x=>x.id===t)?.title||"Görev";
  if(m==="resource"){const x=scope6(t);return x.r?[x.r.title,x.node?.title].filter(Boolean).join(" · "):"Kaynak";}
  if(m==="book"||m==="listening")return readerList9().find(x=>x.id===t)?.title||bookRows().find(x=>x.id===t)?.title||"Kitap";
  if(m==="vocab")return "Flashcard · "+(t==="All"?"Tüm seviyeler":t);
  if(m==="p90")return "P90X · "+t+". gün";
  if(m==="pole")return "Pole Dance · "+(t==="all"?"Genel":((typeof ATLAS_SEED!=="undefined"?ATLAS_SEED.find(x=>x.id===t)?.name:"")||t));
  if(m==="swim")return "Yüzme";if(m==="piano")return "Piyano";if(m==="speaking")return "Konuşma";
  return t||"Odak çalışması";
 }
 function start(m,t,name,session="",cfg=prefs()){
  const a=active();
  if(a&&a.module===m&&a.target===t&&(!session||!a.session||a.session===session)){if(session)a.session=session;save();paint();return true;}
  if(a&&!confirm("Mevcut Pomodoro kaydedilsin ve yeni çalışma başlatılsın mı?"))return false;
  if(a)stop("switch");clockFlush9();clock9=null;paused9=false;
  const now=Date.now(),clamp=(v,max,def)=>Number.isFinite(+v)?Math.max(1,Math.min(max,Math.round(+v))):def,work=clamp(cfg.work,180,25)*60000,rest=clamp(cfg.rest,60,5)*60000;
  D().active={id:id(),module:m,target:String(t),title:name||label(m,t),session,started:now,at:now,end:now+work,left:work,work,rest,rounds:clamp(cfg.rounds,30,5),done:0,phase:"work",status:"running",seconds:0,days:{}};
  lastSave=now;save();paint();return true;
 }
 const style=document.createElement("style");style.textContent=`
 .mx-focus-dock{position:fixed;right:16px;bottom:18px;z-index:9000;display:flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid var(--line);border-radius:15px;background:transparent!important;color:var(--ink);backdrop-filter:blur(12px);box-shadow:none;max-width:calc(100vw - 32px);font-size:.8rem}
 .mx-focus-dock button{background:transparent!important;border:0!important;box-shadow:none!important;padding:5px 8px!important;min-height:32px}
 .mx-focus-dock button:hover{background:var(--soft)!important}
 .mx-focus-dock .mx-time{font-size:1.14rem;font-weight:750;font-variant-numeric:tabular-nums;color:var(--accent)}
 .mx-focus-dock .mx-name{max-width:155px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .mx-focus-dock small{display:block;font-size:.72rem;opacity:.8}
 .mx-focus-mini .mx-info,.mx-focus-mini [data-stop]{display:none}
 .mx-focus-form label{display:block;margin:8px 0}.mx-focus-form select,.mx-focus-form input{max-width:100%}
 .mx-flash-session{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:8px 0;padding:8px;border:1px solid var(--line);border-radius:12px}
 @media(max-width:920px){.mx-focus-dock{right:10px;bottom:82px;max-width:calc(100vw - 20px);gap:3px}.mx-focus-dock .mx-name{max-width:100px}}
 `;document.head.append(style);
 function paint(){
  const parent=document.fullscreenElement||document.body;
  if(!dock){dock=document.createElement("aside");dock.className="mx-focus-dock";dock.setAttribute("aria-label","Pomodoro");dock.innerHTML='<button data-open title="Pomodoro ayarları">◷</button><div class="mx-info"><div class="mx-name"></div><small class="mx-state"></small></div><b class="mx-time">25:00</b><button data-pause title="Başlat / duraklat">▶</button><button data-stop title="Kaydet ve bitir">■</button><button data-mini title="Küçült">−</button>';
   dock.querySelector("[data-open]").onclick=()=>focusOpen7();dock.querySelector("[data-pause]").onclick=()=>active()?pause():focusOpen7();dock.querySelector("[data-stop]").onclick=()=>{stop();render();};dock.querySelector("[data-mini]").onclick=()=>{mini=!mini;dock.classList.toggle("mx-focus-mini",mini);};
  }
  if(dock.parentNode!==parent)parent.append(dock);
  const a=active(),p=prefs(),remaining=a?(a.status==="running"?a.end-Date.now():a.left):p.work*60000;
  dock.querySelector(".mx-time").textContent=fmt(remaining);dock.querySelector(".mx-name").textContent=a?.title||"Pomodoro";dock.querySelector(".mx-name").title=a?.title||"Pomodoro";
  dock.querySelector(".mx-state").textContent=a?(a.phase==="work"?"Odak":"Mola")+" · "+Math.min(a.rounds,a.done+(a.phase==="work"?1:0))+"/"+a.rounds+(a.status==="paused"?" · Duraklatıldı":""):"Çalışmanı seç";
  dock.querySelector("[data-pause]").textContent=a?.status==="running"?"Ⅱ":"▶";dock.querySelector("[data-stop]").disabled=!a;
  const inline=document.querySelector("[data-mx-clock]");if(inline)inline.textContent=a?fmt(remaining):"—";
 }
 function options(m){
  if(m==="task")return S.tasks.filter(t=>!t.done).map(t=>[t.id,(t.date||"")+" · "+t.title]);
  if(m==="resource")return resourceRows().map(x=>[x.id,x.title]);
  if(m==="book")return bookRows().map(x=>[x.id,x.title]);
  if(m==="habit")return habits.map(x=>[x[0],x[0]]);
  if(m==="vocab")return [...new Set(["All",...(s4().levels||[])])].map(x=>[x,x==="All"?"Tüm seviyeler":x]);
  if(m==="p90")return Array.from({length:90},(_,i)=>[String(i+1),"P90X · "+(i+1)+". gün"]);
  if(m==="pole")return [["all","Pole Dance"],...(typeof ATLAS_SEED!=="undefined"?ATLAS_SEED.map(x=>[x.id,x.name]):[])];
  if(m==="general")return [["Odak çalışması","Serbest çalışma"]];
  return [["all",label(m,"all")]];
 }
 function currentTarget(){
  if(view==="flash")return ["vocab",s4().levels.join(",")||"All"];if(view==="resources"&&sourceSelected)return ["resource",sourceSelected];
  if(view==="library"&&(v9().readerId||bookSelected))return ["book",v9().readerId||bookSelected];if(view==="p90")return ["p90",String(pday)];if(view==="atlas"||view==="pole")return ["pole",atlasSelected||"all"];if(view==="swim")return ["swim","all"];return ["task",""];
 }
 const oldOpen=focusOpen7,oldFinish7=focusFinish7,oldCancel7=focusCancel7;
 focusOpen7=function(name=""){
  if(v7().focusActive)return oldOpen(name);
  const a=active(),p=prefs(),[m,t]=currentTarget(),types=[["task","Görev"],["resource","Kaynak / bölüm"],["book","Kitap"],["vocab","Flashcard"],["habit","Alışkanlık"],["p90","P90X"],["pole","Pole Dance"],["swim","Yüzme"],["piano","Piyano"],["speaking","Konuşma"],["general","Serbest çalışma"]];
  modal5(`<div class="modalhead5"><h2>Pomodoro</h2><button onclick="close5()">×</button></div>${a?`<div class="card"><b>${H(a.title)}</b><p>${H(fmtTime9(a.seconds))} · ${a.done}/${a.rounds} set</p><button onclick="mxPauseFocus()">${a.status==="running"?"Duraklat":"Devam et"}</button><button onclick="mxStopFocus()">Kaydet ve bitir</button></div>`:""}<form id="mx-focus-form" class="mx-focus-form"><label>Çalışma türü<select name="kind">${opt5(types,m)}</select></label><label>Hedef<select name="target"></select></label><label data-leaf hidden>Alt bölüm<select name="leaf"></select></label><label data-custom hidden>Başlık<input name="title" value="${H(name)}" maxlength="140"></label><div class="grid three"><label>Odak (dk)<input name="work" type="number" min="1" max="180" value="${p.work}" required></label><label>Mola (dk)<input name="rest" type="number" min="1" max="60" value="${p.rest}" required></label><label>Set<input name="rounds" type="number" min="1" max="30" value="${p.rounds}" required></label></div><label><input type="checkbox" name="auto" ${p.auto?"checked":""}> Sonraki sete otomatik geç</label><label><input type="checkbox" name="voice" ${p.voice?"checked":""}> Flashcard otomatik ses</label><p class="muted">Molalar çalışma süresine eklenmez. Kapalı tarayıcıda yalnız başlamış setin sonuna kadar süre hesaplanır.</p><button class="primary">Başlat</button></form>`);
  const f=document.querySelector("#mx-focus-form");
  function flattenSections(tree,depth=0){return (tree||[]).flatMap(x=>[[x.id,"  ".repeat(depth)+x.title],...flattenSections(x.children||[],depth+1)]);}
  function leaf(){let r=f.elements.kind.value==="resource";f.querySelector("[data-leaf]").hidden=!r;if(r)f.elements.leaf.innerHTML=opt5([["","Kaynağın tamamı"],...flattenSections(scope6(f.elements.target.value).tree)],"");}
  function targets(preferred=""){let k=f.elements.kind.value,l=options(k);f.elements.target.innerHTML=opt5(l,l.some(x=>x[0]===preferred)?preferred:l[0]?.[0]);f.querySelector("[data-custom]").hidden=k!=="general";leaf();}
  f.elements.kind.onchange=()=>targets();f.elements.target.onchange=leaf;targets(t);
  f.onsubmit=e=>{e.preventDefault();const k=f.elements.kind.value;let target=f.elements.target.value;if(!target)return toast("Bir çalışma seç.");if(k==="resource"&&f.elements.leaf.value)target+="~"+f.elements.leaf.value;if(k==="general")target=f.elements.title.value.trim()||"Odak çalışması";const cfg={work:+f.elements.work.value,rest:+f.elements.rest.value,rounds:+f.elements.rounds.value,auto:f.elements.auto.checked,voice:f.elements.voice.checked};if(!start(k,target,label(k,target),"",cfg))return;Object.assign(prefs(),cfg);save();close5();if(k==="vocab"){route5("vocab",target,today());begin(false);}else if(k==="task"){const task=S.tasks.find(x=>x.id===target);if(task?.module==="vocab"){route5("vocab",task.target||"All",task.date);begin(false);}else if(task&&linked5(task))route5(task.module,task.target,task.date);else render();}else render();};
 };
 focusFinish7=function(){if(v7().focusActive)return oldFinish7();stop();close5();render();};focusCancel7=function(){if(v7().focusActive)return oldCancel7();stop();close5();render();};
 window.mxPauseFocus=()=>{pause();close5();render();};window.mxStopFocus=()=>{stop();close5();render();};
 window.toggleActivityP1=function(m,k){let t=dec5(k),a=active();if(a?.module===m&&a.target===t)stop();else start(m,t,label(m,t));render();};
 clockToggle9=function(){if(active()){pause();render();}else focusOpen7();};
 const titleBase=titleTime9;titleTime9=function(r){return ["task","habit","general","resource","book","vocab"].includes(r.m)?label(r.m,r.t):titleBase(r);};
 const actionBase=rowAction5;rowAction5=function(d,k){const v=dec5(k);if(v.startsWith("time9:task:")){let t=S.tasks.find(x=>x.id===v.slice(11));if(t)return showQuick5(t.date,enc5(t.id));}if(v.startsWith("time9:habit:"))return go("habits");if(v.startsWith("time9:general:"))return focusOpen7();return actionBase(d,k);};
 window.mxTaskFocus=function(key){const t=S.tasks.find(x=>x.id===dec5(key));if(!t)return;if(!start("task",t.id,t.title))return;if(t.module==="vocab"){route5("vocab",t.target||"All",t.date);begin(false);}else if(linked5(t))route5(t.module,t.target,t.date);else render();};
 const rowBase=row5;row5=function(r,compact=false){let h=rowBase(r,compact);if(r.kind==="task"&&!compact&&!r.done)h=h.replace(/<\/div>$/,`<button title="Bu göreve odaklan" aria-label="Bu göreve odaklan" onclick="mxTaskFocus('${enc5(r.id)}')">▶</button></div>`);return h;};
 const calBase=calendar;calendar=function(){let dates=new Set(periodDays9()),rows=D().history.filter(x=>Object.keys(x.days||{}).some(d=>dates.has(d))).slice(-60).reverse();return calBase()+`<details class="card"><summary>Göreve bağlı Pomodoro oturumları</summary>${rows.map(x=>`<div class="line"><b>${H(x.title)}</b><small>${H(fmtTime9(Object.entries(x.days||{}).filter(([d])=>dates.has(d)).reduce((n,[,s])=>n+s,0)))} · ${x.done}/${x.rounds} set</small></div>`).join("")||"<p>Bu dönem için kayıt yok.</p>"}<small>Bu süreler ortak çalışma toplamına dahildir, iki kez sayılmaz.</small></details>`;};
 function finish(reason,show){
  const f=fs();if(!f||ending)return;ending=true;clearTimeout(endTimer);endTimer=0;
  try{if(active()?.session===f.id)stop(reason);let answers=Object.values(f.answers),objective=answers.filter(x=>x.mode!=="srs"),seconds=D().history.filter(x=>x.session===f.id).reduce((n,x)=>n+x.seconds,0),rows=v6().attempts.filter(x=>x.session===f.id);
   if(!D().flashHistory.some(x=>x.id===f.id))D().flashHistory.push({id:f.id,date:day(Date.now()),planned:f.keys.length,answered:answers.length,correct:objective.filter(x=>x.ok).length,objective:objective.length,attempts:rows.length,seconds,reason});
   if(!s4().sessions.some(x=>x.id===f.id))s4().sessions.push({id:f.id,date:day(Date.now()),count:answers.length,correct:objective.filter(x=>x.ok).length,objective:objective.length,minutes:seconds/60,seconds,reason});
   D().flash=null;lastSpoken="";auto4=false;clearTimeout(timer4);session4=null;save();
   if(show&&view==="flash")finishBase();else if(show)toast("Flashcard oturumu kaydedildi.");
  }finally{ending=false;}
 }
 const finishBase=finish4;finish4=function(){return fs()?finish("manual",true):finishBase();};
 const restartBase=restart4;restart4=function(explicit){if(fs()&&!ending)finish("queue-changed",false);return restartBase(explicit);};
 function begin(reset){
  if(fs())finish("new-session",false);if(reset)restart4();if(!queue4.length)return toast("Bu seçimde kart yok.");
  if(!session4)session4={id:id(),start:Date.now(),count:0,correct:0};
  const sid=session4.id,t=s4().levels.join(",")||"All",a=active();
  if(a?.module==="task"&&S.tasks.some(x=>x.id===a.target&&x.module==="vocab")){a.session=sid;save();}
  else if(!start("vocab",t,label("vocab",t),sid))return;
  D().flash={id:sid,keys:[...new Set(queue4)],answers:{},mode:s4().mode};lastSpoken="";tab4="study";save();render();
 }
 window.mxStartFlashSession=()=>begin(true);
 const selectBase=startSelected4;startSelected4=function(){if(!chosen4.size)return selectBase();let keys=[...chosen4],n=Number(s4().limit);if(n>0)keys=keys.slice(0,n);restart4(keys);tab4="study";begin(false);};
 const attemptBase=attempt6;attempt6=function(a){
  attemptBase(a);let f=fs();if(!f||session4?.id!==f.id||!f.keys.includes(a.key))return;
  let ok=(f.mode==="flash"&&a.mode==="srs")||(f.mode==="match"&&a.mode==="match"&&a.ok)||(!["flash","match"].includes(f.mode)&&!["srs","match"].includes(a.mode));
  if(ok&&!Object.hasOwn(f.answers,a.key))f.answers[a.key]={mode:a.mode,ok:!!a.ok};save();
  if(Object.keys(f.answers).length>=f.keys.length&&!endTimer){const sid=f.id;endTimer=setTimeout(()=>{endTimer=0;if(fs()?.id===sid)finish("complete",true);},1000);}
 };
 const rateBase=rating4;rating4=function(n){let f=fs(),w=cur4();if(f&&w){const answered=Object.hasOwn(f.answers,key4(w));if(Object.keys(f.answers).length>=f.keys.length)return;if(f.mode==="flash"&&answered)return toast("Bu kart bu oturumda zaten değerlendirildi.");if(f.mode!=="flash"&&!answered)return toast("Önce soruyu yanıtla.");}return rateBase(n);};
 const evaluateBase=evaluate4;evaluate4=function(...args){const f=fs();if(f&&Object.keys(f.answers).length>=f.keys.length)return;return evaluateBase(...args);};
 const moveBase=move4;move4=function(n){let f=fs();if(!f)return moveBase(n);if(n>0){let i=1;while(i<=queue4.length&&Object.hasOwn(f.answers,queue4[(pos4+i)%queue4.length]))i++;if(i>queue4.length)return;n=i;}const was=auto4;auto4=false;try{return moveBase(n);}finally{auto4=was;autoSchedule4();}};
 const matchBase=match4;match4=function(){let f=fs();if(!f||f.mode!=="match")return matchBase();let remaining=queue4.filter(k=>!matchDone4.has(k));if(!remaining.length)return `<p>${queue4.length}/${queue4.length} eşleşti.</p>`;let group=remaining.slice(0,6),old=queue4,order=matchOrder4;try{queue4=group;matchOrder4=order.filter(k=>group.includes(k));if(matchOrder4.length!==group.length)matchOrder4=mix4(group.slice());return matchBase().replace(/\d+\/\d+ eşleşti/,`${matchDone4.size}/${old.length} eşleşti`);}finally{queue4=old;matchOrder4=order;}};
 function voiceParts(field,value){
  if(!value||field==="Image URL"||field.startsWith("IPA"))return [];
  const en=s4().lang==="en-US"?"en-US":"en-GB",text=String(value);
  if(field.includes("Türkçe")||field.includes("(TR"))return [{text,lang:"tr-TR"}];
  if(field==="Example Sentence"){const m=text.match(/[.!?]\s*[,|]\s*(?=[A-Za-zÇĞİÖŞÜçğıöşü])/);if(m){const i=m.index+1;return [{text:text.slice(0,i),lang:en},{text:text.slice(i+1).replace(/^[,|\s]+/,""),lang:"tr-TR"}];}}
  if(["Note","Usage Difference","Root / Etymology","Category","Source","Usage / Collocation","Similarity"].includes(field))return [];
  return [{text,lang:en}];
 }
 function speakFace(){
  let f=fs(),w=cur4();if(!f||!w||view!=="flash"||tab4!=="study"||document.hidden||!prefs().voice||!s4().autoVoice||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
  const mode=s4().mode,k=f.id+"|"+key4(w)+"|"+side4+"|"+mode;if(lastSpoken===k)return;lastSpoken=k;if(mode==="match"||(mode==="pron"&&!side4))return;
  const fields=side4?s4().back:mode==="listen"?[s4().write]:mode==="flash"?s4().front:[s4().prompt],parts=fields.flatMap(x=>voiceParts(x,label4(w,x)));if(!parts.length)return;
  speechSynthesis.cancel();let voices=speechSynthesis.getVoices();for(let p of parts){let u=new SpeechSynthesisUtterance(p.text);u.lang=p.lang;let v=voices.find(x=>x.lang.toLowerCase()===p.lang.toLowerCase())||voices.find(x=>x.lang.split("-")[0]===p.lang.split("-")[0]);if(v)u.voice=v;speechSynthesis.speak(u);}
 }
 const autoBase=autoSchedule4;autoSchedule4=function(){if(!fs())return autoBase();clearTimeout(timer4);if(auto4&&view==="flash"&&tab4==="study"&&s4().mode==="flash"&&!side4)timer4=setTimeout(()=>{if(fs()&&!side4){side4=true;render();}},1000*Math.max(1,Number(s4().seconds)||3));};
 const autoToggleBase=autoToggle4;autoToggle4=function(){if(!fs())return autoToggleBase();if(s4().mode!=="flash")return toast("Otomatik çevirme kart modunda çalışır.");auto4=!auto4;render();autoSchedule4();};
 const studyBase=study4;study4=function(){const f=fs(),h=studyBase();return `<div class="mx-flash-session"><button class="primary" onclick="mxStartFlashSession()">${f?"Yeni oturum":"Oturumu başlat · Pomodoro"}</button>${f?`<b>${Object.keys(f.answers).length}/${f.keys.length} soru</b><span>◷ <b data-mx-clock>—</b></span><small>Yanıtlar anında kaydedilir.</small>`:"<small>Seçili filtre ve soru sayısını kullanır.</small>"}</div>`+h.replace(/<button class="mini" onclick="restart4\(\);render\(\)"[^>]*>Yeni oturum<\/button>/g,"");};
 const flashBase=flash;flash=function(){return flashBase().replaceAll('onclick="restart4();tab4=\'study\';render()"','onclick="mxStartFlashSession()"');};
 // Keep stored attempts if a browser reload interrupted a session; never fabricate completion.
 if(fs()&&session4?.id!==fs().id)finish("reload",false);
 const renderBase=render;render=function(){renderBase();paint();speakFace();};
 document.addEventListener("fullscreenchange",paint);document.addEventListener("visibilitychange",()=>{tick(Date.now(),false);save();if(!document.hidden)speakFace();});
 window.addEventListener("pagehide",()=>{tick(Date.now(),false);save();});
 setInterval(tick,500);tick(Date.now(),false);paint();
}
const previousActivityInstallerMX=installActivityP1;
installActivityP1=function(){previousActivityInstallerMX();installFocusSessionsMX();};
