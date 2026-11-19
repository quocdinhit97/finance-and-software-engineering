# Đo cách người đọc dùng cuốn sách (GA4)

GA4 chỉ được bật khi bản build có biến `GA_MEASUREMENT_ID` (repository variable của GitHub Actions). Bản build cục bộ và `npm start` không gửi gì.

## Các sự kiện

| Sự kiện | Gửi khi nào | Tham số riêng |
|---|---|---|
| `page_view` | Mỗi lần mở trang (plugin gtag) | |
| `read_progress` | Phần cuối màn hình đi qua 25, 50, 75, 100% thân bài | `percent`, `engaged_seconds` |
| `read_complete` | Đọc đến cuối bài sau ít nhất 60 giây nhìn thấy tab | `engaged_seconds` |
| `read_section` | Tiêu đề một mục `##` đi qua nửa trên màn hình, mỗi mục một lần | `section_id`, `section_index`, `section_count`, `section_title` |
| `glossary_tooltip` | Mở định nghĩa của một thuật ngữ, mỗi thuật ngữ một lần mỗi trang | `term`, `input` (mouse, touch, pen) |
| `continue_reading_click` | Bấm thẻ "Đọc tiếp từ lần trước" ở trang chủ | `target`, `percent` |
| `print_chapter` | Bấm "In hoặc lưu PDF" ở đầu chương | `chapter` |

Mọi sự kiện đều có `page_path` và `page_locale` (`vi-VN` hoặc `en-US`). Mã nguồn: `src/clientModules/readingAnalytics.ts`, `src/clientModules/glossaryTooltip.ts`, `src/components/ContinueReading`, `src/theme/DocItem/Content`.

## Thiết lập một lần trong GA4 Admin

Admin → Custom definitions → Create custom dimension (scope: Event):

| Tên hiển thị | Tham số |
|---|---|
| Page path (event) | `page_path` |
| Page locale | `page_locale` |
| Read percent | `percent` |
| Section id | `section_id` |
| Section index | `section_index` |
| Section title | `section_title` |
| Glossary term | `term` |
| Chapter | `chapter` |

Custom metric (scope: Event, unit: Standard): `engaged_seconds`, `section_count`.

Tham số chỉ xuất hiện trong báo cáo từ lúc đăng ký trở đi, nên nên làm bước này ngay.

## Ba báo cáo nên dựng (Explore)

**1. Người đọc dừng ở đâu trong chương.** Free form, hàng: Page path (event), Section index; giá trị: Event count; bộ lọc: Event name = `read_section`. Với mỗi chương, số sự kiện giảm dần theo `section_index`. Mục nào có mức giảm lớn nhất so với mục trước là nơi nhiều người bỏ đọc: xem lại độ dài, độ khó hoặc chia nhỏ mục đó.

**2. Tỷ lệ đọc hết theo chương.** Free form, hàng: Page path (event); giá trị: Event count, lọc riêng `read_progress` với Read percent = 25 và `read_complete`. Tỷ lệ = `read_complete` / `read_progress (25)`. Chương có tỷ lệ thấp hơn hẳn các chương khác là ứng viên viết lại trước.

**3. Thuật ngữ gây khó.** Free form, hàng: Glossary term, Page path (event); giá trị: Event count; lọc `glossary_tooltip`. Thuật ngữ được mở nhiều ở một chương cho thấy chương đó dùng nó trước khi giải thích; cân nhắc định nghĩa ngắn ngay trong đoạn văn.

## Khi nào đọc số liệu

Cần khoảng 3 đến 4 tuần và vài trăm lượt đọc mỗi chương thì các tỷ lệ mới ổn định. Với chương ít lượt đọc, chỉ nên so sánh xu hướng, không nên kết luận từ chênh lệch vài điểm phần trăm.
