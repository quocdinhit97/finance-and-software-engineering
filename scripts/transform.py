#!/usr/bin/env python3
"""
Mechanical transformation of the original manuscript (book-v1/*.md) into
Docusaurus docs. Run from the website root:

    python3 scripts/transform.py <source-dir>

What it does (in order):
  1. Anonymization (scripts/entities.json), applied everywhere incl. code.
  2. Strips manual navigation lines, part banners and decorative separators.
  3. Moves chapter number/title/English subtitle into front matter.
  4. Prose-only typography fixes (never inside code fences or inline code):
     em-dash / double-hyphen separators, decorative emoji, functional marks.
  5. Converts "TÓM TẮT" and warning blockquotes into admonitions.
  6. Sentence-cases Vietnamese headings, protecting names and acronyms.
  7. Rewrites cross-file links to the new doc ids.

Files listed in HAND_EDITED are skipped: they are maintained by hand after
the first pass and must not be overwritten.
"""
import json, os, re, sys, math

SRC = sys.argv[1] if len(sys.argv) > 1 else '../book-v1'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')

# source file -> (doc path, sidebar position, chapter number or None)
MAP = {
    'loi-mo-dau.md':                ('introduction/preface.md', 1, None),
    'phan-0-chuong-1-v2.md':        ('foundations/ch01-credit-economics.md', 1, 1),
    'phan-0-chuong-2.md':           ('foundations/ch02-mathematics-of-lending.mdx', 2, 2),
    'phan-1-chuong-3.md':           ('products/ch03-product-design.md', 1, 3),
    'phan-1-chuong-4.md':           ('products/ch04-customer-journey.md', 2, 4),
    'phan-1-chuong-5.md':           ('products/ch05-revenue-portfolio.md', 3, 5),
    'phan-2-chuong-6.md':           ('system/ch06-financial-system-architecture.md', 1, 6),
    'phan-2-chuong-7.md':           ('system/ch07-origination.md', 1, 7),
    'phan-2-chuong-8.md':           ('system/ch08-account-management.md', 2, 8),
    'phan-2-chuong-9.md':           ('system/ch09-billing-cycle.md', 3, 9),
    'phan-2-chuong-10.md':          ('system/ch10-collections.md', 4, 10),
    'phan-3-chuong-11.md':          ('intelligence/ch11-credit-scoring.md', 1, 11),
    'phan-3-chuong-12.md':          ('intelligence/ch12-risk-based-pricing.md', 2, 12),
    'phan-3-chuong-13.md':          ('intelligence/ch13-behavioral-economics.md', 3, 13),
    'phan-4-chuong-14.md':          ('future/ch14-embedded-finance-bnpl.md', 1, 14),
    'phan-4-chuong-15.md':          ('future/ch15-ai-future-of-lending.md', 2, 15),
    'phan-4-chuong-16.md':          ('future/ch16-timeless-principles.md', 3, 16),
    'phu-luc-a-architecture.md':    ('appendices/a-architecture-reference.md', 1, None),
    'phu-luc-b-glossary.md':        ('glossary/index.md', 1, None),
    'phu-luc-c-math-reference.md':  ('appendices/c-math-reference.md', 2, None),
    'phu-luc-d-regulatory.md':      ('appendices/d-regulatory-reference.md', 3, None),
}

# Docs maintained by hand after the first pass (relative to docs/).
HAND_EDITED_FILE = os.path.join(ROOT, 'scripts', 'hand-edited.txt')
HAND_EDITED = set()
if os.path.exists(HAND_EDITED_FILE):
    HAND_EDITED = {l.strip() for l in open(HAND_EDITED_FILE, encoding='utf-8')
                   if l.strip() and not l.startswith('#')}

