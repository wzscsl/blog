---
title: "拆开一个最小 Agent：状态、工具与循环"
date: 2026-09-20T08:30:00+08:00
draft: false
description: "先放下框架，用一个不连接模型 API 的教学示例，观察请求工具、回填结果和结束循环这三个动作。"
tags: [AI Agent, 工具调用, Python, TypeScript]
categories: [Agent 基础]
series: [Agent 学习起点]
slug: minimal-tool-loop
---

## 问题是什么

一次函数调用和一个 Agent 循环，区别在哪里？工具返回结果之后，又由谁决定下一步？

这篇用一个**完全本地、没有模型 API 的教学示例**，只演示状态传递。它不代表任何 SDK 的真实接口，也不具备实际模型的推理能力。

## 我怎么探索的

先把过程缩成三个动作：产生下一步动作、执行工具、把结果放回状态。为了能直接观察，把模型响应替换成一个确定性的函数。

### Python：先看状态怎么流动

保存为 `loop.py` 后，用 Python 3 运行。预期输出 `工具结果是 5`。

```python
def next_action(state):
    if "tool_result" not in state:
        return {"type": "tool", "name": "add", "args": {"a": 2, "b": 3}}
    return {"type": "done", "text": f"工具结果是 {state['tool_result']}"}


tools = {"add": lambda a, b: a + b}
state = {}

for step in range(4):
    action = next_action(state)
    if action["type"] == "done":
        print(action["text"])
        break
    if action["name"] not in tools:
        raise ValueError("未知工具")
    state["tool_result"] = tools[action["name"]](**action["args"])
else:
    raise RuntimeError("超过最大步数")
```

第一轮请求 `add`，程序把计算结果写入 `state`；第二轮读取结果并结束。步数上限让示例即使无法结束，也不会无限运行。

### TypeScript：用类型表达动作

同样的流程，也可以先用联合类型表达「调用工具」和「完成」两种状态。下面只是类型与分支示例，不是一套完整运行时。

```typescript
type Action =
  | { type: "tool"; name: "add"; args: { a: number; b: number } }
  | { type: "done"; text: string };

function nextAction(result?: number): Action {
  if (result === undefined) {
    return { type: "tool", name: "add", args: { a: 2, b: 3 } };
  }
  return { type: "done", text: `工具结果是 ${result}` };
}
```

这里检查 `undefined`，而不是检查真假值，因为数字 `0` 也是有效的工具结果。

## 结论

这个玩具示例帮助拆开三个职责：决定动作、执行工具、保存状态。连接真实模型后，还需要处理参数校验、异常、超时、上下文和工具权限。

目前只演示流程，没有验证任何真实模型或框架。下一步可以给工具增加错误分支，记录「失败后如何继续」的策略。

## 参考资料

- 本文示例为项目自带的原创教学代码，用于理解循环和检查代码高亮。
- [Python 控制流文档](https://docs.python.org/3/tutorial/controlflow.html)
- [TypeScript 类型收窄文档](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
