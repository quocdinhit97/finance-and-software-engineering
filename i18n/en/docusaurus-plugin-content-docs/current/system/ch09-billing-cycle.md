---
title: "Chapter 9. The billing cycle"
sidebar_label: "9. The billing cycle"
sidebar_position: 3
chapter: 9
subtitle: "The Billing Cycle"
reading_time: 30
description: "A complete billing cycle on Lan's account: the key dates, transactions during the period, each EOM step with concrete figures, the statement and its mandatory disclosures, payment pairing for early, on-time, late and partial payments, and reconciliation between LAS, STS and DRG."
source_file: "phan-2-chuong-9.md"
editorial_status: "edited"
lang: en
---

> *"Once a month, millions of questions are answered at the same time: how much, due when, who owes whom. The answers have to be correct to the last dong, and in the customer's inbox before they wake up."*

## Introduction: the new month starts at 23:00 {#dẫn-nhập-tháng-mới-bắt-đầu-lúc-23-giờ}

::::story
At 23:00 on 19 March, the office is empty. But the system is starting the most important job of the month.

Over the next eight hours, VLP closes the billing period for 1.2 million accounts. The next morning, each customer gets the answers to three questions:

1. "How much did I spend last period, and how much do I owe?"
2. "How much do I have to pay this period, and by when?"
3. "What happens if I don't pay on time?"
::::

[Chapter 8](/docs/system/ch08-account-management) described each component of LAS. This chapter puts them together, following a complete billing cycle on Lan's account, from the first transaction of the period to the moment the statement appears on her phone. The aim is not just to know the steps, but to understand why each step exists, why their order matters, and why a small error anywhere can make thousands of people's statements wrong.

The example running through the chapter is Lan's flexi-limit account: a limit of 18,500,000 VND, interest at 18% a year on the 30/360 convention, an account maintenance fee of 50,000 VND a month and an insurance premium of 90,000 VND a month.

## 9.1 Overview of the billing cycle {#91-tổng-quan-chu-kỳ-billing}

### Anatomy of a billing period

::::story
Lan's account was activated on 10 January, with a billing day on the 20th of each month and a due-day offset of 16 days.
::::

```text
Billing period 1:
  Start: 10/1 (activation date)
  End: 19/1 (the day before the billing day)
  Statement date: 20/1
  Due date: 5/2 (statement date + 16 days)

Billing period 2:
  Start: 20/1, end: 19/2
  Statement date: 20/2
  Due date: 8/3

Billing period 3:
  Start: 20/2, end: 19/3
  Statement date: 20/3
  Due date: 5/4
```

The first period is shorter than a month because it starts on the activation date. Period 2's due date is 8/3 rather than 5/3 because February has only 28 days: the due-day offset is counted in days, not as a fixed day of the month.

The three key dates of each period:

```text
┌───────────────────────────────────────────────────────────────┐
│  BILLING DATE (the 20th)                                       │
│  → EOM runs on the night of 19/3 → calculates the closing period │
│  → The statement is generated                                  │
│  → The customer receives the statement                         │
│                                                               │
│  DUE DATE (the 5th of the next month)                         │
│  → The deadline for payment                                   │
│  → If unpaid → penalties start                                │
│                                                               │
│  GRACE PERIOD (from billing date to due date = 16 days)       │
│  → Time to review the statement and prepare payment           │
│  → Interest still accrues in the grace period (revolving)     │
│  → But no late fee in the grace period                        │
└───────────────────────────────────────────────────────────────┘
```

Why a gap between the statement date and the due date is needed:

```text
Billing day = 20 → Statement ready on the 20th
If due date = 20 (the same day): no time to review
If due date = 30 (next month): too short, given banking processing time

Due day offset = 16: the customer has 16 days to:
  1. Receive and review the statement
  2. Arrange payment
  3. Bank transfer processing (1-3 days)
  4. Payment posted to the account

16 days = a balance between the lender's interest (wanting money early)
          and the customer's convenience (wanting more time)
```

### Intraday events and period-end events

There are two kinds of events in a billing period:

```text
REAL-TIME EVENTS (happen continuously, processed immediately):
  - Transaction confirmations (purchase, payment, cash)
  - Authorization holds/releases
  - Fee events marked IMMEDIATE (late fee, over-limit fee)
  - Account parameter changes
  - Service activations/deactivations

EOM EVENTS (happen only once, at period end):
  - Monthly interest calculation
  - Monthly service fees (ACCMAINT, insurance...)
  - Instalment generation (REGULAR type)
  - Overpayment pairing
  - DPD recalculation
  - PeriodBalanceSnapshot snapshot
  - Statement generation trigger
```

Why not post interest every day? There are three approaches:

```text
Option A: Calculate interest daily, post immediately
  Pro: The customer sees interest accumulate in real time
  Con: 1.2M accounts × 30 days = 36M interest entries/month
       → Significant performance overhead
       → A complicated statement (30 interest lines instead of 1)

Option B: Calculate interest daily (daily accrual), post once at period end
  Pro: Accurate + a simple statement (1 interest line)
  Con: Interest is not visible accumulating in real time

Option C: Calculate interest once at EOM from the balance history in the period (VLP)
  Interest = Σ (balance of each segment × days in the segment × daily rate)
  → One calculation at period end, the same result as daily accrual
  → Needs the balance history in the period to be correct

Example with a balance that changes over a 30-day period:
  Days 1-5:   balance 10,000,000 VND  (5 days)
  Days 6-20:  pays 3,000,000  → balance 7,000,000 VND  (15 days)
  Days 21-30: buys 1,500,000  → balance 8,500,000 VND  (10 days)

  30/360 convention (D30_360): daily rate = 18% / 360 = 0.05%
  Interest = (5 × 10,000,000 + 15 × 7,000,000 + 10 × 8,500,000) × 0.05%
           = 25,000 + 52,500 + 42,500
           = 120,000 VND
```

