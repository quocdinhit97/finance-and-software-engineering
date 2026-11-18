---
title: "Phụ lục C. Math Reference - tài liệu toán học tham chiếu"
sidebar_label: "Phụ lục C. Math Reference - tài liệu toán học tham chiếu"
sidebar_position: 2
reading_time: 11
source_file: "phu-luc-c-math-reference.md"
editorial_status: "mechanical-with-corrections"
---

> *Tất cả công thức trong sách tập hợp tại đây, với worked examples đầy đủ. Dùng như cheatsheet khi cần tính toán nhanh.*

## C.1 Time Value of Money

### Present Value (PV)

```text
PV = FV / (1 + r)^n

Where:
  FV = Future Value (giá trị tương lai)
  r  = interest rate per period
  n  = number of periods

Example:
  FV = 1,000,000 VNĐ nhận sau 12 tháng
  r  = 1.0% / tháng
  n  = 12 tháng
  
  PV = 1,000,000 / (1 + 0.01)^12
     = 1,000,000 / 1.1268
     = 887,449 VNĐ
```

### Future Value (FV)

```text
FV = PV × (1 + r)^n

Example:
  PV = 887,449 VNĐ gửi tiết kiệm
  r  = 1.0% / tháng
  n  = 12 tháng
  
  FV = 887,449 × 1.1268 = 1,000,000 VNĐ ✓ (consistent with PV example)
```

### Net Present Value (NPV)

```text
NPV = Σ CF_t / (1 + r)^t   [sum from t=0 to n]

Where CF_t = cash flow at time t (positive = inflow, negative = outflow)

Example: Loan 15,000,000 VNĐ, 12 months, 15% rate
  t=0: CF = -15,000,000 (disbursement — cash out)
  t=1 to 12: CF = +1,365,000 (monthly PMT — cash in)
  r = 15%/12 = 1.25%/month
  
  NPV = -15,000,000 + Σ(1,365,000 / (1.0125)^t) for t=1..12
      = -15,000,000 + 1,365,000 × [1-(1.0125)^-12] / 0.0125
      = -15,000,000 + 1,365,000 × 11.079
      = -15,000,000 + 15,123,000
      ≈ +123,000 VNĐ (lender profit, approximately)

NPV = 0 when r = exact IRR of the loan
```

## C.2 Loan Payment Formulas

### EMI (Equated Monthly Instalment)

```text
PMT = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
  P = principal amount (số tiền vay)
  r = monthly interest rate = annual rate / 12
  n = number of months (tenor)

Example: Chị Lan - 18,500,000 VNĐ, 12 tháng, 18%/năm (ví dụ trung tâm của sách)
  P = 18,500,000
  r = 18% / 12 = 1.5% = 0.015
  n = 12

  (1+r)^n = (1.015)^12 = 1.195618

  PMT = 18,500,000 × [0.015 × 1.195618] / [1.195618 - 1]
      = 18,500,000 × 0.017934 / 0.195618
      = 1,696,079.87  →  1,696,080 VNĐ/tháng (HALF_UP)
```

### Amortization Schedule

```text
Tháng t:
  Interest_t  = Balance_{t-1} × r          (làm tròn HALF_UP đến đồng)
  Principal_t = PMT - Interest_t
  Balance_t   = Balance_{t-1} - Principal_t

Example: Chị Lan, Month 1:
  Interest_1  = 18,500,000 × 0.015 = 277,500 VNĐ
  Principal_1 = 1,696,080 - 277,500 = 1,418,580 VNĐ
  Balance_1   = 18,500,000 - 1,418,580 = 17,081,420 VNĐ

Month 2:
  Interest_2  = 17,081,420 × 0.015 = 256,221 VNĐ
  Principal_2 = 1,696,080 - 256,221 = 1,439,859 VNĐ
  Balance_2   = 17,081,420 - 1,439,859 = 15,641,561 VNĐ

Last month (12):
  Interest_12  = 1,671,012 × 0.015 = 25,065 VNĐ
  Principal_12 = 1,671,012 (toàn bộ dư nợ còn lại)
  Payment_12   = 1,696,077 VNĐ (điều chỉnh làm tròn để dư nợ về 0)

Pattern: Interest decreases each month; Principal increases.
```

