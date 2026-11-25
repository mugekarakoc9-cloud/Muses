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
  flash = () => (tab4 === 'study' && !full4 ? activityTools('speaking', 'All') : '') + originalFlash();
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
