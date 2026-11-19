---
title: "Appendix C. Financial mathematics formulas"
sidebar_label: "Appendix C. Financial mathematics formulas"
sidebar_position: 2
reading_time: 12
description: "The formulas used in the book: time value of money, PMT and amortization schedules, IRR, APR, EIR, 30/360 accrued interest, expected loss and VaR, break-even rates, WOE, IV, score scaling, Gini, KS, PSI, CLV and collections metrics, each with a worked example."
source_file: "phu-luc-c-math-reference.md"
editorial_status: "edited"
lang: en
---

This appendix brings together the formulas used in the book, each with a worked example. Most examples use Lan's loan (18,500,000 VND, 18% a year, 12 months, payments in arrears), so the numbers here match the chapters. General conventions: the periodic rate $r$ is the annual rate divided by 12; PMT and each period's interest are rounded HALF_UP to the dong; the final instalment brings the balance to exactly 0. You can check the examples with the [calculators](/docs/tools).

## C.1 Time value of money {#c1-giá-trị-thời-gian-của-tiền}

### Present value and future value

$$
PV = \frac{FV}{(1+r)^n}, \qquad FV = PV \cdot (1+r)^n
$$

```text
Example: 1,000,000 VND received in 12 months, discounted at 1%/month
  (1.01)^12 = 1.126825
  PV = 1,000,000 / 1.126825 = 887,449 VND

Conversely: deposit 887,449 VND at 1%/month for 12 months
  FV = 887,449 × 1.126825 = 1,000,000 VND
```

### Net present value (NPV)

$$
NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}
$$

$CF_t$ is the cash flow in period $t$, positive when received, negative when paid out. NPV is 0 when $r$ equals the IRR of the cash flows (section C.3).

```text
Example: Lan's loan seen from Vela Finance's side
  t = 0:        −18,300,000   (18,500,000 disbursed, 200,000 appraisal fee retained)
  t = 1 … 11:   +1,696,080
  t = 12:       +1,696,077

  Discounted at 1.5%/month (the contract rate):    NPV ≈ +199,999 VND
  Discounted at 8.5%/12 (cost of debt, Chapter 12): NPV ≈ +1,146,044 VND
```

At the contract rate, the NPV is almost exactly the appraisal fee (off by 1 dong due to rounding): the interest only compensates for the time value of money at 18% a year. The NPV at the cost of debt is much larger, but it does not yet deduct expected loss, operating costs or the return on equity; section C.4 covers all of those components.

## C.2 Instalment payments {#c2-khoản-trả-góp}

### The periodic payment (PMT)

$$
PMT = PV \cdot \frac{r\,(1+r)^n}{(1+r)^n - 1}
$$

```text
Lan's loan: PV = 18,500,000, r = 0.015, n = 12
  (1.015)^12 = 1.195618
  PMT = 18,500,000 × (0.015 × 1.195618) / (1.195618 − 1)
      = 18,500,000 × 0.017934 / 0.195618
      = 1,696,079.87  →  1,696,080 VND/month (HALF_UP)
```

