# 写作与内容维护

每一条记录放在 `src/content/posts/`，可以使用 Markdown 和子目录。URL 由文件路径生成，发布后请尽量保持文件名稳定。

```yaml
---
title: "记录的标题"
published: 2026-11-14
kind: writing
description: "一两句话，说明这份记录讲什么。"
tags: [设计, 记录]
lang: zh-CN
draft: true
---
```

- `kind`：`writing`（文章）、`project`（项目）、`note`（随记），默认 writing。
- `draft`：true 时不生成公开页面、不进入 RSS 或搜索。写完后改为 false。
- `updated`：可选，内容更新日期。
- `image`：可选，封面路径，例如 `/images/my-project.webp`。对应图片放在 `public/images/`。
- `imageAlt`：可选，为封面写有意义的替代说明。
- `external`：可选，完整的项目外部链接。
- `lang`：中文用 zh-CN，英文用 en。
- `category`：可选，保留旧文章分类，显示在阅读页。

首页自动选择最新文章、最新项目和最新随记。某类没有内容时显示明确空状态，不使用虚构内容填充。

正文支持标题、列表、引用、表格、链接、图片和代码块。二、三级标题自动形成阅读目录。全文搜索在 `npm run build` 后生成。

## 发布检查

1. 确认图片、链接与日期。
2. 将要发布的文件设置 `draft: false`。
3. 运行 `npm run check` 和 `npm run build`。
4. `npm run preview` 检查正文、手机布局和搜索。
5. 提交并推送到 main，由 GitHub Actions 发布。

搜索构建使用统一的中文语言索引，允许中英文内容在同一个搜索框里检索；各篇页面仍保留自己的 `lang`。

仓库里六篇旧 AI 示例已设为草稿，仅供格式参考。没有公开记录时，首页显示空白起点，全文搜索不会加载；发布第一条真实内容后自动启用。
