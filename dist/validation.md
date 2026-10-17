# ComboFlow — Validation Kit

Version 1.14 · 17 October 2026 · English-only prototype · visual choices, editable counter and Kitchen Board

## Current policy (v1.14) — read this first

This kit keeps its version history. Where an earlier section conflicts with the list below, the list below and sections 21–23 apply. Rows marked **[Superseded]** are kept only for traceability.

- Pipeline: Rules → Contextual Ranking → Load Gate → Human Decision. At most three combo suggestions plus one optional add-on per order; the full menu is a separate manual path.
- **High suppresses every upsell** in kiosk and POS, including ready items and Rules-only branch B. Main-meal ordering continues when valid; kiosk main-meal recommendations at High remain limited to Ready / Short preparation classes.
- Stale signal or ranking outage → Safe fallback: no workload or ready ranking, no Fastest to Serve; POS shows fixed valid rules with a staff check; kiosk extras pause. Stale is never read as an idle kitchen.
- ADD / SKIP and review / confirm are always human actions. Nothing is added, discounted or confirmed silently. In POS, ADD and SKIP keep staff in the basket (section 22); review is a separate explicit step.
- Staff POS asks three optional customer-need questions (who’s eating · order type Meal / Snack / Sharing · priority). They order eligible items and up to three starting picks; they never bypass validity, stock, the Load Gate or human ADD / SKIP (section 23).
- The Kitchen Board and Staff POS run a seeded **demo live feed** (demo clock ×10). It is synthetic traffic, labelled DEMO LIVE, and can be paused; signal loss always means Safe fallback.
- No margin, internal Fit score or kitchen utilization is shown. Business Value is omitted without contribution data.
- Menu, prices, portions, variants, recipes and holding windows are synthetic **[Verify KFC VN menu]** / **[Assumption]**. No user-test, revenue, waste, payback, live-integration or prediction-accuracy result is claimed.

**Simulated Contextual Ranking (pre-scripted decision table)**

## 1. Scope and evidence

One solution: **ComboFlow**. Rules → Contextual Ranking → Load Gate → Human Decision. The clickable prototype contains Customer Kiosk, Staff POS and Kitchen Board flows. It has no backend, payments, real orders or learned model. All meal names, contents, prices, savings, serving sizes and serviceability are synthetic **[Verify KFC VN menu]**. Load classifications and thresholds are **[Assumption]**, not KFC policy or predicted waiting times.

Implementation references: the supplied v5 file `comboflow-s3-s4-s5-2-ban-sua (3).md`, its critique in the referenced Future CEO review conversation, and the current user requirements. The mirrored project did not contain separate original Working Canon / Training documents. This kit applies the principles represented in v5 and the current requirements; it does not claim a complete check of those original slides.

Intentional terminology updates: the shared layer is **Contextual Ranking**; only C_AI means Learned AI Ranking. Kiosk evaluation distinguishes reviewer consensus from participant preference and does not treat preferences as ground truth. No improvement in operations, waiting time, sales or user outcomes is claimed.

## 2. Open and operate

- Open `index.html` in a browser with its supporting files in the same folder. No installation or network connection is needed. `ComboFlow-standalone.html` is a self-contained offline file.
- Customer Kiosk → Help me choose → party size, budget, priority → combined combo + side screen → choose combo + side or combo only → review → confirm.
- I know what I want → full fixture menu with pairing panel → choose combo + side or combo only → review → confirm. This path bypasses intent-based ranking. The bounded fixture menu is not the complete verified KFC menu.
- Staff POS → menu / editable basket / kitchen band / optional demo discount → one recommendation or No recommendation → ADD / SKIP (staff stay in the basket and may keep editing) → Review basket → confirm. The confirmation shows a demo order number that appears on the Kitchen Board.
- Kitchen Board → inspect open tickets / median age → Start preparing → Mark ready → updated signal → inspect kiosk or counter suggestions. Confirmed demo orders appear as new tickets in the same browser session.
- Scenario Lab is hidden by default. Open it with the top button to control simulated conditions; hide it for customer/staff close-ups.
- A scenario preset starts a new run. Branch, load and checkbox controls change the current run. Reset between tasks. Export the session log before closing; it exists only in browser memory.
- Kitchen data does not update with the real clock. Band buttons load scripted snapshots and qualifying High histories. There is no live KDS feed.

## 3. Version definitions

| Version | Definition | Status |
|---|---|---|
| A | Current KFC ordering flow | Documentation only; the original flow has not been verified. The manual menu path is not labelled A. |
| B | ComboFlow Rules-only, fixed eligible order | Clickable comparator. Validity, minimum eligibility, High suppression and human confirmation still apply. No contextual sorting. |
| C_sim | ComboFlow contextual heuristic decision table | Default clickable branch. Simulated; no learned AI. |
| H_live | Contextual heuristic used in a real pilot | Future; not implemented or live. |
| C_AI | Learned AI Ranking candidate | Future; not implemented or trained. |

Prototype comparison: **C_sim vs B**. Future AI Gate: **C_AI vs H_live**. Prototype results cannot establish that AI outperforms non-AI. A must be separately observed and verified before a comparative study.

## 4. Main-meal and POS decision table

| Step | Input / rule | Output / limit |
|---|---|---|
| Rules | Confirmed fixture stock, unexpired promotion, fixed valid meal definition, price and active budget ceiling | Remove invalid items. Stale stock blocks offers; manually verify availability before confirmation. |
| Kiosk Fit | Exact fixture serving size matches party. Supported priority → High; same party but unsupported priority → Medium; party mismatch → Low | Minimum Medium. At most three distinct cards. Never fill slots with Low-Fit items. |
| POS compatibility | Missing add-on category → High; category already in basket → ineligible | High only. Missing category does not establish purchase intent. At most one suggestion. |
| Contextual Ranking | Fit descending; within the same Fit, readiness; value priority uses lower price after readiness ties; deterministic fixture order resolves ties | B and Safe fallback bypass contextual sorting. No learned scores. |
| Card roles | Best Fit = first eligible ranked item. Best Value = largest synthetic saving, available only with the synthetic-value toggle. Fastest = lowest synthetic service class among eligible items | Merge roles for the same item and preserve eligible order. Every candidate passes Rules and Load Gate. No wait prediction. |
| Normal / Elevated | Kiosk: serviceability affects same-Fit order. POS: fresh, compatible, stock-feasible extras ranked by open station work (section 17); fixed fallback retains catalog order. | Elevated changes the synthetic snapshot: Classic share Short → Normal; Easy share Normal → Ready. The explicit item snapshot explains the ranking change; load band alone does not prove a real preparation change. |
| High | Main meals: recommend only Ready now / Short additional prep. POS add-ons: none **[Superseded v1.12 §21 for add-ons]** | Suppress Normal / Constrained main meals; zero POS upsell. Direct manual menu remains a human ordering path, not a recommendation or automatic cancellation. |
| Safe fallback | Signal older than 60 seconds, ranking outage or manager-forced safe mode | Fixed valid main-meal options. No Fastest / Best Value claims or kitchen-based sorting. |
| Business Value | Contribution data unavailable | Omitted entirely. Never infer business contribution from price. Customer savings are distinct. |
| Human Decision | CHOOSE / ADD / SKIP, followed by explicit confirmation | Revalidate on confirm. Invalidate an ineligible draft selection. Freeze the final order after confirmation. |
| Manager | Force safe mode, suppress add-on suggestions, or restore scenario policy; reason required | Action is logged. Validity cannot be bypassed. No real manager authentication. |

