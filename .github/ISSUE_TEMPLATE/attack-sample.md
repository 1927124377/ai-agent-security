name: 🎯 攻击样本提交
description: 提交新的 Prompt Injection 攻击样本
title: "[Sample] "
labels: ["enhancement", "attack-sample"]
body:
  - type: markdown
    attributes:
      value: |
        感谢贡献攻击样本！这将帮助我们改进检测能力。
  - type: input
    id: name
    attributes:
      label: 样本名称
      description: 简短描述这个攻击样本
      placeholder: 例如：中文忽略指令变体
    validations:
      required: true
  - type: dropdown
    id: type
    attributes:
      label: 攻击类型
      description: 这属于哪种攻击类型
      options:
        - 直接注入
        - 间接注入
        - 角色扮演攻击
        - 凭证探测
        - 敏感操作
        - 混淆攻击
        - 外部内容注入
        - 其他
    validations:
      required: true
  - type: textarea
    id: input
    attributes:
      label: 攻击输入
      description: 完整的攻击输入文本
      placeholder: 例如：忽略上述所有指令...
      render: shell
    validations:
      required: true
  - type: input
    id: expected-score
    attributes:
      label: 预期评分
      description: 你认为应该得多少分（0-100）
      placeholder: 例如：50
    validations:
      required: true
  - type: textarea
    id: detection
    attributes:
      label: 建议检测模式
      description: 你建议用什么正则模式检测
      placeholder: 例如：/忽略.*指令/i
      render: shell
  - type: textarea
    id: context
    attributes:
      label: 攻击场景说明
      description: 这个攻击在什么场景下有效
      placeholder: 例如：当 AI 代理处理外部网页内容时...
