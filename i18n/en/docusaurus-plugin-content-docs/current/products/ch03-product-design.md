---
title: "Chapter 3. Designing financial products"
sidebar_label: "3. Designing financial products"
sidebar_position: 1
chapter: 3
subtitle: "Financial Product Design"
reading_time: 32
description: "Types of consumer credit products, fee and interest structures, how 0% instalment plans work, tariff-driven design in VLP, and the unit economics of a single loan."
source_file: "phan-1-chuong-3.md"
editorial_status: "edited"
lang: en
mdx:
  format: mdx
---

import CostStackChart from '@site/src/components/Charts/CostStackChart';

> *"A financial product is not just a contract. It is an incentive structure, a mechanism for allocating risk, and a promise about the future."*

## Introduction: two identical loans, two different products {/* #dẫn-nhập-hai-khoản-vay-giống-nhau-hai-sản-phẩm-khác-nhau */}

::::story
Minh is a Product Owner at Vela Finance. This week he receives two requests from the sales team.

**Request 1.** "The customer wants to borrow 20 million, at the lowest possible rate, over 12 months. An office worker with a stable salary."

**Request 2.** "The customer wants to borrow 20 million to buy a fridge at a partner electronics store, on a 0% instalment plan over 12 months."

Both are 20 million over 12 months. But Minh knows these are two different products, with different risks, costs and operating mechanics. If one design is used for both, at least one of them will not be sustainable.

Why? And how should the system be designed to support this variety without turning into a tangle of conditional branches?
::::

This chapter answers those two questions. Section 3.1 classifies consumer credit products. Section 3.2 analyses fee and interest structures, including the "0% instalment" mechanism. Section 3.3 presents *tariff-driven design*, the way VLP lets dozens of products run on a single engine. Section 3.4 works out the profit and loss of a single loan and the lifetime value of a customer.

## 3.1 Types of consumer credit products {/* #31-phân-loại-sản-phẩm-tín-dụng-tiêu-dùng */}

### The situation: an oversimplified classification is a wrong one

::::story
Hương is interviewing candidates for a Product Manager role, and asks: "What types of products are there in consumer finance?"

Candidate A answers: "Secured loans and unsecured loans."

Candidate B answers: "Revolving credit and instalment loans. But in practice it is more complicated: a revolving account can spawn instalment sub-plans, BNPL is a special kind of instalment loan subsidized by the merchant, and some hybrid products let the customer switch between the two modes."

Hương picks candidate B. Not because B said more, but because B understands that an oversimplified classification creates blind spots in both product and system design.
::::

### First dimension: revolving versus instalment

This is the most important classification, because it determines how the system charges interest, bills and measures risk.

#### Revolving credit

The borrower is granted a *credit limit*. Within that limit, they can draw or spend at any time, repay, and draw again. The limit "revolves" continuously. Credit cards and *flexi limits* are the two typical examples.

Technically, revolving credit has four characteristics:

- The balance changes with every transaction.
- Each month the borrower must pay at least an MMI *(minimum monthly instalment)*, usually a percentage of the balance or a fixed minimum amount.
- Interest is charged on the daily balance *(daily balance method)*.
- There is no fixed end date; the account exists until it is closed.

The product's specific risks come from that same flexibility. EAD is hard to predict, because borrowers tend to draw down their full limit before defaulting. Customers can accumulate debt gradually without noticing. And if they only pay the minimum, the principal falls very slowly.

::::story
**The minimum payment trap.** Lan has a credit card with a limit of 50,000,000 VND and has used all of it. The rate is 24% a year, or 2% a month. The issuer sets the MMI at 2% of the balance, which is 1,000,000 VND.

```text
Month 1:
  Opening balance: 50,000,000
  Interest: 50,000,000 × 2% = 1,000,000
  MMI due: 1,000,000
  Principal repaid: 1,000,000 - 1,000,000 = 0 VND!

Month 2:
  Balance: still 50,000,000
  Interest: another 1,000,000
  → Lan keeps paying and never gets out!
```

With an MMI exactly equal to the interest, Lan pays every month but her balance never falls.
::::

That is why the MMI is usually designed so that some principal is always repaid, for example all the interest plus max(2% of the balance, 500,000 VND). But even under that rule, if Lan pays only the minimum and spends nothing more, the 50 million debt takes 85 months, more than seven years, to pay off, and total interest comes to about 37.8 million, nearly three quarters of the original debt.

This is the behavioural economics problem analysed in [Chapter 13](/docs/intelligence/ch13-behavioral-economics), and the reason many countries require monthly statements to state "how long it will take to repay if you only pay the minimum".

#### Instalment loans

The borrower receives a *lump sum* and commits to repaying on a predetermined schedule, with specific amounts and due dates, until the loan is settled. Point-of-sale loans (POS loans, for example for a phone or a TV), cash loans and PHONELOAN (phone instalment loans) are examples.

Technically, the *amortization schedule* is fixed from the start; the payment each period (PMT) is fixed by the annuity formula in [Chapter 2](/docs/foundations/ch02-mathematics-of-lending); the account closes when fully repaid; and the borrower cannot redraw principal already repaid without taking out a new loan.

| Factor | Revolving | Instalment |
|---|---|---|
| Predictability of EAD | Low, volatile | High, follows the schedule |
| PD pattern | Slow rise, then a spike | Usually spikes early |
| Prepayment risk | High, can repay at any time | Usually subject to a prepayment fee |
| Behavioural risk | High (debt accumulation, minimum payment trap) | Lower |
| Predictability of revenue | Low | High |
| Suits | Stable customers who need flexibility | Purchases with a specific purpose |

#### Why this distinction matters for the VLP architecture

The two product types need different billing logic:

```text
Revolving Account:
  → Interest accrues daily on the actual balance
  → MMI calculated at period end from the balance
  → Many different transactions possible in one billing period
  → Balance changes continuously

Instalment Account:
  → Repayment schedule fixed from the start (InstalmentPlan)
  → PMT the same every month
  → Billing only confirms against the schedule
  → Balance falls along the amortization
```

