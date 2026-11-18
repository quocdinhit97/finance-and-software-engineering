---
title: "Lời mở đầu"
sidebar_label: "Lời mở đầu"
sidebar_position: 1
reading_time: 5
source_file: "loi-mo-dau.md"
editorial_status: "mechanical"
---

## Khoảng trống giữa hai thế giới

Có hai loại sách về tài chính.

Loại thứ nhất được viết bởi các nhà kinh tế và chuyên gia tài chính. Chúng giải thích lãi suất, rủi ro tín dụng, mô hình định giá - những khái niệm đẹp đẽ và chặt chẽ về mặt lý thuyết. Nhưng khi một kỹ sư phần mềm đọc xong và quay lại màn hình máy tính, họ vẫn không biết phải viết code như thế nào để hệ thống tính đúng số tiền lãi hàng tháng cho một triệu khách hàng cùng lúc.

Loại thứ hai được viết bởi các kỹ sư phần mềm. Chúng nói về microservices, event-driven architecture, distributed systems - những mẫu thiết kế tinh tế và có thể triển khai ngay. Nhưng khi một Business Analyst đọc xong và ngồi vào cuộc họp với khách hàng, họ vẫn không hiểu tại sao một khoản vay ba mươi sáu tháng lại khó implement hơn một khoản vay mười hai tháng, hay tại sao hệ thống phải xử lý giao dịch "trong quá khứ" lại là một bài toán phi tầm thường.

Cuốn sách này được viết để lấp đầy khoảng trống đó.

## Tại sao VLP?

Trong suốt quá trình nghiên cứu và làm việc trong lĩnh vực tài chính tiêu dùng *(consumer finance)*, tôi nhận ra rằng không có gì giải thích domain này tốt hơn một hệ thống thực tế đang chạy trong production. Lý thuyết là cần thiết, nhưng lý thuyết không cho bạn thấy tại sao một lỗi nhỏ trong cách xử lý ngày tháng có thể khiến hàng nghìn giao dịch bị từ chối sai, hay tại sao việc quyết định sắp xếp thứ tự trả nợ của khách hàng không chỉ là bài toán kỹ thuật mà còn là bài toán thiết kế cơ chế kinh tế *(mechanism design)*.

Hệ sinh thái xuyên suốt cuốn sách này, **VLP**, là một nền tảng tài chính tiêu dùng hiện đại bao gồm hơn hai mươi microservices, xử lý toàn bộ vòng đời tín dụng từ khi khách hàng nộp đơn vay đến khi tất toán. VLP không phải một ví dụ đơn giản hóa: hệ thống đang vận hành hằng ngày, với đầy đủ sự phức tạp mà nghiệp vụ tín dụng đòi hỏi.

Dữ liệu là mô phỏng. Nhưng các vấn đề, quyết định thiết kế và bài học, tất cả đều là thật.

## Cuốn sách này dành cho ai?

Câu trả lời ngắn: dành cho bất kỳ ai muốn hiểu thực sự cách tín dụng tiêu dùng hiện đại hoạt động.

Câu trả lời dài hơn:

**Nếu bạn là Developer hoặc Software Architect**, cuốn sách này sẽ giải thích tại sao hệ thống tài chính lại được thiết kế theo những cách có vẻ phức tạp không cần thiết - và cho thấy rằng phần lớn sự phức tạp đó xuất phát từ những ràng buộc kinh tế và pháp lý rất cụ thể, không phải từ over-engineering.

**Nếu bạn là Business Analyst, Product Owner, hoặc Product Manager**, cuốn sách này sẽ cho bạn ngôn ngữ để nói chuyện với cả hai phía: đủ kiến thức kinh tế tài chính để thuyết phục stakeholders, và đủ hiểu biết kỹ thuật để viết requirements không bị implement sai.

**Nếu bạn là Manager hoặc Business Leader**, cuốn sách này sẽ giúp bạn hiểu tại sao các dự án công nghệ trong tài chính lại tốn kém và mất thời gian như vậy - và làm thế nào để đưa ra những quyết định đầu tư đúng đắn hơn.

**Nếu bạn là người mới trong ngành**, cuốn sách này là bản đồ. Không phải bản đồ chi tiết từng ngõ ngách, mà là bản đồ thể hiện tổng thể địa hình, để bạn biết mình đang đứng ở đâu và những gì quan trọng cần học tiếp theo.

## Cách đọc cuốn sách này

Cuốn sách được tổ chức thành năm phần theo logic tiến dần từ nền tảng đến ứng dụng:

- **Phần 0 - Nền tảng**: Kinh tế học và toán học của tín dụng. Đây là "tại sao" - lý do mọi thứ được thiết kế như vậy.
- **Phần I - Sản phẩm**: Thiết kế sản phẩm tài chính và hành trình khách hàng. Đây là "cái gì".
- **Phần II - Hệ thống**: Kiến trúc và implementation. Đây là "như thế nào".
- **Phần III - Trí tuệ**: Scoring, pricing, và behavioral economics. Đây là "thông minh hơn như thế nào".
- **Phần IV - Tương lai**: Xu hướng và bài học. Đây là "tiếp theo là gì".

Mỗi chương có ba lớp nội dung:

:::key
**Khái niệm** - Đọc tuyến tính, không cần nền tảng kỹ thuật

**Cơ chế** - Đi sâu hơn vào logic và quyết định thiết kế

**Hiện thực hóa** - Chi tiết kỹ thuật và implementation
:::

Bạn có thể đọc chỉ lớp Khái niệm và vẫn có được bức tranh hoàn chỉnh. Hoặc đọc cả ba lớp nếu muốn hiểu đến từng chi tiết triển khai.

## Một lưu ý về thuật ngữ

Tài chính và công nghệ đều có hệ thống thuật ngữ riêng, và đôi khi chúng va chạm nhau. Tôi cố gắng dùng tiếng Việt khi có thể, và chú thích tiếng Anh trong ngoặc đơn khi thuật ngữ đó thường gặp hơn trong môi trường làm việc quốc tế. Với những khái niệm không có bản dịch tốt, tôi giữ nguyên tiếng Anh và giải thích ý nghĩa.

Một glossary đầy đủ có ở Phụ lục B.

*Tín dụng không chỉ là cho vay tiền. Đó là cách một xã hội phân bổ nguồn lực theo thời gian - đưa tiền từ tương lai về hiện tại cho những người cần nó ngay hôm nay. Khi hệ thống tín dụng hoạt động tốt, nó tạo ra cơ hội. Khi nó hoạt động sai, nó tạo ra bẫy nợ.*

*Mục tiêu của cuốn sách này là giúp bạn xây dựng hệ thống hoạt động đúng.*
