# 集成指南 - AI Agent Security Toolkit

> 将安全防御集成到你的 AI 代理项目中

---

## 快速集成（5 分钟）

### 步骤 1: 安装

```bash
# 方式 A: npm 安装
npm install ai-agent-security-toolkit

# 方式 B: 复制脚本
git clone https://github.com/YOUR_USERNAME/ai-agent-security-toolkit.git
cp ai-agent-security-toolkit/scripts/*.js your-project/scripts/
```

### 步骤 2: 基础使用

```javascript
const { validate } = require('./scripts/validate-input');

// 在消息处理前调用
async function handleMessage(userInput) {
  const result = validate(userInput);
  
  if (!result.input.safe) {
    console.warn('⚠️ 高风险输入:', result.input.reasons);
    return '⚠️ 安全警告：无法处理该请求';
  }
  
  // 正常处理...
}
```

---

## OpenClaw 集成

### 方案 A: 消息处理层拦截

在 `SOUL.md` 或主处理逻辑中添加：

```javascript
// 伪代码示例
const { validate } = require('./scripts/validate-input');

// 每次收到消息时
onMessage(async (message) => {
  const validation = validate(message.content);
  
  if (!validation.input.safe) {
    await reply(`⚠️ 安全警告：${validation.input.message}`);
    await reply(`风险原因：${validation.input.reasons.join(', ')}`);
    return;
  }
  
  // 继续正常处理
  await processMessage(message);
});
```

### 方案 B: 外部内容强制验证

```javascript
// web_fetch, browser snapshot 等外部来源
const { validate } = require('./scripts/validate-input');

async function fetchAndProcess(url) {
  const content = await web_fetch(url);
  
  // 强制验证外部内容
  const validation = validate(content);
  
  if (validation.input.score > 30) {
    console.warn('⚠️ 外部内容风险评分:', validation.input.score);
    // 选项 1: 拒绝处理
    // return '内容安全风险，无法处理';
    
    // 选项 2: 标记后谨慎处理
    return `[外部内容，风险评分：${validation.input.score}]\n\n${content}`;
  }
  
  return content;
}
```

### 方案 C: 输出验证（防止泄露）

```javascript
const { validateOutput } = require('./scripts/validate-input');

async function sendResponse(output) {
  const check = validateOutput(output);
  
  if (!check.clean) {
    console.error('⚠️ 输出包含敏感信息:', check.leaks);
    // 过滤敏感信息
    return '响应已过滤敏感信息';
  }
  
  await sendMessage(output);
}
```

---

## Claude Code / ACP 集成

### 在会话开始前验证

```javascript
// sessions_spawn 前验证
const { validate } = require('./scripts/validate-input');

async function spawnSubagent(task) {
  const validation = validate(task);
  
  if (!validation.input.safe) {
    throw new Error(`任务包含安全风险：${validation.input.reasons.join(', ')}`);
  }
  
  return await sessions_spawn({ task });
}
```

---

## 自定义 Agent 集成

### Express.js API

```javascript
const express = require('express');
const { validate } = require('./scripts/validate-input');

const app = express();

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  // 输入验证
  const validation = validate(message);
  
  if (!validation.input.safe) {
    return res.status(400).json({
      error: 'SECURITY_REJECTED',
      message: validation.input.message,
      reasons: validation.input.reasons,
      score: validation.input.score,
    });
  }
  
  // 处理消息
  const response = await processMessage(message);
  
  // 输出验证
  const outputCheck = validateOutput(response);
  if (!outputCheck.clean) {
    return res.status(500).json({
      error: 'OUTPUT_FILTERED',
      message: '响应包含敏感信息',
    });
  }
  
  res.json({ response });
});
```

### Discord Bot

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const { validate } = require('./scripts/validate-input');

const client = new Client({ intents: [GatewayIntentBits.GuildMessages] });

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const validation = validate(message.content);
  
  if (!validation.input.safe) {
    await message.reply(`⚠️ 安全警告：${validation.input.message}`);
    return;
  }
  
  // 正常处理
  await handleCommand(message);
});
```

### Telegram Bot

```javascript
const { Telegraf } = require('telegraf');
const { validate } = require('./scripts/validate-input');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on('text', async (ctx) => {
  const validation = validate(ctx.message.text);
  
  if (!validation.input.safe) {
    await ctx.reply(`⚠️ 安全警告：${validation.input.message}`);
    return;
  }
  
  // 正常处理
  await processMessage(ctx);
});
```

---

## 定期安全审计

### CI/CD 集成

```yaml
# .github/workflows/security-audit.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每周日运行

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run security audit
        run: npm run audit
      
      - name: Check credentials permissions
        run: npm run check-creds
```

### 本地定时检查

```bash
# crontab -e
# 每天凌晨 2 点运行安全检查
0 2 * * * cd /path/to/project && node scripts/audit-skills-security.js >> /var/log/security-audit.log 2>&1
```

---

## 配置选项

### 调整风险阈值

```javascript
const { validate } = require('./scripts/validate-input');

// 自定义阈值
const result = validate(input, {
  threshold: 40,  // 默认 50，降低阈值更严格
});
```

### 白名单模式

```javascript
// 添加信任来源
const TRUSTED_SOURCES = [
  'internal-api',
  'verified-users',
];

function isTrusted(source) {
  return TRUSTED_SOURCES.includes(source);
}

async function handleMessage(source, content) {
  if (!isTrusted(source)) {
    const validation = validate(content);
    if (!validation.input.safe) {
      return reject();
    }
  }
  // 处理...
}
```

---

## 日志和监控

### 安全事件日志

```javascript
const fs = require('fs');
const path = require('path');

function logSecurityEvent(event) {
  const logFile = path.join(__dirname, 'security-events.log');
  const timestamp = new Date().toISOString();
  const entry = JSON.stringify({ timestamp, ...event }) + '\n';
  fs.appendFileSync(logFile, entry);
}

// 使用
const validation = validate(input);
if (!validation.input.safe) {
  logSecurityEvent({
    type: 'INPUT_REJECTED',
    score: validation.input.score,
    reasons: validation.input.reasons,
    input: input.substring(0, 100),
  });
}
```

### 告警通知

```javascript
async function sendSecurityAlert(event) {
  // Telegram 通知
  await bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `🚨 安全告警\n类型：${event.type}\n评分：${event.score}\n原因：${event.reasons.join(', ')}`
  );
  
  // 邮件通知（可选）
  // await sendEmail(...)
}
```

---

## 最佳实践

### 1. 分层防御

不要依赖单一检测层：
- ✅ 输入验证 + 提示工程 + 输出过滤
- ✅ 定期安全审计
- ✅ 凭证权限检查

### 2. 持续更新

- 每周审查安全日志
- 每月更新攻击样本库
- 订阅 OWASP LLM Top 10 更新

### 3. 最小权限

- 凭证文件 600 权限
- API Key 设置使用限额
- 定期轮换密钥

### 4. 人工审核

- 高风险操作必须人工确认
- 外部内容标记后处理
- 定期审查自动化决策

---

## 故障排除

### 误报处理

如果正常输入被拒绝：

1. 检查评分原因：`console.log(validation.input.reasons)`
2. 调整检测模式（降低分数或添加白名单）
3. 提交 Issue 报告误报

### 漏报处理

如果攻击输入未被检测：

1. 添加新样本到 `samples/` 目录
2. 在 `scripts/validate-input.js` 添加检测模式
3. 添加测试用例
4. 提交 PR 贡献

---

*最后更新：2026-03-14*