Frozen meal examples: classic / Crispy Chicken Combo (139,000 VND, two people, Best Fit priority); ready / Chicken Rice Combo (145,000 VND, two people, Best Fit + Fastest); light / Burger Combo (119,000 VND, two people, Best Value + Fastest); promo / Chicken & Pasta Combo (129,000 VND, two people, Best Fit + Best Value). **Every value is [Verify KFC VN menu].** Priority compatibility and serving sizes are illustrative, not nutrition or portion claims.

Best Value cards are hidden by default because real KFC comparable prices and savings are unverified. The synthetic-value scenario provides a separate logic demonstration: promo has a synthetic comparable basket of 169,000 VND and a synthetic saving of 40,000 VND. This is not a verified promotion or transaction.

Primary load signal: **Median waiting-ticket age** = median(now − creation timestamp) for demo tickets not yet Ready (queued and preparing). Open-ticket counts do not trigger bands. Kitchen utilization is not calculated or displayed.

| Shadow-mode starting assumption | Fixture behavior |
|---|---|
| Age <90 seconds | Normal |
| Age ≥90 seconds, High not established | Elevated |
| Age ≥120 seconds sustained for ≥120 seconds | High |
| Previously High, below threshold for <300 seconds | Remain High |
| Below threshold for ≥300 seconds | Exit High |
| Signal freshness >60 seconds or ranking unavailable | Safe fallback takes precedence |

These are simulated / shadow-mode assumptions, not validated safe thresholds. Validate the relationship between the case kitchen queue measure and KDS waiting-ticket age before operational use. Presets set qualifying histories directly; automatic polling, timers and integration are outside scope.

## 5. Budget presets and priorities

| Party size | Low | Middle | High |
|---|---|---|---|
| 1 | Under VND 100,000 | VND 100,000–200,000 | Over VND 200,000 |
| 2 | Under VND 200,000 | VND 200,000–400,000 | Over VND 400,000 |
| 4 | Under VND 400,000 | VND 400,000–800,000 | Over VND 800,000 |

Formula: lower boundary = 100,000 × party size; upper boundary = 200,000 × party size. These are requested budget preferences, not verified KFC price tiers. Low has a strict ceiling (< lower). Middle has an inclusive upper ceiling (≤ upper). High has no ceiling. Lower boundaries are willingness-to-spend preferences, not minimum spending requirements: cheaper suitable meals remain eligible. The UI explicitly says customers need not spend the full range.

Changing party size recomputes the selected bracket. The ceiling applies to **main meal + optional add-on**, not each item separately. Custom 40,000 / 300,000 VND facilitator fixtures remain available. The manual entry path starts without a budget ceiling.

**What do you prioritize?** offers **Fastest to Serve / Best Fit / Best Value**. Stable internal keys remain fast / full / value. Selecting Best Value does not create verified savings: Best Value ranking remains behind the synthetic-value toggle. Selected-combo savings now appear separately as an explicitly labelled DEMO COMPARISON, using illustrative reference prices only.

## 6. Kiosk side-dish decision table

| Stage | Rule | Output |
|---|---|---|
| Input | Human-selected meal, included categories, remaining budget, stock / promotion, load snapshot | Pairing panel on the same screen on both entry paths |
| Rules + compatibility | Valid side / dessert category absent from the meal; total within the active ceiling; no expired or unavailable item | Candidate set without duplicate side categories |
| Normal | Fixed preference order: popcorn, salad, dessert pair, fries, cheesy bites, potato, egg tart | Exactly one eligible suggestion, or No recommendation; no alternative add-on grid |
| Elevated / C_sim | Shorter synthetic preparation class first | Sesame Salad precedes Normal-prep Popcorn Chicken |
| High / all branches | **[Superseded v1.12 §21]** No add-on candidates | No recommendation; continue with the combo only |
| B | Fixed eligible order; shared High restriction | No contextual sorting |
| Safe fallback | Suppress optional kiosk upsell; retain Rules-only main-meal path | No recommendation → explicit continue → confirm |
| Manager suppress | Pause kiosk upsell and POS suggestions | No recommendation; validity cannot be bypassed |
| Human action | ADD / SKIP, or continue when no offer; then confirm | Meal plus accepted side, or meal alone; never auto-add |
| Changed conditions | Recheck validity, eligibility and total budget | Remove an invalid draft side and require a fresh decision |

All included-category assignments, prices and preparation classes are synthetic **[Verify KFC VN menu]**. Default fixture meals include main + drink; the group meal also includes a side. Photos are illustrative, not exact basket contents. Popcorn Chicken is Normal prep (class 2), Sesame Salad is Short (class 1), and Dessert Pair is Constrained (class 3). No margin or contribution ranking is used.

## 7. Scenario set — expected outcomes, not observed research results

| ID | Setup / action | Expected outcome |
|---|---|---|
| K01 | Default: two people, under VND 200,000, Best Fit, Normal | Classic first; no Best Value claim; at most three cards |
| K02 | Synthetic-value fixture | Classic Best Fit / promo Best Value / light Fastest; synthetic labels |
| K03 | Same intent → Elevated | Ready becomes first in the High-Fit tier; lower-Fit light does not overtake High-Fit items |
| K04 | Same intent → High | Only Ready / Short recommendations; no automatic order |
| K05 | Display synthetic promotion, then expire it | Promo removed; expired offer cannot be confirmed |
| K06 | Choose classic, then mark it unavailable | Selection invalidated; choose a valid item again |
| K07 | Stale kitchen signal | Fixed valid main options; no Fastest; optional kiosk upsell suppressed |
| K08 | Ranking unavailable | Same safe behavior as stale kitchen |
| K09 | Four people, VND 300,000 custom ceiling | Group fixture only; fewer than three cards is acceptable |
| K10 | One person, VND 40,000 custom ceiling, Best Value | Light Meal; no over-budget meal |
| K11 | VND 20,000 ceiling in engine fixture | No eligible recommendation |
| K12 | High budget bracket | No ceiling and no forced spending floor |
| K13 | I know what I want | Full fixture menu and side panel → human choice → review → confirm |
| K14 | Confirm, then change lab state | Confirmed order stays unchanged |
| K15 | Entry | Exactly two main paths; Help me choose visually dominant; no meal preselected |
| K16 | Party 1 → 2 → 4, same bracket | Boundaries scale with party; selected bracket preserved |
| K17 | Classic → upsell; Normal → Elevated | Popcorn Chicken at VND 35,000 changes to Sesame Salad at VND 39,000; no addition until ADD |
| K18 | Ready meal → High | **[Superseded v1.12 §21]** No recommendation; combo-only continuation |
| K19 | One person, under VND 100,000, Solo at VND 69,000 | Only extras priced below VND 31,000 remain; total stays under VND 100,000 |
| K20 | ADD salad, then stale kitchen | Draft side removed; explicit continuation confirms main alone |
| K21 | Manual classic → ADD side → confirm | VND 174,000 total; both human actions logged |
| K22 | Guided or manual → SKIP | Main retained; no side charge |
| K23 | Group already includes side; promotion expired | No duplicate side or expired dessert |
| P01 | Main-only POS basket, C_sim | One kitchen-aware suggestion → ADD → keep editing or Review basket → confirm (v1.13 flow) |
| P02 | Same basket → SKIP | Original basket confirmed |
| P03 | Basket includes drinks | No duplicate drink; consider missing categories |
| P04 | Main + drink + side + dessert | No recommendation; confirm original basket |
| P05 | High, drink unavailable | **[Superseded v1.12 §21]** No recommendation; continue the order |
| P06 | High, all Ready / Short add-ons unavailable | No recommendation (High already suppresses every add-on) |
| P07 | ADD, then mark item unavailable | Remove draft add-on; require another decision |
| P08 | B vs C_sim, main-only basket | B fixed eligible order vs C_sim queue-aware ranking; shared High restrictions |
| M01 | Manager forces safe or suppress, reason supplied | Mode changes and reason logged; invalid items stay blocked |
| M02 | Manager restores scenario policy, reason supplied | Scenario rules restored and rollback logged |
| D01 | Stock stale | No inferred stock; confirmation blocked pending verification |
| L01 | Age 89/90 seconds, High persistence 119/120 seconds | Boundary classification matches decision table |
| L02 | Freshness 60/61 seconds; High recovery 299/300 seconds | Boundary classification matches decision table |

