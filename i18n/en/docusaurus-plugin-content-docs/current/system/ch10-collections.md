---
title: "Chapter 10. Debt management and collections"
sidebar_label: "10. Debt management and collections"
sidebar_position: 4
chapter: 10
subtitle: "Debt Management & Collections"
reading_time: 35
description: "Collections from three angles: the economics of cure rates and DPD buckets, the legal and ethical limits on debt reminders, and the architecture of the DRG module (DebtRegister as SCD Type 2, updated by events and on a schedule). With hardship programmes, write-off and recovery."
source_file: "phan-2-chuong-10.md"
editorial_status: "edited"
lang: en
---

> *"Collections is not a war between lender and borrower. It is a negotiation between someone who owes a payment and someone who wants to be paid, in a setting where both want the matter to end as well as it can."*

## Introduction: two phone calls {#dẫn-nhập-hai-cuộc-điện-thoại}

::::story
**The first call, on the morning of 7/4:**

"Hello Tùng, I'm calling from Vela Finance. Your payment due on 5/4 hasn't been recorded yet. Would you like me to send you the payment link again?"

Tùng replies: "Oh, I forgot. I'll transfer it this afternoon." He hangs up and makes the transfer straight away. DPD 2, no problem at all.

**The second call, also on the morning of 7/4, from another finance company:**

"Your account owes 1,800,000 VND. If you don't pay TODAY, we will report you to the credit bureau, contact your relatives and take you to court."

Khoa had meant to pay that day but had not got round to it. After the call, he is furious. Instead of transferring the money, he writes a bad review, files a complaint and decides never to borrow there again.

Two similar customers: both at DPD 2, both with the money to pay. Two different approaches. Two completely different outcomes, not only for the customer but for the business too.
::::

This chapter looks at collections from three angles: economics (maximizing recoveries while preserving customer lifetime value, CLV), law (the constraints on how debts are chased and collected), and engineering (the DRG module, the event flows, and the boundary between VLP and the external collections system).

## 10.1 Collections is a business function {#101-collections-là-một-chức-năng-kinh-doanh}

### DPD buckets: why classify by days

::::story
Hương asks the risk team: "Tell me the state of the portfolio." The risk team could answer in many ways, but the most useful is the distribution by DPD bucket.
::::

**The standard DPD (Days Past Due) buckets:**

```text
DPD 0    : CURRENT, paid on time
DPD 1-30 : BUCKET 1, early delinquency
DPD 31-60: BUCKET 2, mid delinquency
DPD 61-90: BUCKET 3, serious delinquency
DPD 91+  : BUCKET 4, bad debt (NPL, Non-Performing Loan)
           Stage 3 under IFRS 9
           Write-off candidate
```

The 30-day thresholds are not arbitrary. They follow the monthly payment cycle: each bucket corresponds to the number of payments the customer has missed.

| Bucket | Typical meaning | Typical cure rate |
|---|---|---|
| DPD 1-30 | One payment missed: oversight, a short-term cash gap | 40-60% |
| DPD 31-60 | Two payments missed: a clearer financial problem | 15-30% |
| DPD 61-90 | Three payments missed: very likely unable to pay | 5-10% |
| DPD 91+ | The Basel default threshold, Stage 3 under IFRS 9 | Very low |

The 90-day threshold also matches debt classification in Vietnam: under the State Bank's debt classification rules, debt overdue 91 days or more falls into groups 3 to 5, which is bad debt. Debt overdue 10 to 90 days is group 2, special mention. DPD 10 is therefore also a threshold the reporting system has to see, even though it does not coincide with a bucket boundary.

### The economics of the cure rate

:::key
The **cure rate** is the share of accounts in a DPD bucket that return to current within a month.
:::

The example below shows why early intervention is worth so much.

```text
Portfolio: 100,000 accounts at DPD 1-30
Average balance: 8,000,000 VND/account
LGD: 62%

Without intervention:
  DPD 1-30 cure rate (natural): 35%
  → 35,000 accounts return to current on their own
  → 65,000 accounts move to DPD 31-60

  DPD 31-60 cure rate (natural): 15%
  → 9,750 accounts cure in this bucket
  → 55,250 accounts roll on to DPD 61-90 and beyond

  Eventually default: about 45,000 accounts
  → Default rate of the group that rolled: 45,000 / 65,000 ≈ 69.2%
  Loss: 45,000 × 8,000,000 × 62% = 223,200,000,000 VND
      = 223.2 billion VND

Intervention at DPD 1-30 (SMS + calls):
  Cost: 200,000 VND/account × 100,000 = 20 billion VND
  Cure rate: 35% → 55% (+20 percentage points)
  → Only 45,000 accounts move to DPD 31-60 (instead of 65,000)
  → Defaults: 45,000 × 69.2% ≈ 31,154 accounts
  → Defaults avoided: 45,000 − 31,154 ≈ 13,846

  Loss avoided: 13,846 × 8,000,000 × 62% ≈ 68.7 billion VND

ROI: (68.7 − 20) / 20 ≈ 243%
```

A common mistake is to multiply all 20,000 additionally cured accounts by the LGD, giving 99.2 billion and an ROI of 396%. That calculation implicitly assumes every account that does not cure in the first bucket defaults. In reality, some of them still cure in later buckets, so only about 69% of the additionally cured accounts are genuinely avoided losses. Even with the more conservative figure, early intervention pays back more than three times over.

The general pattern across buckets:

| Bucket | Collection cost per account | Cure rate improvement from intervention |
|---|---|---|
| DPD 1-30 | Lowest | Highest (20-30 percentage points) |
| DPD 31-60 | Medium | Medium (10-15 points) |
| DPD 61-90 | High | Low (3-8 points) |
| DPD 91+ | Highest | Very low (1-3 points) |

The consequence is to invest heavily in automation at DPD 1-30. At DPD 91+, legal costs often far exceed the amount recovered.

### The collections strategy pyramid

