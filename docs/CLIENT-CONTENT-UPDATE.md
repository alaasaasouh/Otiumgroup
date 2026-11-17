# Client website text update — 18 November 2026

Source: `Otium Nexus Group Website Full Text.docx` in the project root. All 65
non-empty paragraphs were extracted, including headings and placement instructions.
The paragraph numbers preserve their original Word-document positions; four blank
paragraphs are omitted. The source SHA-256 is recorded with the extraction. The
original Word document stays local and is excluded from GitHub; the complete
website-copy extraction and verification report are tracked.

## Placement agreed before editing

| Word paragraphs | Website destination |
| --- | --- |
| 1 | Homepage identity and browser title; “Homepage” is a document label |
| 2–3 | Homepage headline and full group introduction |
| 5 | Our Story button and dialog; “pop-up” is an interaction instruction |
| 6–10 | About Us in Our Story and the About page |
| 11–15 | New Our Name section in Our Story and the About page |
| 16–18 | Group Mission in Our Story and the About page |
| 19–21 | Group Vision in Our Story and the About page |
| 23 | Productions and Events company cards open separate dialogs; full-page links remain available |
| 24 | Full Latin sentence above company cards, in both company dialogs, and in the company directory |
| 26–35 | Productions identity, About Us, Mission and Vision, in its dialog and page |
| 36–42 | All five production format descriptions plus the branded/corporate-content paragraph, in its dialog and page |
| 43–44 | Productions How we work, in its dialog and page |
| 45–46 | Wherever the story is, in its dialog and page |
| 48–58 | Events identity, tagline, About Us, Mission and Vision, in its dialog and page |
| 59–65 | All six event descriptions, in its dialog and page |
| 66–67 | Events How we work, in its dialog and page |
| 68–69 | Local knowledge, in every venue, in its dialog and page |

The group name, page titles, social metadata, contact-page office information and
shared footer use Otium Nexus Group. City references include London, Amman, Beirut,
Cairo, Doha and Riyadh; London is identified as headquarters. No street addresses
or phone numbers were inferred.

## Implementation and preservation

- The English document body is used verbatim. Headings and service descriptions
  are arranged for the existing layouts. The document’s “pop-up” notes are
  implemented as interactions, rather than displayed as customer-facing text.
- Our Story, both company dialogs and the full pages use one source of copy.
- Faithful French and Modern Standard Arabic translations cover every document
  paragraph and the new controls. The existing language picker, saved-language
  behavior and Arabic right-to-left layout remain available.
- The old cleanup rule that stripped “international” was removed. Document copy is
  applied after the existing Production slideshow and portfolio builders, so they
  cannot overwrite it.
- The approved logo, photography, 290 animation frames and video portfolio were
  retained. Company cards remain usable as page links without JavaScript.
- The source and generated pages are prepared for GitHub. The repository's existing
  deployment configuration handles publication after changes reach `main`.

## Editing and verification

| File | Purpose |
| --- | --- |
| `scripts/client-content.json` | Complete numbered English extraction and original-document hash |
| `scripts/client-content.fr.json` | Complete French document translation |
| `scripts/client-content.ar.json` | Complete Arabic document translation |
| `scripts/document-content.cjs` | Shared story, company sections, dialogs and paragraph identifiers |
| `scripts/document-pages.cjs` | Apply document copy to the six page layouts |
| `scripts/sync-client-translations.cjs` | Update runtime translations after editing source translations |
| `scripts/check-client-content.cjs` | Document coverage, all-language content, responsive pages and dialog behavior |
| `docs/client-content-coverage.json` | Generated paragraph-by-paragraph verification report |

Regenerate after editing:

```powershell
node scripts/render-pages.cjs
node scripts/configure-domain.cjs https://alaasaasouh.github.io/Otiumgroup/
node scripts/sync-client-translations.cjs
```

With `node scripts/serve.cjs` running, use `npm.cmd run test:client-content` on
Windows. The check compares every literal paragraph in every assigned destination,
in English, French and Arabic. It checks page widths of 1440, 810, 390 and 320 pixels,
all three dialogs, keyboard dismissal, focus restoration, close buttons, backdrop
dismissal, full-page fallbacks, and access to the sixth Events service. Dialog
screenshots are saved in ignored `preview/`. The asset and navigation checks remain
available through `npm.cmd run test:assets` and `npm.cmd run test:navigation`.