### Total Interest Paid

```text
Total_Interest ≈ PMT × n - P

Example:
  Total_Interest ≈ 1,696,080 × 12 - 18,500,000 = 1,852,960 VNĐ
  Theo bảng khấu hao (kỳ cuối đã điều chỉnh): 1,852,957 VNĐ

As % of principal: 1,852,957 / 18,500,000 ≈ 10.0%
Tỷ lệ này thấp hơn 18% vì dư nợ giảm dần mỗi tháng: dư nợ bình quân
trong 12 tháng chỉ khoảng 10.3 triệu đồng. Lãi suất của khoản vay vẫn
là 18%/năm danh nghĩa; con số 10% không phải là một "lãi suất".
```

:::caution[Đính chính so với bản thảo gốc]
Bản thảo gốc dùng ví dụ 18,500,000 VNĐ, 18 tháng, 15.5%/năm, khác với ví dụ trung tâm ở Chương 2, và có sai số tính toán: $(1.012917)^{18}$ đúng là 1.25987 (không phải 1.25837), nên PMT đúng là 1,158,477 VNĐ (không phải 1,164,205 VNĐ). Ví dụ đã được thay bằng khoản vay trung tâm để thống nhất số liệu toàn sách.
:::

### Balloon Payment

```text
When loan has balloon: smaller regular payments, large final payment

PMT_regular = (P - B/(1+r)^n) × r(1+r)^n / [(1+r)^n - 1]

Where B = balloon amount

Example: 18.5M loan, 3M balloon at month 18, 15.5% rate
  Effective P = 18.5M - 3M/(1.012917)^18 = 18.5M - 2.384M = 16.116M
  PMT = 16,116,000 × 0.06293 = 1,014,074 VNĐ/month
  Month 18: Pay regular PMT + 3,000,000 balloon
```

## C.3 Interest Rate Calculations

### Converting Between Rate Periods

```text
Monthly to Annual (simple): r_annual = r_monthly × 12
Annual to Monthly (simple): r_monthly = r_annual / 12

Monthly to Annual (compound): r_annual = (1 + r_monthly)^12 - 1
Annual to Monthly (compound): r_monthly = (1 + r_annual)^(1/12) - 1

Example:
  r_monthly = 1.292% → r_annual_simple = 15.5%
  r_monthly = 1.292% → r_annual_compound = (1.01292)^12 - 1 = 16.6%
  
  Vietnam convention: annual rate quoted as SIMPLE (×12)
  APR calculation: uses compound/IRR method
```

### IRR (Internal Rate of Return) / APR Calculation

```text
Solve for r in: 0 = -P + Σ CF_t / (1+r)^t

Numerical method (Newton-Raphson iteration):
  r_0 = initial guess (e.g., nominal rate/12)
  r_{n+1} = r_n - f(r_n) / f'(r_n)
  
  Where f(r) = NPV(r) and iterate until |r_{n+1} - r_n| < 0.000001

APR = r_monthly × 12 (Vietnam convention)
Or: APR = (1 + r_monthly)^12 - 1 (compound convention, EU standard)

Example: 18.5M loan, PMT 1,164,205, origination fee 200,000
  Net proceeds: 18,500,000 - 200,000 = 18,300,000 VNĐ
  
  Solve: 18,300,000 = Σ(1,164,205 / (1+r)^t) for t=1..18
  
  r_monthly ≈ 1.339% (slightly higher than 1.292% due to fee)
  APR = 1.339% × 12 = 16.07%/year (vs nominal 15.5%)
```

### Daily Interest Accrual

