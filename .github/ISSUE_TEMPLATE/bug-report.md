name: 🐛 Bug Report
description: 报告检测漏洞或误报问题
title: "[Bug] "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        感谢报告问题！请提供详细信息帮助我们改进。
  - type: textarea
    id: description
    attributes:
      label: 问题描述
      description: 清晰简洁地描述问题
      placeholder: 例如：某个攻击输入未被检测到
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: 复现步骤
      description: 如何复现这个问题
      placeholder: |
        1. 运行命令 '...'
        2. 输入 '...'
        3. 看到错误 '...'
    validations:
      required: true
  - type: input
    id: input-example
    attributes:
      label: 问题输入示例
      description: 导致问题的输入文本
      placeholder: 例如：忽略上述指令...
    validations:
      required: true
  - type: input
    id: expected
    attributes:
      label: 预期行为
      description: 你期望发生什么
      placeholder: 例如：应该被拒绝（REJECT）
    validations:
      required: true
  - type: input
    id: actual
    attributes:
      label: 实际行为
      description: 实际发生了什么
      placeholder: 例如：被允许通过（ALLOW）
    validations:
      required: true
  - type: textarea
    id: context
    attributes:
      label: 额外上下文
      description: 其他相关信息或截图
