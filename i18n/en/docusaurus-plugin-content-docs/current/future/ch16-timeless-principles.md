---
title: "Chapter 16. Timeless design principles"
sidebar_label: "16. Timeless design principles"
sidebar_position: 3
chapter: 16
subtitle: "Timeless Design Principles"
reading_time: 25
description: "Nineteen principles distilled from the whole book, in five groups: mathematics and data, system architecture, risk management, product and customer, organization and culture; with a letter to the reader."
source_file: "phan-4-chuong-16.md"
editorial_status: "edited"
lang: en
---

> *"Technology changes every five years. Regulation changes every ten. But good principles, of financial mathematics, of system design, of business ethics, do not change. Learn them once, use them forever."*

## Introduction: the year-end conversation {#dẫn-nhập-cuộc-trò-chuyện-cuối-năm}

::::story
At the end of the year, Hương calls the whole team into a meeting. No figures, no planning. She asks just one question:

*"If this company closed tomorrow, and we all went off to build a new credit system from a blank page, what would we do differently?"*

The room is silent. Then the answers start to come. Minh: "I'd design around tariffs from day one, nothing hard-coded." Tuấn, the engineer: "I wouldn't use `double` for any financial number." Nga from the collections team: "I'd call customers before they fall overdue, not after."

Lan is not in the room. But the whole conversation, about the right design, the right system, the right way to treat people, is about people like her.
::::

This chapter is the wrap-up. There are no new concepts, only principles distilled from the previous fifteen chapters, presented so you can carry them with you: into daily work, into design decisions, and into the moments when you are pressured to cut corners.

## 16.1 Principles of mathematics and data {#161-nguyên-tắc-về-toán-học-và-dữ-liệu}

### Principle 1: money is an exact number

:::key
**Never use `float` or `double` for amounts of money.**
:::

The floating-point error in each calculation is tiny, but a financial system performs hundreds of millions of calculations a year. Suppose a wrong rounding approach makes each transaction off by 0.4 VND on average: with 300 million transactions a year, that is 120 million VND belonging to nobody, scattered across millions of customers without anyone noticing, until an audit or reconciliation finds the books don't balance.

```java
// THIS IS WRONG — never do this:
double amount = 1234567.89;
double rate = 0.155 / 12; // monthly rate
double interest = amount * rate; // = 15946.49...
// Internally: floating-point cannot represent these decimals exactly
// Error: ~0.00000001 per calculation → accumulates

// THIS IS CORRECT:
BigDecimal amount = new BigDecimal("1234567.89");
BigDecimal rate = new BigDecimal("0.155")
    .divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
BigDecimal interest = amount.multiply(rate)
    .setScale(0, RoundingMode.HALF_UP); // Round to VNĐ (no sub-unit)
```

**Rounding strategy:**

Round at exactly the boundary where an amount becomes a real obligation, and only there. Each instalment's interest is a real obligation the customer must pay in whole dong, so it is rounded to the dong as soon as it is calculated. The intermediate steps of a calculation (the monthly rate, discount factors) must not be rounded early. The rounding rule must be uniform and declared in configuration, as VLP uses HALF_UP to the dong for each instalment's interest (Chapter 2, Chapter 3). The final instalment absorbs all accumulated differences so the balance reaches exactly 0: Lan's loan has 11 instalments of 1,696,080 VND and a final instalment of 1,696,077 VND.

### Principle 2: time is a data dimension to be respected

:::key
**Every financial event must be recorded with the date it happened, not the date it was processed, and the system must clearly distinguish the two.**
:::

::::story[A real bug in VLP: VLP-706]
A transaction is booked in the past (`chargeTransactionInPast=true`): the transaction date has passed, but it is only being processed today. The transaction is rejected with the error "Contract service not found", even though the customer is fully eligible.
::::

```text
Cause: TransactionService.checkContractService() used billingDate
       (a date in the past) as the effectiveDate to look up the contract service.

Consequence: Today the contract service is ACTIVE, but on billingDate it did not exist yet
             → The lookup fails → the transaction is rejected

Root cause: confusing "the date used to check the right to charge"
            with "the effective date of the transaction"

Fix: when chargeTransactionInPast=true, use timeService.getCurrentDate()
     instead of billingDate. This step checks the CURRENT right to charge,
     not the right in the past: the service must be active TODAY.

Lesson: always distinguish clearly between
  billingDate    = the date of the transaction (belongs to the past)
  currentDate    = the date the check is taking place (today)
  effectiveDate  = the date used to filter entities (depends on context)
```