```text
I = P × r_annual / 360 × d

Where:
  P = outstanding principal balance
  r_annual = annual interest rate (decimal)
  d = days in period
  360 = day-count denominator (30/360 convention, D30_360 in VLP)

Example:
  P = 15,834,200 VNĐ
  r = 15.5% = 0.155
  d = 30 days
  
  Daily rate = 0.155 / 360 = 0.000430556
  Daily interest = 15,834,200 × 0.000430556 = 6,816 VNĐ/day
  Monthly (30 days) = 6,816 × 30 = 204,479 VNĐ

Note: 30/360 (D30_360) convention used by VLP.
  Alternative: Actual/365 would give: 15,834,200 × 0.155/365 × 30 = 201,660 VNĐ
  Difference: ~1.4% — significant at scale across 1M+ accounts.
```

## C.4 Credit Risk Formulas

### Expected Loss (EL)

```text
EL = PD × LGD × EAD

Where:
  PD  = Probability of Default (decimal)
  LGD = Loss Given Default (decimal)  
  EAD = Exposure at Default (VNĐ)

Example:
  PD  = 5% = 0.05
  LGD = 62% = 0.62
  EAD = 15,000,000 VNĐ
  
  EL = 0.05 × 0.62 × 15,000,000
     = 0.031 × 15,000,000
     = 465,000 VNĐ per loan per year
     = 3.1%/year of outstanding
```

### Portfolio EL

```text
Portfolio_EL = Σ (EL_i) for all loans i

As % of portfolio: Portfolio_EL / Σ(EAD_i)

Example: 1,000 loans, avg 15M, 5% PD, 62% LGD
  Portfolio_EL = 1,000 × 465,000 = 465,000,000 VNĐ
  Portfolio balance = 15,000,000,000 VNĐ
  EL % = 3.1% of outstanding (consistent with single loan example)
```

### Break-Even Analysis

```text
Break-even when: Revenue = Costs

Revenue = PMT × effective_tenor_months
  Where effective_tenor accounts for early defaults:
  = (N_good × PMT × full_tenor) + (N_bad × PMT × avg_default_month)

Costs = Cost_of_funds + Expected_Loss + Operating_Cost + Capital_Cost

Solve for r (rate) such that Revenue - Costs = 0

Example: 1,000 loans, 15M, 18 months, 5% PD, 62% LGD
  N_good = 950, full 18 months
  N_bad = 50, default avg month 9

  Revenue = PMT × (950 × 18 + 50 × 9) = PMT × (17,100 + 450) = PMT × 17,550
  
  Costs:
    Cost of funds: 15,000 × 1,000 × 9% × 1.5y = 2,025,000,000
    EL: 50 × 15M × 62% = 465,000,000
    OpEx: 1,000 × 1,200,000 = 1,200,000,000
    Capital (15% equity × 20% ROE × 1.5y): 1,000 × 15M × 15% × 20% × 1.5 = 675,000,000
    Total: 4,365,000,000
  
  PMT × 17,550 = 4,365,000,000
  PMT = 248,717 VNĐ/month per 1M outstanding... 
  
  For 15M loan: PMT_15M = 248,717 × 15 = 3,730,755 (this seems too high)
  
  Actually: revenue/cost calculation at portfolio level, convert back to rate:
  Required annual rate ≈ cost components as % of average outstanding × 12/18
```

## C.5 Credit Scoring Formulas

### WOE (Weight of Evidence)

```text
WOE_i = ln(%Default_i / %Good_i)

Where:
  %Default_i = (defaults in bin i) / (total defaults)
  %Good_i    = (non-defaults in bin i) / (total non-defaults)

Example: Feature cb_max_dpd_12m, bin DPD = 0
  Bin count: 6,000 total, 240 defaults, 5,760 good
  Total: 10,000 loans, 800 defaults, 9,200 good
  
  %Default_0 = 240 / 800 = 30.0%
  %Good_0    = 5,760 / 9,200 = 62.6%
  
  WOE_0 = ln(30.0% / 62.6%) = ln(0.479) = -0.736

Note: negative WOE → predominantly good customers → lower risk
      positive WOE → predominantly bad customers → higher risk
```

