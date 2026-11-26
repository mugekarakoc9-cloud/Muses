# MUSES Life Studio — v0.6.1

Personal local-first learning, agenda and fitness application. This working repository contains a personal embedded data archive; **keep it private**. Do not publish through public GitHub Pages. Do not commit personal exports, credentials or backups.

## Run

For private Android and Linux installation, see [KURULUM-OZEL.md](KURULUM-OZEL.md).
Linux packages are produced with `python3 scripts/package-linux.py` and included
as private Actions artifacts after regression checks. They start a loopback-only
server and reuse the installed browser; there is no Codespaces dependency.

Open `index.html` for a local preview. For PWA installation, serve this directory on a fixed HTTPS origin (localhost is suitable for development). Browser data are origin-specific. Export a JSON backup before changing origin or version. Standard JSON backups contain records only. In Settings, choose **Videolarla tam yedek al** to include locally imported P90X videos. Full backups are larger and should be stored privately.

## Check

Run `node tests/check.mjs` (Node 18+). This checks syntax and PWA asset references, not device notifications, microphone or offline behavior in real browsers.

## v0.6.1

Connect the previously missing manifest and service worker registration; use a versioned offline cache and refresh cached application files on successful network requests. Preserve the existing storage keys and embedded archive.

## Next

Split the embedded personal catalog from reusable application code; add browser regression tests and a native notification layer. Expand verified source hierarchies, media and dictionary metadata. Direct assistant integration is not implemented.

## 0.7 — Daily Studio / Learning Quest
- One-time local catalog snapshot: English Main Plan, ALL RESOURCES and _CATALOG; 2,465 populated source rows, one exact duplicate removed. 59 source groups enriched, existing resource IDs retained, 67 sources overall. 2,788 currently trackable units across all sources, including numbered/plan-only units retained from earlier versions. Some Drive entries are only group labels or approximate page ranges; this is not a claim that every book's table of contents is complete.
- TickTick snapshot: 1–45 and 47 marked completed; task 46 is still open despite a completion-time field. The open task is seeded once, with the existing source scope. The four weekly selection checklist entries are provided as a reusable template, not new completed history.
- Animated SVG companion, daily focus queue, scalable responsive UI, resource-specific learning path, local focus timer and clickable activity analytics. Keyboard: N new task, T today, O focus (outside input and flashcard views). Reduced-motion preference respected.
- Offline cache version updated. Existing local backup key retained. Source-tree migration preserves exact matching titles and existing IDs when unambiguous; unmatched old completion IDs remain in the backup, not credited to different topics. Export a JSON backup before migrating. IndexedDB persistence and notifications still need on-device testing. Private project; do not publish the personal embedded data.

## v0.8 — Integrity and offline atlas
- Local atlas snapshot: 377 movement records, 3,034 transitions, 54 combos, 1,508 conditioning records, 18 family mappings. Distinguish published from other transition records; these source labels are not independent medical or movement validation.
- Year view, fixed routine agenda, shared P90X/English habit summaries, direct resource completion dialog, correct plan-versus-unplanned metrics and plan-to-date adherence.
- Reading monthly goal, 12-month personal photo journal, validated backup import with recovery snapshot, stable fullscreen host, live data-quality inventory.
- See `DENETIM.md` for the full requirements audit, limitations and test coverage. The standalone file embeds private catalog data; use a private repository only.


## v0.9 — One Flow / Reader
- Four main areas: Bugün, Öğren, Hareket, Yaşam; nested screens remain accessible.
- Active flashcard, resource, and reader duration ledger; day/week/month/year aggregation, inactivity and visibility pause, no focus-timer double counting in duration summary.
- Stable source leaf schedules and goal-linked monthly/weekly/12-month paths, separate actual counts.
- Five private local reader books, text speech for four, scanned page images for one; bookmarks, font/rate, notes, local word lookup, TXT import and reader/source progress sync. EPUB progress measured in sections, not fixed pages.
- 377 bilingual family-level anatomy records, 59 heading-matched detailed anatomy references and 319 heading-matched technique page references. Reference pages may include adjacent moves. Full individual anatomical validation and complete translations of original source prose are not yet available.
- Light/dark theme contrast and reduced-motion support.

