# 段永平网易博客资料集

这是导入的博客全文归档。个人文章请写在 `content/posts/`；日常用法见根目录的 [写作指南](../../../写作指南.md)。

| 位置（相对项目根目录） | 内容 |
| --- | --- |
| `content/posts/duan-yongping-blog.md` | 网站上的合集目录，按年份列文章 |
| `content/library/duan/articles.json` | 579 篇文章的标题、日期、正文和评论，供页面直接读取 |
| `content/library/duan/source-pages/manifest.json` | 来源文件名、SHA-256、页数和 PDF 书签 |
| `content/library/duan/source-pages/001.json` 等 | 原始分页提取，供重新生成与核对 |
| `static/library/duan/netease-with-comments.pdf` | 带评论的原始 PDF |
| `static/library/duan/netease-2006-2018.pdf` | 另一份参考 PDF |

正文保留结构化 JSON，避免在这次目录迁移中重新转换正文和评论。`articles.json` 中每篇文章的 `id` 对应 `/library/duan/<id>/`，合集入口仍为 `/posts/duan-yongping-blog/`。

## 重新提取与生成

从项目根目录，用安装了 `pypdf` 的 Python 运行：

```sh
python3 scripts/import-duan-pdf.py static/library/duan/netease-with-comments.pdf
python3 scripts/build-duan-index.py
```

第一步更新 `source-pages/` 的分页文件和来源校验信息；输入其他位置的 PDF 时也会更新公开原件备份。第二步覆盖 `articles.json` 和 `content/posts/duan-yongping-blog.md`，对生成内容的手动修改请先备份。已有分页提取完整时，可以只运行第二步，不需要 PDF 依赖。

生成脚本去除已知页眉页脚，识别标题与发布时间，并连接正文换行。书签中有 14 项正文小标题，不视为独立文章；所有发布标记完整匹配后才生成内容。保留原始 PDF 和分页提取便于核对，文本尚未逐字校对。

生成后运行 `npm test`、`npm run check`、`npm run build`，并用 `npm run preview` 检查合集、单篇正文、评论、前后篇和 PDF 链接。
