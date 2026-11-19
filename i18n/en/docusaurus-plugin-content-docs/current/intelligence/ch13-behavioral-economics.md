---
title: "Chapter 13. Behavioural economics and responsible finance"
sidebar_label: "13. Behavioural economics and responsible finance"
sidebar_position: 3
chapter: 13
subtitle: "Behavioral Economics and Responsible Finance"
reading_time: 28
description: "The two systems of thinking, loss aversion, present bias and mental accounting in borrowing decisions; nudge design (defaults, commitment, transparency); early detection of over-indebtedness; responsible marketing, vulnerable customers, quality-based incentives and customer wellbeing metrics."
source_file: "phan-3-chuong-13.md"
editorial_status: "edited"
lang: en
---

> *"People do not make financial decisions like optimizing machines. They decide as humans do: with emotions, biases, incomplete information, under pressure and in uncertainty. A good financial system must understand that, and be designed to help, not to exploit."*

## Introduction: two encounters, one person {#dẫn-nhập-hai-lần-gặp-một-con-người}

::::story
**Scene 1, March 2024.** Hoa walks into a phone shop. On the sales assistant's tablet: "Only 458,000 VND/month, take your new phone home today!"

Hoa does not ask about the interest rate or work out the total repayable. She just thinks: *458 thousand, that seems fine*, and signs.

The phone costs 12,000,000 VND. The loan is 36 months at 22% a year, with a total repayable of 16,498,283 VND.

**Scene 2, March 2026.** Hoa has just received her year-end bonus when the app sends a notification: "Your loan has 12 months left. If you settle it now, you save 602,922 VND in interest. Would you like to see the details?"

She taps it, sees the concrete saving, and transfers the money straight away.

The same person, the same financial system. In scene 1, the system exploits cognitive bias to sell. In scene 2, the system uses behavioural design to help the customer decide better. The line between these two scenes is the subject of the last chapter of Part IV.
::::

## 13.1 Foundations of behavioural economics {#131-nền-tảng-kinh-tế-học-hành-vi}

### The two systems of thinking

:::key
According to Daniel Kahneman (*Thinking, Fast and Slow*, 2011):

**System 1** thinks fast, automatically and intuitively. Effortless, but prone to bias.

**System 2** thinks slowly, deliberately and logically. More accurate, but effortful and easily tired.
:::

The ideal borrowing decision belongs to System 2: working out the total repayable and the real interest rate, comparing options, assessing the ability to repay over the whole term, considering what happens if you lose your job or fall ill. The real borrowing decision usually belongs to System 1: "458 thousand a month, I can surely pay that", "I've been approved already, let's sign", "I need it right now". The gap between these two ways of deciding leads to over-indebtedness, default and regret.

**The cognitive load trap.** Picture a customer buying a fridge: a noisy shop, a sales assistant standing right beside them, a small child pulling at their hand, five fridges viewed in two hours. System 2 is tired, and System 1 speaks up: "Just sign, let's go home." An ethical system does not exploit moments of high cognitive load like this: it presents a few key, simple pieces of information right at the point of decision, and gives people time to think rather than creating false urgency.

### Prospect theory: loss aversion

Kahneman and Tversky (1979) showed that people do not judge outcomes by absolute value but by the **change** relative to a **reference point**, and that **losses weigh more than equivalent gains**.

```text
Value function v(x), as estimated by Tversky and Kahneman (1992):
  Gains:   v(x) = x^α,         α ≈ 0.88 (concave: diminishing sensitivity)
  Losses:  v(x) = −λ(−x)^β,    β ≈ 0.88, λ ≈ 2.25 (loss aversion coefficient)

λ ≈ 2.25 means:
  Losing 100,000 VND feels as bad as gaining about 225,000 VND feels good
```

**Loss aversion in payment reminders.** These two messages are mathematically equivalent:

| Framing | Message |
|---|---|
| Gain | "Pay early to save 50,000 VND in interest" |
| Loss | "If you don't pay before the 25th, you will pay an extra 50,000 VND in interest" |

Theory predicts that the loss framing drives action more strongly, and this is a hypothesis worth A/B testing on your own customers. A mandatory condition: the number must be true. Never invent a penalty to create a sense of loss.

### Present bias: why people borrow so much

:::key
**Present bias**: people overweight the present relative to the future, even when they know it is not rational.
:::

