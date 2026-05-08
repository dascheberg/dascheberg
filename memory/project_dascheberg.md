---
name: dascheberg website structure
description: Astro static site; games in public/spiele/ as static HTML; nav via BaseLayout.astro
type: project
---

dascheberg.de ist eine Astro-Site (umgebaut von Next.js Pages Router, April 2025).

**Struktur:**
- `src/layouts/BaseLayout.astro` — gemeinsames Layout mit Navbar (Home / Spiele)
- `src/pages/index.astro` — Startseite mit Momo-Bild und OneDrive-Link
- `src/pages/spiele.astro` — Liste aller Spiele
- `src/styles/global.css` — Tailwind-Direktiven + eigene CSS-Klassen (.xnavbar, .page-wrap, .main)
- `public/spiele/*/index.html` — 6 statische HTML-Spiele (Bingo, MagischesQuadrat, Taschenrechner, Würfelmaschine, ZahlenRaten, Rechen-Trainer), alle mit festem Back-Link nach /spiele
- `public/img/momo.png` — Katzenbild
- `tailwind.config.mjs` — eigene Farben (abg-b-*, abg-g-*) und Schriftgrößen
- Build-Output: `dist/`

**Why:** Next.js war zu komplex für die kleine statische Seite. Astro erzeugt reines HTML, kein JavaScript-Framework-Overhead.

**How to apply:** Beim Bearbeiten der Seite immer in `src/` schauen. Spiel-HTML-Dateien liegen in `public/spiele/` und werden unverändert in `dist/` kopiert.
