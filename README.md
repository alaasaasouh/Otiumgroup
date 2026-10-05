# Otium Group

Static HTML/CSS/JavaScript website with a lazy-loaded React/Mux video player for Production projects.

Live: [Vercel](https://otiumgroup.vercel.app/) · [GitHub Pages](https://alaasaasouh.github.io/Otiumgroup/). Production deploys from `main`.

## Local development

Run `npm ci` for a fresh checkout, then `npm run dev`. Open http://127.0.0.1:4173. The committed pages and player bundle can be previewed without rebuilding.

## Editing

| Content | Source |
| --- | --- |
| Group and company copy | `scripts/client-pages.cjs` |
| Shared page shell and markup | `scripts/render-pages.cjs` |
| Production slideshow | `scripts/production-portfolio.cjs` |
| Video titles, categories, posters, Mux IDs | `data/portfolio.js` |
| Contact configuration | `data/site.js` |
| Language screen | `scripts/home-intro-markup.cjs`, `js/home-intro.js`, `hero.css` |
| Shared and page styling | The five root CSS files |
| Video player source | `src/otium-video-player.jsx` |

Run `npm run build` after editing the player or Production portfolio. For page-copy changes, run `node scripts/render-pages.cjs` (optionally `--home-only` or `--production-only`), then restore deployment metadata with `node scripts/configure-domain.cjs https://alaasaasouh.github.io/Otiumgroup/`.

English, Arabic, and French choices currently all open the English site. Full Arabic/French translation follows finalization of the website. The contact form currently prepares a local brief unless a delivery endpoint is configured.

## Checks

With the local server running: `npm run test:assets`, `npm run test:loading`, `npm run test:navigation`, and `npm run test:portfolio`. Run `npm run test:hero` for scroll animation checks and `npm run test:deployment` to check both live sites. Browser checks require Chrome.

## Deployment

GitHub Pages serves the committed root files. Keep `index.html`, `.nojekyll`, the generated player, and all animation frames in their existing paths.

Vercel runs `npm run build:vercel` and publishes `dist/`. Its output must not be `public/`: that folder contains Production posters only. The staging script keeps development tools, documentation, originals, and dependencies out of the Vercel output.

`dist/` and `preview/` are generated and ignored. Original media, superseded assets, and the presentation are kept in the local-only `_archive/`; back that folder up separately. Do not manually upload ignored folders.

See the [folder guide](docs/FOLDER-GUIDE.md), [current documentation](docs/README.md), and [script guide](scripts/README.md).