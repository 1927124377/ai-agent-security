#!/usr/bin/env node

/**
 * audit-skills-security.js - Skills 目录安全审查脚本
 * 
 * 用途：扫描 skills/ 目录，检测潜在安全风险
 * 参考：memory/ai-security-study-2026-03-14.md
 * 
 * 检测项:
 * 1. 恶意代码模式 (base64 解码、eval、动态 require)
 * 2. 敏感 API 调用 (fs.readFile, exec, spawn)
 * 3. 网络请求 (fetch, axios, http.request)
 * 4. 凭证访问 (.credentials/, process.env)
 * 5. 文件写入 (fs.writeFile, fs.appendFile)
 * 6. 命令执行 (child_process.exec, spawn)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// 风险模式
const RISK_PATTERNS = [
  // 恶意代码执行
  { pattern: /\beval\s*\(/i, severity: 'HIGH', reason: 'eval() 代码执行' },
  { pattern: /new\s+Function\s*\(/i, severity: 'HIGH', reason: 'Function 构造函数' },
  { pattern: /\bvm\.runIn/i, severity: 'HIGH', reason: 'VM 沙箱执行' },
  { pattern: /child_process\.(exec|execSync|spawn)/i, severity: 'HIGH', reason: 'Shell 命令执行' },
  { pattern: /require\s*\(\s*['"]child_process['"]\)/i, severity: 'HIGH', reason: 'child_process 模块' },
  
  // 动态代码加载
  { pattern: /require\s*\(\s*['"]\./i, severity: 'MEDIUM', reason: '相对路径 require' },
  { pattern: /require\s*\(\s*[`'"]/i, severity: 'LOW', reason: '动态 require' },
  { pattern: /import\s*\(\s*['"]/i, severity: 'LOW', reason: '动态 import' },
  
  // Base64/编码解码（可能隐藏恶意代码）
  { pattern: /Buffer\.from\s*\([^)]*\)\.toString\s*\(\s*['"]base64['"]/i, severity: 'HIGH', reason: 'Base64 解码' },
  { pattern: /atob\s*\(/i, severity: 'MEDIUM', reason: 'atob Base64 解码' },
  { pattern: /Buffer\.from\s*\([^)]*,\s*['"]base64['"]/i, severity: 'HIGH', reason: 'Base64 解码' },
  
  // 文件系统访问
  { pattern: /fs\.readFile/i, severity: 'MEDIUM', reason: '文件读取' },
  { pattern: /fs\.readFileSync/i, severity: 'MEDIUM', reason: '文件读取 (同步)' },
  { pattern: /fs\.writeFile/i, severity: 'MEDIUM', reason: '文件写入' },
  { pattern: /fs\.writeFileSync/i, severity: 'MEDIUM', reason: '文件写入 (同步)' },
  { pattern: /fs\.appendFile/i, severity: 'LOW', reason: '文件追加' },
  { pattern: /\.credentials\//i, severity: 'HIGH', reason: '凭证目录访问' },
  { pattern: /\.env/i, severity: 'MEDIUM', reason: '.env 文件访问' },
  
  // 环境变量访问
  { pattern: /process\.env\./i, severity: 'LOW', reason: '环境变量访问' },
  { pattern: /process\.env\s*\[/i, severity: 'LOW', reason: '环境变量访问' },
  
  // 网络请求
  { pattern: /\bfetch\s*\(/i, severity: 'LOW', reason: 'fetch 网络请求' },
  { pattern: /axios\./i, severity: 'LOW', reason: 'axios 网络请求' },
  { pattern: /http\.request/i, severity: 'LOW', reason: 'HTTP 请求' },
  { pattern: /https\.request/i, severity: 'LOW', reason: 'HTTPS 请求' },
  
  // 敏感操作
  { pattern: /api[_-]?key/i, severity: 'LOW', reason: 'API Key 相关' },
  { pattern: /secret/i, severity: 'LOW', reason: 'Secret 相关' },
  { pattern: /token/i, severity: 'LOW', reason: 'Token 相关' },
  { pattern: /password/i, severity: 'LOW', reason: 'Password 相关' },
  
  // postinstall 钩子（GhostClaw 攻击手法）
  { pattern: /postinstall/i, severity: 'HIGH', reason: 'postinstall 钩子' },
  { pattern: /install\.js/i, severity: 'MEDIUM', reason: 'install 脚本' },
];

// 白名单（允许的模式）
const WHITELIST_PATTERNS = [
  /require\s*\(\s*['"]fs['"]\)/i,  // 正常 require('fs')
  /require\s*\(\s*['"]path['"]\)/i,
  /require\s*\(\s*['"]https?['"]\)/i,
];

function isWhitelisted(line, pattern) {
  for (const whitelist of WHITELIST_PATTERNS) {
    if (whitelist.test(line)) {
      return true;
    }
  }
  return false;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    for (const { pattern, severity, reason } of RISK_PATTERNS) {
      if (pattern.test(line) && !isWhitelisted(line, pattern)) {
        findings.push({
          file: filePath,
          line: lineNum,
          severity,
          reason,
          content: line.trim().substring(0, 100),
        });
      }
    }
  }
  
  return findings;
}

function scanDirectory(dirPath) {
  const allFindings = [];
  
  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // 跳过 node_modules, .git, __pycache__ 等
      if (entry.name.startsWith('.') && entry.name !== '.') continue;
      if (entry.name === 'node_modules') continue;
      if (entry.name === '__pycache__') continue;
      
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && /\.(js|ts|mjs|cjs)$/.test(entry.name)) {
        const findings = scanFile(fullPath);
        allFindings.push(...findings);
      }
    }
  }
  
  walkDir(dirPath);
  return allFindings;
}

function printReport(findings) {
  console.log('='.repeat(80));
  console.log('Skills 安全审查报告');
  console.log('='.repeat(80));
  console.log(`扫描时间：${new Date().toISOString()}`);
  console.log(`扫描目录：${SKILLS_DIR}`);
  console.log(`发现风险：${findings.length} 项\n`);
  
  if (findings.length === 0) {
    console.log('✅ 未发现高风险代码模式');
    return;
  }
  
  // 按严重程度分组
  const highRisk = findings.filter(f => f.severity === 'HIGH');
  const mediumRisk = findings.filter(f => f.severity === 'MEDIUM');
  const lowRisk = findings.filter(f => f.severity === 'LOW');
  
  console.log(`🔴 高风险：${highRisk.length} 项`);
  console.log(`🟠 中风险：${mediumRisk.length} 项`);
  console.log(`🟡 低风险：${lowRisk.length} 项\n`);
  
  // 输出高风险项
  if (highRisk.length > 0) {
    console.log('='.repeat(80));
    console.log('🔴 高风险发现（需要立即审查）');
    console.log('='.repeat(80));
    for (const finding of highRisk) {
      console.log(`\n文件：${finding.file}`);
      console.log(`行号：${finding.line}`);
      console.log(`原因：${finding.reason}`);
      console.log(`代码：${finding.content}`);
    }
  }
  
  // 输出中风险项（前 10 个）
  if (mediumRisk.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🟠 中风险发现（建议审查）');
    console.log('='.repeat(80));
    for (const finding of mediumRisk.slice(0, 10)) {
      console.log(`\n文件：${finding.file}`);
      console.log(`行号：${finding.line}`);
      console.log(`原因：${finding.reason}`);
      console.log(`代码：${finding.content}`);
    }
    if (mediumRisk.length > 10) {
      console.log(`\n... 还有 ${mediumRisk.length - 10} 项中风险`);
    }
  }
  
  // 输出统计
  console.log('\n' + '='.repeat(80));
  console.log('📊 风险类型统计');
  console.log('='.repeat(80));
  
  const byReason = {};
  for (const finding of findings) {
    byReason[finding.reason] = (byReason[finding.reason] || 0) + 1;
  }
  
  const sorted = Object.entries(byReason).sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of sorted.slice(0, 15)) {
    console.log(`  ${count.toString().padStart(3)} - ${reason}`);
  }
}

function saveReport(findings) {
  const reportPath = path.join(__dirname, 'skill-security-audit.json');
  const report = {
    timestamp: new Date().toISOString(),
    skillsDir: SKILLS_DIR,
    totalFindings: findings.length,
    bySeverity: {
      HIGH: findings.filter(f => f.severity === 'HIGH').length,
      MEDIUM: findings.filter(f => f.severity === 'MEDIUM').length,
      LOW: findings.filter(f => f.severity === 'LOW').length,
    },
    findings,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 详细报告已保存：${reportPath}`);
}

// 主函数
function main() {
  console.log('开始扫描 skills/ 目录...\n');
  
  const findings = scanDirectory(SKILLS_DIR);
  printReport(findings);
  saveReport(findings);
  
  // 退出码
  const highRisk = findings.filter(f => f.severity === 'HIGH').length;
  process.exit(highRisk > 0 ? 1 : 0);
}

main();
