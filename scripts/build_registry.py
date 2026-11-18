#!/usr/bin/env python3
"""Generate docs/reference/fictional-entities.md (draft, internal) from scripts/entities.json."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, 'scripts', 'entities.json'), encoding='utf-8'))
L = ['---', 'title: "Fictional Entity Registry"', 'draft: true', '---', '',
     ':::danger[Tài liệu nội bộ]',
     'Trang này chỉ phục vụ biên tập. `draft: true` khiến trang không được build vào website production. Không đưa bảng ánh xạ này lên trang công khai.',
     ':::', '', 'Sinh tự động bởi `scripts/build_registry.py` từ `scripts/entities.json`.', '',
     '## Tổ chức, đối tác, định danh hệ thống', '', '| Original entity | Fictional entity |', '|---|---|']
for a, b in d['replacements']:
    L.append(f'| `{a}` | `{b}` |')
L += ['', '## Định danh kỹ thuật: module, bảng, class, mã phí', '',
      'Đổi sang tên khác cùng nghĩa. Cột "Original" là mẫu khớp (literal hoặc regex).', '',
      '| Original | Fictional | Type | Meaning |', '|---|---|---|---|']
for a, b, kind, typ, meaning in d['technical']:
    a2 = a.replace('|', '\\|')
    L.append(f'| `{a2}` | `{b}` | {typ} | {meaning} |')
L += ['', '## Thực thể hư cấu bổ sung', '', '| Fictional entity | Role |', '|---|---|',
      '| Vela Finance (Công ty Tài chính Vela) | Bên cho vay trong mọi ví dụ, chủ sở hữu VLP |',
      '| Vela Lending Platform (VLP) | Nền tảng cho vay được phân tích |', '',
      '## Không thay thế', '',
      '- Cơ quan quản lý, luật, chuẩn mực công khai: NHNN/SBV, các Thông tư, CIC, PCB, IFRS 9, Basel, CFPB, FCA.',
      '- Công nghệ: Java, Spring, PostgreSQL, Kafka, RabbitMQ, Zeebe/Camunda, Infinispan, Keycloak, ArgoCD, KEDA và class của framework (BigDecimal, CompositeItemProcessor...).',
      '- Thuật ngữ miền chung: Account, Transaction, Instalment, Contract, Tariff, Money; trạng thái (ACTIVE, WRITTEN_OFF...) và chế độ phân bổ (PRIORITY_ONLY...).',
      '- Tên method và field ngoài các khái niệm đã đổi tên (ví dụ `sourceTxCode`, `pairInstalments`).',
      '- Tác giả học thuật, tổ chức chấm điểm quốc tế (FICO, Experian...), sự cố công khai đã ghi nhận rộng rãi.']
open(os.path.join(ROOT, 'docs', 'reference', 'fictional-entities.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('ok', len(d['technical']), 'technical entries')
