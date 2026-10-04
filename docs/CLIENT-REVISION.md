# Client brand revision — 2 October 2026

This is a local review on branch `client-brand-revision`. The published GitHub Pages site remains on `main` and has not been changed.

## Implemented

- Charcoal and mineral-grey surfaces, muted bronze accents, restrained scroll reveals and hover motion.
- Client-led Group positioning, shorter homepage, and the five-company architecture.
- Productions branding, five production formats, process and partner information; existing compact slideshow and clearly labelled concept portfolio retained.
- Full Events page covering live entertainment, corporate events, weddings and private celebrations, with expandable capabilities.
- Luxury, Digital and Experiences preview pages, marked Coming soon.
- About page: people, mission, vision, multidisciplinary approach, philosophy and seven values.
- Updated navigation, inquiry categories, metadata and sitemap. Old Travel URL remains a page linking to Experiences. Old `?type=Production` inquiry links still select Productions.
- Original homepage video-frame animation retained, including reduced-motion fallback.
- Homepage loading screen now offers English, العربية, and Français while the animation prepares in the background. All three open the English site. Full Arabic and French translation is deferred until the website is finalized; see `HERO-ANIMATION.md`.

## Assumptions for review

Productions and Events are treated as active; Luxury, Digital and Experiences are forthcoming. Digital is the provisional company name. London, Doha and Beirut are shown as the client-supplied locations, without inventing addresses or telephone numbers. The 30,000+ capacity claim and incomplete email address are omitted. Stock portfolio images remain illustrative. The contact form still saves a brief locally; it does not deliver inquiries until a real endpoint is configured.

## Editing

New client copy and layouts: `scripts/client-pages.cjs`. Shared page shell and original components: `scripts/render-pages.cjs`. New theme: `brand.css`.

Regenerate with `node scripts/render-pages.cjs`, then restore deployment metadata with `node scripts/configure-domain.cjs https://alaasaasouh.github.io/Otiumgroup/`.

## Revert or publish

The prior live version is preserved at tag `before-client-brand-revision-2026-10-02` and on `main`. Once this revision is committed and the working tree is clean, `git switch main` restores the previous local website without discarding this review branch. Do not use a hard reset. To restore the review later, run `git switch client-brand-revision`.

Publication is a separate next step after review: merge the approved review branch into `main`, then push `main`. Nothing in the local preview publishes automatically.