# Structural fixes for defects in the manuscript (e.g. missing code fences).
# Applied to the source text in memory only; the original files are never modified.
# Structural/content fixes for the manuscript, keyed by source file. They quote the
# original text, so they live in a separate file that can be kept out of a public repo.
_PATCH_FILE = os.path.join(ROOT, 'scripts', 'source-patches.json')
SOURCE_PATCHES = {k: [tuple(x) for x in v] for k, v in json.load(open(_PATCH_FILE, encoding='utf-8')).items()} \
    if os.path.exists(_PATCH_FILE) else {}

_ENT_FILE = json.load(open(os.path.join(ROOT, 'scripts', 'entities.json'), encoding='utf-8'))
ENT = _ENT_FILE['replacements']
# Technical identifiers (modules, tables, classes, fee codes) renamed to synonyms.
TECH = [(re.compile(a) if kind == 'regex' else a, b) for a, b, kind, *_ in _ENT_FILE.get('technical', [])]

def rename_technical(t):
    for a, b in TECH:
        t = a.sub(b, t) if hasattr(a, 'sub') else t.replace(a, b)
    return t

STRUCTURAL = re.compile(r'^(#{1,6} |> \*\*|---\s*$|\*\*[^*]+\*\*\s*$)')
STRUCTURAL_IN_CODE = re.compile(r'^(#{2,6} [^#]|> \*\*|\*\*[^*]+\*\*\s*$)')
REPAIR_LOG = []
DEBUG = []

def repair_fences(name, text):
    """Repair code blocks with a missing opening or closing fence in the manuscript.

    The manuscript sometimes omits one fence of a pair, which turns the rest of
    the chapter (headings, summaries) into a code block. Two cases are handled:
      1. Orphan closing fence: a bare fence is met outside code, prose structure
         follows it, and code-like lines precede it. An opening fence is
         inserted at the start of those lines; the bare fence closes the block.
      2. Missing closing fence: a block is open and a structural markdown line
         (heading, summary blockquote, rule, bold label) is met. A closing fence
         is inserted before it.
    Every repair is logged so it can be reviewed by hand.
    """
    L = text.split('\n')
    fence_idx = [i for i, l in enumerate(L) if re.match(r'^\s*```', l)]
    out, ino = [], False
    for i, line in enumerate(L):
        is_fence = re.match(r'^\s*```', line) is not None
        bare = re.match(r'^\s*```\s*$', line) is not None
        if is_fence and not ino:
            nxt = next((f for f in fence_idx if f > i), len(L))
            region = L[i + 1:nxt]
            if bare and any(STRUCTURAL.match(x) for x in region):
                j = len(out) - 1
                while j >= 0 and not STRUCTURAL.match(out[j]) and not re.match(r'^\s*```', out[j]):
                    j -= 1
                start = j + 1
                while start < len(out) and not out[start].strip():
                    start += 1
                if start < len(out):
                    out.insert(start, '```text')
                    out.append(line)
                    REPAIR_LOG.append(f'{name}:{i + 1}: orphan closing fence, opening inserted above')
                    continue
            out.append(line)
            ino = True
            continue
        if is_fence and ino:
            if not bare:
                # an opening fence with a language while a block is open:
                # the previous block was never closed
                k = len(out)
                while k > 0 and not out[k - 1].strip():
                    k -= 1
                out.insert(k, '```')
                REPAIR_LOG.append(f'{name}:{i + 1}: unclosed block before a new fenced block, closing inserted')
                out.append(line)
                continue
            out.append(line)
            ino = False
            continue
        if ino and STRUCTURAL_IN_CODE.match(line):
            k = len(out)
            while k > 0 and not out[k - 1].strip():
                k -= 1
            out.insert(k, '```')
            ino = False
            REPAIR_LOG.append(f'{name}:{i + 1}: missing closing fence inserted before structural line')
        out.append(line)
    if ino:
        out.append('```')
        REPAIR_LOG.append(f'{name}: closing fence appended at end of file')
    return '\n'.join(out)

