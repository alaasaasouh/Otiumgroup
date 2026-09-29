OTIUM GROUP — WEBSITE HANDOVER

This guide describes the website delivered in this folder, how its parts work, what is temporary, and how to update it. It reflects the current files rather than every feature suggested in the original brief.

**Current status:** the seven-page design and frontend are implemented. The project is a local website ready for content review. It has not been published to a public domain, connected to an actual inquiry service, or populated with approved Otium films and projects.

**1. Opening the website.** Start with the root `index.html`, not an HTML file inside `scripts/`. You can double-click it to open the site directly. Keep the entire folder together so that its relative links, fonts, images, and scripts continue to work.

For a local server, open a terminal in this folder and run:

```sh
node scripts/serve.cjs
```

Then visit `http://127.0.0.1:4173`. This address works on the computer running the server; it is not a public website address. The server must remain running. Ctrl+C stops it. Node is needed for this optional preview method, but not for opening the HTML directly or for serving the finished files on a static host.

**2. What was followed from your files.** The supplied brief guided the Group / Production structure, premium visual direction, and initial scope. The frontend-design document guided typography, composition, and restrained animation. Your direct instruction to use HTML, CSS, and vanilla JavaScript took precedence over the brief's React / Next.js suggestion. The video-to-website workflow was deferred as you requested. The implementation also avoids dependency on the template's CDN libraries: it uses native browser features instead.

**3. The seven pages and their content.** All seven share the Otium identity, navigation, mobile menu, footer, and responsive styling.

| Page | What is inside | What to review or replace |
| --- | --- | --- |
| Home — `index.html` | Full-screen architectural opening; “Many worlds. One vision.”; two introduction links; Production feature link; People / Ideas / Businesses strip; Group introduction; three division panels; large Production feature; three values; oversized moving text; contact call to action. | Final positioning, headline, Group introduction, values, division names, and imagery. |
| About — `about/index.html` | “A wider perspective.”; architectural image; introduction to the Group; “Better, together.”; outlook statement; shared values. | Approved company description, mission, vision, and story. No founding date, size, offices, achievements, or history were assumed. |
| Divisions — `divisions/index.html` | Large introduction and three substantial image / text rows: Production, Travel, Events. Production leads to the complete division experience. Travel and Events lead to coming-soon pages. | Confirm official division names, descriptions, status, and destinations. Update the “01 active division” text when this changes. |
| Production — `production/index.html` | Three-image slideshow; “Beyond the ordinary.”; production introduction; five expandable capabilities; four portfolio concepts; five filter choices; project lightbox; showreel section; project inquiry link. | Real slide photographs, approved services, real project entries and film links, official showreel, final copy, and all concept labels. |
| Travel — `travel/index.html` | Full-screen photo; “Beyond boundaries.”; coming-soon message; return-to-Group link. | Confirm the name, direction, and image. This page has no travel products, booking, or itinerary system. |
| Events — `events/index.html` | Full-screen event image; “Made to be felt.”; coming-soon message; return-to-Group link. | Confirm the name, direction, and image. This page has no event calendar or ticketing. |
| Contact — `contact/index.html` | “Good things begin with hello.”; introductory copy; supplied logo; place for approved contact details; inquiry form; downloadable brief result. | Real contact and social details, inquiry delivery service, final form wording, and any required privacy content. |

The header contains Group, Production, Divisions, About, and a “Let's talk” link. On phones it becomes a full-screen menu. The footer includes navigation, division links, an inquiry call to action, a copyright year that updates in JavaScript, and Back to top.

**4. Visual identity and assets.** The design uses charcoal, warm ivory, muted gold, generous spacing, large sans-serif headlines, and italic serif emphasis.

