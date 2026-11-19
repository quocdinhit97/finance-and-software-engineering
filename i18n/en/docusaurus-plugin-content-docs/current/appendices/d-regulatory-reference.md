---
title: "Appendix D. Regulatory reference"
sidebar_label: "Appendix D. Regulatory reference"
sidebar_position: 3
reading_time: 8
description: "A summary of the legal framework for consumer lending in Vietnam (credit institutions, debt reminders, loan classification and provisioning, personal data, Open API) and international reference frameworks on cost disclosure, BNPL and consumer protection, with compliance checklists."
source_file: "phu-luc-d-regulatory.md"
editorial_status: "edited"
lang: en
---

:::caution[Not legal advice]
This appendix summarizes the legal instruments the book refers to, updated to November 2026. Legislation changes frequently: always check against the original instrument currently in force and consult your legal team before applying anything.
:::

## D.1 Vietnam: the legal framework for consumer lending {#d1-việt-nam-khung-pháp-lý-cho-vay-tiêu-dùng}

### The main instruments

| Instrument | Main content | Related chapters |
|---|---|---|
| Law on Credit Institutions 2024 (32/2024/QH15) | Organization and operation of credit institutions, including finance companies; retention of credit files | Ch.1, 10, 14 |
| Decree 86/2019/NĐ-CP | Charter capital: 500 billion VND for finance companies | Ch.14 |
| Circular 43/2016/TT-NHNN, amended by Circular 18/2019/TT-NHNN | Consumer lending by finance companies, including rules on debt reminders and debt collection | Ch.10, 14 |
| Circular 31/2024/TT-NHNN | Classification of assets (loan classification) for commercial banks and non-bank credit institutions; replaces Circular 11/2021/TT-NHNN from 1/7/2024 | Ch.5, 10 |
| Decree 86/2024/NĐ-CP | Provisioning rates and methods for risk provisions | Ch.5, 10 |
| Circular 23/2020/TT-NHNN (as amended) | Prudential limits and ratios for non-bank credit institutions, including the capital adequacy ratio | Ch.5 |
| Law on Personal Data Protection 2025 (91/2025/QH15) | Personal data protection, in force from 1/1/2026, replacing the framework of Decree 13/2023/NĐ-CP | Ch.6, 10, 11, 14 |
| Circular 64/2024/TT-NHNN | Implementing open application programming interfaces (Open API) in the banking sector, in force from 1/3/2025 | Ch.14 |
| Law on Electronic Transactions 2023 (20/2023/QH15); Decree 23/2025/NĐ-CP | Electronic contracts, electronic signatures | Ch.7 |
| Civil Code 2015 | Loan contracts; agreed interest (Article 468); a 3-year limitation period for contract disputes (Article 429) | Ch.10, 12 |
| Law on Investment 2020 | Debt collection services prohibited from 1/1/2021 | Ch.10 |
| Law on Protection of Consumers' Rights 2023 (19/2023/QH15) | Consumer rights, obligations to provide information | Ch.10, 13 |

### Consumer loan products of finance companies

Consumer borrowers are individuals borrowing for consumption purposes. The interest rate is agreed by the two parties in the contract. The Civil Code caps agreed interest at 20% a year unless another law provides otherwise, and lending by credit institutions is governed by the law on credit institutions; a finance company must check the framework that applies to each product with its legal team. Every fee must be listed in the contract; fees not in the contract may not be charged. Before signing, the customer must be given full information on the interest rate, fees and important terms, and must be notified of any changes during the life of the loan.

### Debt reminders and debt collection

Under Circular 18/2019/TT-NHNN amending Circular 43/2016/TT-NHNN, when collecting debts, finance companies:

| Rule | Content |
|---|---|
| Frequency | At most 5 debt reminders a day |
| Hours | Debt reminders only between 7:00 and 21:00 |
| People with no obligation to repay | No reminders, demands or debt collection information may be sent to organizations or individuals with no obligation to repay (relatives, colleagues, employers), except guarantors |
| Methods | No threats, no insults to honour or dignity |

In addition, the Law on Investment 2020 has prohibited debt collection services since 1/1/2021, so finance companies collect their own debts or sell them under the debt trading rules, rather than hiring debt collection companies. Chapter 10 analyses how these rules become rules in the collections system.

### Loan classification and provisioning

Under Circular 31/2024/TT-NHNN (the quantitative method), loans are divided into five groups by days past due; specific provisioning rates are set by Decree 86/2024/NĐ-CP:

| Group | Name | Days past due (basic) | Specific provision |
|---|---|---|---|
| 1 | Standard | Current or overdue less than 10 days | 0% |
| 2 | Special mention | Overdue 10 to 90 days | 5% |
| 3 | Substandard | Overdue 91 to 180 days | 20% |
| 4 | Doubtful | Overdue 181 to 360 days | 50% |
| 5 | Loss | Overdue more than 360 days | 100% |

Bad debt is debt in groups 3 to 5. Besides days past due, a loan may also be moved to another group because of a rescheduling of repayments and other criteria in the Circular; the table above covers only the basics. In addition to specific provisions there is a general provision. Loan classification information is reported to the National Credit Information Centre (CIC), and that is what other lenders see when they make an inquiry.

Note: provisioning under Vietnamese rules is based on loan groups, unlike the IFRS 9 ECL the book uses in its examples (Chapter 5). Companies applying IFRS 9 for consolidated reporting must still provision under the domestic rules.

### Capital adequacy ratio

Non-bank credit institutions, including finance companies, must maintain a minimum capital adequacy ratio of 9% (own capital against total risk-weighted assets), under Circular 23/2020/TT-NHNN as amended. The risk weight of each asset type is set by the Circular.

