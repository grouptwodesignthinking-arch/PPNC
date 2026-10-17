# Engineering QA — 15 October 2026

This is implementation QA, not participant validation or live operational evidence.

- 24 named engine scenarios and 864 invariant combinations passed using Node.
- Browser walkthrough passed: Kiosk intent → Rules → recommendations → choose → review → confirm.
- Browser recovery passed: item becomes unavailable after selection → invalidates selection → choose replacement → confirm.
- Browser walkthrough passed: POS ADD → review → confirmed total includes add-on; SKIP → original basket confirmed.
- Browser walkthrough passed: complete basket → No recommendation → original basket confirmed.
- Browser walkthrough passed: stale kitchen → fixed Rules-only cards → selection → confirm; no Fastest label on cards.
- Manager suppress and rollback with reasons changed output as expected.
- Three-card synthetic fixture showed all three roles and synthetic saving disclosure.
- Standalone HTML loaded with inline scripts/styles; direct menu flow completed; embedded validation dialog opened.
- Responsive inspection: tablet 1280×900; mobile 390×844 (DOM scrollWidth equals viewport width; no horizontal overflow).
- Source syntax checks passed. No participant outcomes, kitchen impact, AI accuracy or live integration tested.

Snapshots: pos-tablet.jpg and kiosk-tablet.jpg. All displayed data synthetic.

## Visual revision 1.1

- KFC Vietnam website inspected directly on 2026-10-15: official logo and image sources recorded in dist/assets/sources.json; Oswald/Roboto families verified in source CSS and rendered DOM.
- Open-licensed upstream fonts bundled with their SIL OFL text; local image/font assets embedded in the standalone build.
- Kiosk intent → Rules → options → Elevated ranking → choose → confirm passed in the browser after restyle.
- POS ADD → review → confirm passed, correct synthetic total 168,000đ.
- 390px mobile viewport: scrollWidth 390px, no horizontal overflow, all rendered images loaded.
- No learned model, real menu verification, live ordering or user-study evidence added.

## v1.2 — kiosk follow-up, 15 October 2026

Engineering checks only; no participant or live-kitchen validation.

- 34 deterministic scenario assertions, 864 meal/POS combinations, and 252 kiosk upsell combinations passed.
- Browser: entry has two main choices; direct path exposes all seven fixture meals; Help me choose remains dominant.
- Budget labels checked at party 1 and 4; default party 2 confirmed. Selected range scales with party size.
- Guided Classic: Normal offers Side pair; Elevated changes to Salad pair. ADD then stale signal removes the draft side and requires a fresh human continuation. Confirmed main-only total 139k.
- Direct Classic → ADD side → confirm: 174k, with both items in final summary.
- Staff POS regression: ADD drink → confirm: 168k.
- Standalone HTML: one-person budget below 100k + Solo 69k produces No recommendation for sides, then explicitly confirms main-only 69k. All rendered images embedded and loaded.
- Responsive: 390px viewport has no horizontal page overflow at entry, intent and upsell; desktop entry screenshot retained at qa/kiosk-entry-v1.2.jpg.
- Documentation, blank test template and packaged single HTML rebuilt. Budget lower boundaries are preferences, not mandatory spending floors; this is disclosed in UI and validation kit.

## v1.3 — English-only release, 15 October 2026

- Translated authored kiosk/POS copy, category and meal names, descriptions, notifications, manager prompts, accessibility labels, facilitator content and the complete validation kit. HTML language is en; currency formatting is VND / en-US.
- Replaced the image containing Vietnamese promotional text with an English HTML banner and the existing KFC food photo. The old banner is retained only as a QA reference, outside the published dist folder.
- Scanned every shipped HTML, JS, Markdown, CSV and JSON file: no Vietnamese accented letters remain; UI strings also reviewed for complete English phrases.
- Existing 34 scenario tests, 864 main/POS combinations and 252 upsell combinations pass. No decision-rule changes.
- Browser checks: kiosk ADD → confirmation (VND 174,000); POS ADD → confirmation (VND 168,000); English stale-signal fallback, budget inputs and scenario controls.
- Standalone HTML: embedded images load; English validation dialog opens; no browser errors. At 390px, intent and option screens have no horizontal overflow. Desktop screenshot: kiosk-english-v1.3.jpg.
- Engineering QA only; no new participant or operational evidence.

## v1.4 — combined selection screen

- Preferences now open combo cards and the optional pairing panel directly; the intermediate Rules screen is removed from the customer path. Rules, ranking, Load Gate and human confirmation remain enforced.
- Party/budget/priority tiles, product images, a combo + side = total breakdown and a budget composition bar provide visual context.
- The pairing preview is labelled as not added. The value headline precedes the item name without inventing monetary savings.
- Browser checks: change selection to Burger Combo, choose combo + side, review and confirm VND 154,000. Add Classic + side then switch to Safe fallback: side removed, combined screen restored, human combo-only confirmation VND 139,000.
- Standalone: direct menu → Combo only → confirm VND 139,000. Mobile 390px combined page has both combo and pairing content, English language, no horizontal overflow and no browser errors.
- Meal/POS and upsell engine assertions still pass (34 scenarios + 864 + 252 combinations). Exposure deduplication now uses independent main/side scopes with context_meal for pairing previews.
- Screenshot: qa/combo-pairing-v1.4.jpg. Engineering QA only.