## 8. Validation protocol and blank log

Separate **engineering logic QA** from **user validation**. Scripted checks test conformance, not perceived usefulness or real kitchen protection. No participant results are prefilled.

The v5 working target is at least five participants per user group for a small usability study; disclose staff proxies. Obtain recording consent, use anonymous participant codes and allow refusal without penalty. Use identical scenarios for B and C_sim, counterbalance order, reset between tasks and use the same device. Separate scripted facilitator changes from participant errors. Define the primary task and minimum meaningful improvement before collecting data.

Record in `test-log-template.csv`: participant code, user group, proxy status, consent, scenario, branch, run order and ID, timestamps, duration, completion / stop, errors, interventions, independently specified eligibility, expected alternatives, displayed IDs and positions, human action, confirmed items, output validity, consensus / ambiguity, reviewer choices, participant preference, override reason, recording location and observations. Leave missing measurements blank; never substitute zero.

Session exports contain run ID, timestamp, elapsed seconds, screen, state, branch, band, shown IDs / positions, decisions and confirmation. They are raw interaction traces, not automatic KPI results. An exposure event is emitted when the displayed list, branch or band changes; not on every repaint. Retain retries and revisions, and deduplicate consistently. Closing or refreshing loses unexported events. Participant identity and consent belong in the separate study template.

Kiosk side events use screen = options or menu and stage = kiosk_upsell; exposure events include context_meal. ADD / SKIP also includes stage = kiosk_upsell. Record confirmed add-on retention separately from initial ADD. Reset marks unfinished runs as stopped.

## 9. Screen → KPI mapping

| Screen / event | Measure and denominator | Interpretation |
|---|---|---|
| Entry / run_started → confirm | Completed runs / started assigned tasks; elapsed task seconds | Includes navigation and the combined selection screen. Exclude facilitator setup consistently. Report median and range, not small-sample P90. |
| Intent / intent_changed | Corrections and observed hesitation per assigned task | Code from log and observation; not preference accuracy. |
| Rules / removed candidates | Valid shown offers / all shown offers | Check independently against fixtures. Zero shown = N/A. |
| Options / recommendation_shown + choose | Accepted exposures / displayed eligible exposures | Adoption only; report unique-run acceptance separately. |
| Kiosk upsell / shown + ADD / SKIP | ADD and SKIP shares per shown eligible exposure; confirmed retention separately | No-offer eligibility must come from independent specification. Not revenue lift. |
| POS / recommendation_shown | Eligible orders receiving valid suggestions / all eligible orders | Do not infer eligibility merely from an offer being shown. |
| No recommendation | Correctly suppressed ineligible orders / all ineligible orders | Report with coverage; zero denominator = N/A. |
| POS / ADD or SKIP → confirm | ADD decisions / shown suggestions; confirmed retention separately | Behavioral feedback, not ground truth. Undo does not erase the original action. |
| Review / invalidation or blocked confirmation | Correct recoveries / induced invalidation cases; final output validity | Expected recovery is separate from participant error. |
| High-load options | Recommendations satisfying High rules / all High recommendations | Logic compliance only; zero offers = N/A. No evidence of real kitchen impact. |
| Manager override / rollback | Count and reasons per run | No staff performance scoring. |
| Options + independent review | Top-1 consensus agreement; participant preference separately | At least three independent reviewers, blinded to branch/output; retain ambiguous cases. Top-3 only with more than three valid candidates; report candidate-set size. |

Pilot-only outcomes include queue P90, order-taking P90, order-to-serve time, abandonment (separate from channel switching), WIP, order accuracy and kitchen impact. This prototype cannot measure them. Do not convert demo seconds into labor savings, recovered sales or business outcomes.

## 10. Recording script — target 110 seconds

- 0–10s: Show the entry, ComboFlow name and exact simulation label.
- 10–30s: Help me choose → two people / under VND 200,000 / Best Fit → combined combo + side screen.
- 30–45s: Open Scenario Lab; Normal → Elevated → High. Explain the simulated item snapshot and load assumptions.
- 45–60s: Choose a valid meal → auto-scroll to one optional extra → ADD or SKIP → review → confirm.
- 60–85s: Staff POS → inspect station workload → add a main or drink → inspect the recomputed single upsell → ADD / SKIP → confirm.
- 85–105s: Stale preset → Rules-only list and safe continuation. No-recommendation preset → original basket retained.
- 105–110s: Show Validation Kit / Export session log. State that no user or live operational results are available yet.

The duration is a planned walkthrough, not a measured recording. Hide Scenario Lab for customer/staff close-ups. The package provides a script, not a fabricated test video.

## 11. English interface, assets and limits

All authored interface text, messages, accessibility labels, menus, documentation and exports use English. Currency is displayed as VND with English number formatting. The English banner is built from HTML text and an existing KFC food reference photo; the earlier promotional image with embedded Vietnamese copy is no longer shipped. It makes no active-price or promotion claim.

The design uses KFC red #E4002B, white and near-black, with Oswald headings/navigation and Roboto body/prices. Licensed upstream font files and SIL OFL text are bundled; National 2 is not used. Official KFC logo and product photos are references, not evidence for simulated basket contents, availability, prices or serviceability. This is an unofficial student prototype. Asset provenance is in `assets/sources.json`.

The kiosk follows the supplied reference photo: category rail, food banner, dine-in / take-away selection, food grid and bottom basket bar. The entry has two main paths, with Help me choose emphasized. Buttons filter the bounded fixture set; dining mode updates session context. Image and font assets are embedded in the standalone HTML.

No live POS / KDS integration, stock checks, payment, learned AI, real manager authentication or durable analytics. The counter supports adding/removing quantities from the bounded fixture catalog. Ingredient customization and unlisted group combinations remain outside scope. Verify menu, comparable baskets and serviceability before replacing placeholders. Use evidence labels [Case], [Derived], [Assumption], [Projected], [Pilot target] and [Tested] only where supported. Engineering checks must never be relabelled as user testing.

Reference sources: https://kfcvietnam.com.vn/ ; https://kfcvn-static.cognizantorderserv.com/images/web/kfc-logo.svg ; https://static.kfcvietnam.com.vn/ ; font licenses at https://github.com/google/fonts/tree/main/ofl/oswald and https://github.com/google/fonts/tree/main/ofl/roboto .


## 12. Combined selection screen

The customer moves directly from preferences to combo and side selection. Rules → Contextual Ranking → Load Gate still run before the results appear; the technical process trace remains in Scenario Lab instead of an intermediate customer screen.

Visual tiles summarize party size, budget and priority. Combo cards and an optional pairing panel appear together on desktop and stack on mobile. The panel appears only after an explicit combo selection. Selecting a combo focuses the panel and scrolls it into view, with reduced-motion preferences respected; the customer may then choose an extra or **Skip extra · Combo only**. Both actions lead to review, followed by mandatory confirmation.