Under the 30/360 convention, every month counts as 30 days and the year as 360 days, so the period from 20/2 to 19/3 (28 calendar days) is still counted as 30 days. The Actual/365 convention gives different results, especially in February and in 31-day months. What matters is that the convention is consistent across the tariff, the interest engine and the reconciliation tools.

:::summary[Section 9.1]
Each period has three key dates: the statement date, the due date and the grace period between them; the due-day offset is counted in days. Intraday events (transactions, payments, immediate fees) are processed at once; interest, monthly fees, instalments and the snapshot are created at EOM. VLP calculates interest once at EOM from the balance history in the period, on the 30/360 convention, with the same result as daily accrual.
:::

## 9.2 During the period: real-time billing {#92-trong-kỳ-billing-theo-thời-gian-thực}

### Lan's third billing period, day by day

Let us follow Lan's period from 20/2 to 19/3.

**Account state at the start of the period, after the EOM of 20/2:**

```text
AccountNumber: ACC-2025-789456
Status: ACTIVE
CreditLimit: 18,500,000 VND
OutstandingDebt: 13,500,000 VND
  (principal 13,300,000 + period 2 interest and fees of 200,000)
AvailableBalance: 5,000,000 VND
Pending instalment: REGULAR 1,800,000 VND, due 8/3
  (period 2 interest and fees of 200,000 + principal 1,600,000)
BillingDay: 20
DPD: 0
```

**5/3: a purchase.** Lan uses her card to buy clothes for 2,500,000 VND.

```text
10:23:15 — POS Authorization:
  Auth request: amount=2,500,000, merchantCode="FASHION_STORE_001"
  LAS processes:
    holdBalance += 2,500,000 → holdBalance = 2,500,000
    availableBalance -= 2,500,000 → availableBalance = 2,500,000
  Auth response: APPROVED

10:25:30 — Merchant settlement (same day):
  Confirmation: amount=2,500,000, sourceTxCode="POS-TXN-20250305-789"
  LAS processes:
    1. Check idempotency: sourceTxCode does not exist yet → continue
    2. Create the Transaction record (CONFIRMED)
    3. Create LedgerEntry: DEBIT 2,500,000, FeeComponentType: PRINCIPAL
    4. Create PostingUnit: baseAmount=2,500,000, applyIr=true
    5. Update CurrentBalance:
       holdBalance -= 2,500,000 → holdBalance = 0
       outstandingDebt += 2,500,000 → outstandingDebt = 16,000,000
       availableBalance = 18,500,000 - 0 - 16,000,000 = 2,500,000 (unchanged)
    6. Bill event: EventType = IMMEDIATE_RESPECT_FREEZE
       → Not in a freeze window → billed immediately
       → No EXTRA instalment (prescribeImmediately=false for PRINCIPAL)
    7. Publish TransactionConfirmedEvent
```

**7/3: paying the instalment due.** Lan transfers 1,800,000 VND, exactly the amount due on 8/3.

```text
09:15:22 — Payment: 1,800,000 VND (bank transfer)
  1. Create Transaction: CREDIT 1,800,000, type=PAYIN
  2. Create LedgerEntry: CREDIT 1,800,000
  3. Pairing runs at once (there is a pending instalment):
     → The REGULAR instalment due 8/3 (1,800,000): FULLY PAIRED, repaid=true
  4. Update CurrentBalance:
     outstandingDebt -= 1,800,000 → outstandingDebt = 14,200,000 (all principal)
     availableBalance = 18,500,000 - 14,200,000 = 4,300,000
  5. Publish PaymentReceivedEvent → DRG, STS
```

**18/3: an extra payment with no instalment pending.** Her salary arrives, and Lan transfers another 3,000,000 VND.

```text
08:40:05 — Payment: 3,000,000 VND
  1. Create Transaction: CREDIT 3,000,000, type=PAYIN
  2. Create LedgerEntry: CREDIT 3,000,000
  3. Pairing: no instalment pending
     (the 8/3 instalment is paid, the next one is only created at the EOM of 19/3)
     → The money sits in customerCredit, waiting to be paired at EOM
  4. Update CurrentBalance:
     customerCredit = 3,000,000
     outstandingDebt = 14,200,000 (not reduced — not yet paired)
     availableBalance = 18,500,000 - 14,200,000 + 3,000,000 = 7,300,000
```

The two payments are handled differently. The 7/3 payment has an instalment to pair with, so it is paired at once and reduces the balance at once. The 18/3 payment arrives when there is no instalment, so it sits in the customer's credit balance: the available balance rises at once, but the interest-bearing balance only falls when the money is paired at EOM. This is a design choice with a small but real consequence: two days of interest on 3 million, about 3,000 VND. Some other systems deduct an extra payment from principal immediately.

**The night of 19/3, 23:00:** EOM for the period ending 19/3 begins. Lan's account is one of the 1.2 million accounts processed.

### Immediate fees and period-end fees

The late fee is an example of an immediate fee. Suppose Lan had paid the 8/3 instalment late:

```text
Late fee calculation (AccountFeeComponentType: LATEFEE1):
  prescribeImmediately = true
  Amount: 200,000 VND (fixed amount for this product)

Processing:
  1. LedgerEntry: DEBIT 200,000, FeeComponentType=LATEFEE1
  2. PostingUnit: applyIr=true (interest charged on the late fee if unpaid)
  3. Because prescribeImmediately=true:
     → Create EXTRA Instalment: 200,000 VND, due=TODAY
     → InstalmentSummary for TODAY with EXTRA type
  4. Update CurrentBalance:
     outstandingDebt += 200,000
     availableBalance -= 200,000
  5. Push notification: "A late fee of 200,000 VND has been charged to your account"
```

The account maintenance fee is a period-end fee:

```text
Tariff item types for ACCMAINT: SVCFEE, CORUA, CURUA (variants)
  prescribeImmediately = false (EOM)

Processing in eomServiceFeesJob (STEP 2 — before the main EOM):
  1. ServiceFeeItemProcessor checks the ACCMAINT service is active at billingPeriodEnd
  2. Read the fee amount from the tariff item (SVCFEE) — amount per config
  3. Create EventRecord (type=SERVICE_FEE)
  4. Create LedgerEntry: DEBIT, FeeComponentType=SVCFEE
  
  Must run BEFORE the interest calculation:
  → The fee must be in the outstanding balance when interest is calculated
  → If fees ran after interest: interest would be short (not charged on the fee amount)
```