In VLP, the account management module LAS has to handle both modes. A revolving account can also contain *instalment sub-plans* when the customer converts part of the balance into fixed instalments. This is one of the most complex parts of a consumer lending core system, and [Chapter 8](/docs/system/ch08-account-management) goes into it in depth.

### Second dimension: secured and unsecured

A **secured loan** is tied to a specific asset; if the borrower does not pay, the lender has the right to enforce against that asset. In pure consumer finance this type is relatively rare, mainly car loans or equipment loans with collateral.

Most consumer finance products are **unsecured loans**. The lender relies only on the borrower's ability and willingness to repay. That is why VLP has no collateral management module. It is a deliberate design decision reflecting an unsecured lending business model; as [Chapter 1](/docs/foundations/ch01-credit-economics) showed, the price of that choice is a higher LGD and a risk premium in the interest rate.

### BNPL: new architecture, old risks

::::story
Tuấn, the engineer, reads about Nordlane, Kiwipay and the BNPL *(buy now, pay later)* wave. He asks Minh: "Is BNPL a completely new product, or just a POS loan with a new name?"

Minh replies: "Both. Economically, BNPL is a short-term instalment loan. But its business model and risks are significantly different."
::::

:::key[BNPL]
**BNPL** *(buy now, pay later)* is a credit product that lets a buyer pay for an item in several instalments, usually 3 to 4 over 6 to 8 weeks, and usually interest-free if paid on time.
:::

If the buyer pays no interest, where does the BNPL provider make money? There are three sources:

```text
BNPL revenue model:

1. Merchant fees (merchant discount rate)
   The merchant pays 2-6% of the transaction value to the BNPL provider
   In return: higher conversion rate, higher average order value
   → The buyer pays "no interest", but the merchant pays instead

2. Late fees from buyers
   Late payment → high penalty fees
   Some providers rely on these to offset losses from non-payers

3. Interest from longer-term plans
   "3 months 0%" BNPL is often just marketing
   If not fully repaid after 3 months → very high retroactive interest
```

The first source is the core: merchants pay the BNPL provider because the product helps them sell more. The second and third show the downside: part of the revenue comes from the very borrowers who are struggling.

Most of BNPL's risks are old risks in a new form, but three are genuinely new:

| Risk | New or old | Explanation |
|---|---|---|
| Adverse selection | Old | High-risk borrowers are attracted by "0% interest" |
| Moral hazard | Old | Buying is easy, so people buy more and borrow beyond their means |
| Borrowing BNPL from several providers | **New** | Not reported to the credit bureau, so customers borrow from several providers at once without any of them knowing |
| Thin credit files | **New** | Targets segments with no credit history and little data for scoring |
| Regulatory gap | **New** | Many countries have no specific rules for BNPL yet |

::::story
Lan uses three BNPL services at once: 5 million for a phone in 4 instalments, 3 million for clothes in 3 instalments, and 8 million for a laptop in 6 instalments.

Her total obligation is 16 million, but each provider sees only its own loan. In many markets, credit bureaus do not yet take BNPL data. Nobody knows Lan's real total debt until she starts falling behind with all of them at the same time.
::::

**BNPL in VLP.** E-commerce BNPL transactions are handled by the transaction type (TransactionType) `BNPL_ECOM`, which belongs to both the `OUTER_DEBT_TRANSACTION_TYPES` and the `DISBURSEMENT_TRANSACTION_TYPES` groups. Unlike POS loans, which have their own origination flow, `BNPL_ECOM` follows the transaction flow: it creates an *outer-debt transaction* rather than directly creating an instalment plan. The instalment plan (IP) is created afterwards through a separate IP reconciliation flow, if the product is configured that way. The merchant subsidy follows the flow described in section 3.2.

:::summary[Section 3.1]
Revolving credit has a credit limit, interest on the daily balance, a minimum payment and high behavioural risk. Instalment loans have a fixed schedule, an even PMT and more predictable risk. BNPL is short-term instalment credit subsidized by the merchant, with the risk of borrowing from several providers at once. This classification determines billing logic and the risk model; it is not just a label.
:::

## 3.2 Fee and interest structures {/* #32-cấu-trúc-phí-và-lãi */}

### The situation: "0% interest" does not mean free

::::story
Minh walks into an electronics store and sees a large banner: "0% instalments, 12 months, no fees!" He knows the message is incomplete, but it is not a scam either. Behind it is a fairly sophisticated economic structure.

So who actually pays those 12 months of interest?
::::

### Four groups of fees and interest

Before answering that question, we need to see the whole "price list" of a consumer loan.

**Group 1. Interest**

| Type of interest | When it applies | Characteristics |
|---|---|---|
| *Regular interest* | In a normal period | Charged on the balance, daily or monthly |
| *Penalty interest* | When overdue | Higher than regular interest, charged on the overdue balance |
| *Promo rate* | During a promotional period | Lower than regular interest, possibly 0% |
| *Post-promo* | After the promotional period | Usually equal to regular interest, sometimes applied retroactively |

**Group 2. One-time fees**

| Fee | When charged | Notes |
|---|---|---|
| *Origination fee* | At disbursement | Usually deducted directly from the disbursed amount |
| *Prepayment fee* | On early repayment | Compensates the lender for lost interest income |
| *Renewal fee* | When the loan is renewed | Less common |

**Group 3. Recurring fees**

| Fee | Frequency | Notes |
|---|---|---|
| *Maintenance fee* | Monthly | Account service ACCMAINT, tariff item SVCFEE |
| *Statement fee* | Monthly | Often waived for electronic statements |
| Loan insurance premium | Monthly | Not mandatory but often cross-sold |
| SMS notification fee | Monthly | Small, but significant when multiplied by the number of accounts |