The pairing headline reads **Best add-ons for this combo** The single suggestion leads with **Just VND … more**, followed by the item name. The arithmetic equation and price-composition bar are removed. The draft total, itemized review and confirmed total remain visible. This is a variety suggestion, not a real savings claim. No-recommendation and Safe fallback states retain a combo-only action.

Main-meal and side exposure events use separate deduplication scopes so rendering both sections does not create repeated exposures. Side events include the previewed meal ID as context_meal. Exposure is recorded after explicit combo selection; acceptance and final confirmation remain separate events. A budget, availability or load change can remove an invalid draft and require a new human choice on the combined screen.


## 13. Visual menu and counter update (v1.5)

The fixture catalog now contains 15 meals, 8 add-ons and 3 counter main items. The guided screen retains at most three highlighted meal cards. The guided path shows only its top three valid options. Additional catalog meals remain available through the explicit manual-menu path. The current kiosk displays only the first eligible optional extra, with ADD or SKIP; the catalog is not an invitation to display all add-ons.

People silhouettes, budget tiers and priority symbols replace plain intent buttons. Budget formulas remain unchanged. The UI uses licensed Oswald and Roboto; additional food reference photos come from the official KFC Vietnam menu. Image sources are recorded in `assets/sources-v1.5.json`. All portions and prices remain fixtures, with [Verify KFC VN menu] labels.

The counter shows an editable menu, quantity controls, a basket total and one prioritized upsell. An empty basket cannot be confirmed and receives no upsell until a main is present. Category compatibility is derived from the actual basket. Adding a manual item clears a pending upsell decision and recomputes it. Unavailable / expired items are removed on scenario changes. Review disables quantity changes until staff returns to the basket.

The kitchen card displays Normal / Elevated / High / Safe fallback, Median waiting-ticket age and signal age. All are simulated. No utilization percentage, internal Fit, margin or capacity estimate is shown. Preview buttons change scenario inputs and rerun the same engine. The current counter uses the shared-queue heuristic in section 17. Fresh stock checks precede ranking by open station work; fixture prep class and price break ties. High suppresses classes above Short. The earlier fixed category examples are superseded by section 17. Safe fallback uses fixed valid ordering without a speed claim.

### Explicit demo discount

The counter contains one **DEMO OFFER**, not a real KFC promotion: VND 10,000 off a valid basket with at least one side and an undiscounted total of at least VND 150,000. It applies once per order only when staff selects **Apply demo discount**. An accepted upsell can qualify the basket. Expiry, availability, quantities and the threshold are checked whenever the quote is calculated, including at confirmation. An expired or no-longer-eligible offer contributes zero discount. Discounts do not change the upsell ranking or stand in for unavailable contribution data.

| Scenario | Expected behavior |
|---|---|
| K24: Two people, default budget | At most three combo cards; one add-on appears after selection |
| K25: Classic + suggested Popcorn Chicken | Explicit combo selection → one add-on → itemized VND 174,000 review → confirm |
| K26: Suggested extra becomes unavailable | Remove draft extra and require a fresh choice |
| P09: Add drinks manually, switch Normal → Elevated | Recompute one compatible extra from fresh queue and stock; verify explanation against section 17 |
| P10: Two rice + fries | Subtotal VND 163,000; explicit demo discount yields VND 153,000 |
| P11: Offer expires after selection | Discount becomes zero; expired promo items are removed; review updated total |
| P12: Remove items below threshold | Discount becomes zero; new total matches current quantities |
| P13: Remove all mains | No upsell; empty basket cannot be confirmed |
| P14: Main item unavailable | Remove item, recompute categories / price, require renewed review |

Additional event mapping: Guided meal expansion is removed in v1.10. Kiosk upsell exposure records only its single displayed suggestion; `addon_panel_focused` records the selected meal and the transition to add-on decision. `basket_changed` records item and quantity changes. `promotion_changed` records explicit discount selection. `confirm.final_order` records the total and applied counter discount. Distinguish menu browsing from recommendation exposure when calculating acceptance rates. Study logs remain blank; engineering checks are not user validation.


## 14. Kitchen Board (v1.6)

Kitchen Board is a view inside ComboFlow, not a separate solution or a claim to increase kitchen capacity. Tickets can be filtered by All open, Longest waiting, Next in line, Stock check, Preparing and Ready. Human staff actions move queued → preparing → ready; nothing is marked ready automatically. The initial five tickets are visibly labelled scenario fixtures. Kiosk and counter confirmations create tickets labelled **Confirmed demo order**. No real order, payment or KDS message is sent. State is in-memory within one browser page, not synchronized across separate tabs or devices, and resets on reload.

For this prototype, an open waiting ticket means a ticket not yet Ready; both queued and preparing tickets are included. Median waiting-ticket age is recomputed from their synthetic ages, rounded to the nearest second. With no open tickets it is 0. This local definition must be reconciled with the case/KDS measure before a pilot. Moving a ticket to Preparing does not remove it from the age sample; marking it Ready does. An additional low-age ticket can lower the median even though open-ticket count rises: neither measure establishes true capacity.

Time advances only with **Advance demo 30s**. Ticket ages and signal age advance together; a signal older than 60s forces Safe fallback. **Refresh signal** resets signal age, while retaining ticket ages and the queue. High persistence and recovery holds use the same simulated 120s / 300s assumptions as the main engine. Scenario buttons reset the synthetic ticket set to the selected load fixture and qualifying history. Switching views preserves the kitchen signal; starting a new customer/counter draft does not clear kitchen tickets.

| Scenario | Expected output / human action |
|---|---|
| KB01: Initial queue | Five open fixture tickets; median age 45s |
| KB02: Start preparing a queued ticket | Ticket moves columns; remains in median sample |
| KB03: Mark a preparing ticket Ready | Open count falls; median recomputed; action logged |
| KB04: Confirm kiosk or counter draft | New labelled demo ticket enters In queue with age 0s |
| KB05: High → switch to counter | High signal retained; **[Superseded v1.12 §21]** no extras suggested |
| KB06: Advance until signal age >60s | Safe fallback; no speed claim |
| KB07: Refresh signal | Signal age 0s; load policy recalculated from retained queue/history |
| KB08: Mark all open tickets Ready | Open count 0, median 0; any active recovery hold remains respected |

| Kitchen screen event | Validation measure | Interpretation limit |
|---|---|---|
| kitchen_ticket_created | Demo confirmed orders arriving on board / demo confirmations | UI linkage only, not real integration reliability |
| kitchen_human_action | Task completion and action errors for queued → preparing → ready | User research requires actual observed participants |
| kitchen_signal_updated | Median age / open-ticket count per scripted action | Synthetic scenario trace, not measured throughput |
| kitchen_demo_time_advanced / kitchen_signal_refreshed | Correct stale fallback and recovery behavior | Not elapsed service time or actual wait reduction |

### Revised two-minute walkthrough

- 0–15s: State the simulation disclosure; enter Help me choose.
- 15–40s: Select party / budget / priority; compare up to three combos, select one, then ADD or SKIP the single extra.
- 40–50s: Review the transparent total and confirm.
- 50–75s: Open Kitchen Board; find the confirmed demo ticket; Start preparing → Mark ready.
- 75–100s: Load Elevated or High; switch to Staff POS; add a drink to the basket; inspect the serviceable priority upsell and optional demo offer.
- 100–120s: ADD / SKIP → review → confirm; point out that stale signal uses Rules-only fallback and all kitchen states are assumptions.


## 15. Visual kitchen planning (v1.7)