CODEY = re.compile(r'^(\s*//.*|\s*--\s.*|\s*(SELECT|FROM|JOIN|WHERE|AND|OR|ORDER|GROUP|INSERT|UPDATE|WITH)\b.*|\s*<[/!a-zA-Z].*|\s*@\w.*|\s*(public|private|protected|return|if|for|while)\b.*|.*[;{]\s*$|\s*\}.*|\s{2,}\S.*|\s*[→└├│┌┐┘].*)$')

def wrap_unfenced_code(name, text):
    """Wrap paragraphs that are clearly code or pre-formatted text but have no fence.

    A paragraph (lines between blank lines, outside code) is wrapped in a
    ```text block when it has at least two lines, does not start with a
    markdown construct (list, quote, table, heading, admonition), and most of
    its lines look like code or indented pre-formatted text. Adjacent wrapped
    paragraphs are merged into one block.
    """
    L = text.split('\n')
    out, para, ino = [], [], False
    wrapped = 0

    def flush():
        nonlocal para, wrapped
        if not para:
            return
        first = para[0]
        md_start = re.match(r'^\s*([-*+] |\d+[.)] |\([a-z0-9]\) |>|\||#|:::|!\[|\[|\*\*)', first)
        def codey(x):
            if re.match(r'^\s*([-*+] |\d+[.)] |\([a-z0-9]\) )', x):
                return False
            return CODEY.match(x) is not None
        score = sum(1 for x in para if codey(x))
        if len(para) >= 2 and not md_start and not first[:1].isspace() and score * 2 >= len(para) and score >= 2:
            # merge with a block we just emitted (only blank lines in between)
            k = len(out)
            while k > 0 and not out[k - 1].strip():
                k -= 1
            if k > 0 and out[k - 1] == '```' and out[k - 1:k] and getattr(flush, 'last_close', -1) == k - 1:
                del out[k - 1]
                out.extend(para + ['```'])
            else:
                out.extend(['```text'] + para + ['```']); DEBUG.append((name, para[:3]))
                wrapped += 1
            flush.last_close = len(out) - 1
        else:
            out.extend(para)
        para = []

    for line in L:
        if re.match(r'^\s*```', line):
            flush()
            out.append(line)
            if not ino:
                ino = True
            elif re.match(r'^\s*```\s*$', line):
                ino = False
            flush.last_close = -1
            continue
        if ino:
            out.append(line)
            continue
        if not line.strip():
            flush()
            out.append(line)
            continue
        para.append(line)
    flush()
    if wrapped:
        REPAIR_LOG.append(f'{name}: wrapped {wrapped} unfenced code/pre-formatted paragraph(s)')
    return '\n'.join(out)

def anonymize(t):
    for a, b in ENT:
        if re.fullmatch(r'[A-Za-z]+', a):
            t = re.sub(r'\b' + re.escape(a) + r'\b', b, t)
        else:
            t = t.replace(a, b)
    return rename_technical(t)

# ---------------------------------------------------------------- headings
VN_CHARS = set('àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ'
               'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ')
# Vietnamese syllables without diacritics that commonly appear Title-Cased.
VN_PLAIN = {'Cho', 'Vay', 'Khi', 'Theo', 'Trong', 'Sao', 'Tin', 'Hay', 'Con', 'Gian', 'Nhanh',
            'Thu', 'Tra', 'Hai', 'Ban', 'Nhau', 'Khung', 'Chung', 'Thanh', 'Tranh', 'Tinh',
            'Danh', 'Chi', 'Ngay', 'Sinh', 'Phan', 'Kinh', 'Doanh', 'Thong', 'Quan', 'Nhu',
            'Mua', 'Sau', 'Trung', 'Luan', 'Phi', 'Hoa', 'Hanh', 'Tang', 'Tai', 'Ra', 'Va', 'Vi',
            'Ai', 'Gi', 'Nay', 'Kho', 'Tim', 'Khai', 'Thi', 'Tham', 'Kiem', 'Tao', 'Xin', 'Mang',
            'Lai', 'Lam', 'Cao', 'Hon', 'Hoan', 'Dung', 'Bao', 'Nao', 'Tay', 'Ghi', 'Bang',
            'Ro', 'Kim', 'Hao', 'Do', 'Mo', 'Tong', 'Khoan', 'Gia', 'Nhanh', 'Phat', 'Lo', 'Ky', 'Nho', 'Xu', 'Ly', 'La', 'Ta', 'Giai'}
