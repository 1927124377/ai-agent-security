# 贡献指南

欢迎贡献 AI Agent Security Toolkit！

---

## 如何贡献

### 1. 报告安全问题

发现新的攻击模式或检测漏洞？

- 📧 邮件：security@your-email.com
- 🐛 GitHub Issues: [新建 Security Issue](https://github.com/YOUR_USERNAME/ai-agent-security-toolkit/issues/new?template=security.md)

**不要公开披露未修复的漏洞！**

---

### 2. 添加攻击样本

#### 步骤

1. Fork 仓库
2. 在 `samples/prompt-injection/README.md` 添加新样本
3. 在 `scripts/validate-input.js` 添加检测模式（如需要）
4. 在 `tests/validate-input.test.js` 添加测试用例
5. 提交 PR

#### 样本格式

```yaml
name: "样本名称"
type: "direct_injection|credential_probe|sensitive_operation|obfuscation"
input: "攻击输入文本"
expected:
  action: "REJECT"
  score: 50
  reasons: ["检测到的风险原因"]
detection:
  - "检测模式 1"
notes: "额外说明"
```

---

### 3. 改进检测规则

#### 修改 `RISK_PATTERNS`

在 `scripts/validate-input.js` 中：

```javascript
const RISK_PATTERNS = [
  // 添加新规则
  { 
    pattern: /新的攻击模式/i, 
    score: 50, 
    reason: '攻击描述' 
  },
];
```

#### 测试

```bash
# 运行测试
npm test

# 手动测试
node scripts/validate-input.js "测试输入"
```

---

### 4. 添加新工具

#### 脚本结构

```javascript
#!/usr/bin/env node

/**
 * 脚本名称 - 功能描述
 * 
 * 用途：说明用途
 * 参考：相关文档
 * 
 * 使用方式:
 *   node scripts/your-script.js [options]
 */

// 实现代码...

module.exports = { /* 导出函数 */ };
```

#### 文档

- 在 `docs/` 目录添加使用文档
- 在 `README.md` 添加功能说明
- 添加测试用例

---

### 5. 翻译

支持多语言？欢迎翻译文档！

- `README.zh-CN.md` - 简体中文
- `README.ja.md` - 日语
- `README.es.md` - 西班牙语

---

## 开发环境设置

```bash
# Fork 并克隆
git clone https://github.com/YOUR_USERNAME/ai-agent-security-toolkit.git
cd ai-agent-security-toolkit

# 安装依赖
npm install

# 运行测试
npm test

# 运行审计
npm run audit
```

---

## PR 提交指南

### PR 标题格式

```
feat: 添加新的检测模式
fix: 修复误报问题
docs: 更新集成文档
test: 添加测试用例
```

### PR 描述模板

```markdown
## 变更说明

简要描述变更内容

## 相关问题

Fixes #ISSUE_NUMBER

## 测试

- [ ] 已添加测试用例
- [ ] 所有测试通过
- [ ] 手动测试通过

## 截图（如适用）

添加截图或 GIF

## 额外说明

其他需要说明的内容
```

---

## 代码风格

### JavaScript

- 使用 ES6+ 语法
- 使用 `const` 和 `let`，不用 `var`
- 使用单引号
- 缩进 2 空格

### 注释

- 函数必须有 JSDoc 注释
- 复杂逻辑必须有注释说明
- 使用中文注释（主要）+ 英文注释（可选）

---

## 发布流程

1. 更新 `package.json` 版本号（语义化版本）
2. 更新 `CHANGELOG.md`
3. 创建 Git Tag: `git tag v1.0.0`
4. 推送 Tag: `git push origin v1.0.0`
5. 发布 npm: `npm publish`

---

## 行为准则

- 尊重他人，友好交流
- 对事不对人，建设性批评
- 帮助新手，共同成长

---

## 许可证

MIT License - 贡献即表示同意此许可证

---

*最后更新：2026-03-14*
