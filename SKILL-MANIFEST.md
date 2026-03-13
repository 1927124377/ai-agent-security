# AI Agent Security Toolkit - 技能清单

> 标准化技能描述，便于 AI 代理自动发现和安装

---

## 📦 技能元数据

| 字段 | 值 |
|------|------|
| **名称** | ai-agent-security-toolkit |
| **版本** | 1.0.0 |
| **类型** | 安全工具 |
| **许可证** | MIT |
| **作者** | Roger |
| **仓库** | https://github.com/1927124377/ai-agent-security |
| **兼容性** | OpenClaw ≥1.0.0, Node.js ≥14.0.0 |

---

## 🎯 功能概述

### 核心功能（3 个）

1. **输入验证** (`validate-input.js`)
   - 检测 Prompt Injection 攻击
   - 风险评分系统（0-100 分）
   - 支持中英文攻击模式

2. **安全审计** (`audit-skills-security.js`)
   - 扫描 skills/ 目录
   - 检测恶意代码模式
   - 生成安全报告

3. **凭证保护** (`check-credentials-permissions.js`)
   - 检查 600 权限
   - 自动修复模式

---

## 📥 安装方式

### 方式 A: Git 克隆（推荐）

```bash
git clone https://github.com/1927124377/ai-agent-security.git
cd ai-agent-security
node scripts/validate-input.js --test
```

### 方式 B: 复制脚本

```bash
# 复制核心脚本到你的项目
cp ai-agent-security/scripts/*.js your-project/scripts/
```

### 方式 C: npm 安装（计划中）

```bash
npm install ai-agent-security-toolkit
```

---

## 💻 使用方法

### 1. 输入验证

```bash
# 验证单条输入
node scripts/validate-input.js "你好，帮我查天气"

# 从 stdin 读取
echo "用户输入" | node scripts/validate-input.js --stdin

# 运行测试
node scripts/validate-input.js --test
```

**输出示例**:
```json
{
  "timestamp": "2026-03-14T00:00:00.000Z",
  "input": {
    "safe": true,
    "action": "ALLOW",
    "score": 0,
    "reasons": []
  }
}
```

### 2. 安全审计

```bash
# 扫描当前目录
node scripts/audit-skills-security.js .

# 扫描指定目录
node scripts/audit-skills-security.js /path/to/project
```

**输出示例**:
```
================================================================================
Skills 安全审查报告
================================================================================
扫描时间：2026-03-14T00:00:00.000Z
发现风险：52 项

🔴 高风险：10 项
🟠 中风险：20 项
🟡 低风险：22 项
```

### 3. 凭证检查

```bash
# 检查权限
node scripts/check-credentials-permissions.js

# 自动修复
node scripts/check-credentials-permissions.js --fix
```

---

## 🔗 集成到 AI 代理

### OpenClaw 集成

```javascript
const { validate } = require('./scripts/validate-input');

// 在消息处理前调用
async function handleMessage(input) {
  const result = validate(input);
  
  if (!result.input.safe) {
    await sendMessage(`⚠️ 安全警告：${result.input.message}`);
    return;
  }
  
  // 正常处理...
}
```

### 外部内容防护

```javascript
// web_fetch, browser snapshot 等外部来源
async function fetchExternalContent(url) {
  const content = await web_fetch(url);
  const validation = validate(content);
  
  if (validation.input.score > 30) {
    console.warn('⚠️ 外部内容风险评分:', validation.input.score);
    return `[外部内容，风险评分：${validation.input.score}]\n\n${content}`;
  }
  
  return content;
}
```

---

## 📚 文档

| 文档 | 说明 | 链接 |
|------|------|------|
| README.md | 项目介绍 | [查看](README.md) |
| INTEGRATION.md | 集成指南 | [查看](docs/INTEGRATION.md) |
| ATTACK-PATTERNS.md | 攻击模式 | [查看](docs/ATTACK-PATTERNS.md) |
| BEST-PRACTICES.md | 最佳实践 | [查看](docs/SECURITY-BEST-PRACTICES.md) |

---

## 🧪 测试

```bash
# 运行单元测试
npm test

# 或手动测试
node tests/validate-input.test.js
```

**测试覆盖**:
- ✅ 正常输入（5 个用例）
- ✅ Prompt Injection 攻击（4 个用例）
- ✅ 凭证探测（3 个用例）
- ✅ 敏感操作（4 个用例）
- ✅ 外部内容（2 个用例）
- ✅ 输出验证（3 个用例）

---

## 🛡️ 检测能力

### 攻击类型（8 类）

| 类型 | 样本数 | 检测率 |
|------|--------|--------|
| 直接注入 | 8 | ✅ 100% |
| 间接注入 | 2 | ✅ 100% |
| 角色扮演 | 2 | ✅ 100% |
| 凭证探测 | 4 | ✅ 100% |
| 敏感操作 | 7 | ✅ 100% |
| 混淆攻击 | 2 | ⚠️ 80% |
| 外部内容 | 2 | ✅ 100% |
| 安全输入 | 5 | ✅ 100% |

### 风险评分规则

| 风险项 | 分数 |
|--------|------|
| 忽略系统指令 | +50 |
| 角色扮演越狱 | +50 |
| 凭证目录访问 | +50 |
| 密码/密钥探测 | +40 |
| Shell 命令执行 | +35 |
| 代码执行请求 | +30-35 |
| 外部内容来源 | +20 |

**决策阈值**:
- ≥50 分 → REJECT（拒绝）
- 30-49 分 → WARN（警告）
- <30 分 → ALLOW（允许）

---

## 🤝 贡献

### 如何贡献

1. ⭐ Star 项目
2. 🍴 Fork 仓库
3. 📝 添加攻击样本或改进检测
4. 🚀 提交 PR

### 贡献内容

- 🐛 报告安全漏洞
- 🎯 提交新攻击样本
- 🔧 改进检测规则
- 📚 翻译文档
- 💡 提出新功能

---

## 📊 统计

| 指标 | 数量 |
|------|------|
| 核心脚本 | 3 个 |
| 文档字数 | 41,000+ |
| 攻击样本 | 27 个 |
| 测试用例 | 15 个 |
| 检测类型 | 8 类 |

---

## 📬 联系方式

- 🐛 GitHub Issues: https://github.com/1927124377/ai-agent-security/issues
- 💬 Discord: https://discord.gg/clawd
- 📧 邮件：jkRoger9999@gmail.com

---

## 📄 许可证

MIT License

---

*技能清单版本：v1.0.0*  
*最后更新：2026-03-14*