# Proper names / places that must keep their capital letter.
PROTECT = {'Lan', 'Minh', 'Tuấn', 'Hương', 'Hùng', 'Hoa', 'Mai', 'Nam', 'Hà', 'Cường', 'Bình',
           'An', 'Tùng', 'Việt', 'Nội', 'Vela', 'VLP', 'Mây', 'Đông', 'Hải', 'Phương',
           'Chợ'}
NAME_PREFIX = {'Chị', 'Anh', 'Bà', 'Ông', 'Agent', 'Cô', 'sư', 'Chợ', 'Ví'}

def sentence_case(text):
    # leave inline code / emphasis segments intact, operate word by word
    parts = re.split(r'(`[^`]*`|\*\([^)]*\)\*|\([^)]*\))', text)
    out, first_word_seen = [], False
    for p in parts:
        if not p or p.startswith('`') or p.startswith('*(') or p.startswith('('):
            out.append(p)
            if p.strip():
                first_word_seen = True
            continue
        words = re.split(r'(\s+)', p)
        prev = None; prev_raw = ''
        for i, w in enumerate(words):
            if not w.strip():
                continue
            core = w.strip('"“”\'‘’:;,.?!-—')
            if not first_word_seen:
                if re.search(r'[A-Za-zÀ-ỹ]', core):
                    first_word_seen = True
                    # a heading starting with a section number ("2.1") still
                    # keeps the following word capitalised
                    if re.fullmatch(r'[\d.]+', core):
                        first_word_seen = False
                prev = core; prev_raw = w
                continue
            is_vn = any(ch in VN_CHARS for ch in core) or core in VN_PLAIN
            if (core[:1].isupper() and core[1:].islower() and is_vn
                    and core not in PROTECT and prev not in NAME_PREFIX
                    and not prev_raw.endswith(':')):
                words[i] = w.replace(core, core[0].lower() + core[1:], 1)
            prev = core; prev_raw = w
        out.append(''.join(words))
    return ''.join(out)

# ---------------------------------------------------------------- prose fixes
EMOJI_DROP = ['📦', '📖', '🔍', '💚', '🎯', '⚙️', '⚙', '️']

def fix_prose(line):
    """Typography fixes for one prose line, protecting inline code spans."""
    segs = re.split(r'(`[^`]*`)', line)
    for i in range(0, len(segs), 2):
        s = segs[i]
        for e in EMOJI_DROP:
            s = s.replace(e, '')
        s = s.replace('✅', '✓').replace('❌', '✗').replace('$', '\\$')
        s = s.replace('⚠ ', 'Lưu ý: ').replace('⚠', 'Lưu ý:')
        # em-dash / double hyphen used as clause separators
        s = re.sub(r'\s+—\s+', ' - ', s)
        s = re.sub(r'(?<=\S)—(?=\S)', ' - ', s)
        s = re.sub(r'^—\s*', '- ', s) if s.lstrip().startswith('— ') else s
        s = re.sub(r'(?<=[^\s-])\s+--\s+(?=[^\s-])', ' - ', s)
        s = re.sub(r'  +', ' ', s) if not s.startswith('  ') else s
        segs[i] = s
    return ''.join(segs)

CURRENT = ['']
def rel(dest):
    # URL links (not file links) so they also work from translated locales,
    # where a page may be translated while the page it links to is not.
    url = re.sub(r'\.mdx?$', '', dest)
    url = re.sub(r'/index$', '', url)
    return '/docs/' + url