```text
                     ▲
                    /|\
                   / | \
                  /  |  \
                 / LEGAL \        ← DPD 90+: Litigation, debt sale
                /─────────\
               / FIELD     \      ← DPD 60-90: Field agents, asset recovery
              /─────────────\
             /  LATE DIGITAL  \   ← DPD 30-60: Proactive calls, more frequent SMS
            /─────────────────\
           /   EARLY DIGITAL   \  ← DPD 1-30: Automated SMS, in-app reminders
          /─────────────────────\
         /     SELF-CURE         \ ← DPD 0 with risk signals: proactive contact
        /─────────────────────────\

Principles:
  The higher you go: cost per account rises, cure rate falls
  → Invest at the bottom first, climb only when needed
  → Avoid jumping early to legal action (it destroys CLV)
```

:::summary[Section 10.1]
DPD buckets are split by the number of payments missed: 1-30, 31-60, 61-90 and 91+, with the 90-day mark coinciding with the bad debt threshold. Cure rates fall quickly from bucket to bucket, so early intervention has the highest ROI. When calculating avoided losses, only accounts that would otherwise have defaulted count. Collections strategy climbs the pyramid from the bottom: cheap and gentle first, expensive and firm later.
:::

## 10.2 Early collections: self-cure and digital channels {#102-collections-giai-đoạn-sớm-tự-cure-và-kênh-số}

### When to make contact

::::story
The DPD update job runs at 00:01 every day. Tùng's account has just moved to DPD 1. Should the system send an SMS right then, at 00:01?

Clearly not. A debt reminder at midnight is harassment, not collections. In Vietnam it is also a breach: finance companies may only send debt reminders between 7:00 and 21:00.
::::

**A contact schedule based on customer behaviour:**

```text
Before the due date (DPD 0):
  D-7:  A gentle in-app reminder
  D-3:  "Statement for month X: pay before date Y"
  D-1:  "Your payment is due tomorrow"
  D-0:  "Your payment is due today"

DPD 1:
  09:00: Push notification "Payment not yet received"
  (Not sent at 00:01)

DPD 2:
  10:00: SMS with a payment link
  Evening (before 21:00): pop-up when the customer opens the app

DPD 3:
  Call windows: 9-11 a.m. or 3-6 p.m.

DPD 7-14:
  SMS/push daily
  Switch to manual calls if there is no response

DPD 15-29:
  At most two proactive calls a day, within the permitted hours
  Offer a payment arrangement if the customer cannot pay in full

Common constraint across all channels:
  Total debt reminders ≤ 5 a day, only between 7:00 and 21:00
```

**Optimizing send times with data:**

```text
SMS response rate by send time (historical data):

08:00-09:00: 12%
09:00-10:00: 18% ← highest
12:00-13:00: 15%
17:00-18:00: 16%
20:00-21:00:  8% ← low

Personalization: customers who usually respond early
  → Send at 08:30 instead of the common 09:00

A/B test: "Your payment is 1 day overdue" (states the fact)
     vs:  "Your account is being affected" (loss framing)
  → Loss framing usually raises the response rate by 20-30%
  → But it must be true: the account really is affected
    (DPD is recorded and affects the credit history)
```

### The automated communication pipeline

```text
DPD update (00:01 daily)
    │
    ▼
DRG module: DPD event → Kafka (debt.events)
    │
    ▼
External collections workflow engine (not part of DRG)
  (DRG publishes debt.events, the external engine subscribes)
    │
    ├─ Rule evaluation:
    │   DPD level + customer segment + contact history
    │   → Choose the right action
    │
    ├─ Scheduling:
    │   → Queue the SMS for 09:00
    │   → Book the call for 10:00-11:00
    │   → Set the in-app display flag
    │
    └─ Execution:
        SMS  → SMS provider API
        Push → Mobile push service
        Call → Auto-dialer (early stage) or agent queue (later stages)
```

**Personalizing the message:**

```text
Template: "Hello {customer_name}, account {account_number}
           has a payment of {amount} VND due {due_date}.
           Pay now at: {payment_link}"

Filled in: "Hello Tùng, account ACC-2025-456789
            has a payment of 1,800,000 VND due 05/04.
            Pay now at: pay.vela.vn/q8x3"

Deep link: payment_link opens the one-tap payment screen in the app directly
           → Less friction → higher cure rate
```

### Payment arrangements

::::story
Hùng (DPD 15) calls the contact centre: "I can't pay the full 1,800,000 this month because I've just lost my job. I can pay 600,000 today and the remaining 1,200,000 next week."

What can the collections agent do?
::::

```text
Decision: accept 600,000 today + 1,200,000 in 7 days

Actions in the system:
  1. Create a PaymentArrangement record:
     accountId: ACC-xxx
     agentId: agent-007
     date_created: today
     arrangement_type: SPLIT_PAYMENT
     installment_1: 600,000 VND, due = today
     installment_2: 1,200,000 VND, due = today + 7
     notes: "Customer lost his job, agreed to pay in two instalments"

  2. Collections: pause contact while the arrangement is in force
     (DPD is still calculated per the contract; the arrangement only adjusts
      how collections treats the account)

  3. Alert: if installment_1 has not arrived by due date + 1 day
     → resume the collections process

Agent authority:
  Level 1 (contact centre): arrangements up to 30 days
  Level 2 (supervisor): up to 60 days
  Level 3 (manager): restructuring (requires a change in LAS)
```

The distinction in step 2 is important. DPD is an accounting fact: it measures the time since the earliest unpaid overdue instalment, and DRG calculates it from LAS data. An arrangement made over the phone does not change the contractual repayment schedule, so it does not freeze DPD. To move a due date, you need a payment holiday or a restructuring (section 10.5), which are real changes in LAS.

Why must the arrangement live in the system rather than in the agent's notes? If it is not recorded, Hùng pays 600,000 and still receives a collections call the next day, despite having an arrangement. When the arrangement is in the system, the collections engine knows not to make contact while it is in force, knows when it has been broken so it can resume the process, and leaves an audit trail: who agreed, on what terms.

:::summary[Section 10.2]
Contact timing is based on behavioural data and always stays within 7:00 to 21:00, with at most 5 debt reminders a day. DPD events travel from DRG through Kafka to the external collections engine, which chooses the message, channel and send time. Payment arrangements are recorded in the system to avoid harassing customers who are cooperating, but they do not change how DPD is calculated.
:::

## 10.3 Late-stage collections {#103-collections-giai-đoạn-muộn}