The β-δ model (Laibson, 1997) describes this:

```text
Standard discounting (time-consistent):
  Today's value of a benefit in year t = δ^t × benefit
  δ = 0.95: 100,000 next year is worth 95,000 today, in two years 90,250

Quasi-hyperbolic discounting (the β-δ model):
  Today's value = β × δ^t × benefit, for every t > 0
  β < 1 is the present bias coefficient

  Everything in the future is cut once more by β,
  while the present is not. When "next month" arrives, it becomes the present,
  and the plan "next month I'll start saving" is pushed back again.
```

**An example with Lan's loan:**

```text
Lan needs 18,500,000 VND for a laptop for her work.

Option A: save for 12 months, then buy
  Cost: 18,500,000 VND, no interest
  But: a 12-month wait, and the old laptop is slowing her work down

Option B: borrow now, repay over 12 months (the book's loan)
  18%/year, appraisal fee 200,000 VND
  Total interest: 1,852,957 VND, fee: 200,000 VND
  Extra cost: 2,052,957 VND, about 11% of the laptop's price
  In return: the laptop today
```

For Lan, borrowing may be a rational decision: the laptop is a work tool, and having it 12 months earlier may be worth more than 2 million VND. Present bias becomes a problem when it pushes people to borrow for things their future selves will regret. The lesson for system design: use present bias for good (automatic saving as the default), and do not exploit it to sell unnecessary loans.

:::summary[Section 13.1]
Financial decisions are often driven by System 1, so exploiting moments of high cognitive load is easy but unethical. Loss aversion (λ ≈ 2.25) suggests that reminders framed as losses may be more effective, as long as the number is true. Present bias explains why over-borrowing is predictable, and the system should be designed to help rather than exploit it.
:::

## 13.2 Cognitive biases in borrowing {#132-thiên-kiến-nhận-thức-khi-vay}

### Anchoring

::::story[Try it now]
Before reading on, write down: how much would you be willing to pay each month for a 15 million VND loan?
::::

If you have just seen the number 750,000 somewhere, your answer tends to be closer to 750,000 than if you had just seen 1,500,000. That is the anchoring effect, and it directly affects credit decisions.

The best-known field evidence comes from Bertrand and colleagues (2010), an experiment with loan offer letters in South Africa: details unrelated to price, such as a photo of a woman on the letter or showing only one example loan rather than several, changed loan demand by as much as a significant interest rate cut. Presentation matters almost as much as price.

In the application flow, the strongest anchor is the first number the customer sees for the loan amount:

| | Option A: show the maximum limit first | Option B: show the recommended amount first |
|---|---|---|
| The customer sees | "You are approved for up to 50,000,000 VND" | "Based on your income, we recommend 15,000,000 VND" |
| Consequence | Many ask for close to the maximum: "if I can get 50 million, 30 million seems reasonable" | Many ask for close to the recommended amount |

Vela Finance tested switching from option A to option B on the digital channel. The average loan amount fell 18%, the default rate fell 22%, and short-term revenue fell 8% because of lower volume. That is the core tension: smaller loans mean lower short-term revenue, but better affordability means fewer defaults in the long run, and customers with good outcomes trust you and come back.

### Optimism bias

:::key
**Optimism bias**: people systematically overestimate the likelihood of good things happening to them and underestimate the likelihood of bad things.
:::

```text
Vela Finance survey of 1,000 borrowers, before disbursement:
  "Do you think you will have difficulty repaying?"
    Definitely not:  72%
    Unlikely:        20%
    Possibly:         7%
    Very likely:      1%

Actual outcome after 18 months:
    No difficulty:         68%
    Some difficulty:       19%
    Significant difficulty: 9%
    Default:                4%

8% thought difficulty was "possible" or "very likely",
but 13% actually had significant difficulty or defaulted.
```

If everyone underestimates their own risk, self-assessed affordability is always optimistic: ask "can you pay 1,696,080 a month?" and the answer is almost always "yes", because the person answering is thinking of the best case. The system should not rely on self-assessment alone but build stress tests into the calculation ("if your income fell 20%, could you still pay?", "what about an unexpected 3 million expense?"), and state the risk clearly to the customer: "With your current income, if you lost your job or your income fell 20%, the monthly payment could become a burden. Do you have a buffer for this situation?" The aim is not to scare the customer but to help them make an informed decision.

