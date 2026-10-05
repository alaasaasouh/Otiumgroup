# Production video portfolio

> Historical snapshot. For current setup, use the [project README](../../README.md) and [current documentation](../README.md).

## Current implementation

This repository is plain HTML/CSS/JavaScript, not Next.js. It remains compatible with GitHub Pages and needs no React or player library. `Next/Image` cannot run in this codebase; its relevant benefits are supplied with pre-generated 480px/960px WebP thumbnails, `srcset`, responsive `sizes`, lazy loading, explicit dimensions and a reserved 16:9 frame.

Eight user-supplied videos replace the illustrative portfolio. Titles and publisher names were retrieved from YouTube's public oEmbed metadata. All eight are initially assigned to **Podcasts**, per the request; the public titles include a Kuwait Fund film and a Bank Audi series/trailer. Confirm alternative classifications if required. Category tabs include All, Podcasts, Documentary, Web Series, Digital Content and Original Productions; unpopulated categories display an empty state.

## Click-to-load lifecycle

1. Static HTML renders local thumbnails and accessible buttons. No YouTube iframe, SDK, external image request or video media request occurs initially.
2. Clicking a card opens a native fullscreen `<dialog>`, locks background scrolling and displays a loading treatment.
3. Only then does the provider adapter create one `youtube-nocookie.com` iframe. `autoplay=1` requests playback after this explicit user action. Browser policy can still require pressing Play.
4. Closing via the button, Escape or the surrounding area removes the iframe, clears timers, restores scrolling and returns focus to the originating card. Opening another item first disposes the old player.
5. A persistent “Watch on YouTube” link is available for embedding restrictions, network failures or slow connections. Iframe `load` signals document loading, not guaranteed video playback; provider errors remain visible inside the player.

No actual YouTube videos were downloaded or stored. The 16 local thumbnail renditions together total approximately 338 KiB. Thumbnail aspect-ratio boxes prevent image-related layout shifts; this is not a claim of measured field Core Web Vitals scores.

Keyboard note: the native dialog traps page focus and supports Escape while focus is in the parent page/modal controls. A cross-origin YouTube iframe owns its own keyboard events; Escape pressed inside its player may be consumed by YouTube instead. The always-visible close button and outside-click target remain available. Autoplay does not move focus away from the close button.

The opening image slideshow now uses one-second intervals, a quicker reveal and text over each image. It waits when the next image is not ready. Pause, swipe, previous/next, keyboard focus pause and reduced-motion behavior remain. Inactive slide links are inert.

## Configuration and editing

- `data/portfolio.js`: IDs, provider, category, title and publisher. No YouTube API key is required. Do not put API secrets here.
- `scripts/portfolio-component.cjs`: reusable server-side-at-authoring-time card/section renderer.
- `scripts/production-portfolio.cjs`: Production-only integration and overlaid slideshow text.
- `js/portfolio.js`: modal, filters, player lifecycle and provider registry.
- `portfolio.css`: thumbnail effects, fullscreen modal and slideshow presentation.
- `scripts/prepare-portfolio.cjs`: optionally refresh thumbnails using the existing Sharp installation. Downloads only thumbnail images.

After editing data or markup run:

```powershell
node scripts/render-pages.cjs --production-only
node scripts/configure-domain.cjs https://alaasaasouh.github.io/Otiumgroup/
```

Preview with `node scripts/serve.cjs` at `http://127.0.0.1:4173/production/`. Prefer HTTP or HTTPS over double-clicking the file: YouTube requires a valid embedding context/referrer. Production HTTPS hosting supports this. The video owner must allow embedding; regional, age and availability restrictions remain controlled by YouTube.

## Future Mux and Next.js

Data separates `provider` from `videoId`. `window.OtiumPortfolio.registerProvider(name, factory)` is the extension boundary. The factory receives `{project, container, onReady}` and must synchronously return a cleanup function. A future Mux adapter can dynamically import a lightweight player on selection, use a public playback ID, call `onReady`, and dispose all media/listeners on close. Private/signed playback would need a server-side token endpoint; never ship Mux signing keys in static JavaScript. No Mux player is loaded or claimed to be implemented yet.

Hero/background video policy should stay separate from this user-initiated portfolio controller: muted playback, visibility handling, reduced motion, posters and constrained mobile loading need their own component. The homepage frame animation is unchanged.

If this project later moves to Next.js, preserve the data schema, render cards on the server using `next/image`, and port only the modal controller into a client component with one selected-video state. No framework migration is needed for this revision.

## Files

Modified: `production/index.html`, `js/production.js`, `scripts/render-pages.cjs`, `scripts/check-brand-revision.cjs`.

Created: `data/portfolio.js`, `js/portfolio.js`, `portfolio.css`, `scripts/portfolio-component.cjs`, `scripts/production-portfolio.cjs`, `scripts/prepare-portfolio.cjs`, `scripts/check-portfolio.cjs`, this guide, and 16 images under `assets/portfolio/`. Preview screenshots remain ignored by Git.

## Validation

`scripts/check-portfolio.cjs` checks desktop/tablet/mobile layouts, zero initial YouTube requests, all eight iframe selections, one-player-at-a-time behavior, immediate cleanup, filter empty states, Escape/button/outside closing, focus restoration, scroll restoration, and slideshow timing. It substitutes lightweight iframe content for repeatable lifecycle checks; real-provider loading is checked separately and cannot prove availability in every visitor's region.

This revision remains local on `client-brand-revision`; it has not been published.