Four rules of temporal integrity emerge from the whole book. One, an immutable event log: once an event is recorded it is not edited; an adjustment is recorded as a reversing event at a new point in time, and the original event remains (Chapter 6, Chapter 8). Two, a bitemporal model for important entities: the date a state is effective in reality and the date the system learned about it, because the question "what did this account look like on 1/1/2023?" needs both (the DebtRegister in Chapter 10 is an example). Three, time zone discipline: store UTC, display local time (Vietnam is UTC+7), never store local time in the database. Four, date arithmetic must use the right library: "31/1 plus one month" is 28/2 or 29/2, not 3/3; working days must be calculated against the holiday calendar.

### Principle 3: data quality is the foundation

:::key
**A good credit model running on bad data produces worse results than a simple rule running on good data.**
:::

| Quality dimension | Question | Example failure | Control |
|---|---|---|---|
| Completeness | Is all the necessary data there? | Missing income, lower decision quality | A quality SLA per field: "this field must be present on 99.5% of applications" |
| Accuracy | Is the data correct? | Income typed as 25,000 instead of 25,000,000 | Range checks, format checks, consistency across fields |
| Consistency | Does the same concept have the same definition everywhere? | "Default" is DPD 30+ in the model but DPD 90+ in reports | One source of truth, a data dictionary |
| Timeliness | Is the data fresh enough for its purpose? | 90-day-old credit data for a real-time decision | Freshness requirements per use |
| Lineage | Can it be traced back to its source? | "Where did this income figure come from?" | For every feature: source system + timestamp + transformation log |

Monitor all five dimensions daily, alert when quality falls below threshold, and block the model from running if the quality of a key field is below 95%.

:::summary[Section 16.1]
Money uses exact decimals, rounded at the boundary where an amount becomes a real obligation, by one uniform rule, with the final instalment absorbing the differences. The date something happened and the date it was processed are two different dimensions; events are immutable, store UTC, calculate dates with the right library. Data quality is measured in five dimensions: completeness, accuracy, consistency, timeliness and lineage.
:::

## 16.2 Principles of system architecture {#162-nguyên-tắc-về-kiến-trúc-hệ-thống}

### Principle 4: tariff-based design

:::key
**Business rules belong in the database, not in code. Never hard-code interest rates, limits or fees in the source code.**
:::

Suppose on 1 March the regulator announces a new interest rate cap effective from 1 April. If the cap is hard-coded (`if (rate > 0.24) throw ...`), every change is a round of code changes, testing and deployment, taking around two weeks, and if deployment is late the company is in breach for days. If the cap lives in a configuration table with effective dates, the change is adding a row with `validFrom = 2024-04-01`, takes a few minutes, carries no deployment risk, and the system applies it automatically on the right day. (VLP does not yet check an interest rate cap, as Chapter 12 pointed out; when it is added, it should be designed the second way.)

| Always configuration | Can be configuration (depending on how often it changes) | Should be code |
|---|---|---|
| Interest rates (nominal, penalty), fee levels, legal limits (rate cap, DTI, maximum amount), tier score cut-offs, DPD thresholds, grace period lengths, the maximum number of payment holidays, notification templates | Approval logic (if it changes quarterly), collections strategy (if it changes seasonally), marketing campaign parameters | Calculation algorithms (the interest accrual formula), format validation logic, integration protocols |

### Principle 5: everything must be traceable

:::key
**If you cannot reconstruct a decision from three years ago, you will lose any dispute.**
:::

Every financial system must be able to answer three questions. **What happened?** An immutable event log records every change of account state, with who, what, when and why. **Why did it happen?** A decision log records every input at the time of the decision (input features, model version, score, policy rules applied), not reconstructed afterwards. **Who decided?** An authorization log records every write operation with the identity of the person performing it, the time and the reason; no identity, no update.

Audit logs are append-only, never edited or deleted, and should be stored separately from the operational database. Retention periods are set by law: in Vietnam, accounting vouchers used directly for bookkeeping must be kept for at least 10 years under accounting law, credit files are kept as required by the Law on Credit Institutions 2024, and configuration changes should be kept for the life of the system.