## v1.5 — Visual menu and editable counter

- Engine: 40 scenario checks; 864 meal/POS invariant combinations; 540 upsell combinations. All optional alternatives, not only the first suggestion, checked against validity, compatibility, total budget and High-load restrictions.
- Browser: guided Classic + Golden Fries → review VND 164,000 → confirmation; no automatic extra added.
- Browser: counter adds drinks and fries, explicitly applies demo discount; confirmed VND 183,000 matches itemized basket.
- Browser: main + drink basket changes popcorn (Normal) → salad (Elevated / High); Safe fallback shows a fixed valid option with no speed claim.
- All new food photos are reference assets from the official KFC Vietnam menu; fixture prices, portions and promotion remain labelled synthetic.
- This is engineering QA only. No customer/staff research results are claimed.

## v1.6 — Shared Kitchen Board

- 42 scenario tests plus 864 meal/POS and 540 optional-extra invariant combinations pass.
- Browser: queued ticket → Preparing → Ready; open count and median update.
- Browser: High persists across navigation to Staff POS; confirmed counter order appears as a new kitchen ticket with age 0.
- Browser: simulated time makes signal stale → Safe fallback; Refresh signal restores High from retained queue.
- Browser: expired demo offer changes review total from VND 197,000 to VND 207,000 before confirmation.
- Standalone at 390px: no horizontal overflow; image assets all embedded.
- In-memory demo only; no cross-tab synchronization, real kitchen integration or user-study outcomes.

## v1.7 — Visual dispatch, forecast and ingredients

- 11 planning tests + 90 rate / freshness / stock combinations; prior 42 scenarios, 864 meal/POS and 540 upsell combinations retained.
- Browser: group priority requires confirmation and does not start tickets.
- Browser: initial 5 open tickets, Rush assumption changes +10-minute projection to 19.
- Browser: buns 2 → 1 blocks burger start. Planning adds no stock; receiving the displayed 11 buns restores eligibility.
- Browser: Solo start consumes one chicken (8 → 7); Ready leaves it at 7.
- Browser: Safe fallback pauses forecasts. 390px viewport has no horizontal overflow or missing images; no console errors observed.
- Engineering QA only; no real forecast accuracy, inventory or user-study results claimed.

## v1.8 — 16:9 dashboard

- Browser: 1366×768 page equals viewport; canvas ratio 1.77777; all three panels have no internal clipped overflow; all 11 ingredient rows visible.
- Browser: priority confirmation modal works; ingredient count adjustment updates stock-check group and closes back to the dashboard.
- Retained engine / planning checks cover the unchanged data logic.

## v1.9 — connected queue and shared prep
- Logic suite: 42 scenarios, 864 meal/POS and 540 kiosk-upsell combinations passed.
- Kitchen suite: 18 checks and 90 planner combinations passed, including shared stock reservations, queue-sensitive upsell ranking, fixed-order fallback, atomic group starts and repeat-start rejection.
- Browser: POS ADD + confirm created D106 with selected extra; Kitchen group G1 started D105/D104/D103 and deducted chicken 8→3 exactly once. D106 remained queued.
- Standalone at 1366×768: all three panels 553px client/scroll height, all 11 ingredients visible, no external image requests, no console errors. Batch review and Skip left stock unchanged; signal age 65s paused batch advice.
- All checks use synthetic fixtures; no user/staff validation results claimed.

## v1.10 — feedback-aligned kiosk
- Guided view renders exactly three default combo cards, no expanded recommendation catalog. Single optional add-on appears only after explicit combo choice.
- Browser at 1024×1366: choice labels 21–23px; three banknote SVGs; no horizontal overflow. Selecting a combo focuses #kiosk-addon and scrolls it into view; exactly one .addon-option is rendered.
- ADD path confirms Crispy Chicken Combo + Popcorn Chicken at illustrative VND 174,000. SKIP path at 390×844 reviews VND 139,000, no horizontal overflow. Safe fallback shows zero extras and explicit combo-only continuation. No console errors.
- Core logic and kitchen regression suites passed unchanged. No claim of reduced kiosk dwell time or participant validation.
- Validation kit now documents feedback KPI discrepancies and provisional references, planned measurement boundaries, proposed data cadences and role ownership, cost/payback inputs and a food-waste hypothesis. Live data freshness clocks and actual ROI remain unimplemented/unmeasured.

