# AI 工具发现指南

> 如何让 find-skills 等 AI 工具自动发现和理解这个仓库

---

## 📦 仓库结构（AI 可读）

```
ai-agent-security/
├── skill.json              ← 标准 JSON 元数据（AI 首选）
├── clawhub.yaml            ← ClawHub 格式（OpenClaw 专用）
├── SKILL-MANIFEST.md       ← 人类 + AI 可读清单
├── README.md               ← 主文档（增强安装说明）
├── package.json            ← npm 标准配置
├── scripts/                ← 核心脚本
│   ├── validate-input.js
│   ├── audit-skills-security.js
│   └── check-credentials-permissions.js
└── docs/                   ← 详细文档
```

---

## 🤖 AI 工具如何解析

### 1. 发现技能（Discovery）

**搜索关键词**:
```
ai-agent-security
prompt-injection
defense
openclaw security
```

**GitHub API 查询**:
```bash
# 搜索安全相关技能
curl -s "https://api.github.com/search/repositories?q=ai-agent-security+language:javascript" | jq '.items[].full_name'

# 获取仓库元数据
curl -s "https://api.github.com/repos/1927124377/ai-agent-security/contents/skill.json"
```

### 2. 解析元数据（Parsing）

**读取 skill.json**:
```javascript
const response = await fetch('https://raw.githubusercontent.com/1927124377/ai-agent-security/main/skill.json');
const manifest = await response.json();

// 提取关键信息
const { name, version, installation, usage, features } = manifest;
```

**关键字段**:
- `installation.commands` - 安装命令
- `usage.input_validation` - 使用示例
- `features[].script` - 可用脚本
- `compatibility.openclaw` - 兼容性

### 3. 理解安装步骤（Installation）

**从 skill.json 提取**:
```json
{
  "installation": {
    "method": "git",
    "commands": [
      "git clone https://github.com/1927124377/ai-agent-security.git",
      "cd ai-agent-security",
      "node scripts/validate-input.js --test"
    ]
  }
}
```

**AI 执行流程**:
1. 克隆仓库
2. 进入目录
3. 运行测试验证
4. 复制脚本到项目

### 4. 理解使用方式（Usage）

**输入验证**:
```json
{
  "usage": {
    "input_validation": {
      "description": "Validate user input for Prompt Injection attacks",
      "command": "node scripts/validate-input.js \"user input\"",
      "example": "node scripts/validate-input.js \"你好，帮我查天气\""
    }
  }
}
```

**AI 集成代码**:
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

## 🔍 关键文件说明

### skill.json（标准 JSON）

**用途**: AI 工具首选解析格式  
**位置**: 仓库根目录  
**格式**: JSON

**包含内容**:
- 技能元数据（名称、版本、作者）
- 安装命令（可复制执行）
- 使用示例（带参数）
- 功能列表（脚本路径）
- 兼容性信息
- 测试配置

**示例解析**:
```javascript
// AI 工具读取
const manifest = require('./skill.json');

// 获取安装命令
const installCmds = manifest.installation.commands;
// ['git clone ...', 'cd ...', 'node ...']

// 获取功能列表
const features = manifest.features.map(f => f.name);
// ['input_validation', 'security_audit', 'credential_protection']
```

### clawhub.yaml（ClawHub 格式）

**用途**: OpenClaw ClawHub 专用  
**位置**: 仓库根目录  
**格式**: YAML

**包含内容**:
- ClawHub 分类和标签
- 安装方式
- 功能描述
- 使用示例

**示例解析**:
```yaml
# AI 工具读取
installation:
  type: git
  commands:
    - git clone ...

features:
  - name: 输入验证
    script: scripts/validate-input.js
    description: 检测 Prompt Injection 攻击
```

### SKILL-MANIFEST.md（人类 + AI 可读）

**用途**: 详细说明，便于理解  
**位置**: 仓库根目录  
**格式**: Markdown

**包含内容**:
- 完整安装步骤
- 使用示例
- 集成代码
- 文档链接

---

## 💡 AI 工具集成示例

### find-skills 工具

