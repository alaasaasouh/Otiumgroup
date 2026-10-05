# Script guide

Run scripts from the repository root. Keeping these helpers together preserves their relative paths.

| Task | Scripts |
| --- | --- |
| Local preview | `serve.cjs` (`npm run dev`) |
| Production player and portfolio build | `build-player.cjs`, `build-production.cjs` (`npm run build`) |
| Vercel output | `build-site.cjs` (`npm run build:vercel` builds and stages the complete site) |
| Page authoring | `render-pages.cjs`, `client-pages.cjs`, `home-intro-markup.cjs`, `production-portfolio.cjs`, `portfolio-component.cjs` |
| Hosting metadata | `configure-domain.cjs` |
| Localization markup and checks | `localization-markup.cjs`, `check-translations.cjs` (`npm run test:i18n`) |
| Current assets and fonts | `prepare-assets.cjs`, `prepare-fonts.cjs` |
| Homepage frame extraction | `extract-hero-frames.cjs` |
| Original Production media inspection/posters | `inspect-production-sources.cjs`, `prepare-production-posters.cjs` |
| Local asset, loading, animation, and navigation checks | `check-assets.cjs`, `check-loading.cjs`, `check-hero.cjs`, `check-navigation.cjs` |
| Responsive layout/slideshow checks | `check-brand-revision.cjs`, `check-production-opening.cjs` |
| Real Mux playback and recovery checks | `check-portfolio.cjs`, `check-player-recovery.cjs` |
| Live deployments | `check-deployment.cjs` (`npm run test:deployment`); optional URL argument checks one host |

HTTP-based checks require `npm run dev` in another terminal. Browser checks use Playwright Core and installed Chrome. Screenshots and reports go to ignored `preview/`.

Media authoring helpers require the local source originals and optional Sharp/FFmpeg installations. Normal builds and runtime do not require those originals or media tools.

The obsolete concept-site check and YouTube thumbnail downloader are preserved under `_archive/cleanup-2026-10-05/scripts/`. They are no longer active commands.
