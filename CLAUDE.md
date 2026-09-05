# Stacking the Deal

Mobile-first teaching app for the Greenbuild session *Stacking the Deal*. Audience: architects and planners who know green building but not real estate finance. It teaches NOI, debt service coverage and leveraged return with one multifamily building, then lets the audience toggle design moves and tax-credit structures against a live proforma.

Owner: Jonathan Arnold, Arnold Development Group. GitHub account for this repo: jarnold-coder.

## Files

- `src/app.html` — the entire app: `<title>`, `<style>`, markup, one `<script>`. No doctype or `<html>/<head>/<body>`; that form is what the Claude artifact viewer expects.
- `build.js` — wraps `src/app.html` into `index.html` (adds doctype, viewport meta, favicon). GitHub Pages serves `index.html`. Always rebuild after editing `src/app.html`; commit both.
- `img/bld/` — the building drawing as layers (WebP, ~630 KB total): facade images `f5`, `f8` and their `-ph`, `-hist`, `-phhist` skins; roof crops `r5-*`/`r8-*` (solar, gardens, both); ground crop `g-geo`; `manifest.json` records crop positions. Generated in Higgsfield from one base elevation with region edits; the build scripts live in the design session's scratchpad, not the repo. Regenerating a layer means a new edit plus the compositor, not a redraw.
- `tools/shoot.js` — phone-sized screenshots via puppeteer-core and installed Chrome. `npm install` once, then `node tools/shoot.js`. Writes `screenshots/` (git-ignored) and prints a layout report (horizontal overflow, nav anchoring). Read the PNGs after any layout change.

## Where it is published

- Live (GitHub Pages): https://jarnold-coder.github.io/stacking-the-deal/ (redeploys on push to `main`)
- Live (Vercel): https://stackingthedeal.com/ (GoDaddy domain, A + CNAME records to Vercel; www redirects to apex; also https://stacking-the-deal.vercel.app/; project `stacking-the-deal`, connected to the GitHub repo; every push to `main` deploys production, other branches get preview URLs; `vercel.json` marks it a static site with no build step)
- The old Claude artifact preview of the app (b33dc332…) is retired; the live domain replaces it.
- Pointer only: `C:\Users\jarno\dev\HNEL_MHDC_Memo\13_stacking_the_deal_app\README.md`. Do not move source there; the HNEL workspace is confidential deal work and this app is public.

## Design (locked 2026-09-05, the "Ledger" direction)