```text
Illustrative example (assuming a 150% risk weight for consumer loans):
  Loan of 15,000,000 VND
  Risk-weighted assets: 15,000,000 × 150% = 22,500,000
  Minimum capital: 22,500,000 × 9% = 2,025,000 VND

Consequences:
  More bad debt → higher provisions → lower profit and capital → a lower capital ratio
  Ratio below the minimum → capital must be raised or lending reduced
```

### Personal data protection

From 1/1/2026, the Law on Personal Data Protection 2025 is the main framework. The principles directly relevant to lending:

| Principle | What it means for a lending system |
|---|---|
| Clear purpose | Data may only be used for the purpose notified; using it for another purpose needs new consent |
| Minimization | Collect only the data needed for the purpose, not "just in case" |
| Limited retention | Delete once the purpose is fulfilled, unless the law requires retention (e.g. accounting vouchers, credit files) |
| Data subject rights | Access, correction, deletion (except where retention is legally required), objection, withdrawal of consent |
| Consent | Explicit, voluntary, not bundled into general terms of service |
| Buying and selling personal data | Prohibited |
| Transferring data abroad | Requires an impact assessment dossier and procedures with the competent authority |

For scoring with alternative data (mobile operators, e-wallets, bills), separate consent is needed for each type of data, clearly stating the purpose "to assess the loan application", and customers who refuse must still have their application considered in the normal way. Keeping data after the decision to train models needs a separate legal basis. Customers should be given an explanation of automated decisions and be able to request a human review (Chapter 11).

On domestic data storage, Decree 53/2022/NĐ-CP implementing the Law on Cybersecurity requires certain types of data about users in Vietnam to be stored in Vietnam. In practice, finance companies usually store customer data in data centres or cloud infrastructure located in Vietnam, and transfer abroad only aggregated or anonymized data. The weights of a trained model contain no personal data and may use global ML infrastructure; raw customer data may not.

## D.2 International reference frameworks {#d2-khung-tham-chiếu-quốc-tế}

| Market | Legal framework | Key points |
|---|---|---|
| US | Truth in Lending Act (Regulation Z); Equal Credit Opportunity Act (Regulation B); Fair Credit Reporting Act | Standardized APR disclosure (TILA); adverse action notices with specific reasons (ECOA/Reg B); notices when a credit report is used, including the score and up to four key factors (FCRA); prohibition of discrimination |
| EU | Revised Consumer Credit Directive (Directive (EU) 2023/2225), applying from 11/2026 | Standardized pre-contractual information; mandatory creditworthiness assessment; a 14-day right of withdrawal; BNPL within scope; the AI Act classifies individual credit scoring as high-risk |
| UK | FCA Consumer Duty (from 7/2023); BNPL (deferred payment credit) regulated from 15/7/2026 | Four outcomes: products, price and value, understanding, support; vulnerable customers (FG21/1); board accountability |
| Australia | National Consumer Credit Protection Act | Responsible lending obligations; BNPL within scope from 6/2025; hardship rules |
| Singapore | Moneylenders Act; industry BNPL code of conduct | A cap of 4%/month for licensed moneylenders; BNPL relies on a voluntary industry code |

| Market | BNPL regulatory status (11/2026) |
|---|---|
| Vietnam | No dedicated rules yet; the existing consumer lending framework applies |
| Australia | Credit under the NCCP from 6/2025 |
| UK | Regulated by the FCA from 15/7/2026 |
| EU | Within the revised Consumer Credit Directive |
| US | The CFPB issued and then withdrew an interpretation treating BNPL providers as card issuers |
| Singapore | An industry code of conduct |

## D.3 Compliance checklists {#d3-danh-mục-kiểm-tra-tuân-thủ}

### When launching a new product

```text
BEFORE LAUNCH:
□ Legal has reviewed the product terms
□ The APR has been checked, including EVERY fee (Chapter 2)
□ Interest and fees are within the applicable legal framework
□ The rejection notice template is ready
□ The affordability assessment process is documented
□ The data consent wording has been approved by Legal
□ CIC reporting is set up
□ The collections team is trained on the debt reminder rules (5 a day, 7:00-21:00)
□ The complaints handling process is documented
□ The system is ready for regulatory reporting

ONGOING COMPLIANCE:
□ Monthly: CIC reporting on time
□ Monthly: loan classification and provisioning
□ Quarterly: calculate and review the capital adequacy ratio
□ Quarterly: portfolio review (concentration, trends)
□ Annually: the annual report to the State Bank
□ Continuously: respond to inspection and supervision requests

WHEN REGULATIONS CHANGE:
□ Impact assessment within a few days of the instrument being issued
□ Identify and plan system changes (prefer configuration changes, Chapter 16)
□ A customer communication plan if terms change
□ Train front-line staff
□ Report compliance status to the Board
```

### When rejecting an application

Not every market requires rejection notices with reasons. In the US, ECOA and FCRA require specific reasons (not just "insufficient score"), the score used and the score range, up to four key factors that lowered the score, the name and contact details of the credit bureau, the right to dispute credit information and the right to a free credit report. Even where it is not mandatory, it is good practice: the system needs SHAP or an equivalent method for every rejection by a tier 1 model, a layer that turns SHAP values into human-readable reasons, delivery of the reasons through the app or by letter, and decision records kept for the credit file retention period. VLP currently receives only a binary result from the scoring process, so this part still has to be built (Chapter 11).

*Appendix D is updated when new legal instruments are issued. This is not legal advice.*