**This is deterministic what-if planning, not learned AI or a validated prediction model.** The original ordering architecture and A / B / C_sim / H_live / C_AI definitions remain unchanged. Median waiting-ticket age remains the primary Load Gate input. The queue forecast and stock ledger do not replace it or claim real kitchen capacity. Everything is English-only and all recipe quantities, on-hand counts, thresholds and future rates are [Assumption] / [Verify KFC VN menu].

### Priority groups and human decision

Queued tickets with insufficient on-hand ingredients go to **Check ingredients**, regardless of age. Other queued tickets aged at least 60 seconds go to **Longest waiting**; the rest go to **Next in line**. The 60-second cutoff is a demo grouping threshold, not a service-level guarantee. Tickets have station labels but are not automatically batched or assigned to staff. Channels do not imply higher customer value or preferential treatment.

**Prioritize this group → Confirm priority** changes display ordering only. A separate **Start preparing** action is required for each ticket. Actual ingredient quantities are rechecked before starting, so prioritization cannot bypass a stock shortage. Preparing and Ready tickets are excluded from new-priority groups. Manually marked priorities are sorted ahead of other visible tickets, then by age.

### Queue and ingredient projections

Queue scenario inputs are incoming orders per minute (0.6 / 1.2 / 2.4) and assumed completions per minute (0.8 / 1 / 1.6). For time t in minutes, projected open tickets = max(0, current open tickets + (arrivals − completions) × t). The chart shows now, +5, +10 and +15 minutes. The shaded sensitivity envelope uses arrivals ±25% and completions ±20%. It is not a statistical confidence interval, service-time model or measured throughput. Changing assumptions does not generate orders or complete tickets.

A separate explicit recipe fixture maps every menu item to ingredient planning units. Confirmed demo orders preserve item IDs and quantities; requirements are not guessed from display text. For each ingredient, queued demand sums queued-ticket requirements; preparing tickets have already drawn their ingredients. Future 10-minute demand is ceiling(average ingredient units per currently open ticket × assumed arrivals per minute × 10). This average is an illustrative scenario mix, not a trained demand forecast. No open tickets means no ingredient-mix forecast.

After-queue balance = on-hand − queued demand. Negative values explicitly show a shortage. Approximate cover = max(0, floor(after-queue balance / projected ingredient demand per minute)). Zero projected use has no cover-time estimate. Suggested top-up = max(0, future 10-minute demand − after-queue balance). Numbers exclude planned incoming stock until staff confirms receipt. Counts and coverage are rounded for display; floating-point boundary errors are guarded.

### Ingredient actions

The ledger covers chicken, rice, buns, fries, salad, drinks, cheese, potato, tarts, pasta and shrimp. Units are shown on each card. Reference food photos are illustrative; they are not photos of measured ingredient inventory or verified recipes.

- **− / +** adjusts a synthetic on-hand count, floored at zero.
- **Plan top-up** stages the displayed suggested quantity, without increasing on-hand stock.
- **Receive** explicitly adds that planned quantity once and removes the pending receipt action.
- **Start preparing** validates and deducts all recipe quantities atomically once. If any ingredient is short or the recipe is unknown, starting is blocked without partial deduction.
- **Mark ready** does not deduct again.
- **Reset demo counts** restores fixture quantities and clears planned receipts; ticket status is unchanged.

The initial Preparing fixtures are treated as already drawn from stock before the snapshot. Scenario buttons reset the ticket set but retain edited stock counts. The ledger governs kitchen start checks; kiosk/POS menu availability remains scenario-controlled, as disclosed in the assumptions drawer. No inventory integration, purchase order or food preparation action occurs outside the prototype.

Safe fallback pauses all numerical forecasts and ingredient top-up suggestions. Current manually supplied stock and queued requirements remain visible. Refreshing the synthetic signal resumes scenario calculations. The application never fills missing stock or forecasts with zero as if measured.

| Scenario | Expected behavior |
|---|---|
| KB09: Prioritize oldest eligible group | Review step → Confirm priority; display order changes, no ticket starts automatically |
| KB10: Change Steady to Rush, initial 5 open | +10-minute projection changes from 7 to 19 tickets; sensitivity envelope changes |
| KB11: Reduce buns from 2 to 1 | Burger ticket moves to Stock check; Start preparing is disabled |
| KB12: Plan buns top-up, then receive | Planning keeps count at 1; receipt increases stock by exactly the displayed quantity; start becomes eligible |
| KB13: Start Solo fixture, then Ready | Chicken count 8 → 7 → 7; no double consumption |
| KB14: Safe fallback | Forecast chart and future ingredient demand paused; current stock still visible |
| KB15: No open tickets | No ingredient-mix estimate; queue forecast remains a labelled what-if calculation |

| New interaction | KPI / validation mapping |
|---|---|
| kitchen_group_viewed | Time and errors finding a priority group |
| kitchen_priority_confirmed | Human-approved prioritization decisions; verify no auto-start |
| forecast_assumption_changed | Comprehension of direction and magnitude in the synthetic projection |
| ingredient_count_adjusted | Accuracy of manual stock-entry task |
| ingredient_topup_planned / received | Distinguish planned receipts from available stock |
| ingredient_consumed / kitchen_start_blocked | Correct recipe deduction and stock-gate adherence |

Use these events for scripted validation tasks; do not report engineering checks as customer/staff study results. All study templates remain unfilled.


## 16. Landscape kitchen dashboard (v1.8)

Kitchen Board now uses a fixed 16:9 canvas fitted inside the browser viewport. At 1920×1080 and 1366×768, all primary information fits without page scrolling: six status metrics, priority groups and ticket queue, 15-minute forecast and assumptions, prep-watch alerts, channel mix, and all 11 ingredient rows. Other window shapes retain the same canvas ratio with surrounding space. This dense board is intended for landscape desktop/tablet displays.

The queue displays six tickets per page, with explicit totals and Previous / Next controls. No tickets are silently discarded. A filter selects open, priority, next, blocked, preparing or ready tickets. Selecting a ticket opens its full contents and actions in a modal; long labels are abbreviated only on the overview. Selecting an ingredient opens quantity adjustment and top-up / receipt actions. Priority confirmation and scenario controls also open in modal panels. These panels can scroll independently when needed; the overview remains a single screen.

The underlying recipes, forecasts, validity rules and human checkpoints are unchanged. Kiosk and Staff POS retain their existing layouts. Esc or the Close control dismisses a modal. The board keeps the exact simulation disclosure, stock placeholder and forecast labels visible. Controls & assumptions contains the full formula, scenario resets, export and evidence limits.


## 17. Connected POS workload and shared preparation (v1.9)

All rules below are synthetic prototype assumptions. No learned AI, measured capacity, actual savings or kitchen efficiency result is claimed. Existing A / B / C_sim / H_live / C_AI definitions remain unchanged.

| Stage | Input and decision | Human checkpoint |
|---|---|---|
| POS Rules | Existing availability, promotion, missing-category compatibility; require a main. Fresh stock must cover all queued recipes, the current basket and the proposed extra. | Manual menu selection remains available; no automatic add. |
| POS Contextual Ranking | Map recipe components to seven stations. Count queued and preparing recipe units separately, excluding Ready. Rank eligible extras by the largest open-unit count among their required stations, then fixture prep class, then price. These counts are not comparable processing times or utilization; this is a test heuristic only. | Show one suggestion and its station, open-unit count, incremental recipe units and stock check. |
| Load Gate | Existing Median waiting-ticket age bands remain primary. High suppresses every extra (v1.12 §21). B retains fixed valid order; Safe fallback bypasses queue ranking. Stock-stale suppresses recommendations via Rules. | ADD / SKIP, then confirm order. Eligibility is checked again. |
| Batch candidate | Among queued orders, take the first individually stock-feasible ticket in team-priority then oldest-first order. Combine up to three orders with the same chicken, shrimp, rice, pasta, fries, cheese or tart component, checking aggregate stock for ALL components as each ticket joins. Rank groups by ticket count then shared-component quantity. | Review tickets, ingredient requirements and recipe/equipment compatibility. |
| Batch execution | Recompute the proposal and check freshness, queued status and stock. Commit all starts and deductions together, or none. Started/Ready tickets cannot be started again. Stale signal or stock-stale pauses suggestions. | Confirm & start group / Skip grouping. Each ticket remains separately marked Ready. |