The derivation is in [Chapter 2, section 2.1](/docs/foundations/ch02-mathematics-of-lending#21-niên-kim-nền-tảng-của-mọi-tính-toán-trả-góp).

### The amortization schedule

$$
I_t = B_t \cdot r, \qquad P_t = PMT - I_t, \qquad B_{t+1} = B_t - P_t
$$

```text
Instalment 1:   Interest = 18,500,000 × 0.015 = 277,500    Principal = 1,418,580    Balance = 17,081,420
Instalment 2:   Interest = 17,081,420 × 0.015 = 256,221    Principal = 1,439,859    Balance = 15,641,561
…
Instalment 12:  Interest =  1,671,012 × 0.015 =  25,065    Principal = 1,671,012    Balance = 0
                Final payment = 1,671,012 + 25,065 = 1,696,077 VND
```

Interest falls and principal rises over time. The final instalment pays exactly the remaining balance plus interest, so instalment 12 is 3 dong less than PMT.

### Total interest

```text
Estimate:                  12 × 1,696,080 − 18,500,000 = 1,852,960 VND
From the amortization table: 1,852,957 VND (final instalment adjusted)

As a share of the loan amount: 1,852,957 / 18,500,000 ≈ 10.0%
```

The 10% is lower than 18% because the balance declines: the average balance over the 12 months is only about 10.3 million VND. The 10% figure is not an interest rate.

### Annuity due

$$
PMT_{due} = \frac{PMT_{ordinary}}{1 + r}
$$

```text
Lan's loan, paid at the start of each period: 1,696,079.87 / 1.015 = 1,671,015 VND
```

### Balloon payment

When part of the principal $B$ is paid in a lump sum at the final instalment, only the rest is amortized evenly:

$$
PMT = \left(PV - \frac{B}{(1+r)^n}\right) \cdot \frac{r\,(1+r)^n}{(1+r)^n - 1}
$$

```text
Example: 18,500,000 VND, 18%/year, 12 months, a 3,000,000 balloon at instalment 12
  Present value of the balloon = 3,000,000 / 1.195618 = 2,509,162
  Amount amortized evenly       = 18,500,000 − 2,509,162 = 15,990,838
  PMT = 15,990,838 × 0.091680 = 1,466,040 VND/month
  Instalment 12: 1,466,040 + the 3,000,000 balloon
```

### Partial prepayment

When the customer pays extra principal and keeps the same PMT, the term shortens and total interest falls.

```text
Example: Lan pays an extra 2,000,000 VND right after instalment 8, keeping PMT at 1,696,080
  Balance after instalment 8: 6,537,342 → 4,537,342
  The loan ends at instalment 11 (final instalment 1,275,735 VND) instead of 12
  Total interest falls by 116,422 VND
```

The full settlement amount at a given moment is the principal balance plus interest accrued to the settlement date and any early repayment fee; see the [early settlement calculator](/docs/tools#early-settlement).

## C.3 Interest rates and the cost of credit {#c3-lãi-suất-và-chi-phí-tín-dụng}

### Converting between monthly and annual rates

$$
r_{month} = \frac{i_{year}}{12}, \qquad EIR = (1 + r_{month})^{12} - 1
$$

```text
Nominal rate 18%/year → 1.5%/month
Effective annual rate:  (1.015)^12 − 1 = 19.56%
```

The rate written on a loan contract in Vietnam is the nominal annual rate; 19.56% differs only because of monthly compounding.

### IRR, APR and EIR

The periodic IRR is the solution of:

$$
0 = \sum_{t=0}^{n} \frac{CF_t}{(1 + IRR)^t}
$$

$$
APR = IRR_m \times 12, \qquad EIR = (1 + IRR_m)^{12} - 1
$$

IRR has no closed-form solution; find it by bisection or Newton-Raphson ($r_{k+1} = r_k - NPV(r_k)/NPV'(r_k)$), stopping when the step is smaller than about $10^{-8}$, then substitute the solution back into the equation to check it.

```text
Lan's cash flows:
  CF_0 = +18,300,000 (net of the 200,000 appraisal fee)

                                Monthly IRR   APR       EIR
  No fees                        1.500%     18.00%    19.56%
  Appraisal fee 200,000          1.675%     20.10%    22.06%
  Plus insurance 100,000/month   2.611%     31.34%    36.25%
```

Details are in [Chapter 2, section 2.2](/docs/foundations/ch02-mathematics-of-lending#22-irr-apr-và-eir-lãi-suất-thật-là-gì). A cap on the cost of credit, if any, must be checked against the APR or EIR exactly as defined by the applicable instrument, not against the nominal rate.

### Daily accrued interest

$$
I = B \times \frac{i_{year}}{D} \times d
$$

$B$ is the principal balance, $d$ the number of interest days, $D$ the denominator of the day count convention: 360 for 30/360 (VLP uses `D30_360`, every month counted as 30 days), 365 for actual/365 (actual days).

```text
Balance 17,081,420 VND (after Lan's instalment 1), 18%/year

  30/360, any month:            17,081,420 × 0.18 / 360 × 30 = 256,221 VND
  Actual/365, 31-day month:     17,081,420 × 0.18 / 365 × 31 = 261,135 VND
  Actual/365, 28-day month:     17,081,420 × 0.18 / 365 × 28 = 235,864 VND
```

Under 30/360, each month's interest equals exactly the interest in the amortization table. Under actual/365, interest varies with the length of the month, so an annuity schedule must either use a separate convention for periods or accept a larger difference in the final instalment.

## C.4 Credit risk and pricing {#c4-rủi-ro-tín-dụng-và-định-giá}

### Expected loss

$$
EL = PD \times LGD \times EAD
$$

```text
One loan:  PD 5%, LGD 60%, EAD 15,000,000
  EL = 0.05 × 0.60 × 15,000,000 = 450,000 VND/year (3.0% of the balance)

Portfolio (Chapter 2):  100,000 loans × 15,000,000
  Total EAD = 1,500 billion VND
  EL        = 5% × 60% × 1,500 billion = 45 billion VND
```

### VaR and the capital buffer

$$
C \approx VaR_{99\%} - EL
$$

```text
Simplifying assumption: normally distributed losses, σ = 12 billion VND
  VaR 99% ≈ EL + 2.33σ = 45 + 2.33 × 12 = 72.96 billion VND
  Capital buffer ≈ 72.96 − 45 = 27.96 billion VND
```

Real credit loss distributions are right-skewed with fat tails, so the normal assumption underestimates VaR.

### The break-even rate

$$
i_{break\text{-}even} = CoF + EL\% + OpEx\% + ROE\% - Fees\%
$$

Every component is expressed as a percentage of the average balance per year. With a capital structure of 85% debt and 15% equity: $CoF = 85\% \times$ the cost of debt, $ROE\% = 15\% \times$ the target ROE.

```text
Vela Finance's Sub-prime tier (Chapter 12):
  Cost of funds        85% × 8.5%                    7.23%
  Expected loss        6.5% × 62% × EAD              3.86%
  Operating costs      origination 550,000 + servicing 8.28%
  Return on equity     15% × 18%                     2.70%
  Less appraisal fee   200,000                      −1.97%
  ────────────────────────────────────────────────────────
  Break-even rate                                   20.10%

  Prime: 12.46%    Standard: 14.12%    Sub-prime: 20.10%
```

### Price elasticity

$$
\varepsilon = \frac{\%\Delta Q}{\%\Delta P}
$$

```text
Example: the rate rises from 15% to 16% (a 6.67% price rise), applications fall 1.8%
  ε = −1.8% / 6.67% = −0.27 (inelastic)

  Gross annual interest income, 5,000 loans × 15,000,000:
    Before: 5,000 × 15,000,000 × 15% = 11.25 billion VND
    After:  4,910 × 15,000,000 × 16% = 11.78 billion VND (+4.7%)
```

A rise in gross income is not enough to conclude that the price rise pays off: you need to check which customers left. If those who left are mostly good customers, the PD of the remaining portfolio rises (adverse selection, [Chapter 1](/docs/foundations/ch01-credit-economics#12-thông-tin-bất-cân-xứng-vấn-đề-gốc-rễ)).

## C.5 Credit scoring {#c5-chấm-điểm-tín-dụng}

### WOE and Information Value

$$
WOE_i = \ln\frac{\%Bad_i}{\%Good_i}, \qquad IV = \sum_i (\%Bad_i - \%Good_i) \times WOE_i
$$

```text
Variable cb_max_dpd_12m, bin DPD = 0 (Chapter 11):
  6,000 accounts, 240 bad, 5,760 good; in total 800 bad, 9,200 good
  %Bad = 240 / 800 = 30.0%      %Good = 5,760 / 9,200 = 62.6%
  WOE = ln(30.0% / 62.6%) = −0.736
  IV contribution = (30.0% − 62.6%) × (−0.736) = 0.240

  IV of the whole variable (5 bins) = 0.509
```

A negative WOE means the bin leans towards good customers. The IV scale: below 0.02 no value, 0.02 to 0.10 weak, 0.10 to 0.30 medium, above 0.30 strong, above 0.50 check for data leakage.

### Logistic regression and score scaling

$$
z = \beta_0 + \sum_i \beta_i \cdot WOE_i, \qquad P(default) = \frac{1}{1 + e^{-z}}
$$

$$
Score = Offset + Factor \times \ln(odds_{good/bad}), \qquad Factor = \frac{PDO}{\ln 2}
$$

```text
The book's scale: 380 points at odds of 20 : 1, PDO = 40
  Factor = 40 / 0.6931 = 57.71
  Offset = 380 − 57.71 × ln(20) = 207.1

Lan: z = −3.688
  P(default) = 1 / (1 + e^3.688) = 2.4%     good/bad odds = 40 : 1
  Score = 207.1 + 57.71 × 3.688 = 420        → Standard tier (380 to 439)

Other points: 340 points ↔ odds 10 : 1 (P ≈ 9.1%); 440 points ↔ odds ≈ 57 : 1 (P ≈ 1.7%)
```

The tier cut-offs are in [Chapter 7](/docs/system/ch07-origination): Prime from 440, Standard 380 to 439, Sub-prime 340 to 379, below 340 rejected.

### Gini, KS and PSI

$$
Gini = 2 \times AUROC - 1, \qquad KS = \max_s \left| F_{bad}(s) - F_{good}(s) \right|
$$

$$
PSI = \sum_i (\%Actual_i - \%Expected_i) \times \ln\frac{\%Actual_i}{\%Expected_i}
$$

```text
Gini:  AUROC 0.72 → Gini 0.44;  AUROC 0.80 → Gini 0.60
KS:    the largest gap between the cumulative shares of bad and good customers by score
PSI:   %Expected is the distribution at training time, %Actual the current distribution
```

| Metric | Common benchmarks |
|---|---|
| Gini | above 0.45 acceptable, above 0.60 good |
| KS | above 30% good, above 40% very good |
| PSI | below 0.10 stable; 0.10 to 0.25 monitor; above 0.25 retrain |

These benchmarks are industry conventions, not regulations; each organization sets its own thresholds in its model risk management policy.

## C.6 Customer lifetime value {#c6-giá-trị-vòng-đời-khách-hàng}

$$
CLV = \sum_{t=1}^{T} \frac{p_t \times M_t}{(1+r)^t}
$$

$M_t$ is the net profit in year $t$, $p_t$ the probability that the customer is still borrowing in year $t$, $r$ the discount rate.

```text
Customer A (Chapter 3), r = 10%:
  Year 1: 800,000, certain
  Year 2: 1,100,000, probability 40%
  Year 3: 1,400,000, probability 25%

  CLV = 800,000/1.1 + 0.4 × 1,100,000/1.1² + 0.25 × 1,400,000/1.1³
      = 727,273 + 363,636 + 262,960
      = 1,353,869 VND
```

When evaluating a retention programme, only the additional CLV the programme creates should be compared with its cost.

## C.7 Collections {#c7-thu-hồi-nợ}

### Roll rate and cure rate

$$
Roll\ rate_{a \to b} = \frac{\text{Accounts in bucket } a \text{ this month that move to bucket } b \text{ next month}}{\text{Accounts in bucket } a \text{ this month}}
$$

```text
Example: 1,200 accounts at DPD 1-30 this month; next month:
  Back to current (DPD 0):    720   → cure rate 60%
  Still at DPD 1-30:          180   → 15%
  Moved to DPD 31-60:         300   → roll rate 25%
```

Multiplying the roll rates along a chain of buckets gives the probability of a path. With the matrix in [Chapter 2, section 2.3](/docs/foundations/ch02-mathematics-of-lending#23-mô-hình-rủi-ro-tín-dụng-định-lượng), the probability that a current account goes straight to the 90+ bucket in four consecutive months is 6% × 40% × 60% × 65% ≈ 0.94%. The full probability of default must also add the paths that move back and forth, so it is usually calculated by matrix multiplication.

### Expected recovery rate and LGD

$$
LGD = 1 - \sum_k p_k \times \text{recovery rate}_k
$$

```text
Example, undiscounted and before recovery costs:
  Paid in full          40% × 100% = 40%
  Partial settlement    35% ×  60% = 21%
  Recovered via court   15% ×  40% =  6%
  Debt sale             10% ×  10% =  1%
  ─────────────────────────────────────
  Expected recovery rate           = 68%
  LGD = 1 − 68% = 32%
```

The LGD used for pricing must be calculated on the present value of recoveries, after collection and legal costs, so it is usually higher than the undiscounted figure. The book uses an LGD of 60% to 62% for unsecured consumer lending.

## C.8 Quick reference {#c8-tham-chiếu-nhanh}

**Loan classification by days past due** (Circular 31/2024/TT-NHNN) and **specific provisioning rates** (Decree 86/2024/NĐ-CP):

| Loan group | Days past due | Specific provision |
|---|---|---:|
| Group 1, standard | under 10 days | 0% |
| Group 2, special mention | 10 to 90 days | 5% |
| Group 3, substandard | 91 to 180 days | 20% |
| Group 4, doubtful | 181 to 360 days | 50% |
| Group 5, loss | over 360 days | 100% |

Bad debt is debt in groups 3 to 5. The table summarizes only the days-past-due criterion; for the full classification conditions and provisioning method see [Appendix D](/docs/appendices/d-regulatory-reference).

**Figures used in the book's examples:**

| Quantity | Value |
|---|---|
| Lan's loan | 18,500,000 VND, 18%/year, 12 months |
| PMT, final instalment, total interest | 1,696,080; 1,696,077; 1,852,957 VND |
| Appraisal fee, APR | 200,000 VND; 20.10% |
| Score, PD, tier | 420 points; 2.4%; Standard |
| Cost of debt, capital structure, target ROE | 8.5%/year; 85% debt, 15% equity; 18% |
| LGD for unsecured lending | 60% to 62% |

**The rule of 72.** The number of years for an amount to double at $i$% a year, compounded annually, is approximately $72 / i$. At 18%: about 4 years (exactly $\ln 2 / \ln 1.18 \approx 4.19$ years).