### Principle 6: idempotency and durability

:::key
**Every payment API must be idempotent. Every EOM job must be safe to rerun. Design for at-least-once delivery, but implement idempotency so the effect happens exactly once.**
:::

::::story[A real bug in VLP: VLP-670]
After EOM, the system matches a newly created instalment against an old payment. The result: `paidAmount` on InstalmentSummary is wrong, which makes `outstandingDebt` on CurrentBalance wrong, and the balance shown to the customer wrong.
::::

```text
Root cause: stale state in a JPA PersistentBag.
  InstalmentSummary has an @OneToMany instalments collection.
  When a new instalment is saved with InstalmentDAO.save() (separately),
  InstalmentSummary's PersistentBag does NOT update itself.
  → refreshInstalmentSummary() reads the stale collection
  → the totals are wrong (the new instalment is missing)

Fix:
  1. InstalmentSummaryService uses addInstalmentAmountsToHeader()
     instead of a refresh based on the collection (an additive update,
     independent of how fresh the PersistentBag is)
  2. refreshInstalmentSummary() is called unconditionally in the matching flow
     (ensuring the header is always consistent after each match)

Lesson: with JPA @OneToMany, beware of a stale PersistentBag
  - If child entities are saved through a separate DAO, not through the parent's collection,
    the parent's collection may be stale until the session is refreshed
  - Use additive operations rather than totals derived from a collection
```

**Idempotency for payment APIs:**

```text
The customer taps "Pay" → the network is flaky, the request times out → they tap again
Without idempotency: charged twice → the customer is overcharged

With idempotency:
  Attempt 1: idempotency_key = "PAYMENT_C123_20241115_102347_abc123"
             The server processes the payment, stores the key → returns SUCCESS
  Attempt 2 (same key, because it is a retry):
             The server sees the key already exists → returns the SAME response (same payment_id)
             → No double charge

  Key: a UUID generated by the sender for each payment intent
  Lifetime: 24 hours (the retry window)
  Storage: a distributed cache (Redis) for fast lookup
```

### Principle 7: design for safe failure

:::key
**Systems will fail. The question is not "will it fail" but "when" and "how". Design so that the failure mode does the least harm.**
:::

When the credit bureau API times out, there are four choices: show the customer an error, approve anyway (unsafe), queue for manual review, or use a cached score with a review flag. For existing customers with a history, a cached score is a reasonable proxy; for new customers, no credit check is an unknown risk, so queue for review.

When the network partitions during disbursement, the customer has signed and the disbursement order has been sent, but no confirmation arrives: resending could disburse twice, not resending means the customer gets no money. The answer is an intermediate state plus idempotency: mark the disbursement PENDING, send it to the bank with an idempotency key, receive confirmation asynchronously and then move to COMPLETED. On restart, the idempotency key prevents a duplicate send, and the PENDING state triggers a reconciliation step.

:::summary[Section 16.2]
Business rules live in configuration with effective dates, not in code. Every decision must be reconstructable: what, why and who decided, with append-only logs. Payment APIs and EOM jobs must be idempotent; the PersistentBag bug in VLP-670 shows how totals derived from a collection can be silently wrong. Design for the least harmful failure mode, with intermediate states and reconciliation.
:::

## 16.3 Principles of risk management {#163-nguyên-tắc-về-quản-trị-rủi-ro}

### Principle 8: expected loss is a cost, not a risk

:::key
**Expected loss (EL) is already priced in. What to worry about is unexpected loss (UL): when reality deviates far from expectation.**
:::

The wrong way to think: "a 3% default rate for the Standard tier is too dangerous!". The right way: "3% is already in the 18% rate; EL = 3% × 62% is covered, as section 12.2 calculated. The real risk is the default rate jumping to 6%."

So what needs monitoring are the signals of UL: actual default rates deviating from forecast by more than 20%; whether defaults are concentrated by sector or region (clustered defaults are systemic risk, far worse than isolated defaults); whether LGD is stable; whether new vintages are getting progressively worse than old ones (a sign of model drift). IFRS 9 provisions are the expected loss set aside: Stage 1 provides 12-month EL, Stage 2 lifetime EL when credit quality has deteriorated, Stage 3 lifetime EL for credit-impaired loans. Capital is the cushion for unexpected loss. Both must be sufficient, but for two different kinds of risk (Chapter 5).