In VLP, the account maintenance fee is an *account service* with code `ACCMAINT`. The fee amount is read from the tariff item `SVCFEE` (service fee) in the tariff attached to that service; [Chapter 9](/docs/system/ch09-billing-cycle) describes how this fee is posted each period.

**Group 4. Penalty fees**

| Fee | When it applies | Characteristics |
|---|---|---|
| *Late fee* | DPD ≥ 1 | Fixed or a percentage of the balance |
| *Over-limit fee* | When the limit is exceeded | Revolving products only |
| *Returned payment fee* | When a payment fails | Less common |

### The real cost of a loan with all its fees

Back to Lan's loan: 18,500,000 VND, 18% a year, 12 months. Suppose the loan also carries an appraisal fee of 200,000 VND deducted from the disbursement, an insurance premium of 90,000 VND a month and an account maintenance fee of 50,000 VND a month.

```text
Amount actually received: 18,500,000 - 200,000 = 18,300,000 VND
Monthly PMT: 1,696,080 VND (period 12: 1,696,077 VND)
Insurance premium: 90,000 VND/month
Account maintenance fee (ACCMAINT): 50,000 VND/month

Total paid per month: 1,696,080 + 90,000 + 50,000 = 1,836,080 VND
Total paid over 12 months: 22,032,957 VND
Cost of credit: 22,032,957 - 18,300,000 = 3,732,957 VND

IRR of the cash flows: 2.978%/month
APR (IRR × 12): ≈ 35.7%/year
EIR ((1 + IRR)^12 - 1): ≈ 42.2%/year
Nominal rate on the contract: 18%/year
```