STORY_HEADING = re.compile(r'^#{2,4} (Dẫn nhập|Tình huống|Câu chuyện)', re.I)
STORY_LABEL = re.compile(r'^\*\*(Tình huống|Câu chuyện|Scenario)([^*]*)\*\*\s*(.*)$')
IN_STORY_LABEL = re.compile(r'^\*\*(Yêu cầu|Ứng viên|Khách hàng|Ngày|Tháng|Lúc|Sáng|Chiều|Tối)\b')
# Bold labels that start the analytical part after a scenario ("**Vấn đề:**", "**Khái niệm:**", ...)
STOP_LABEL = re.compile(r'^\*\*(Vấn đề|Khái niệm|Cơ chế|Giải pháp|Phân tích|Ứng dụng|Bài học|Kết luận|Insight|Lý do|Tại sao|Ví dụ|'
                        r'Hiện thực hóa|Implementation|Câu hỏi|Định nghĩa|Nguyên tắc|Root cause|Fix|Thiết kế|Trong VLP|Recovery|Authorization)', re.I)

def book_callouts(lines):
    """Editorial callouts for mechanically converted chapters.

    - drops the "Bản đồ chương" section (the sidebar and page TOC already show it)
    - section summaries (:::note[Tóm tắt...]) become :::summary
    - definition blockquotes ("> **Term** ...") become :::key
    - narrative passages (Dẫn nhập / Tình huống / Câu chuyện sections and
      "**Tình huống:**" paragraphs) are wrapped in ::::story (4 colons, so other
      admonitions can be nested inside)
    """
    out, i, n = [], 0, len(lines)
    in_code = False

    def is_fence(l):
        return re.match(r'^\s*```', l) is not None

    while i < n:
        l = lines[i]
        if is_fence(l):
            in_code = not in_code
            out.append(l); i += 1; continue
        if in_code:
            out.append(l); i += 1; continue
        # 1. drop chapter map
        if re.match(r'^#{2,3} Bản đồ chương', l):
            i += 1
            code = False
            while i < n and (code or not re.match(r'^#{1,3} ', lines[i])):
                if is_fence(lines[i]):
                    code = not code
                i += 1
            continue
        # 2. summaries
        m = re.match(r'^:::note\[Tóm tắt:?\s*(.*)\]$', l)
        if m:
            t = m.group(1).strip()
            out.append(f':::summary[{t}]' if t else ':::summary')
            i += 1; continue
        if l.strip() == ':::note[Tóm tắt]':
            out.append(':::summary'); i += 1; continue
        # 3. definitions
        if re.match(r'^> \*\*[^*]+\*\*', l) and not l.startswith('> *"'):
            body = []
            while i < n and lines[i].startswith('>'):
                body.append(re.sub(r'^>\s?', '', lines[i])); i += 1
            out.append(':::key')
            out.extend(body)
            out.append(':::')
            continue
        # 4. stories
        hm = STORY_HEADING.match(l)
        lm = STORY_LABEL.match(l)
        if hm or lm:
            if hm:
                out.append(l); out.append('')
                title = ''
                i += 1
            else:
                title = (lm.group(1) + lm.group(2)).strip().rstrip(':').strip()
                rest = lm.group(3).strip()
                i += 1
            body = []
            if lm and rest:
                body.append(rest)
            intro = bool(hm) and hm.group(1).lower() == 'dẫn nhập'
            while i < n:
                x = lines[i]
                if is_fence(x) or re.match(r'^#{1,6} ', x) or x.startswith(':::') or x.startswith('Chương này') \
                        or re.match(r'^> \*\*', x):
                    break
                if not intro and x.startswith('**') and not IN_STORY_LABEL.match(x):
                    break
                body.append(x); i += 1
            while body and not body[-1].strip():
                body.pop()
            while body and not body[0].strip():
                body.pop(0)
            if body:
                label = '' if title in ('', 'Tình huống', 'Câu chuyện') else title
                out.append(f'::::story[{label}]' if label else '::::story')
                out.extend(body)
                out.append('::::')
                out.append('')
            continue
        out.append(l); i += 1
    return out

