---
title: "Glossary"
sidebar_label: "Glossary"
sidebar_position: 1
subtitle: "English - Vietnamese"
reading_time: 17
description: "The book's English-Vietnamese glossary: credit finance, risk management, behavioural economics, ML and the VLP modules, each entry with the chapters that explain it."
source_file: "phu-luc-b-glossary.md"
editorial_status: "edited"
lang: en
---

Each entry gives the English term, its Vietnamese equivalent, a short definition and the chapters that explain it in detail. Terms are sorted by their English name, since that is the name readers meet most often in documentation and source code.

## A {#a}

### Account Management

*Vietnamese: quản lý tài khoản*

The part of the system that manages the account lifecycle after the loan is disbursed: tracking balances, calculating interest, processing payments, producing statements. In VLP this is the LAS module.

Appears in: [Chapter 8](/docs/system/ch08-account-management).

### Adverse Selection

*Vietnamese: lựa chọn bất lợi*

When a product attracts a higher than normal share of risky customers. It happens when price does not distinguish risk: high-risk customers come because the price is cheap relative to their risk, and low-risk customers leave because it is expensive relative to theirs.

Appears in: [Chapter 1](/docs/foundations/ch01-credit-economics), [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

### Affordability Assessment

*Vietnamese: đánh giá khả năng chi trả*

The process of determining whether a customer can really repay the loan without undue difficulty, as distinct from checking eligibility. It covers income verification, listing existing obligations, a residual income check and a stress test.

Appears in: [Chapter 4](/docs/products/ch04-customer-journey), [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Alternative Data

*Vietnamese: dữ liệu thay thế*

Data that does not come from a traditional credit bureau: mobile operator data, e-wallet transactions, bill payment history, in-app behaviour. Used to score thin-file customers, and only with explicit consent.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Amortization

*Vietnamese: trả dần (khấu hao khoản vay)*

Paying down principal over time. With an equal-instalment loan, each instalment contains a portion of principal and a portion of interest; the interest share is largest at the start and the principal share grows over time.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

### AOS

*Supplement · Vietnamese: sản phẩm bổ sung*

The module managing add-on products attached to a loan contract (insurance, warranties, payment protection). Lifecycle: INITIAL → REGISTERED → ACTIVE → TERMINATED; activated when LAS emits the FIRST_PRINCIPAL_TX_CHARGED event.

Appears in: [Chapter 7](/docs/system/ch07-origination).

### APR

*Annual Percentage Rate · Vietnamese: lãi suất phần trăm năm*

The annual cost of credit, including every mandatory fee rather than just the nominal rate. In this book, APR = the monthly IRR × 12 (no compounding); the compounded measure is the EIR. Lan's loan has a nominal rate of 18% but an APR of 20.10% because of the 200,000 VND appraisal fee.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending), [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

### Auto-debit

*Vietnamese: trích nợ tự động*

A mechanism that automatically debits the customer's account on the due date. When direct debit is on by default (customers can turn it off), usage at Vela Finance is 82%, against 45% when customers have to sign up themselves.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## B {#b}

### Banking-as-a-Service

*BaaS · Vietnamese: ngân hàng như một dịch vụ*

A model providing financial infrastructure (licence, core banking, compliance) to third parties via API, so fintechs can build financial products without holding a banking licence themselves.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Behavioral Score

*Vietnamese: điểm hành vi*

A credit score calculated from behavioural data (app usage, payment habits, mobile operator data) rather than bureau data alone. Especially useful for thin-file customers.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring), [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### β-δ Model

*Quasi-hyperbolic discounting · Vietnamese: mô hình β-δ*

Laibson's (1997) model of present bias: every future benefit is discounted by an extra factor β < 1, while the present is not; δ is the ordinary time discount factor.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Billing Cycle

*Vietnamese: chu kỳ billing*

The monthly loop: interest and fees accrue, EOM creates the instalment and the statement, the payment falls due, the payment is received and matched, and DPD is tracked if it is unpaid.

Appears in: [Chapter 9](/docs/system/ch09-billing-cycle).

### BNPL

*Buy Now Pay Later · Vietnamese: mua trước trả sau*

A form of credit that lets people buy now and pay in instalments later, usually 3-6 instalments, often at a nominal 0% interest. Revenue comes from merchant fees and, in many markets, from a "processing fee" charged to the buyer.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Bureau

*Vietnamese: trung tâm thông tin tín dụng*

An organization that collects and provides credit histories. In Vietnam this is the CIC (National Credit Information Centre); internationally there are Experian, TransUnion and Equifax.

Appears in: [Chapter 4](/docs/products/ch04-customer-journey), [Chapter 11](/docs/intelligence/ch11-credit-scoring).

## C {#c}

### CAC

*Customer Acquisition Cost · Vietnamese: chi phí thu hút khách hàng*

The total cost of gaining a new customer: marketing, sales, file processing. CAC determines the minimum loan amount for a loan to be profitable.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### Calibration

*Vietnamese: hiệu chuẩn mô hình*

Checking whether predicted probabilities match actual rates. For example, customers with 420 points are predicted to have a PD of 2.4%; if their actual default rate is around 2.4%, the model is well calibrated.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### CLV

*Customer Lifetime Value · Vietnamese: giá trị vòng đời khách hàng*

The present value of the net profit a customer brings over the whole relationship: the sum over years of that year's profit times the probability the customer is still there, discounted to the present.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### Cognitive Load

*Vietnamese: tải nhận thức*

The mental effort needed to process information and make a decision. High cognitive load pushes people towards System 1 thinking and lowers the quality of financial decisions.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Collections

*Vietnamese: thu hồi nợ*

The process of contacting, negotiating with and recovering debt from overdue customers, from early reminders, payment arrangements and hardship support to litigation or debt sale.

Appears in: [Chapter 10](/docs/system/ch10-collections).

### Commitment Device

*Vietnamese: cơ chế cam kết*

A mechanism that lets people voluntarily limit their future choices to keep to their present intentions. Examples: a savings lock, a pledge to use a bonus to pay down debt.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Concentration Risk

*Vietnamese: rủi ro tập trung*

The risk of a portfolio depending too heavily on one sector, one employer or one region. When that point of concentration takes a shock, the whole portfolio is hit at once.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio), [Chapter 16](/docs/future/ch16-timeless-principles).

### ContractService

*Vietnamese: dịch vụ hợp đồng*

The entity linking an account to a tariff code and version, which determines the interest rate and fees applying to that account.

Appears in: [Chapter 8](/docs/system/ch08-account-management).

### Cost of Funds

*Vietnamese: chi phí vốn*

What the lender pays to raise the money it lends: bank borrowing costs, bond yields. The equity portion is accounted for through the target ROE. The book's examples use 8.5%/year for the debt portion.

Appears in: [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

### Credit Score

*Vietnamese: điểm tín dụng*

A single number summarizing a customer's credit risk, calculated from payment history, balances, length of credit history, credit mix and recent inquiries.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Credit Utilization

*Vietnamese: tỷ lệ sử dụng hạn mức*

The balance divided by the credit limit. A high ratio is a sign of financial stress; it is one of the components of the FICO score.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### CurrentBalance

*Vietnamese: số dư hiện tại*

The LAS entity tracking an account's current balance by type: principal, interest, fees, penalties.

Appears in: [Chapter 8](/docs/system/ch08-account-management).

## D {#d}

### 30/360

*30/360 day count · Vietnamese: quy ước ngày 30/360*

The interest convention used in VLP's examples: every month counts as 30 days and the year as 360, so one full month's interest = balance × annual rate / 12. Unlike Actual/365, which uses actual days. Configured through `AnnualRateDayCount.D30_360` in the tariff.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending), [Chapter 9](/docs/system/ch09-billing-cycle).

### Dark Pattern

*Vietnamese: mẫu thiết kế lừa dối*

An interface design that deliberately leads users towards decisions not in their interest: fake countdown timers, hidden fees, hard-to-find decline buttons.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Data Drift

*Vietnamese: drift dữ liệu*

A change over time in the distribution of input data. A PSI above 0.25 is a major change, and the model may no longer be valid.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Debt Stacking

*Vietnamese: chồng nợ*

A customer having several BNPL plans or loans with several providers, each of which sees only part of the picture. The real DTI is higher than any single provider knows.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Default

*Vietnamese: vỡ nợ*

Usually defined as DPD 90+ at any point in an observation window (e.g. 24 months). It can be stricter (write-off) or looser (DPD 30+) depending on the purpose.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Delinquency

*Vietnamese: quá hạn*

The state of a loan that is past due but not yet in default, usually DPD 1-89.

Appears in: [Chapter 10](/docs/system/ch10-collections).

### Disparate Impact

*Vietnamese: tác động bất lợi*

A policy that is neutral in form but affects a protected group disproportionately, even without any intent to discriminate.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### DPD

*Days Past Due · Vietnamese: số ngày quá hạn*

The number of days since the due date of the earliest unpaid overdue instalment. DPD 0 means current. A key metric for collections, loan classification and IFRS 9.

Appears in: [Chapter 9](/docs/system/ch09-billing-cycle).

### DSA

*Data Source Aggregator*

The module that aggregates data from many internal systems into XML for document generation (contracts, annexes). It is not a disbursement module. Plugin architecture with providers such as AgreementDataSourceProvider and ContractDataSourceProvider.

Appears in: [Chapter 7](/docs/system/ch07-origination).

### DTI

*Debt-to-Income · Vietnamese: tỷ lệ nợ trên thu nhập*

Total monthly debt obligations divided by monthly income. Lan's loan has a DTI of 7.7% (1,696,080 / 22,000,000).

Appears in: [Chapter 4](/docs/products/ch04-customer-journey), [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

### Dual-Process Theory

*Vietnamese: lý thuyết hai hệ tư duy*

Kahneman's framework: System 1 is fast, automatic and intuitive; System 2 is slow, deliberate and logical. Financial decisions are often driven by System 1.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## E {#e}

### EAD

*Exposure at Default · Vietnamese: dư nợ tại thời điểm vỡ nợ*

The amount still owed when the customer defaults. For an instalment loan, EAD is usually the remaining principal balance at that point, which is less than the original loan amount.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### Early Warning System

*Vietnamese: hệ thống cảnh báo sớm*

A system that detects customers at risk of not repaying before DPD appears, so intervention can start early, in tiers from a gentle reminder to hardship support.

Appears in: [Chapter 10](/docs/system/ch10-collections), [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Effective Interest Rate

*EIR · Vietnamese: lãi suất thực tế*

The compounded annual rate corresponding to the periodic IRR: EIR = (1 + monthly IRR)^12 − 1. Always higher than the APR (= monthly IRR × 12) when the IRR is positive.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

### EL

*Expected Loss · Vietnamese: tổn thất dự kiến*

EL = PD × LGD × EAD. The average expected loss, built into the product price: it is a priced-in cost, not a risk.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### Embedded Finance

*Vietnamese: tài chính nhúng*

Integrating financial products into non-financial platforms, so customers use credit in context (at checkout, when booking a service) without switching to a financial app.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### EMI

*Equated Monthly Instalment · Vietnamese: khoản trả góp đều hằng tháng*

The fixed amount paid each month, consisting of a portion of principal and a portion of interest, calculated with the PMT formula. Lan's loan has an EMI of 1,696,080 VND.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

### EOM

*End of Month · Vietnamese: xử lý cuối tháng*

The end-of-period batch job: calculating interest, creating instalments, charging fees, generating statement data, updating balances. In VLP it runs in parallel by partition.

Appears in: [Chapter 9](/docs/system/ch09-billing-cycle).

## F {#f}

### Feature Drift

*Vietnamese: drift của biến đầu vào*

A form of data drift: the distribution of an input feature changes over time, measured by the PSI of each feature.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Feature Engineering

*Vietnamese: xây dựng biến đầu vào*

Turning raw data into features suitable for a model: WOE transformations, ratios, time windows.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Feature Store

*Vietnamese: kho biến đầu vào*

Infrastructure for computing, storing and serving input features to models: centralized, versioned, point-in-time correct, consistent between training and serving.

Appears in: [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### FICO Score

*Vietnamese: điểm FICO*

The most widely used credit score in the US, from the Fair Isaac Corporation, on a 300-850 scale. Five groups of factors: payment history 35%, amounts owed 30%, length of history 15%, credit mix 10%, new credit 10%.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Fraud

*Vietnamese: gian lận*

Deliberately giving false information to obtain credit. Forms include application fraud, identity theft, synthetic identities, velocity fraud and AI-generated documents.

Appears in: [Chapter 4](/docs/products/ch04-customer-journey), [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

## G {#g}

### Gini Coefficient

*Vietnamese: hệ số Gini*

A measure of a credit model's discriminatory power: Gini = 2 × AUROC − 1, on a 0-1 scale. Above 0.45 is usually considered acceptable, above 0.60 good. Gini measures ranking ability, not the percentage of defaults explained.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Grace Period

*Vietnamese: thời gian ân hạn*

A period after the due date during which payment is still accepted without a late fee. Its length is a product configuration parameter.

Appears in: [Chapter 9](/docs/system/ch09-billing-cycle).

## H {#h}

### Hallucination

*Vietnamese: bịa thông tin (của LLM)*

When an LLM produces content that is wrong but sounds convincing. Especially dangerous in finance (wrong figures, wrong policies). Mitigated with RAG and the rule that every number must come from the database.

Appears in: [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### Hardship Program

*Vietnamese: chương trình hỗ trợ khó khăn*

Solutions for customers in financial difficulty: payment holidays, term extensions, temporary rate reductions. The aim is to help the customer cure and keep the relationship, rather than collecting at any cost.

Appears in: [Chapter 10](/docs/system/ch10-collections).

### Hyperbolic Discounting

*Vietnamese: chiết khấu hyperbol*

The tendency to overweight short-term benefits and costs relative to long-term ones. It explains why people "always plan to start saving next month". See the β-δ Model.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## I {#i}

### Idempotency

*Vietnamese: tính lũy đẳng*

Performing an operation once or many times gives the same result. Mandatory for payment APIs and batch jobs to avoid duplicate charges or disbursements.

Appears in: [Chapter 16](/docs/future/ch16-timeless-principles).

### IFRS 9

*International Financial Reporting Standard 9 · Vietnamese: chuẩn mực báo cáo tài chính quốc tế số 9*

The accounting standard for financial instruments, requiring provisions based on expected credit loss (ECL) in three stages: Stage 1 (performing, 12-month ECL), Stage 2 (significant increase in credit risk, lifetime ECL), Stage 3 (credit-impaired, lifetime ECL).

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### Infinispan

*Vietnamese: bộ nhớ đệm phân tán Infinispan*

A distributed in-memory cache. In VLP, LOS uses embedded Infinispan to hold workflow state between asynchronous steps, with 7 named caches: `zeebeChooseOfferCache`, `chooseOfferCache`, `loanPurposeCache`, `generateAgreementCache`, `signAgreementCache`, `rejectSupplementCache`, `cancelSupplementCache`.

Appears in: [Chapter 7](/docs/system/ch07-origination).

### Information Value

*IV · Vietnamese: giá trị thông tin*

A measure of a variable's predictive power in credit scoring. IV < 0.02: no value; 0.02-0.10: weak; 0.10-0.30: medium; > 0.30: strong; > 0.50: suspiciously strong, check for data leakage.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### InstalmentSummary

*Vietnamese: tổng hợp kỳ trả góp*

A denormalized aggregate entity in LAS summarizing an account's instalment plan. It may only be refreshed after every child instalment has been saved (see bug VLP-670 in Chapter 16).

Appears in: [Chapter 8](/docs/system/ch08-account-management).

### IRR

*Internal Rate of Return · Vietnamese: tỷ suất hoàn vốn nội bộ*

The discount rate at which the net present value of all cash flows is zero. Used to calculate the APR and EIR from the cash the customer actually receives and pays.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

## J {#j}

### Judgmental Lending

*Vietnamese: cho vay theo phán đoán*

Traditional lending based on a loan officer's judgement: inconsistent, unscalable, with hidden bias and no audit trail. Gradually replaced by statistical scoring.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

## K {#k}

### KS Statistic

*Kolmogorov-Smirnov · Vietnamese: chỉ số Kolmogorov-Smirnov*

The largest gap between the cumulative distributions of good and bad customers by score: KS = max(cumulative %Bad − cumulative %Good). KS > 30% is good.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

## L {#l}

### LGD

*Loss Given Default · Vietnamese: tỷ lệ tổn thất khi vỡ nợ*

The share of EAD the lender actually loses after recoveries: LGD = 1 − recovery rate. Typically 55-70% for unsecured consumer loans; the book's examples use 62%.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### LLM

*Large Language Model · Vietnamese: mô hình ngôn ngữ lớn*

An AI model trained on very large amounts of text that understands and generates text. In lending: document processing, customer service, knowledge management, always with guardrails against hallucination.

Appears in: [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### LOS

*Loan Origination Service*

The stateless loan origination orchestrator: it receives the application, calls the modules for checks, scoring and pricing, then creates the contract and account. Uses async controllers and Infinispan, not a BPMN engine, for the main flow.

Appears in: [Chapter 7](/docs/system/ch07-origination).

### Loss Aversion

*Vietnamese: né tránh mất mát*

Losses hurt more than equal gains please. As estimated by Tversky and Kahneman (1992), λ ≈ 2.25: losing 100,000 feels as bad as gaining about 225,000 feels good. Used when designing payment reminder messages, provided the numbers are true.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## M {#m}

### Mental Accounting

*Vietnamese: kế toán tâm lý*

The tendency to treat money differently according to its mental "account" (salary, bonus, savings). Bonus money is usually spent faster than the same amount of salary (Thaler).

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Model Risk

*Vietnamese: rủi ro mô hình*

The risk of using a wrong model, or using a right model wrongly: model errors, implementation errors, misuse. Governed by a three-layer MRM framework: development validation, independent validation, ongoing monitoring.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring), [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### Moral Hazard

*Vietnamese: rủi ro đạo đức*

When shielded from the consequences, people tend to take more risk. In lending: a borrower who has received the money may misuse it; a guaranteed lender may lend too recklessly.

Appears in: [Chapter 1](/docs/foundations/ch01-credit-economics).

## N {#n}

### Net Interest Margin

*NIM · Vietnamese: biên lãi ròng*

The difference between interest income from lending and the interest cost of funding, divided by average interest-earning assets. A basic measure of a lender's profitability.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### NPL

*Non-Performing Loan · Vietnamese: nợ xấu*

In Vietnam, debt in groups 3 to 5 under Circular 31/2024/TT-NHNN, essentially more than 90 days overdue. NPL ratio = NPLs / total loans.

Appears in: [Chapter 10](/docs/system/ch10-collections).

### Nudge

*Vietnamese: cú hích*

A small, non-coercive design intervention that steers behaviour in the desired direction. The default option is the most powerful nudge (Thaler and Sunstein, 2008).

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## O {#o}

### Open Banking

*Vietnamese: ngân hàng mở*

A framework letting customers share their financial data with third parties via API with consent, enabling better credit assessment and boosting competition. In Vietnam there is Circular 64/2024/TT-NHNN on Open API.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Optimism Bias

*Vietnamese: thiên kiến lạc quan*

The tendency to overestimate the chance of good things and underestimate the chance of bad things happening to oneself. Borrowers underestimate the risk of having difficulty repaying.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

## P {#p}

### Payment Holiday

*Vietnamese: hoãn thanh toán*

Letting the customer pause payments for a number of periods (usually 1-3 months), with due dates moved later. Whether interest keeps accruing or is waived depends on configuration (the `payholInterestWaiving` flag in VLP).

Appears in: [Chapter 10](/docs/system/ch10-collections).

### PD

*Probability of Default · Vietnamese: xác suất vỡ nợ*

The probability that a customer defaults within a given period. PD × LGD × EAD = EL.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio), [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### PMT

*Periodic payment · Vietnamese: khoản trả mỗi kỳ*

The amount paid each period on an equal-instalment loan: PMT = P × r(1+r)^n / ((1+r)^n − 1), where r is the periodic rate. Lan's loan: PMT = 1,696,080 VND, with the final instalment adjusted for rounding to 1,696,077.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

### Present Bias

*Vietnamese: thiên kiến hiện tại*

The tendency to overweight immediate benefits and costs relative to the future, leading to too much borrowing and too little saving. See the β-δ Model.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### Propensity Model

*Vietnamese: mô hình xu hướng*

An ML model estimating how likely a customer is to respond (accept an offer, buy a product). It should be combined with risk so as not to target people who are in a hurry.

Appears in: [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### Prospect Theory

*Vietnamese: thuyết triển vọng*

Kahneman and Tversky (1979): people judge outcomes as changes relative to a reference point, not by absolute value, and losses weigh more than equivalent gains.

Appears in: [Chapter 13](/docs/intelligence/ch13-behavioral-economics).

### PSI

*Population Stability Index · Vietnamese: chỉ số ổn định tập khách hàng*

A measure of distribution change between training data and current data. PSI < 0.10: stable; 0.10-0.25: moderate change, monitor closely; > 0.25: major change, review the model.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

## Q {#q}

### QST

*Quote Store*

The module that stores and manages the lifecycle of quotes produced by QCE. Its main entity is the SalesQuote with arrangements for amount, interest and fees. LOS calls QST to retrieve quotes; QST publishes CloudEvents via Kafka when a quote changes.

Appears in: [Chapter 7](/docs/system/ch07-origination).

## R {#r}

### RAG

*Retrieval-Augmented Generation*

An architecture combining an LLM with information retrieval: before answering, the system retrieves relevant documents and the LLM answers only from their content. Reduces hallucination, and makes answers consistent and sourced.

Appears in: [Chapter 15](/docs/future/ch15-ai-future-of-lending).

### Risk-Based Pricing

*Vietnamese: định giá dựa trên rủi ro*

Higher-risk customers pay higher rates, so that the price reflects expected loss. In VLP: Prime 15%, Standard 18%, Sub-prime 21%.

Appears in: [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

### ROE

*Return on Equity · Vietnamese: tỷ suất lợi nhuận trên vốn chủ sở hữu*

Profit divided by equity. The target ROE determines the profit component that must be in the interest rate (Chapter 12 uses 18% on 15% equity).

Appears in: [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

## S {#s}

### Scorecard

*Vietnamese: thẻ điểm*

The traditional scoring model: logistic regression on WOE-transformed variables, scaled to points with an anchor and a PDO. Easy to explain and favoured by regulators.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### SHAP

*SHapley Additive exPlanations*

A method of explaining a model's prediction by splitting it into additive contributions from each variable. The basis for generating specific rejection reasons.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### SRT

*Service Router*

A stateless routing module: it receives loan processing requests from LOS and forwards them to the backends (LAS, CTM, AOS, CTS, PDC, ADR, QST, LBS...) through 9 FeignClient connectors, with Resilience4j circuit breakers. It has no database of its own.

Appears in: [Chapter 7](/docs/system/ch07-origination).

### Stress Test

*Vietnamese: kiểm tra sức chịu đựng*

Assessing a portfolio or model under adverse scenarios: recession, a spike in unemployment, rising rates. The results determine the capital plan.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio), [Chapter 16](/docs/future/ch16-timeless-principles).

### Sub-prime

*Vietnamese: hạng dưới chuẩn*

The customer segment scoring below the Standard cut-off. In VLP: 340-379 points, 21%/year interest, lower maximum limits.

Appears in: [Chapter 12](/docs/intelligence/ch12-risk-based-pricing).

## T {#t}

### Tail Risk

*Vietnamese: rủi ro đuôi*

The risk of rare, extreme events. Ordinary risk management optimizes for the average; tail risk management focuses on surviving the worst case.

Appears in: [Chapter 16](/docs/future/ch16-timeless-principles).

### Tariff-Driven Design

*Vietnamese: thiết kế dựa trên biểu phí*

An architecture in which business rules (rates, fees, limits) live in versioned configuration with effective dates rather than being hard-coded, so they can change without a deployment.

Appears in: [Chapter 3](/docs/products/ch03-product-design), [Chapter 16](/docs/future/ch16-timeless-principles).

### Thin-File

*Vietnamese: hồ sơ tín dụng mỏng*

Customers with little or no credit history, who cannot be scored with traditional bureau data. They need alternative data or behavioural scores.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring), [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Time Value of Money

*Vietnamese: giá trị thời gian của tiền*

A dong today is worth more than a dong in the future because it can be invested to earn a return. The foundation of NPV, IRR and the annuity formula.

Appears in: [Chapter 2](/docs/foundations/ch02-mathematics-of-lending).

## U {#u}

### UL

*Unexpected Loss · Vietnamese: tổn thất ngoài dự kiến*

The amount by which actual losses can exceed EL. EL is covered by price; UL is covered by capital.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

### UNREACHABLE_FUTURE_DATE

*Vietnamese: ngày canh gác "không bao giờ tới"*

A far-future date used for records with no end date, so date range queries stay simple (`WHERE validTo >= :today`) instead of checking for NULL. In VLP: `AccountParameter.validTo` and `AccountService.endDate` use 3000-01-01 (`DateUtil.UNREACHABLE_FUTURE_DATE`, with NULL in the DB converted by `NullDateToFarFutureConverter`); `PostingUnit.firstPrescribeDate` uses 3333-01-01 for "not yet prescribed". Two different values for two different purposes, and confusing them is a classic source of query bugs.

Appears in: [Chapter 8](/docs/system/ch08-account-management), [Appendix A](/docs/appendices/a-architecture-reference).

## V {#v}

### Velocity Fraud

*Vietnamese: gian lận vận tốc*

Submitting many loan applications to many providers in a short time, before they can see each other's approvals. Detected through recent inquiry counts, shared blacklists and device fingerprinting.

Appears in: [Chapter 14](/docs/future/ch14-embedded-finance-bnpl).

### Vintage Analysis

*Vietnamese: phân tích theo vintage*

Tracking the performance of groups of loans by disbursement month, for example comparing the DPD 30+ rate after 6 months of the January cohort with February and March. Detects model drift and portfolio quality trends.

Appears in: [Chapter 5](/docs/products/ch05-revenue-portfolio).

## W {#w}

### WOE

*Weight of Evidence · Vietnamese: trọng số bằng chứng*

A transformation for scoring variables: WOE_i = ln(%Bad_i / %Good_i). Negative means the bin leans towards good customers, positive towards bad ones.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

### Write-off

*Vietnamese: xóa nợ (kế toán)*

The accounting decision to take a loan no longer expected to be recovered off the balance sheet, using the provisions already made. The threshold is a configuration parameter (e.g. DPD 90 for unsecured consumer loans). Write-off is not debt forgiveness: the obligation to repay remains and collection continues.

Appears in: [Chapter 10](/docs/system/ch10-collections).

## X {#x}

### XGBoost

*eXtreme Gradient Boosting*

A popular gradient boosting library for tabular data, usually giving high accuracy in credit scoring, handling missing values and training fast.

Appears in: [Chapter 11](/docs/intelligence/ch11-credit-scoring).

## Z {#z}

### Zeebe

*Vietnamese: engine workflow Zeebe*

A BPMN workflow engine (Camunda). In VLP it is used only for scoring in the `chooseOffer` step (the `zeebe-integration` profile), not as the main origination orchestrator. POSITIVE/NEGATIVE results are sent back to LOS via RabbitMQ.

Appears in: [Chapter 7](/docs/system/ch07-origination).

*The Glossary is extended when new terms appear in the book.*
