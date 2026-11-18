---
title: "About this book"
sidebar_label: "About this book"
sidebar_position: 3
description: "The fictional financial ecosystem used throughout the book, its characters and the editorial principles."
lang: en
---

## A fictional ecosystem

Every organization, system and character in this book is fictional. The business problems, design decisions and engineering lessons come from real experience with a consumer finance platform in production, but names, identifying details and proprietary information have been replaced.

So that readers always follow the same story, all chapters share one ecosystem:

| Entity | Role in the book |
|---|---|
| **Vela Finance** | The consumer finance company that lends to Ms. Lan |
| **Vela Lending Platform (VLP)** | Vela Finance's lending platform: more than twenty modules covering the full loan lifecycle |
| **Dong Hai Bank** | A commercial bank, used in examples about partner banks and funding |
| **Chợ Sao** | An e-commerce marketplace, partner in the BNPL examples (Chợ Sao PayLater) |
| **DiCùng** | A ride-hailing and food-delivery super app (DiCùng Pay, DiCùng Food), used for embedded finance |
| **Ví Mây** | An e-wallet with a small-ticket credit product (Ví Mây Credit) |
| **Bình Minh Finance, Phương Nam Finance** | Other consumer finance companies, used in competition examples |

Module names, table names, class names and fee codes of the original system have also been replaced by synonyms; for example, the account management module is LAS (Loan Account Service) and the origination module is LOS (Loan Origination Service). Technology names such as Java, Spring Boot, PostgreSQL, Kafka, RabbitMQ, Kubernetes and Zeebe are kept. Regulators, laws and public standards such as the State Bank of Vietnam, the National Credit Information Center (CIC), IFRS 9 and Basel are also kept.

## Characters

| Character | Role |
|---|---|
| Ms. Lan | Customer, 28, accountant in Hanoi. Her 18,500,000 VND loan is the central example |
| Mr. Minh | Product Owner, asking questions about product, risk and customer experience |
| Tuấn, engineer | Software engineer who turns business rules into code |
| Mrs. Hương | Chief Financial Officer, looking at loans from the perspective of portfolio, capital and profit |

## Source content and added content

The book distinguishes three kinds of content. Statements about how VLP behaves are based on documentation and source code that have been checked. "Best practice" passages describe how the industry usually works where VLP has not implemented it; these are marked. Background knowledge added by the editors to explain concepts is written as general knowledge and is never presented as system behavior.

Where a detail cannot be verified, the book says so instead of guessing.