| Design item | Current choice | Where it is controlled |
| --- | --- | --- |
| Dark background | `#171a17` | `--dark` in `style.css` |
| Dark text | `#20231f` | `--ink` |
| Light background | `#f0efe9` | `--paper` |
| Secondary light background | `#e6e3d9` | `--cream` |
| Gold accent | `#c6aa7b` | `--gold` |
| Secondary text | `#65695f` | `--muted` |
| Main font | DM Sans | Local fonts and font rules in `style.css` |
| Editorial font | Instrument Serif | Local fonts and font rules in `style.css` |

The original `otium logo.png` is preserved. The website uses `assets/images/otium-logo.webp`, an optimized copy. The navigation displays a CSS crop of the supplied mark beside typeset OTIUM GROUP. The contact page also displays the complete logo image on larger screens. `assets/favicon.svg` is a small browser-tab icon inspired by the logo; it can be replaced by an official brand favicon later.

The architectural hero is an AI-generated concept, not an Otium building or office. Its original file is `assets/images/otium-architecture-original.png`; its delivery versions are `hero-800.webp` and `hero-1600.webp`. The exact prompt and built-in image tool provenance are recorded in `ASSETS.md`.

All other active photographs are temporary Unsplash images. Source URLs and bundled font licenses are documented in `ASSETS.md` and `assets/fonts/`. No stock photograph is presented in the portfolio as an approved Otium project.

**5. Motion and interactions.** These effects are implemented:

- Staggered headline, copy, and button entrance on the opening screens.
- One-time reveals as sections enter the viewport.
- Different reveal directions and subtle scaling.
- Slow image scaling on division and portfolio hover.
- Small arrow and button hover changes.
- A horizontally moving text strip on the homepage, linked to ordinary scrolling.
- A header that becomes fixed and dark after scrolling.
- Browser-native page crossfades where the browser supports them; ordinary navigation elsewhere.
- A Production slideshow with image-mask transitions, changing captions, progress line, arrows, pause control, keyboard arrows, and horizontal touch gestures.
- Portfolio filtering without reloading the page.
- Expandable capability descriptions.
- Project and showreel dialogs with Escape-to-close and focus restoration.

The slideshow uses seven-second intervals. It pauses while hovered, while focus is within it, when it is offscreen, or when the tab is hidden. Visitors who request reduced motion start with the slideshow paused and have entrance effects disabled. Both the JavaScript timer and CSS progress duration must be updated together if the interval changes.

Scrolling remains native. There is no video-frame scrubbing, canvas frame sequence, GSAP, Lenis, React, or external animation library. Page-transition support varies by browser; the content remains usable without that effect.

**6. Current Production content.** The slideshow shows a film clapperboard, a live event, and an architectural villa. Its source is the `slideData` array in `scripts/render-pages.cjs`.

The five proposed capabilities are Creative direction, Film & commercial, Branded content, Event production, and Post-production. Their names and descriptions are in `window.OTIUM_SERVICES` in `data/projects.js`. These should be approved or replaced before being presented as the company's service offering.

| Current portfolio concept | Category | Image key |
| --- | --- | --- |
| In the making | Film | `production` |
| After hours | Events | `events` |
| Another perspective | Commercial | `travel` |
| A world apart | Branded content | `landscape` |

The filter choices are All, Film, Commercial, Events, and Branded content. Counts are generated from the project entries. Category names must match exactly between each project and the filter list. The filter list itself is currently written explicitly in `scripts/render-pages.cjs`; a new category is not automatically added as a button.

Projects open in dialogs on the Production page. They do not have separate project pages or individual shareable project URLs. The current `year` and `featured` data fields are reserved data: changing them does not change the displayed date, order, or size. Project order follows array order, and the alternating grid layout follows position. Client credits and supporting image galleries would need additional markup if required.

**7. Adding approved projects and videos.** For each real project, collect its title, category, short description, approved cover image, meaningful image description, and embeddable film URL where applicable. Keep a stable unique `id` for each entry.

Update the appropriate entry in `data/projects.js`. Its fields mean:

