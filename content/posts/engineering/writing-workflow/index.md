---
title: "给未来的自己，留一份能接着写的笔记"
date: 2026-09-20T08:00:00+08:00
draft: false
description: "一篇 Markdown，一个文章目录，一套固定的提问方式。把写作流程做轻，让知识积累这件事可以持续。"
tags: [Markdown, 写作流程]
categories: [工程化]
series: [知识库搭建]
slug: writing-workflow
---

## 问题是什么

一开始就追求完整的知识体系，往往会让写作本身变得困难。我需要一个简单到愿意反复使用的流程。

## 我怎么探索的

### 每篇文章有自己的小目录

采用 Hugo page bundle：正文叫 `index.md`，图片与正文放在一起。迁移时只需要移动整个文件夹。

```text
content/posts/agent/my-first-agent/
├── index.md
└── architecture.png
```

图片用相对地址引用：`![流程图](architecture.png)`。文件名尽量用英文小写和连字符，中文留给标题。

### 元数据只保留常用项

```yaml
title: "一个清楚的问题"
date: 2026-09-20T10:00:00+08:00
draft: true
description: "用一两句话说明这篇笔记解决什么问题。"
tags: [AI Agent, 工具调用]
categories: [Agent 基础]
series: [Agent 学习起点]
slug: my-first-agent
```

`tags`、`categories`、`series` 都用数组。方向由文章路径区分，例如 `agent/`、`engineering/`，以后还可以加入 `backend/`。

### 先留下问题，再完善答案

新文章默认是草稿。本地预览时能看到，正式构建时不会发布。写完检查代码、来源、图片和结论边界，再把 `draft` 改成 `false`。

## 结论

分类不用一次设计完，先让每篇文章都能写出来、找得到、看得懂。博客的价值来自持续积累，而不是工具数量。

操作命令、部署步骤和 front matter 约定，统一放在项目根目录的 README 中维护。

## 参考资料

- [Hugo Page bundles](https://gohugo.io/content-management/page-bundles/)
- [Hugo Front matter](https://gohugo.io/content-management/front-matter/)