### DPD 30-60: proactive calls and more frequent contact

Once DPD passes 30 days, collections moves to a dedicated team:

```text
Collections team structure:
  Early stage (DPD 1-30): automated + light contact
  Mid stage (DPD 30-60): dedicated collectors, proactive calls
  Late stage (DPD 60-90): senior collectors + preparing the legal file
  Legal and recovery (DPD 90+): a specialist team
```

**Skip tracing, when the customer cannot be reached:**

The customer has changed phone number or does not answer. The collections team needs to find a new contact channel, but the line on what is allowed is very clear.

| Allowed | Not allowed |
|---|---|
| Checking contact details the customer has updated in the app | Contacting relatives or friends to chase the debt or pass on messages |
| Sending email (some customers reply to email even if they ignore calls) | Public pressure on social media |
| More recent contact details from the credit bureau, within what is permitted | Contacting the customer's workplace |
| | Buying the customer's personal data from third parties |

In Vietnam, finance companies may not remind, demand or send debt collection information to organizations or individuals who have no obligation to repay (Circular 18/2019/TT-NHNN amending Circular 43/2016/TT-NHNN). The customer's relatives, colleagues or manager all belong to that group, unless they are guarantors. The Law on Personal Data Protection 91/2025/QH15, in force from 1/1/2026, prohibits buying and selling personal data, so buying a customer's contact details from a third party is no longer a grey area.

### DPD 60-90: approaching the legal threshold

**Preparing for possible litigation:**

```text
Documents to prepare:
  1. The full transaction history (from LAS)
  2. A log of every contact (from the collections system)
  3. Any payment arrangements made
  4. Evidence of the debt (the signed contract, from DMS)
  5. Any correspondence about the customer's financial hardship

Accompanied by a notice before legal action:
  "Dear [customer],
   Your account currently owes X VND and is 65 days overdue.
   We would like to resolve this with you before moving to
   legal action. Please contact us within 15 days.

   Your options:
   1. Pay in full
   2. Agree a payment plan
   3. Discuss a restructuring option"
```

**Why the pre-litigation notice matters:**

```text
Economic reason: litigation is very expensive (illustrative figures)
  Court fees and legal costs: a few percent of the amount in dispute
  Lawyer and enforcement costs: 5-15% of the amount recovered
  Time: 6-18 months

After costs: often only 40-60% of the balance is recovered
→ If just 10% of customers cure because of the notice, the ROI beats litigation

CLV reason: litigation ends the relationship permanently
  Sue and win: the customer never comes back
  Sue and lose: worse than not suing

  A notice first: some customers will pay, and the relationship is kept
```

### DPD 90+: sell the debt or keep it

::::story
Hương's portfolio has 2,000 accounts at DPD 90+, with a total balance of 80 billion VND. There are two options.
::::

**Option A: keep it and continue collecting**

```text
Estimate:
  Cost of the legal recovery team: 3% of the balance/year = 2.4 billion/year
  Internal recovery rate (DPD 90+): about 25% over 2 years
  Amount recovered: 80 billion × 25% = 20 billion VND
  Net after costs: 20 − (2.4 × 2) = 15.2 billion VND
  Recovery period: 2 years or more
```

**Option B: sell to a debt buyer**

```text
Offer price: 15% of face value
  Sale price: 80 billion × 15% = 12 billion VND
  Timing: received immediately
  Cost: low (due diligence + transfer)
  Net: 12 billion VND immediately

Nominal comparison:
  A: 15.2 billion VND over 2 years
  B: 12 billion VND now

Present value comparison (discount rate 12%/year):
  A: PV = 15.2 / 1.12^1.5 ≈ 12.82 billion (assuming the average cash flow arrives after 1.5 years)
  B: PV = 12 billion

Conclusion: A is about 0.8 billion better, but:
  + A: operational burden, legal risk, brand risk
  + B: cleans up the books, focuses resources on the live portfolio
```

A difference of 0.8 billion on an 80 billion balance is only about 1%, smaller than the error in the "25% recovered over 2 years" assumption itself. When two options are this close, non-financial factors usually decide.

**Requirements when selling debt:**

```text
Legal requirements:
  1. Notify the customer that the debt has been transferred
  2. The debt buyer must be an organization qualified under debt trading rules
  3. The buyer must follow the same fair debt collection standards
  4. The customer's rights (complaints, payment terms) go with the debt

System impact:
  The account in LAS: status → WRITTEN_OFF (after the sale)
  The data is still kept for audit
  The buyer receives: account data, transaction history, contact log
  LAS flags the account so the customer receives no new loan offers
      (some lenders allow it again after a rehabilitation period)
```

There is one more point in Vietnam: from 1/1/2021, the Law on Investment 2020 added debt collection services to the list of prohibited businesses. Lenders still collect their own debts, and can still sell debts under the debt trading rules, but cannot hire a "debt collection company" to do it for them.

:::summary[Section 10.3]
At DPD 30-60, contact becomes more frequent and skip tracing may be needed, but people with no obligation to repay may not be contacted and personal data may not be bought. At DPD 60-90, the legal file is prepared alongside a notice giving the customer a last chance to cure. At DPD 90+, the decision to keep or sell the debt rests on the present value of each option, plus the operational burden and brand risk.
:::

## 10.4 The DRG module: Debt Register architecture {#104-drg-module-kiến-trúc-debt-register}

### Why separate it from LAS

::::story
Tuấn asks: "Why do we need a separate DRG module? LAS already has all the overdue data. Isn't that duplicating data?"
::::

There are three reasons.

**First, the two are optimized for different jobs.** LAS processes transactions in real time: write-heavy, needing ACID, with a normalized schema for fast updates. DRG tracks the state of debt over time and supplies data for collections: read-heavy, needing history, with a denormalized schema for fast queries. Merge them and LAS's real-time updates have to compete for resources with DRG's analytical queries, and the schema has to compromise to the point of being optimal for neither.

**Second, different lifecycles.** Account data in LAS lives as long as the account, plus the retention period for audit. Debt data in DRG has to live longer, even after the account is closed, for credit reporting, legal action and recovery. After write-off, the account in LAS is effectively frozen in the `WRITTEN_OFF` state, while DRG keeps tracking recoveries.