| Field | Purpose |
| --- | --- |
| `id` | Unique identifier connecting a portfolio button with its dialog content. |
| `title` | Project name. |
| `category` | Filter category and displayed category. |
| `image` | Image filename stem, without the size suffix or extension. |
| `videoUrl` | Approved HTTPS Vimeo or YouTube link; empty means no player is loaded. |
| `description` | Text inside the project dialog. |
| `alt` | Description of the cover image for assistive technology. |
| `year`, `featured` | Present in the data but not currently used by the layout. |

Image keys resolve to this pair:

```text
assets/images/your-project-800.webp
assets/images/your-project-1600.webp
```

Prepare matching crops at those widths. Use the same filename stem in `image`. The smaller/larger pair allows the browser to choose an appropriate download. Existing files can be replaced with the same names, but doing so changes every place that uses that image key.

| Shared image key | Current uses |
| --- | --- |
| `hero` | Homepage opening and About image. |
| `production` | Homepage Production thumbnail, division panel and feature; Divisions row; first Production slide; first portfolio concept; default showreel placeholder in the dialog. |
| `travel` | Travel division imagery and coming-soon page; third Production slide; commercial portfolio concept. |
| `events` | Events division imagery and coming-soon page; second Production slide; events portfolio concept; full-width showreel background. |
| `landscape` | Branded-content portfolio concept. |
| `set`, `architecture` | Downloaded alternate images; not currently displayed. |

Use separate image keys when different sections need different photos.

Standard YouTube links, short YouTube links, numeric Vimeo links, and supported embed URLs are handled. The owner must allow embedding. Private Vimeo links that require an extra access hash are not currently handled, and direct MP4 files are not accepted by this player. Those would require a player update. Video titles and captions should be checked on the chosen hosting service when the actual films are supplied.

The video player is created after a visitor opens a project and is removed on close. No original master video is downloaded on the opening page. Until a valid link is provided, a clearly identified preview message appears.

For the official showreel, edit `showreel.videoUrl`, `showreel.title`, and `showreel.description` in `data/site.js`. `showreel.thumbnail` controls the dialog's fallback poster; the large background photograph on the page is separately set in `scripts/render-pages.cjs`.

**Replacing media does not remove draft wording automatically.** When approved work is ready, update the portfolio introduction, “VIEW CONCEPT,” “Visual concept,” button accessibility labels, capability note, and showreel coming-soon note in the page authoring file. Update the dialog fallback wording in `js/production.js` if some final projects will have images but no film. Otherwise an approved image-only project will still receive the concept message.

The initial brief sets editorial scope targets of up to six hero slides, twelve capabilities, twenty projects, six filters including All, and three coming-soon divisions. These are scope limits, not restrictions enforced in code. The current delivery has three slides, five capabilities, four project concepts, five filters, and two coming-soon pages.

**8. Contact details and inquiry delivery.** The contact settings are in `data/site.js`. The fields currently left empty are `email`, `phone`, `address`, `instagram`, `linkedin`, and `formEndpoint`.

Filling in contact details shows them on the Contact page. Email and phone become clickable links; social links require full HTTPS addresses. These settings do not automatically add social/contact links to the global footer. A WhatsApp link is not implemented yet and can be added once the number and preferred placement are known.

The form asks for name, company, email, phone, inquiry type, and a message. Name, email, type, and message are required. Company and phone are optional. It uses browser validation, trims values, and preserves entered information after a delivery error. Production inquiry links preselect the Production option.

Right now the action is “Prepare inquiry.” It creates a local text brief that the visitor can download or copy. Nothing is sent to Otium, emailed, written to a database, or stored by a server. It is not a reservation, booking, or lead-management system.

Adding an approved HTTPS `formEndpoint` changes the action to “Send inquiry.” The frontend sends JSON with:

```text
name, company, email, phone, type, message
```

The handler must accept this format and allow requests from the final website domain. Some form services require a different payload or setup, so a provider adapter may be needed. The UI supports sending, success, error, and a 20-second timeout. Any successful HTTP 2xx response is treated as acceptance by the handler; it is not proof that an email reached an inbox. Test delivery with the actual provider and receiving mailbox before launch. Keep private service credentials out of `data/site.js`, since browser files are public.