## v1.11 — selected savings and parallel customer display
- 44 engine scenarios, 864 meal/POS combinations, 540 upsell combinations and 18 kitchen checks passed. Savings tests verify identical-content comparisons, unchanged savings when adding an equally priced extra, and suppression of invalid or missing reference prices.
- Earlier browser session at 1600×1000 verified POS: two Chicken Rice items VND 138,000; accepted Mashed Potato VND 19,000; explicit demo discount VND 10,000; both staff and customer totals VND 147,000. Removing the discount restored VND 157,000. Confirmation froze the receipt even after the scenario promotion expired.
- Customer display contained no internal Fit, margin or prep-unit information and had no horizontal overflow in that desktop check.
- The resumed session could not inspect the localhost error tab because browser policy blocked access. Current syntax and regression checks passed; hosted visual verification follows publication.
- Savings and menu prices are synthetic, labeled comparisons; the parallel display is a same-page preview, not a second physical device connection. No participant validation claimed.

## v1.12 — reference-led design, customization and operational upsell
- Engine scenarios and invariant matrices passed with High-band expectations explicitly changed to zero upsell in kiosk and POS. Main-meal rules remain intact. Added ready-item checks cover ready-first ranking, stock/validity exclusion, High suppression, stale fallback and fixed-order branch B.
- Browser: selected Spicy chicken + Mirinda, accepted Popcorn Chicken, reviewed and confirmed VND 174,000 with unchanged VND 20,000 synthetic savings. Customization persisted in review and confirmation.
- Browser: POS suggested ready Mashed Potato; manually adding it to the basket changed the suggestion immediately to Egg Tart. High removed upsell and retained order continuation.
- Browser: manager reduced ready potato 3→0; POS then suggested ready Egg Tart. Accepting and confirming Egg Tart reserved exactly one ready portion, 4→3.
- Kitchen at 1366×768: all three panels had 553px content/client height; Ready to pair was fully visible and all 11 ingredients remained available. Shared-prep and status controls retained human action.
- Mobile customization at 390×844: five variant controls, one optional extra, no horizontal overflow. Old menu and engine behavior remain covered by existing regression checks.
- Engineering checks with synthetic fixtures only. No real KFC menu/discount/holding-time claim, no learned prediction or participant results.

## v1.13 — continuous counter basket, variant mapping, ready-item governance
- Logic suite: 50 scenarios plus the unchanged meal/POS and upsell invariant matrices passed, including variant availability, default selection, invalid/unavailable choice rejection and price neutrality.
- Kitchen suite: 18 checks and 90 planner combinations plus v1.12 ready checks and new v1.13 checks passed: Spicy marinade mapping, single deduction at start, short-marinade block, hold-window exclusion from ready-first ranking.
- Browser flow suite (`flow-tests.cjs`, Chromium via Playwright): 12 checks passed — kiosk guided flow with Spicy + Mirinda + Take away (VND 174,000, one ticket after repeated confirm, order number matches ticket); variant invalidation at review; POS ADD → keep editing → review → back → confirm with matching staff/customer totals; SKIP respected until reopened; review blocked while a suggestion is open; demo offer not re-applied silently; High removes open and accepted extras while orders continue; ready hold window and re-check; marinade deducted once; 390px no horizontal overflow; standalone file loads with no external requests.
- Screens captured at 1366×768, 1600×1000 and 390×844 for kiosk entry/intent/options/customize/review/confirmation, POS (with and without accepted extra, workload details open), Kitchen Board and the ready-item dialog: no horizontal overflow, no console errors; Kitchen Board shows all 12 ingredient rows at 1366×768.
- Synthetic fixtures only. No KFC recipe, holding-time, menu, discount or participant result claimed.

## v1.13.1 — kiosk View basket fix and simulated payment step
- Reproduced in the standalone file: on Customize, View basket left the page on `customize`. After the fix it opens Review with no extra; Checkout opens Pay.
- Browser flow suite: 13 checks passed, including payment-method gating (no order without a method), payment label on confirmation, payment choice reset on leaving the step, and the standalone file placing a QR-demo order offline.
- Pay step captured at 1100×900 and 390×844: no horizontal overflow, no console errors.

## v1.14 — counter intent, kitchen status panel, demo live feed
- Logic suite: 59 scenarios (new: default ranking unchanged, portion fit, Best Value, Snack base, High zero upsell for every intent, starting-pick limits/validity/party match, combos at the counter) plus the existing invariant matrices.
- Kitchen suite: existing checks plus live feed determinism, bounded steady traffic, human-confirmed tickets left for staff, single deduction on start, seeded history.
- Browser flow suite: 17 checks passed, including POS needs → picks on both screens → tap to add, Snack extra, Kitchen status panel from POS and Kitchen Board with all tabs and a High preview, live clock/history advance, pause and signal loss → Safe fallback.
- Screens at 1366×768, 1600×1000 and 390×844 (Kitchen Board, Kitchen status, POS needs and picks): no horizontal overflow, no console errors.
- Synthetic feed only; no capacity, wait-time, utilization or participant claim.
