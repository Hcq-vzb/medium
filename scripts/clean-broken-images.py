# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
IMG_RE = re.compile(r'<img\b[^>]*>', re.I)
SRC_RE = re.compile(r'\bsrc\s*=\s*(["\'])(.*?)\1', re.I)
UPLOAD_RE = re.compile(r'(?:www\.zjgjmx\.(?:com|cn)[/\\]+)?(uploadfile[/\\].+)$', re.I)
HTTP_UPLOAD_RE = re.compile(r'https?://[^/]+/(uploadfile/.+)$', re.I)

report = []
total_removed = 0
total_fixed = 0


def upload_rel_from_src(src: str):
    m = UPLOAD_RE.search(src.replace('\\', '/'))
    if m:
        return m.group(1).replace('\\', '/')
    m = HTTP_UPLOAD_RE.search(src)
    if m:
        return m.group(1)
    return None


def rel_from_html_to_root(html_path: Path, target: Path) -> str:
    try:
        rel = os.path.relpath(target, html_path.parent).replace('\\', '/')
        return rel
    except ValueError:
        depth = len(html_path.parent.relative_to(ROOT).parts)
        rel = str(target.relative_to(ROOT)).replace('\\', '/')
        return ('../' * depth) + rel if depth else rel


def resolve_src(html_path: Path, src: str):
    src = src.strip()
    if not src or src == '#' or src.lower().startswith('javascript:'):
        return None

    upload_rel = upload_rel_from_src(src)
    if upload_rel:
        full = ROOT / upload_rel.replace('/', os.sep)
        if full.is_file():
            return rel_from_html_to_root(html_path, full)

    if src.startswith(('http://', 'https://', '//')):
        return None

    candidate = (html_path.parent / src).resolve()
    if candidate.is_file():
        return rel_from_html_to_root(html_path, candidate)

    return None


def clean_empty_wrappers(html: str) -> str:
    html = re.sub(r'<div\s+class="img"\s*>\s*</div>', '', html, flags=re.I)
    html = re.sub(r'<div\s+style="text-align:\s*center;"\s*>\s*<br\s*/?>\s*</div>', '', html, flags=re.I)
    html = re.sub(
        r'(<div\s+style="text-align:\s*center;"\s*>\s*)<br\s*/?>\s*</div>',
        r'\1</div>',
        html,
        flags=re.I,
    )
    return html


for html_file in ROOT.rglob('*.html'):
    if 'node_modules' in html_file.parts:
        continue
    text = html_file.read_text(encoding='utf-8', errors='replace')
    orig = text
    removed = 0
    fixed = 0

    matches = list(IMG_RE.finditer(text))
    for m in reversed(matches):
        tag = m.group(0)
        sm = SRC_RE.search(tag)
        if not sm:
            text = text[: m.start()] + text[m.end() :]
            removed += 1
            continue
        src = sm.group(2)
        new_rel = resolve_src(html_file, src)
        if not new_rel:
            text = text[: m.start()] + text[m.end() :]
            removed += 1
            continue
        if src != new_rel:
            quote = sm.group(1)
            new_tag = SRC_RE.sub(f'src={quote}{new_rel}{quote}', tag, count=1)
            text = text[: m.start()] + new_tag + text[m.end() :]
            fixed += 1

    text = clean_empty_wrappers(text)
    if text != orig:
        html_file.write_text(text, encoding='utf-8', newline='')
        rel = str(html_file.relative_to(ROOT)).replace('\\', '/')
        report.append((rel, removed, fixed))
        total_removed += removed
        total_fixed += fixed

report.sort(key=lambda x: x[0])
report_path = ROOT / 'scripts' / 'broken-images-report.md'
lines = [
    '# 无效图片清理报告',
    '',
    f'生成时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
    '',
    '## 汇总',
    f'- 修改文件数: {len(report)}',
    f'- 删除无效 img 标签总数: {total_removed}',
    f'- 修正为本地有效路径的 img 标签总数: {total_fixed}',
    '',
    '说明: 对仍存在于 uploadfile/ 目录的图片，已将错误外链或 HTTrack 路径自动修正为相对路径，避免误删正常图片。',
    '',
    '## 明细',
    '',
    '| 文件路径 | 删除数量 | 路径修正数量 |',
    '|----------|----------|--------------|',
]
if not report:
    lines.append('| （无修改） | 0 | 0 |')
else:
    for rel, rem, fix in report:
        lines.append(f'| {rel} | {rem} | {fix} |')

report_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'Modified {len(report)} files. Removed: {total_removed}, Fixed: {total_fixed}')
print(f'Report: {report_path}')