### Mental accounting

:::key
**Mental accounting** *(Richard Thaler, Nobel 2017)*: people treat money differently depending on which mental "account" it belongs to. Salary, bonuses, windfalls and savings are all money, but they are spent in different ways.
:::

An unexpected 3 million VND bonus is often spent because it is "money from heaven", even when the recipient has a loan at 18% a year. Rationally, using it to pay down the debt would save interest. Conversely, money labelled "children's school fees" is very hard to touch. The same money, different accounts, different behaviour.

Applied to repayment design: help customers create a "repayment" account. Direct debit on payday means repayment money never enters the "spending" account. At Vela Finance, customers using direct debit pay on time for 94% of instalments, against 76% for customers who pay manually. Part of the gap comes from the fact that customers who actively choose direct debit are already more disciplined, so measuring the true effect requires a randomized test, as in section 13.3.

:::summary[Section 13.2]
The first number a customer sees becomes the anchor, so showing a recommended amount instead of the maximum limit reduces loan amounts and default rates. Optimism bias makes self-assessed affordability always too optimistic, so stress tests and clear statements of risk are needed. Mental accounting explains why direct debit on payday works.
:::

## 13.3 Designing nudges {#133-thiết-kế-cú-hích}

### Default options

:::key
**Default option**: what happens if the customer does not actively choose something else. Most people accept the default.
:::

The classic example is organ donation (Johnson and Goldstein, 2003): in Austria, where the default is consent and anyone who does not want to must opt out, consent is close to 100%; in Germany, where people must opt in, it is only about 12%. The two countries have similar cultures; the difference lies mostly in the default.

**Defaults in consumer lending, from Vela Finance's tests:**

```text
DIRECT DEBIT

Old design (opt-in):
  "Would you like to sign up for automatic repayment? [ ] Yes"
  Sign-up rate: 45%

New design (on by default, can be turned off):
  "Automatic repayment has been turned on for your account.
   To turn it off: [ ] Turn off automatic repayment"
  Usage rate: 82%

Result: 37 percentage points more customers on direct debit
  → Fewer late payments, fewer late fees for the customer
  → Good for both the customer and the lender

LOAN AMOUNT

Old design: the "Amount" field is empty
  Average amount customers enter: 24 million
New design: the "Amount" field is prefilled with the recommended amount based on income
  Average amount: 17 million
  → The default helps customers avoid over-borrowing

REPAYMENT DATE

Old design: "Choose a repayment date" [1 ... 28]
New design: defaults to 3 days after payday
  → The customer doesn't have to think; salary arrives, the debt is paid
  On-time repayment rate: +11 percentage points
```

### Commitment devices

:::key
**Commitment device**: a mechanism that lets people voluntarily limit their own future choices in order to keep to their present intentions.
:::

The classic image is Ulysses: knowing he would not be able to resist the sirens' song, he had himself tied to the mast in advance. The present self binds the future self.

It sounds irrational for someone to voluntarily reduce their own options. But for someone who knows they have present bias, it is an entirely rational decision. Some commitment devices in lending:

| Device | How it works | Who needs it |
|---|---|---|
| Savings lock | A "savings goal" locks money for 6 months, with a small fee for early withdrawal | People who want to save so they won't need to borrow next time but know they tend to withdraw |
| Bonus repayment pledge | The customer pledges in advance "I will use my next bonus to pay down my loan"; when the bonus arrives, the app reminds them and lets them confirm with one tap | People who know their bonus usually gets spent |
| Self-imposed borrowing lock | The customer sets: "if non-essential spending exceeds X, lock new borrowing for 30 days" | People under financial stress who want to avoid a debt spiral |

Commitment devices work because users choose them themselves. At Vela Finance, about a third of customers sign up for the bonus repayment pledge when it is offered, and most of them keep their pledge.

### Transparency tools

Customers usually know their monthly payment and due date. They usually do not know how much of that payment is interest and how much is principal, how much interest they have paid so far, how much they would save by paying early, or how this loan affects their overall debt picture. That information gap turns customers into passive participants.

**Tool 1: a visual repayment schedule**

