# Lime Adblocker — Base44 dev notes

## What this project is
A **Chrome extension** (Manifest V3), not a server app. There is no backend, no build step, no package manager, and no framework. The repo is plain static files:
- `index.html` — marketing/landing page (this is what the preview serves).
- `popup.html` / `popup.css` / `popup.js` — extension popup UI.
- `background.js` — service worker (declarativeNetRequest blocking).
- `content.js` — cosmetic ad-hiding content script.
- `rules.json` — declarativeNetRequest ruleset (~249 rules).
- `manifest.json` — MV3 manifest.
- `icons/` — extension icons.

## How it runs in Base44
Served as static files by `nginx:alpine` on host port 3000 via `docker-compose.base44.yml`. The repo root is bind-mounted read-only into nginx's html root. No live-reload dev server (static files); call `reload_preview` after edits to refresh the iframe.

## Secrets
None. The extension is fully local; no external services or credentials are required.

## Verifying it works
- `docker compose -f docker-compose.base44.yml up -d`
- `curl -sf http://localhost:3000/` returns the `index.html` landing page.
- The extension itself can only be tested by loading it unpacked in Chrome; the preview shows the landing page only.
