# ComboFlow — 3-minute prototype walkthrough

Kiosk → Staff POS → Kitchen Board. One presenter; stage directions in *italics*.
Start from a fresh page load so the order numbers are #D106 (kiosk) and #D107 (counter).

## 0. Opening (15 s)

"This is **ComboFlow**, a functional prototype for KFC ordering. It connects three screens — the customer kiosk, the staff counter and the kitchen — with one rule set: **Rules → Contextual Ranking → Load Gate → Human Decision**. Everything you see is simulated: synthetic menu, prices and kitchen data, and a pre-scripted decision table, not a trained AI."

## 1. Customer Kiosk (60 s)

*Customer Kiosk tab. Portrait kiosk screen.*

"Customers get two clear paths: **Help me choose**, or go straight to the full menu."

*Tap **Help me choose**. Select **Two people** · **Under VND 200,000** · **Best Fit** → **Find my meal**.*

"Three quick questions, then exactly **three picks** — a Best Fit, an alternative, and the Fastest to Serve option. Every pick has already passed availability, budget and party-size rules."

*Select **Crispy Chicken Combo** (VND 139,000).*

"Customers make it theirs — Original or **Spicy**, and their drink."

*Choose **Spicy**, keep **Pepsi**.*

"Then **one** optional add-on that fits the combo and the budget: Popcorn Chicken, *just VND 35,000 more*. Nothing is ever added automatically."

*Tap **Add this extra** → Review.*

"The review shows the total — VND 174,000 — and a clearly labelled demo comparison: VND 20,000 saved versus buying the same items separately."

*Continue to payment → **Card (demo)** → **Pay & place demo order**.*

"The customer confirms, and gets order number **#D106**. No real payment is taken."

## 2. Staff POS (60 s)

*Staff POS tab. Point to the customer display on the right and the **DEMO LIVE** badge.*

"At the counter, staff see the order workspace; the customer sees their own display on the right. The kitchen signal is live in this demo."

*Customer needs: **Two** · **Meal** · **Fastest**.*

"Staff ask the same three kinds of questions — who's eating, **meal, snack or sharing**, and what matters most. ComboFlow offers up to three starting picks, shown to the customer as *not added*."

*Tap **Chicken Rice Combo**.*

"Once there's a meal in the basket, ComboFlow looks at the kitchen: Mashed Potato is **ready right now**, so it suggests one extra — *just VND 19,000 more*. The customer display already shows *your total would be VND 164,000*."

*Tap **ADD** → **Review basket** → **Confirm basket**.*

"Staff can keep editing after ADD or SKIP, and only a human confirms. Order **#D107** goes to the kitchen."

## 3. Kitchen Board (45 s)

*Kitchen Board tab.*

"The kitchen sees every order and every ingredient in one landscape view. The chart shows the last 60 demo minutes and a 15-minute what-if projection; the clock runs ten times faster for the demo."

*Point to **#D106** and **#D107** in the order queue (use the filter or next page if needed); point to **Spicy marinade** in Ingredients.*

"Our two orders are waiting for the team to press **Start**. The kiosk's Spicy choice is mapped to its own ingredient, deducted once when cooking starts."

*Open **Kitchen status** → in **Load Gate setup** tap **High**. Switch to **Staff POS** and add a meal.*

"When the kitchen is under **High** load, every upsell pauses automatically — at the kiosk and at the counter. Orders continue; we just stop adding work to a busy kitchen."

*High holds for about 30 real seconds in the live demo before it recovers.*

## 4. Close (15 s)

"So ComboFlow gives customers **three good choices and one optional extra**, helps staff suggest what the kitchen can actually serve, and keeps people in charge of every decision. Prices, menu items and kitchen figures here are simulated and marked *Verify KFC VN menu*; the next step is a shadow-mode pilot with real store data."

---

**Presenter checklist**
- Use the live web page or `ComboFlow-standalone.html`; reload before presenting.
- Stay on Staff POS a couple of seconds before adding the meal so the live kitchen feed has delivered stock.
- Do not claim real wait times, utilization, revenue uplift or user-test results.
