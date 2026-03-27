#!/usr/bin/env node
import path from 'node:path';
import { readFile, fail, pass, warn } from './common.mjs';

/**
 * Validate an audit report
 * Usage: node validate-audit.mjs <path-to-artifact>
 */

const artifactPath = process.argv[2];

if (!artifactPath) {
  fail('Usage: node validate-audit.mjs <path-to-artifact>');
  process.exit(1);
}

console.log(`\n🔍 Validating audit report: ${artifactPath}`);
console.log('─'.repeat(60));

// Try to find audit report in common files
const candidateFiles = [
  path.join(artifactPath, 'SKILL.md'),
  path.join(artifactPath, 'AGENTS.md'),
  path.join(artifactPath, 'audit-report.md'),
  artifactPath
];

let content = null;
let foundPath = null;

for (const filePath of candidateFiles) {
  const testContent = readFile(filePath);
  if (testContent && (testContent.includes('## Audit') || testContent.includes('Scorecard'))) {
    content = testContent;
    foundPath = filePath;
    break;
  }
}

if (!content) {
  warn('No audit report found (searched for ## Audit or Scorecard sections)');
  process.exit(0); // Not a hard failure
}

pass(`Audit report found in ${foundPath}`);

// Check for scorecard
if (!content.includes('Scorecard') && !content.includes('PASS') && !content.includes('FAIL')) {
  fail('Audit report missing scorecard (expected PASS/FAIL/WARN counts)');
}

// Check for section documentation
if (!content.match(/##\s+/)) {
  warn('Audit report has minimal structure (no ## sections found)');
}

// Check for PASS/FAIL/WARN mentions
const hasPass = content.includes('PASS');
const hasFail = content.includes('FAIL');
const hasWarn = content.includes('WARN');

if (hasPass || hasFail || hasWarn) {
  pass('Scorecard contains status indicators (PASS/FAIL/WARN)');
} else {
  fail('Scorecard missing status indicators');
}

console.log('─'.repeat(60));

if (process.exitCode === 1) {
  console.log('❌ Audit validation FAILED\n');
  process.exit(1);
} else {
  console.log('✅ Audit validation PASSED\n');
  process.exit(0);
}
