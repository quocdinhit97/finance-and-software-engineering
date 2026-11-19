#!/usr/bin/env python3
"""Generate docs/table-of-contents.md and its English translation from chapter front matter and numbered H2 headings.

English section titles come from the translated chapters; anchors keep the Vietnamese slugs,
which the English chapters set as explicit heading ids."""
import os, re, glob, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
PARTS = [('introduction', 'Mở đầu'), ('foundations', 'Phần I. Nền tảng'), ('products', 'Phần II. Sản phẩm'),
         ('system', 'Phần III. Hệ thống'), ('intelligence', 'Phần IV. Trí tuệ'), ('future', 'Phần V. Tương lai'),
         ('glossary', 'Thuật ngữ'), ('appendices', 'Phụ lục'), ('tools', 'Công cụ tính')]

def slug(h):
    # github-slugger compatible for the characters used in this book
    h = re.sub(r'`([^`]*)`', r'\1', h)
    h = re.sub(r'\*\(([^)]*)\)\*', r'(\1)', h)
    h = re.sub(r'[*_]', '', h).strip().lower()
    out = []
    for ch in h:
        cat = unicodedata.category(ch)
        if ch == ' ':
            out.append('-')
        elif ch in '-_' or cat[0] in 'LN' or cat in ('Mn', 'Mc'):
            out.append(ch)
    return ''.join(out)

def fm(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    d = {}
    if m:
        for line in m.group(1).split('\n'):
            k, _, v = line.partition(':')
            d[k.strip()] = v.strip().strip('"')
    return d

EN = os.path.join(ROOT, 'i18n', 'en', 'docusaurus-plugin-content-docs', 'current')
PARTS_EN = {'introduction': 'Introduction', 'foundations': 'Part I. Foundations', 'products': 'Part II. Products',
            'system': 'Part III. The System', 'intelligence': 'Part IV. Intelligence', 'future': 'Part V. The Future',
            'glossary': 'Glossary', 'appendices': 'Appendices', 'tools': 'Calculators'}
SEC = r'^## (\d+\.\d+ .+|[A-D]\.\d+ .+)$'

def sections(text):
    body = re.sub(r'```.*?```', '', text, flags=re.S)
    return [re.sub(r'\s*(\{#[^}]*\}|\{/\* #[^*]*\*/\})\s*$', '', h) for h in re.findall(SEC, body, re.M)]

def build(lang):
    if lang == 'vi':
        head = ['---', 'title: "Mục lục"', 'sidebar_label: "Mục lục"', 'sidebar_position: 0',
                'description: "Mục lục đầy đủ của cuốn sách, gồm các phần, chương và mục chính."', '---', '']
    else:
        head = ['---', 'title: "Table of contents"', 'sidebar_label: "Table of contents"', 'sidebar_position: 0',
                'description: "The full table of contents of the book, with its parts, chapters and main sections."',
                'lang: en', '---', '']
    lines = head
    for folder, label in PARTS:
        files = sorted(glob.glob(os.path.join(DOCS, folder, '*.md*')))
        if not files:
            continue
        lines.append(f'## {label if lang == "vi" else PARTS_EN[folder]}\n')
        entries = []
        for f in files:
            t = open(f, encoding='utf-8').read()
            d = fm(t)
            if d.get('draft') == 'true':
                continue
            pos = int(d.get('sidebar_position', '0') or 0)
            rel = os.path.relpath(f, DOCS).replace(os.sep, '/')
            url = '/docs/' + re.sub(r'(/index)?\.mdx?$', '', rel)
            vi_secs = sections(t)
            title, shown = d.get('title', rel), vi_secs
            ef = os.path.join(EN, rel)
            if lang == 'en' and os.path.exists(ef):
                et = open(ef, encoding='utf-8').read()
                title = fm(et).get('title', title)
                en_secs = sections(et)
                if len(en_secs) == len(vi_secs):
                    shown = en_secs
            entries.append((pos if not rel.endswith('index.md') else -1, title, url,
                            list(zip(shown, [slug(v) for v in vi_secs]))))
        for pos, title, rel, secs in sorted(entries):
            lines.append(f'- [{title}]({rel})')
            for s, anchor in secs:
                clean = re.sub(r'\*\(([^)]*)\)\*', r'(\1)', s)
                lines.append(f'  - [{clean}]({rel}#{anchor})')
        lines.append('')
    return '\n'.join(lines)

open(os.path.join(DOCS, 'table-of-contents.md'), 'w', encoding='utf-8').write(build('vi'))
open(os.path.join(EN, 'table-of-contents.md'), 'w', encoding='utf-8').write(build('en'))
print('ok')