def link_target(m):
    text, href = m.group(1), m.group(2)
    base, _, anchor = href.partition('#')
    if base in MAP:
        return f'[{text}]({rel(MAP[base][0])}{"#" + anchor if anchor else ""})'
    if base == 'TOC.md':
        return f'[{text}]({rel("table-of-contents.md")})'
    return m.group(0)

def strip_heading_md(h):
    return re.sub(r'\*\(([^)]*)\)\*', r'(\1)', h).strip()

def transform(src_name, text):
    dest, pos, chap = MAP[src_name]
    CURRENT[0] = dest
    for old, new in SOURCE_PATCHES.get(src_name, []):
        if old not in text:
            raise SystemExit(f'patch not applicable in {src_name}: {old[:60]!r}')
        text = text.replace(old, new, 1)
    text = repair_fences(src_name, text)
    text = wrap_unfenced_code(src_name, text)
    text = anonymize(text)
    lines = text.split('\n')

    # 1. drop manual navigation lines
    lines = [l for l in lines if not l.startswith('📖')]

    # 2. drop part banner ("# PHẦN ..." + following epigraph) - lives in part index pages
    out, i = [], 0
    while i < len(lines):
        l = lines[i]
        if re.match(r'^# PH[ẦA]N ', l):
            i += 1
            while i < len(lines) and (lines[i].startswith('>') or not lines[i].strip() or lines[i] == '---'):
                i += 1
            continue
        out.append(l); i += 1
    lines = out

    # 3. title block
    title = subtitle = None
    joined = '\n'.join(lines)
    m = re.search(r'^# (Chương \d+|Phụ Lục [A-D]|LỜI MỞ ĐẦU)\s*\n(?:# (.+)\n)?(?:\*\((.+)\)\*\s*\n)?', joined, re.M)
    if m:
        head, title, subtitle = m.group(1), m.group(2), m.group(3)
        if head == 'LỜI MỞ ĐẦU':
            title = 'Lời mở đầu'
        joined = joined[:m.start()] + joined[m.end():]
    lines = joined.split('\n')

    # 4. walk lines: code fences, hr, blockquote admonitions, headings
    out, in_code, fence = [], False, ''
    i = 0
    while i < len(lines):
        l = lines[i]
        fm = re.match(r'^(\s*)(```+|~~~+)(.*)$', l)
        if fm:
            if not in_code:
                in_code, fence = True, fm.group(2)
                lang = fm.group(3).strip()
                out.append(f'{fm.group(1)}{fence}{lang if lang else "text"}')
            elif fm.group(2).startswith(fence) and not fm.group(3).strip():
                in_code = False
                out.append(l)
            else:
                out.append(l)
            i += 1; continue
        if in_code:
            out.append(l); i += 1; continue

        if re.fullmatch(r'\s*(---+|\*\*\*+|___+)\s*', l):
            i += 1; continue  # decorative separators

        # summary / warning blockquotes -> admonitions
        bm = re.match(r'^>\s*\*\*\s*(📦|⚠️|⚠)\s*(.*?)\*\*\s*(.*)$', l)
        if bm:
            kind = 'note' if bm.group(1) == '📦' else 'warning'
            label = bm.group(2).strip().rstrip(':')
            label = re.sub(r'^TÓM TẮT\s*[—-]\s*', 'Tóm tắt: ', label)
            label = 'Tóm tắt' if label == 'TÓM TẮT' else label
            body = [bm.group(3).strip()] if bm.group(3).strip() else []
            i += 1
            while i < len(lines) and lines[i].startswith('>'):
                body.append(re.sub(r'^>\s?', '', lines[i])); i += 1
            body = [fix_prose(b) for b in body]
            while body and not body[0].strip(): body.pop(0)
            while body and not body[-1].strip(): body.pop()
            out.append(f':::{kind}[{fix_prose(label)}]')
            out.extend(body)
            out.append(':::')
            continue

        hm = re.match(r'^(#{1,6})\s+(.*)$', l)
        if hm:
            level, h = hm.group(1), fix_prose(hm.group(2))
            h = re.sub(r'\s+-\s+', ': ', h, count=1)   # "A - B" -> "A: B" in headings
            if len(level) == 1:
                level = '##'  # only one H1 per page (the title)
            out.append(f'{level} {sentence_case(h)}')
            i += 1; continue

        am = re.match(r'^>\s*—\s*(.+)$', l)
        if am:
            if out and out[-1].startswith('>'):
                out.append('>')
            out.append(f'> *{am.group(1).strip()}*')
            i += 1; continue
        out.append(fix_prose(l))
        i += 1

    out = book_callouts(out)
    body = '\n'.join(out)
    body = re.sub(r'\[([^\]]+)\]\(([^)\s]+\.md(?:#[^)]*)?)\)', link_target, body)
    body = narrative_cleanup(body)
    body = re.sub(r'\n{3,}', '\n\n', body).strip() + '\n'

    # 5. front matter
    words = len(re.findall(r'\w+', body))
    minutes = max(1, math.ceil(words / 220))
    if chap:
        full_title = f'Chương {chap}. {sentence_case(fix_prose(strip_heading_md(title)))}'
        label = f'{chap}. {sentence_case(fix_prose(strip_heading_md(title)))}'
    elif title:
        prefix = ''
        if src_name.startswith('phu-luc-') and 'glossary' not in src_name:
            prefix = f'Phụ lục {src_name[8].upper()}. '
        t = sentence_case(fix_prose(strip_heading_md(title)))
        t = re.sub(r'^Glossary: ', '', t)
        full_title = prefix + t
        label = full_title
    else:
        full_title = label = src_name
    fm = ['---',
          f'title: "{full_title}"',
          f'sidebar_label: "{label}"',
          f'sidebar_position: {pos}']
    if chap:
        fm.append(f'chapter: {chap}')
    if subtitle:
        fm.append(f'subtitle: "{fix_prose(subtitle)}"')
    fm.append(f'reading_time: {minutes}')
    fm.append(f'source_file: "{src_name}"')
    fm.append('editorial_status: "mechanical"')
    fm.append('---')
    return dest, '\n'.join(fm) + '\n\n' + body

