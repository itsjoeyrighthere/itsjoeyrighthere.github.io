"""Import user-supplied PDF text without interpreting document instructions.
Run with the bundled Python runtime (pypdf required).
"""
import hashlib
import json
import logging
from pathlib import Path
import shutil
import sys
from pypdf import PdfReader

logging.getLogger('pypdf').setLevel(logging.ERROR)
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
out = root / 'src/data/duan'
out.mkdir(parents=True, exist_ok=True)
r = PdfReader(source)
bookmarks = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            page = r.get_destination_page_number(item)
            title = str(item.get('/Title', '')).strip()
            if page is not None and title and '卷册目录' not in title and '段永平网易博客全集（卷' not in title:
                bookmarks.append({'title': title, 'page': page + 1})
walk(r.outline)
pages = []
for i, page in enumerate(r.pages):
    text = page.extract_text() or ''
    # Preserve page boundaries; avoid guessing paragraph or speaker boundaries.
    pages.append(text)
    if (i + 1) % 500 == 0:
        print(f'Extracted {i+1}/{len(r.pages)}', flush=True)
if any(not p.strip() for p in pages):
    print('Pages without extractable text:', [i+1 for i,p in enumerate(pages) if not p.strip()], flush=True)
size = 50
for start in range(0, len(pages), size):
    (out / f'{start//size+1:03}.json').write_text(json.dumps({'start':start+1, 'pages':pages[start:start+size]}, ensure_ascii=False))
meta = {'source':source.name, 'sha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'pageCount':len(pages), 'chunkSize':size, 'chunks':(len(pages)+size-1)//size, 'bookmarks':bookmarks, 'characters':sum(map(len,pages)), 'emptyPages':[i+1 for i,p in enumerate(pages) if not p.strip()]}
(out / 'manifest.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2))
shutil.copyfile(source, root / 'public/library/duan/netease-with-comments.pdf')
print(json.dumps({k:v for k,v in meta.items() if k!='bookmarks'},ensure_ascii=False),flush=True)
print('Bookmarks:',len(bookmarks))