As noted in [Chapter 3](/docs/products/ch03-product-design) and [Chapter 8](/docs/system/ch08-account-management), `SVCFEE` is the tariff item of the `ACCMAINT` service. The service fee step runs before the main EOM so that the fee is in the balance when the later steps calculate.

## 9.3 EOM: closing the billing period {#93-eom-khép-lại-kỳ-billing}

### Each EOM step on Lan's account

**Account state before EOM, the night of 19/3:**

```text
Account: ACC-2025-789456
OutstandingDebt: 14,200,000 VND (all principal)
CustomerCredit: 3,000,000 VND (the 18/3 payment, not yet paired)
AvailableBalance: 7,300,000 VND
Account.billingPeriod: BP_20 (EOM runs for the period ending before the 20th)
PeriodBalanceSnapshot.billingPeriodNumber: 2 (previous period)
DPD: 0
LastEOMDate: 2025-02-19
```

**Step P1: ClearAccountingNotifications**

```text
Clear the notification buffer from the previous session.
→ Technical preparation, not visible to the user
```

**Step P2: PrepareContextForEOM**

```text
Load into memory:
  - Account entity (lock for EOM processing)
  - AccountParameters: CREDIT_LIMIT=18.5M, BILLING_DAY=20, DUE_DAY_OFFSET=16
  - ContractServices: ACCMAINT, ACCSTMT, PAYM, LIFEINS (active)
  - Tariff: STANDARD_2025 (illustrative name — actual: short code e.g. "SVCFEE"), version 4
  - AccountFeeComponentType mappings
  - Outstanding PostingUnits (not yet fully prescribed)
  - PeriodBalanceSnapshot from February (previous period snapshot)
```

**Step P3: the main EOM logic**

```text
billingBatchProcessingService.processEOMForRevolvingAccount(account, context)

─── 3.1 Delinquency check ──────────────────────────────────────────

  Instalment due 8/3: paid on 7/3
  DPD = 0 (no overdue instalment)

─── 3.2 Debt summary ───────────────────────────────────────────────

  Principal: 14,200,000 VND
  Unpaid interest: 0 (period 2 interest was paid in the 8/3 instalment)
  Unpaid fees: 0
  Total debt: 14,200,000 VND

─── 3.3 Interest calculation ───────────────────────────────────────

  Rate 18%/year, 30/360 convention → daily rate = 18% / 360 = 0.05%
  Days on 30/360 in the period 20/2 - 19/3: 30 days

  Interest-bearing principal by segment:
    20/2 - 4/3:   13,300,000 VND  (15 days)
    5/3 - 6/3:    15,800,000 VND  (2 days, after the 2,500,000 purchase)
    7/3 - 19/3:   14,200,000 VND  (13 days, after paying 1,800,000;
                                   the 3,000,000 of 18/3 not yet paired)

  Interest = (15 × 13,300,000 + 2 × 15,800,000 + 13 × 14,200,000) × 0.05%
           = 415,700,000 × 0.05%
           = 207,850 VND

  Create LedgerEntry: DEBIT 207,850, FeeComponentType=INTEREST_CASHLESS
  Create PostingUnit: applyIr=false (no interest on interest)
  outstandingDebt = 14,200,000 + 207,850 = 14,407,850 VND

─── 3.4 Fees ───────────────────────────────────────────────────────

  Account maintenance fee (already posted by eomServiceFeesJob):
    LedgerEntry: DEBIT 50,000, FeeComponentType=SVCFEE
  Insurance premium:
    LedgerEntry: DEBIT 90,000, FeeComponentType=LIFEINS

  Total fees this period: 140,000 VND
  outstandingDebt = 14,407,850 + 140,000 = 14,547,850 VND

─── 3.5 Minimum payment (MMI) ──────────────────────────────────────

  Contract parameter: MMI_LIMIT = 1,800,000 VND
  5% of the balance: 5% × 14,547,850 = 727,393 VND
  MMI = MAX(1,800,000, 727,393) = 1,800,000 VND

─── 3.6 Billing period update ──────────────────────────────────────

  Account.billingPeriod: BP_20 (unchanged, a fixed day of the month)
  PeriodBalanceSnapshot.billingPeriodNumber: 2 → 3
  LastEOMDate = 2025-03-19

─── 3.7 Instalment creation (prescribing) ──────────────────────────

  PostingUnits not yet prescribed:
    Account maintenance fee:  50,000
    Insurance premium:        90,000
    Period 3 interest:       207,850
    Principal:            14,200,000

  Priority order from the tariff (PRIORITY_ONLY): fees → interest → principal
  Due date: 20/3 + 16 days = 5/4

  Create REGULAR instalments until the MMI of 1,800,000 is reached:
    R-001: fees             140,000
    R-002: interest         207,850
    R-003: principal      1,452,150  → total reaches 1,800,000, stop
  The remaining principal of 12,747,850 is prescribed in later periods.

  InstalmentSummary:
    DueDate: 5/4, Type: REGULAR, Amount: 1,800,000 VND

─── 3.8 Overpayment pairing ────────────────────────────────────────

  CustomerCredit: 3,000,000 VND (the 18/3 payment)
  Pending instalments: 1,800,000 VND (just created)

  Pairing:
    R-001 (140,000)   → FULLY PAIRED, credit left 2,860,000
    R-002 (207,850)   → FULLY PAIRED, credit left 2,652,150
    R-003 (1,452,150) → FULLY PAIRED, credit left 1,200,000
  InstalmentSummary 5/4: repaid=true

  Update CurrentBalance:
    outstandingDebt = 14,547,850 - 1,800,000 = 12,747,850 VND
    customerCredit = 1,200,000 VND
    availableBalance = 18,500,000 - 12,747,850 + 1,200,000 = 6,952,150 VND

─── 3.9 Balance check ──────────────────────────────────────────────

  The balance recomputed from ledger entries matches CurrentBalance → OK
```

