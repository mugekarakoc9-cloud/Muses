# MUSES Life Studio — v0.6.1

Personal local-first learning, agenda and fitness application. This working repository contains a personal embedded data archive; **keep it private**. Do not publish through public GitHub Pages. Do not commit personal exports, credentials or backups.

## Run

Open `index.html` for a local preview. For PWA installation, serve this directory on a fixed HTTPS origin (localhost is suitable for development). Browser data are origin-specific. Export a JSON backup before changing origin or version. JSON backups do not contain imported video files.

## Check

Run `node tests/check.mjs` (Node 18+). This checks syntax and PWA asset references, not device notifications, microphone or offline behavior in real browsers.

## v0.6.1

Connect the previously missing manifest and service worker registration; use a versioned offline cache and refresh cached application files on successful network requests. Preserve the existing storage keys and embedded archive.

## Next

Split the embedded personal catalog from reusable application code; add browser regression tests and a native notification layer. Expand verified source hierarchies, media and dictionary metadata. Direct assistant integration is not implemented.