```javascript
// 伪代码：find-skills 如何发现和使用这个技能

class SkillDiscovery {
  async search(query) {
    // 1. 搜索 GitHub
    const repos = await this.searchGitHub(query);
    
    // 2. 检查 skill.json
    const skills = [];
    for (const repo of repos) {
      const manifest = await this.fetchSkillJson(repo);
      if (manifest) {
        skills.push({
          name: manifest.name,
          version: manifest.version,
          description: manifest.description,
          install: manifest.installation.commands,
          usage: manifest.usage,
          compatible: this.checkCompatibility(manifest),
        });
      }
    }
    
    return skills;
  }
  
  async install(skill) {
    // 执行安装命令
    for (const cmd of skill.install) {
      await this.exec(cmd);
    }
    console.log(`✅ ${skill.name} 安装完成`);
  }
}

// 使用
const finder = new SkillDiscovery();
const securitySkills = await finder.search('ai security openclaw');
await finder.install(securitySkills[0]);
```

### OpenClaw 自动集成

```javascript
// OpenClaw 发现 skill.json 后自动集成

const skill = {
  name: 'ai-agent-security-toolkit',
  validate: require('./scripts/validate-input'),
  audit: require('./scripts/audit-skills-security'),
  checkCreds: require('./scripts/check-credentials-permissions'),
};

// 自动添加到消息处理流程
onMessage(async (msg) => {
  const result = skill.validate(msg.content);
  if (!result.input.safe) {
    return reject(result.input.message);
  }
  // 继续处理...
});
```

---

## 📋 快速参考

### 关键 URL

| 资源 | URL |
|------|-----|
| 仓库 | https://github.com/1927124377/ai-agent-security |
| skill.json | https://raw.githubusercontent.com/1927124377/ai-agent-security/main/skill.json |
| clawhub.yaml | https://raw.githubusercontent.com/1927124377/ai-agent-security/main/clawhub.yaml |
| README | https://raw.githubusercontent.com/1927124377/ai-agent-security/main/README.md |

### 安装命令（可复制）

```bash
# 1. 克隆
git clone https://github.com/1927124377/ai-agent-security.git

# 2. 进入目录
cd ai-agent-security

# 3. 测试
node scripts/validate-input.js --test

# 4. 复制到项目
cp scripts/*.js /path/to/your/project/scripts/
```

### 核心功能（3 个）

| 功能 | 脚本 | 用途 |
|------|------|------|
| 输入验证 | `scripts/validate-input.js` | 检测 Prompt Injection |
| 安全审计 | `scripts/audit-skills-security.js` | 扫描恶意代码 |
| 凭证保护 | `scripts/check-credentials-permissions.js` | 检查 600 权限 |

---

## ✅ 验证 AI 可读性

### 测试 1: skill.json 可解析

```bash
curl -s https://raw.githubusercontent.com/1927124377/ai-agent-security/main/skill.json | jq '.name, .version, .installation.commands[0]'
```

**预期输出**:
```
"ai-agent-security-toolkit"
"1.0.0"
"git clone https://github.com/1927124377/ai-agent-security.git"
```

### 测试 2: 安装命令可执行

```bash
git clone https://github.com/1927124377/ai-agent-security.git /tmp/test-ai-security
cd /tmp/test-ai-security
node scripts/validate-input.js --test
```

**预期输出**: 测试通过（15/15）

### 测试 3: 文档可访问

```bash
curl -s https://raw.githubusercontent.com/1927124377/ai-agent-security/main/README.md | head -5
```

**预期输出**: `# AI Agent Security Toolkit`

---

## 🎯 总结

**这个仓库已针对 AI 工具优化**:

1. ✅ **skill.json** - 标准 JSON 元数据，AI 首选
2. ✅ **clawhub.yaml** - ClawHub 格式，OpenClaw 专用
3. ✅ **SKILL-MANIFEST.md** - 详细说明，人类 + AI 可读
4. ✅ **README.md** - 清晰安装步骤，3 种方式
5. ✅ **package.json** - npm 标准配置

**AI 工具可以**:
- 🔍 自动发现这个技能
- 📖 解析安装和使用说明
- 💻 自动生成集成代码
- ✅ 验证安装和运行

---

**仓库地址**: https://github.com/1927124377/ai-agent-security  
**发现关键词**: ai-agent-security, prompt-injection, openclaw-security