### Verification and limitations
Controlled Chromium with mocked localStorage and blocked external requests: 16 screens, active-duration accounting, four calendar views, stable seven-unit goal allocation, reader marks in both directions, unique reading logs, scoped reader goal, dark theme and mobile width. Real device storage persistence, TTS voices, background notifications and microphone/audio quality are not validated. Five reader files are private user-source derivatives; never publish this repository or bundle.

## v0.10 — Reader Lens & Live Goal Tree

- Click text words or select phrases and sentences in the local reader. The popup shows existing Turkish meanings, POS, IPA, English definitions, synonyms, antonyms, examples, usage and etymology where available. Select the expression type and save a single normalized entry or associate an existing lexical sense with a book deck. Book context and contextual translation are selectable flashcard fields.
- Browser Translator API (when available) and opt-in MyMemory translation; Free Dictionary API for missing lexical fields. Translation and dictionary results are saved locally. External access defaults off. Live provider availability and quality are not guaranteed. Image-only scans are not selectable.
- Parallel TR-left/EN-right reading, selection translation, keyboard word selection, return from card to same book page.
- Today → Yol Haritam: goal, period and date branches for all modules and agenda plans; date leaf routes to the appropriate study or workout. Daily/limit goal counts are days, not units.
- Tests: syntax/catalog, 16-screen controlled browser smoke, duplicate prevention, source-linked completion, P90X routing, reader return, keyboard/selection, simulated dictionary and translation API responses and cache. Actual external services, native notifications and physical-device persistence are not verified.

## P1 geliştirme dalını yerelde açma

Depo dizininde `python -m http.server 8765 --bind 127.0.0.1` çalıştır ve [localhost:8765](http://127.0.0.1:8765) adresini aç. Yerel önizleme kendi tarayıcı depolama alanını kullanır. Mevcut kurulumun verileri farklı bir origin'deyse kayıtları yalnızca kendi yedeğin üzerinden içe aktarabilirsin.

- **Bugün → Ara veya görev ekle**, varsayılan kısayol `Ctrl/⌘+K`.
- **Hedeflerim → Yeni hedef → Süreye göre planla**, günlük bütçe ve birim tahminiyle toplam çalışma hedefi oluşturur.
- **Ajanda**, erteleme geçmişini ve dört dönem görünümünde etkinlik süresini gösterir.
- **Yaşam → Ayarlar → Görünüm ve komut kısayolu** görünüm tercihlerini kaydeder.
- Kabul testi için Playwright ve Chromium ile `python tests/p1-studio.py` çalıştır.

## Planlanan özellik — MUSES kedi arkadaşı / ödül ekonomisi (25 Kasım 2026)

Bu bölüm uygulanmış özellik değil, geliştirme gereksinimidir.
- Tamamlanan her benzersiz planlı görev örneği için 1 mama hakkı. Tekrarlı görevler tarih ve örnek kimliğiyle ayrılır; yeniden işaretlemek ödülü çoğaltmaz, ana ve alt görevler çift ödül üretmez. Geçmiş kayıtlar otomatik mama üretmez.
- Mama cüzdanı; kullanıcı isteyince bir hak harcayarak kediyi besler. Hediye, oyuncak, etkinlik ve ödül geçmişi aynı kompakt menüde. Görev yapılmadığında kedi cezalandırılmaz.
- Kısa dokunma miyavlama, okşama mırlama, sürükleme pati animasyonu. Masaüstünde sağ tık, mobilde uzun basma, klavye ile erişilebilir ikon menüsü: mama, hediye, oyun, ruh hali, ses ve geçmiş. Dışarı dokunma/Escape ile kapanır.
- Uyku, neşe, oyun, sakin, merak, kutlama modları; farklı sesler, ses seviyesi, sessiz mod ve azaltılmış hareket tercihi.
- Pointer Events ile dokunmatik sürükleme; tıklama ve sürükleme ayrımı, ekran sınırları ve güvenli alanlar, ajanda görevleri ve kedi katmanları çakışmaz; menü ekran dışına taşmaz.
- Mama bakiyesi, ödül geçmişi, mod, konum ve ses tercihleri mevcut yerel kayıt/yedek sistemine geriye uyumlu eklenir. Eski kayıtlar korunur. Mobil sürükleme, çift ödül engeli, yedek geri yükleme, ses ve çakışma testleri gereklidir.
