'use strict';

// Calendar dates are kept separate from elapsed study time and completion evidence.
function installCurriculum() {
  const program = MusesCatalog.active?.data.curriculum;
  if (!program) return;
  const {phases, resources} = program;
  const start = phases[0].start;
  const dayNumber = date => Date.parse(date + 'T00:00:00Z') / 86400000;
  const weekCount = Math.ceil((dayNumber(phases.at(-1).end) - dayNumber(start) + 1) / 7);
  let currentWeek = Math.max(1, Math.min(weekCount, 1 + Math.floor((dayNumber(today()) - dayNumber(start)) / 7)));

  function viewWeek() {
    const first = add(start, (currentWeek - 1) * 7);
    const last = add(first,6);
    const phase = phases.find(item => item.start <= last && item.end >= first);
    const rows = resources.filter(row => row.start <= last && row.end >= first);
    const minutes = rows.reduce((total,row) => total + row.minutes, 0);
    const select = document.querySelector('#curriculum-week');
    select.value = String(currentWeek);
    document.querySelector('[data-week-previous]').disabled = currentWeek === 1;
    document.querySelector('[data-week-next]').disabled = currentWeek === weekCount;
    const panel = document.querySelector('[data-week-content]');
    panel.innerHTML = `<h3>${esc(phase?.title || 'Çalışma haftası')}</h3>
      <p>${esc(dateLabel5(first))} – ${esc(dateLabel5(last))} · ${rows.length} kaynak · ${minutes} dk plan</p>
      ${phase?.skill ? `<p class="muted">${esc(phase.skill)}</p>` : ''}
      ${rows.map(row=>`<details><summary>${esc(row.title)} <small>${row.minutes} dk</small></summary>
        <p>${esc(row.quantity)} ${esc(row.unit)} / hafta · ${esc(row.method)}</p>
        <button data-study="${esc(row.id)}">Kaynağı aç</button>
        <button data-plan="${esc(row.id)}">Ajanda için planla</button></details>`).join('')}`;
  }

  window.showCurriculumWeek = function (step = 0) {
    currentWeek = Math.min(weekCount,Math.max(1,(Number(document.querySelector('#curriculum-week').value) || 1)+step));
    viewWeek();
  };
  function card() {
    return `<section class="card curriculum-week"><h2>İngilizce çalışma programım</h2>
      <div class="training-step"><button data-week-previous aria-label="Önceki hafta" onclick="showCurriculumWeek(-1)">←</button>
      <label>Hafta <select id="curriculum-week" onchange="showCurriculumWeek()">${Array.from({length:weekCount},(_,i)=>`<option value="${i+1}">${i+1} / ${weekCount}</option>`).join('')}</select></label>
      <button data-week-next aria-label="Sonraki hafta" onclick="showCurriculumWeek(1)">→</button></div>
      <div data-week-content aria-live="polite"></div></section>`;
  }
  english = () => pathView7() + card();
  const originalRender = render;
  render = function () {
    originalRender();
    if (view==='english' && document.querySelector('#curriculum-week')) viewWeek();
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('.curriculum-week [data-study],.curriculum-week [data-plan]');
    if (!button) return;
    const id = button.dataset.study || button.dataset.plan;
    if (!resourceRows().some(row=>row.id===id)) return toast('Bu kaynak yerel katalogda bulunamadı.');
    if (button.dataset.study) startSource9(id);
    else {
      const first = add(start, (currentWeek - 1) * 7);
      const resource = resources.find(row => row.id === id);
      resourceGoal6(id);
      if (!document.querySelector('#challenge5')) return;
      goalDraft5.start = first < resource.start ? resource.start : first;
      const last = add(first,6);
      goalDraft5.end = last > resource.end ? resource.end : last;
      const source = resourceRows().find(row => row.id === id);
      if (resource.unit === source.unit && Number.isInteger(resource.quantity) && resource.quantity > 0) {
        goalDraft5.amount = Math.min(goalDraft5.amount,resource.quantity);
      }
      challengeForm5();
    }
  });
}