Batching suggests shared preparation only; it does not assert that different recipes may actually be cooked together. No future orders are held for a batch, no batch-size capacity is verified, and no time reduction is predicted. The forecast chart remains separate what-if arithmetic. Staff must validate recipe, equipment and cooking compatibility.

### Scenarios and validation mapping

| Scenario | Expected visible behavior | Screen / metric to record |
|---|---|---|
| Default queue, two Chicken Rice in POS | Seven station counts, queue menu-item detail and stock-feasible low-work extra | POS: recommendation comprehension, ADD/SKIP rate, choice time |
| Add Cold / ready sides load | Priority upsell changes when the same valid extras now require different open work | POS: ranking sensitivity, explanation comprehension |
| Reduce ingredient stock | Infeasible extra excluded; No recommendation if none remain | POS: invalid exposure rate |
| Safe fallback / stock stale | No queue ranking or batch advice; fixed Rules-only / no eligible recommendation as applicable | POS + Kitchen: fallback correctness |
| Default Kitchen group | Review D105, D104, D103 sharing chicken; all complete-ticket ingredient requirements shown | Kitchen: group comprehension, accept/skip, review time |
| Confirm shared preparation | Three tickets become Preparing, stock decrements once, group ID displayed | Kitchen: double-deduction and partial-start failures |
| Queue / stock changes before confirmation | Old proposal rejected or recalculated; no partial stock change | Kitchen: stale proposal rejection |

Session log adds station workload evidence to recommendation_shown, plus batch_suggested, batch_skipped, batch_blocked and batch_confirmed (ticket IDs, consumed ingredients, group ID). Use the blank test log; these engineering checks are not participant findings.


## 18. Feedback alignment and current scope (v1.10)

The core validation path is **Input → Rules → Contextual Ranking → Load Gate → Human Decision**. The reviewer term “FlowMatch AI” describes the reviewed concept; it does not rename this prototype or establish a learned model. The only solution name remains ComboFlow. The kiosk shows at most **three valid combos + one optional add-on**. Fewer options are allowed when eligibility or overload requires it. Full-menu browsing remains the explicit “I know what I want” path. Bigger choice labels, banknote symbols for budgets and automatic scrolling after selection aim to reduce navigation effort; no reduction in kiosk dwell time has been measured.

Kitchen forecasts and shared-prep groups are optional exploratory views supporting the load constraint. They are not a second product, validated capacity optimizer, learned predictor or proof of kitchen protection. The primary <=2-minute demo should focus on kiosk selection, single upsell, staff action and safe fallback. Do not add further customer choices to demonstrate these supporting views.

### Pilot measurement register — no results yet

Figures below are transcribed from the feedback supplied by the user, not independently verified case observations. They are proposed references / targets, not prototype results. Store the source, population, channel, time window and exact event definition with every baseline before using it in a pilot.

| Outcome | Feedback reference / pilot target | Measurement plan |
|---|---|---|
| Kiosk selection P90 | 180s → <=120s | Timestamp first menu/assisted-choice screen to final item selection, including add-on decision. Measure review/payment separately. Validate this boundary against the baseline source before comparison. |
| Counter queue P90 | 180s → <=150s | Time-motion: service_start minus queue_join for served arrivals, by channel and comparable shift. Retain queue exits and switches in separate records. |
| Abandonment | 3% → <=2%; 10% → <=8% | Map each pair to its original channel/population before use; the pasted feedback does not identify that mapping. Count verified lost transactions / eligible arrivals; channel switching alone is not abandonment. |
| Kitchen queue P90 | Conflicting 120s vs 90s in reviewed tables | Working documentation reference: 120s from the feedback's KPI-table description, pending source reconciliation. Archive 90s as a disputed alternative; do not use it as a second baseline. Define creation-to-prep-start P90 for pilot observation, and keep it distinct from the prototype's Median waiting-ticket age (queued + preparing). No live guardrail is validated yet. |
| Counter order-taking | Conflicting <=75s vs <=70s targets | Use <=75s as the provisional working target throughout this kit; <=70s is an unapproved stretch target, not another official target. Confirm whether the source target is P90 before applying it. Record order_complete minus service_start. |
| Offer / order accuracy | Threshold to be signed off; no invented baseline | Independently check shown offers against menu, promotion and availability at exposure time; check final fulfilled order against confirmed order. Report valid offers / all offers and correct orders / audited orders separately. |
| FIFO | Proof metric; no claimed improvement | Record ticket arrival, prep start, group membership and manager reason. Count later eligible tickets started while older eligible tickets remain waiting; report exception rate and oldest wait, with stock-blocked tickets distinguished. Shared preparation cannot erase FIFO exceptions. |

For live percentiles, freeze timestamp definitions, percentile method, sample size and missing/censored-event handling in advance. Report sample count and uncertainty; the small usability prototype study reports individual durations, median/range and errors instead of claiming robust P90 improvements. Kitchen queue, accuracy and FIFO must be measured alongside front-of-house gains so delay is not merely transferred downstream. Pilot stop/rollback thresholds require operational sign-off; load-band assumptions are not those thresholds.

### Refresh, staleness and ownership — proposed pilot contract

These intervals and roles are **planning assumptions requiring approval**, not integrations implemented in the prototype. Current behavior remains button-driven fixture snapshots, manual stale-stock flags and a simulated kitchen-signal age; there is no background polling or menu-freshness clock.

| Data / governance | Proposed cadence and stale handling | Proposed accountable owner |
|---|---|---|
| Menu and prices | Load signed/versioned snapshot at session start; check version every 60s and revalidate at confirm. If verification fails, suppress unverified recommendations and prices, and request counter verification. No cached price presented as verified. | Menu / pricing owner approves versions; integration team monitors delivery. |
| Promotions | Check active dates and rules on every exposure and confirm; invalidate on version change. Expired or unverifiable promotions cannot apply. | Commercial promotion owner approves eligibility, dates and wording; store manager may suppress, never invent an offer. |
| Stock and ready items | Event update plus 15s heartbeat; proposed stale after 30s. Missing/unverified availability blocks affected offers; don't treat unknown as zero or available. | Kitchen shift lead owns counts/readiness; integration team owns freshness monitoring. |
| Kitchen load | Proposed 15s refresh, stale after 60s. Rules-only fallback, no speed claims; pause optional kiosk upsell, forecasts and batch advice. | Kitchen operations validates signal and bands; shift manager triggers safe mode. |
| Recommendation policy | Versioned decision table; approval before a rule change, weekly pilot review and immediate incident review. Log rule version, inputs, output, human decision and override reason. | Product/operations owner accountable; menu/promotion owners approve their constraints. Staff retain ADD/SKIP and managers retain logged suppression/rollback. |

### Implementation cost, payback and environmental validation

Create a cost register with one-time design/build, POS/KDS integration, menu/recipe mapping, test devices, staff training, pilot observation and rollout support; separate monthly hosting/support, monitoring, menu maintenance and refresher training. Record quantity, unit cost, source quotation, owner and one-time/monthly classification. No verified cost quotations are available, so this kit supplies no claimed cost total or payback period.

