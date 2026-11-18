---
title: "About this book"
sidebar_label: "About this book"
sidebar_position: 3
description: "The financial ecosystem that runs through the book, its characters and how to read the system descriptions."
lang: en
---

## The book's ecosystem

The book follows Vela Finance and its lending platform, VLP. The business problems, design decisions and incidents discussed all belong to this system. So that readers always follow the same story, all chapters share one ecosystem:

| Entity | Role in the book |
|---|---|
| **Vela Finance** | The consumer finance company that lends to Ms. Lan |
| **Vela Lending Platform (VLP)** | Vela Finance's lending platform: more than twenty modules covering the full loan lifecycle |
| **Dong Hai Bank** | A commercial bank, used in examples about partner banks and funding |
| **Chợ Sao** | An e-commerce marketplace, partner in the BNPL examples (Chợ Sao PayLater) |
| **DiCùng** | A ride-hailing and food-delivery super app (DiCùng Pay, DiCùng Food), used for embedded finance |
| **Ví Mây** | An e-wallet with a small-ticket credit product (Ví Mây Credit) |
| **Bình Minh Finance, Phương Nam Finance** | Other consumer finance companies, used in competition examples |

VLP is built on Java, Spring Boot, PostgreSQL, Kafka, RabbitMQ, Kubernetes and Zeebe. Modules are referred to by short names, for example LAS (Loan Account Service) for account management and LOS (Loan Origination Service) for origination; [Appendix A](/docs/appendices/a-architecture-reference) lists them all. Regulators, laws and standards such as the State Bank of Vietnam, the National Credit Information Center (CIC), IFRS 9 and Basel are referred to by their actual names.

## Characters

| Character | Role |
|---|---|
| Ms. Lan | Customer, 28, accountant in Hanoi. Her 18,500,000 VND loan is the central example |
| Mr. Minh | Product Owner, asking questions about product, risk and customer experience |
| Tuấn, engineer | Software engineer who turns business rules into code |
| Mrs. Hương | Chief Financial Officer, looking at loans from the perspective of portfolio, capital and profit |

## What VLP does and what the industry does

The book keeps two things apart. When it describes VLP, it describes how the system runs today. When a practice is industry "best practice" that VLP does not have yet, the book says where VLP stands and presents a proposed design, so readers can see the gap and the reasons for it.
