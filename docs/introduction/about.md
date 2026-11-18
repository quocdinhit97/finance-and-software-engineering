---
title: "Về cuốn sách này"
sidebar_label: "Về cuốn sách này"
sidebar_position: 3
description: "Hệ sinh thái tài chính xuyên suốt cuốn sách, các nhân vật và cách đọc các đoạn mô tả hệ thống."
lang: vi
---

## Hệ sinh thái của cuốn sách

Cuốn sách đi theo hoạt động của Vela Finance và nền tảng cho vay VLP. Các vấn đề nghiệp vụ, quyết định thiết kế và sự cố được thảo luận đều gắn với hệ thống này. Để người đọc luôn theo dõi cùng một câu chuyện, các chương dùng chung một hệ sinh thái:

| Thực thể | Vai trò trong sách |
|---|---|
| **Vela Finance** (Công ty Tài chính Vela) | Công ty tài chính tiêu dùng cấp khoản vay cho chị Lan |
| **Vela Lending Platform (VLP)** | Nền tảng cho vay của Vela Finance, gồm hơn hai mươi module xử lý toàn bộ vòng đời khoản vay |
| **Ngân hàng Đông Hải** | Ngân hàng thương mại, xuất hiện trong các ví dụ về đối tác ngân hàng và nguồn vốn |
| **Chợ Sao** | Sàn thương mại điện tử, đối tác của các ví dụ BNPL (Chợ Sao PayLater) |
| **DiCùng** | Siêu ứng dụng gọi xe và giao đồ ăn (DiCùng Pay, DiCùng Food), ví dụ về embedded finance |
| **Ví Mây** | Ví điện tử có sản phẩm tín dụng nhỏ (Ví Mây Credit) |
| **Bình Minh Finance, Phương Nam Finance** | Các công ty tài chính tiêu dùng khác trên thị trường, dùng trong ví dụ cạnh tranh |

VLP được xây dựng trên Java, Spring Boot, PostgreSQL, Kafka, RabbitMQ, Kubernetes và Zeebe. Các module được gọi bằng tên viết tắt, ví dụ LAS (Loan Account Service) quản lý tài khoản và LOS (Loan Origination Service) khởi tạo khoản vay; [Phụ lục A](/docs/appendices/a-architecture-reference) liệt kê đầy đủ. Các cơ quan quản lý, văn bản pháp luật và chuẩn mực như Ngân hàng Nhà nước Việt Nam, Trung tâm Thông tin Tín dụng Quốc gia (CIC), IFRS 9 hay Basel được nhắc đến theo đúng tên gọi.

## Các nhân vật

| Nhân vật | Vai trò |
|---|---|
| Chị Lan | Khách hàng, 28 tuổi, nhân viên kế toán ở Hà Nội. Khoản vay 18,500,000 VNĐ của chị là ví dụ trung tâm của sách |
| Anh Minh | Product Owner, người đặt câu hỏi về sản phẩm, rủi ro và trải nghiệm khách hàng |
| Kỹ sư Tuấn | Kỹ sư phần mềm, người hiện thực hóa nghiệp vụ thành code |
| Bà Hương | Giám đốc tài chính (CFO), người nhìn khoản vay từ góc độ danh mục, vốn và lợi nhuận |

## VLP đang làm gì và ngành thường làm gì

Sách phân biệt hai điều. Khi mô tả VLP, sách nói về cách hệ thống đang vận hành. Khi một cách làm là "best practice" của ngành mà VLP chưa có, sách nói rõ VLP đang ở đâu và trình bày thiết kế đề xuất, để người đọc thấy khoảng cách giữa hai bên và lý do của nó.