### Principle 9: tail risk kills companies

:::key
**Optimizing for the average case is not enough. The system must survive the worst case.**
:::

Long-Term Capital Management (LTCM) in 1998 was the most sophisticated quantitative fund of its day, and its models treated very large losses as almost impossible. When Russia defaulted, positions that were normally uncorrelated all moved against LTCM at once, and the fund was rescued only by a group of banks coordinated by the New York Fed. The lesson: historical correlations are peacetime correlations. Crisis correlations are what kill you.

The same is true in consumer lending. In normal times, defaults are individual matters. A crisis makes defaults correlated because the economic shock hits everyone. A portfolio with a 3% default rate in normal times can reach 8% in a crisis. Stress tests must answer questions like: if unemployment rises from 5% to 15%, what is the portfolio default rate? If funding rates rise 3 percentage points, what margin is left? If GDP falls 5%, what are the losses over two years? The answers to those questions, not peacetime EL, are what determine the capital plan.

### Principle 10: model calibration, trust but verify

:::key
**All models are wrong. The question is how they are wrong, and how wrong is acceptable.**
:::

The statistician George Box said: "All models are wrong, but some are useful." A model with a Gini of 0.61 is good, but Gini measures the ability to rank customers by risk, not the percentage of defaults "explained". Even the best model does not know which of the people with the same score will lose their job because their company closes, who is submitting fake documents of a kind it has never seen, or when its assumptions will break in an edge case. Don't just optimize what the model captures; manage what it doesn't.

A minimum calibration schedule: monthly PSI, quarterly Gini on accumulated outcome data, a full revalidation every year, and event-driven validation after an economic shock, a regulatory change or a product change (Chapter 11). If calibration fails, replace the model with conservative rules until the retrained model passes validation.

### Principle 11: concentration is dangerous

:::key
**A portfolio with 30% of its risk concentrated in one sector, one employer or one region is a portfolio waiting to explode.**
:::

Picture two lenders in the same market when a shock like COVID hits. The first is concentrated in one product, in workers from one manufacturing sector and in one region; that sector is hit hardest, that region is locked down longest, and their NPL ratio soars. The second is diversified, takes the same shock, but its NPLs rise only by an amount the first could not dream of. Same market, different portfolio structure, different outcome.

```text
Concentration limits (example policy):
  One employer: at most 3% of the portfolio
  One sector (e.g. manufacturing): at most 20%
  One province: at most 25%
  One product (e.g. car loans): at most 40%

  Monitored monthly. Alert at 80% of the limit. Hard block at 100%.

  "But company X's customers are really good!"
  → True, until it isn't. A whole sector's correlation
    only shows up in a crisis. Prepare in advance.
```

:::summary[Section 16.3]
EL is a cost already in the price; what needs monitoring are the signals of unexpected loss. Correlations in a crisis are very different from normal times, so stress tests are what determine the capital plan. All models are wrong: calibrate on a schedule and have a conservative fallback when calibration fails. Set concentration limits before you need them.
:::

## 16.4 Principles of product and customer {#164-nguyên-tắc-về-sản-phẩm-và-khách-hàng}

### Principle 12: the right product, the right customer, the right time

:::key
**Selling the wrong product to the right customer is as bad as selling the right product to the wrong customer.**
:::

::::story
Hạnh, 58, two years from retirement, comes into a branch asking to borrow 5 million over 6 months to repair her house. The staff member suggests: "Why not borrow a full 50 million over 36 months and redo the whole house!"

A 50 million loan brings ten times the commission. Hạnh's need is 5 million, short term. Her reality is a fixed retirement income that cannot carry a 36-month loan. The staff member collects the commission; Hạnh defaults and falls into hardship; the company takes the loss, the legal risk and a negative CLV.
::::

Before offering a product, check three things. **The right customer:** does the financial profile (score, DTI, income stability, existing obligations) support this product? If not, don't offer it; suggest a smaller product or waiting. **The right product:** does the product solve the need the customer stated? "I need 5 million to repair my house" means offering 5 million, not 50. **The right time:** is this the right stage of life? "I'm 58 and retiring in two years" means a 36-month loan is very likely the wrong time.