Two points stand out in this example. First, the instalment only takes up to the MMI: most of the principal remains and is prescribed gradually in later periods, which is the nature of revolving credit. Second, thanks to the extra payment on 18/3, the instalment due 5/4 is paid the moment it is created. Lan has nothing to pay before 5/4.

### The period 3 PeriodBalanceSnapshot

```text
W1 Writer: StoreEOMResultsItemWriter

CREATE LAS_PERIOD_BALANCE_SNAPSHOT:
  account_id: [ID of ACC-2025-789456]
  billing_period_number: 3
  period_start: 2025-02-20, period_end: 2025-03-19
  due_date: 2025-04-05
  start_balance: 13,500,000   (opening balance)
  end_balance: 12,747,850     (closing balance, after EOM)
  per_interest: 207,850       (interest this period)
  per_fee: 140,000            (fees this period: account maintenance + insurance)
  per_payments: 4,800,000     (payments in the period: 1,800,000 + 3,000,000)
  own_funds: 1,200,000        (the customer's credit balance)
  prescribed_instalment: 1,800,000
  day_past_due: 0
  billing_run → link to the BillingRun
  previous_period_balance_snapshot → link back to period 2
  cancelled: false
```

This is the immutable snapshot of period 3, used to generate the statement, report to the regulator, audit and answer questions about history. The figures can be checked: the opening balance of 13,500,000 plus the 2,500,000 purchase, 207,850 of interest and 140,000 of fees, less the 1,800,000 paired on 7/3 and the 1,800,000 paired at EOM, gives exactly 12,747,850.

:::summary[Section 9.3]
EOM processes each account through nine steps in a fixed order: delinquency, debt, interest, fees, MMI, period update, instalment creation, credit balance pairing, balance check. Interest is calculated on each balance segment in the period. The MMI caps the amount prescribed; the rest carries over to later periods. Money the customer paid early is paired at once with the newly created instalment. `PeriodBalanceSnapshot` is the immutable snapshot of the period.
:::

## 9.4 Generating the statement: from figures to document {#94-tạo-sao-kê-từ-con-số-đến-tài-liệu}

### The STS module

::::story
At 4:30 a.m., EOM finishes processing Lan's account. LAS publishes an event through RabbitMQ, STS receives it and starts generating her period 3 statement.
::::

STS receives from LAS:

```text
AMQPEvent from LAS:
  accountId: [ID]
  accountNumber: "ACC-2025-789456"
  billingPeriodNumber: 3
  billingDate: "2025-03-20"
  periodBalanceSnapshotId: [ID of snapshot just created]
  dueDate: "2025-04-05"
  mmiAmount: 1,800,000
```

Then it assembles the statement from several sources:

```text
1. PeriodBalanceSnapshot (snapshot from LAS):
   → Opening balance, closing balance, fees, interest
   
2. Transaction history (events from LAS via Kafka):
   → List of all transactions in the period: dates, amounts, types
   
3. Instalment schedule (from LAS):
   → Next period instalments, amounts, due dates
   
4. Account information (from LAS + CIS):
   → Account number, customer name (from CIS), credit limit
   
5. Product terms (from PDC):
   → Interest rate, APR, payment terms for disclosure
```

### Mandatory statement content

A statement is a legal document. Disclosure rules in many markets require a revolving credit statement to include the following items; here is Lan's period 3 statement:

```text
1. OPENING BALANCE
   13,500,000 VND

2. TRANSACTIONS
   05/03  Fashion Store          PURCHASE       2,500,000 VND
   07/03  Bank transfer          PAYMENT       -1,800,000 VND
   18/03  Bank transfer          PAYMENT       -3,000,000 VND

3. INTEREST AND FEES (each type shown separately)
   Interest 20/02 - 19/03:                      207,850 VND
   Account maintenance fee:                      50,000 VND
   Insurance premium:                            90,000 VND

4. CLOSING BALANCE
   11,547,850 VND
   (= opening + purchases + interest and fees - payments)
   Made up of a 12,747,850 VND balance less a 1,200,000 VND credit

5. MINIMUM PAYMENT
   Minimum payment this period: 1,800,000 VND
   Already paid from the credit balance
   Amount still to pay before 05/04/2025: 0 VND

6. INTEREST RATE AND COST OF CREDIT
   Interest rate: 18%/year (0.05%/day on the 30/360 convention)
   APR: per the regulator's formula, including every mandatory fee

7. IF YOU PAY ONLY THE MINIMUM
   If from next period you pay only the minimum and spend nothing more:
   Time to repay in full: about 8 months
   Additional interest payable: about 742,000 VND
   Additional fees payable: about 1,120,000 VND

8. AMOUNT TO REPAY IN FULL
   11,547,850 VND
   (plus interest accrued from 20/03 to the payment date)

9. COMPLAINTS
   Hotline, email and the complaint deadline

10. NEXT STATEMENT DATE
    20/04/2025
```