- Type: Geist for headings and every figure (tabular numerals via `.num` and the figure selectors near the end of the stylesheet), Geist Mono only for small tracked labels (`.lab`, tags, nav, status). No Bricolage, no pills, no cards inside cards: rules (`1px var(--line)`, `1.5px var(--ink)` for section and card boundaries), square toggles, text actions (`.tact`), text-only bottom nav with dot indicators.
- The Deal: index-labelled sections (01 The Deal … 08 dials). The elevation `figure.bld` sits on the paper background; `updateBuilding(moves)` picks the facade image by height and skin, positions the roof crop from `BLD.roof`, and shows the ground crop for geothermal. The verdict is a full-bleed `.band`: terracotta `.fail` while the bank says no, green `.pass` once it says yes; below it a sage band with cost, equity (yam) and loan. The gauge is 49 ticks from 0.8× to 2.0× with charcoal ticks up to the reading, a heavier pointer at the value, and the required coverage as the light tall tick. Scrolling compacts the band to a slim strip (`.verdict.compact`, still driven by the sentinel observer).
- Moves: a ledger list. Every card shows a 3×2 metric grid (DSCR, NOI, equity / cost, loan, IRR) always; tapping the heading folds the card (`state.folded`), "Collapse all" folds the list; a switched-on move turns its index, heading and toggle green. "Show the math" opens a full-bleed sage sheet: description, the NOI ÷ payment = DSCR result line, the why paragraph, then ruled before → after → change tables per group. Cost increases show as + in terracotta.
- Dark mode uses the slate palette (`#313841`) with coral and brighter yam; the drawing stays a paper panel.
- Wide screens (≥760px, not stage): the Deal is two columns. `.deal-left` (heading, drawing, facts, both bands) is sticky and scrolls internally if the viewport is short; the drawing is sized from the viewport height (`calc((100dvh - 625px) * .926)`) so both bands stay in view on a laptop; the band's "bank wants" line is hidden there; moves, math sheets and the remaining sections scroll on the right. On phones `.deal-left` is `display:contents` so the compact strip can stick.
- The frame is cropped 11% at the top (`--crop` on `.bld`, `CROP` in JS shifts the roof and ground crops); the tallest state, eight floors with the roof garden, starts about 14% down, so do not crop more.
- The layer images are retoned so their paper equals the page background (#F1F2EC); `retone()` in the asset builder moves the paper fully and the ink about a third of the way. Regenerated layers must go through it or they show as a warm rectangle.
- Text size: the "Aa" button in the top bar steps the root font size through 16, 18 and 20px (`setFs`, remembered in localStorage `std-fs`); the layout is in rem so everything scales. Hidden on stage. On phones the bar drops the Greenbuild tag and the view name to make room.
- Stage mode (projector): `?stage` on the URL, the Stage/Phone button in the top bar (shown ≥900px), or the S key; remembered in localStorage `std-stage`; forces the slate palette. At ≥1000px the Deal becomes three slides (`.pane-1/2/3`, slid with `--pane` on `#view-deal`; `setPane()`, edge arrows, the arrow keys and the tab strip at the foot): slide 1 is the dashboard, three columns aligned top and bottom and sized to the screen height (drawing, verdict band, move list; `fitStage()` sizes the drawing to the room in its column; the band's type scales with `vh`; the slide caps at 1100px tall and centres on taller screens); slide 2 is the capital stack and paycheck; slide 3 the proforma, dials and notes. On phones and the wide layout the panes are `display:contents`. `?stage` also opens on the Deal. In stage the Primer is scaled for a projector (about 1.5× type, 1180px measure; those rules live inside the same ≥1000px stage block as the slides, so a rewrite of that block must keep them) and the hidden views stay hidden: stage layout rules must target `#view-deal:not([hidden])`, or the Deal leaks under the Primer. Screenshot it with a wide viewport; `tools/shoot.js` only covers phones.
- Design canvas with every state: https://claude.ai/code/artifact/2e06147a-6027-44b6-ab76-77c1d13e01d5

## App structure (inside `src/app.html`)

- Views: Primer (six paged lessons), The Deal (dashboard), Glossary, Inputs. Bottom nav switches them; `goView()` and `goStep()` are globals.
- Layout: `#app` is a full-height flex column; `#scroller` owns all scrolling; `.bnav` sits outside it. This keeps the nav anchored inside iOS-embedded frames, which expand to content height. Never switch the nav back to `position:fixed`. The verdict strip compacts via an IntersectionObserver on `.vsentinel` (not scroll events, which never reached the scroller on Jonathan's phone); while compact, `#app.deal-compact` unsticks the brand bar and `.bnav.mini` tightens the nav (labels stay).
- Engine: `calc(moves, assumptions)` returns every number the page shows. `A` holds defaults; `state.a` holds live assumptions (persisted in localStorage `std-a`). Inputs are generated from `SCHEMA`; add a new assumption in `A` and `SCHEMA` and it appears on the Inputs tab.
- Moves: `MOVES` array, `kind: 'design' | 'capital'`. Each has `desc(a)` and `why(a, w)` prose; the math panel diffs the stack with and without the move using `BUDGET_LINES`, `CREDIT_LINES`, `INCOME_LINES`, `OPEX_LINES`.
- Charts are plain HTML (stacked bars, horizontal waterfall, gauge). Palette validated for light and dark; series colors are `--s-debt`, `--s-credit`, `--s-equity`.

## Model conventions Jonathan approved (do not change silently)

- Baseline must fail underwriting (about 1.12× DSCR at 70/30); the five design moves together must pass.
- Loan sizing: start at the loan-to-cost cap with the remainder as equity. Credits displace debt until the bank's tests pass (DSCR ≥ `dscrReq` 1.25, loan ≤ `ltv` 70% of value at `valueCap` 5.75%). Once passing, the loan is sized to the cushion `sizeDscr` 1.30× (or the LTV or LTC cap if lower) and every further credit dollar shrinks equity.
- Bridge loan on credit equity during construction (9%, 50% average balance, 1% fee) goes into cost, QRE and eligible basis, iterated to convergence.
- Credits: ITC on geothermal and solar (50% default, sold at 92¢); federal HTC 20% + state HTC 25% of QRE (88¢/85¢); 4% LIHTC on qualified basis for 10 years (85¢) with a tax-exempt bond rate cut. Credit moves add approval months, consultant fees and land carry.
- 15-year leveraged IRR: equity at t=0, operations begin after construction plus approval delay, sale at exit cap less loan balance.
- Historic construction-period interest stays inside the soft-cost percentage; Jonathan declined a separate line.
- Chips show "±0.0" neutral for changes under 0.05 IRR points or 0.005× DSCR.

## Working habits

- Verify engine changes in node before publishing: extract the `<script>` and run scenarios (baseline, each move alone, five design moves, five plus historic, all seven).
- After layout changes: `node build.js && node tools/shoot.js`, then look at the screenshots.
- Commit messages end with the Claude co-author trailer. Push to `main` to deploy.
