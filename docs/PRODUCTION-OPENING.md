# Production page opening

The Production page opens with a compact editorial layout: a short introduction, a curved image slideshow, captions, slide counter, pause/play and previous/next controls. Direct links lead to the visual portfolio, capabilities, and contact page. The original portfolio, service accordions, and project previews remain available below.

The slideshow uses the existing local placeholder images. It advances every seven seconds, pauses on hover or keyboard focus, stops when offscreen, and supports swipe and arrow-key navigation. Reduced-motion preferences disable automatic playback.

To replace images or captions, edit `slideData` in `scripts/render-pages.cjs`. Image names refer to the corresponding `assets/images/NAME-800.webp` and `NAME-1600.webp` files. Then run `node scripts/render-pages.cjs --production-only`.

Edit the opening copy in the Production-specific block near the end of that generator. Styling lives in `production.css`; slideshow behavior is in `js/production.js`. The homepage video-scroll animation is independent.