Final delivery validation and spam handling belong in the chosen form service. Supply the approved privacy text alongside the contact setup.

**9. Where edits belong.** There are ready-made HTML pages and an optional script that produces their shared markup. It is useful to choose one editing workflow so changes are not lost.

| Change | File to edit | Regenerate pages? |
| --- | --- | --- |
| Phone, email, address, Instagram, LinkedIn | `data/site.js` | No. Reload the browser. |
| Form endpoint | `data/site.js`; `js/contact.js` if the provider needs a different request format | No. Test actual delivery. |
| Existing project video URL | `data/projects.js` | No, provided the existing project ID is unchanged. |
| Existing project dialog description | `data/projects.js` | No for dialog text. Regenerate if other visible project fields also change. |
| Project title, category, image, alt text, ID, order, or added/removed entries | `data/projects.js` | Yes. |
| Capability names and descriptions | `data/projects.js` | Yes. |
| Hero slides and captions | `slideData` in `scripts/render-pages.cjs` | Yes. The total slide count is generated automatically. |
| Portfolio category buttons | Filter array in `scripts/render-pages.cjs` | Yes. |
| Headlines, paragraphs, labels, About copy | Page variables in `scripts/render-pages.cjs` | Yes. |
| Header/footer links and shared calls to action | `header()` / `footer()` in `scripts/render-pages.cjs` | Yes. |
| Divisions and their status | `divisionItems`, page copy, footer, and page list in `scripts/render-pages.cjs` | Yes; check all locations. Current active/coming-soon rendering depends on the first division's position, not just the stored `status` string. |
| Colors, type, spacing, image framing, mobile layout | `style.css` | No. |
| Navigation / scroll animation behavior | `js/main.js` | No. |
| Slider / filtering / dialog behavior | `js/production.js` | No. |
| Browser-tab icon | `assets/favicon.svg` | No; browser icon caches may need refreshing. |
| Public domain and sitemap | `scripts/configure-domain.cjs` with the actual URL | Run after regeneration. |

To regenerate the HTML after source-content edits, run this from the project folder:

```sh
node scripts/render-pages.cjs
```

This optional authoring script uses Node's built-in modules. It does not install React or introduce a runtime framework. Visitors receive ordinary HTML, CSS, and JavaScript.

You can also edit a generated HTML page directly. However, running the authoring script later will replace those HTML edits. For repeatable maintenance, keep shared and page content changes in the authoring file and data files, then regenerate. Back up the folder before a larger round of edits.

The Node commands are developer conveniences; they are not required each time a visitor opens the site. No npm installation or build command is needed just to view or host the delivered pages.

**10. What the folders contain.**

| Folder/file | Purpose |
| --- | --- |
| Root `index.html` | Homepage. |
| `about/`, `divisions/`, `production/`, `travel/`, `events/`, `contact/` | Generated static page files. |
| `style.css` | Shared design and responsive rules. |
| `data/` | Contact, showreel, projects, and capabilities data. These files are public browser assets. |
| `js/` | Native JavaScript interactions. |
| `assets/images/` | Optimized imagery and reference originals. |
| `assets/fonts/` | Locally hosted fonts and license files. |
| `assets/favicon.svg` | Browser-tab icon. |
| `scripts/serve.cjs` | Optional local preview server. |
| `scripts/render-pages.cjs` | Optional shared-page authoring utility. |
| `scripts/configure-domain.cjs` | Canonical URLs, social image URLs, sitemap, and robots configuration. |
| `scripts/prepare-assets.cjs` | Development download/optimization utility using Sharp. Prepared images are already supplied. |
| `scripts/check-site.cjs`, `scripts/check-navigation.cjs` | Development browser checks using an installed Playwright package and Chrome. |
| `preview/` | Screenshots and saved browser-check results; not required by the website. Some screenshots intentionally show test interaction states. |
| `robots.txt`, `.nojekyll` | Static-host publishing helpers. |
| `README.md`, `ASSETS.md`, `WEBSITE-HANDOVER.md` | Quick setup, asset provenance, and this detailed guide. |

