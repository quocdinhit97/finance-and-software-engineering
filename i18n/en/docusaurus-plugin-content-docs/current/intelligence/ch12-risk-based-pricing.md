---
title: "Chapter 12. Risk-based pricing"
sidebar_label: "12. Risk-based pricing"
sidebar_position: 2
chapter: 12
subtitle: "Risk-Based Pricing"
reading_time: 26
description: "From credit score to interest rate: tier boundaries and calibration, a cost-plus model calculated on average balances, break-even by tier, price elasticity and adverse selection, the tariff as pricing infrastructure, A/B testing, behavioural pricing and pricing governance."
source_file: "phan-3-chuong-12.md"
editorial_status: "edited"
lang: en
---

> *"The right price is neither the lowest nor the highest. The right price reflects the risk correctly: enough for the lender to be sustainable, enough for the borrower to be able to pay, and enough for both to want to deal again."*

## Introduction: why one price for everyone is wrong {#dẫn-nhập-vì-sao-một-giá-cho-tất-cả-là-sai}

::::story
A consumer finance company decides to simplify: one interest rate of 24% a year for every consumer loan, regardless of risk level or segment.

After 18 months, the approval rate has risen because no complex scoring is needed, but the default rate has gone from 4% to 8.5%. Good customers leave because they can borrow at 18% elsewhere. Risky customers stay and borrow more. Net interest margin turns negative.

That is exactly the adverse selection spiral described in Chapter 1, and it happens because there is no risk-based pricing.
::::

This chapter builds on credit scoring (Chapter 11) to answer the question: once you know who is Prime, Standard or Sub-prime, how much interest should you charge? The answer does not come from gut feeling or following the market, but from a rigorous financial model, combined with an understanding of customer behaviour and competition.

## 12.1 From credit score to risk tier {#121-từ-điểm-tín-dụng-đến-hạng-rủi-ro}

### Tier boundaries are not arbitrary

::::story
The data science team has just finished the scoring model. Minh asks: "So what are the cut-offs? How many points to approve, and how many to reject?"

This is not a data science question but a business one, with very concrete financial consequences.
::::

VLP uses three tiers, as seen in Chapter 7. The scale from Chapter 11 (380 points at odds of 20 : 1, PDO 40) tells you the probability of default range for each tier:

| Tier | Score range | PD range on the scale | Average PD of the tier (historical) | Interest rate |
|---|---|---|---|---|
| Prime | ≥ 440 | below about 1.7% | 1.0% | 15%/year |
| Standard | 380-439 | 1.7% to 4.8% | 3.0% | 18%/year |
| Sub-prime | 340-379 | 4.8% to 9.1% | 6.5% | 21%/year |
| Reject | < 340 | above 9.1% | | |

Each boundary is the point at which the tier's interest rate can no longer cover the cost of the worst customer in the tier. Section 12.2 calculates those costs.

**Calibration is mandatory**

The model produces scores, but what matters is this: do the people scoring 410 actually default at the rate the model predicts?

```text
Calibration table:
  Score band   Predicted PD   Actual PD   Ratio
  460-479:     1.0%        1.2%        1.20 ← slightly underestimates risk
  440-459:     1.5%        1.6%        1.07 ← close
  420-439:     2.1%        2.1%        1.00 ← well calibrated
  400-419:     2.9%        2.8%        0.97 ← well calibrated
  380-399:     4.0%        4.7%        1.18 ← underestimates risk

Ratio consistently > 1: the model underestimates risk → raise prices or recalibrate
Ratio consistently < 1: the model overestimates risk → you may be missing good customers
```

The 380-399 band deserves the most attention: it sits right at the lower edge of the Standard tier. If the real PD there is 4.7% rather than 4.0%, some customers are being priced as Standard but carry a risk closer to Sub-prime.

### Fixed and dynamic cut-offs

Fixed cut-offs are simple, consistent and easy to audit, and are reviewed annually or when the model is retrained. Dynamic cut-offs adjust to portfolio targets:

| Situation | Adjustment |
|---|---|
| The portfolio default rate is rising | Raise the approval cut-off (340 → 350), raise the Prime cut-off (440 → 450) |
| Disbursement targets are not being met | Lower the approval cut-off (340 → 330) cautiously, with monitoring and a suitable rate for the new group |
| Losing Prime customers to competition | Keep the Prime cut-off, lower the Prime rate if the economics allow |

