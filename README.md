# Stacking the Deal

A mobile-first teaching app for architects and planners, built for the Greenbuild session *Stacking the Deal*. It walks through the three numbers an underwriter cares about (NOI, debt service coverage, leveraged return) using one multifamily building, then lets the audience stack green design moves and tax-credit structures against a live proforma until the bank says yes.

Live: https://jarnold-coder.github.io/stacking-the-deal/

## What is in the app

- **Primer.** Six paged lessons that build the deal's sources and uses, NOI waterfall, DSCR gauge and cash-on-cash return, and end with a verdict: the baseline building fails underwriting.
- **The Deal.** A sticky verdict strip (DSCR, NOI, 15-year IRR, total cost, equity, cash yield), five design moves (geothermal, solar, Passive House with landlord-paid utilities, non-combustible construction with added floors, rooftop gardens) and two capital moves (federal and state historic credits, 4% housing credits with tax-exempt bonds). Every move has a "show the math" panel that diffs the proforma line by line.
- **Glossary.** Fifty-odd terms in plain language, each carrying the deal's live number.
- **Inputs.** Every assumption in the model, editable, persisted in the browser.

## Model notes

The engine lives in a single `calc(moves, assumptions)` function inside `src/app.html`. Loan sizing: every deal starts at the loan-to-cost cap with the remainder as equity; credit proceeds first displace the loan; once the bank's coverage and loan-to-value tests pass, the loan is sized to a coverage cushion and further credits displace equity. A bridge loan on credit equity is charged during construction and fed back into cost and basis. The 15-year IRR treats equity as invested at the start, with operations beginning after construction and any approval delay.

This is a teaching proforma, not a pricing model. Confirm current tax-credit law and program rules with counsel before underwriting a real deal.

## Working on it

```
src/app.html      the app (artifact body: title, style, markup, script)
build.js          wraps src/app.html into a standalone index.html
tools/shoot.js    phone-sized screenshots of index.html via headless Chrome
```

```
node build.js            # regenerate index.html after editing src/app.html
npm install              # once, for the screenshot tool (puppeteer-core)
node tools/shoot.js      # writes screenshots/*.png and prints a layout report
```

`index.html` is what GitHub Pages serves. `src/app.html` is the same page without the document wrapper, which is the form the Claude artifact viewer expects.

## License

MIT. Numbers and copy © Arnold Development Group; use them freely with attribution.
