---
title: "Cách đọc cuốn sách"
sidebar_label: "Cách đọc cuốn sách"
sidebar_position: 2
description: "Cấu trúc năm phần, ba lớp nội dung và các quy ước trình bày được dùng trong sách."
lang: vi
---

Cuốn sách được tổ chức thành năm phần, đi từ nền tảng đến ứng dụng. Mỗi phần trả lời một câu hỏi.

| Phần | Câu hỏi | Chương |
|---|---|---|
| [I. Nền tảng](/docs/foundations) | Tại sao tín dụng vận hành như vậy? | 1 và 2 |
| [II. Sản phẩm](/docs/products) | Một sản phẩm cho vay được cấu thành từ những gì? | 3 đến 5 |
| [III. Hệ thống](/docs/system) | Nghiệp vụ được hiện thực hóa thành phần mềm ra sao? | 6 đến 10 |
| [IV. Trí tuệ](/docs/intelligence) | Cho ai vay, với giá nào, và có trách nhiệm ra sao? | 11 đến 13 |
| [V. Tương lai](/docs/future) | Điều gì thay đổi và điều gì còn mãi? | 14 đến 16 |

## Ba lớp nội dung

Phần lớn các mục trong sách được viết theo ba lớp. Lớp **khái niệm** giải thích bản chất và lý do tồn tại của một cơ chế tài chính, không đòi hỏi nền tảng kỹ thuật. Lớp **cơ chế** đi vào công thức, quy trình, business rule và các trường hợp ngoại lệ. Lớp **hiện thực hóa** cho thấy cơ chế đó trở thành domain model, bảng dữ liệu, API, transaction và code như thế nào.

Người đọc không lập trình có thể bỏ qua lớp hiện thực hóa mà vẫn nắm được toàn bộ lập luận của sách. Ngược lại, developer nên đọc cả ba lớp: lớp hiện thực hóa chỉ có ý nghĩa khi đã hiểu vì sao nghiệp vụ đòi hỏi như vậy.

## Một khoản vay xuyên suốt

Chị Lan, 28 tuổi, nhân viên kế toán ở Hà Nội, cần mua một chiếc laptop giá 18,500,000 VNĐ. Chị vay tiêu dùng với lãi suất danh nghĩa 18%/năm, kỳ hạn 12 tháng, trả góp hằng tháng. Khoản vay này xuất hiện lần đầu ở Chương 1 và được dùng lại trong suốt cuốn sách: để tính lịch trả nợ ở Chương 2, để phân tích phí và chi phí tín dụng thực tế, để mô tả từng bước xử lý trong hệ thống ở Phần III, và để minh họa các tình huống trả trễ, trả trước hạn và tất toán.

Mọi số liệu về khoản vay này là dữ liệu mô phỏng.

## Quy ước trình bày

Số được viết theo ký hiệu quốc tế: dấu phẩy phân cách hàng nghìn và dấu chấm thập phân, ví dụ 18,500,000 VNĐ và 1.5%/tháng. Cách viết này thống nhất với code, bảng tính và tài liệu kỹ thuật mà người đọc sẽ gặp khi làm việc với hệ thống.

Lãi suất luôn ghi rõ kỳ tính: "18%/năm" là lãi suất danh nghĩa năm, "1.5%/tháng" là lãi suất kỳ. Khi một con số là APR hoặc EIR, sách ghi rõ tên chỉ số, vì ba khái niệm này khác nhau (xem [Chương 2, mục 2.2](/docs/foundations/ch02-mathematics-of-lending#22-irr-apr-và-eir-lãi-suất-thật-là-gì)).

Thuật ngữ tiếng Anh được giữ trong ngoặc đơn ở lần xuất hiện đầu tiên, hoặc giữ nguyên khi không có bản dịch tiếng Việt tương đương được dùng phổ biến trong ngành. Toàn bộ thuật ngữ có trong trang [Thuật ngữ](/docs/glossary).

Các đoạn code được rút gọn để làm nổi bật logic nghiệp vụ; phần logging, xử lý lỗi và cấu hình phụ được lược bớt. Pseudocode luôn được ghi chú là pseudocode.

## Hai cách dùng sách

Nếu đọc lần đầu, hãy đọc tuần tự. Các chương sau dựa vào khái niệm đã được giải thích ở các chương trước, và cuốn sách cố gắng không dùng một khái niệm trước khi giải thích nó.

Nếu cần tra cứu, hãy dùng [Thuật ngữ](/docs/glossary), [Phụ lục C về công thức](/docs/appendices/c-math-reference), [Phụ lục A về kiến trúc](/docs/appendices/a-architecture-reference) và các [công cụ tính](/docs/tools).