**Third, different access patterns.** LAS receives REST calls from LOS, the BFF and collections triggers: per-account queries at high frequency. DRG serves batch queries for the collections portfolio, roll rate calculations, IFRS 9 provisioning and regulatory reporting: aggregate queries, at moderate frequency but complex. So the two can choose different storage technologies: LAS uses PostgreSQL for transactions, while DRG can add a columnar store for analytics.

### Event-driven synchronization from LAS

```text
LAS → Kafka (CloudEvents, Avro) → DRG

Events DRG subscribes to:
  transaction.confirmed (from LAS):
    → DRG receives it via Kafka (topic transaction.confirmed, Avro)
    → DebtRegisterServiceFacade recalculates the whole debt state
    → Creates a new DebtRegister record (SCD Type 2)

DRG → Kafka (CloudEvents) → LAS, SRT and other systems:
  debt.events:
    → When DPD crosses thresholds
    → LAS subscribes: receives the signal for further handling (e.g. write-off)

DRG ↔ CTM: REST calls (looking up contract data)

Architecture:
  LAS ──(transaction.confirmed)──→ DRG ──(debt.events)──→ LAS, SRT, ...
                                    ↑
                                CTM (REST)
```

**DRG's central entity: DebtRegister as SCD Type 2**

This is the key to understanding DRG. Instead of updating one row per account, DRG creates a **new history record** every time the state of the debt changes, following the Slowly Changing Dimension Type 2 model. Each DebtRegister record has a `validFrom` and a `validTo`, so the state of an account's debt can be known at any point in the past.

```text
Table: V_DEBT_CATALOGUE (a view on the base table)

Key fields:
  contractCode          → Link to the Account
  validFrom, validTo    → SCD Type 2 temporal validity
  previousDebtRegisterId → Chain to the previous version

Debt breakdown:
  totalPrincipalDebt, overduePrincipalDebt
  totalInterestDebt, overdueInterestDebt
  totalDebtOnFees, overdueDebtOnFees
  totalDebtOnPenalties, overdueDebtOnPenalties
  totalDebt, totalOverdueDebt
  generalDebt, generalDebtWithPenalties
  creditLimit

DPD & Timing:
  daysPastDue          → DateUtil.dateDifferenceInDays(today, firstOverdueDueDate)
  firstOverdueInstallmentDueDate
  nextInstallmentAmount, dueDateOfNextInstallment
  countOfOverdueInstallments
  dateOfFirstPayment, dateOfLatestPayment, latestPaymentAmount
```

**Why SCD Type 2:**

```text
Situation: an account's DPD rises 0 → 5 → 10 → 15

One row per account:
  UPDATE drg_account SET dpd=5 ...  (history lost)
  UPDATE drg_account SET dpd=10 ... (history lost)
  UPDATE drg_account SET dpd=15 ... (history lost)

  "What was this account's DPD on 15/3?" → cannot be answered

SCD Type 2:
  INSERT (validFrom=10/3, validTo=14/3, dpd=5, prevId=null)
  INSERT (validFrom=15/3, validTo=19/3, dpd=10, prevId=previous record)
  INSERT (validFrom=20/3, validTo=UNREACHABLE_DATE, dpd=15, prevId=previous record)

  "DPD on 15/3?" → SELECT WHERE validFrom <= 15/3 AND validTo >= 15/3 → 10
  → Full history, no data lost
```

**DebtRegisterStatistics: historical maximums**

```text
Attached to the DebtRegister, storing the highest values ever reached:
  maxHistoricalDPD         → The highest DPD ever (never decreases)
  maxHistoricalOverdueDebt → The highest overdue amount ever

Use: credit risk assessment, IFRS 9 staging
  "Even if the account is current today, if its highest DPD
   was ever 90+, it is still flagged as higher risk when staging"
```

**When the first DebtRegister is created:**

DRG does not create a DebtRegister when the contract is signed. The first record appears only when a transaction leaves an instalment overdue, that is, the first time DPD is above 0. Accounts that always pay on time have no DebtRegister at all. DRG really is a debt-centric system, not an account-centric one.

### How often DRG is updated: two parallel mechanisms

DRG is not only updated when an event arrives from LAS. It also has a scheduled job:

```text
Mechanism 1: event-driven (every transaction)
  LAS confirms a transaction → publishes transaction.confirmed
  → DRG receives it → DebtRegisterServiceFacade recalculates
  → Closes the old DebtRegister record (validTo = now)
  → Creates a new DebtRegister record (validFrom = now)
  Latency: milliseconds to a few seconds

Mechanism 2: scheduled DPD recalculation (daily cron)
  OverdueDebtJobLauncher (@Scheduled cron)
  → Ensures DPD rises every day even when LAS has no new events
  → Updates daysPastDue for every overdue account

Consequence for an overdue account with no transactions:
  → Mechanism 1: no update at all
  → Mechanism 2: DPD rises every day
  → The DebtRegister is updated once a day by the cron
```

With only the first mechanism, a customer who stops paying altogether would stay forever at the DPD of their last transaction, exactly the kind of account collections most needs to see.

### The collections workflow lives outside VLP

DRG has **no** collections workflow engine. DRG is the catalogue of debt data: it calculates and stores the DebtRegister, tracks DPD, publishes `debt.events` and serves the state of debt through a REST API. Everything belonging to day-to-day collections work lives in an external CRM/collections system.

| DRG does | The external collections system does |
|---|---|
| Calculates the DebtRegister, stores it as SCD Type 2 | Assigns collectors |
| Tracks DPD (event-driven + daily cron) | Call history and outcomes |
| Publishes `debt.events` to Kafka | Tracks promises to pay and payment arrangements |
| Serves the state of debt through a REST API | Escalation by bucket (early → dedicated → legal) |
| | Applies contact rules: frequency, hours, channels |

The principles on DPD buckets, contact frequency, ethical limits and hardship in this chapter are all real business practice. They are enforced in the external system, not in DRG or LAS. For a reader who wants to understand the business, that changes nothing. For an engineer, it defines responsibilities clearly: if a customer is called at 22:00, the fault lies in the collections system's rule engine, while if a customer is called after paying in full, check whether DRG received `transaction.confirmed`.