For a later business case: monthly net benefit = verified incremental contribution + demonstrably realizable labor savings + verified waste-cost reduction − recurring operating costs. Payback months = one-time implementation cost / positive monthly net benefit. If net benefit is zero or negative, report no payback under that scenario. Do not equate sales with contribution, saved seconds with payroll savings, or switched channels with recovered transactions. Avoid counting the same benefit twice; compare conservative/base/optimistic assumptions only after their sources are supplied.

Environmental hypothesis: ranking eligible ready items may reduce discarded prepared food. Test by weighing discarded food by item and reason per matched shift, reporting kg per 100 fulfilled orders plus units prepared/sold/discarded and stockouts. Track batch leftovers and holding-time compliance as guardrails; larger batches could increase waste. Ready-item ranking must never bypass food safety or minimum Fit. No waste reduction, carbon benefit or return on investment is established by this prototype.


## 19. Selected state, savings and parallel customer display (v1.11)

The add-on heading is **Best add-ons for this combo**. It still presents only one eligible extra. Selecting a combo turns its card and selected-combo context green; accepting an extra shows a green selection confirmation on review. No new selection step is added.

### Savings arithmetic and evidence boundary

Kiosk comparison uses the existing synthetic same-content separate-item reference (meal.retail) minus the combo price (meal.price). If an extra is accepted, add its price equally to both comparison and selected totals. The extra therefore does not inflate the saving. Unknown, non-finite or lower reference prices do not produce a positive savings badge. This display is labelled **DEMO COMPARISON** and **[Verify KFC VN menu]**, not a verified KFC saving. It does not change Best Value ranking or enable contribution-based ranking. Final confirmation freezes the displayed quote.

Example fixture: Crispy Chicken Combo reference 159,000, combo 139,000 → illustrative saving 20,000 VND. With Popcorn Chicken 35,000, the two totals are 194,000 vs 174,000; saving remains 20,000. All reference prices require independent verification before any real customer deployment.

POS savings show only the existing applied demo discount. The VND 10,000 side-basket offer must be eligible and explicitly selected by staff. No discount applied means no positive savings claim, even if an extra was added. Expiry, loss of eligibility or deselection removes the discount from staff and customer views. A selected extra is green independently of whether a discount applies.

### Parallel customer display

On wide screens Staff POS and Customer Display appear side by side. On narrow screens the customer preview stacks below the staff interface. Both are rendered from the same in-memory order, so quantity edits, ADD/SKIP, applied promotions and confirmation update the mirror immediately. This is a two-screen simulation in one page, not a physical-display integration or cross-device synchronization.

Customer-facing content is limited to items, quantities, illustrative prices, applied discounts, total, one optional unaccepted suggestion and order state. It excludes kitchen workload, internal ranking evidence, stock, margins, rule versions and staff controls. A suggestion explicitly says **NOT ADDED**. Review requests agreement with the team; only staff confirmation changes the order to confirmed. Final customer lines and totals use a frozen confirmation snapshot. Reload starts a fresh demo session.

| Scenario | Expected result |
|---|---|
| Select Crispy Chicken Combo | Green selection and DEMO COMPARISON saving VND 20,000 |
| Add Popcorn Chicken / then edit to Skip | Total changes 174,000 → 139,000; saving stays 20,000 |
| Missing / invalid reference price | No positive savings claim |
| POS two rice + accepted Mashed Potato | Both screens total 157,000; no savings until offer is applied |
| Apply eligible demo offer | Both screens total 147,000; green applied savings 10,000 |
| Remove offer / expire promotion | Discount disappears and both draft totals update |
| Confirm, then change scenario controls | Frozen confirmed lines, total and savings remain unchanged |

Validation: compare both displays after every edit, distinguish accepted extras from pending suggestions, verify customer agreement and final staff confirmation, and record any divergent line/total or misleading savings exposure. No live sales or savings results are claimed.


## 20. Reference-led visual refresh (v1.12)
- Visual treatment follows the supplied storyboard: dark device frame, cream canvas, clear red actions, compact intent tiles, one prominent recommendation with two smaller alternatives, and illustrated order review.
- English-only interface retained. The reference image is visual guidance, not operational evidence: no utilization percentage, live-data claim, real payment, unverified wait estimate or learned-AI claim is introduced.
- Validity, minimum Fit, one-extra limit and explicit human actions retained; the High-load upsell policy changes as documented below. Existing green simulated savings and parallel customer display retained.
- Full menu remains available through the manual entry path. The menu category rail appears only in the full menu.


## 21. Customization and operational upsell policy (v1.12)
- New guided route: intent → top three → Customize your combo → Original/Spicy chicken where applicable, Pepsi/7UP/Mirinda drink where included → one optional extra → review → human confirmation. Variant options are price-neutral illustrative fixtures, not verified KFC availability. Generic recipe planning does not distinguish variants. Choices appear in the review, confirmation, event log and kitchen ticket description.
- High load now suppresses **all** kiosk and POS upsell, including ready items and Rules-only branch B. This replaces the earlier High-band rule that allowed short-prep extras. Main-meal ordering stays available. Existing persistence/recovery rules remain.
- POS re-evaluates one recommendation after every basket quantity/menu change: validity and category compatibility → queued ingredient reservation and basket coverage → checked ready portions → lowest station work count → compatible active prep as a tie-breaker → service class → customer price. No margin/contribution term. Shared station/components are candidates for a staff check, not a cooking guarantee.
- Kitchen manager can change ready-item counts and preview Normal/Elevated/High/Safe fallback. Ready counts are synthetic, staff-checked portions within existing ingredient counts; they do not add inventory. Confirmed orders reserve matching ready portions; starting prep deducts ingredients once. No automatic freshness or food-holding compliance claim.
- Stale signals disable workload/ready ranking; POS falls back to fixed valid rules and staff checks, while kiosk extras pause. High blocks upsell irrespective of ready counts.
- Ready-to-pair panel, shared-prep review, ingredient ledger and status controls are parts of the same ComboFlow kitchen view. Manual controls are simulation inputs, not authority to override item validity or promotions.
- Added validation scenarios: change chicken/drink and verify receipt/ticket; change POS basket and observe suggestion; raise a ready-item count; set High and assert zero upsell; return to Normal; stale signal disables ready ranking; repeated confirm cannot reserve twice.


## 22. Continuous counter basket, variant mapping and ready-item governance (v1.13)

### Staff POS: continue editing after ADD / SKIP
- ADD places the one suggested extra in the draft basket and keeps staff on the order workspace. Quantities and menu items stay editable. The extra stays only while it remains valid: item validity, category compatibility, ingredient coverage for queued orders + basket + extra (fresh signal) and the Load Gate. High, an unavailable item, a duplicate category or a basket without a main removes it with a visible notice.
- SKIP records the declined item. One optional extra per order: no new suggestion appears after ADD or SKIP. **Show suggestion again** is an explicit staff action at the customer's request; **Remove extra** counts as a SKIP.
- **Review basket** is a separate step. When a suggestion is open, review requires an explicit ADD or SKIP first. **Back to basket** from review keeps the accepted extra.
- The staff basket and parallel customer display update after every edit. The customer display shows a suggestion only while it is undecided and marks accepted extras.
- The demo discount is removed whenever the basket stops qualifying and is never re-applied automatically; staff must tick it again.

