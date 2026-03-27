#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find workspace root (assumes agentforger/ is in workspace root)
const workspaceRoot = path.resolve(__dirname, '../..');

console.log('\n🔍 Running full workspace validation');
console.log('═'.repeat(60));
console.log(`Workspace: ${workspaceRoot}`);
console.log('═'.repeat(60));

let totalPass = 0;
let totalFail = 0;
let totalWarn = 0;

/**
 * Run validator and capture result
 */
function runValidator(validatorPath, targetPath) {
  try {
    execSync(`node ${validatorPath} ${targetPath}`, {
      stdio: 'inherit',
      cwd: workspaceRoot
    });
    totalPass++;
    return true;
  } catch (err) {
    totalFail++;
    return false;
  }
}

// Validate skills
const skillsDir = path.join(workspaceRoot, 'skills');
if (fs.existsSync(skillsDir)) {
  const skills = fs.readdirSync(skillsDir).filter(name => {
    const skillPath = path.join(skillsDir, name);
    return fs.statSync(skillPath).isDirectory();
  });

  console.log(`\n📦 Found ${skills.length} skill(s)\n`);

  for (const skill of skills) {
    const skillPath = path.join(skillsDir, skill);
    runValidator(
      path.join(__dirname, 'validate-skill.mjs'),
      skillPath
    );
  }
} else {
  console.log('\n⚠️  No skills/ directory found');
  totalWarn++;
}

// Validate agents
const agentsDir = path.join(workspaceRoot, 'agents');
if (fs.existsSync(agentsDir)) {
  const agents = fs.readdirSync(agentsDir).filter(name => {
    const agentPath = path.join(agentsDir, name);
    return fs.statSync(agentPath).isDirectory();
  });

  console.log(`\n🤖 Found ${agents.length} agent(s)\n`);

  for (const agent of agents) {
    const agentPath = path.join(agentsDir, agent);
    runValidator(
      path.join(__dirname, 'validate-agent.mjs'),
      agentPath
    );
  }
} else {
  console.log('\n⚠️  No agents/ directory found');
  totalWarn++;
}

// Summary
console.log('\n═'.repeat(60));
console.log('📊 VALIDATION SUMMARY');
console.log('═'.repeat(60));
console.log(`✅ PASS: ${totalPass}`);
console.log(`❌ FAIL: ${totalFail}`);
console.log(`⚠️  WARN: ${totalWarn}`);
console.log('═'.repeat(60));

if (totalFail > 0) {
  console.log('\n❌ Workspace validation FAILED\n');
  process.exit(1);
} else {
  console.log('\n✅ Workspace validation PASSED\n');
  process.exit(0);
}
