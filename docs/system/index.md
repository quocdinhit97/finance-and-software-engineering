---
sidebar_position: 0
title: "Phần III. Hệ thống"
sidebar_label: "Tổng quan"
description: "Kiến trúc và hiện thực hóa một nền tảng cho vay tiêu dùng: origination, quản lý tài khoản, billing và thu hồi nợ."
---

> *"Hiểu sản phẩm trước khi xây hệ thống. Hiểu hệ thống trước khi viết code."*

Phần này trả lời câu hỏi "như thế nào". Từ đây, cuốn sách đi vào bên trong Vela Lending Platform (VLP), nền tảng cho vay của công ty tài chính hư cấu Vela Finance được dùng làm ví dụ xuyên suốt. VLP gồm hơn hai mươi module, xử lý toàn bộ vòng đời khoản vay từ lúc khách hàng nộp hồ sơ đến khi tất toán.

Chương 6 trình bày các nguyên tắc kiến trúc: giao dịch ACID, khóa bi quan, idempotency, audit trail, và cách các module giao tiếp với nhau. Bốn chương tiếp theo đi theo vòng đời khoản vay: khởi tạo (Chương 7), quản lý tài khoản và billing engine (Chương 8), chu kỳ thanh toán hằng tháng (Chương 9), và quản lý nợ quá hạn (Chương 10).

:::warning[Về các đoạn code trong phần này]
Phần lớn đoạn Java trong các chương này là code minh họa (illustrative). Chúng thể hiện đúng logic nghiệp vụ, nhưng tên class hoặc method có thể không trùng hoàn toàn với mã nguồn production. Những đoạn được xác nhận từ mã nguồn được ghi chú `// verified`. Khi hiện thực hóa, luôn đối chiếu với mã nguồn thực tế.
:::

| Chương | Nội dung chính |
|---|---|
| [Chương 6. Kiến trúc hệ thống tài chính](/docs/system/ch06-financial-system-architecture) | ACID, locking, idempotency, audit trail, messaging, hạ tầng dữ liệu |
| [Chương 7. Quy trình khởi tạo khoản vay](/docs/system/ch07-origination) | Origination process, scoring, tạo và kích hoạt tài khoản |
| [Chương 8. Quản lý tài khoản và billing engine](/docs/system/ch08-account-management) | Domain model, xử lý giao dịch, EOM batch, các sự cố production |
| [Chương 9. Chu kỳ thanh toán](/docs/system/ch09-billing-cycle) | Tính lãi 30/360, sao kê, ghép thanh toán, đối soát |
| [Chương 10. Quản lý nợ và thu hồi](/docs/system/ch10-collections) | DPD, Debt Register, giãn nợ, xóa nợ |
