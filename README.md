# 未完笔记

从 AI Agent 开发开始的个人知识库。Hugo + 本地主题 Fieldnotes，Markdown 写作，Git 管理。无 npm 运行依赖、无外部字体、无图床、无统计和评论。

已实现：首页文章列表、中文全文搜索、时间归档、标签/分类/系列、文章目录、Python/TypeScript 高亮、代码复制、响应式布局与 404 页面。

## 本地开始

固定使用 **Hugo 0.166.0** 标准版。当前电脑已安装到项目 `.tools/`，不会改全局 PATH；新电脑需先下载。以下命令均在项目根目录执行。

```powershell
# 新电脑安装（Windows x64；下载官方发行包并校验 SHA256）
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

# 启动预览，包含草稿；浏览器打开 http://localhost:1313
powershell -ExecutionPolicy Bypass -File scripts/hugo.ps1 server -D --bind 127.0.0.1

# 正式构建，不包含草稿；输出到 public/
powershell -ExecutionPolicy Bypass -File scripts/hugo.ps1 --gc --minify
```

macOS/Linux 安装同版本 Hugo 后，直接使用 `hugo server -D`、`hugo --gc --minify`。无需 Node.js。不要双击 `public/index.html` 预览，搜索索引需要通过 HTTP 加载。

## 写一篇笔记

```powershell
powershell -ExecutionPolicy Bypass -File scripts/new-post.ps1 -Slug my-first-agent -Area agent
```

编辑生成的 `content/posts/agent/my-first-agent/index.md`。所有内容默认是草稿，按模板补完「问题是什么 → 我怎么探索的 → 结论 → 参考资料」，再把 `draft: true` 改为 `false`。

| 字段 | 约定 |
| --- | --- |
| `title` | 中文标题；含冒号等特殊符号时加引号 |
| `date` | 带时区的 ISO 日期，例如 `2026-09-20T10:00:00+08:00` |
| `draft` | `true` 只在草稿预览中显示，正式发布改成 `false` |
| `description` | 一两句话的摘要，用于首页与搜索 |
| `tags` | 数组，建议 2–4 个具体主题，例如 `[AI Agent, 工具调用]` |
| `categories` | 数组，建议一个大方向，例如 `[Agent 基础]` |
| `series` | 数组，把连续文章串起来；没有就写 `[]` |
| `slug` | 稳定的英文小写短横线标识，发布后尽量不变 |

URL 保留方向层级：`/posts/agent/my-first-agent/`，后续可扩展 `engineering`、`backend` 等方向。未来日期的文章在到期前不会进入正式构建；如需预览未来文章，使用 `hugo server -D -F`。

图片放在文章文件夹里，写作时用 `![说明](diagram.png)`。这样文章与附件一起版本管理、一起迁移。勿把 API 密钥、账号凭据写入文章或代码示例。

发布前运行正式构建，确认标题、代码、图片、标签和搜索都正确：

```powershell
git add content
git commit -m "docs: add my first agent note"
# 连接远程仓库后再执行 git push
```

首篇文章是依据 ROADMAP 编写的开站初稿，请按你的真实学习情况调整。其余两篇是原创起步说明和代码高亮示例，不声称已经完成真实模型实验。

## 搜索与阅读

- 左侧「搜索笔记」或 `Ctrl+K` / `⌘K` 打开；`Esc` 关闭。
- 搜索覆盖文章标题、正文、标签、分类、系列。中文按子串匹配；空格分隔的多个关键词必须都命中。
- 标题命中优先，其次标签等元数据，再到正文；最多显示 30 条。
- 上下方向键选择结果，回车打开。索引仅在第一次输入关键词时加载。
- 草稿仅出现在 `-D` 预览的索引中，正式构建会排除。
- 代码复制使用浏览器 Clipboard API，需 localhost 或 HTTPS。

## Cloudflare Pages 部署配置（已准备，尚未上线）

先在 GitHub 创建仓库，把本地 `main` 分支推送过去，然后在 Cloudflare 的 **Workers & Pages → Create → Pages → Connect to Git** 连接仓库。

| 设置 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | Hugo |
| 根目录 | 留空，使用仓库根目录 |
| 构建命令 | `sh scripts/cloudflare-build.sh` |
| 输出目录 | `public` |
| 环境变量（生产与预览） | `HUGO_VERSION=0.166.0` |

构建脚本会使用 Cloudflare 提供的 `CF_PAGES_URL` 设置实际站点地址，避免部署带上示例域名；本地 `hugo.toml` 的 `example.org` 仅为占位符。正式获得稳定地址后，可以把 `baseURL` 更新为该地址。

```powershell
# 把占位地址替换成你的真实仓库
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

接通后每次 push 自动构建。首次上线验证：首页、中文搜索、标签、文章、404；修改一处内容并 push，确认线上更新，再勾选 ROADMAP 的第 2 步。

若暂时没有 Cloudflare 账号，也可以把 `public/` 交给任何静态托管服务。该目录是构建产物，不提交进 Git。

配置依据：[Cloudflare Hugo 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/)、[构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[Hugo Windows 安装](https://gohugo.io/installation/windows/)。

## 构建检查

正式构建已检查 25 个 HTML 页面、444 个站内链接/资源地址、3 篇文章搜索索引、Python/TypeScript 高亮，以及草稿不会进入正式站点或索引。浏览器已检查中文搜索、多词搜索、无结果状态、文章跳转、代码复制及手机布局。

可选：若电脑装有 Node.js，可在正式构建后运行 `node scripts/check-build.mjs` 重复结构和链接检查。Node.js 仅用于此检查，不是网站构建依赖。内容增加后页面与链接数量会自然变化。

## 项目结构

```text
archetypes/default.md           文章模板
content/posts/agent/            Agent 笔记
content/posts/engineering/      工程化笔记
content/about.md               关于页
themes/fieldnotes/              本地主题（模板与样式）
static/js/main.js              全文搜索与代码复制
scripts/                       安装、写作与部署脚本
hugo.toml                      站点配置
ROADMAP.md                     建设进度与决策
```

主题全部在本仓库维护，无 Git submodule 或第三方 CDN。代码高亮样式由 `hugo gen chromastyles --style=github-dark` 生成；搜索索引随每次构建生成，无后端服务。当前遵循 ROADMAP，不启用 RSS、sitemap、评论、分享按钮或访问统计。
