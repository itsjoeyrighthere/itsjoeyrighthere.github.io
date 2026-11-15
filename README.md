# Joey — Open archive

个人博客与记录站，使用 Astro 静态生成，部署到 `https://itsjoeyrighthere.github.io`。

视觉采用暖白底、蓝色大字号、档案标签与索引纸张叠层。提供纸白钴蓝、雾绿、暖玫瑰、夜墨、电蓝、信号黄、冷白七种配色；新增三主题区分展示、索引与阅读用色，正文采用中性白色阅读面。访客可在页脚「网站配色」中选择，选择仅保存在自己的浏览器。没有后台、数据库或运行时服务。

## 本地运行

建议使用 Node.js 24（CI 使用同一版本）。

```sh
npm ci
npm run dev
```

生产构建和完整搜索预览：

```sh
npm run test:themes
npm run check
npm run build
npm run preview
```

全文搜索由 Pagefind 在构建后生成，开发模式不返回虚构搜索结果。索引中的分类和标题/标签搜索在开发与生产环境均可用；禁用 JavaScript 时仍可浏览所有内容。

## 新增记录

```sh
npm run new-post -- my-first-post
npm run new-post -- project-name project
npm run new-post -- a-small-observation note
```

新文件默认是草稿，设置 `draft: false` 后进入页面、RSS 和搜索索引。详见 [写作说明](docs/writing.md)。

## 页面

- `/`：首页，最新文章、项目、随记与简要索引
- `/archive/`：完整索引、分类、标题/标签搜索、全文搜索
- `/posts/<slug>/`：内容详情与目录
- `/about/`：介绍和链接
- `/rss.xml`：订阅

原有 `/blog/<slug>/` 链接保留静态跳转页。GitHub Pages 不支持服务端 301，因此同时提供 canonical 和手动继续链接。

## 部署

仓库 Settings → Pages → Source 选择 **GitHub Actions**。工作流检查类型、构建站点和搜索索引，然后发布 `dist/`。PR 只检查构建，不发布。

正式域名配置在 `astro.config.mjs`。不需要模型 API、密钥或后端服务。

## 维护

布局在 `src/layouts/Base.astro`；样式在 `src/styles/site.css`；内容 schema 在 `src/content.config.ts`。

已移除旧 Next.js 遗留构建产物与 Fuwari 展示组件、主题面板、多语言包、Markdown 扩展、演示图片和重复包管理配置。原六篇 AI 示例正文保留，已设置为草稿，不对外发布；未确认用途的个人头像素材仍保留。

原模板版权声明保留在 LICENSE。当前站点未使用 Virgil Abloh 的商标、专有字体或官网素材。

站内导航使用 Astro ClientRouter 的短过渡，保留浏览历史和滚动行为；减少动画偏好下关闭过渡。普通链接使用下划线、当前页状态与阅读文案，箭头只保留在外部链接。
