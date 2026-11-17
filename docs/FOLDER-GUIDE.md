# Folder guide

Keep the published page and asset paths stable: both hosts use the same static website layout.

| Location | Purpose |
| --- | --- |
| `index.html` and five page folders | Six published pages covering the group, Productions, Events, companies, about and contact |
| Six root CSS files | Shared styles, brand theme, hero, Production, portfolio, and localization |
| `assets/images/` | Current responsive website images and logo |
| `assets/fonts/` | Six WOFF2 font files and their two licenses |
| `frames/`, `frames/mobile/` | All 290 required animation JPGs |
| `public/images/production/projects/` | Eight current Production posters; preserve this URL path |
| `data/` | Contact configuration, live portfolio, and legacy data still required by the page generator |
| `js/` | Browser behavior and the committed generated player bundle/licenses |
| `src/` | Editable React/Mux player source |
| `scripts/` | Build, page authoring, media preparation, and checks; see its README |
| `docs/` | Current editing and asset guides |
| `docs/brand/` | Approved logo presentation, generation directions, hashes and verification logs |
| `docs/history/` | Earlier handovers and implementation notes, clearly marked historical |
| `_archive/` | Local-only originals, presentation, and superseded assets |
| `preview/` | Regenerable screenshots and inspection output; ignored |
| `dist/` | Generated Vercel output; ignored |
| `node_modules/` | Installed development/build dependencies; ignored |

## Cleanup on 5 October 2026

Unused TTF fonts, their old download stylesheet, the superseded YouTube thumbnails, and two obsolete scripts were moved to `_archive/cleanup-2026-10-05/`. No current page, stylesheet, or runtime script references these assets. The archive includes a move manifest.

The original video and logo remain at `_archive/vid16.mp4` and `_archive/otium logo.png`. The complete client presentation now lives at `_archive/presentation/`, with its HTML, PDF, notes, and relative image links preserved.

Source-inspection material and old Mux verification metadata were preserved in the dated archive. Other generated preview files and the temporary deployment output were cleared. Browser checks recreate screenshots; `npm run build:vercel` recreates the output directory.

`data/projects.js` contains older concept data but is still read by the page generator; it must not be removed until that generator is refactored. Live Production entries are in `data/portfolio.js`.

Archive contents are excluded from Git and deployments. Back them up separately. Files already tracked in Git remain recoverable from history after cleanup.
## Current brand and company setup

### Approved logo and cleanup - 17 November 2026

The website now uses the approved earthy-gradient OTIUM logo at the existing asset path.
The current presentation and audit records live in `docs/brand/`. The two unused root
PNGs and client photo ZIP were archived under
`_archive/brand-update-2026-11-17/loose-originals/`. All concept versions and their
working renders are preserved under `concepts-before-cleanup/` in that same backup.
`Client Photos - Review/` remains in place for visual review and media preparation.

The backup also includes a complete pre-logo-update source ZIP, the original logo and
favicon, and hash manifests. See [the change log](CHANGELOG.md),
[rollback guide](ROLLBACK.md), and [cleanup manifest](brand/cleanup-manifest.json).
Windows is retaining two empty concept working directories locally; all files have
already been archived and their paths are recorded in the manifest.

The approved logo is `assets/images/otium-nexus-logo.png`; `scripts/build-brand.cjs` derives its favicon. Active companies are configured in `scripts/companies.cjs`. Homepage cards and production-format cards have dedicated markup helpers. Removed company directories are not deployed. The superseded logo is preserved under `_archive/cleanup-2026-10-20/`.

## Presentation refinements

`scripts/refine-presentation.cjs` applies the shared interface refinements during generation and the portfolio build. The language selector is in the navbar only; the opening language picker remains. Empty portfolio filters are omitted automatically without deleting service categories or changing video classifications. Decorative card labels and their unused styles were removed. Keep `data/projects.js` and its referenced imagery: the authoring generator still reads them.
