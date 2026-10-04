# Otium Group

Static website using HTML, CSS and vanilla JavaScript. No build required.

**Local client revision:** this branch contains the charcoal/grey redesign and updated company structure. The live website remains on `main`. See [review and rollback instructions](docs/CLIENT-REVISION.md).

Open `index.html`, or run `node scripts/serve.cjs` and visit http://127.0.0.1:4173.

## Editing

- Page markup: `scripts/render-pages.cjs`. Regenerate with `node scripts/render-pages.cjs`; optionally use `--home-only` or `--production-only`.
- Contact details: `data/site.js`.
- Portfolio and capabilities: `data/projects.js`; regenerate after editing.
- Styles: `style.css`, `hero.css`, `production.css`.
- Behavior: `js/`.

See [folder and publishing guide](docs/FOLDER-GUIDE.md), [handover](docs/WEBSITE-HANDOVER.md), [hero animation](docs/HERO-ANIMATION.md), [Production slideshow](docs/PRODUCTION-OPENING.md), and [asset credits](docs/ASSETS.md).

## GitHub Pages

Vercel is also connected to this repository. `vercel.json` runs `npm run build:vercel` and publishes `dist/`, containing all website pages and their original asset paths. The output must not be `public/`: that folder contains Production posters only. `scripts/build-site.cjs` stages the site after the player build, excluding source scripts, documentation, local originals, and dependencies. Run `npm run build:vercel` locally to check the deployment output.

Keep `index.html` and `.nojekyll` at the repository root. In Settings > Pages, choose Deploy from a branch, your uploaded branch, and /(root). [Official instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Exclude `_archive/`, `presentation/`, `preview/`, and `node_modules/` when uploading. Git ignores these automatically, but manual browser uploads do not. Keep all of `frames/`, including its mobile folder.

Original media and unused alternatives are preserved in `_archive/`. The client PDF remains in `presentation/`. Back these local-only folders up separately.

Before launch, replace illustrative portfolio content, confirm contact details and inquiry delivery, and configure your domain with `scripts/configure-domain.cjs`. The form currently saves a local brief unless a real endpoint is configured. The site has not been published.