```text
Loan: 18,500,000 VND, 12 months, 18%/year
Monthly payment: 1,696,080 VND (final instalment 1,696,077)

No. | Principal paid | Interest paid | Remaining balance
 1 |  1,418,580  |   277,500  | 17,081,420
 2 |  1,439,859  |   256,221  | 15,641,561
...
12 |  1,671,012  |    25,065  |          0

Visualization: stacked bars of principal and interest
  First instalment: the largest interest share → "I pay the most interest at the start"
  Last instalment: almost entirely principal
What the customer realizes: paying early saves more interest
```

**Tool 2: an early repayment calculator**

```text
Screen: "How much do you save by paying early?"

Input: "Amount you can pay extra: [2,000,000]"
Result (Lan, right after instalment 8, balance 6,537,342 VND):
  "Pay an extra 2,000,000 VND today, keeping the same monthly payment:
   → Term shortened by: 1 month (3 instalments left instead of 4)
   → Interest saved: 116,422 VND
   → Settle one month earlier"

[Pay now] → straight into the payment flow
```

The [Tools](/docs/tools#early-settlement) page has an early settlement calculator for checking numbers like these.

**Tool 3: a financial health card (not a credit score)**

```text
Monthly summary sent as a notification:
  ┌──────────────────────────────────┐
  │ Your financial health            │
  │                                  │
  │ Remaining balance: 6,537,342 VND │
  │ Debt/income: 7.7% (safe)         │
  │ Progress: ████████░░░░ 8/12      │
  │                                  │
  │ 4 months to go until settled!    │
  │ [See details] [Pay early]        │
  └──────────────────────────────────┘

Design choices:
  "Health" framing (positive) instead of "debt" (negative)
  Progress bar: motivation to finish
  Concrete milestone: "4 months to go" instead of "35% of the balance left"
  Action buttons: a frictionless path to the desired behaviour
```

:::summary[Section 13.3]
Default options are the most powerful design tool: direct debit on by default, a prefilled recommended amount and a repayment date set after payday all help customers without restricting their choice. Commitment devices work because customers choose them. Transparency tools show customers what is usually hidden: the interest in each instalment, the saving from paying early, and progress towards settlement.
:::

## 13.4 Detecting and preventing over-indebtedness {#134-phát-hiện-và-ngăn-chặn-nợ-quá-mức}

### Early warning signs

::::story
After eight months of paying on time, Hoa starts to struggle with another loan at Vela Finance. She tells nobody and just carries on. September is paid on time. October is 3 days late. November is 8 days late. In December she cannot pay.

There were four months in which to intervene. The system has to "see" it before DPD appears.
::::

```text
BEHAVIOURAL SIGNALS (from the app, digital channel):
  Login frequency drops (0.7 times the baseline)
  Payment timing drifts later
  More calls to the contact centre (asking about support options)
  Employment details updated (a job change?)

PAYMENT SIGNALS:
  Partial payment (80% of the amount due): a strong early warning
  Payment date drifting: 5th → 10th → 15th
  Repeated failed payments: an attempt, a failure, a retry the next day

EXTERNAL SIGNALS (if integrated):
  More credit inquiries: borrowing elsewhere
  New loans with other lenders: taking on more debt
  Late bill payments: wider financial stress

FINANCIAL STRESS SCORE MODEL:
  Inputs: the signals above
  Output: P(default in the next 60 days)
  Trigger early intervention when P > 30%

  At the 30% threshold:
    Precision 62%: of the customers flagged, 62% really have a problem
    Recall 71%: of the customers with a problem, 71% are flagged
```

### Affordability assessment

Eligibility and affordability are two different questions. Eligibility asks "**can** the customer take this loan?", based on the credit score, fraud checks and credit data. Affordability asks "**should** the customer take this loan?", that is, can they repay without undue difficulty. Checking eligibility while ignoring affordability may be legal in some places, but it is not responsible lending.

An affordability assessment has four parts. First, verify income rather than relying on declarations: payslips, bank statements, confirmation with the employer. Second, list every existing obligation: loans from the credit bureau, obligations the customer declares that the bureau does not know about, and essential costs such as rent, utilities and school fees. Third, run a residual income check. Fourth, run a stress test.

```text
Residual income check:
  Residual = Income − All obligations (existing + the new loan)
  Must exceed the household's minimum living costs

  Minimum living cost standard (Vela Finance internal policy):
    Ho Chi Minh City, Hanoi: 5,000,000 VND/person/month
    Other cities:            3,500,000 VND/person/month
    Rural areas:             2,500,000 VND/person/month

  Threshold: Residual / household minimum costs ≥ 1.2 (a 20% buffer)

Stress test:
  "If income fell 20%, could the household still meet all its obligations?"
  If not: reduce the loan amount, extend the term, or reject

Lan (single, Hanoi):
  Income 22,000,000; new payment 1,696,080; no other debts
  Residual: 20,303,920 → 4.1 times the 5,000,000 minimum → passes
  Income down 20%: 17,600,000 − 1,696,080 = 15,903,920 → still passes
```

### Tiers of intervention

| Tier | Trigger | Action | Principle |
|---|---|---|---|
| 1. Advance reminder | P(default) 15-30% | In-app notification: "Your payment of 1,250,000 VND is due on 25/11. Remind me [3 days] [1 day] before" | Reduce friction, don't alarm the customer |
| 2. Proactive contact | P(default) 30-50% | The contact centre calls to check in: "Have you had any difficulties lately? We can help adjust your payment schedule if needed." Options: change the repayment date, defer one payment, restructure | Never say "you're about to default"; offer help, don't demand money |
| 3. Hardship support | P(default) > 50% or DPD 1-15 | The hardship team finds the root cause and picks a suitable solution: job loss → a 3-month payment holiday; illness → a longer holiday, help with an insurance claim; over-indebtedness → restructuring, referral to budgeting advice | Cure and retain, don't chase and sue |
| 4. Collections | DPD 30+ | The process in Chapter 10 | |

## 13.5 Responsible marketing and sales {#135-tiếp-thị-và-bán-hàng-có-trách-nhiệm}

### Presenting a loan offer ethically

::::story
Tuấn, an engineer, gets a request from Marketing: "Build a feature that shows the maximum approved limit first, very prominently on screen."

Tuấn knows the data from the test in section 13.2: going back to showing the maximum limit first will raise the average loan amount, and the default rate with it.

What should he do?
::::

A simple framework is the "ordinary person" test: would an ordinary, fully informed person feel manipulated or deceived by this design? More specifically, there are four tests, like the four questions in section 10.7:

1. **Legal:** does the design comply with consumer protection and cost disclosure rules?
2. **Front page:** if a headline read "Finance company X shows maximum limits to lure customers into borrowing more", would we be comfortable?
3. **Family:** would we use this design on our own mother or siblings when they borrow?
4. **CLV:** does this design help or harm the customer's long-term financial health? If it harms, is the short-term revenue worth it?

Marketing's request fails at least three of the four tests. Tuấn should take the test data to Minh and propose keeping option B, with a "see maximum limit" button for customers who want to know.

**Practical guidelines:**

| Aspect | Do | Never |
|---|---|---|
| Showing price | APR prominent, the same size as the rate; total cost shown before acceptance; the monthly payment always accompanied by the total cost | Hide fees in small print; show only the monthly payment and bury the total cost |
| Showing the amount | Show the recommended amount based on DTI; let the customer adjust it; show the impact: "borrowing X more raises your monthly payment by Y and total interest by Z" | Make the maximum limit the default or recommendation; invite customers to borrow more without showing the cost |
| Urgency | Genuinely time-limited offers; "your application expires in 7 days" if that is true | Fake countdown timers; "only 3 places left"; "this rate is only for today" when it will still be there tomorrow |

### Identifying vulnerable customers

The UK Financial Conduct Authority (FCA) defines a vulnerable customer as someone who, due to their personal circumstances, is especially susceptible to harm, particularly when a firm is not acting with an appropriate level of care. The FCA names four groups of drivers: health (physical or mental conditions that affect judgement), life events (bereavement, job loss, relationship breakdown), resilience (little financial buffer, hard to withstand shocks) and capability (low financial literacy, difficulty understanding products).

In Vietnam, groups that need attention include older people who may not be used to digital products, first-time borrowers with no experience managing debt, customers under financial stress (detected through behavioural signals), and customers with a high DTI just before applying.

```text
Vulnerability signals (consent needed to collect and use them):
  Over 65 AND a first-time borrower
  Contact centre history: signs of stress in call content
  Several rejected applications in a short time
  Repeated applications after midnight

When flagged:
  Route to a staff member for review, no automated decision
  Extra time for explanation at the point of sale (trained staff)
  A second review before disbursement
  A check-in call 30 days after disbursement: "Is everything OK?"

Note:
  Never reject solely because a customer is vulnerable (discrimination risk);
  serve them with more care and support.
  Health data is sensitive personal data under the Law on Personal Data Protection;
  do not infer health conditions from behaviour.
```

### Sales incentives

::::story
Hương reviews the third-quarter results for the agent sales channel.

Agent Hà in Hanoi: 200 loans, average amount 25 million, a DPD 30+ rate of 11% for this group of loans after 12 months. Commission under the current scheme: 50,000,000 VND.

Agent Nam in Da Nang: 140 loans, average 18 million, a DPD 30+ rate of 2.5%. Commission: 25,200,000 VND.

Who is the better agent?
::::

The current scheme pays 1% commission on the amount disbursed. The rational response for an agent is to maximize loan amounts (persuade customers to borrow more), reduce friction (ignore warning signs), and not care whether the customer can repay, because by then they have moved on to the next customer. The result is high volume, high defaults, and profit that is only an illusion: the agent wins in the short term, the company loses in the long term.

```text
Quality-adjusted commission:
  Base commission: 1% of the amount disbursed
  Quality multiplier, by the DPD 30+ rate of the loan group after 12 months:
    < 3%:     1.5 times (a reward for excellent quality)
    3-6%:     1.0 times
    6-10%:    0.7 times
    > 10%:    0 times, and commission already paid is clawed back

Agent Hà:  200 × 25,000,000 × 1% × 0   = 0 (and 50,000,000 already paid is clawed back)
Agent Nam: 140 × 18,000,000 × 1% × 1.5 = 37,800,000 VND
```

Nam earns more despite lower volume, because his quality is higher. Hà is penalized for selling unsuitable loans. The same principle applies at product level: a product manager's targets should be tied to 12-month vintage default rates, customer satisfaction and the repeat customer rate, not just volume or revenue; sales targets should not be tied to the loan amount per file or the approval rate.

:::summary[Sections 13.4 and 13.5]
An early warning system combines behavioural, payment and external signals to intervene before DPD appears, in four tiers from a gentle reminder to collections. Affordability differs from eligibility: verify income, count every obligation, check residual income and run a stress test. The four tests, legal, front page, family and CLV, help with sales design decisions. Vulnerable customers are served with more care, not rejected. Quality-based commission aligns the agent's interests with those of the customer and the company.
:::

## 13.6 Responsible finance {#136-tài-chính-có-trách-nhiệm}

### A responsible lending charter

::::story
Minh proposes: "We should have a responsible lending charter that states clearly what we will and won't do."

Hương: "Sounds good. But I want it to be real, not a marketing document."
::::

A real charter has four parts, each listing what we will do and what we will not do, and every line must be verifiable:

| Part | We will | We will not |
|---|---|---|
| Affordability | Assess ability to repay on verified income; stress test with income down 20%; count every existing obligation; not disburse when residual income is below 1.2 times minimum living costs | Let sales pressure override the affordability assessment; use complex terms to hide the real cost |
| Transparency | Show the APR prominently in every offer document; show the total cost before the customer accepts; explain fees, penalties and conditions clearly; give reasons for rejection on request | Advertise the monthly payment without the total cost; hide important conditions in small print; change terms after the customer has committed |
| Fairness | Audit approval rates by demographic group every quarter; investigate and remedy disparate impact; use only factors related to credit risk in pricing and approval | Use protected attributes, or known proxies, in pricing or approval |
| Preventing over-indebtedness | Run an early warning system and proactive intervention; offer support programmes before debt escalates; train the collections team in empathy; report actual DPD rates to the Board every quarter | Harass or deceive when collecting; make contact outside 7:00-21:00; threaten legal action before voluntary options have been exhausted |

### Measuring customer wellbeing

The metrics most lenders track, such as approval rate, volume, NIM, default rate and NPL ratio, tell you how the lender is doing. They do not tell you how the customers are doing. Five customer wellbeing metrics fill that gap:

| Metric | How it is measured | What it means |
|---|---|---|
| Self-assessed financial health | A monthly sample survey: "Compared with 3 months ago, how is your financial situation?" (1-5) | Trends by group and product |
| Satisfaction after borrowing | 12 months after disbursement: "Was this loan the right decision?" | The share of "yes" is a direct wellbeing indicator |
| Change in DTI | DTI at origination against 12 months later | Did the loan help (productive use, rising income) or harm (same income, more debt)? |
| Quality of repeat customers | The share of customers returning in better financial shape against worse | Distinguishes loyal customers from a debt spiral |
| NPS with reasons | "Would you recommend us to a friend?" and why | "A good product" is very different from "it was my only option" |

Every Board report should include both groups of metrics, and part of the executive bonus should be tied to customer wellbeing metrics.

### Long-term value or short-term exploitation

The short-term exploitation model maximizes revenue per interaction: high-pressure selling for bigger loans, complex terms for higher hidden fees, discouraging early repayment to protect interest income, aggressive collections for maximum recovery. Revenue in the first quarters is high, but customers are financially harmed, trust erodes, customers leave, and the regulator starts paying attention.

The long-term value model does the opposite: the right loan, the right customer, the right time; transparent terms; support for early repayment; proactive handling of hardship; ethical collections so customers keep their dignity and can come back. Revenue in the first quarters is lower, but customers are financially healthier, come back and refer others, and the company has room with the regulator to grow.

A simple CLV calculation shows why: CLV is roughly the profit per period times the number of periods the customer stays (Chapter 3). The exploitation model has high profit per period but low retention; the value model has moderate profit per period but high retention. When retention differs enough, the second model wins, and responsible lending becomes a profitable strategy rather than merely an ethical choice.

## Chapter 13 summary {#tóm-tắt-chương-13}

```text
Lan's journey through a behavioural lens:

APPLICATION
  Digital channel (lower cognitive load than at the point of sale)
  Recommended amount shown first: 18,500,000 VND (not the maximum limit)
  Affordability: residual income 4.1 times the minimum, passes the
  20% income reduction test
  → She takes a loan she can actually repay

MANAGING THE LOAN
  Direct debit on by default: she keeps it (barely notices it, and it works)
  Monthly financial health card: "8/12 instalments, 4 months to go!"
  → Positive reinforcement, frictionless engagement

AFTER INSTALMENT 8
  She receives a bonus and opens the early repayment calculator:
    "Pay 2 million extra → save 116,422 VND, settle 1 month early"
  Mental accounting: the bonus is labelled "early repayment"
  → She pays extra

OUTCOME
  Settled after 11 instalments instead of 12
  Total interest: 1,736,535 VND instead of 1,852,957 VND (6.3% less)
  → She will come back when she needs her next loan

Behavioural design did not manipulate her. It helped her do what she herself wanted.
That is the difference between an ethical nudge and a dark pattern.
```

## Review questions {#câu-hỏi-tự-kiểm-tra}

**Type 1: Recall**
1. What are System 1 and System 2? Why are financial decisions often driven by System 1?
2. What does the loss aversion coefficient λ ≈ 2.25 mean in practice? Give an example in designing payment reminder messages.
3. What is present bias? Why do people "always plan to start saving next month" but never start?
4. Mental accounting: why is bonus money usually spent faster than salary?

**Type 2: Understand**
5. "The default option is the most powerful design decision." Explain using the organ donation and direct debit examples.
6. What is a commitment device? Why is it rational for someone to voluntarily limit their future choices?
7. Why is asking "do you think you will have difficulty repaying?" not an affordability assessment?
8. Distinguish between an ethical nudge and a dark pattern in financial products. Where is the line?

**Type 3: Apply**
9. Design a payment reminder sent 7 days before the due date:
   - Amount due: 1,696,080 VND
   - The customer has paid on time for 8 months
   - The app detects the customer paying later and later in the month (5th → 12th → 19th)

   (a) Write version A (standard)
   (b) Write version B (loss-framed, truthful)
   (c) Write version C (suggesting a commitment device)
   (d) Which version would you A/B test first, and why?

10. A single customer in Ho Chi Minh City with an income of 15 million/month and existing obligations of 4 million/month applies to borrow 20 million over 18 months at 18% a year.

    (a) Calculate the monthly payment. Residual income check: pass or fail?
    (b) Stress test with income down 20%: pass or fail?
    (c) To correct for optimism bias, what should the staff member say to the customer?
    (d) Which vulnerability signals should be watched for?
    (e) If all checks pass, what recommended amount should be shown first?

**Type 4: Analyse**
11. Marketing proposes: "When a customer's friend has just settled their loan, send a notification: 'Your friend has just paid off their loan. Would you like to borrow for [purpose]?', with the friend's photo."

    Analyse: (a) Which behavioural mechanisms does the proposal use? (b) Is it ethical? (c) Are there legal issues, especially around personal data? (d) How would you redesign it to be ethical and still effective?

12. Hương proposes quality-based commission: a base amount plus a multiplier based on the 12-month default rate.

    The sales team objects: "It's unfair, some agents cover harder territories."

    (a) Is the sales team's argument valid? What is the economic logic?
    (b) How do you design an incentive scheme that accounts for territorial differences?
    (c) The risk of NOT adjusting for territory? The risk of DOING so?
    (d) Design a balanced proposal to put to the Board.

## Exercises {#bài-tập-áp-dụng}

**Exercise 1: A behavioural design audit**

Audit the loan application flow of a (hypothetical) fintech:

1. Landing page: "Borrow up to 100 MILLION VND! Takes just 5 minutes!"
2. Enter personal details → immediately: "You're eligible to borrow up to 75,000,000 VND!"
3. The loan amount field is empty (the customer types it in)
4. Interest: "From just 1.5%/month" (no annual rate stated)
5. "Get the money within 30 minutes! [Approve now]"
6. The confirmation screen shows only the monthly payment and due date
7. A [Confirm] button

Requirements:
(a) Identify every behavioural problem at each step
(b) Classify each: dark pattern, suboptimal experience, or possibly unlawful
(c) Redesign each problematic step
(d) Predict the impact of the new design on approval rate, average loan amount and default rate

**Exercise 2: Designing an early intervention programme**

Design a full early warning and intervention system for a portfolio of 100,000 active loans.

Available data:
- In-app behavioural data (logins, navigation, support requests)
- The exact payment date of every instalment
- Credit bureau data refreshed at the start of each month

Requirements:
(a) Define the inputs and target variable of the early warning model
(b) Define the thresholds for each tier (P(default) → tier 1/2/3/4)
(c) Design the intervention for each tier (message, channel, content)
(d) Estimate the staff needed for tier 3
(e) Define the programme's success metrics
(f) How do you avoid contacting customers who don't need it (false positives)?

**Exercise 3: A responsible lending assessment**

You are a consultant hired to assess the responsible lending practices of a consumer finance company.

Documents provided:
- Three loan products: standard, fast, sub-prime
- The origination process (from application to disbursement)
- The collections process
- Marketing materials (5 TV ads, 3 types of in-app notification, sales scripts)
- The agent incentive scheme
- Default rates by vintage

Design the assessment framework:
(a) The 10 questions you would ask
(b) The documents and data you would request in addition
(c) What does good practice look like in each area?
(d) What do warning signs look like?
(e) How would you score and present the results to the Board?

## Further reading {#đọc-thêm}

**Foundations of behavioural economics:**
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux. The standard work on the two systems of thinking, prospect theory and cognitive biases.
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.* Yale University Press. A framework for designing nudges in policy and products.

**Behavioural economics in finance:**
- Ariely, D. (2008). *Predictably Irrational: The Hidden Forces That Shape Our Decisions.* HarperCollins. More accessible than Kahneman, with many examples of financial decisions.
- Bertrand, M., Karlan, D., Mullainathan, S., Shafir, E., & Zinman, J. (2010). What's advertising content worth? Evidence from a consumer credit marketing field experiment. *Quarterly Journal of Economics*, 125(1), 263-306.

**Responsible finance:**
- Financial Conduct Authority. (2022). *A new Consumer Duty* (PS22/9). Available at fca.org.uk. The most comprehensive current regulatory framework for good outcomes for retail financial customers.
- Financial Conduct Authority. (2021). *Guidance for firms on the fair treatment of vulnerable customers* (FG21/1).

*Part IV ends here. We have gone from data to score (Chapter 11), from score to price (Chapter 12), and to human behaviour (Chapter 13). Part V looks to the future: BNPL and embedded finance (Chapter 14), AI in lending (Chapter 15), and the design principles distilled from the whole book (Chapter 16).*
