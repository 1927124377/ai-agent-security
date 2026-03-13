# AI Agent Security Toolkit - 项目摘要

## 📦 项目概述

**项目名称**: ai-agent-security-toolkit  
**版本**: v1.0.0  
**许可证**: MIT  
**创建日期**: 2026-03-14  

**目标**: 为 AI 代理（OpenClaw/Claude Code/等）提供 Prompt Injection 防御和安全审计工具，帮助更多开发者保护 AI 系统安全。

---

## 🎯 核心功能

### 1. 输入验证 (validate-input.js)
- ✅ 检测 Prompt Injection 攻击（中英文）
- ✅ 风险评分系统（0-100 分）
- ✅ 凭证探测防护
- ✅ 敏感操作检测（删除/执行/发送）
- ✅ 外部内容标记
- ✅ 输出验证（防止敏感信息泄露）

### 2. Skills 安全审计 (audit-skills-security.js)
- ✅ 扫描恶意代码模式（eval/Function/child_process）
- ✅ 检测 Base64 解码（隐藏代码）
- ✅ 识别凭证访问
- ✅ 发现 postinstall 钩子（GhostClaw 攻击）
- ✅ 生成详细安全报告

### 3. 凭证权限检查 (check-credentials-permissions.js)
- ✅ 验证 600 权限（仅所有者可读写）
- ✅ 自动修复模式
- ✅ 生成权限报告

---

## 📁 项目结构

```
ai-agent-security-toolkit/
├── scripts/                          # 核心脚本
│   ├── validate-input.js            # 输入验证
│   ├── audit-skills-security.js     # Skills 审计
│   └── check-credentials-permissions.js  # 凭证检查
├── samples/                          # 攻击样本库
│   └── prompt-injection/
│       └── README.md                # 22+ 攻击样本
├── docs/                             # 文档
│   ├── INTEGRATION.md               # 集成指南
│   ├── ATTACK-PATTERNS.md           # 攻击模式详解
│   └── SECURITY-BEST-PRACTICES.md   # 安全最佳实践
├── tests/                            # 测试
│   └── validate-input.test.js       # 单元测试
├── .github/                          # GitHub 配置
│   └── ISSUE_TEMPLATE/              # Issue 模板
├── README.md                         # 项目说明
├── CONTRIBUTING.md                   # 贡献指南
├── CHANGELOG.md                      # 变更日志
├── LICENSE                           # MIT 许可证
└── package.json                      # npm 配置
```

---

## 🛡️ 防御能力

### 检测的攻击类型

| 攻击类型 | 检测能力 | 样本数量 |
|----------|----------|----------|
| 直接注入 | ✅ | 8 |
| 间接注入 | ✅ | 2 |
| 角色扮演攻击 | ✅ | 2 |
| 凭证探测 | ✅ | 4 |
| 敏感操作 | ✅ | 7 |
| 混淆攻击 | ⚠️ | 2 |
| 外部内容注入 | ✅ | 2 |
| **总计** | **8 类** | **27 个** |

### 风险评分规则

| 风险项 | 分数 | 决策阈值 |
|--------|------|----------|
| 忽略系统指令 | +50 | ≥50 → REJECT |
| 角色扮演越狱 | +50 | 30-49 → WARN |
| 凭证目录访问 | +50 | <30 → ALLOW |
| 密码/密钥探测 | +40 | |
| Shell 命令执行 | +35 | |
| 代码执行请求 | +30-35 | |
| 外部内容来源 | +20 | |

---

## 📚 文档清单

| 文档 | 用途 | 字数 |
|------|------|------|
| README.md | 项目介绍和快速开始 | ~5,500 |
| INTEGRATION.md | 集成指南（OpenClaw/Claude Code） | ~6,900 |
| ATTACK-PATTERNS.md | 攻击模式详解 | ~3,500 |
| SECURITY-BEST-PRACTICES.md | 安全最佳实践 | ~4,900 |
| CONTRIBUTING.md | 贡献指南 | ~2,300 |
| CHANGELOG.md | 变更日志 | ~2,300 |
| samples/prompt-injection/README.md | 攻击样本库 | ~3,500 |
| **总计** | | **~28,900** |

---

## 🚀 快速使用

### 安装
```bash
git clone https://github.com/YOUR_USERNAME/ai-agent-security-toolkit.git
cd ai-agent-security-toolkit
```

### 使用
```bash
# 输入验证
node scripts/validate-input.js "用户输入"

# 安全审计
node scripts/audit-skills-security.js

# 凭证检查
node scripts/check-credentials-permissions.js
```

### 集成到项目
```javascript
const { validate } = require('./scripts/validate-input');

async function handleMessage(input) {
  const result = validate(input);
  if (!result.input.safe) {
    return '⚠️ 安全警告：无法处理该请求';
  }
  // 正常处理...
}
```

---

## 🤝 社区贡献

### 如何贡献
1. 提交新的攻击样本
2. 改进检测规则
3. 添加新工具
4. 翻译文档
5. 报告安全漏洞

### 贡献流程
1. Fork 仓库
2. 创建分支 (`git checkout -b feature/new-sample`)
3. 提交更改 (`git commit -am 'Add new attack sample'`)
4. 推送分支 (`git push origin feature/new-sample`)
5. 创建 Pull Request

---

## 📊 项目统计

- **总文件数**: 17
- **代码行数**: ~3,000
- **文档行数**: ~29,000
- **测试用例**: 15+
- **攻击样本**: 27

---

## 🔗 发布准备

### GitHub 发布步骤

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 创建新仓库
   # 名称: ai-agent-security-toolkit
   ```

2. **推送代码**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-agent-security-toolkit.git
   git branch -M main
   git push -u origin main
   ```

3. **创建 Release**
   - 标签: v1.0.0
   - 标题: AI Agent Security Toolkit v1.0.0
   - 描述: 参考 CHANGELOG.md

4. **npm 发布**（可选）
   ```bash
   npm publish
   ```

---

## 📬 联系方式

- **GitHub Issues**: 报告问题和功能请求
- **GitHub Discussions**: 社区讨论
- **Discord**: [OpenClaw Community](https://discord.gg/clawd)

---

## 🎯 项目愿景

> 帮助 AI 代理开发者构建更安全的系统，共同防御 Prompt Injection 和其他 AI 安全威胁。

**核心价值**:
- 🔒 安全第一 - 预防胜于治疗
- 🤝 社区驱动 - 共同防御，共同进步
- 📚 知识共享 - 开放透明，帮助更多人
- 🚀 持续改进 - 与时俱进，不断更新

---

## 📄 许可证

MIT License - 允许自由使用、修改和分发

---

*项目创建：2026-03-14*  
*作者：AI Agent Security Toolkit Contributors*
