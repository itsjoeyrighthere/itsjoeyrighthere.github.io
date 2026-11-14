"""Convert extracted source pages into dated blog articles and an index."""
import json
import re
from pathlib import Path
root = Path(__file__).resolve().parents[1]
m = json.loads((root/'src/data/duan/manifest.json').read_text())
pages=[]
for p in sorted((root/'src/data/duan').glob('[0-9]*.json')):
    pages += json.loads(p.read_text())['pages']
clean=[]
def compact(value):
    return re.sub(r'\s+', '', value).upper().replace('⋯⋯', '……')

running_titles = {compact(b['title']) for b in m['bookmarks']}
def is_running_header(line):
    value = compact(line)
    if '段永平网易博客全集（卷' in value:
        return True
    # Long running titles may touch their page number with no separating space.
    # Match a known title, rather than deleting arbitrary numbered body text.
    for number in re.finditer(r'\d+', value):
        if number.start() == 0 and value[number.end():] in running_titles:
            return True
        if number.end() == len(value) and value[:number.start()] in running_titles:
            return True
    return False

for page in pages:
    lines=page.splitlines()
    if lines and is_running_header(lines[0]):
        lines.pop(0)
    if lines and re.fullmatch(r'\d+',lines[-1].strip()): lines.pop()
    clean.append('\n'.join(lines).replace('⋯⋯','……')+'\n')
offsets=[]; total=0
for p in clean: offsets.append(total); total+=len(p)
text=''.join(clean)
starts=[]
for b in m['bookmarks']:
    title=b['title'].replace('⋯⋯','……')
    pattern=r'\s*'.join(re.escape(c) for c in title if not c.isspace())+r'\s*发表于[：:]\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})'
    start=offsets[b['page']-1]
    stop=offsets[b['page']+1] if b['page']+1<len(offsets) else len(text)
    match=next((hit for hit in re.finditer(pattern,text[start:stop]) if not starts or start+hit.start()>starts[-1]['start']), None)
    if match:
        starts.append({'title':b['title'],'date':match[1],'time':match[2], 'sourcePage': b['page'], 'start':start+match.start(),'bodyStart':start+match.end()})
starts.sort(key=lambda a:a['start'])
assert len(starts)==len(re.findall(r'发表于[：:]\s*\d{4}-\d{2}-\d{2}',text)), 'Every publication marker must have an article title'
assert len({a['start'] for a in starts})==len(starts)

def join_lines(lines):
    out=''
    for line in lines:
        line=line.strip()
        if not line: continue
        if out and out[-1].isascii() and line[0].isascii(): out+=' '
        out+=line
    return out

def paragraphs(raw, comments=False):
    result=[]; pending=[]
    for line in raw.splitlines():
        line=line.strip()
        if not line: continue
        speaker=bool(re.search(r'\(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\)',line))
        if pending and (speaker or (not comments and re.match(r'^(?:\d+[.、，]|[一二三四五六七八九十]+[、，])',line))):
            result.append(join_lines(pending)); pending=[]
        pending.append(line)
        if not comments and re.search(r'[。！？!?；;”」]$',line):
            result.append(join_lines(pending)); pending=[]
    if pending: result.append(join_lines(pending))
    return result
articles=[]
for i,a in enumerate(starts):
    raw=text[a['bodyStart']:starts[i+1]['start'] if i+1<len(starts) else len(text)].strip()
    sections=re.split(r'\n评论\s*\n', '\n'+raw, maxsplit=1)
    article={'id':str(i+1),'title':a['title'],'date':a['date'],'time':a['time'],'sourcePage':a['sourcePage'],'body':paragraphs(sections[0]),'comments':paragraphs(sections[1],True) if len(sections)>1 else []}
    articles.append(article)
(root/'src/data/duan/articles.json').write_text(json.dumps(articles,ensure_ascii=False))
index='''---
title: "段永平网易博客"
published: 2026-11-14
kind: writing
description: "段永平网易博客文章与评论，留在这里慢慢读。"
tags: [段永平, 阅读, 投资]
lang: zh-CN
draft: false
---

把段永平的网易博客留在这里，方便反复阅读。除了投资，也有关于企业、产品、生活和高尔夫的闲谈。评论里的问答一并保留，读的时候可以连着上下文一起看。

## 文章目录

'''
year=None
for a in articles:
    if a['date'][:4]!=year:
        year=a['date'][:4]; index+=f'\n### {year}\n\n'
    title=a['title'].replace('[','［').replace(']','］')
    index+=f'- {a["date"]} · [{title}](/library/duan/{a["id"]}/)\n'
index+='''
## 来源

原作者：段永平；评论归各发言者。整理资料由 @追求真知ing 提供，另参考 qicho.ng 的 2006–2018 合集。转载与引用沿用原文标注。

[带评论合集](/library/duan/netease-with-comments.pdf) · [2006–2018 合集](/library/duan/netease-2006-2018.pdf) · [更多资料](https://github.com/dorightyang/duan)
'''
(root/'src/content/posts/duan-yongping-blog.md').write_text(index)
print(f'Created {len(articles)} articles, {sum(len(a["comments"]) for a in articles)} comment paragraphs')
