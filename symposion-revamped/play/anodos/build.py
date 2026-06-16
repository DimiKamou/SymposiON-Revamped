#!/usr/bin/env python3
"""
Rebuild Anodos-standalone.html from the editable sources in ./src.

The standalone is a self-contained bundle: a JSON manifest of base64+gzip assets
plus a JSON-encoded HTML template. This script swaps the JS module assets and the
two CSS <style> blocks (anodos.css, anodos-meta.css) with the contents of ./src,
preserving everything else (React/Babel runtimes, fonts, thumbnail, loader).

Usage:  python build.py
Edit the files under src/ then re-run this to ship.
"""
import json, base64, gzip, re, os, io

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, 'Anodos-standalone.html')
SRC = os.path.join(HERE, 'src')

# src filename -> asset uuid prefix in the manifest
ASSET_FILES = {
    'tweaks-panel.jsx':      '603fecd3',
    'anodos-data.jsx':       '9c7705ed',
    'anodos-sfx.jsx':        'a1b2c3d4',
    'anodos-meta.jsx':       '964c388a',
    'anodos-encounters.jsx': 'a4fb8f33',
    'anodos-hub.jsx':        '506ae4e8',
    'anodos-app.jsx':        '6383d397',
}
# style block index (in the template) -> src css file
CSS_BLOCKS = {1: 'anodos.css', 2: 'anodos-meta.css'}


def gz_b64(text):
    buf = io.BytesIO()
    with gzip.GzipFile(fileobj=buf, mode='wb', mtime=0) as g:
        g.write(text.encode('utf-8'))
    return base64.b64encode(buf.getvalue()).decode('ascii')


def read_src(name):
    with open(os.path.join(SRC, name), 'r', encoding='utf-8') as f:
        return f.read()


def guard(dumped):
    # escape </script so the embedding <script> block is not truncated by the
    # HTML parser; JSON decodes / back to a literal "/".
    return re.sub(r'</(script)', r'<\\u002F\1', dumped, flags=re.IGNORECASE)


def main():
    with open(BASE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    manifest = json.loads(lines[175])
    template = json.loads(lines[183])
    prefix_to_full = {u[:8]: u for u in manifest}

    for fname, prefix in ASSET_FILES.items():
        full = prefix_to_full[prefix]
        text = read_src(fname)
        manifest[full]['data'] = gz_b64(text)
        manifest[full]['compressed'] = True
        print(f'  asset {prefix} <- src/{fname} ({len(text)} chars)')

    styles = re.findall(r'<style[^>]*>(.*?)</style>', template, re.DOTALL)
    assert len(styles) == 3, f'expected 3 style blocks, got {len(styles)}'
    for idx, fname in CSS_BLOCKS.items():
        new_css = read_src(fname)
        old_css = styles[idx]
        assert template.count(old_css) == 1, f'style block {idx} not unique'
        template = template.replace(old_css, new_css, 1)
        print(f'  style block {idx} <- src/{fname} ({len(new_css)} chars)')

    lines[175] = guard(json.dumps(manifest, ensure_ascii=False)) + '\n'
    lines[183] = guard(json.dumps(template, ensure_ascii=False)) + '\n'
    with open(BASE, 'w', encoding='utf-8', newline='') as f:
        f.writelines(lines)
    print('Built', BASE, '->', os.path.getsize(BASE), 'bytes')


if __name__ == '__main__':
    main()
