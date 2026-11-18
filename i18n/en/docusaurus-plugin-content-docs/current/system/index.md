---
sidebar_position: 0
title: "Part III. The System"
sidebar_label: "Overview"
description: "Architecture and implementation of a consumer lending platform: origination, account management, billing and collections."
lang: en
---

> *"Understand the product before building the system. Understand the system before writing code."*

This part answers the question "how". From here the book goes inside the Vela Lending Platform (VLP), the lending platform of Vela Finance. VLP has more than twenty modules and handles the full loan lifecycle from application to settlement.

Chapter 6 presents the architectural principles: ACID transactions, pessimistic locking, idempotency, audit trails, and how modules communicate. The next four chapters follow the loan lifecycle: origination (Chapter 7), account management and the billing engine (Chapter 8), the monthly billing cycle (Chapter 9), and delinquency management (Chapter 10).

:::note[About the code in this part]
The Java snippets in this part are trimmed to highlight the business logic. Logging, error handling and secondary configuration are left out, and some method signatures are simplified for readability.
:::

| Chapter | Main topics |
|---|---|
| [Chapter 6. Financial system architecture](/docs/system/ch06-financial-system-architecture) | ACID, locking, idempotency, audit trail, messaging, data infrastructure |
| [Chapter 7. Loan origination](/docs/system/ch07-origination) | Origination process, scoring, account creation and activation |
| [Chapter 8. Account management and the billing engine](/docs/system/ch08-account-management) | Domain model, transaction processing, month-end batch, production incidents |
| [Chapter 9. The billing cycle](/docs/system/ch09-billing-cycle) | 30/360 interest, statements, payment pairing, reconciliation |
| [Chapter 10. Debt management and collections](/docs/system/ch10-collections) | DPD, the Debt Register, payment holidays, write-off |
