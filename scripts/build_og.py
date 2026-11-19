#!/usr/bin/env python3
"""Generate one social preview image (1200x630) per book page and locale.

Output: static/img/og/<locale>/<doc id>.png, used by src/theme/DocItem/Metadata
as og:image / twitter:image. Rerun after changing a title or adding a page:

    python3 scripts/build_og.py [--font-dir /usr/share/fonts/opentype/inter]

Needs Pillow and the Inter OTF fonts (Regular, SemiBold, Bold), which cover
Vietnamese. Pages under docs/reference are skipped (they are not published).
"""
import argparse
import glob
import os
import re

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
EN = os.path.join(ROOT, 'i18n', 'en', 'docusaurus-plugin-content-docs', 'current')
OUT = os.path.join(ROOT, 'static', 'img', 'og')
W, H = 1200, 630
INK, MUTED, PRIMARY, RULE, PAPER, TINT = '#1d2329', '#5b6672', '#097d5e', '#e3e6ea', '#ffffff', '#effaf6'

BOOK = {'vi': 'Kiến trúc tín dụng', 'en': 'The Architecture of Credit'}
TAGLINE = {'vi': 'Hệ thống tài chính tiêu dùng: từ kinh tế học đến mã nguồn',
           'en': 'Consumer finance systems: from economics to source code'}
PARTS = {
    'vi': {'introduction': 'Mở đầu', 'foundations': 'Phần I. Nền tảng', 'products': 'Phần II. Sản phẩm',
           'system': 'Phần III. Hệ thống', 'intelligence': 'Phần IV. Trí tuệ', 'future': 'Phần V. Tương lai',
           'glossary': 'Tra cứu', 'appendices': 'Phụ lục', 'tools': 'Công cụ'},
    'en': {'introduction': 'Introduction', 'foundations': 'Part I. Foundations', 'products': 'Part II. Products',
           'system': 'Part III. The System', 'intelligence': 'Part IV. Intelligence', 'future': 'Part V. The Future',
           'glossary': 'Reference', 'appendices': 'Appendices', 'tools': 'Calculators'},
}
CHAPTER = {'vi': 'Chương {n}', 'en': 'Chapter {n}'}


def front_matter(path):
    text = open(path, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    d = {}
    if m:
        for line in m.group(1).split('\n'):
            k, _, v = line.partition(':')
            d[k.strip()] = v.strip().strip('"')
    return d


def wrap(draw, text, font, width, max_lines):
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = f'{cur} {w}'.strip()
        if draw.textlength(trial, font=font) <= width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while draw.textlength(lines[-1] + '…', font=font) > width and ' ' in lines[-1]:
            lines[-1] = lines[-1].rsplit(' ', 1)[0]
        lines[-1] += '…'
    return lines


def render(locale, doc_id, fm, fonts, logo):
    folder = doc_id.split('/')[0] if '/' in doc_id else ''
    title = fm.get('title', doc_id)
    eyebrow_parts = []
    if fm.get('chapter'):
        eyebrow_parts.append(CHAPTER[locale].format(n=fm['chapter']))
        title = re.sub(r'^(Chương|Chapter) \d+\.\s*', '', title)
    if folder in PARTS[locale] and not doc_id.endswith('/index'):
        eyebrow_parts.append(PARTS[locale][folder])
    eyebrow = '  ·  '.join(eyebrow_parts)

    img = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 18, H], fill=PRIMARY)
    x, right = 90, W - 90
    y = 92
    if eyebrow:
        d.text((x, y), eyebrow.upper(), font=fonts['eyebrow'], fill=PRIMARY)
        y += 64
    size = 66
    while True:
        tf = ImageFont.truetype(fonts['bold_path'], size)
        lines = wrap(d, title, tf, right - x, 3)
        if len(lines) <= 3 and (len(lines) < 3 or size <= 54):
            break
        size -= 4
    for line in lines:
        d.text((x, y), line, font=tf, fill=INK)
        y += int(size * 1.22)
    desc = fm.get('description', '')
    room = (H - 180 - (y + 18)) // 40
    if desc and room >= 1:
        y += 18
        for line in wrap(d, desc, fonts['desc'], right - x, min(3, room)):
            d.text((x, y), line, font=fonts['desc'], fill=MUTED)
            y += 40
    # footer: logo + book name + tagline
    d.line([(x, H - 150), (right, H - 150)], fill=RULE, width=2)
    lg = logo.resize((72, 72), Image.LANCZOS)
    img.paste(lg, (x, H - 120), lg)
    d.text((x + 92, H - 118), BOOK[locale], font=fonts['brand'], fill=INK)
    d.text((x + 92, H - 78), TAGLINE[locale], font=fonts['tagline'], fill=MUTED)
    out = os.path.join(OUT, locale, doc_id + '.png')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out, optimize=True)
    return out


def doc_id_of(rel):
    return re.sub(r'\.mdx?$', '', rel)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font-dir', default='/usr/share/fonts/opentype/inter')
    a = ap.parse_args()
    f = lambda name: os.path.join(a.font_dir, name)
    fonts = {
        'bold_path': f('Inter-Bold.otf'),
        'eyebrow': ImageFont.truetype(f('Inter-SemiBold.otf'), 26),
        'brand': ImageFont.truetype(f('Inter-SemiBold.otf'), 30),
        'tagline': ImageFont.truetype(f('Inter-Regular.otf'), 24),
        'desc': ImageFont.truetype(f('Inter-Regular.otf'), 28),
    }
    logo = Image.open(os.path.join(ROOT, 'static', 'img', 'logo.png')).convert('RGBA')
    count = 0
    for path in sorted(glob.glob(os.path.join(DOCS, '**', '*.md*'), recursive=True)):
        rel = os.path.relpath(path, DOCS).replace(os.sep, '/')
        if rel.startswith('reference/'):
            continue
        fm = front_matter(path)
        if fm.get('draft') == 'true':
            continue
        render('vi', doc_id_of(rel), fm, fonts, logo)
        en = os.path.join(EN, rel)
        render('en', doc_id_of(rel), front_matter(en) if os.path.exists(en) else fm, fonts, logo)
        count += 1
    print(f'{count} pages x 2 locales → static/img/og/')


if __name__ == '__main__':
    main()