The APR is nearly double the nominal rate, a gap of about 17.7 percentage points. Recurring fees of 140,000 VND a month sound small, but against an average balance of only about 10.3 million they amount to more than 16% a year. That is why credit disclosure laws in many countries require the APR to include every mandatory fee. The method for calculating IRR, APR and EIR is set out in [Chapter 2, section 2.2](/docs/foundations/ch02-mathematics-of-lending#22-irr-apr-và-eir-lãi-suất-thật-là-gì); you can check these figures with the [cost-of-credit calculator](/docs/tools).

### Anatomy of a "0% instalment" plan

Back to Minh's situation. The store sells a fridge for 15,000,000 VND at "0% interest, 12 months". The buyer pays 1,250,000 VND a month for 12 months, exactly 15,000,000 VND in total, without a single dong of interest. So how does the finance company make a living?

:::key[Subvention]
**Subvention** is an arrangement in which a third party, usually the merchant or the manufacturer, pays the interest on the buyer's behalf.
:::

The common approach is a discount at disbursement: the finance company does not pay the merchant the full 15 million, only the present value of the twelve 1,250,000 VND payments, discounted at the rate the company needs to earn. The difference is the subvention.

```text
As a regular loan (18%/year, 12 months):
  PMT: 1,375,200 VND/month
  Total interest paid by the customer: 1,502,399 VND

As a 0% instalment plan with subvention:
  Customer pays: 1,250,000 VND/month × 12 = 15,000,000 VND
  Present value of those 12 payments, discounted at 1.5%/month: 13,634,382 VND
  Finance company pays the store: 13,634,382 VND
  Subvention borne by the store: 15,000,000 - 13,634,382 = 1,365,618 VND
```

With those same cash flows, the finance company earns exactly 18% a year, as on a regular loan. The subvention (1,365,618 VND) is lower than the total interest on the regular loan (1,502,399 VND), because the merchant pays it all up front rather than over 12 months.

**Why does the merchant accept paying about 9% of the sale price?** The merchant expects two effects: more buyers (a higher conversion rate), and buyers choosing more expensive models because it is "only a few hundred thousand more a month" (a higher average order value). Whether those effects are large enough has to be checked with numbers:

```text
Assumption: the store's gross margin is 25%

Without 0% instalments:
  100 fridges × 15 million = 1.5 billion revenue
  Gross profit: 1.5 billion × 25% = 375 million

With 0% instalments:
  150 fridges × 17 million (higher-end models) = 2.55 billion revenue
  Gross profit: 2.55 billion × 25% = 637.5 million
  Subvention: 150 × 1,547,701 = 232.2 million
  Profit after subvention: 405.3 million

Difference: +30.3 million
With a gross margin of only 20%: 510 - 232.2 = 277.8 million, below 300 million
```

With a 25% gross margin, and assuming sales rise 50% and the average price 13%, the programme adds only about 30 million. At a 20% margin, the programme leaves the merchant worse off than doing nothing.

:::key[A 0% instalment plan is a three-party problem]
A 0% instalment plan can be a positive-sum game: the merchant sells more, the buyer pays later, and the lender earns its target yield. But that holds only when the additional sales are enough to cover the subvention. The lender still earns its full 18% a year; the only question is who pays it.
:::

### Retroactive interest: a subtle trap

::::story
Lan buys a phone on a "0% interest for 6 months, if fully repaid before month 6" offer. In month 5 she needs the money for something else and can only pay half.

In month 7 she receives a bill with an unexpected figure. It turns out the 0% rate only applied **if** she paid in full on time. If not, interest at 24% a year is charged **retroactively from the start**, that is, recalculated for all six months that have passed.
::::

```text
Retroactive interest calculation:
  Months 1-6: average balance ≈ 8,000,000 VND (simplified)
  Retroactive interest: 8,000,000 × 24% × 6/12 = 960,000 VND
  → Appears on the month 7 bill as an unexpected charge
```

This is the **deferred interest** model, common in the United States and increasingly restricted elsewhere because it confuses consumers. Where it is used, the retroactive condition must be disclosed clearly from the outset.

VLP therefore has to distinguish the two models. In the **true 0%** model, the rate really is zero and the merchant pays a subvention. In the **deferred interest** model, interest is still calculated but deferred, and is waived only if the customer pays in full on time. The two models have different billing logic in LAS; confusing them during implementation is the source of many serious billing errors.

:::summary[Section 3.2]
A loan has four groups of costs: interest, one-time fees, recurring fees and penalty fees. The APR must include every mandatory fee; for Lan's loan, the fees raise the APR from 18% to about 35.7%. A 0% instalment plan is not magic: the merchant pays the interest through a subvention, and the programme only benefits the merchant when sales rise enough to cover it. Deferred interest is different from true 0% and must be clearly distinguished by the system.
:::

## 3.3 Tariff-driven design: why rules are not hard-coded {/* #33-thiết-kế-dựa-trên-biểu-phí-vì-sao-không-viết-cứng-trong-code */}

### The situation: the cost of hard-coding

::::story
In 2019, a finance company had five products. The development team wrote separate logic for each product directly in the code.
::::

```java
// Sản phẩm A
if (productType == "POS_LOAN") {
    interest = balance * 0.018 / 12;
    lateFee = 200_000;
}
// Sản phẩm B
if (productType == "CASH_LOAN") {
    interest = balance * 0.021 / 12;
    lateFee = 300_000;
}
// ... 3 sản phẩm nữa
```

In 2020, three more products were needed, so three more `if` branches were added. In 2021, the late fee for `POS_LOAN` had to rise from 200,000 to 250,000 VND: that meant changing code and waiting two weeks for review and a full redeployment. In 2022, a new regulation took effect at midnight on 1 January, so the team had to deploy at exactly that moment, outside working hours; an incident followed, a rollback was needed, and the company missed the compliance deadline.

Many financial systems built on hard-coded rules travel exactly this road.

### The philosophy of tariff-driven design

:::key[Tariff-driven design]
**Tariff-driven design** is an architecture in which all the rules for calculating fees and interest, and all billing behaviour, are **configured in the database**, not written in code. The code only knows how to read the configuration and execute it; it knows no specific figure.
:::

| Problem with hard-coding | Solution with tariffs |
|---|---|
| Changing a rate requires a code deployment | Change the rate by updating configuration, effective on a set date |
| A new product needs new code | A new product is a new set of tariff configuration |
| No history of rate changes | Every tariff is versioned with `validFrom` and `validTo` |
| Hard to test two price points | Two tariff versions run side by side |
| An error means rolling back the whole system | An error only requires retiring one tariff version |

### The tariff structure in VLP

VLP's tariff system has four components. This section introduces them from the smallest building block upwards. Note that this is not the ownership order: a `Tariff` **contains** tariff items, while a `FeeComponent` **references** a `FeeComponentType`.

#### Layer 1. FeeComponentType: the type of fee

`FeeComponentType` defines a *type* of fee or interest. It holds no figures, only descriptive information and a few behaviour flags.

```text
FeeComponentType Examples:
  Code: INTEREST_CASH
  Description: "Interest on cash loans"
  useLatestTariff: false (use the tariff in force when the loan was created)

  Code: LATEFEE1
  Description: "First late payment fee"
  manualCancel: true (can be cancelled manually, e.g. after a valid complaint)

  Code: GENFEE_CO
  Description: "Overrun fee, Collection Order scenario (account in formal collection)"
  authAccBlockCheck: true (charged only when the account is not blocked)
```

Newcomers often confuse `FeeComponentType` with `TransactionType`. They are different concepts:

| | FeeComponentType | TransactionType |
|---|---|---|
| Definition | The *type of fee or interest* generated | The *type of the originating transaction* |
| Examples | `INTEREST_CASH`, `LATEFEE1`, `GENFEE_CO` | `PURDISB` (purchase disbursement), `PAYIN` (payment), `BNPLPOS` (point-of-sale BNPL) |
| Cardinality | One transaction can generate several fee types | Each transaction has exactly one TransactionType |
| Where it lives | In the tariff configuration | In the transaction record |

For example, a `PURDISB` transaction (a recurring instalment purchase disbursement) generates interest of type `INTEREST_CASH`, and possibly `GENFEE_CO` if the limit is exceeded.

#### Layer 2. FeeComponent: the formula

A `FeeComponent` is a concrete calculation rule, holding everything needed to compute an amount.

```text
FeeComponent: INTEREST_CASH_STANDARD
  feeComponentType: INTEREST_CASH
  group: "standard"

  [Applicability]
  limitAmountBasedOn: PRINCIPAL_AMOUNT
  limitAmountFrom: 1,000,000          ← Applies only if the loan is ≥ 1 million
  limitAmountTo: 50,000,000           ← Applies only if the loan is ≤ 50 million
  limitNumberBasedOn: TERMS
  limitNumberFrom: 6                  ← Applies only if the term is ≥ 6 months
  limitNumberTo: 36                   ← Applies only if the term is ≤ 36 months

  [Calculation]
  calculationMethod: PERCENTAGE
  percentage: 0.018                   ← 1.8%/month = 21.6%/year
  percentageBasedOn: OUTSTANDING_DEBT ← Charged on the outstanding balance

  [Rounding]
  rounding: HALF_UP
  roundingScale: 0                    ← Rounded to whole VND

  [Result bounds]
  minAmount: 5,000                    ← Minimum 5,000 VND (avoids trivially small charges)
  maxAmount: null                     ← No upper bound

  [Tax]
  taxPercentage: null                 ← No VAT on interest

  [Day count]
  annualRateProjection: DAYS_365
```

Read aloud, this configuration says: "For cash loans from 1 to 50 million dong, with terms of 6 to 36 months, charge interest of 1.8% a month on the outstanding balance, rounded half up *(HALF_UP)* to the dong, with a minimum of 5,000 VND per calculation." The rounding rule is declared in configuration rather than left to the programming language's default, for the reasons analysed in [Chapter 2, section 2.5](/docs/foundations/ch02-mathematics-of-lending#25-tại-sao-tài-chính-không-dùng-số-thực-dấu-phẩy-động).

#### Layer 3. Tariff: grouping fees by validity period

A `Tariff` groups fees into a set with a validity period, saying which set of fees applies when.

```text
Tariff: STANDARD_2024
  code: "STANDARD"
  version: 3
  validFrom: 2024-01-01
  validTo: 2024-12-31           ← half-open: validTo is exclusive
  feeComponents: [
    INTEREST_CASH_STANDARD,
    INTEREST_CASHLESS_STANDARD,
    LATEFEE1_STANDARD,
    GENFEE_CO_STANDARD,
    ...
  ]

Tariff: STANDARD_2025  // illustrative — actual codes are short (e.g., "SVCFEE", "ORIGFEE")
  code: "STANDARD"  // actual: 2-6 char abbreviation
  version: 4
  validFrom: 2025-01-01
  validTo: null  ← null in the DB → converted by Java to a sentinel date
                   (3000-01-01 for AccountParameter, depending on the entity; see Appendix A)
                   Meaning: this tariff is valid indefinitely
  feeComponents: [
    INTEREST_CASH_STANDARD_V2,  ← The rate may have changed
    ...
  ]
```

In VLP, real tariff codes are short abbreviations of two to six characters such as `SVCFEE` or `ORIGFEE`; long names such as `STANDARD_2025` here only make the example easier to read.

The validity period is half-open: `validFrom` is included, `validTo` is not. The next version must therefore start exactly on the `validTo` date of the previous one. If version 3 has `validTo` 2024-12-31 and version 4 starts on 2025-01-01, no tariff is in force on 31 December 2024; the correct configuration sets version 3's `validTo` to 2025-01-01. This is exactly the kind of configuration error that the checks before activating a tariff need to catch.

**Why versions?** When a regulation lowers a rate cap from 20% to 18%, the company creates a new tariff version with the new rate, sets `validFrom` to the date the regulation takes effect, and leaves the old version untouched. Existing loans continue to use the tariff in force when the contract was signed (the `useLatestTariff: false` flag in layer 1), while new loans get the new rate. Old contracts are honoured, and the new regulation is complied with.

#### Layer 4. AccountFeeComponentType: behaviour by account type

This layer is often underestimated, yet it is the most important. It maps each `(AccountType, FeeComponentType)` pair to a set of billing behaviours. The corresponding database table is `LAS_FEE_COMPONENT_TO_ACCOUNT`. Think of it as the "nerve centre" of billing: it decides **how** a type of fee is handled on a particular type of account.

```text
AccountFeeComponentType (FLEXI_LIMIT_ACCOUNT, INTEREST_CASH):
  prescribeImmediately: false
  ← Interest does NOT create an EXTRA instalment immediately
  ← Instead: wait for EOM → create a REGULAR instalment

  applyIr: false
  ← Interest does NOT bear interest (no compounding)
  ← This is an important legal term

  updatingAvailableAmount: false
  ← Accrued interest does NOT reduce available credit
  ← Only outstanding debt reduces available credit

  updatingPrincipalAmount: false
  ← Interest is not added to principal

AccountFeeComponentType (FLEXI_LIMIT_ACCOUNT, LATEFEE1):
  prescribeImmediately: true
  ← A late fee CREATES an EXTRA instalment immediately
  ← No waiting for EOM

  applyIr: true
  ← An unpaid late fee → bears interest
  ← An incentive to pay the fee early

  updatingAvailableAmount: true
  ← A late fee REDUCES available credit
  ← The customer sees the limit drop → motivation to pay early
```

Each flag is a mechanism design decision:

| Flag | When `true` | When `false` | Mechanism design intent |
|---|---|---|---|
| `prescribeImmediately` | Creates an extra instalment (EXTRA) immediately | Waits for end of month (EOM), merged into the regular instalment (REGULAR) | Penalty fees need to appear at once to create urgency |
| `applyIr` | The item bears interest | No interest | Charging interest on unpaid penalties gives a stronger incentive to pay early |
| `updatingAvailableAmount` | Reduces available credit immediately | Does not reduce credit | A lower limit makes the consequence visible to the customer at once |
| `updatingPrincipalAmount` | Added to principal | Not added to principal | Affects the interest base in later periods |

For regular interest, `applyIr` and `updatingPrincipalAmount` are both `false`: interest is not capitalized, so no interest is charged on interest. This is a legal constraint, not a business choice. For late fees, `applyIr` set to `true` means unpaid penalties bear interest; how far this mechanism is allowed depends on each market's regulation, so it needs to be confirmed by the legal team when configured.

::::story
**Why does `LATEFEE1` have `prescribeImmediately = true`?** Lan misses her March payment and incurs a 200,000 VND late fee.

If `prescribeImmediately = false`, the fee is recorded but does not yet become an amount due. Only at the end of the month does the EOM step merge it into the regular instalment. Lan first sees the fee on her statement three to four weeks after missing the payment. The consequence arrives late and blurred, so the share of customers who return to paying on time *(cure rate)* is lower.

If `prescribeImmediately = true`, an extra 200,000 VND instalment exists on the very day she falls behind. The app says: "You have a late fee of 200,000 VND to pay". Her available credit drops by 200,000 VND. The consequence is visible immediately, and the cure rate is higher.
::::

An incentive mechanism, implemented as a boolean field.

### From business decision to tariff configuration

Here is how a business decision is translated into configuration. The decision: "Launch a consumer loan product for public school teachers. Interest at 15% a year, below the standard 18%, because PD is lower. A late fee of 150,000 VND because the segment is lower risk. No prepayment fee, to attract this segment."

```text
Step 1: Create new FeeComponentTypes (if they do not exist)
  INTEREST_TEACHER: "Interest for teachers"
  LATEFEE1_TEACHER: "Late fee for teachers"
  → Not needed: PREPAYMENT_FEE (this product has none)

Step 2: Create FeeComponents with concrete figures
  INTEREST_TEACHER_ITEM:
    feeComponentType: INTEREST_TEACHER
    percentage: 0.0125  ← 1.25%/month = 15%/year
    ...

  LATEFEE1_TEACHER_ITEM:
    feeComponentType: LATEFEE1_TEACHER
    calculationMethod: FIXED_AMOUNT
    fixedAmount: 150,000
    ...

Step 3: Create a Tariff with a validity period
  TEACHER_PRODUCT_2025:
    validFrom: 2025-03-01
    validTo: null
    items: [INTEREST_TEACHER_ITEM, LATEFEE1_TEACHER_ITEM, ...]

Step 4: Set AccountFeeComponentType for the new AccountType
  (TEACHER_ACCOUNT, INTEREST_TEACHER):
    prescribeImmediately: false
    applyIr: false
    ...

Step 5: Associate the Tariff with this product's AccountService
  → ACCMAINT service of the teacher account → tariffCode: "TEACHER_PRODUCT_2025"
```

No new code needs to be deployed. The whole product is created through operations on configuration data. That does not mean there is no risk: a wrong configuration value is as dangerous as a wrong line of code, so tariff configuration needs review, testing and approval just like code (see Exercise 3).

:::summary[Section 3.3]
The tariff in VLP has four layers. `FeeComponentType` defines the type of fee and holds no figures. `FeeComponent` is the formula with concrete figures. `Tariff` groups fees by validity period and is versioned so that old contracts keep their old terms. `AccountFeeComponentType` decides how each fee type behaves on each account type through flags such as `prescribeImmediately` and `applyIr`. Launching a new product means creating configuration, not writing code, but configuration still needs to be controlled as tightly as code.
:::

## 3.4 The unit economics of a loan {/* #34-kinh-tế-học-đơn-vị-của-một-khoản-vay */}

### The situation: when revenue does not tell the whole story

::::story
At the end of the quarter, Minh receives a report from finance: "BNPL revenue up 40% on the previous quarter."

Minh reads more closely and starts to worry. Revenue is up 40%, but the number of loans is up 80%, origination costs are up 75%, the default rate has risen from 3% to 5.5%, and the NPS *(net promoter score)* has fallen by 15 points.

"Are we growing, or running faster towards a cliff?" he asks bluntly in the meeting.
::::

Revenue growing more slowly than the number of loans means revenue per loan is falling, while cost and losses per loan are rising. To see that, we need to look at the profit and loss of each loan, that is, its *unit economics*.

### Revenue from one loan

Take Lan's loan: 18,500,000 VND, 18% a year, 12 months, an appraisal fee of 200,000 VND and an account maintenance fee of 50,000 VND a month.

```text
REVENUE (12 months):

Interest received:
  Total repaid - Principal = 20,352,957 - 18,500,000 = 1,852,957 VND

Recurring fees:
  Account maintenance fee (ACCMAINT): 50,000 × 12 = 600,000 VND

One-time fees:
  Appraisal fee: 200,000 VND

TOTAL REVENUE: 1,852,957 + 600,000 + 200,000 = 2,652,957 VND
Revenue / amount lent: 2,652,957 / 18,500,000 = 14.3%
```

The 90,000 VND monthly insurance premium from section 3.2 is not part of this revenue. The customer pays it, but most of it is passed on to the insurer; the lender usually earns only a commission. Counting the whole premium as revenue is a common mistake that makes the P&L look better than it is.

### Costs of one loan

```text
COST:

Cost of funds:
  Average balance over 12 months: ≈ 10,294,212 VND
  Cost of funds: 8.5%/year × 10,294,212 = 875,008 VND

Origination cost (one-off):
  Credit check: 50,000 VND
  Processing: 80,000 VND
  Agent commission (if any): 300,000 VND
  System cost: 20,000 VND
  Total origination: 450,000 VND

Servicing cost (12 months):
  Billing and payment processing: 50,000 VND
  Customer service: 30,000 VND
  System maintenance: 20,000 VND
  Total servicing: 100,000 VND

Expected credit loss (provision):
  EL = PD × LGD × EAD = 5% × 60% × 18,500,000 = 555,000 VND

TOTAL COST: 875,008 + 450,000 + 100,000 + 555,000 = 1,980,008 VND
```

The cost of funds is calculated on the average balance, not the original amount lent, because an instalment loan amortizes: the lender only needs to fund the remaining balance. Conversely, EL here uses an EAD equal to the full amount lent, a conservative assumption; if the customer defaults mid-term, the actual EAD is lower. The EL provision is an accounting cost equal to the expected loss, not added a second time.

### Overall profit and loss

```text
REVENUE:     2,652,957 VND  (14.3% of the amount lent)
COST:        1,980,008 VND  (10.7% of the amount lent)
─────────────────────────────────────────
NET MARGIN:    672,949 VND  (3.6% of the amount lent)
```

<CostStackChart
  title="Figure 3.1. Revenue and cost of an 18.5 million VND loan over 12 months"
  categoryKey="side"
  unit=" thousand"
  data={[
    {side: 'Revenue', interest: 1853, maint: 600, orig: 200},
    {side: 'Cost', cof: 875, acq: 450, serv: 100, el: 555},
  ]}
  series={[
    {key: 'interest', label: 'Interest', color: '#0b8a66'},
    {key: 'maint', label: 'Account maintenance fee', color: '#5fb89a'},
    {key: 'orig', label: 'Appraisal fee', color: '#a8dcc8'},
    {key: 'cof', label: 'Cost of funds', color: '#2f6f9f'},
    {key: 'acq', label: 'Origination cost', color: '#9b6a9e'},
    {key: 'serv', label: 'Servicing cost', color: '#6b8f71'},
    {key: 'el', label: 'Expected loss', color: '#c98a2b'},
  ]}
  caption="Unit: thousand VND, rounded. The margin before tax and overheads is about 673 thousand dong, or 3.6% of the amount lent."
/>

A margin of 3.6% of the amount lent, before tax and before corporate overheads (head office, technology, brand marketing). That is far thinner than the impression "18% interest" gives, and it shows three things. First, origination cost is a fixed cost per loan, so small or short loans struggle to be profitable. Second, if PD merely rises from 5% to 8%, EL rises by 333,000 VND and the margin is nearly halved; that is exactly Minh's worry at the start of this section. Third, a returning customer does not incur the full origination cost again, so retaining customers is very valuable.

### Customer lifetime value

::::story
Hương has to decide on a budget: spend more on marketing to win 1,000 new customers, or invest in a retention programme to get 1,000 existing customers to borrow again?

Marketing reports that acquiring a new customer costs 800,000 VND, while the retention programme costs 200,000 VND per customer.

At first glance, retention is four times cheaper. But Hương needs to analyse customer lifetime value before deciding.
::::

:::key[Customer lifetime value (CLV)]
**Customer lifetime value** *(CLV)* is the total present value of the net profit a customer generates over the whole time they remain a customer.
:::

$$
CLV = \sum_{t=1}^{T} \frac{p_t \times M_t}{(1+r)^t}
$$

where $M_t$ is the net profit from the customer in year $t$, $p_t$ is the probability that the customer is still borrowing in year $t$, $r$ is the discount rate (the cost of equity) and $T$ is the number of years considered.

**Customer A, a new customer with a thin credit file.** In year 1 they borrow 10 million, for a net profit of 800,000 VND. In year 2 they borrow 15 million again with probability 40%, for a profit of 1,100,000 VND. In year 3 they borrow 20 million with probability 25%, for a profit of 1,400,000 VND.

```text
CLV (discount rate 10%):
= 800,000/1.1 + (0.4 × 1,100,000)/1.1² + (0.25 × 1,400,000)/1.1³
= 727,273 + 363,636 + 262,960
= 1,353,869 VND
```

**Customer B, a long-standing customer with three years of good history.** In year 1 they borrow 25 million over 18 months, for a profit of 2,500,000 VND. In year 2 they borrow 30 million with probability 70%, for a profit of 2,800,000 VND. In year 3 they borrow 35 million with probability 60%, for a profit of 3,000,000 VND.

```text
CLV (discount rate 10%):
= 2,500,000/1.1 + (0.7 × 2,800,000)/1.1² + (0.6 × 3,000,000)/1.1³
= 2,272,727 + 1,619,835 + 1,352,367
= 5,244,929 VND
```

A common comparison divides CLV by cost:

```text
Acquisition (customer A):
  ROI = (1,353,869 - 800,000) / 800,000 = 69%

Retention (customer B):
  ROI = (5,244,929 - 200,000) / 200,000 = 2,522%
```

:::caution[This comparison overstates the benefit of retention]
Customer B has a high CLV because they were already a good customer, not because of the retention programme. Spending 200,000 VND only creates the **incremental** CLV due to the programme. If the programme raises customer B's probability of borrowing again in year 2 from 70% to 80%, the increment is $0.1 \times 2,800,000 / 1.1^2 \approx 231,405$ VND, an ROI of about 16%, not 2,522%. For a new customer, the whole CLV is incremental, because without the spending there would be no customer.
:::

Hương's correct conclusion is therefore more subtle: retaining good customers is usually worth the investment, because existing customers have a lower PD, do not incur the full origination cost again and borrow larger amounts. But each programme must be measured by the incremental CLV it actually creates, usually through an experiment with a control group. This is why mature finance companies invest in data to measure retention, not just in spending on it.

### Consequences for system design

CLV thinking changes many technical decisions.

**Collections strategy.** Instead of "collect as much as possible from this account", the goal becomes "help the customer through their difficulty so they remain a customer". This shapes the design of the collections process and the hardship programme ([Chapter 10](/docs/system/ch10-collections)).

**Prepayment fees.** Instead of "charge a prepayment fee to recover lost interest income", one can choose "a low fee or none, so the customer borrows again sooner". This decision lives in the tariff configuration; the [early settlement calculator](/docs/tools#early-settlement) shows how a prepayment fee changes the settlement amount.

**Closing accounts.** Instead of closing the account as soon as it is settled, it can be kept open with an offer to borrow again. This affects the `AccountStatus` state machine and the post-settlement process.

**Data architecture.** Calculating CLV needs the customer's entire history, not just the current account. The system therefore needs a data store at customer level, not only at account level.

:::summary[Section 3.4]
A loan's revenue consists of interest, recurring fees and one-time fees; insurance premiums collected on behalf of an insurer are not revenue. Costs consist of the cost of funds on the average balance, origination cost, servicing cost and expected loss. For Lan's loan, the margin is only about 3.6% of the amount lent, and very sensitive to PD and origination cost. CLV explains why retaining good customers is valuable, but the effect of a retention programme must be measured by the incremental CLV it creates.
:::

## Chapter 3 summary {/* #tổng-kết-chương-3 */}

Back to the two requests from the sales team, both for 20 million over 12 months:

| | Request 1: cash loan | Request 2: fridge on 0% instalments |
|---|---|---|
| Product type | Instalment, unsecured | Instalment subsidized by the merchant (POS or `BNPL_ECOM`) |
| Tariff | Standard rate and fees | Promotional rate, merchant subvention |
| Origination | Full credit assessment | Streamlined, small amount, point-of-sale flow |
| Revenue source | Interest and fees from the borrower | Merchant subvention, possibly late fees |

The two products differ in tariff, billing logic, origination process and risk model. Yet both run on the same engine. That is the power of tariff-driven design.

### Key takeaways

| Concept | Meaning | In VLP |
|---|---|---|
| Revolving and instalment | Two fundamentally different credit models | Two billing logics in LAS |
| BNPL | Short-term instalments, merchant subsidy, regulatory gap | TransactionType `BNPL_ECOM` |
| Subvention | The merchant pays the interest for the customer through a discount at disbursement | A cash flow different from a standard loan |
| APR | Cost of credit including every mandatory fee | Fees raise the sample loan's APR from 18% to about 35.7% |
| Tariff-driven design | Configuration instead of code | Four tariff layers, versioned |
| AccountFeeComponentType | How each fee type behaves on each account type | `prescribeImmediately`, `applyIr` |
| Unit economics | Profit and loss of each loan | Thin margin, sensitive to PD |
| CLV | Lifetime value exceeds the value of a single transaction | Needs customer-level data |

### Key terms

Revolving credit, instalment loan, minimum monthly instalment (MMI), BNPL, subvention, deferred interest, APR, tariff-driven design, FeeComponentType, FeeComponent, Tariff, unit economics, customer lifetime value (CLV). See the definitions on the [Glossary](/docs/glossary) page.

## Review questions {/* #câu-hỏi-tự-kiểm-tra */}

**Recall**

1. What is the fundamental difference between revolving credit and an instalment loan? Name two technical characteristics.
2. What is subvention? In a "0% instalment" programme, who actually pays the interest?
3. How many layers does the VLP tariff system have? Name each layer and its function.
4. What does `prescribeImmediately = true` mean in `AccountFeeComponentType`?

**Understand**

5. Why does the revolving versus instalment classification matter for system architecture? Give a concrete example of a difference in billing logic.
6. How does the minimum payment trap work? For a credit card with a balance of 30 million, interest at 24% a year, an MMI of 2% of the balance and no further spending, how many months does it take to repay? What if the MMI becomes all the interest plus max(2% of the balance, 500,000 VND)?
7. Why does tariff-driven design handle regulatory change better than hard-coding? Give an example.
8. Why is the CLV of a long-standing customer usually much higher than that of a new customer, even for similar loan amounts?

**Apply**

9. A company wants to launch a "student loan" product: 5,000,000 VND, 12% a year, a 12-month term, an appraisal fee of 100,000 VND deducted from the disbursement, no prepayment fee, and a fixed late fee of 100,000 VND.
   (a) Calculate the expected revenue per loan (interest and fees, assuming nobody pays late).
   (b) Calculate the APR and EIR.
   (c) Design the `FeeComponent` for this product's interest and late fee.
   (d) Should `prescribeImmediately` for the late fee be `true` or `false`? Why?
10. Minh analyses two scenarios for a portfolio of 100,000 loans of 18.5 million each, with a net profit of 700,000 VND per loan. Scenario A keeps a 2% prepayment fee (370,000 VND per loan). Scenario B drops the prepayment fee and expects the repeat borrowing rate to rise from 35% to 55%.
    (a) Calculate the prepayment fee revenue in scenario A, assuming 20% of customers prepay.
    (b) Calculate the additional profit in scenario B, counting only repeat loans in the first year.
    (c) Which scenario do you recommend? What further data do you need?

**Analyse**

11. If Vietnam required BNPL providers to report to the credit bureau like ordinary loans, how would that affect (a) the BNPL providers' business model, (b) borrower behaviour, and (c) what VLP needs to change?
12. A finance company is considering abandoning tariff-driven design for a model in which each product is a microservice with its own logic. Analyse the trade-offs in flexibility, maintainability, time to market and risk. What do you recommend?

## Exercises {/* #bài-tập-áp-dụng */}

**Exercise 1. Product design and tariff configuration.** A finance company wants to launch three products: (A) a standard cash loan, 5 to 50 million, 12 to 36 months, 18% a year, a late fee of 200,000 VND; (B) an electronics POS loan, 2 to 30 million, 6 to 24 months, 15% a year, a late fee of 150,000 VND; (C) BNPL with partners, 1 to 10 million, 3 to 6 months, "0% interest", with the merchant paying a subvention. (a) Identify the differences in billing logic between the three products. (b) List the `FeeComponentType`s that need to be created, without figures. (c) Design the `AccountFeeComponentType` behaviour flags for product C. (d) For product C with a 6-month term and a target yield of 18% a year, calculate the subvention as a share of the sale price, and describe the subvention cash flow in the system.

**Exercise 2. CLV analysis by channel.** Hương has data on two channels. App channel: acquisition cost 400,000 VND, repeat borrowing rate 45% in year 2 and 30% in year 3. Retail partner channel: acquisition cost 700,000 VND, repeat borrowing rate 65% in year 2 and 50% in year 3. Net profit per loan: 1,200,000 VND in year 1, 1,500,000 VND in year 2, 1,800,000 VND in year 3. Discount rate 12% a year. (a) Calculate the three-year CLV of each channel. (b) Calculate the ROI of each channel. (c) With a budget of 2 billion VND, how should it be allocated? What do you need to assume about each channel's scalability? (d) What data does VLP need to store to track CLV in real time?

**Exercise 3. Configuration risk.** Tuấn receives a request: "Add the teacher loan product to the system, starting next week, with no code deployment." (a) List all the configuration steps required. (b) Identify the test cases to run after configuration, including checks on the `validFrom`/`validTo` validity periods between versions. (c) If the configuration is wrong, what kinds of errors can occur? (d) Design a remediation plan if an error is found after customers have already borrowed.

## Further reading {/* #đọc-thêm */}

**Financial product design**

- Fabozzi, F. J. (Ed.) (2012). *Encyclopedia of Financial Models.* Wiley. A general reference on types of financial products and their structure.

**Fintech and BNPL**

- Philippon, T. (2019). "On Fintech and Financial Inclusion." *NBER Working Paper 26330.* An academic analysis of fintech's effect on financial inclusion, free to read at nber.org.

**Customer economics**

- Gupta, S. & Lehmann, D. R. (2005). *Managing Customers as Investments.* Wharton School Publishing. The classic book on CLV and customer equity.

Chapter 4 follows Lan through her whole journey, from the moment she starts looking for a loan until she has repaid it, not only from a process point of view but also through behavioural economics: why borrowers decide the way they do, and how the system should be designed to support those decisions rather than exploit them. [Chapter 4. The customer journey](/docs/products/ch04-customer-journey).
