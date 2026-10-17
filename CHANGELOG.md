# ComboFlow changelog

Policy that applies now is summarized at the top of `dist/validation.md` ("Current policy"). Detailed per-version QA notes are in `qa/QA-SUMMARY.md`.

## v1.16 — 17 October 2026
- Staff POS: every basket line with chicken gets **Original / Spicy** chips; combos and Drink Pair get **Pepsi / 7UP / Mirinda**. The menu adds the default (first available) choice; staff change it per line, so one order can mix Spicy and Original; identical lines merge.
- The accepted Drink Pair extra takes a drink choice too. Choices are price-neutral, shown on the customer display, written on the kitchen ticket and mapped to the Spicy marinade ingredient.
- If a chosen flavor or drink becomes unavailable, the line switches to an available option with a notice for staff to confirm with the customer; unavailable chips are disabled; the quote is invalid while a line holds an unavailable choice.

## v1.15.1 — 17 October 2026
- Live demo feed brings a scheduled delivery on its first tick, so a counter order placed right after a kiosk order still gets its kitchen-aware extra.
- `docs/demo-intro-script.md`: 3-minute walkthrough of Kiosk → Staff POS → Kitchen Board.

## v1.15 — 17 October 2026
- Larger type everywhere. Customer Kiosk is now a portrait 9:16 kiosk screen (about 760 px wide on desktop, content scaled ×1.2) with its entry screen centred; mobile stays full width.
- Staff POS uses the full window width in landscape and is scaled ×1.22 on screens 1200 px and wider; small labels, menu cards and kitchen-signal text enlarged; menu grid adds columns on wide screens.
- Kitchen Board stays landscape and full width; all text ×1.45; the board grows taller than 16:9 when needed and the page scrolls instead of shrinking text.
- Kitchen status panel text enlarged; banner reference label readable; no focus outline around the whole screen after navigation.

## v1.14 — 17 October 2026
- Staff POS: three customer-need questions (who’s eating · order type Meal / Snack / Sharing · priority), up to three starting picks, combos orderable at the counter, intent-aware ranking of the single extra, Snack orders without a main.
- Customer display: starting picks before a base; the undecided extra with pairing context and “Your total would be”.
- Kitchen status panel (Overview · Kitchen · Suggestions · Reports · Settings + Load Gate setup) on Kitchen Board and Staff POS.
- Demo live feed: seeded arrivals, simulated crew for background tickets, scheduled deliveries, ×10 demo clock, pause / signal-loss controls; Kitchen Board chart shows the last 60 demo minutes plus the 15-minute projection.
- The shown POS extra stays stable while eligible; clearer message when ingredient checks block every extra.

## v1.13.1 — 17 October 2026
- Fix: **View basket** on the kiosk customization screen did nothing until the customer pressed Add/Skip. It now opens Review with the combo only (no extra added).
- New simulated **Pay** step after Review (Pay at the counter / Card demo / QR e-wallet demo). A method must be chosen explicitly; no money is taken. Kiosk steps now read 01 Your needs → 02 Combo + customize → 03 Review → 04 Pay.

## v1.13 — 17 October 2026
- Staff POS: ADD / SKIP keep staff in the basket; the accepted extra stays while valid; one optional extra per order; explicit "Show suggestion again" and "Remove extra"; review requires an ADD / SKIP decision while a suggestion is open; "Back to basket" keeps the extra; review button in the cart bar works whenever the basket is valid.
- Demo discount is dropped (with a notice) when the basket stops qualifying and never re-applied automatically.
- Kiosk: simulated variant table (Original / Spicy, Pepsi / 7UP / Mirinda) with scenario-controlled availability, disabled unavailable options, invalidation notice and re-check at confirm; meals without any available option in a required group are not offered.
- Kitchen: Spicy marinade ingredient mapped from the chicken variant; deducted once at Start preparing.
- Dine in / Take away carried into review, confirmation and kitchen ticket; confirmation shows a demo order number that matches the Kitchen Board ticket, with a "Track on Kitchen Board" shortcut.
- Ready items: demo-clock check age, 10-minute [Assumption] hold window, "Mark checked" / "Discard" actions; stale portions excluded from ready-first ranking.
- Compact customization layout (row-style options, smaller cups) on desktop and mobile.
- Browser flow test suite `flow-tests.cjs`; validation kit gains a current-policy summary, superseded-row markers and section 22.
- Session log version string corrected to 1.13; toast timer no longer hides a newer message early.

## v1.12 and earlier
See `qa/QA-SUMMARY.md` and sections 12–21 of `dist/validation.md` (v1.5 visual menu and counter, v1.6 Kitchen Board, v1.7 kitchen planning, v1.8 16:9 dashboard, v1.9 connected workload and shared prep, v1.10 feedback-aligned kiosk, v1.11 savings and customer display, v1.12 reference-led design, customization and High suppresses every upsell).