The staff member's job is to help customers get what they need, not to maximize the loan amount per customer. It sounds noble, and it is. But it is also profitable: customers with the right product default less, and customers who feel understood are loyal and refer others.

### Principle 13: transparency is a competitive advantage

:::key
**Customers know when they are being misled. They may not say so. But they will not come back.**
:::

Customers who understand the terms before signing have fewer surprises, and so make fewer complaints; feel respected, and so are more loyal; and trust you, and so are willing to refer others. Chapter 13 showed the mechanism through Vela Finance's experiment with the recommended amount.

| Practices that build trust | Practices that destroy trust |
|---|---|
| The APR displayed prominently, not hidden | Important terms buried in a 40-page document |
| "This is the total you will actually pay", before signing | "Interest-free" when the fees are effectively interest |
| Comparison with other options so customers choose knowingly | Rate changes without clear notice |
| Rejection reasons that are genuinely useful | Automatic renewal without explicit consent |
| "Your score has improved, here's a better rate", proactively | |

### Principle 14: lifetime value thinking

:::key
**Every decision about a customer should be weighed against their whole lifetime value, not just today's transaction.**
:::

```text
Short-term thinking:
  "This customer is at DPD 3, chase them hard!"
  Result: the customer pays under pressure, feels bad, leaves.
  Lost: suppose the customer would have taken 5 more loans in the future,
        each with a profit of about 400,000 VND (Standard tier, section 12.2)
        → about 2,000,000 VND, not counting referral value

Long-term thinking:
  "This customer has been with us 18 months and has always paid on time.
   This is most likely a hiccup. Reach out in a supportive way."
  Result: the customer cures, stays, refers friends.

Decision: when the probability of temporary difficulty is high, choose support.
When in doubt, the CLV calculation (Chapter 3) usually favours the goodwill approach.
```

The consequences for the organization: metrics must include CLV, not just volume, NIM and default rate; every policy change should answer "what is the impact on CLV?"; and compensation should include a customer retention component.

### Principle 15: responsible lending is sustainable lending

:::key
**Responsible lending is not just ethically right. Irresponsible lending usually ends in losses, sanctions, or both.**
:::

The clearest evidence comes from the opposite side. In 2010, the microfinance industry in the Indian state of Andhra Pradesh collapsed after a period of overheated growth: many borrowers were stacking loans from several institutions, aggressive collection practices met fierce opposition, the state government issued an ordinance tightly restricting lending, and repayment rates across the industry in the state collapsed. Institutions that grew by ignoring affordability suffered not only credit losses but lost the market altogether.

The reason responsible lending is more sustainable is simple: lower defaults mean lower provisions; customers who stay longer spread acquisition costs over more loans; trust brings referrals, so marketing costs are lower; and good compliance means no fines, no restrictions, and permission to grow. The only tension is that short-term volume may be lower.

The CFO: "I need the numbers now, not in three years." The CRO: "The numbers in three years decide whether we still have a company." Both are right. The goal is to find the balance.

:::summary[Section 16.4]
The right product, the right customer, the right time is both ethics and a sustainable business model. Transparency builds trust, and trust brings loyalty and lifetime value. Customer decisions should be weighed by CLV, not just today's transaction. Irresponsible lending can grow fast, but as Andhra Pradesh in 2010 showed, it can bring down a whole market.
:::

## 16.5 Principles of organization and culture {#165-nguyên-tắc-về-tổ-chức-và-văn-hóa}

### Principle 16: measure what matters

:::key
**People optimize for what is measured. Measure the wrong thing and you optimize the wrong thing, and destroy value.**
:::

| Team | Measured by | Behaviour encouraged | Better measured by |
|---|---|---|---|
| Sales | Volume alone | Pushing customers to borrow more than they need, ignoring affordability signals | Quality-adjusted volume (commission times a quality multiplier, Chapter 13) |
| Collections | Amount collected | Maximum short-term recovery by any means, ruined relationships, many complaints | Cure rate and customer satisfaction |
| Product | Number of features launched | Haste, insufficient testing, technical debt, customer harm | 12-month vintage performance |

Before setting any metric, ask: if we optimize for this metric, what behaviour does it encourage? Is that the behaviour we really want? If not, fix the metric.

### Principle 17: data lights the way, people decide

:::key
**Data does not make decisions. Data informs decisions. People make decisions, and people are accountable for them.**
:::

