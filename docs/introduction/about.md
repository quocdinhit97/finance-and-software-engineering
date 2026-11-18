---
title: "Về cuốn sách này"
sidebar_label: "Về cuốn sách này"
sidebar_position: 3
description: "Hệ sinh thái tài chính hư cấu được dùng xuyên suốt sách, các nhân vật và nguyên tắc biên tập."
lang: vi
---

## Một hệ sinh thái hư cấu

Mọi tổ chức, hệ thống và nhân vật trong sách đều là hư cấu. Các vấn đề nghiệp vụ, quyết định thiết kế và bài học kỹ thuật được rút ra từ kinh nghiệm thực tế với một nền tảng tài chính tiêu dùng đang vận hành, nhưng tên, chi tiết định danh và thông tin độc quyền đã được thay thế.

Để người đọc luôn theo dõi cùng một câu chuyện, các chương dùng chung một hệ sinh thái:

| Thực thể | Vai trò trong sách |
|---|---|
| **Vela Finance** (Công ty Tài chính Vela) | Công ty tài chính tiêu dùng cấp khoản vay cho chị Lan |
| **Vela Lending Platform (VLP)** | Nền tảng cho vay của Vela Finance, gồm hơn hai mươi module xử lý toàn bộ vòng đời khoản vay |
| **Ngân hàng Đông Hải** | Ngân hàng thương mại, xuất hiện trong các ví dụ về đối tác ngân hàng và nguồn vốn |
| **Chợ Sao** | Sàn thương mại điện tử, đối tác của các ví dụ BNPL (Chợ Sao PayLater) |
| **DiCùng** | Siêu ứng dụng gọi xe và giao đồ ăn (DiCùng Pay, DiCùng Food), ví dụ về embedded finance |
| **Ví Mây** | Ví điện tử có sản phẩm tín dụng nhỏ (Ví Mây Credit) |
| **Bình Minh Finance, Phương Nam Finance** | Các công ty tài chính tiêu dùng khác trên thị trường, dùng trong ví dụ cạnh tranh |

Tên module, tên bảng, tên class và mã phí của hệ thống gốc cũng đã được đổi sang tên khác cùng nghĩa; ví dụ module quản lý tài khoản trong sách là LAS (Loan Account Service), module khởi tạo khoản vay là LOS (Loan Origination Service). Các tên công nghệ như Java, Spring Boot, PostgreSQL, Kafka, RabbitMQ, Kubernetes hay Zeebe được giữ nguyên. Các cơ quan quản lý, văn bản pháp luật và chuẩn mực công khai như Ngân hàng Nhà nước Việt Nam, Trung tâm Thông tin Tín dụng Quốc gia (CIC), IFRS 9 hay Basel cũng được giữ nguyên.

## Các nhân vật

| Nhân vật | Vai trò |
|---|---|
| Chị Lan | Khách hàng, 28 tuổi, nhân viên kế toán ở Hà Nội. Khoản vay 18,500,000 VNĐ của chị là ví dụ trung tâm của sách |
| Anh Minh | Product Owner, người đặt câu hỏi về sản phẩm, rủi ro và trải nghiệm khách hàng |
| Kỹ sư Tuấn | Kỹ sư phần mềm, người hiện thực hóa nghiệp vụ thành code |
| Bà Hương | Giám đốc tài chính (CFO), người nhìn khoản vay từ góc độ danh mục, vốn và lợi nhuận |

## Nội dung nguồn và nội dung bổ sung

Sách phân biệt ba loại nội dung. Nội dung mô tả hành vi của VLP dựa trên tài liệu và mã nguồn đã được đối chiếu. Nội dung "best practice" mô tả cách ngành thường làm, nhưng VLP chưa hiện thực hóa; những chỗ này được ghi chú rõ. Kiến thức nền tảng do biên tập viên bổ sung để giải thích khái niệm được viết như kiến thức chung, không được trình bày như hành vi của hệ thống.

Khi một chi tiết chưa thể xác minh, sách nói rõ điều đó thay vì suy đoán.
