# Folder organization

The working website remains at the repository root. Open `index.html` or run `node scripts/serve.cjs` for a local preview.

| Location | Purpose |
| --- | --- |
| `index.html`, page folders | Seven ready-to-host pages |
| `style.css`, `hero.css`, `production.css` | Shared and page-specific styles |
| `assets/` | Used optimized images, local fonts and licenses, favicon |
| `frames/` | Homepage animation JPGs, including mobile versions; keep all of these |
| `data/`, `js/` | Editable content and website behavior |
| `scripts/` | Optional local authoring, image processing, preview and checks |
| `docs/` | Handover, editing guides, asset provenance |
| `_archive/` | Local-only source media, unused alternatives, historical tools and screenshots |
| `presentation/` | Local-only client presentation; excluded from Git |
| `preview/` | Regenerated test screenshots; ignored by Git |

Nothing from the cleanup was permanently deleted. The original video and logo are now `_archive/vid16.mp4` and `_archive/otium logo.png`. The client PDF remains `presentation/OTIUM-GROUP-Website-Presentation.pdf` because Windows prevented moving that folder. Earlier guides may refer to former source locations. Historical presentation tools are preserved in `_archive/scripts`; their old relative paths would need adjusting before reuse.

`_archive` is ignored by Git: back it up separately if you need the original media and presentation on another computer. Live assets and all 290 animation JPGs remain in the website.

## GitHub Pages upload

Commit this repository, excluding the ignored folders. For manual browser uploads, do not select `_archive`, `presentation`, `preview`, or `node_modules`; `.gitignore` does not filter files manually selected for upload.

The website is static and uses relative links, so it can live under a repository subpath. Keep `index.html` at the repository root and preserve the existing folder names. Include `.nojekyll`. Configure GitHub Pages to publish the repository branch's root folder. No React, npm build, or server backend is needed.

Before public launch, replace the illustrative project content, confirm contact details and inquiry delivery, and configure final-domain metadata using `scripts/configure-domain.cjs`. The current contact form prepares a local brief unless a real endpoint is configured. This cleanup does not publish anything or connect the form.
