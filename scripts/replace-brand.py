# -*- coding: utf-8 -*-
# AIGC START
from pathlib import Path

SITE_ROOT = Path(r"d:\鑫紫鲸网站数据\kiwlmachine.com")
REPLACEMENTS = [
    ("张家港市金马星机械制造有限公司", "江苏鑫紫鲸机械制造集团有限公司"),
    ("金马星机械制造有限公司", "江苏鑫紫鲸机械制造集团有限公司"),
    ("金马星", "KIWL"),
]

def main():
    updated = []
    for path in SITE_ROOT.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".html", ".htm"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        orig = text
        for old, new in REPLACEMENTS:
            if old in text:
                text = text.replace(old, new)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            updated.append(str(path.relative_to(SITE_ROOT)).replace("\\", "/"))

    log = SITE_ROOT / "scripts" / "replace-brand-updated.txt"
    log.write_text("\n".join(sorted(updated)) + "\n", encoding="utf-8")
    print(f"Updated {len(updated)} files")
    print(f"Log: {log}")

if __name__ == "__main__":
    main()
# AIGC END
