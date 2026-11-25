'use strict';

window.MusesCatalog = (() => {
  const format = 'muses-local-catalog';
  let db;
  let active = null;
  let pending = null;
  let revision = 0;

  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const list = (value, test) => Array.isArray(value) && value.every(test);
  const string = value => typeof value === 'string';
  const strings = value => list(value, string);
  const tuple = Array.isArray;
  const id = value => typeof value === 'string' && /^[\p{L}\p{N}_:.~-]+$/u.test(value);
  const entry = value => object(value) && id(value.id);
  const titled = value => entry(value) && string(value.title);
  const tree = value => titled(value) && (!value.children || list(value.children, tree));
  const word = value => object(value) && string(value['Word / Phrase']) &&
    (!value.Lists || strings(value.Lists)) && (!value.Levels || strings(value.Levels));
  const table = value => object(value) && strings(value.headers) && list(value.rows, tuple);
  const map = (value, test) => object(value) && Object.values(value).every(test);
  const schema = {
    sources: value => map(value, string),
    habits: value => list(value, tuple), seed: value => list(value, word),
    pole: value => list(value, titled), ATLAS_SEED: value => list(value, entry),
    BOOK_SEED: value => list(value, titled), RESOURCE_SEED: value => list(value, titled),
    P90_MOVES: value => map(value, strings), M3_IMAGES: value => map(value, string),
    M3_POLE: value => map(value, object), M3_P90_CHEST: strings, DB4: value => list(value, word),
    curatedRoots6: value => list(value, row => tuple(row) && string(row[0]) && strings(row[1])),
    DRIVE_CATALOG7: value => list(value, row => titled(row) && list(row.tree, tree)),
    ATLAS_LOCAL8: value => object(value) && ['Moves_Master','Transitions','Conditioning','Combos'].every(key => table(value[key])),
    ROUTINES8: value => list(value, tuple), EXTRA_HABITS8: value => list(value, tuple),
    DATA9: value => object(value) && list(value.books, book => titled(book) && list(book.pages, object)) &&
      object(value.refs) && object(value.tech),
    ANATOMY_TR9: value => map(value, string), MUSCLE_TR9: value => list(value, tuple),
    readerMap9: value => map(value, id)
  };

  function validate(pack) {
    if (pack?.format !== format || pack.version !== 1 || !object(pack.data) || !Object.keys(pack.data).length)
      throw Error('Bu dosya desteklenen bir MUSES kaynak paketi değil.');
    for (const [key, value] of Object.entries(pack.data)) {
      if (!Object.hasOwn(schema, key) || !schema[key](value)) throw Error('Paket bölümü geçersiz: ' + key);
      if (Array.isArray(value)) {
        const ids = value.map(row => row?.id).filter(Boolean);
        if (new Set(ids).size !== ids.length) throw Error('Aynı bölümde yinelenen kimlik var: ' + key);
      }
    }
    return pack;
  }

  function describe(pack) {
    const data = pack?.data || {};
    return [ [data.RESOURCE_SEED, 'kaynak'], [data.DB4, 'sözlük kaydı'],
      [data.DATA9?.books, 'okuyucu kitabı'], [data.ATLAS_LOCAL8?.Moves_Master?.rows, 'atlas hareketi']
    ].map(([rows, label]) => (rows?.length || 0).toLocaleString('tr-TR') + ' ' + label).join(' · ');
  }

  function connect() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('MUSES-Life-Studio', 1);
      req.onupgradeneeded = () => {
        for (const store of ['state','media']) if (!req.result.objectStoreNames.contains(store)) req.result.createObjectStore(store);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function read(key) {
    return new Promise((resolve, reject) => {
      const req = db.transaction('state').objectStore('state').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // Read and rotate both slots in the same transaction, including cross-tab edits.
  function swap(undo) {
    if (!db) return Promise.reject(Error('Katalog için tarayıcı depolaması gerekli.'));
    const next = pending;
    if (!undo && !next) return Promise.reject(Error('Önce bir kaynak paketi seç.'));
    return new Promise((resolve, reject) => {
      const tx = db.transaction('state', 'readwrite');
      const store = tx.objectStore('state');
      let reason;
      tx.oncomplete = resolve;
      tx.onabort = () => reject(reason || tx.error || Error('Paket kaydedilemedi.'));
      const current = store.get('catalog');
      current.onsuccess = () => {
        if ((current.result?.revision || 0) !== revision) {
          reason = Error('Katalog başka sekmede değişti. Sayfayı yenile.');
          tx.abort(); return;
        }
        const write = pack => {
          store.put({pack: current.result?.pack ?? null}, 'previousCatalog');
          store.put({revision:revision+1, pack}, 'catalog');
        };
        if (!undo) return write(next);
        const previous = store.get('previousCatalog');
        previous.onsuccess = () => {
          if (!previous.result) { reason = Error('Geri alınacak katalog yok.'); tx.abort(); }
          else write(previous.result.pack);
        };
      };
    });
  }

  async function change(undo) {
    try {
      await swap(undo);
      location.reload();
    } catch (error) { toast(error.message); }
  }

  function controls() {
    return `<section class="card catalog-card"><h2>Yerel kaynak paketi</h2>
      <p>${active ? describe(active) : 'Kitaplarını, kaynak ağacını ve sözlüğünü bu cihaza ekleyebilirsin.'}</p>
      <label>Paket seç <input type="file" accept=".json,application/json" onchange="MusesCatalog.preview(this)"></label>
      <p role="status" data-catalog-status></p>
      <div class="flex"><button class="primary" data-apply-catalog hidden onclick="MusesCatalog.change(false)">Paketi uygula</button>
      ${active ? '<button onclick="MusesCatalog.exportPack()">Paketi dışa aktar</button>' : ''}
      ${revision ? '<button onclick="MusesCatalog.change(true)">Önceki kataloğa dön</button>' : ''}</div></section>`;
  }

  async function preview(input) {
    const status = input.closest('section').querySelector('[data-catalog-status]');
    const button = input.closest('section').querySelector('[data-apply-catalog]');
    const file = input.files[0];
    pending = null;
    button.hidden = true;
    if (!file) { status.textContent = ''; return; }
    try {
      const pack = validate(JSON.parse(await file.text()));
      if (input.files[0] !== file) return;
      pending = pack;
      status.textContent = describe(pack) + '. Onayladığında bu cihazdaki kaynak kataloğu değişir.';
      button.hidden = false;
    } catch (error) { status.textContent = error.message; }
  }

  async function boot() {
    try { db = await connect(); } catch { /* The application also supports localStorage alone. */ }
    if (db) {
      const current = await read('catalog');
      if (current?.pack) active = validate(current.pack);
      revision = current?.revision || 0;
    }
    const script = document.createElement('script');
    script.src = './studio.js';
    script.onerror = () => { document.getElementById('app').textContent = 'Uygulama dosyası yüklenemedi. Sayfayı yenile.'; };
    document.body.append(script);
  }

  const welcome = () => '<section class="card catalog-welcome"><div><h2>Kendi kaynaklarınla başla</h2><p>Kitapların ve çalışma materyallerin bu tarayıcıda saklanır.</p></div><button onclick="go(\'settings\');document.querySelector(\'.catalog-card\')?.scrollIntoView()">Kaynak paketi ekle</button></section>';
  return {get active() {return active;}, validate, describe, controls, welcome, preview, change, boot,
    exportPack() { if (active) downloadBackup8(active,'muses-catalog'); }};
})();
MusesCatalog.boot().catch(error => { document.getElementById('app').textContent = 'Katalog açılamadı. ' + error.message; });
