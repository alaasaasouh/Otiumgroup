# Production page opening

The Production page uses a cinematic three-image slideshow with overlaid titles, captions, a slide counter, pause/play, previous/next controls, and links to the portfolio.

The slideshow advances every 1.5 seconds with cinematic transitions. It waits when the next image is not ready. Focus on a slide link, manual pause, offscreen visibility, hidden tabs, and reduced-motion preferences suspend automatic movement. Hovering or using the controls does not stop cycling. Swipe and arrow-key navigation remain available.

Edit `sceneData` in `scripts/production-portfolio.cjs` to change the images and overlaid copy. Images refer to `assets/images/NAME-800.webp` and `NAME-1600.webp`. Run `node scripts/render-pages.cjs --production-only`, then `node scripts/configure-domain.cjs https://alaasaasouh.github.io/Otiumgroup/` to restore hosting metadata.

The underlying Production sections come from `scripts/client-pages.cjs` and the shared page generator. Slideshow behavior is in `js/production.js`; styling spans `production.css`, `portfolio.css`, and `brand.css`.

Run `node scripts/check-production-opening.cjs` for responsive slideshow checks. See [MUX-PROJECTS.md](MUX-PROJECTS.md) for the current video portfolio.
