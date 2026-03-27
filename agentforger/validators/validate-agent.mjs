#!/usr/bin/env node
import path from 'node:path';
import { readFile, fileExists, checkSections, checkPortability, fail, pass, warn } from './common.mjs';

/**
 * Validate an agent directory
 * Usage: node validate-agent.mjs <path-to-agent>
 */

const agentPath = process.argv[2];

if (!agentPath) {
  fail('Usage: node validate-agent.mjs <path-to-agent>');
  process.exit(1);
}

console.log(`\n🔍 Validating agent: ${agentPath}`);
console.log('─'.repeat(60));

// Check AGENTS.md
const agentsMdPath = path.join(agentPath, 'AGENTS.md');
const agentsContent = readFile(agentsMdPath);

if (!agentsContent) {
  process.exit(1);
}

pass('AGENTS.md exists');

// Check required sections in AGENTS.md
const requiredSections = [
  'Role',
  'Operational rules',
  'Permitted operations',
  'Outputs per mode'
];

checkSections(agentsContent, requiredSections, agentsMdPath);

// Check SOUL.md exists
const soulMdPath = path.join(agentPath, 'SOUL.md');
if (!fileExists(soulMdPath)) {
  fail('SOUL.md missing');
} else {
  pass('SOUL.md exists');
  const soulContent = readFile(soulMdPath);
  if (soulContent) {
    checkPortability(soulContent, soulMdPath);
  }
}

// Check context files (warn if missing)
const contextFiles = ['USER.md', 'MEMORY.md', 'TOOLS.md', 'HEARTBEAT.md'];
for (const file of contextFiles) {
  const filePath = path.join(agentPath, file);
  if (!fileExists(filePath)) {
    warn(`Context file missing: ${file}`);
  } else {
    pass(`${file} exists`);
  }
}

// Check portability on AGENTS.md
checkPortability(agentsContent, agentsMdPath);

console.log('─'.repeat(60));

if (process.exitCode === 1) {
  console.log('❌ Agent validation FAILED\n');
  process.exit(1);
} else {
  console.log('✅ Agent validation PASSED\n');
  process.exit(0);
}