Item 8 differs from settling an instalment loan: with revolving credit, the amount to repay in full is the current balance plus interest accrued to the payment date, with no fixed schedule to compare against. With an instalment loan, the settlement amount comprises the remaining principal, interest accrued since the last instalment and any prepayment fee; it can be calculated with the [early settlement calculator](/docs/tools#early-settlement).

Item 7 is calculated by simulating repayment from the closing balance: each month add 1.5% interest on the balance and 140,000 VND of fees, and subtract a minimum payment of MAX(1,800,000, 5% of the balance).

Item 7 is behavioural economics written into regulation. The "if you pay only the minimum" information is mandatory in the UK and many other markets, to counter the present bias and anchoring analysed in [Chapter 4](/docs/products/ch04-customer-journey): when customers see clearly the time and cost of paying only the minimum, they have a better basis for deciding. With a large debt and a low MMI, the figure can be startling, as in the 85-month example of [Chapter 3](/docs/products/ch03-product-design). In VLP, STS calculates this item from the closing balance, the interest rate and the MMI rule, and puts it on the statement.

### Delivery channels and timing

```text
Channel 1: In-App (highest priority)
  → Push notification when the statement is ready
  → Deep link to the statement screen
  → Timing: right after STS generates it (4:30-7:00 a.m.)

Channel 2: Email
  → HTML email with a summary + a link to the app/portal
  → Timing: 6:00 a.m. (once all EOM is done)
  → Avoid sending at 3 a.m. (spam filters, user experience)

Channel 3: SMS
  → Short message: "Your March statement is ready. Amount due: 1,800,000 VND before 05/04"
  → Timing: 7:00 a.m.
  → Only the amount and due date (not the full statement — privacy)

Channel 4: Paper (opt-in)
  → Printed and mailed
  → Timing: T+2 after the billing date
  → Less common but still required for some segments
```

The delivery scheduling logic:

```java
// illustrative pseudo-code — STS delivery internals not verified
// verified: stm-cos-rse-internals.md
// STS entity: STS_STATEMENT (fields: cabinetUUID, state: NEW→XML_GENERATED→PDF_GENERATED)
// Trigger: RabbitMQ EOM_FEE event from LAS (NOT a direct method call)
// Delivery: Delivery entity with DeliveryState + DistributionChannel
// Timing (6h email, 7h SMS): CANNOT_VERIFY from codebase

// Conceptual illustration of delivery scheduling logic:
public void scheduleDelivery(Statement statement) {
    // In-app: ngay khi ready
    deliveryService.deliverInApp(statement, LocalDateTime.now());
    // Email: timing managed by Delivery entity (exact time not verified)
    // SMS: timing managed by Delivery entity (exact time not verified)
}
```

Sending email at 6 a.m. rather than 3 a.m. is an experience decision: the message arrives as the customer starts the day, and is less likely to be flagged by spam filters. The SMS carries only the amount and due date, not the full statement, for privacy reasons.

### The statement is an immutable document

```text
Once a statement has been delivered, it cannot be changed.

If an error is found AFTER delivery:
  → Do not update the statement already sent
  → Issue a "Revised Statement" with:
     - A reference to the original statement
     - An explanation of the change
     - The revised figures
  → Notify the customer of the revision

Why immutable:
  1. The customer has received it and may have printed/screenshotted it
  2. A legal document — adjustments must be clear and transparent
  3. Audit trail: what was the statement at time T?
```

:::summary[Section 9.4]
STS assembles the statement from the `PeriodBalanceSnapshot`, the transaction history, the repayment schedule and product information. The statement has ten mandatory items, including the consequences of paying only the minimum. It is delivered through the app as soon as it is ready, by email at 6 a.m., by SMS at 7 a.m. and on paper if the customer opts in. A delivered statement is never edited; if it is wrong, the company issues a revised statement.
:::

## 9.5 Due dates and payment pairing {#95-ngày-đến-hạn-và-ghép-thanh-toán}

### When the payment arrives first

::::story
At 6:30 a.m. on 20 March, Lan receives her statement. The minimum payment is 1,800,000 VND, due 5/4. But she transferred an extra 3,000,000 VND on 18/3, before EOM. What happened?
::::

```text
Lan pays 3,000,000 VND (18/3) before the instalment is created (EOM 19/3)

After instalments are created at EOM:
  CustomerCredit = 3,000,000 VND (waiting to be paired)
  REGULAR instalment: 1,800,000 VND (due 5/4)

Credit balance pairing (EOM step 3.8):
  3,000,000 → 1,800,000 (paid in full)
  Remaining: 1,200,000 → customerCredit

Result:
  InstalmentSummary 5/4: repaid=true (even before the due date)
  Account: current, nothing coming due
  CustomerCredit: 1,200,000 VND

Lan does not need to do anything on 5/4.
The statement says: "Your minimum payment has been paid. Amount still due: 0 VND."
```

The remaining 1,200,000 VND credit will be paired with next period's instalment when the EOM of 20/4 creates it.

### Paying on time and paying late

**Scenario A: Thu pays on time.** Thu is another customer, with a 1,800,000 VND instalment due on 5/4.

```text
Account after EOM: instalment due 5/4: 1,800,000 VND, unpaid

4/4, 14:30 — Payment of 2,000,000 VND (more than the MMI):
  1. Create Transaction: CREDIT 2,000,000
  2. Create LedgerEntry: CREDIT 2,000,000
  3. CustomerCredit += 2,000,000

  Pairing runs at once (payment event):
    CustomerCredit 2,000,000 → Instalment I-001 (1,800,000): FULLY PAIRED
    → I-001: repaid=true, repaidDate=4/4
    InstalmentSummary: all children repaid → repaid=true
    Remaining customerCredit: 200,000 VND

  Update CurrentBalance:
    outstandingDebt -= 1,800,000
    customerCredit = 200,000
    availableBalance rises by 2,000,000 (1,800,000 less debt + 200,000 credit)

5/4 — Due date:
  Check: InstalmentSummary due 5/4 → repaid=true → nothing to do
  DPD: still 0, no late fee
```

**Scenario B: Hoa pays late.**

```text
Account after EOM: instalment due 5/4: 1,800,000 VND unpaid

5/4 23:59 — No payment received.

6/4 00:00 — DPD counter update job:
  Check: InstalmentSummary due 5/4 → repaid=false
  DPD = 1 → account.dpdDaysCount = 1
  
  Trigger: LatePaymentEventProcessor
    Create LedgerEntry: DEBIT 200,000, FeeComponentType=LATEFEE1
    prescribeImmediately=true → EXTRA Instalment: 200,000 VND, due=6/4
    Push notification: "Your account is overdue. A late fee of 200,000 VND has been charged."
    Available credit falls by 200,000 VND (updatingAvailableAmount=true for LATEFEE1)

7/4 — Hoa pays 2,000,000 VND:
  Pairing (PRIORITY_ONLY):
    EXTRA instalment (late fee 200,000) → highest priority → paired first
    REGULAR instalment (1,800,000) → paired
    Total paired: 2,000,000 VND → all instalments repaid
    DPD cleared: account → CURRENT
    
  But: DPD=2 was already recorded (6/4 and 7/4)
  → The credit bureau report will carry this DPD information
  → Future credit decisions may be affected
```

Hoa's two days of delinquency have been recorded. Even though she paid in full straight after, this information may be reported to the credit bureau and affect future credit decisions.

### Partial payment

::::story
Hoa only has 1,000,000 VND. She pays it, but it is not enough to clear the instalments she owes.
::::

```text
Pending instalments (after the late fee of 6/4):
  EXTRA late fee: 200,000 VND (due 6/4, DPD 1)
  REGULAR: 1,800,000 VND (due 5/4, DPD 2)

Payment: 1,000,000 VND

Pairing (PRIORITY_ONLY):
  Step 1: EXTRA late fee (200,000) → paired: 200,000
    Payment remaining: 800,000
    Late fee: FULLY REPAID
  
  Step 2: REGULAR instalment (1,800,000) → partially paired
    Paired: 800,000
    Payment: EXHAUSTED
    Remaining unpaid: 1,000,000 VND

  InstalmentSummary 5/4:
    amount: 1,800,000
    paidAmount: 800,000
    repaid: false (still has unpaid children)

Account state:
  DPD: 2 (still overdue — instalment not fully paid)
  Outstanding partial debt: 1,000,000 VND
  Next day: DPD = 3, potential LATE2 fee (if configured in the tariff)

Collections trigger:
  DPD = 7 → collection SMS
  DPD = 30 → Stage 2 migration (IFRS 9)
  DPD = 90 → Stage 3 migration, write-off consideration
```

Why not split the 1,000,000 VND proportionally across the instalments?

```text
Option A: Distribute proportionally
  Late fee: 200,000/2,000,000 × 1,000,000 = 100,000
  Principal: 1,800,000/2,000,000 × 1,000,000 = 900,000
  Neither instalment fully repaid

Option B: PRIORITY_ONLY (VLP)
  Late fee: FULLY paid (200,000) → cleared
  Principal: 800,000 partially paid

Why B is better than A:
  Late fee cleared → the customer has one less obligation to track
  The customer may find the remaining 1,000,000 debt easier to manage
  Lender: late fee revenue recognized sooner
  Collections: a cleaner state (one obligation, not two partials)
```

The "easier to manage" argument above has merit, but remember the analysis in [Chapter 8, section 8.4](/docs/system/ch08-account-management): with an insufficient payment, the allocation order does not decide whether the account stops being overdue. It decides which item is paid first, and so which type of revenue is recognized sooner and which item keeps bearing interest. Paying the penalty first favours the lender's revenue; the 1,000,000 VND of principal remains overdue all the same.

:::summary[Section 9.5]
A payment made before EOM sits in the credit balance and is paired as soon as EOM creates the instalment. An on-time payment is paired at once and DPD stays at 0. A late payment makes DPD rise each day and creates an EXTRA instalment for the late fee. With a partial payment, the allocation order decides which item is paid first, not whether the account stops being overdue.
:::

## 9.6 Cycle integrity: when everything has to match {#96-toàn-vẹn-của-chu-kỳ-khi-mọi-thứ-phải-khớp-nhau}

### Three-way reconciliation

::::story
At 7 a.m. on 20 March, EOM is complete and the reconciliation job starts.

Reconciliation is not just "is the balance right?", but making sure three systems are consistent with each other.
::::

Three data sources must match:

```text
Source 1: LAS Database (Source of Truth)
  → LedgerEntry records (all debits and credits)
  → CurrentBalance (materialized view)
  → PeriodBalanceSnapshot (EOM snapshot)

Source 2: STS (Statement Management)
  → Statement data (what the customer was billed)
  → Statement items (transactions on the statement)

Source 3: DRG (Debt Register)
  → DPD tracking
  → Outstanding debt by category
  → Provision bucket (IFRS 9 stage)
```

The checks:

```text
Check 1: LAS ↔ PeriodBalanceSnapshot
  PeriodBalanceSnapshot.outstanding_debt_end
  == CurrentBalance.outstanding_debt (after EOM)
  
  Allowed gap: 0 VND (exact match required)

Check 2: LAS ↔ STS
  Sum of all LedgerEntries in the billing period
  == Statement total charges
  
  Allowed gap: 0 VND

Check 3: LAS ↔ DRG
  LAS.CurrentBalance.overdue_debt
  == DRG.DebtRegister.totalOverdueDebt (current record: validTo = UNREACHABLE_FUTURE_DATE)
  
  Allowed gap: small lag (milliseconds to seconds via Kafka + daily cron)
  DRG uses SCD Type 2 — must query WHERE validTo = UNREACHABLE_FUTURE_DATE

Check 4: Statement ↔ Payment records
  Total payments in the billing period (from LAS)
  == Total payment credits on the statement (from STS)
  
  Allowed gap: 0 VND

Check 5: Interest formula verification
  Recalculate interest from the daily balance history
  == Interest charged in the billing period
  
  Allowed gap: ±1 VND (rounding, after rounding standardization)
```

When reconciliation finds a difference:

```text
Gap < 1 VND (rounding):
  → Log, schedule a review
  → Auto-adjust if the rounding logic is documented

Gap 1-1,000 VND:
  → Alert the operations team
  → Suspend the affected account from new transactions
  → Investigate the same day

Gap > 1,000 VND:
  → Immediate alert (P1 incident)
  → Suspend the account
  → Freeze statement delivery (the statement might be wrong)
  → Incident response team

Gap at scale (> 1% of accounts have gaps):
  → A system-wide issue — a potential code bug
  → Consider a rollback
  → Regulatory notification may be required
```

The thresholds here are tighter than those of the daily balance reconciliation in [Chapter 8](/docs/system/ch08-account-management), because this is reconciliation right after EOM: an error at this point can go straight onto the customer's statement, so stopping statement delivery matters more than stopping transactions.

### Common discrepancies and their causes

**Type 1: balances drifting over time.**

```text
Symptom: The account balance is correct at EOM, but drifts slowly over months
Root cause: A missing event in the real-time processing pipeline

Example:
  Transaction confirmed at 11:59 PM → LAS processes it
  Event published to Kafka → midnight → the Kafka consumer processes it the next morning
  But DRG calculates DPD at midnight → misses this payment
  → DRG shows DPD=1 when the account was actually paid

Fix: Make sure the Kafka consumer processes with the right temporal semantics
     (event time, not processing time)
```

**Type 2: duplicate instalments.**

```text
Symptom: Two identical instalments for the same amount and due date
Root cause: EOM ran twice (or an on-demand EOM overlapped)

Scenario:
  The night EOM run: creates instalment I-001
  Ops triggered an on-demand EOM (thinking EOM had not run)
  On-demand EOM: creates instalment I-002
  → Duplicate!

Fix: A BillingRun check before EOM:
  "If the BillingRun for this period already has status=SUCCESS → skip"
  BillingRun.status: NEW → RUNNING → SUCCESS/FAILURE/TERMINATED
  *(PeriodBalanceSnapshot has no .status field)*
  → Idempotent EOM design
```

**Type 3: STS and LAS do not match.**

```text
Symptom: The statement shows a different amount from LAS
Root cause: Event delivery failure (LAS → RabbitMQ → STS)

Scenario:
  EOM creates the PeriodBalanceSnapshot
  LAS publishes an event → RabbitMQ
  Network blip → the event is delivered twice to STS
  STS processes the first event → statement created
  STS processes the second event → duplicate statement OR double-counting

Fix:
  STS must be idempotent — check periodBalanceSnapshotId:
  "If a statement for this periodBalanceSnapshotId already exists → skip"
  
  RabbitMQ DLQ for failed events → manual review
```

### Idempotent billing: running EOM twice safely

EOM is a critical operation, and there are times it has to be re-run: failing over to a standby server, fixing a bug, adjusting data. If EOM were not idempotent, re-running it would mean charging twice.

Idempotency at `BillingRun` level:

```java
@Transactional
public EOMResult processEOMForAccount(Account account, LocalDate billingDate) {

    // illustrative pseudo-code — actual idempotency mechanism differs
// verified: verify-ch8-ch9-code.md, am-core-entities-deep.md
// Note: PeriodBalanceSnapshot has NO .status field
//       Idempotency tracked via BillingRun.status (NEW→RUNNING→SUCCESS/FAILURE)
//       PeriodBalanceSnapshot has: simulationOnly (boolean), cancelled (boolean)

// Conceptual idempotency check:
    Optional<BillingRun> existingSession = billingRunRepo
        .findByBillingPeriodAndType(billingPeriod, REGULAR);

    if (existingSession.isPresent()) {
        BillingRunStatus status = existingSession.get().getStatus();
        if (status == SUCCESS) {
            // Đã process thành công → skip
            log.info("BillingRun SUCCESS for period {}. Skipping.", billingPeriod);
            return EOMResult.alreadyCompleted(existingSession.get());
        } else if (status == RUNNING) {
            // Another node is running → skip or wait
            return EOMResult.alreadyRunning();
        }
        // FAILURE/TERMINATED → allow re-run
    }

    // Process EOM... BillingRun status: NEW → RUNNING → SUCCESS/FAILURE
    return EOMResult.success(newBalance);
}
```

Idempotency in instalment creation:

```java
// illustrative pseudo-code — method names differ from actual
// verified: verify-ch8-ch9-code.md
// Note: findByAccountAndDueDateAndInstalmentType → NOT found in repository
//       InconsistencyException → actual class: DataInconsistencyException
//       (InstalmentFactory.java line 122)

// Conceptually correct — actual code implements similar idempotency logic:
List<Instalment> existing = instalmentRepo
    .findByAccountAndDueDate(account, dueDate);  // illustrative method name

if (!existing.isEmpty()) {
    BigDecimal existingTotal = existing.stream()
        .map(Instalment::getAmount).reduce(ZERO, BigDecimal::add);

    if (existingTotal.compareTo(expectedTotal) == 0) {
        return existing;  // Already prescribed → skip
    } else {
        log.error("Prescribing inconsistency for account {}: expected={}, existing={}",
            account.getAccountNumber(), expectedTotal, existingTotal);
        throw new DataInconsistencyException(...);  // Actual exception class
    }
}
```

The general principle: before creating something, check whether it already exists. If it exists and matches expectations, skip it; if it exists but does not match, stop and report an error, without guessing how to fix it.

:::summary[Section 9.6]
After EOM, three-way reconciliation checks that LAS, STS and DRG agree; a difference above 1,000 VND is a serious incident, with the account blocked and the statement held back. The common causes are duplicated or lost events, duplicate processing, and using processing time instead of event time. EOM is idempotent by checking the `BillingRun` status before running and checking whether an instalment exists before creating it.
:::

## Chapter 9 summary {#tổng-kết-chương-9}

One of Lan's billing periods:

```text
PERIOD 3 (20/2 - 19/3):
  20/2:  Start: balance 13,500,000; instalment of 1,800,000 due 8/3

  5/3:   Buys clothes for 2,500,000 VND
         → Authorization (hold) → Confirmation (debit)

  7/3:   Pays 1,800,000 VND → paired at once with the instalment due 8/3

  18/3:  Pays an extra 3,000,000 VND → credit balance, waiting to be paired at EOM

  19/3 23:00:  EOM
    Interest: 207,850 VND (30 days on 30/360)
    Fees: 140,000 VND (account maintenance + insurance)
    REGULAR instalment: 1,800,000 VND (due 5/4)
    Credit balance pairing: 1,800,000 → paid
    Remaining credit: 1,200,000 VND

  20/3 06:30:  Statement sent through the app
    Closing balance: 11,547,850 VND
    "Your minimum payment has been paid, 0 VND still due"

  5/4:   Due date → every instalment paid, DPD 0

PERIOD 4 starts with:
  Balance: 12,747,850 VND
  Credit balance: 1,200,000 VND
  Available balance: 6,952,150 VND
  Next statement date: 20/4, due 6/5
```

Period 4's due date is 6/5, because April has 30 days: 20/4 plus 16 days.

Every step has its reason. Calculating interest on each balance segment is fair and accurate. Creating instalments at EOM cleanly separates recording during the period from closing the period. Pairing credit balances as soon as an instalment exists rewards customers who pay early. Immutable statements preserve trust and the audit trail. Three-way reconciliation makes sure the whole system tells the same number.

## Review questions {#câu-hỏi-tự-kiểm-tra}

**Recall**

1. What are the three key dates of a billing period? What is the due-day offset for?
2. Why is interest calculated on each balance segment in the period rather than on the closing balance?
3. When a payment arrives before EOM and there is no instalment yet, how is the money handled? Why is it not paired immediately?
4. A statement is an immutable document. If an error is found after it has been sent, what must be done?

**Understand**

5. Why must the billing period be frozen while EOM is running? Give a concrete example of the conflict without this mechanism.
6. Why is DPD counted in calendar days rather than working days? What does that mean for customer experience and regulation?
7. What is three-way reconciliation between LAS, STS and DRG? If LAS and STS agree but DRG does not, where could the problem lie?
8. Why must the statement include an "if you pay only the minimum" item? Is it a requirement of behavioural economics, of regulation, or both?

**Apply**

9. An account has a billing day on the 15th, a due-day offset of 14 days, an opening principal balance of 25,000,000 VND, interest at 18% a year on the 30/360 convention, an account maintenance fee of 60,000 VND a month, an insurance premium of 100,000 VND a month and an MMI of 2,500,000 VND. During the period: a purchase of 3,000,000 VND on day 3, a purchase of 1,500,000 VND on day 10, and a payment of 4,000,000 VND on day 12 (no instalment pending). Assume the day 12 payment only reduces the balance when paired at EOM.
   (a) Calculate the period's interest (30 days).
   (b) Total fees.
   (c) The balance after EOM.
   (d) The REGULAR instalments created.
   (e) The amount the customer still has to pay after credit balance pairing.
10. An pays on time in January, late in February (DPD 8), and pays in full in March. What is the effect on (a) the IFRS 9 stage at the end of each month, (b) credit bureau reporting, (c) the provision each month, (d) An's interest rate in the future?

**Analyse**

11. A fintech proposes: "Real-time billing: every transaction immediately triggers interest calculation and instalment creation. No EOM batch. Simpler, faster." Analyse (a) the technical feasibility, (b) the business consequences for customer experience and revenue recognition, (c) the regulatory considerations, (d) when this approach makes sense.
12. After an incident, it is found that EOM ran twice for 500 accounts: the first run was thought to have failed, so the operations team re-ran it, but the first run had in fact partly succeeded. As a result, 500 accounts have duplicate instalments. Design the recovery: (a) a query to detect duplicate instalments, (b) an impact assessment: have customers already received their statements? (c) cancel the duplicates or merge them, (d) do customers need to be notified, (e) which architectural changes prevent a recurrence.

## Exercises {#bài-tập-áp-dụng}

**Exercise 1. Simulating three billing periods.** A revolving credit account has a limit of 30,000,000 VND, interest at 18% a year, a billing day on the 25th, a due-day offset of 15 days and an account maintenance fee of 70,000 VND a month. January: activation and a 20,000,000 VND disbursement on day 1, a 3,000,000 VND purchase on day 5, a 5,000,000 VND payment on day 20. February: a 2,000,000 VND purchase on day 10, a 2,500,000 VND payment on day 22. March: a 5,000,000 VND purchase on day 5, a 1,500,000 VND payment on day 20, less than the MMI. (a) Calculate interest, fees and instalments at each EOM. (b) The balance after each EOM. (c) Does the customer pay in full or short each month? (d) DPD and late fees, if any. (e) A summary of each month's statement. (f) The IFRS 9 stage over time.

**Exercise 2. Designing the reconciliation job.** Design a reconciliation job that runs daily after EOM, checking LAS, STS and DRG for every account that has just been through EOM, finishing within 2 hours before the branches open, with a summary report for the operations team and alerts at three severity levels. (a) The SQL query for each check, against a simplified schema. (b) The severity classification logic. (c) A decision tree: when to auto-fix, when a person needs to review. (d) How do you check 1.2 million accounts in 2 hours? (e) What does the report for the operations team need to contain?

**Exercise 3. Designing the statement system.** The company is redesigning its statement system with these requirements: deliver to 1.2 million customers within 3 hours of EOM, through app notifications, email, SMS and paper (5% of customers), with all ten mandatory items, each statement generated in under 500 ms. (a) The statement template system: how do you personalize 1.2 million statements efficiently? (b) Parallel processing for a throughput of 400 thousand statements an hour. (c) Coordinating the delivery channels so as not to overload the system. (d) If the email server goes down, what is the fallback? (e) How do you prove a customer received the statement in a dispute?

## Further reading {#đọc-thêm}

**Financial accounting**

- Weygandt, J., Kimmel, P. & Kieso, D. (2018). *Financial Accounting.* Wiley. The chapters on receivables and revenue recognition, the business foundation for designing billing systems.

**Designing disclosures**

- Consumer Financial Protection Bureau. *Know Before You Owe.* Credit disclosure forms and user testing research, at consumerfinance.gov. The design principles apply to statements.

**Batch processing**

- Minella, M. T. (2019). *The Definitive Guide to Spring Batch* (2nd ed.). Apress. The chapters on error handling, skip and retry, essential knowledge when implementing EOM.

Chapter 10 closes Part III with a subject nobody wants to think about but nobody can ignore: collections. When a customer cannot pay, what should the system do? Not just "demand the money", but run a process that balances the lender's interest, the customer's ability to recover and the legal constraints on how debt is collected. [Chapter 10. Debt management and collections](/docs/system/ch10-collections).