"The model says reject, what's left to discuss?" is the wrong way to think: the model is a tool, you are the decision maker. "The data shows this is profitable, let's do it" is also wrong: does the data show every impact, the legal risk, the reputational risk, the long-term harm to customers? Data never shows everything.

An example: data shows that urgent applications have a 15% higher default rate. Should "urgent" applications be charged a higher rate? The data cannot answer that, because it is a normative question; people must decide, together with Legal, ethics and the business (Chapter 12 answered no).

A data-driven process has seven steps: people ask the question, systems collect the data, data scientists analyse and model, analysts and domain experts interpret, business leaders decide and are accountable, systems and people implement and monitor, people review the results and go back to the start. Accountability never passes to "the model" or "the data". The decision maker is accountable. Full stop.

### Principle 18: fast and safe are not a trade-off

:::key
**"Move fast and break things" is advice for social media. In consumer finance, what gets broken is people's financial lives.**
:::

::::story
A fintech launches "instant loans, no proof of income": approval in 30 seconds, no paperwork. Conversion is very high, growth is fast, the quarterly numbers look great.

A year later, the first group of loans falls due. The default rate is three times the industry average. The regulator asks: "Did you assess affordability?" The answer "our AI does it automatically" turns out not to be true. The outcome: sanctions, a forced slowdown, and harmed customers.
::::

Fast without safe is fast failure, not fast success. The right view: "fast AND safe" is a design problem, not a trade-off. Two-second credit decisions with a full credit check; same-day disbursement once fraud checks are complete; document processing within 24 hours with quality checks. Those require investment in **automation**, not skipping steps. Skipping steps is not speed, it is debt: technical debt, legal debt, ethical debt.

### Principle 19: a blameless post-mortem culture

:::key
**When something goes wrong, the question is not "who made the mistake?" but "what gap in the system allowed this to happen?"**
:::

Back to bug VLP-670 in principle 6. A developer changed the code, and the change caused the bug. A blame culture asks "who wrote this?", and the result is that developers become afraid of change, bugs are hidden rather than reported, and software quality gets steadily worse. A blameless culture asks: "Why did the system let this bug reach production? Which test should have existed? Where did the review process fail? How do we make this class of bug impossible?" The result is better tests, better reviews, better architecture, and the next person does not repeat the old mistake.

A blameless post-mortem has seven parts: what happened (a timeline, facts only); impact (how many customers, how much money, for how long); root cause (the 5 whys technique); contributing factors; what went well; corrective actions (specific, with an owner and a deadline); and lessons for future design. There is no "who did it" or "who gets punished" section. Deliberate misconduct is a matter for a separate HR process; technical mistakes always get a blameless post-mortem.

:::summary[Section 16.5]
People optimize for what is measured, so metrics must encourage the right behaviour. Data lights the way but people decide and are accountable. Fast and safe are achieved together through automation, not by skipping steps. When something goes wrong, fix the system rather than punishing people.
:::

## Summary: the 19 principles {#tổng-hợp-19-nguyên-tắc}

| Group | # | Principle |
|---|---:|---|
| Mathematics and data | 1 | Exact decimals for money; round at the obligation boundary, by one uniform rule |
| | 2 | The date something happened differs from the date it was processed; immutable events; store UTC |
| | 3 | Data quality in five dimensions: completeness, accuracy, consistency, timeliness, lineage |
| System architecture | 4 | Business rules live in configuration with effective dates, not in code |
| | 5 | Immutable audit logs: what, why and who decided |
| | 6 | Idempotency: safe reruns, no double effects |
| | 7 | Design for the least harmful failure mode |
| Risk management | 8 | EL is a cost already in the price; monitor unexpected loss |
| | 9 | Stress test for tail risk; optimize to survive, not just for the average |
| | 10 | Calibrate every model; have a conservative fallback when calibration fails |
| | 11 | Set concentration limits before you need them |
| Product and customer | 12 | The right product, the right customer, the right time |
| | 13 | Transparency builds trust, and trust creates lifetime value |
| | 14 | Weigh decisions by the customer's lifetime value |
| | 15 | Responsible lending is sustainable lending |
| Organization and culture | 16 | Measure what you want to encourage, not just what is easy to measure |
| | 17 | Data lights the way, people decide and are accountable |
| | 18 | Fast and safe is a design problem, not a trade-off |
| | 19 | Blameless post-mortems: fix the system, don't punish people |

