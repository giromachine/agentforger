#!/usr/bin/env node
import path from 'node:path';
import { readFile, checkFrontmatter, checkSections, checkPortability, fail, pass } from './common.mjs';

/**
 * Validate a skill directory
 * Usage: node validate-skill.mjs <path-to-skill>
 */

const skillPath = process.argv[2];

if (!skillPath) {
  fail('Usage: node validate-skill.mjs <path-to-skill>');
  process.exit(1);
}

const skillMdPath = path.join(skillPath, 'SKILL.md');

console.log(`\n🔍 Validating skill: ${skillPath}`);
console.log('─'.repeat(60));

// Read SKILL.md
const content = readFile(skillMdPath);
if (!content) {
  process.exit(1);
}

// Check frontmatter
const requiredFields = ['name', 'description', 'version', 'author', 'tags'];
const frontmatter = checkFrontmatter(content, requiredFields);

if (!frontmatter) {
  process.exit(1);
}

pass(`Frontmatter valid: ${frontmatter.name} v${frontmatter.version}`);

// Check required sections
const requiredSections = [
  'Purpose',
  'Limits',
  'Inputs / Outputs',
  'Workflow',
  'Quality criteria'
];

checkSections(content, requiredSections, skillMdPath);

// Check portability
checkPortability(content, skillMdPath);

console.log('─'.repeat(60));

if (process.exitCode === 1) {
  console.log('❌ Skill validation FAILED\n');
  process.exit(1);
} else {
  console.log('✅ Skill validation PASSED\n');
  process.exit(0);
}