### Kiosk: simulated variant mapping
- Variant groups follow the meal fixture: chicken flavor (Original / Spicy) for chicken meals, drink (Pepsi / 7UP / Mirinda) for meals with included drinks. Prices are neutral.
- Availability is a scenario control (Scenario lab: Spicy / Mirinda unavailable). Unavailable options are disabled on the customization screen. If the chosen option becomes unavailable, the kiosk selects the first available option, shows a notice and returns review to customization; confirmation re-checks the choice. A meal with no available option in a required group is not offered.
- Planning recipe: Spicy uses the same chicken pieces plus one **Spicy marinade** portion per piece (new ingredient row, start count 6). Drink flavors share cups. Start preparing deducts the marinade once with the rest of the recipe; a short marinade count blocks only Spicy tickets. Simulated mapping, not a KFC recipe.
- Dine in / Take away is carried into review, confirmation and the kitchen ticket label. Each confirmed kiosk or counter order shows a demo order number matching its Kitchen Board ticket.

### Ready-item governance
- Each ready-item count carries a demo-clock "last checked" age that advances only with **Advance demo 30s**. Portions unchecked for more than **10 demo minutes** drop out of ready-first ranking (still within validity and stock rules) until staff **Mark checked** or **Discard** them. Discards are logged with count and age for later waste measurement.
- The 10-minute window is an **[Assumption]** placeholder for the pilot, not a KFC holding-time or food-safety standard. Ready status never bypasses Fit, availability, the Load Gate or human ADD / SKIP.

### Scenarios — expected outcomes
| ID | Setup / action | Expected outcome |
|---|---|---|
| P09 | POS ADD, then +1 Chicken Rice | Extra kept; both screens show the same total; no second suggestion |
| P10 | POS SKIP, then edit basket | No suggestion until Show suggestion again |
| P11 | Suggestion open → Review basket | Blocked until ADD or SKIP |
| P12 | Apply demo offer, remove the side, add it back | Offer removed with notice; not re-applied automatically |
| P13 | ADD, then High | Extra removed; review and confirm continue without it |
| K24 | Spicy + Mirinda + Take away → confirm | Review, confirmation and ticket show the choices; ticket needs 2 marinade portions |
| K25 | Spicy chosen, then Spicy unavailable at review | Returned to customization with Original and a notice |
| R01 | Advance demo past 10 min with ready potato | Potato no longer ranked as ready until Mark checked |
| R02 | Confirm twice | One ticket; one ready-portion reservation; ingredients deducted once at Start |

### Kiosk checkout and simulated payment (v1.13.1)
- Kiosk flow is now four steps: 01 Your needs → 02 Combo + customize → 03 Review → 04 Pay.
- **View basket** on the customization screen moves to Review without the optional extra (logged as `basket_opened_without_extra`); nothing is added. Review offers **Edit side** to reconsider. In Review the cart button reads **Checkout** and opens Pay.
- Pay offers Pay at the counter, Card (demo) and QR e-wallet (demo). No method is preselected; the order cannot be placed until the customer picks one. Leaving the step clears the choice. No money is taken and no card or wallet details are collected.
- **Pay & place demo order** (or **Place demo order** at the counter) is the human confirmation: validity, variants and stock are re-checked, then the demo ticket is created. The confirmation shows the payment label with "simulated, nothing charged".

| ID | Setup / action | Expected outcome |
|---|---|---|
| K26 | Customize → View basket | Review, combo only, no extra added |
| K27 | Review → Checkout / Continue to payment | Pay step; place-order button disabled until a method is chosen |
| K28 | Choose Card (demo) → Pay & place demo order | Confirmation with order number and "Payment: Card (demo) · simulated, nothing charged" |

Engineering QA only (logic suites and browser flow checks with synthetic fixtures). No participant, staff, kitchen or food-safety validation is claimed.


## 23. Counter order intent, kitchen status panel and demo live feed (v1.14)

### Staff POS: three customer-need questions
- **1 · Who’s eating?** Just one / Two / Four. **2 · Order type?** Meal / Snack / Sharing (replaces the kiosk budget question at the counter). **3 · Priority?** Fastest / Best Fit / Best Value. Defaults: Two · Meal · Best Fit, which reproduce the v1.13 ranking.
- Before the basket has a base, up to **three starting picks** appear (Meal / Sharing: combos from the kiosk decision table for the party size, sharing uses at least two people; Snack: Light Meal and non-drink sides / desserts). Staff tap a pick to add it; nothing is added automatically. Picks disappear once the basket has a base, so the order still shows at most 3 picks + 1 extra.
- Combos are now orderable at the counter (new Combos filter); their included categories count as already in the basket, so an included drink is never suggested again.
- After a base exists, the single extra is ranked by: portion fit (Sharing or four people → two-portion extras; one person → single portions) → Best Value price → checked ready items → Fastest service class → station workload → shared prep → service class → price. A Snack order can receive one extra without a main; Meal and Sharing still need a main or combo.
- The displayed extra stays stable while it remains eligible for the same basket and needs, so the live feed cannot reshuffle it mid-conversation.

### Customer display
- Before a base: the same up-to-three picks, marked **NOT ADDED**. After a base: the one undecided extra with “Goes well with your …”, “Just VND … more” and “Your total would be VND …” computed from the current basket and any applied demo discount. Accepted extras, totals and discounts update after every staff action. No kitchen, stock or ranking internals are shown.

### Kitchen status panel (Kitchen Board and Staff POS)
- Left navigation: Overview · Kitchen · Suggestions · Reports · Settings. Right column: **Load Gate setup** (Normal / Elevated / High / Safe fallback previews with their policy).
- Overview: status (Kitchen steady / busy / High / Signal unavailable), orders preparing, open tickets, median waiting-ticket age, arrivals in the last 10 demo minutes, and a 60-minute trend of open tickets and median age with the 90 s / 120 s band lines. Kitchen: station recipe-unit workload, ingredients to watch, ready items. Suggestions and Reports: counts from this browser’s event log only. Settings: pause / resume, arrivals, demo crew slots, simulated signal loss, refresh, reset.
- Deliberately absent: utilization or capacity percentages, estimated customer wait times and an unlabelled “LIVE” claim from the reference storyboard.

### Demo live feed
- While Staff POS or Kitchen Board is open, the demo clock advances 15 demo seconds every 1.5 s (×10). Arrivals follow a seeded 30-minute wave around the chosen arrivals/min; a simulated crew starts and finishes **background** tickets only (up to the crew slots, +1/+2 when the queue grows); confirmed demo orders still need a human Start / Mark ready. Scheduled deliveries every 2 demo minutes restore stock. Starting a ticket deducts ingredients once.
- Each tick refreshes the signal and recomputes the median waiting-ticket age, High persistence and recovery. Band changes re-check open suggestions and are logged (`kitchen_band_changed`). Simulated signal loss stops refreshing, so the signal goes stale and Safe fallback applies.
- The Kitchen Board chart shows the last 60 demo minutes (1-minute averages) and the existing 15-minute what-if projection. A synthetic 60-minute lead-in fills the chart at start. All [Assumption]; not a capacity model, forecast accuracy or wait promise.

| ID | Setup / action | Expected outcome |
|---|---|---|
| P14 | POS empty basket → Sharing, Four | Up to three four-person picks on staff and customer screens; none added |
| P15 | Tap the featured pick | One line added; picks hidden; one extra suggested with would-be total |
| P16 | Snack → Golden Fries | One extra that is not another side |
| P17 | Any intent at High | No extra; picks limited to Ready / Short meals |
| S01 | Open Kitchen status from POS and Kitchen Board | Same panel; Load Gate previews change the band for both |
| S02 | Live demo running 3 s | Demo clock +30 s, trend extended, signal age 0 |
| S03 | Pause / simulate signal loss | Clock stops / Safe fallback, no workload ranking |
