---
title: "Lời mở đầu"
sidebar_label: "Lời mở đầu"
sidebar_position: 1
reading_time: 5
description: "Vì sao cuốn sách nối kinh tế học tín dụng với kỹ thuật phần mềm, vì sao chọn VLP làm hệ thống xuyên suốt, cuốn sách dành cho ai và cách đọc."
source_file: "loi-mo-dau.md"
editorial_status: "edited"
---

## Khoảng trống giữa hai thế giới

Có hai loại sách về tài chính.

Loại thứ nhất được viết bởi các nhà kinh tế và chuyên gia tài chính. Chúng giải thích lãi suất, rủi ro tín dụng, mô hình định giá: những khái niệm đẹp và chặt chẽ về mặt lý thuyết. Nhưng khi một kỹ sư phần mềm đọc xong và quay lại màn hình máy tính, họ vẫn không biết phải viết code như thế nào để hệ thống tính đúng số tiền lãi hàng tháng cho một triệu khách hàng cùng lúc.

Loại thứ hai được viết bởi các kỹ sư phần mềm. Chúng nói về microservices, kiến trúc hướng sự kiện, hệ thống phân tán: những mẫu thiết kế tinh tế và triển khai được ngay. Nhưng khi một chuyên viên phân tích nghiệp vụ đọc xong và ngồi vào cuộc họp với khách hàng, họ vẫn không hiểu vì sao một khoản vay ba mươi sáu tháng lại khó hiện thực hơn một khoản vay mười hai tháng, hay vì sao việc hệ thống phải xử lý một giao dịch "trong quá khứ" lại là bài toán không hề đơn giản.

Cuốn sách này được viết để lấp đầy khoảng trống đó.

## Vì sao là VLP?

Trong suốt quá trình nghiên cứu và làm việc trong lĩnh vực tài chính tiêu dùng *(consumer finance)*, tôi nhận ra không gì giải thích lĩnh vực này tốt hơn một hệ thống đang vận hành. Lý thuyết là cần thiết, nhưng lý thuyết không cho bạn thấy vì sao một lỗi nhỏ trong cách xử lý ngày tháng có thể khiến hàng nghìn giao dịch bị từ chối sai, hay vì sao việc quyết định thứ tự phân bổ tiền trả nợ của khách hàng không chỉ là bài toán kỹ thuật mà còn là bài toán thiết kế cơ chế kinh tế *(mechanism design)*.

Hệ sinh thái xuyên suốt cuốn sách này, **VLP**, là một nền tảng tài chính tiêu dùng hiện đại gồm hơn hai mươi module, xử lý toàn bộ vòng đời tín dụng từ khi khách hàng nộp đơn vay đến khi tất toán. VLP không phải một ví dụ đơn giản hóa: hệ thống đang vận hành hằng ngày, với đầy đủ sự phức tạp mà nghiệp vụ tín dụng đòi hỏi.

Dữ liệu là mô phỏng. Nhưng các vấn đề, quyết định thiết kế và bài học, tất cả đều là thật.

## Cuốn sách này dành cho ai?

Câu trả lời ngắn: dành cho bất kỳ ai muốn hiểu thực sự cách tín dụng tiêu dùng hiện đại hoạt động.

Câu trả lời dài hơn:

**Nếu bạn là lập trình viên hoặc kiến trúc sư phần mềm**, cuốn sách giải thích vì sao hệ thống tài chính được thiết kế theo những cách có vẻ phức tạp không cần thiết, và cho thấy phần lớn sự phức tạp đó đến từ những ràng buộc kinh tế và pháp lý rất cụ thể, không phải từ thiết kế thừa.

**Nếu bạn là chuyên viên phân tích nghiệp vụ, Product Owner hoặc Product Manager**, cuốn sách cho bạn ngôn ngữ để nói chuyện với cả hai phía: đủ kiến thức kinh tế tài chính để thuyết phục các bên liên quan, và đủ hiểu biết kỹ thuật để viết yêu cầu không bị hiện thực sai.

**Nếu bạn là quản lý hoặc lãnh đạo kinh doanh**, cuốn sách giúp bạn hiểu vì sao các dự án công nghệ trong tài chính tốn kém và mất thời gian đến vậy, và làm thế nào để ra những quyết định đầu tư đúng hơn.

**Nếu bạn là người mới trong ngành**, cuốn sách là một tấm bản đồ. Không phải bản đồ chi tiết từng ngõ ngách, mà là bản đồ địa hình tổng thể, để bạn biết mình đang đứng ở đâu và điều gì quan trọng cần học tiếp.

## Cách đọc cuốn sách này

Cuốn sách được tổ chức thành năm phần, đi dần từ nền tảng đến ứng dụng:

| Phần | Nội dung | Câu hỏi |
|---|---|---|
| I. Nền tảng | Kinh tế học và toán học của tín dụng | Vì sao mọi thứ được thiết kế như vậy |
| II. Sản phẩm | Thiết kế sản phẩm tài chính, hành trình khách hàng, doanh thu và danh mục | Xây cái gì |
| III. Hệ thống | Kiến trúc và hiện thực hóa: khởi tạo, quản lý tài khoản, billing, collections | Xây như thế nào |
| IV. Trí tuệ | Chấm điểm, định giá, kinh tế học hành vi | Làm sao thông minh hơn |
| V. Tương lai | BNPL, AI và những nguyên tắc bất biến | Tiếp theo là gì |

Nhiều mục trong sách được viết theo ba lớp:

:::key
**Khái niệm**: đọc tuyến tính, không cần nền tảng kỹ thuật.

**Cơ chế**: đi sâu vào logic và các quyết định thiết kế.

**Hiện thực hóa**: chi tiết kỹ thuật và cách VLP làm.
:::

Bạn có thể chỉ đọc lớp Khái niệm mà vẫn có bức tranh hoàn chỉnh, hoặc đọc cả ba lớp nếu muốn hiểu đến từng chi tiết triển khai. Trang [Cách đọc](/docs/introduction/how-to-read) gợi ý lộ trình theo vai trò.

## Một lưu ý về thuật ngữ

Tài chính và công nghệ đều có hệ thống thuật ngữ riêng, và đôi khi chúng va chạm nhau. Tôi cố gắng dùng tiếng Việt khi có thể, và chú thích tiếng Anh trong ngoặc đơn khi thuật ngữ đó thường gặp hơn trong môi trường làm việc quốc tế. Với những khái niệm không có bản dịch tốt, tôi giữ nguyên tiếng Anh và giải thích ý nghĩa.

Trang [Thuật ngữ](/docs/glossary) tập hợp đầy đủ các thuật ngữ, kèm liên kết đến chương giải thích.

*Tín dụng không chỉ là cho vay tiền. Đó là cách một xã hội phân bổ nguồn lực theo thời gian: đưa tiền từ tương lai về hiện tại cho những người cần nó ngay hôm nay. Khi hệ thống tín dụng hoạt động tốt, nó tạo ra cơ hội. Khi nó hoạt động sai, nó tạo ra bẫy nợ.*

*Mục tiêu của cuốn sách này là giúp bạn xây dựng hệ thống hoạt động đúng.*
