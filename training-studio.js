'use strict';

function installTrainingStudio() {
  const originalPlay = playDVD6;
  const legacyFields = {both:'reps', right:'right', left:'left'};
  const metrics = [
    ['reps','Tekrar',1], ['kg','Ağırlık (kg)',0.1], ['seconds','Süre (sn)',1],
    ['rest','Dinlenme (sn)',1], ['rpe','RPE (0–10)',1]
  ];

  function dailymotionId(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return '';
      const path = url.hostname === 'dai.ly' ? url.pathname :
        ['dailymotion.com','www.dailymotion.com'].includes(url.hostname) ? url.pathname.replace(/^\/(?:embed\/)?video\//, '/') : '';
      return /^\/(x[a-z0-9]+)(?:_[^/]*)?\/?$/i.exec(path)?.[1] || '';
    } catch { return ''; }
  }

  const originalSetup = setDVD6;
  setDVD6 = function (dvd) {
    originalSetup(dvd);
    const label = document.querySelector('#dialog5 label:has(input[name=url])');
    if (label) label.firstChild.textContent = 'YouTube veya Dailymotion bağlantısı';
  };
  const originalSave = saveDVD6;
  saveDVD6 = function (event, dvd) {
    const value = new FormData(event.target).get('url')?.trim();
    if (!dailymotionId(value)) return originalSave(event,dvd);
    event.preventDefault();
    v6().videoLinks[dvd] = value;
    save(); close5(); render();
  };

  playDVD6 = async function (dvd) {
    await originalPlay(dvd);
    const dialog = document.getElementById('dialog5');
    if (!dialog.open) return;
    const remote = dailymotionId(v6().videoLinks[dvd]);
    if (remote && !dialog.querySelector('video')) {
      const player = document.createElement('iframe');
      player.className = 'player6';
      player.src = 'https://www.dailymotion.com/embed/video/' + remote;
      player.title = DVD[dvd];
      player.allow = 'fullscreen; picture-in-picture';
      player.allowFullscreen = true;
      for (const child of [...dialog.children].slice(1)) child.remove();
      dialog.append(player);
    }
    const names = P90_MOVES[dvd] || [];
    const day = pday;
    const runDay = p90key(day);
    const session = () => v2().p90[runDay] ??= {};
    const video = dialog.querySelector('video');
    if (video) {
      const remembered = session().playback?.[dvd];
      const mediaName = v6().mediaNames[dvd];
      if (remembered?.mediaName === mediaName && remembered?.time > 0) {
        const resume = () => { if (remembered.time < video.duration) video.currentTime = remembered.time; };
        if (video.readyState >= 1) resume();
        else video.addEventListener('loadedmetadata', resume, {once:true});
      }
      let lastTime = video.currentTime;
      const remember = () => {
        if (!Number.isFinite(video.currentTime) || (video.readyState === 0)) return;
        lastTime = video.currentTime;
        (session().playback ??= {})[dvd] = {time:lastTime,mediaName};
        save();
      };
      video.addEventListener('timeupdate', () => { if (Math.abs(video.currentTime-lastTime) >= 3) remember(); });
      video.addEventListener('pause', remember);
      video.addEventListener('seeked', remember);
      dialog.addEventListener('close', remember, {once:true});
    }
    const panel = document.createElement('section');
    panel.className = 'training-log';
    dialog.append(panel);
    dialog.classList.add('training-studio');
    dialog.addEventListener('close', () => { if (!dialog.open) dialog.classList.remove('training-studio'); }, {once:true});
    if (!names.length) {
      panel.textContent = 'Bu DVD için yerel pakette hareket listesi bulunmuyor.';
      return;
    }

    let occurrence = Math.min(names.length-1, Math.max(0,Number(session().lastExercise?.[dvd])||0));
    let set = 1, side = 'both', date = session().actualDate || today();
    const initialDay = session().logDate || session().actualDate || today();
    function record(write = false) {
      const key = dvd + '-' + occurrence;
      const slot = date + '/' + key + '/' + set + '/' + side;
      const entry = session();
      if (write) {
        entry.logDate ??= initialDay;
        return (entry.trainingSets ??= {})[slot] ??= {};
      }
      return entry.trainingSets?.[slot] || {};
    }

    function drawFields() {
      const row = record();
      const old = date === initialDay && set === 1 ? session().moves?.[dvd+'-'+occurrence] || {} : {};
      for (const input of panel.querySelectorAll('[data-field]')) {
        const key = input.dataset.field;
        const shared = key === 'reps' ? legacyFields[side] : side === 'both' ? key : null;
        // The standard workout view edits this same first set.
        input.value = (shared && date===initialDay && set===1 ? old[shared] : row[key]) ?? '';
      }
      panel.querySelector('output').textContent = 'Hareket ' + (occurrence+1) + ' / ' + names.length;
      panel.querySelector('[data-prev]').disabled = occurrence === 0;
      panel.querySelector('[data-next]').disabled = occurrence === names.length-1;
    }
    panel.innerHTML = `<h3>Antrenman kaydı</h3><label>Hareket<select name="movement" aria-label="Hareket">${names.map((name,i)=>`<option value="${i}">${i+1}. ${esc(name)}</option>`).join('')}</select></label>
      <div class="training-step"><button data-prev aria-label="Önceki hareket">←</button><output></output><button data-next aria-label="Sonraki hareket">→</button></div>
      <div class="training-fields"><label>Antrenman tarihi<input name="date" type="date" max="${today()}" value="${esc(date)}"></label>
      <label>Set<input type="number" name="set" min="1" max="999" step="1" value="1"></label>
      <label>Taraf<select name="side"><option value="both">Çift taraf</option><option value="right">Sağ</option><option value="left">Sol</option></select></label>
      ${metrics.map(([key,label,step])=>`<label>${label}<input type="number" data-field="${key}" min="0" ${key==='rpe'?'max="10"':''} step="${step}"></label>`).join('')}
      </div><label>Set notu<textarea data-field="note" rows="2"></textarea></label><small role="status"></small>`;
    const movement = panel.querySelector('[name=movement]');
    movement.value = String(occurrence);
    const selectMovement = value => {
      occurrence = value; movement.value = String(value);
      (session().lastExercise ??= {})[dvd] = value;
      save(); drawFields();
    };
    movement.onchange = () => selectMovement(Number(movement.value));
    panel.querySelector('[data-prev]').onclick = () => selectMovement(occurrence-1);
    panel.querySelector('[data-next]').onclick = () => selectMovement(occurrence+1);
    panel.querySelector('[name=date]').onchange = event => {
      if (!event.target.value || !event.target.checkValidity()) {event.target.value = date;return;}
      date = event.target.value; drawFields();
    };
    panel.querySelector('[name=set]').onchange = event => {
      if (!event.target.value || !event.target.checkValidity()) {event.target.value = set;return;}
      set = Number(event.target.value); drawFields();
    };
    panel.querySelector('[name=side]').onchange = event => { side = event.target.value; drawFields(); };
    panel.addEventListener('input', event => {
      const input = event.target, key = input.dataset.field;
      if (!key || !input.checkValidity()) return;
      const value = input.value === '' || key === 'note' ? input.value : Number(input.value);
      const shared = key === 'reps' ? legacyFields[side] : side === 'both' ? key : null;
      if (date===initialDay && set===1 && shared) {
        session().logDate ??= initialDay;
        const moves = session().moves ??= {};
        (moves[dvd+'-'+occurrence] ??= {})[shared] = value;
      } else record(true)[key] = value;
      save();
      panel.querySelector('[role=status]').textContent = 'Set kaydedildi.';
    });
    drawFields();
  };
}