CH_LINKS = {}
def glossary_body(body):
    # "**EN (VN)**\nDefinition *→ Ch.8, Ch.12*"  ->  "### EN" + Vietnamese term + chapter links
    def ch_link(n):
        for src, (dest, _, chap) in MAP.items():
            if chap == n:
                return f'[Chương {n}](' + rel(dest) + ')'
        return f'Chương {n}'
    def repl(m):
        term, rest = m.group(1).strip(), m.group(2)
        vn = None
        tm = re.match(r'^(.*?)\s*\((.+)\)$', term)
        if tm:
            term, vn = tm.group(1).strip(), tm.group(2).strip()
        refs = ''
        rm = re.search(r'\*→\s*([^*]+)\*\s*$', rest)
        if rm:
            rest = rest[:rm.start()].rstrip()
            nums = [int(x) for x in re.findall(r'Ch\.?\s*(\d+)', rm.group(1))]
            if nums:
                refs = '\n\nXuất hiện trong: ' + ', '.join(ch_link(n) for n in nums) + '.'
        out = f'### {term}\n\n'
        if vn:
            out += f'*{vn}*\n\n'
        return out + rest.strip() + refs + '\n'
    return re.sub(r'^\*\*([^*\n]+)\*\*\n((?:(?!\*\*|##).+\n?)+)', repl, body, flags=re.M)

