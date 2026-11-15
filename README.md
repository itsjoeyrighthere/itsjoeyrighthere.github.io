# Joey — 个人博客与记录

使用 Astro 生成静态博客，部署到 https://itsjoeyrighthere.github.io。

## 写博客从这里开始

**文章放 `content/posts/`，图片和附件放 `static/`，详细用法看 [写作指南](写作指南.md)。**

```sh
npm ci
npm run new -- my-first-post
npm run dev
```

打开生成的 `content/posts/my-first-post.md`，修改标题、日期和正文。新文件默认 `draft: true`；改成 `false` 后才会出现在网站、RSS 和全文搜索中。`npm run new-post` 仍可使用。

## 目录怎么分

```text
.
├── content/                    博客内容，日常写作从这里找
│   ├── posts/                  Markdown 文章、项目和随记
│   └── library/duan/           段永平博客资料集
│       ├── articles.json       整理后的正文、日期和评论
│       └── source-pages/       原始分页提取及来源校验信息
├── static/                     原样发布的图片和附件
│   ├── images/                 文章配图
│   ├── library/duan/           资料集的两份原始 PDF
│   ├── favicon.svg             网站图标
│   └── .nojekyll               GitHub Pages 标记
├── archetypes/post.md          新文章模板
├── src/                        网站程序：页面、布局、组件、样式
│   └── content.config.ts       内容读取位置与字段校验
├── scripts/                    新建文章、搜索和资料导入工具
├── tests/                      自动检查
├── docs/design/                设计研究与历史方案（如有）
├── 写作指南.md                  写作、配图、预览和发布说明
├── astro.config.mjs            域名、静态文件目录和构建设置
└── dist/                       自动生成的网站，不要手动编辑
```

目录分工参考 [Hugo 的 content、static、archetypes](https://gohugo.io/getting-started/directory-structure/) 和 [Hexo 的内容目录、写作模板](https://hexo.io/docs/setup)。站点仍使用 Astro；通过配置从根目录读取内容和静态文件，构建结果输出到 `dist/`。

`content/` 中的 Markdown 会被渲染，`static/` 中的文件会原样复制。例如 `static/images/photo.webp` 对应网站 `/images/photo.webp`。草稿的 Markdown 不会生成页面，但放进 `static/` 的附件始终公开，不受文章的 `draft` 字段控制。

段永平资料集的维护细节见 [资料集说明](content/library/duan/README.md)。已有文章、资料集和 PDF 的网址保持不变。

## 预览与检查

建议使用 Node.js 24（CI 使用同一版本）；测试还需要 Python 3，正常构建无需安装 Python PDF 库。

```sh
npm run dev          # 开发预览，保存文章后自动更新
npm test             # 写作工具、配色与资料导入检查
npm run check        # Astro 类型和内容检查
npm run build        # 生成网站与 Pagefind 中文全文搜索
npm run preview      # 查看构建结果，包括全文搜索
```

开发预览只展示已发布内容；草稿不会生成页面。检查文章页面时，将对应文件的 `draft` 临时改为 `false`，未准备发布时改回 `true`。正文支持标题、列表、引用、表格、链接、图片和代码块，二、三级标题形成阅读目录。

## 页面与发布

- `/`：最新文章、项目、随记与简要索引。
- `/archive/`：完整索引、分类、标题与标签搜索、全文搜索。
- `/posts/<slug>/`：记录正文。
- `/library/duan/<id>/`：资料集单篇正文与评论。
- `/about/`：介绍和链接。
- `/rss.xml`：订阅。

旧 `/blog/<slug>/` 链接保留静态跳转页、canonical 和手动继续链接。

GitHub 仓库 Settings → Pages → Source 选择 **GitHub Actions**。提交并推送到 `main` 后，工作流运行测试、类型检查和生产构建，再发布 `dist/`；PR 只检查，不发布。正式域名配置在 `astro.config.mjs`。

## 网站维护

布局在 `src/layouts/Base.astro`，样式在 `src/styles/site.css`，内容字段在 `src/content.config.ts`。网站支持七种配色，选择保存在访客自己的浏览器；站内导航使用 Astro ClientRouter，减少动画偏好下关闭过渡。没有后台、数据库或运行时服务。

六篇旧 AI 示例保留为草稿，可参考格式；原有头像素材保留在 `src/assets/images/`。原模板版权声明见 LICENSE。
