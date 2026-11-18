#!/usr/bin/env python3
"""Apply the technical-identifier renaming (entities.json "technical") to hand-written
files that the transform pipeline does not regenerate. Idempotent.

    python3 scripts/apply_technical.py docs/foundations/ch02-mathematics-of-lending.mdx ...
"""
import runpy, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
g = runpy.run_path(os.path.join(ROOT, 'scripts', 'transform.py'), run_name='lib')
for path in sys.argv[1:]:
    t = open(path, encoding='utf-8').read()
    n = g['rename_technical'](t)
    if n != t:
        open(path, 'w', encoding='utf-8').write(n)
        print('updated', path)