## 16.6 A letter to the reader {#166-lá-thư-gửi-người-đọc}

*You have read this far, and if you read it the right way, you have done real work.*

*You calculated Lan's monthly payment by hand. You traced the steps of EOM. You designed a fairness audit framework, unpicked a velocity fraud, wrote a chatbot that doesn't make up numbers.*

*That is what sets this book apart: it is not only for reading, but for doing.*

**But there is one more thing I want to say, and it cannot be said in formulas or code.**

Consumer finance is not just mathematics. Not just systems. Not just a business model.

Behind every `loan_id` is a person.

Lan, 28, an accountant, borrowed to buy a laptop for her work, to get further ahead. An 18.5 million loan is not large on a spreadsheet. But for her, it was twelve months of saving cut down to four minutes. When our system approves in four minutes, that is not just a transaction, it is an opportunity.

When the system charges a fair rate and hides no fees, that is respect.

When the system reaches out before the customer falls overdue rather than after, that is care.

When the system helps her settle a month early and save 116,422 VND, that number is small in the summary report. For her, it is a dinner with her family.

**The principles in this chapter**, from exact decimals to tariff-based design to responsible lending, are not just good engineering practice. They are how you make sure the system you build serves its real purpose: helping people like Lan access capital fairly, transparently and sustainably.

Any system that breaks these principles, for whatever reason or under whatever pressure, is harming real people.

**About the future.**

BNPL will keep growing. AI will score ever more accurately. Embedded finance will make credit invisible. Regulation will tighten where it needs to.

But the fundamentals do not change. People still need capital to seize opportunities. Lenders still need interest to be sustainable. Risk still needs to be measured, priced and managed. Customers still need to be treated fairly and transparently. None of that changes with technology.

**About you.**

You read this book because you wanted to understand, not just to know. You wanted to be able to do, not just to describe.

Now you can.

You can sit down with Hương and explain why 21% for the Sub-prime tier is justified, and why its margin is so thin. You can explain to Tuấn why tariff-based design matters more than hard-coding. You can design a collections process that knows who needs empathy and who just needs a reminder.

And more importantly, you can recognize when a system is heading in the wrong direction, and speak up.

**A final word.**

In 1950, Bình sat across from Phúc, the loan officer. Phúc decided by gut feeling: sometimes right, sometimes wrong, inconsistent, unable to scale.

Today, our system decides in four minutes: consistent, scalable, data-driven. Gini 0.61. PSI below 0.10. 82% of customers on direct debit.

But the goal was never a number. The goal is this: people like Bình, who deserve to borrow, get the opportunity. People who cannot yet carry more debt are protected from the debt spiral. And the whole ecosystem, lenders, borrowers and society, is sustainable together.

That is why this industry exists. That is why what you build exists.

**Build it well.**

## Chapter appendix: the 19 principles, one sentence each {#phụ-lục-của-chương-19-nguyên-tắc-mỗi-nguyên-tắc-một-câu}

```text
1.  Exact decimals, not double. Round at the obligation boundary.
2.  The date it happened differs from the date it was processed. Store UTC, display local time.
3.  Data quality: measure and monitor all five dimensions.
4.  Configuration in the database. Code for algorithms, configuration for business rules.
5.  Immutable audit logs: what, why and who decided.
6.  Idempotency keys on every important write.
7.  Design for failure modes, not just the happy path.
8.  EL is a cost, already in the price. Monitor unexpected loss.
9.  Stress test for tail risk, don't optimize for the average.
10. Calibrate every model. Don't trust unverified predictions.
11. Concentration limits set before you need them, not after.
12. The right product, the right customer, the right time.
13. Transparency → trust → loyalty. No hidden fees.
14. Weigh decisions by the customer's lifetime value.
15. Responsible lending is sustainable lending.
16. Measure what you want to encourage, not what is easy to measure.
17. Data lights the way, people decide and are accountable.
18. Fast and safe is a design problem, not a trade-off.
19. Post-mortems: fix the system, don't punish people.
```

*The Architecture of Credit ends here. Not because everything has been said, but because the foundation is enough for you to go on by yourself.*

*The next story is yours.*
