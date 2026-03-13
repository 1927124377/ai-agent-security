#!/usr/bin/env node

/**
 * check-credentials-permissions.js - 凭证文件权限检查脚本
 * 
 * 用途：检查 .credentials/ 目录文件权限，确保为 600（仅所有者可读写）
 * 参考：memory/ai-security-study-2026-03-14.md
 * 
 * 使用方式:
 *   node scripts/check-credentials-permissions.js
 *   node scripts/check-credentials-permissions.js --fix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CREDENTIALS_DIR = path.join(__dirname, '..', '.credentials');

function getPermissions(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const mode = stats.mode & 0o777;
    return mode;
  } catch (err) {
    return null;
  }
}

function formatPermissions(mode) {
  const symbols = 'rwxrwxrwx';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += (mode & (1 << (8 - i))) ? symbols[i] : '-';
  }
  return result;
}

function checkDirectory(dirPath) {
  const results = {
    total: 0,
    secure: 0,
    insecure: [],
  };
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file.startsWith('.')) continue;
      
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (!stats.isFile()) continue;
      
      results.total++;
      const perms = getPermissions(filePath);
      
      if (perms === 0o600) {
        results.secure++;
      } else {
        results.insecure.push({
          file,
          path: filePath,
          current: perms,
          expected: 0o600,
        });
      }
    }
  } catch (err) {
    console.error(`错误：无法读取目录 ${dirPath}`);
    console.error(err.message);
    process.exit(1);
  }
  
  return results;
}

function fixPermissions(insecureFiles) {
  console.log('\n🔧 修复权限...\n');
  
  for (const { file, path: filePath, current } of insecureFiles) {
    try {
      execSync(`chmod 600 "${filePath}"`);
      console.log(`✅ ${file}: ${formatPermissions(current)} → 600`);
    } catch (err) {
      console.error(`❌ ${file}: 修复失败 - ${err.message}`);
    }
  }
}

function printReport(results) {
  console.log('='.repeat(70));
  console.log('凭证文件权限检查报告');
  console.log('='.repeat(70));
  console.log(`检查目录：${CREDENTIALS_DIR}`);
  console.log(`检查时间：${new Date().toISOString()}`);
  console.log(`文件总数：${results.total}`);
  console.log(`安全文件：${results.secure}`);
  console.log(`风险文件：${results.insecure.length}\n`);
  
  if (results.insecure.length === 0) {
    console.log('✅ 所有凭证文件权限正确（600）');
    return;
  }
  
  console.log('⚠️  以下文件权限不安全（应为 600）:\n');
  console.log('文件'.padEnd(30) + '当前权限'.padEnd(15) + '预期权限');
  console.log('-'.repeat(70));
  
  for (const { file, current } of results.insecure) {
    console.log(
      file.padEnd(30) +
      formatPermissions(current).padEnd(15) +
      '600 (rw-------)'
    );
  }
}

function main() {
  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');
  
  if (!fs.existsSync(CREDENTIALS_DIR)) {
    console.error(`错误：凭证目录不存在：${CREDENTIALS_DIR}`);
    console.error('请确保你的项目有 .credentials/ 目录');
    process.exit(1);
  }
  
  const results = checkDirectory(CREDENTIALS_DIR);
  printReport(results);
  
  if (fixMode && results.insecure.length > 0) {
    fixPermissions(results.insecure);
    
    // 重新检查
    console.log('\n' + '='.repeat(70));
    console.log('修复后重新检查...');
    const newResults = checkDirectory(CREDENTIALS_DIR);
    if (newResults.insecure.length === 0) {
      console.log('✅ 所有文件权限已修复');
    } else {
      console.log(`⚠️  仍有 ${newResults.insecure.length} 个文件未修复`);
    }
  } else if (results.insecure.length > 0) {
    console.log('\n💡 运行以下命令修复：');
    console.log(`   node scripts/check-credentials-permissions.js --fix`);
    console.log('\n或者手动执行：');
    console.log(`   chmod 600 .credentials/*`);
    process.exit(1);
  }
}

main();
