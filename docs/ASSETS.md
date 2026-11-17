# Asset provenance

All assets used at runtime are included locally. No remote fonts, remote image hotlinks, or third-party scripts are required to view the website.

## Current client photography — 17 November 2026

The approved photo selection replaces all stock delivery images and the architectural hero.
Sources are the 37 original JPEGs supplied in `Otium Nexus Website Photos Enhanced.zip`,
organized without modifying their bytes in `Client Photos - Review/`. The source map is
`scripts/client-photo-manifest.cjs`; run `node scripts/prepare-assets.cjs` to reproduce the
800/1600-pixel WebP copies. This command no longer downloads stock photographs.

| Delivery key | Supplied filename | Current placement |
| --- | --- | --- |
| hero | home_hero_1_london.jpg | Homepage fallback and default social image |
| production | productions_hero.jpg | Productions opening and company cards |
| events | site_event_baalbek_concert.jpg | Events company cards |
| production-podcast | productions_podcast_studio.jpg | Podcast slide |
| production-documentary | productions_documentary_doha.jpg | Documentary slide |
| event-concert | events_hero_concert.jpg | Live-entertainment slide |
| event-corporate | events_corporate_launch.jpg | Corporate-events slide |
| event-wedding | events_wedding.jpg | Wedding slide |
| story-about | popup_about_us.jpg | About chapter and story dialog |
| story-mission | popup_our_mission.jpg | Mission chapter and story dialog |
| story-vision | popup_our_vision.jpg | Vision chapter and story dialog |
| landscape | natgeo_qatar_desert.jpg | Hero source / retained image alias |
| travel | home_hero_3_beirut.jpg | Hero source / retained image alias |

The hero sequence uses London, Qatar desert, and Beirut dinner photos, with deterministic
camera pushes and dissolves. It does not contain AI-generated waves or people movement.
See [the hero guide](HERO-ANIMATION.md). No project credits or National Geographic
affiliation are inferred from the supplied filenames. The eight actual film posters
remain paired with their original portfolio videos, and the supplied logo is unchanged.

Previous delivery images and all original hero frames were backed up under
`_archive/client-photo-update-2026-11-17/`. The following sections describe historical
assets and their provenance; the portal and stock photographs are no longer displayed.

## Otium identity

- Original: `_archive/otium logo.png`, supplied by the user.
- Web copy: `assets/images/otium-nexus-logo.png` (approved supplied artwork; preserve unchanged).
- Headers, the opening screen, footers and the contact page use the complete supplied OTIUM NEXUS GROUP wordmark. Its artwork is unchanged.
- `assets/favicon.png` is derived from the central I in the supplied logo by `scripts/build-brand.cjs`.

## Architectural hero

- Created using the built-in image generation tool for this project.
- Original saved in this workspace: `_archive/assets/images/otium-architecture-original.png`.
- Responsive delivery files: `assets/images/hero-1600.webp` and `assets/images/hero-800.webp`.
- This is a conceptual architectural image, not a photograph of an Otium office or property.

Exact generation prompt:

> Use case: stylized-concept. Asset type: full-bleed website hero background for premium Otium Group corporate creative production website. Create an extraordinarily cinematic photorealistic architectural photograph, wide landscape 16:9. A monumental circular portal cut into a sweeping warm sandstone and dark bronze minimalist wall, on the RIGHT HALF of the image, opening toward a quiet hazy golden Mediterranean sea horizon at late sunset. The curved arch is thick and sculptural, a subtle polished bronze inner edge catching sunlight, ascending curved stone steps at lower right, soft light falling diagonally over textured stone floor. The left half of the image is a quiet deeply shadowed warm charcoal wall and floor with ample usable dark negative space for big white typography that will be added in HTML. Architectural Digest art direction, analog film texture, tangible travertine, dramatic chiaroscuro, elegantly imperfect stone detail, warm taupe, charcoal and desaturated gold palette. Refined sophisticated luxurious yet restrained, physically believable monumental architecture. Camera low, wide lens, strong photographic composition, the portal opening occupies the right 45%, no people, no plants, no furniture, no logos, NO TEXT, no graphic overlays, no watermarks. This is a photographic background asset only, not a website screenshot.

## Temporary photography

These are illustrative stock photographs used for website backgrounds and company imagery, not Otium projects. The current Production portfolio uses posters extracted from the supplied videos; see [the source audit](PRODUCTION-SOURCE-AUDIT.md) and [Mux guide](MUX-PROJECTS.md).

| Local key | Subject | Source |
| --- | --- | --- |
| production | A clapperboard on an outdoor film location | https://images.unsplash.com/photo-1485846234645-a62644f84728 |
| events | Concert crowd and stage lights | https://images.unsplash.com/photo-1506157786151-b8491531f063 |
| travel | Contemporary villa beside a swimming pool | https://images.unsplash.com/photo-1613490493576-7fde63acd811 |
| landscape | Mountains | https://images.unsplash.com/photo-1464822759023-fed622ff2c3b |
| set | Cinema interior; included as an unused alternate | https://images.unsplash.com/photo-1489599849927-2ee91cede3ba |
| architecture | Interior; included as an unused alternate | https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 |

Each image has a local original JPG and optimized 800/1600-pixel WebP versions. The website requests appropriately sized versions and lazy-loads imagery below the opening section.

## Typography

- **DM Sans**, weights 400, 500, 600, 700. Source: Google Fonts. License: `assets/fonts/DM-Sans-OFL.txt`.
- **Instrument Serif**, normal and italic. Source: Google Fonts. License: `assets/fonts/Instrument-Serif-OFL.txt`.
- Both are bundled locally with `font-display: swap`.
- Runtime uses six WOFF2 files. The unused TTF originals and old download stylesheet are preserved in `_archive/cleanup-2026-10-05/assets/fonts/`.

The superseded YouTube thumbnail set is preserved in `_archive/cleanup-2026-10-05/assets/portfolio/`. Current Production posters remain at `public/images/production/projects/`.

No films or external video players are loaded unless an approved video URL has been supplied and the visitor opens it.

