---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
description: "用一两句话写清楚这篇笔记要解决的问题。"
tags: []
categories: [Agent 基础]
series: []
slug: "{{ .File.ContentBaseName }}"
---

## 问题是什么

<!-- 背景是什么？为什么需要解决？ -->

## 我怎么探索的

<!-- 记录资料、实验、代码、结果与失败尝试。图片放在同目录并使用相对路径。 -->

## 结论

<!-- 区分已验证的结论、适用边界和下一步。 -->

## 参考资料

<!-- 优先链接原始文档、论文和源码。 -->