Dynamic cut-offs require daily monitoring of portfolio quality, predefined adjustment rules, approval by the risk committee rather than the modelling team alone, and an audit trail for every change of cut-off and its reason.

### Multi-dimensional segmentation

Two customers with the same 425 points can be very different: one earns 10 million with a high debt-to-income ratio (DTI), the other 50 million with a low DTI. Same score, but very different affordability risk. That is why many lenders price on a score × DTI matrix, plus behavioural adjustments. Below is an option Vela Finance is considering to replace the current three prices:

```text
              DTI < 30%    DTI 30-50%   DTI > 50%
Score 440+      14.5%        15.5%        18.0%
Score 380-439   17.5%        18.5%        21.0%
Score 340-379   20.5%        21.5%        REJECT
Score < 340     REJECT       REJECT       REJECT

Further adjustments:
  Existing customer, never late: −0.5 percentage points
  Verified SALARIED income: −0.3 percentage points
  Digital channel (lower cost to serve): −0.3 percentage points
```

The matrix is more accurate, rewards good behaviour and retains loyal customers, but it is more complex to govern: every cell is a price that must be justified by cost and checked for fairness.

:::summary[Section 12.1]
Tier boundaries have an economic basis: each tier corresponds to a range of default probabilities that the tier's rate must cover. Calibration compares predicted PD with actual PD to see whether the model is mispricing, especially near the cut-offs. Dynamic cut-offs need risk committee governance. Segmenting by score, DTI and behaviour is more accurate but more complex to govern.
:::

## 12.2 The cost-plus model {#122-mô-hình-chi-phí-cộng-biên}

### A full cost breakdown

::::story
Hương presents a pricing proposal to the Board. The Board asks: "Why is Sub-prime 21%? What is it based on?"

The answer has to rest on a full cost breakdown, not "because that's what the market charges".
::::

There is one technical point to get right before calculating: an instalment loan amortizes. For a 12-month loan, the average balance is only about 55% of the loan amount. The nominal rate is charged on the balance, so every cost must also be expressed as a **percentage of the average balance per year** to be comparable with the interest rate. Dividing costs by the original loan amount, then multiplying the rate by the full loan amount over the whole term, is a common mistake that inflates interest revenue by almost double.