# Narrative voice. Only prose is touched: text inside fenced code blocks
# (code samples, ASCII diagrams, mermaid) is left exactly as written.
# In prose, notes about where a statement was checked ("verified: x.md"),
# references to the manuscript and remarks about anonymization are removed or
# rewritten as plain statements about VLP.
NARRATIVE_REWRITES = [
    # preface
    ('Hệ sinh thái được sử dụng làm nền tảng xuyên suốt cuốn sách này - được gọi là **VLP** - là',
     'Hệ sinh thái xuyên suốt cuốn sách này, **VLP**, là'),
    ('Đây không phải là hệ thống giả định hay ví dụ đơn giản hóa - đây là một hệ thống production thực tế với tất cả sự phức tạp mà thực tế đòi hỏi.',
     'VLP không phải một ví dụ đơn giản hóa: hệ thống đang vận hành hằng ngày, với đầy đủ sự phức tạp mà nghiệp vụ tín dụng đòi hỏi.'),
    ('Tên, chi tiết định danh và thông tin độc quyền đã được ẩn danh hóa. Nhưng các vấn đề, quyết định thiết kế, và bài học - tất cả đều là thật.',
     'Dữ liệu là mô phỏng. Nhưng các vấn đề, quyết định thiết kế và bài học, tất cả đều là thật.'),
    # ch08
    ('**Actual ChargingGateway interface:**', '**Interface ChargingGateway:**'),
    ('Lưu ý: sách trước đây mô tả 5 channels (TARIFF_RESOLVED, FEE_CALCULATED, ITEM_CREATED, BALANCE_UPDATED) - đây là **sai**. Thực tế chỉ có 2 gateway channels chính.',
     'Toàn bộ chuỗi billing chỉ đi qua **2 gateway channel**. Các bước resolve tariff, tính phí, tạo item và cập nhật số dư diễn ra bên trong chuỗi xử lý nội bộ, không phải mỗi bước một channel riêng.'),
    # ch07
    ('**Infinispan cache - cách dùng thực tế:**', '**Infinispan cache trong LOS:**'),
]
_DROP_PROSE = re.compile(r'^\s*\*\(verified:[^)]*\)\*\s*$')
_INLINE_PROSE = [(re.compile(r'\s*\(verified:[^)]*\)'), '')]
_FENCE = re.compile(r'^\s*(```|~~~)')


def _clean_prose(text):
    for a, b in NARRATIVE_REWRITES:
        text = text.replace(a, b)
    out, skip_quote = [], False
    for l in text.split('\n'):
        if l.startswith('> Lưu ý: **Lưu ý về code examples:**'):
            skip_quote = True; continue
        if skip_quote:
            if l.startswith('>'): continue
            skip_quote = False
        if _DROP_PROSE.match(l): continue
        for rx, rep in _INLINE_PROSE:
            l = rx.sub(rep, l)
        out.append(l)
    return '\n'.join(out)


def narrative_cleanup(body):
    """Apply _clean_prose to everything outside fenced code blocks."""
    parts, buf, in_code = [], [], False
    for l in body.split('\n'):
        if _FENCE.match(l):
            if not in_code:
                parts.append(_clean_prose('\n'.join(buf))); buf = [l]; in_code = True
            else:
                buf.append(l); parts.append('\n'.join(buf)); buf = []; in_code = False
            continue
        buf.append(l)
    parts.append('\n'.join(buf) if in_code else _clean_prose('\n'.join(buf)))
    return '\n'.join(p for p in parts)


def main():
    done = []
    for name in MAP:
        p = os.path.join(SRC, name)
        if not os.path.exists(p):
            print('MISSING', name); continue
        dest, content = transform(name, open(p, encoding='utf-8').read())
        if dest in HAND_EDITED:
            print('skip (hand-edited)', dest); continue
        CURRENT[0] = dest
        if dest == 'glossary/index.md':
            head, _, rest = content.partition('\n---\n')
            content = head + '\n---\n' + glossary_body(rest)
            content = re.sub(r'title: ".*?"', 'title: "Thuật ngữ"', content, count=1)
            content = re.sub(r'sidebar_label: ".*?"', 'sidebar_label: "Thuật ngữ"', content, count=1)
        out = os.path.join(DOCS, dest)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w', encoding='utf-8').write(content)
        done.append(dest)
    print('written', len(done))
    for r in REPAIR_LOG:
        print('repair:', r)

if __name__ == '__main__':
    main()
