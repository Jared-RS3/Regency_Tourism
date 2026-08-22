# Regency Tourism — Website & Trade Lead Capture

Daybreak proposal `DB-RGT-001 · V1`. Built to the house spec in
[PROPOSAL-SYSTEM.md](PROPOSAL-SYSTEM.md).

| | |
| --- | --- |
| Pages | 14 |
| Quoted | Phase 01 — R25,000 excl. VAT (50 h × R500 packaged rate) |
| Priced, not quoted | 9 roadmap items — R170,850 excl. VAT at R850/h |
| Delivery | Static site, no build step. `publish = "."` |
| Output | Scrolling deck + `window.print()` → A4 PDF, one section per sheet |

## Files

```
index.html        14 × .proposal-page, no figures typed into the markup
styles.css        house tokens, components, print rules
script.js         proposalData · rates · phaseLines · roadmap · thirdParty · care
netlify.toml      publish = "."
assets/           cover.jpg, process.jpg, concept-1..5.jpg
```

## Changing the numbers

Everything derives from **hours × rate**, in `script.js` only:

- `standardRate` (850) · `packageRate` (500) · `supportRate` (850)
- `phaseLines.p1` — `[name, hours, description, workstream]`. Edit an hour count
  and the ledger, the workstream bar, the subtotal, the package adjustment, the
  deposit and the year-one figure all re-derive.
- `roadmap` — `[name, hours, description]`, costed at `standardRate`.
- `thirdParty`, `care` — the running-costs page.

No figure appears in `index.html`. The values in `[data-fill]` elements are
JS-off fallbacks only; `fills` overwrites them.

## Page order

```
01 Cover               light
02 The Brief           light
03 Positioning         dark    ← first weight beat
04 Design Directions   light   concepts 01, 02, 03, 05
05 Recommended Route   light   concept 04 + the borrowing from 05
06 What We Build       light
07 Lead Capture        dark    ← the mechanism
08 Build Plan          light
09 Investment          dark    ← the money
10 The Roadmap         light
11 Running Costs       light
12 Not Included        dark    ← the honesty page
13 Terms & Acceptance  light
14 Closing             split
```

## Concept assets

`assets/concept-*.jpg` are regenerated from the source PNGs at 1400 px / q82.
`cover.jpg` is a de-chromed, desaturated crop of Concept 02; `process.jpg` is a
Winelands crop of Concept 03 used as the masked art behind page 03.

## Before sending

- [ ] Print preview at A4, scale 100%, background graphics **on**
- [ ] `proposalData` dates and validity correct
- [ ] Trust-bar figures confirmed with Regency before they reach a live site
- [ ] Tested at 1280 / 820 / 390 px
