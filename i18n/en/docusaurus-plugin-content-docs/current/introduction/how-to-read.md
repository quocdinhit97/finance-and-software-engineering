---
title: "How to read this book"
sidebar_label: "How to read this book"
sidebar_position: 2
description: "The five-part structure, the three content layers and the conventions used in the book."
lang: en
---

The book is organized in five parts, moving from foundations to applications. Each part answers one question.

| Part | Question | Chapters |
|---|---|---|
| [I. Foundations](/docs/foundations) | Why does credit work the way it does? | 1 and 2 |
| [II. Products](/docs/products) | What is a lending product made of? | 3 to 5 |
| [III. The System](/docs/system) | How does business logic become software? | 6 to 10 |
| [IV. Intelligence](/docs/intelligence) | Who to lend to, at what price, and how responsibly? | 11 to 13 |
| [V. The Future](/docs/future) | What changes, and what stays? | 14 to 16 |

## Three layers of content

Most sections are written in three layers. The **concept** layer explains what a financial mechanism is and why it exists, without any technical background. The **mechanism** layer covers formulas, processes, business rules and edge cases. The **implementation** layer shows how the mechanism becomes a domain model, tables, APIs, transactions and code.

Readers who do not program can skip the implementation layer and still follow the whole argument of the book. Developers should read all three: the implementation only makes sense once it is clear why the business requires it.

## One loan throughout the book

Ms. Lan, 28, an accountant in Hanoi, needs a laptop that costs 18,500,000 VND. She takes a consumer loan at a nominal rate of 18% per year for 12 months, repaid monthly. The loan first appears in Chapter 1 and is reused throughout: to compute the repayment schedule in Chapter 2, to analyze fees and the true cost of credit, to trace each processing step through the system in Part III, and to illustrate late payment, early repayment and settlement.

All figures for this loan are simulated.

## Conventions

Numbers use international notation: a comma as thousands separator and a point as decimal separator, for example 18,500,000 VND and 1.5% per month. This matches the code, spreadsheets and technical documents readers will meet when working with such systems.

Interest rates always state their period: "18% per year" is a nominal annual rate, "1.5% per month" is a periodic rate. When a figure is an APR or an EIR, the book names it explicitly, because the three concepts differ (see Chapter 2, section 2.2).

Code samples are trimmed to highlight the business logic; logging, error handling and secondary configuration are left out. Pseudocode is always labelled as pseudocode.

:::note[Translation status]
The English edition is in progress. The front matter, part introductions and calculators are available in English; chapters that have not yet been translated are shown in the original Vietnamese.
:::