:::summary[Section 10.4]
DRG is separate from LAS because they differ in optimization, data lifecycle and access patterns. DRG stores the state of debt as SCD Type 2 so it can answer "what was the debt at time X", and is updated with every transaction and by a daily cron so that DPD always rises correctly. DRG supplies the data; the external collections system decides on the action.
:::

## 10.5 Hardship programmes {#105-hardship-program}

### When the customer really cannot pay

::::story
Hùng lost his job in April (section 10.2). The two arranged payments were not made, the account is at DPD 25, and the collections agent knows his situation well.

The company has two ways to handle it.
::::

The first is to keep pressing. Hùng might sell belongings or borrow elsewhere to pay, or fail to pay and end in default. Either way, the relationship is over.

The second is to offer a hardship programme. If he finds work within a few months, he can carry on paying, and the customer is kept.

### Payment holidays

:::key
A **payment holiday** lets the customer skip payments for a number of periods (usually 1-3 months) without late fees. Interest may still accrue, depending on the product's policy.
:::

**The economics of a payment holiday** (illustrative figures, from Vela Finance's point of view):

```text
Assumptions:
  Hùng's balance: 15,000,000 VND, 18%/year, LGD 62%
  Without a holiday: the loan heads for write-off
  Interest accrued over the 3-month holiday: 15,000,000 × 1.5% × 3 = 675,000 VND
  Cost of administering the holiday: 200,000 VND

No payment holiday:
  DPD 25 → 60 → 90 → write-off
  Loss: 15,000,000 × 62% = 9,300,000 VND
  Collections cost: 1,000,000 VND
  Total cost: 10,300,000 VND

A 3-month payment holiday:
  Scenario A (favourable): Hùng finds work again
    → Resumes paying, including the accrued interest
    → Cost: 200,000 VND (administration only)

  Scenario B (unfavourable): no new job
    → Overdue again after the holiday, collections as before but 3 months later
    → Balance at default now includes the accrued interest: 15,675,000 VND
    → Loss: 15,675,000 × 62% = 9,718,500 VND
    → Total cost: 200,000 + 9,718,500 + 1,000,000 = 10,918,500 VND

If P(favourable) = 40%:
  Expected cost without a holiday: 10,300,000
  Expected cost with a holiday: 0.4 × 200,000 + 0.6 × 10,918,500
                              = 80,000 + 6,551,100 = 6,631,100

Break-even: the holiday pays off when P(favourable) > about 6%
```

The result sounds counter-intuitive: if only about one in seventeen customers like Hùng recovers, the programme is already profitable. The reason is that scenario B barely makes things worse than not offering a holiday, adding only the administration cost and the loss on the accrued interest. Scenario A, on the other hand, saves almost the entire loss. Note that accrued interest is not a cost to the lender: in scenario A, the customer pays that interest too.

**Implementing a payment holiday in the system:**

```text
Who initiates it? An external API caller (the operations team through the UI/BFF).
DRG and LAS do not initiate it themselves: it is a human decision, executed through an API.

Flow:
  API caller → RepaymentPauseManager.createRepaymentPauseRequest()
    → RepaymentPauseService creates a RepaymentPauseRequest entity
    → EventReplayManager.reprocessOnwardEvents(..., PAYMENT_HOLIDAY)
    → The due dates of the instalments are MOVED LATER

RepaymentPauseRequest (LAS_REPAYMENT_PAUSE_REQUEST):
  account → Account
  deferredPeriodsNumber: N months (e.g. 3)
  firstDeferredDueDate: the first deferred due date
  expectedLastDeferredDueDate: the end of the holiday
  billingPeriodNumberFrom: the billing period number where the holiday starts
  payholAccountBlockage: whether the account is blocked
  payholInterestWaiving: whether interest is waived
  payholIPInterestCharging: whether instalment plan interest keeps being charged
  status: PENDING → RUNNING → EXPIRED | CANCELLED
  Linked to the RELPAYHOL contract service (checks eligibility for a holiday)

EOM behaviour during the holiday:
  Condition: currentBP >= billingPeriodFrom AND < billingPeriodFrom + deferredPeriods
  If on holiday:
    Due date: moved later by exactly the number of holiday months
    DPD: counted from the NEW due date (not the original)
    Interest: per the payholInterestWaiving flag (waived or still accruing)
    Late fees: usually waived

After the holiday ends:
  The deferred instalments fall due on the new dates (original date + holiday months)
  No retroactive calculation: the amounts were fixed when the request was created
  DPD is counted from the new due date

Distinct from restructuring (extending the term, changing the rate):
  NOT done with RepaymentPause: that is only a payment deferral
  Restructuring = creating a new InstalmentPlan (a REST call to LPS)
  → External API → LAS InstalmentPlanCreationService → LPS → new plan
```

Once activated, the external collections system should still check periodically on the customer's situation during the holiday, for example once a week.

**Interest during the holiday:**

A common question: "If I don't have to pay, there's no interest, right?" Not quite. Under an accruing interest policy, interest keeps running because Hùng is still using the capital, and Vela Finance still has to pay the cost of funding that money. Waiving interest means the lender subsidizes the customer. That can be a deliberate choice (the `payholInterestWaiving` flag exists for exactly this case), but it cannot be the default.

```text
Disclosure requirement (in many countries, and good practice everywhere):
  It must be stated clearly before the customer agrees to the holiday:
  "Interest continues to accrue during the holiday.
   After 3 months, you will owe an extra 675,000 VND."

Behavioural factor:
  Customers often underestimate accrued interest
  → Transparent disclosure reduces surprises and later disputes
```

### Debt restructuring: changing the contract terms

A payment holiday is not enough when the hardship lasts: Hùng finds work but at a salary 40% lower than before, the customer loses the ability to work for a long time, or a self-employed borrower goes bankrupt.

**Restructuring options:**

```text
Option 1: Extend the term
  Current: balance 12,000,000 VND, 12 months left, 18%/year
           → pays 1,100,160 VND/month, remaining total interest 1,201,920
  Restructured: 12,000,000 VND, 24 months, 18%/year
           → pays 599,089 VND/month, total interest 2,378,145
  Trade-off: the monthly payment nearly halves;
             the lender earns more interest but carries the risk for longer

Option 2: A temporary rate reduction
  Current: 18%/year
  Restructured: 10%/year for 6 months, then back to 18%
  Trade-off: less short-term revenue, the relationship is kept

Option 3: Principal reduction (the last resort)
  The lender forgives part of the principal
  Only when: the NPV of the restructuring > the NPV of a write-off
  Trade-off: revenue lost, but better than losing everything

Option 4: A balloon payment at the end
  Pay little each month, with a large final payment
  Risk: the final payment may not be payable either
```

**The IFRS 9 impact of restructuring:**

```text
Before restructuring: the account may already be in Stage 2 (DPD 30+)
After restructuring: the account is flagged as forborne
  Many regulators require a probation period
  (e.g. at least 12 months) before it can return to Stage 1,
  even if the customer is paying well under the new terms.
  Vela Finance's policy uses the 12-month mark.

Provisioning impact:
  Stage 2: lifetime ECL provision
  → The provision stays high during the probation period → P&L impact
```

This is the "IFRS 9 cost of hardship": a restructured loan needs higher provisions even while it is being repaid regularly, and investors see that in the financial statements.

## 10.6 Write-off and recovery {#106-write-off-và-thu-hồi}

### The write-off decision

Write-off policies differ from company to company. A typical policy: DPD 180 is an automatic write-off candidate, while in the DPD 90-180 range each case is considered, based on recovery prospects (collateral, a guarantor, employment), the cost of further collection compared with the expected recovery, and regulatory guidance.

Write-off does not mean forgiving the debt. In accounting terms, the loan is taken off the balance sheet. In legal terms, the obligation to repay remains intact: the customer still owes, and the lender keeps collecting. Write-off only means "no longer expected to be repaid in the near future".

**Accounting for write-off:**

```text
Before write-off (on the balance sheet):
  Loan: 10,000,000 VND
  Provision: (6,200,000 VND), corresponding to an LGD of 62%
  Net carrying value: 3,800,000 VND

Write-off entry:
  Dr  Provision                   6,200,000
  Dr  P&L (write-off loss)        3,800,000
  Cr  Loan                       10,000,000
  → The loan leaves the balance sheet
  → The P&L records an additional 3,800,000 VND (the part not yet provided for)

Why the P&L does not record the full 10,000,000:
  6,200,000 already went through the P&L when the provision was made
  Write-off only realizes the loss; the provision had already reflected it
```

**The write-off flow: DRG detects, LAS executes**

DRG does not initiate write-off itself. DRG detects and signals, LAS executes.

```text
1. DRG tracks DPD. When DPD >= writeOffThreshold (configurable, e.g. 90):
     DRG provides: getDebtRegisterDPDByThresholds(writeOffThreshold=90)
     DRG publishes: debt.events (Kafka CloudEvents)

2. Triggering the write-off:
     Decided by an operational process based on the signal from DRG
     Account.status: ACTIVE → WRITTEN_OFF

3. After WRITTEN_OFF:
     LAS stops accruing interest and charging periodic fees (no new interest or fees)
     Payment transactions: STILL ACCEPTED (off-balance-sheet recovery)
     LedgerEntries with outstanding balances: kept as they are (not cancelled)
     Transaction history: kept for audit

4. Off-balance-sheet recovery continues:
     An external system or DRG tracks recovery efforts
     The WRITTEN_OFF status is reported to the CIC
```

```text
Configurable threshold:
  writeOffThreshold: passed to DRG as an API parameter
  (not hard-coded, allowing different rules by product or segment)
  Common: DPD 90 for unsecured consumer loans, DPD 180 for secured loans
```

### Recovery after write-off

```text
Internal recovery (the first 12 months after write-off):
  The collections team keeps making contact
  Settlement offers: "We will accept 40% to close the debt"
  → Some customers will agree to settle for a much smaller amount

Debt sale (usually after 12-24 months):
  Sold to an organization qualified to buy debt
  Price: 5-15% of face value for long-written-off debt
  Transfer: the right to collect and the data go to the buyer

Asset recovery (if any):
  Consumer loans: usually unsecured → almost no assets to recover
  If secured (car loans): repossess the car → auction

Limitation period for legal action:
  Vietnam: 3 years for contract disputes (Civil Code 2015, Article 429),
  counted from when the lender knew or should have known its rights were infringed
  Once it expires: the debt does not disappear, but it can no longer be sued on
```

**How payments after write-off are actually handled:**

```text
A WRITTEN_OFF account still accepts payments normally:
  → There is no block on payment transactions for the WRITTEN_OFF status
  → Transaction + EventRecord + LedgerEntry (CREDIT) created as usual
  → MatchingService pairs them with instalments that still have balances, as usual
  → CurrentBalance.outstandingDebt falls, customerCredit rises

There is NO separate transaction type for recoveries.
There is NO special accounting flag in LAS.
Recoveries are tracked through LedgerEntry and CurrentBalance like any other account.

An external finance/GL system (not LAS or DRG) handles:
  → Recognizing the recovery in the P&L
  → Updating the credit bureau
  → Off-balance-sheet tracking from an accounting point of view
```

:::summary[Sections 10.5 and 10.6]
A payment holiday pays off economically even when the probability of the customer recovering is fairly low, because the bad scenario is barely worse than no holiday. If interest still accrues, the customer must be told the amount clearly before agreeing. Restructuring changes the actual repayment plan and brings a forbearance flag and a probation period before provisions can fall. Write-off is an accounting entry, not debt forgiveness: DRG signals, LAS changes the status, and payments after write-off are still recorded like any other payment.
:::

## 10.7 The legal framework and ethical limits {#107-khung-pháp-lý-và-ranh-giới-đạo-đức}

### Fair debt collection

::::story
Minh (the Product Owner) is reviewing a new call script for the collections team. The script contains the line: "If you don't pay within 24 hours, we will contact your boss."

Minh stops and asks the legal team: "Is this line lawful?"
::::

**The legal framework for reference:**

```text
In Vietnam:
  Civil Code 2015: the rights and obligations of the parties to a loan contract
  Law on Credit Institutions 2024 (32/2024/QH15)
  Circular 43/2016/TT-NHNN on consumer lending by finance companies,
    amended by Circular 18/2019/TT-NHNN: rules on debt reminders and collection
  Law on Protection of Consumers' Rights 2023 (19/2023/QH15)
  Law on Personal Data Protection 2025 (91/2025/QH15)
  Law on Investment 2020: debt collection services prohibited from 1/1/2021

International references:
  US: Fair Debt Collection Practices Act (FDCPA) and Regulation F
  EU: Consumer Credit Directive
  UK: Financial Conduct Authority (FCA) rules
```

The most specific rules for finance companies are the debt reminder requirements of Circular 18/2019/TT-NHNN: collection measures may not include threatening the customer, debt reminders are limited to 5 a day, only between 7:00 and 21:00, and no reminders or debt collection information may be sent to people with no obligation to repay. These instruments may continue to be amended, so Vela Finance's legal team reviews the collections system's rules whenever a new instrument appears.

**Prohibited behaviour:**

| Group | Behaviour |
|---|---|
| Harassment | Reminders outside 7:00-21:00; more than 5 reminders a day; threatening or insulting language; calling repeatedly to apply pressure |
| Deception | Posing as a lawyer or a state agency; threatening legal action with no intention of taking it; misstating the amount owed; threatening arrest (which does not exist in a civil dispute) |
| Invasion of privacy | Contacting the customer's workplace; telling relatives about the debt (except guarantors); public shaming on social media; using data beyond the purpose the customer consented to |
| Unfairness | Charging amounts not in the contract; threatening to damage the credit history when nothing is actually reported; pushing customers to pay at any cost regardless of their ability |

Conversely, the collections team is fully entitled to contact customers within the permitted hours, inform them accurately about the debt, report truthfully to the credit bureau, take legal action through proper procedure, offer settlements or payment plans, contact guarantors, and look for new contact channels within what personal data law allows.

### Resolving disputes

**Customers have the right to complain:**

```text
Common disputes:
  "I didn't make this transaction" (fraud)
  "The amount is wrong" (amount)
  "I paid but it wasn't recorded" (payment)
  "This fee isn't in the contract" (fee)

System support:
  Flag the account as "in dispute"
  Collections: PAUSED until the dispute is resolved
  LAS: investigate the transaction from the audit trail
  DMS: retrieve the contract to check the terms

Common timelines:
  Acknowledge the complaint: within 5-7 working days
  Resolution: 30-60 working days
  If the customer is right: reverse the wrongly charged amounts

During the dispute:
  Collections: paused
  Late fees on the disputed amount: suspended
  Credit bureau: may need to be marked "in dispute"
```

In VLP today, LAS and DRG have no `Dispute` entity or dispute flag field. Dispute handling lives in an external system (the CRM or the customer care system). In a redesign, the ideal flow would be:

```text
// Dispute handling flow (design illustration)
// 1. Create a dispute record (in the CRM or the customer care system)
// 2. Flag the account → suspend late fees on the disputed amount
// 3. Pause the collections activities in progress
// 4. Open an investigation case
// 5. Send the customer an acknowledgement of the complaint
//
// The concrete implementation depends on the scope of each system
```

### Ethical limits: the hard questions

Back to the line in the script: "If you don't pay within 24 hours, we will contact your boss." The legal team's answer is short: not allowed. The customer's manager is a person with no obligation to repay, so contacting them breaches the debt reminder rules. On top of that, a 24-hour deadline with a threat attached is a form of unfair pressure. The line has to go.

But some cases are less clear:

| Situation | Lawful? | Ethical? | Conclusion |
|---|---|---|---|
| "Your credit score will be affected" | Yes, if true | Yes, it states the consequence | Acceptable |
| "Your family will find out about the debt" | No: relatives have no obligation to repay | No: uses family ties as leverage | Not acceptable |
| Calling at 22:45 | No: outside 7:00-21:00 | | Not acceptable |
| "If unpaid after 30 days, we will report to the credit bureau" | Yes, if that is what happens | Yes, transparent about the consequence | Acceptable |
| Deliberately calling when you know the customer is in an important meeting | No direct prohibition yet | No: harassment in substance | Not acceptable; company policy should prohibit it |

**Four questions for the collections team:**

1. **Legal:** does any regulation prohibit it?
2. **Front page:** if this action made the news, would the company be embarrassed?
3. **Role reversal:** if I were the customer, would I accept it?
4. **CLV:** does this action preserve or destroy the relationship with the customer?

Pass all four and it is acceptable. Fail any one of them and reconsider, or escalate.

:::summary[Section 10.7]
In Vietnam, finance companies' debt reminders are limited to 5 a day, between 7:00 and 21:00, with no threats and no contact with people who have no obligation to repay; debt collection services for hire have been prohibited since 2021. Prohibited behaviour falls into four groups: harassment, deception, invasion of privacy and unfairness. Disputes are handled in the external system, with collections paused until a conclusion is reached. The four questions, legal, front page, role reversal and CLV, help with cases the rules do not spell out.
:::

## Chapter 10 summary {#tóm-tắt-chương-10}

The collections journey of an account from DPD 1 until it is resolved:

```text
DPD 1-7: Early digital
  SMS at 09:00, push notifications, one-tap payment links
  System: automated, frequency-capped, optimized by behaviour
  Goal: the customer self-cures, with the least friction

DPD 8-29: Intensification
  Calls within the permitted hours, offers of payment arrangements
  System: the external collections rule engine + agent queues
  (DRG is a data catalogue, not a rule engine)
  Goal: cure before DPD 30

DPD 30: Move to Stage 2 under IFRS 9
  Lifetime ECL provision → P&L impact
  Assigned to a dedicated collector

DPD 30-59: Mid-stage collections
  More frequent contact, skip tracing within the law
  Assess the hardship: temporary or long-term?
  A hardship programme if appropriate

DPD 60-89: Pre-legal
  Prepare the file, send a notice with a deadline
  The last chance to cure
  Start assessing the debt sale option

DPD 90+: Legal and write-off
  Stage 3 under IFRS 9
  The write-off decision (accounting)
  Litigation OR debt sale
  Recovery tracking after write-off

Throughout:
  Fair treatment (legal + ethical)
  Dispute handling (the customer's rights are protected)
  Record-keeping (every action is auditable)
  CLV thinking (keep the relationship while you still can)

The best collections outcome:
  Not "we got the money back"
  But "the customer recovered, repaid in full and can borrow again"
```

## Review questions {#câu-hỏi-tự-kiểm-tra}

**Type 1: Recall**
1. What are the standard DPD buckets? Why the 30, 60 and 90-day thresholds?
2. What is the cure rate? Why does it fall from bucket to bucket?
3. Does a payment holiday waive interest? Financially, what still happens?
4. In accounting terms, how does write-off differ from forgiving the debt?

**Type 2: Understand**
5. Why is the ROI of early collections (DPD 1-30) much higher than that of late collections (DPD 90+)? Calculate with concrete figures, and explain why you must not multiply all the additionally cured accounts by the LGD.
6. Why does DRG exist separately from LAS, when LAS already has all the overdue data?
7. What does a forbearance flag mean? Why must a restructured loan go through a probation period before provisions can fall, even if the customer is paying well?
8. Why must a payment arrangement be recorded in the system and not only in the agent's notes? Why does the arrangement not freeze DPD?

**Type 3: Apply**

9. A portfolio has 50,000 accounts at DPD 1-30, a total balance of 400 billion, and an LGD of 60%. Assume 69% of the accounts that do not cure in this bucket eventually default.
   - Scenario A: no intervention, natural cure rate 35%
   - Scenario B: SMS and calls, cost 250,000/account, cure rate 55%
   - Scenario C: aggressive intervention, cost 600,000/account, cure rate 65%

   (a) Calculate the expected loss in each scenario.
   (b) Calculate the net benefit (loss avoided minus cost) of B and C compared with A.
   (c) Recommend the optimal strategy.

10. A customer is at DPD 45, with a balance of 12,000,000 VND, an LGD of 60% and interest at 18% a year. You offer a 2-month payment holiday with interest still accruing. P(the customer recovers after the holiday) = 35%.

    (a) Calculate the interest accrued over the 2-month holiday.
    (b) Calculate the expected cost with the payment holiday.
    (c) Calculate the expected cost without the holiday.
    (d) Should you offer the holiday? What is the break-even probability?

**Type 4: Analyse**

11. The collections team proposes monitoring social media to detect customers spending lavishly while saying they cannot repay. Analyse:
    (a) Potential value: what does this information tell you?
    (b) Legal risk: processing personal data without consent, under the Law on Personal Data Protection 2025 and the GDPR
    (c) Ethical risk: using social media in debt collection
    (d) Operational risk: misidentifying people
    (e) Your recommendation

12. Design a collections strategy for a new BNPL product:
    - Average loan: 3,000,000 VND
    - Term: 3 months
    - Most customers have no credit data (thin-file)
    - Customers mainly use the app
    - Expected rate of falling into DPD 1-30: 8% (compared with 4% for ordinary products)

    Design: (a) the contact strategy and timing, (b) the choice of channels, (c) the target cure rate, (d) the timing of write-off, (e) how does being thin-file affect the collections strategy?

## Exercises {#bài-tập-áp-dụng}

**Exercise 1: A collections ROI model**

Build an ROI model for a portfolio of 200,000 accounts, with an average balance of 10,000,000 VND and an LGD of 62%.

DPD distribution:

| Bucket | Number of accounts | Intervention cost per account | Natural cure rate | Cure rate with intervention |
|---|---|---|---|---|
| DPD 1-30 | 8,000 | SMS/push 100,000; adding calls +200,000 | 35% | 55% |
| DPD 31-60 | 3,200 | Contact centre 400,000 | 15% | 28% |
| DPD 61-90 | 1,500 | Dedicated collector 800,000 | 7% | 12% |
| DPD 91+ | 800 | Legal 2,000,000 | 2% | 4% |

(a) Calculate the expected loss with and without intervention for each bucket. State your assumption about the default rate of accounts that do not cure.
(b) Calculate the net ROI of intervention in each bucket.
(c) With a total collections budget of 5 billion VND, how should it be allocated across the buckets?
(d) Which DPD 91+ accounts should be sued, and which sold?

**Exercise 2: Designing the DRG module**

Design DRG's data model and event processing for a portfolio of 1.2 million accounts.

Requirements:
- Track DPD in near real time (within 5 minutes of an event from LAS)
- Supply data for collections automation
- Calculate the IFRS 9 stage
- Regulatory reporting (monthly DPD distribution)
- Analyse collections performance

Deliverables:
(a) The database schema (the main tables)
(b) The Kafka subscriptions: which events, which actions
(c) The collections rule engine for DPD 1-30: design the decision tree (where does it live, inside or outside DRG?)
(d) The IFRS 9 stage transition logic
(e) Performance: how do you process 1.2 million accounts within a 5-minute SLA?

**Exercise 3: Designing an ethical collections programme**

You are Head of Collections at a consumer finance company. Design a complete collections programme, covering staff training and ethical guidelines, message templates, technology controls (frequency caps, blocking outside permitted hours), customer rights and dispute handling.

(a) A code of conduct for staff: 10 specific rules
(b) Technology controls: 5 automated mechanisms that ensure compliance
(c) Customer rights: the information that must be given at first contact
(d) The SLA and process for handling disputes
(e) Quality monitoring: how do you verify that staff follow the ethical guidelines?

## Further reading {#đọc-thêm}

**Regulation:**
- Consumer Financial Protection Bureau. (2020). *Debt Collection Practices (Regulation F), Final Rule.* Available at consumerfinance.gov. A modern regulatory framework for fair debt collection, including call frequency limits and rules for electronic channels.
- Circular 18/2019/TT-NHNN amending and supplementing Circular 43/2016/TT-NHNN on consumer lending by finance companies. The debt reminder requirements are cited in section 10.7.

**Behavioural economics:**
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.* Yale University Press. The foundation for designing collections messages and contact timing.

*Chapter 10 closes Part III. We have gone from the overall architecture (Chapter 6), through origination (Chapter 7), account management and billing (Chapters 8 and 9), to collections. Part IV moves to the "intelligence" layer: credit scoring, risk-based pricing and behavioural economics in practice, where data and algorithms meet business understanding to create a real competitive advantage.*
