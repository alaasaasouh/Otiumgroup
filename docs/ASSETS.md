# Asset provenance

All assets used at runtime are included locally. No remote fonts, remote image hotlinks, or third-party scripts are required to view the website.

## Otium identity

- Original: `_archive/otium logo.png`, supplied by the user.
- Web copy: `assets/images/otium-logo.webp`.
- The navigation uses a CSS view of the original mark alongside typeset OTIUM GROUP. The original artwork remains unchanged.
- `assets/favicon.svg` is a small code-drawn circular-and-wave browser icon inspired by the supplied mark, rather than a replacement brand logo.

## Architectural hero

- Created using the built-in image generation tool for this project.
- Original saved in this workspace: `_archive/assets/images/otium-architecture-original.png`.
- Responsive delivery files: `assets/images/hero-1600.webp` and `assets/images/hero-800.webp`.
- This is a conceptual architectural image, not a photograph of an Otium office or property.

Exact generation prompt:

> Use case: stylized-concept. Asset type: full-bleed website hero background for premium Otium Group corporate creative production website. Create an extraordinarily cinematic photorealistic architectural photograph, wide landscape 16:9. A monumental circular portal cut into a sweeping warm sandstone and dark bronze minimalist wall, on the RIGHT HALF of the image, opening toward a quiet hazy golden Mediterranean sea horizon at late sunset. The curved arch is thick and sculptural, a subtle polished bronze inner edge catching sunlight, ascending curved stone steps at lower right, soft light falling diagonally over textured stone floor. The left half of the image is a quiet deeply shadowed warm charcoal wall and floor with ample usable dark negative space for big white typography that will be added in HTML. Architectural Digest art direction, analog film texture, tangible travertine, dramatic chiaroscuro, elegantly imperfect stone detail, warm taupe, charcoal and desaturated gold palette. Refined sophisticated luxurious yet restrained, physically believable monumental architecture. Camera low, wide lens, strong photographic composition, the portal opening occupies the right 45%, no people, no plants, no furniture, no logos, NO TEXT, no graphic overlays, no watermarks. This is a photographic background asset only, not a website screenshot.

## Temporary photography

These are illustrative stock photographs, not Otium projects. The portfolio explicitly identifies them as visual concepts. Replace them with approved client assets for the public portfolio.

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

No films or external video players are loaded unless an approved video URL has been supplied and the visitor opens it.

