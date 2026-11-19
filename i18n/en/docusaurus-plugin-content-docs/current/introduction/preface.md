---
title: "Preface"
sidebar_label: "Preface"
sidebar_position: 1
reading_time: 5
description: "Why the book connects credit economics with software engineering, why VLP is the system that runs through it, who the book is for and how to read it."
source_file: "loi-mo-dau.md"
editorial_status: "edited"
lang: en
---

## The gap between two worlds {#khoảng-trống-giữa-hai-thế-giới}

There are two kinds of books about finance.

The first kind is written by economists and finance professionals. They explain interest rates, credit risk and pricing models: concepts that are elegant and theoretically rigorous. But when a software engineer finishes reading and turns back to the screen, they still don't know how to write the code that calculates the right monthly interest for a million customers at once.

The second kind is written by software engineers. They talk about microservices, event-driven architecture and distributed systems: refined design patterns you can put to work straight away. But when a business analyst finishes reading and sits down in a meeting with a client, they still don't understand why a thirty-six-month loan is harder to implement than a twelve-month one, or why processing a transaction "in the past" is anything but a simple problem.

This book was written to fill that gap.

## Why VLP? {#vì-sao-là-vlp}

Throughout my research and work in consumer finance, I have found that nothing explains the field better than a system in operation. Theory is necessary, but theory does not show you why a small mistake in date handling can cause thousands of transactions to be wrongly rejected, or why deciding the order in which a customer's repayment is allocated is not just a technical problem but a problem of economic mechanism design.

The ecosystem that runs through this book, **VLP**, is a modern consumer finance platform of more than twenty modules, handling the entire credit lifecycle from the moment a customer applies to the moment the loan is settled. VLP is not a simplified example: the system runs every day, with all the complexity the credit business demands.

The data is simulated. But the problems, the design decisions and the lessons are all real.

## Who is this book for? {#cuốn-sách-này-dành-cho-ai}

The short answer: anyone who wants to truly understand how modern consumer credit works.

The longer answer:

**If you are a developer or software architect**, the book explains why financial systems are designed in ways that seem needlessly complex, and shows that most of that complexity comes from very specific economic and legal constraints, not from over-engineering.

**If you are a business analyst, Product Owner or Product Manager**, the book gives you a language for talking to both sides: enough financial economics to persuade stakeholders, and enough technical understanding to write requirements that don't get implemented wrongly.

**If you are a manager or business leader**, the book helps you understand why technology projects in finance are so expensive and take so long, and how to make better investment decisions.

**If you are new to the industry**, the book is a map. Not a detailed map of every alley, but a topographic overview, so you know where you stand and what is important to learn next.

## How to read this book {#cách-đọc-cuốn-sách-này}

The book is organized into five parts, moving gradually from foundations to applications:

| Part | Content | Question |
|---|---|---|
| I. Foundations | The economics and mathematics of credit | Why everything is designed the way it is |
| II. Products | Financial product design, the customer journey, revenue and the portfolio | What to build |
| III. Systems | Architecture and implementation: origination, account management, billing, collections | How to build it |
| IV. Intelligence | Scoring, pricing, behavioural economics | How to be smarter |
| V. The future | BNPL, AI and the timeless principles | What comes next |

Many sections of the book are written in three layers:

:::key
**Concept**: read straight through, no technical background needed.

**Mechanism**: goes deeper into the logic and the design decisions.

**Implementation**: technical detail and how VLP does it.
:::

You can read only the Concept layer and still get the complete picture, or read all three layers if you want to understand every implementation detail. The [How to read](/docs/introduction/how-to-read) page suggests routes by role.

## A note on terminology {#một-lưu-ý-về-thuật-ngữ}

Finance and technology each have their own vocabulary, and sometimes the two collide. The book uses the terms most common in international practice, and where a term has a specific meaning in Vietnamese regulation or market practice, it explains that meaning. For concepts without a good equivalent, the original term is kept and explained.

The [Glossary](/docs/glossary) brings all the terms together, with links to the chapters that explain them.

*Credit is not just lending money. It is how a society allocates resources over time: bringing money from the future into the present for the people who need it today. When the credit system works well, it creates opportunity. When it works badly, it creates debt traps.*

*The aim of this book is to help you build systems that work well.*