**Common assumptions for all three tiers** (the book's standard loan):

```text
Loan: 18,500,000 VND, 12 months, equal instalments, appraisal fee 200,000 VND
Defaulting loan: pays 6 instalments then stops; EAD = balance after instalment 6
LGD: 62%

Funding (structure 85% debt, 15% equity):
  Bank borrowing: 9.0%/year, 65% of debt
  Bonds: 7.6%/year, 35% of debt
  Average cost of debt: 65% × 9.0% + 35% × 7.6% = 8.5%/year
  Equity: 15% of the balance, target ROE 18%/year

  Cost of funds on the balance:  85% × 8.5% = 7.23%/year
  Required return on equity:     15% × 18%  = 2.70%/year
```

Equity is not a cheap source of funding. Shareholders expect higher returns than creditors because they absorb losses first, so 18% is their opportunity cost, double the cost of debt.

**Cost breakdown, Sub-prime tier:**

```text
PD: 6.5%, POS channel (with agent commission)
Portfolio average balance: 10.15 million VND-years per loan

                                  VND/loan        % of average balance/year
1. Cost of funds (debt part)          733,494            7.23%
2. Expected loss                      392,159            3.86%
   = 6.5% × 62% × EAD 9,731,000
3. Operating costs                    840,250            8.28%
   One-off origination: 550,000
     (credit check, file processing, agent commission, systems)
   Servicing: 300,000/year
     (more active collections, more customer care)
4. Return on equity (ROE 18%)         274,109            2.70%
─────────────────────────────────────────────────────────────
Total cost to cover                 2,240,012           22.07%
Less appraisal fee                   −200,000           −1.97%
─────────────────────────────────────────────────────────────
Break-even rate (with target ROE)                      20.10%
Rate charged                                           21.00%
Margin                                                 +0.90 points
```

Two things stand out. Operating costs, not losses, are the largest component for Sub-prime: a small, short loan has to carry fixed origination costs on a small average balance. And the Sub-prime margin is very thin: if the real PD is 8% rather than 6.5%, the break-even rate rises to 21.01%, meaning this tier makes a slight loss at 21%.

### Break-even by tier

The same simulation model for all three tiers, differing only in PD and operating costs:

| | Prime | Standard | Sub-prime |
|---|---:|---:|---:|
| Average PD | 1.0% | 3.0% | 6.5% |
| Origination cost | 300,000 | 300,000 | 550,000 |
| Servicing cost/year | 100,000 | 150,000 | 300,000 |
| Cost of funds (% of average balance) | 7.23% | 7.23% | 7.23% |
| Expected loss | 0.58% | 1.76% | 3.86% |
| Operating costs | 3.91% | 4.39% | 8.28% |
| Return on equity | 2.70% | 2.70% | 2.70% |
| Appraisal fee (deducted) | −1.96% | −1.96% | −1.97% |
| **Break-even rate (with 18% ROE)** | **12.46%** | **14.12%** | **20.10%** |
| Rate charged | 15% | 18% | 21% |
| Margin above target ROE | +2.54 | +3.88 | +0.90 |

All three tiers are profitable at current prices, and Standard has the best margin. This is common: Prime is squeezed on price by competition, Sub-prime is squeezed on margin by operating costs and losses, and Standard is the healthy core of the portfolio.

The table also shows why the calculation must be done at portfolio level rather than per loan. An individual loan either repays in full (a profit) or defaults (a heavy loss); only across the whole portfolio, at the expected default rate, can you see whether the interest from the 93.5% of good loans covers the losses from the 6.5% of bad ones.

**When is a tier with a negative margin acceptable?** If the Sub-prime margin turns negative (for example because PD rises), the company may still keep the tier under two conditions: the overall portfolio stays profitable thanks to Prime and Standard, and the lifetime value of Sub-prime customers is positive because some of them will repay well and "graduate" to Standard. The second condition must be measured, not assumed: track the graduation rate, and raise prices or tighten cut-offs if it falls below the level set.

:::summary[Section 12.2]
The break-even rate is the sum of the cost of funds, expected loss, operating costs and return on equity, less fees collected, all expressed as a percentage of the average balance per year. Under Vela Finance's assumptions, break-even for Prime, Standard and Sub-prime is 12.46%, 14.12% and 20.10% respectively, so 15%, 18% and 21% are all profitable, but the Sub-prime margin is very thin and sensitive to PD. Calculate at portfolio level, and accept cross-subsidy only when lifetime value is measured, not assumed.
:::

## 12.3 Competition and price elasticity {#123-cạnh-tranh-và-độ-co-giãn-giá}

### Price elasticity in consumer lending

:::key
**Price elasticity of demand** is the ratio of the percentage change in quantity demanded to the percentage change in price. For a loan, the "price" is the interest rate, and the percentage change is taken on the rate itself: cutting from 15% to 14% is a 6.67% reduction, not a 1% reduction.
:::

An absolute value above 1 is elastic (demand is sensitive to price), below 1 is inelastic. Prime customers are usually highly elastic because they actively compare and have many options. Sub-prime customers are less elastic because they have fewer options and more urgent needs. The consequence: for Prime, a competitive rate is vital; for Sub-prime, speed and access matter more than the rate.

**Example: should the Prime price change?**

```text
Current: Prime 15%, 5,000 loans disbursed/month
Estimated elasticity: −1.8
Profit per loan (after target ROE, from the 12.2 model):
  at 14%: 157,036   at 15%: 259,714   at 16%: 362,691 VND

Option A: cut to 14% (−6.67%)
  Volume: 5,000 × (1 + 1.8 × 6.67%) = 5,600 loans
  Profit: 5,600 × 157,036 = 879 million VND/month

Current: 15%
  Profit: 5,000 × 259,714 = 1,299 million VND/month

Option B: raise to 16% (+6.67%)
  Volume: 5,000 × (1 − 1.8 × 6.67%) = 4,400 loans
  Profit: 4,400 × 362,691 = 1,596 million VND/month
```

On paper, raising the price is more profitable despite losing 600 loans a month. But there are three reasons for caution. Elasticity only holds around the price at which it was measured; further out, customers may leave en masse when a competitor is clearly cheaper. The customers who stay after a price rise are usually those with fewer options, that is, riskier ones, so Prime PD may rise and wipe out the gain. And market position and brand image are costs that do not appear in this month's spreadsheet.

### Positioning strategies

| Strategy | Interest rate | Goal | Risk | When to use |
|---|---|---|---|---|
| Price leadership | 0.5-1 points below market | Attract volume, especially Prime | Squeezed margins, mixed quality | New entrants seeking market share |
| Market parity | Market ± 0.2 points | Compete in every segment | No differentiation | Established players |
| Premium for added value | 0.5-1.5 points higher | Customers who value speed and convenience | Price-sensitive customers leave | Strong brand, digital advantage |
| Segment-based | Per segment | High-value segments with specific needs (teachers, health workers) | Complexity, fair lending scrutiny | Good segment data |

Vela Finance chooses market parity for Prime (15%), slightly higher for Standard thanks to fast digital approval (18%), and below the market's Sub-prime level (21%) while still above break-even. The product for teachers has its own price because data shows the segment is low risk, and BNPL has a nominal rate of 0% thanks to the merchant-subsidized model (Chapter 3).

### Avoiding the adverse selection spiral

If the Prime rate is above market, Prime customers move to competitors because they have options, while Standard and Sub-prime customers stay. Portfolio quality falls, prices must rise to cover defaults, more Prime customers leave, and the spiral continues. The way to avoid it is to track the quality mix of new applications every month:

```text
Monthly tracking table: mix of new applications

Segment     This month   6-month average   Alert threshold
Prime          38%            42%             < 35%
Standard       47%            46%             > 55%
Sub-prime      15%            12%             > 20%

If Prime < 35%:
  → Check competitors' rates (mystery shopping)
  → Ask Prime customers who left: why did they choose elsewhere?
  → Consider adjusting the price or improving the experience (faster approval)

If Sub-prime > 20%:
  → Is a marketing campaign targeting the wrong segment?
  → Has a scoring cut-off been changed by accident?
  → Temporarily tighten approval criteria
```

:::summary[Section 12.3]
Elasticity is calculated on the percentage change in the interest rate itself. Prime customers are highly elastic, Sub-prime customers much less so. A simple calculation may show a price rise is profitable, but elasticity is only locally valid and those who stay after a rise are usually riskier. Tracking the quality mix of new applications is how you detect the adverse selection spiral early.
:::

## 12.4 The tariff as pricing infrastructure {#124-biểu-phí-là-hạ-tầng-định-giá}

### From pricing decision to tariff configuration

Chapter 3 explained tariff-based design: pricing decisions live in the database, not in code. Here we connect the pricing model to that configuration.

**Step 1: the risk committee's decision**

```text
Decision (March 2025):
  Prime: cut the rate from 15.0% to 14.5% due to competitive pressure
  Effective: 1/4/2025
  Reason: a competitor launched at 14.8%, Prime applications are falling
  Check: Prime break-even 12.46% → still a margin at 14.5%
```

**Step 2: turning it into tariff configuration**

```text
Current version:
  Tariff code = "PRIME", version = 3
  validFrom: 2025-01-01, validTo: 2025-04-01 (half-open: validTo is excluded)
  Interest FeeComponent (INTEREST_CASH_PRIME):
    monthly rate: 1.25% (= 15.0% / 12)

New version:
  Tariff code = "PRIME", version = 4
  validFrom: 2025-04-01, validTo: null
  Interest FeeComponent (INTEREST_CASH_PRIME_V2):
    monthly rate: 1.2083% (= 14.5% / 12)

No code changes. No changes to the old version.
The version is selected by date, through validFrom/validTo.
(Codes are spelled out here for readability; real codes in VLP are short abbreviations.)
```

Note that version 3's `validTo` is 2025-04-01, exactly the day version 4 starts. As Chapter 3 showed, setting `validTo` to 2025-03-31 would create a day with no tariff in force.

**Step 3: existing and new customers**

Prime loans signed before 1/4/2025 stay linked to version 3 and pay 15% until the end of the term, because the contract terms are locked at origination (the `useLatestTariff: false` flag). Loans signed from 1/4/2025 get version 4 and pay 14.5%. At origination, the system determines the tier at approval, finds the tariff version in force for that tier (validFrom ≤ today < validTo), and attaches the code and version to the new account's contract.

### A/B testing prices

::::story
Minh suggests: "Let's A/B test it: half of Prime customers get 14.5%, the other half 15.0%. Compare conversion and default rates."

Two problems have to be solved before running the test.
::::

**Problem 1: fairness and legality.** Two customers apply on the same day with the same risk profile; one gets 14.5% and the other 15.0%. In the US, this is usually acceptable if assignment is random and uncorrelated with protected attributes. In the EU, the purpose and duration need to be documented. Vietnam has no direct prohibition yet, but the trend is towards more transparency. Mitigations: document the purpose, duration and scope of the test; make sure assignment is truly random; limit the duration; and have a stop condition if one group's default rate diverges significantly.

**Problem 2: statistical significance.**

```text
For a difference in conversion rate:
  Baseline conversion (15.0%): 65%
  Expected (14.5%): 68% (+3 percentage points)

  α = 0.05, power 80% (β = 0.20)
  Minimum detectable effect: 3 percentage points

  n = 2 × (Z_α/2 + Z_β)² × p(1 − p) / Δ²
    = 2 × (1.96 + 0.84)² × 0.65 × 0.35 / 0.03²
    = 2 × 7.84 × 0.2275 / 0.0009
    ≈ 3,964 per group, 7,928 in total

  With about 5,000 Prime applications a month: about 7 weeks needed

For a difference in default rate:
  You must wait for defaults to happen → at least 6-12 months
  → A/B tests on default rates take much longer
  → Use champion/challenger with long-term monitoring
```

### Dynamic pricing: opportunities and risks

Instead of fixed tiers, dynamic pricing calculates an individual price for each person: rate = f(score, DTI, channel, timing, competitive context, CLV). Airlines do this with tickets. Why is consumer lending different?

First, "identical" customers must be treated the same, and pricing on behavioural data easily turns into proxy discrimination. Second, a plane ticket is used once and forgotten, while a loan lasts 12-36 months; customers see their rate every month and will complain when they find a friend got a lower price. Third, there is an adverse selection feedback loop: people willing to accept a very high rate are usually in a hurry, that is, riskier. Fourth is reputational risk: "company charges different rates based on your browsing history" is a headline nobody wants.

| Acceptable | Not acceptable |
|---|---|
| Discounts for existing customers with a good history | Based on proxies for demographics |
| Lower prices on the digital channel because it costs less to serve | Based on urgency signals (applying at 2 a.m. → higher rate) |
| Time-limited promotions | Opaque criteria the customer cannot understand |
| Pre-approved offers based on credit data | "Personalization" that is really discrimination |

:::summary[Section 12.4]
A pricing decision enters the system as a new tariff version, without code changes; existing loans keep the rate set at origination. A/B testing prices needs legal review, a sample size calculation and a time limit; default rates need a much longer observation period than conversion rates. Dynamic pricing is acceptable for loyalty, channel and promotions, and unacceptable when based on proxies or exploiting urgency.
:::

## 12.5 Behavioural pricing {#125-định-giá-hành-vi}

### Anchoring when presenting a loan offer

Chapter 4 introduced the anchoring effect: readers latch on to the first number they see. In pricing, this is a powerful tool, but it must be used properly.

The same offer: 30,000,000 VND, 18 months, 18% a year, a 1% origination fee. A monthly payment of 1,914,173 VND, total interest of 4,455,121 VND, an APR of 19.35%. There are two ways to present it:

| | Option A: anchored on the monthly payment | Option B: balanced |
|---|---|---|
| The largest text | "Only 1,914,173 VND/month" | Loan amount 30,000,000 VND |
| Rate and APR | Small print at the bottom | 18%/year, APR 19.35%, same font size |
| Total repayable | Small print at the bottom | 34,455,121 VND, plus the 300,000 VND fee |
| Affordability context | None | "That's 13.7% of your monthly income" (income 14 million) |
| Consequence | The customer latches on to the small number and ignores the total cost | The customer sees several numbers and judges for themselves |

Option A exploits attention; option B helps the customer make an informed decision. The regulatory trend in many places is to require full disclosure of the total cost up front, as in the EU Consumer Credit Directive or the FCA rules in the UK. Designing the system for balanced presentation now is far cheaper than retrofitting it when the rules arrive.

### The decoy effect

:::key
The **decoy effect** occurs when adding a less attractive third option makes one of the two original options look more attractive.
:::

The classic example is Dan Ariely's experiment with The Economist subscriptions: digital 59 USD, print 125 USD, print plus digital 125 USD. With the print-only option (the decoy) present, 84% chose print plus digital and 16% chose digital. Without the decoy, the result flipped: 68% chose digital and 32% the combined package.

In lending, the same approach looks like this:

```text
Without a decoy:
  A: 15,000,000 VND, 12 months, 15%/year → 1,353,875 VND/month, total interest 1,246,500
  B: 15,000,000 VND, 24 months, 15%/year →   727,300 VND/month, total interest 2,455,200

Add decoy C, almost identical to A but clearly worse:
  C: 15,000,000 VND, 12 months, 15%/year, plus a 3% origination fee

  C makes A look like "a bargain", so more customers choose A over B.
```

Is it ethical? If C is a real product, fairly priced, that some people genuinely need, putting it next to A and B is acceptable. If C exists only to manipulate the choice, nobody is expected to choose it, or it is unreasonably expensive just to serve as a backdrop, then it is not.

### The ethical limits of behavioural pricing

| Acceptable | Not acceptable |
|---|---|
| Every cost is clearly shown | Hidden fees that appear only after commitment |
| The customer understands what they are choosing | False urgency: "this rate expires in 10 minutes" when it does not |
| The customer actively chooses the product | Deliberate complexity that makes comparison impossible |
| Every option is real and fair | Higher rates for customers applying in a crisis |
| Education: "pay over 12 months instead of 24 and save X" | Deceptive anchors: striking through a big number to "discount" it to a smaller one |

The test: would an ordinary, fully informed person feel cheated? If yes, don't do it. If no, it may be acceptable, but it still needs a compliance check.

## 12.6 Pricing governance and compliance {#126-quản-trị-định-giá-và-tuân-thủ}

### Interest rate caps

In Vietnam, the Civil Code 2015 (Article 468) limits agreed interest to no more than 20% a year, unless another relevant law provides otherwise; lending by credit institutions, including finance companies, is governed by the law on credit institutions. However the current legal framework applies to Vela Finance, the possibility that a regulator sets or changes an interest rate cap is a risk the pricing system has to be ready for.

::::story
Suppose the regulator announces: from a given date, unsecured consumer loans may not have an APR above a cap.

The system must ensure compliance automatically. VLP cannot do that yet.
::::

LPS already calculates the XIRR (effective rate) for each instalment plan, but no step compares the XIRR with a cap. There is no validator, no error code and no configuration parameter for a cap. If one were needed, the natural design is a check in the loan offer selection flow (chooseOffer):

```text
// Proposed design (illustration)
// 1. LPS calculates XIRR after creating the instalment plan
// 2. A new check in chooseOffer: compare XIRR with the cap read from configuration
//    (a cap per product type, with validFrom like the tariff)
// 3. Above the cap → reject the offer, record the reason, do not let the customer sign
//
// if (calculatedXIRR.compareTo(regulatoryCapConfig.getConsumerUnsecured()) > 0) {
//     throw new ValidationException("APR exceeds regulatory cap");
// }
```

The key point is that the cap must be checked against the APR (including fees), not the nominal rate. Lan's loan has a nominal rate of 18% but an APR of 20.10%; with a 20% cap, a check on the nominal rate would let a non-compliant loan through.

### The pricing audit trail

Every pricing decision needs to be recorded. Below is an illustrative schema:

```sql
-- ILLUSTRATIVE SCHEMA — pricing_audit_log KHÔNG tồn tại trong VLP
-- verified: pricing-risk-chapter-claims.md
-- Không có pricing_audit_log table, PricingAuditLog entity, hay pricing audit DB
-- Audit information hiện tại stored trong: CTM contract history + LAS account history
-- Table dưới đây là ví dụ thiết kế tốt (best practice, không phải implementation thực tế):

CREATE TABLE pricing_audit_log (  -- ILLUSTRATIVE
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    application_id UUID NOT NULL,
    account_id BIGINT,
    tariff_code VARCHAR(50),    -- e.g., "SVCFEE", "ORIGFEE" (short codes, not "STANDARD_2025")
    tariff_version INTEGER,
    nominal_rate DECIMAL(6,4),
    apr DECIMAL(6,4),           -- Calculated XIRR (LPS module)
    scored_at TIMESTAMP,
    pricing_model_version VARCHAR(50)
);
-- Append-only, never updated
```

```text
Scenario: a customer complains 18 months later
  "You charged me more than we agreed"

  With an audit trail:
    Look up the pricing decision by application ID
    Prove: which tariff was in force at the time of approval
    Prove: the disclosed APR was 20.10%
    → A complete chain of evidence

  Without an audit trail:
    "We no longer have records from 18 months ago"
    → Loss of credibility, regulatory breach, disadvantage if it goes to court
```

VLP has no separate pricing log table, but the contract in CTM stores the tariff code and version at origination. Combined with the tariff version data, the full pricing decision for any loan can be reconstructed.

:::summary[Sections 12.5 and 12.6]
A loan offer must be presented in a balanced way: the rate, the APR and the total repayable as prominent as the monthly payment. The decoy effect is acceptable only when every option is real and fair. VLP does not yet check an interest rate cap even though LPS already calculates XIRR; if added, the check must be on the APR, not the nominal rate. Pricing decisions can be reconstructed from the CTM contract and the tariff version.
:::

## Chapter 12 summary {#tóm-tắt-chương-12}

```text
From Lan's 420 points to an 18% rate:

Score 420 → Standard tier (380-439)
  PD on the scale: odds 40 : 1 → about 2.4%
  DTI after the loan: 7.7% → good affordability
  Channel: DIGITAL → low origination cost
  First-time customer → no existing-customer discount yet

Economics of the Standard tier (the 12.2 model):
  Cost of funds:           7.23%
  Expected loss:           1.76%
  Operating costs:         4.39%
  Return on equity:        2.70%
  Less appraisal fee:     −1.96%
  Break-even:             14.12%
  Rate charged:           18.00% → margin 3.88 percentage points

Disclosed to the customer:
  Nominal rate: 18%/year
  APR: 20.10%/year (including the 200,000 VND appraisal fee)
  Monthly payment: 1,696,080 VND (final instalment 1,696,077)
  Total interest: 1,852,957 VND
  Total repayable: 20,352,957 VND, plus the 200,000 VND fee

Trail: reconstructable from the CTM contract + tariff version.
Interest rate cap: not yet checked by VLP; if added, check against the 20.10% APR.

Pricing is not guesswork. Every number has a reason.
```

## Review questions {#câu-hỏi-tự-kiểm-tra}

**Type 1: Recall**
1. List the components of the cost-plus model. Which is the largest for the Sub-prime tier in the chapter's example, and why?
2. What is price elasticity? Why are Prime customers usually more elastic than Sub-prime customers?
3. A tariff has validFrom/validTo. Why are running loans unaffected when a new tariff version is created?
4. How does the APR differ from the nominal rate? Why must an interest rate cap be checked against the APR?

**Type 2: Understand**
5. Explain the adverse selection spiral in pricing. Why can raising rates to cover defaults make defaults rise further?
6. Why must costs be expressed as a percentage of the average balance, not of the original loan amount? What happens to the break-even rate if you get this wrong?
7. Dynamic pricing is acceptable for loyalty discounts but not when based on urgency signals. Why?
8. What is the decoy effect? When is using a decoy in product design ethical?

**Type 3: Apply**
9. A new Sub-prime product: 10,000,000 VND, 12 months, equal instalments.
   - Cost of debt: 9%/year, structure 85% debt, 15% equity, target ROE 20%
   - PD: 8%, LGD: 65%, defaulting loans pay 6 instalments
   - Origination cost: 500,000 VND (one-off)
   - Servicing cost: 400,000 VND/year
   - No origination fee charged to the customer

   (a) Calculate the break-even rate by simulating a portfolio of 100 loans
   (b) What is the minimum rate you should charge?
   (c) If a competitor charges 26%, how should you position yourself?

10. Design an A/B test for the Standard tier (18.0% against 17.5%):
    - Baseline applications: 3,000/month
    - Baseline approval rate: 70%
    - Baseline default rate: 3%
    - Expected elasticity: −1.5

    (a) How would application volume be expected to change at 17.5%?
    (b) The sample size needed to detect a 3 percentage point difference in conversion
    (c) The net profit impact of the price cut
    (d) How long must it run before the impact on default rates can be assessed?

**Type 4: Analyse**
11. The company is considering "time-of-day pricing": customers applying outside office hours (18:00-22:00) pay 1.5 percentage points more, on the grounds of "higher behavioural risk". Data: the default rate of out-of-hours applications is 6.5% against 4.5% during office hours.

    Analyse: (a) Is the data enough to justify a different price? (b) Is it compliant? (c) Is it ethical? (d) What other way could achieve the same risk management goal?

12. The Board demands: "Raise the Standard rate from 18% to 20% to improve margins." The risk team objects: "We will lose Standard customers." Marketing says: "No problem, Standard customers aren't price sensitive." Who is right?

    Design the analysis: (a) What data do you need? (b) How do you estimate the elasticity specifically for Standard? (c) The P&L impact? (d) Your recommendation to the Board?

## Exercises {#bài-tập-áp-dụng}

**Exercise 1: A full pricing model for BNPL**

Build a pricing model for three segments of a BNPL product: no origination fee, 3-month term, average amount 5,000,000 VND.

Assumptions:
- Cost of debt: 9%/year; structure 88% debt, 12% equity; target ROE 20%
- Operating costs: 250,000 VND/loan (fixed, merchant POS channel)
- The merchant may subsidize a "0% interest" offer: the subsidy is negotiable

Segments (BNPL customers differ from ordinary borrowers):
- Thin-file: alternative data only; PD 18%, LGD 55%
- Standard: some credit data; PD 8%, LGD 58%
- Prime: full credit data, good history; PD 3%, LGD 52%

Requirements:
(a) Calculate the break-even rate for each segment
(b) Design the pricing strategy: what should each segment pay?
(c) If you offer "0% interest", calculate the subsidy needed from the merchant
(d) Calculate the APR (including all fees) and compare it with a hypothetical 20%/year cap
(e) Tariff configuration: which FeeComponents are needed?

**Exercise 2: Responding to a competitor**

A competitor has just launched a product with a Prime rate of 13.8% (against your 15%). Minh needs an analysis within 48 hours.

Data available:
- Your monthly Prime applications: 5,000
- The competitor announced 2 weeks ago
- Applications since the announcement: 4,200/month (down 800, i.e. −16%)
- Credit loss rate (Prime): 1.0%
- Estimated elasticity: −1.8

Requirements:
(a) Is the 16% drop statistically significant, or within normal variation?
(b) The revenue impact of the current situation compared with before the competitor's launch
(c) Three response options, with a P&L analysis for each (use the Prime break-even of 12.46% as the floor)
(d) Your recommendation with a risk assessment
(e) What data would make your analysis more robust?

**Exercise 3: An interest rate cap compliance system**

Suppose the regulator announces: in 6 months, the APR cap for unsecured consumer lending will be 22%/year.

Analysis of the current portfolio:
- 15% of loans have an APR between 22% and 24% (they will exceed the new cap)
- All of them are Sub-prime loans originated this year

Design a compliance plan:
(a) System changes at origination (the validation logic)
(b) How are running loans above the new cap handled? (no retroactive changes are possible)
(c) How do you reprice the Sub-prime product to bring the APR under 22%?
(d) Business impact: how many Sub-prime customers will be rejected?
(e) Monitoring: how do you ensure no new loan exceeds the cap after rollout?

## Further reading {#đọc-thêm}

**Risk-based pricing:**
- Thomas, L. C., Crook, J. N., & Edelman, D. B. (2017). *Credit Scoring and Its Applications* (2nd ed.). SIAM. The chapters on pricing and profit models.

**Behavioural pricing:**
- Ariely, D. (2008). *Predictably Irrational: The Hidden Forces That Shape Our Decisions.* HarperCollins. The early chapters on the decoy effect, anchoring and their application to pricing.

**Cost disclosure regulation:**
- Consumer Financial Protection Bureau. *Truth in Lending Act (Regulation Z).* Available at consumerfinance.gov. A full guide to calculating and disclosing the APR.

*Chapter 13 puts behavioural economics into practice, not as theory but as concrete product and experience design decisions: from the nudges that help customers repay on time, to transparency tools that help them decide better, to the ethical limits a responsible financial system should not cross.*