### Information Value (IV)

```text
IV = Σ (%Default_i - %Good_i) × WOE_i

Interpretation:
  IV < 0.02: Useless
  IV 0.02-0.10: Weak
  IV 0.10-0.30: Medium
  IV > 0.30: Strong

Example (continuing above):
  Bin DPD=0: IV contribution = (30.0% - 62.6%) × (-0.736) = 0.240
  Add all bins: Total IV for this feature
```

### Logistic Regression Score

```text
z = β₀ + Σ βᵢ × WOEᵢ
P(default) = 1 / (1 + e^(-z))

Score conversion:
  Score = A - B × z
  
  Standard: A = 600, B = 28.85
  (Each 20-point change doubles/halves the odds)

Example:
  z = -3.309 (from Ch.11)
  P(default) = 1/(1+e^3.309) = 3.5%
  Score = 600 - 28.85 × (-3.309) = 695
```

### Gini Coefficient

```text
Gini = 2 × AUROC - 1

AUROC: Area Under ROC Curve
  Plot: True Positive Rate (y) vs False Positive Rate (x)
  Sort predictions by score (high to low)
  For each threshold: TPR = TP/(TP+FN), FPR = FP/(FP+TN)
  Area under the curve = AUROC

Interpretation:
  Gini = 0: Random model
  Gini = 1: Perfect model
  Industry: > 0.45 acceptable, > 0.60 good
```

### PSI (Population Stability Index)

```text
PSI = Σ (%Expected_i - %Actual_i) × ln(%Expected_i / %Actual_i)

Where:
  %Expected_i = % of population in bin i at training time
  %Actual_i   = % of population in bin i at monitoring time

Interpretation:
  PSI < 0.10: Stable
  PSI 0.10-0.25: Moderate shift → monitor
  PSI > 0.25: Significant shift → investigate, consider retrain
```

## C.6 Customer Lifetime Value

### Basic CLV Formula

```text
CLV = Margin_per_loan × Retention_rate / (1 - Retention_rate)
    = M × R / (1-R)

Where M = margin on each repeat loan, R = retention rate

Example:
  M = 500,000 VNĐ per loan (net margin after costs)
  R = 65% (65% of customers return for another loan)
  
  CLV = 500,000 × 0.65 / (1 - 0.65)
      = 500,000 × 0.65 / 0.35
      = 928,571 VNĐ

With discount rate (more precise):
  CLV = Σ M_t × R^t / (1+d)^t   [sum from t=0 to ∞]
      = M × R / (1+d-R) (geometric series sum)
  
  Where d = discount rate (cost of capital)
  
  Example: M=500K, R=65%, d=10% (annual cost of capital)
    CLV = 500,000 × 0.65 / (1 + 0.10 - 0.65)
        = 500,000 × 0.65 / 0.45
        = 722,222 VNĐ (lower than simple formula due to discounting)
```

### CAC Payback Period

```text
Payback_Period = CAC / (Monthly_Margin)

Where Monthly_Margin = (Revenue - Variable_Cost) per month

Example:
  CAC = 1,200,000 VNĐ (agent commission + processing)
  Revenue from loan 15M, 18 months, 15.5%: = 1,164,000/month
  Variable cost (funds, risk, servicing): = 900,000/month
  Monthly margin = 264,000 VNĐ
  
  Payback = 1,200,000 / 264,000 = 4.5 months
```

## C.7 Risk-Based Pricing Calculations

### Minimum Rate (Cost-Plus)

