#!/usr/bin/env python3
"""Generate docs/table-of-contents.md from chapter front matter and numbered H2 headings."""
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

lines = ['---', 'title: "Mục lục"', 'sidebar_label: "Mục lục"', 'sidebar_position: 0',
         'description: "Mục lục đầy đủ của cuốn sách, gồm các phần, chương và mục chính."', '---', '']
for folder, label in PARTS:
    files = sorted(glob.glob(os.path.join(DOCS, folder, '*.md*')))
    if not files:
        continue
    lines.append(f'## {label}\n')
    entries = []
    for f in files:
        t = open(f, encoding='utf-8').read()
        d = fm(t)
        if d.get('draft') == 'true':
            continue
        pos = int(d.get('sidebar_position', '0') or 0)
        rel = os.path.relpath(f, DOCS).replace(os.sep, '/')
        url = '/docs/' + re.sub(r'(/index)?\.mdx?$', '', rel)
        body = re.sub(r'```.*?```', '', t, flags=re.S)
        secs = [h for h in re.findall(r'^## (\d+\.\d+ .+|[A-D]\.\d+ .+)$', body, re.M)]
        entries.append((pos if not rel.endswith('index.md') else -1, d.get('title', rel), url, secs))
    for pos, title, rel, secs in sorted(entries):
        lines.append(f'- [{title}]({rel})')
        for s in secs:
            clean = re.sub(r'\*\(([^)]*)\)\*', r'(\1)', s)
            lines.append(f'  - [{clean}]({rel}#{slug(s)})')
    lines.append('')
open(os.path.join(DOCS, 'table-of-contents.md'), 'w', encoding='utf-8').write('\n'.join(lines))
print('ok')
