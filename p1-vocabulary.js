'use strict';

function installVocabularyP1() {
  const labels = ['Çalışılmadı', 'Çok kolay', 'Kolay', 'Orta', 'Zor', 'Çok zor'];
  const filters = {query:'', level:'', pos:'', source:'', grade:'', due:false};
  const pageSize = 144;
  let page = 0;

  let activityDay = '';
  let activityEnd = '';

  function renderActivity() {
    const end = activityEnd || today();
    const days = Array.from({length:84}, (_, index) => add(end,index-83));
    const eventsByDay = new Map(days.map(date=>[date,[]]));
    for (const event of S.reviews) eventsByDay.get(event.date)?.push(event);
    const active = activityDay || end;
    const entries = eventsByDay.get(active) || [];
    const words = new Map();
    for (const event of entries) {
      const row = words.get(event.key);
      words.set(event.key, {count:(row?.count || 0)+1,grade:Number(event.level)});
    }
    const format = date => dateLabel5(date);
    const intensity = count => count === 0 ? 0 : count < 3 ? 1 : count < 8 ? 2 : count < 16 ? 3 : 4;
    return `<section class="card review-activity" aria-labelledby="review-activity-title">
      <div class="sectionHead7"><h2 id="review-activity-title">Tekrar etkinliği</h2>
        <label>Bitiş tarihi <input type="date" value="${end}" max="${today()}" onchange="setReviewRangeP1(this.value)"></label></div>
      <div class="review-heatmap">${days.map(date=>{
        const count=eventsByDay.get(date).length;
        const label=esc(`${format(date)} · ${count} tekrar`);
        return `<button type="button" data-review-date="${date}" data-intensity="${intensity(count)}"
          aria-label="${label}" title="${label}" aria-pressed="${date===active}"
          onclick="selectReviewDayP1('${date}')"></button>`;
      }).join('')}</div>
      <div class="review-scale" aria-label="Renk ölçeği">0 · 1–2 · 3–7 · 8–15 · 16+ tekrar</div>
      <h3 data-review-summary>${esc(format(active))} · ${entries.length} tekrar</h3>
      ${words.size ? `<ul class="review-words">${[...words].map(([key,row])=>{
        const word=by4.get(key)?.['Word / Phrase'];
        const summary=esc(`${row.count} tekrar · ${labels[row.grade] || '—'}`);
        return word ? `<li><button onclick="chooseEncoded4('${id4(key)}')">${esc(word)} <small>${summary}</small></button></li>` :
          `<li>${esc(String(key || 'Arşivlenmiş kart'))} <small>${summary}</small></li>`;
      }).join('')}</ul>` : '<p>Bu gün için tekrar kaydı yok.</p>'}
    </section>`;
  }
  window.selectReviewDayP1 = date => {
    activityDay=date;
    render();
    document.querySelector('.review-heatmap [aria-pressed="true"]')?.focus();
  };
  window.setReviewRangeP1 = date => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today()) return;
    activityEnd=date;
    activityDay=date;
    render();
    document.querySelector('.review-activity input')?.focus();
  };

  function renderMap() {
    const reviews = new Map();
    for (const event of S.reviews) {
      const grade = Number(event.level);
      if (!Number.isInteger(grade) || grade < 1 || grade > 5 || !event.date) continue;
      const previous = reviews.get(event.key);
      if (!previous) reviews.set(event.key, {last:event, count:1});
      else {
        previous.count++;
        if (event.date >= previous.last.date) previous.last = event;
      }
    }
    const date = today();
    const matches = all4.filter(word => {
      const key = key4(word);
      const grade = Number(reviews.get(key)?.last.level || 0);
      const next = st4(key).next;
      return searchMatch4(word, filters.query) &&
        (!filters.level || word.Levels?.includes(filters.level)) &&
        (!filters.pos || word.POS === filters.pos) &&
        (!filters.source || word.Lists?.includes(filters.source)) &&
        (filters.grade === '' || grade === Number(filters.grade)) &&
        (!filters.due || (next && next <= date));
    });
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, pages - 1);
    const tiles = matches.slice(page * pageSize, (page + 1) * pageSize).map(word => {
      const key = key4(word);
      const entry = reviews.get(key);
      const grade = Number(entry?.last.level || 0);
      const next = st4(key).next;
      const title = word['Word / Phrase'];
      const detail = [title, word.POS, labels[grade], entry?.last.date,
        `Tekrar: ${entry?.count || 0}`, `Sonraki tekrar: ${next || '—'}`].filter(Boolean).join(' · ');
      return `<button type="button" class="universe-tile" data-grade="${grade}" data-card="${esc(key)}"
        aria-label="${esc(detail)}" title="${esc(detail)}"
        onfocus="describeUniverseP1(this)" onpointerenter="describeUniverseP1(this)"
        onclick="chooseEncoded4('${id4(key)}')"></button>`;
    }).join('');
    const choices = (name, title, options) => `<label>${title}<select data-filter="${name}">
      <option value="">Tümü</option>${options.map(([value,label]) =>
        `<option value="${esc(value)}" ${filters[name]===value?'selected':''}>${esc(label)}</option>`).join('')}
      </select></label>`;
    const pairs = values => values.map(value => [value,value]);
    const pos = [...new Set(all4.map(word=>word.POS).filter(Boolean))].sort();
    return `<section class="card universe" aria-labelledby="universe-title">
      <div class="sectionHead7"><h2 id="universe-title">Kelime Evreni</h2><span>${matches.length.toLocaleString('tr-TR')} kayıt</span></div>
      <form class="universe-filters" onchange="updateUniverseP1(event)" onsubmit="event.preventDefault();updateUniverseP1(event)">
        <label>Kelime ara<input name="query" data-filter="query" value="${esc(filters.query)}"></label>
        ${choices('level','Seviye',pairs(LV4))}
        ${choices('pos','Kelime türü',pairs(pos))}
        ${choices('source','Liste veya kaynak',pairs(list4.filter(value=>value!=='All')))}
        ${choices('grade','Son değerlendirme',labels.map((label,i)=>[String(i),label]))}
        <label><input type="checkbox" data-filter="due" ${filters.due?'checked':''}> Tekrarı gelenler</label>
      </form>
      <ul class="universe-legend" aria-label="Değerlendirme renkleri">${[0,5,4,3,2,1].map(grade=>
        `<li><span data-grade="${grade}" aria-hidden="true"></span>${labels[grade]}</li>`).join('')}</ul>
      <p class="universe-detail" aria-hidden="true">Ayrıntı için bir kareye odaklan.</p>
      <div class="universe-grid">${tiles || '<p>Bu filtrelerle eşleşen kelime yok.</p>'}</div>
      <div class="flex between"><button onclick="turnUniverseP1(-1)" ${page===0?'disabled':''}>Önceki</button>
        <span>${page+1} / ${pages}</span><button onclick="turnUniverseP1(1)" ${page+1>=pages?'disabled':''}>Sonraki</button></div>
    </section>` + renderActivity();
  }

  window.describeUniverseP1 = tile => {
    tile.closest('.universe').querySelector('.universe-detail').textContent = tile.title;
  };
  window.updateUniverseP1 = event => {
    const input = event.target.matches('form') ? event.target.elements.namedItem('query') : event.target;
    if (!Object.hasOwn(filters,input.dataset.filter)) return;
    filters[input.dataset.filter] = input.type === 'checkbox' ? input.checked : input.value.trim();
    page = 0;
    render();
    document.querySelector(`[data-filter="${input.dataset.filter}"]`)?.focus();
  };
  window.turnUniverseP1 = delta => {
    page = Math.max(0,page+delta);
    render();
    document.querySelector('.universe-tile')?.focus();
  };

  return renderMap;
}