**11. What has been tested, and the limits of those checks.** The saved browser run passed all seven pages at viewport widths of 1440, 768, 390, and 320 pixels. It checked horizontal overflow, navigation, slider controls and pause, portfolio filters, expandable services, modal opening/closing, deferred embeds and cleanup, mobile menu behavior, reduced motion, local-file opening, inquiry validation, and downloadable brief content. Optional inquiry delivery success and failure were tested with intercepted responses; no real inquiry was sent. Separate checks covered the skip link, keyboard focus inside the mobile menu, and Back to top. Local linked assets were checked for missing files.

These are Chrome browser checks and viewport simulations. They are not a formal accessibility audit, a Safari/Firefox certification, a physical-device test report, or a performance-score guarantee. Real films and actual email delivery cannot be fully tested until supplied/configured. The recorded results are in `preview/checks.json`.

The implementation includes visible keyboard focus, a Skip to content link, form labels, image descriptions, Escape handling, reduced-motion support, and preserved user zoom. Responsive images, local fonts, and deferred players reduce unnecessary initial downloads.

**12. Publishing and search metadata.** The site is still local. The preview address is not the final domain. The delivered pages already contain unique titles and descriptions, social-sharing metadata, language and viewport settings, and semantic content. No live-domain canonical links or sitemap were invented.

Once the approved public address is available, run this after any page regeneration, substituting the real address:

```sh
node scripts/configure-domain.cjs https://YOUR-APPROVED-DOMAIN/
```

This sets canonical page addresses, absolute social-preview image URLs, `sitemap.xml`, and the sitemap entry in `robots.txt`. A deployment subfolder can be included. Adding a new page later requires adding it to this script's page list. Running the page generator afterward will replace the configured HTML metadata, so run domain configuration last.

Publish the HTML pages and their folders, `style.css`, `data/`, `js/`, required `assets/`, `.nojekyll`, `robots.txt`, and the generated `sitemap.xml`. Developer scripts, screenshots, and original high-resolution reference files do not need to be publicly hosted. The site requires a static host; an application server or database is not needed for the existing pages.

**13. What to provide next, in practical order.**

1. Confirm Otium's official positioning, company description, values, and division names. Travel and Events are based on examples in the brief.
2. Approve the layout, wording direction, and use of the generated architectural hero.
3. Supply approved Production hero photographs and the final service list.
4. Supply the first real projects: title, category, description, cover, image description, and Vimeo/YouTube link where applicable.
5. Supply the official showreel link and poster image.
6. Supply public contact details and social profile addresses. Say whether a WhatsApp link is wanted.
7. Choose the inquiry receiving address and configure an approved form delivery service.
8. Remove or rewrite the concept / proposed / coming-soon notices only for content that is actually finalized. Coming-soon divisions can retain their status.
9. Supply approved client logos and testimonials if those sections should be added; they are not currently included.
10. Confirm the public domain and hosting destination, configure search metadata, and verify the published site, actual video embeds, and real inquiry delivery.

**14. Homepage motion update.** The homepage hero now includes a frame-by-frame scroll animation from the supplied `vid16.mp4`, with desktop/mobile JPG frames, a short pinned section, and static reduced-motion fallbacks. See `HERO-ANIMATION.md` for editing and extraction instructions. Other pages retain their original behavior. Earlier client presentation statements describing this effect as deferred are superseded by this update.

Other possible later work includes complete Travel or Events experiences, individual project pages, approved client/testimonial sections, additional inquiry links, or multilingual content. None of those are silently enabled by the current data files. A CMS, admin panel, login, database, online shop, payments, booking engine, blog, analytics, and an Arabic version are not part of this delivery.
