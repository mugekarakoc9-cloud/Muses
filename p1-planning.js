'use strict';

function installPlanningP1() {
  const originalSchedule = schedule9;
  const originalCard = challengeCard5;
  const originalForm = challengeForm5;
  const originalSave = saveChallenge5;

  function plannedMinutes(date, goal) {
    return v5().challenges.reduce((total, other) => {
      if (other.id === goal.id || !other.minutesPerUnit) return total;
      const allocation = v9().plans[other.id]?.dates[date];
      return total + (allocation?.amount || 0) * other.minutesPerUnit;
    }, 0);
  }

  function allocate(goal, dates, units) {
    const allocations = {};
    let index = 0;
    for (const date of dates) {
      if (index === units.length) break;
      // The application stores a start time, but no duration for ordinary tasks.
      const sameStart = goal.time && (
        S.tasks.some(task => task.date === date && task.time === goal.time) ||
        v5().challenges.some(other => other.id !== goal.id &&
          other.time === goal.time && v9().plans[other.id]?.dates[date])
      );
      if (sameStart) continue;
      const available = goal.dailyMinutes - plannedMinutes(date, goal);
      const capacity = Math.max(0, Math.floor(available / goal.minutesPerUnit));
      const amount = Math.min(capacity, units.length - index);
      if (!amount) continue;
      allocations[date] = {amount, ids: units.slice(index, index + amount).filter(id => id !== null)};
      index += amount;
    }
    return {allocations, unallocated: units.slice(index)};
  }

  schedule9 = function (goal) {
    if (!goal.dailyMinutes || !goal.minutesPerUnit || goal.kind !== 'total' ||
        goal.module === 'p90' || v9().plans[goal.id]) return originalSchedule(goal);
    const itemMode = goal.module === 'resource';
    const units = itemMode
      ? scope6(goal.target).items.filter(item => !leafDone(item)).slice(0, goal.amount).map(item => item.id)
      : Array.from({length: Math.floor(goal.amount)}, () => null);
    const result = allocate(goal, challengeDays5(goal), units);
    return v9().plans[goal.id] = {
      dates: result.allocations, unallocated: result.unallocated, itemMode, created: today()
    };
  };

  challengeForm5 = function () {
    originalForm();
    if (goalKind5 !== 'total' || goalModule5 === 'p90') {
      delete goalDraft5.dailyMinutes;
      delete goalDraft5.minutesPerUnit;
      return;
    }
    document.querySelector('#challenge5').insertAdjacentHTML('beforeend', `
      <details class="p1-planner" ${goalDraft5.dailyMinutes ? 'open' : ''}>
        <summary>Süreye göre planla</summary>
        <label>Günlük ayırabileceğin dakika
          <input name="dailyMinutes" type="number" min="1" max="1440" value="${Number(goalDraft5.dailyMinutes) || ''}">
        </label>
        <label>Birim başına tahmini dakika
          <input name="minutesPerUnit" type="number" min="1" max="1440" value="${Number(goalDraft5.minutesPerUnit) || ''}">
        </label>
      </details>`);
  };

  saveChallenge5 = function (event) {
    readChallenge5();
    const {dailyMinutes, minutesPerUnit} = goalDraft5;
    if (Boolean(dailyMinutes) !== Boolean(minutesPerUnit) ||
        Number(minutesPerUnit) > Number(dailyMinutes)) {
      event.preventDefault();
      return toast('İki süreyi de gir. Birim süresi günlük süreyi aşamaz.');
    }
    goalDraft5.dailyMinutes = Number(dailyMinutes) || 0;
    goalDraft5.minutesPerUnit = Number(minutesPerUnit) || 0;
    originalSave(event);
  };

  challengeCard5 = function (goal) {
    const plan = schedule9(goal);
    const pending = plan.unallocated?.length || 0;
    return originalCard(goal).replace('</article>', goal.dailyMinutes ? `
      <div class="card p1-plan-actions">
        ${pending ? `<p role="status">${pending} birim mevcut süreye sığmadı.</p>` : ''}
        <button onclick="editPlanP1('${enc5(goal.id)}')">Kalan programı düzenle</button>
      </div></article>` : '</article>');
  };

  window.editPlanP1 = function (key) {
    const goal = v5().challenges.find(item => item.id === dec5(key));
    if (!goal?.dailyMinutes) return;
    modal5(`<div class="modalhead5"><h2>Kalan programı düzenle</h2>
      <button aria-label="Kapat" onclick="close5()">×</button></div>
      <form onsubmit="rescheduleP1(event,'${key}')">
        <p>Tamamlanan birimler ve mevcut çalışma kayıtları korunur.</p>
        <label>Yeni bitiş <input name="end" type="date" required min="${today()}" max="${add(goal.start,365)}" value="${goal.end >= today() ? goal.end : today()}"></label>
        <label>Günlük dakika <input name="minutes" type="number" min="${goal.minutesPerUnit}" max="1440" required value="${goal.dailyMinutes}"></label>
        <button class="primary">Kalanı yeniden planla</button>
      </form>`);
  };

  window.rescheduleP1 = function (event, key) {
    event.preventDefault();
    const goal = v5().challenges.find(item => item.id === dec5(key));
    if (!goal) return;
    const fields = new FormData(event.target);
    const end = String(fields.get('end'));
    const dailyMinutes = Number(fields.get('minutes'));
    if (end < goal.start || end < today() || deltaDays(goal.start, end) > 365 ||
        dailyMinutes < goal.minutesPerUnit || dailyMinutes > 1440) return;
    const plan = schedule9(goal);
    const retained = {};
    const pending = [];
    const scope = plan.itemMode ? new Map(scope6(goal.target).items.map(item => [item.id, item])) : null;
    for (const [date, allocation] of Object.entries(plan.dates).sort()) {
      const completed = scope
        ? allocation.ids.filter(id => scope.has(id) && leafDone(scope.get(id)))
        : Array(Math.max(0, Math.min(allocation.amount, Math.floor(actual5(goal.module, goal.target, date))))).fill(null);
      if (completed.length) retained[date] = {amount: completed.length, ids: completed.filter(id => id !== null)};
      if (scope) pending.push(...allocation.ids.filter(id => !completed.includes(id)));
      else pending.push(...Array(allocation.amount - completed.length).fill(null));
    }
    if (Object.keys(retained).some(date => date > end)) {
      return toast('Bitiş tarihi tamamlanmış plan birimlerini kapsamalı.');
    }
    pending.push(...(plan.unallocated || []).filter(id => !scope?.has(id) || !leafDone(scope.get(id))));
    const dates = challengeDays5({...goal, end}).filter(date => date >= today() && !retained[date]);
    const result = allocate({...goal, dailyMinutes}, dates, pending);
    goal.end = end;
    goal.dailyMinutes = dailyMinutes;
    plan.dates = {...retained, ...result.allocations};
    plan.unallocated = result.unallocated;
    close5();
    persist();
  };
}