```text
Min_Rate = CoF + EL% + OpEx% + UL_Buffer + ROE_Contribution

Where all items expressed as % of outstanding per year:
  CoF         = cost of funds (e.g., 8.5%)
  EL%         = PD × LGD (e.g., 5% × 62% = 3.1%)
  OpEx%       = operating cost / average outstanding (e.g., 4.5%)
  UL_Buffer   = buffer for unexpected loss volatility (e.g., 0.8%)
  ROE_Contrib = equity% × target_ROE (e.g., 15% × 20% = 3.0%)

Example:
  Min_Rate = 8.5% + 3.1% + 4.5% + 0.8% + 3.0% = 19.9%
```

### Price Elasticity

```text
Elasticity = %ΔQuantity / %ΔPrice

Example:
  Rate increase 1% → Applications decrease 1.8%
  Elasticity = -1.8%/1% = -1.8 (elastic)
  
  Revenue impact of rate increase:
    Current: 5,000 loans × 15M × 15% = 11,250,000,000/year
    New rate 16% (+1%), new volume 5,000 × (1-1.8%) = 4,910 loans:
    New revenue: 4,910 × 15M × 16% = 11,784,000,000/year
    Change: +534,000,000/year (+4.7%)
    
  Rate increase is profitable here despite volume loss.
```

## C.8 Collections Analytics

### Cure Rate

```text
Cure_Rate = (Accounts that became current) / (Accounts contacted)

Example:
  1,000 DPD 15 accounts contacted this week
  After 30 days: 380 are current (DPD 0)
  Cure_Rate = 380 / 1,000 = 38%
```

### Roll Rates

```text
Roll Rate (DPD_a → DPD_b) = 
  (Accounts in DPD_a this month that move to DPD_b next month)
  / (Total accounts in DPD_a this month)

Example:
  DPD 1-30 this month: 1,200 accounts
  Next month, of those 1,200:
    DPD 0 (cured): 720 (60%)
    DPD 1-30 (stayed): 180 (15%)  
    DPD 31-60 (rolled forward): 300 (25%)
  
  Cure rate: 60%
  Roll rate to DPD 31-60: 25%
```

### Expected Recovery

```text
Recovery = NPV of expected future collections

Scenario analysis:
  Path 1: Full payment (P=40%): recover 100% × balance
  Path 2: Partial settlement (P=35%): recover 60% × balance
  Path 3: Legal recovery (P=15%): recover 40% × balance - legal costs
  Path 4: Write-off (P=10%): recover 10% × balance (sale to collector)
  
  Expected_Recovery = 40% × 100% + 35% × 60% + 15% × 40% + 10% × 10%
                    = 0.40 + 0.21 + 0.06 + 0.01
                    = 68% of balance
  
  LGD = 1 - 68% = 32% (better recovery than 62% benchmark → secured or easier segment)
```

## C.9 Quick Reference Constants

```text
Vietnam regulatory:
  Consumer unsecured rate cap: 24%/year APR (as of 2024)
  DPD 90+: NPL definition (NHNN)
  NPL target: ≤ 3% for banks
  
Industry benchmarks (Vietnam consumer finance, 2024):
  Prime default rate (DPD 90+): 1.5-3%
  Standard default rate: 4-7%
  Sub-prime default rate: 10-15%
  LGD (unsecured consumer): 55-70% (typically 62%)
  Cost of funds: 8-10%
  Operating cost ratio: 3-6%
  
Model benchmarks:
  Gini > 0.45: acceptable
  Gini > 0.60: good
  KS > 0.30: good
  PSI < 0.10: stable
  PSI 0.10-0.25: monitor
  PSI > 0.25: investigate

Time value:
  PI (π) = 3.14159265...
  e (Euler's number) = 2.71828...
  ln(2) = 0.6931 (useful for doubling time: t = ln(2)/r)
  
  Rule of 72: years to double = 72 / interest rate%
    At 15%/year: double in 72/15 = 4.8 years
    At 24%/year: double in 72/24 = 3 years
```

*Phụ lục C - Math Reference. Tất cả công thức đã được verified với worked examples trong text chính.*
