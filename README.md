# Otium Group

Seven-page static website using HTML, CSS and vanilla JavaScript. No build required.

Open `index.html`, or run `node scripts/serve.cjs` and visit http://127.0.0.1:4173.

## Editing

- Page markup: `scripts/render-pages.cjs`. Regenerate with `node scripts/render-pages.cjs`; optionally use `--home-only` or `--production-only`.
- Contact details: `data/site.js`.
- Portfolio and capabilities: `data/projects.js`; regenerate after editing.
- Styles: `style.css`, `hero.css`, `production.css`.
- Behavior: `js/`.

See [folder and publishing guide](docs/FOLDER-GUIDE.md), [handover](docs/WEBSITE-HANDOVER.md), [hero animation](docs/HERO-ANIMATION.md), [Production slideshow](docs/PRODUCTION-OPENING.md), and [asset credits](docs/ASSETS.md).

## GitHub Pages

Keep `index.html` and `.nojekyll` at the repository root. In Settings > Pages, choose Deploy from a branch, your uploaded branch, and /(root). [Official instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Exclude `_archive/`, `presentation/`, `preview/`, and `node_modules/` when uploading. Git ignores these automatically, but manual browser uploads do not. Keep all of `frames/`, including its mobile folder.

Original media and unused alternatives are preserved in `_archive/`. The client PDF remains in `presentation/`. Back these local-only folders up separately.

Before launch, replace illustrative portfolio content, confirm contact details and inquiry delivery, and configure your domain with `scripts/configure-domain.cjs`. The form currently saves a local brief unless a real endpoint is configured. The site has not been published.
