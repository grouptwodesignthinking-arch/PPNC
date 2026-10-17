# ComboFlow changelog

Policy that applies now is summarized at the top of `dist/validation.md` ("Current policy"). Detailed per-version QA notes are in `qa/QA-SUMMARY.md`.

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
