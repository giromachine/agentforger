import fs from 'node:fs';
import path from 'node:path';

/**
 * Log warning (non-fatal, does NOT set exit code)
 */
export function warn(msg) {
  console.warn(`⚠️  WARN: ${msg}`);
}

/**
 * Log error and set exit code 1
 */
export function fail(msg) {
  console.error(`❌ FAIL: ${msg}`);
  process.exitCode = 1;
}

/**
 * Log success
 */
export function pass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

/**
 * Read file or fail
 */
export function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    fail(`Cannot read ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Check if file exists
 */
export function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Extract and validate YAML frontmatter
 * Returns parsed object or null on failure
 */
export function checkFrontmatter(content, requiredFields = []) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!match) {
    fail('Missing frontmatter (expected --- YAML --- block at start of file)');
    return null;
  }

  const frontmatterText = match[1];
  const frontmatter = {};

  // Simple YAML parser (handles key: value pairs)
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Handle arrays [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim());
    }
    
    frontmatter[key] = value;
  }

  // Check required fields
  let valid = true;
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      fail(`Missing required frontmatter field: ${field}`);
      valid = false;
    }
  }

  return valid ? frontmatter : null;
}

/**
 * Check for portability violations
 */
export function checkPortability(content, filePath) {
  let violations = 0;

  // Check for absolute paths (simple heuristic)
  const absolutePathPattern = /\/home\/[a-zA-Z0-9_-]+/g;
  const matches = content.match(absolutePathPattern);
  if (matches) {
    fail(`${filePath} contains absolute paths: ${matches.join(', ')}`);
    violations++;
  }

  // Check for hardcoded common names (example heuristic)
  const hardcodedNamePattern = /(alice|bob|john|jane|admin|user123)/gi;
  const nameMatches = content.match(hardcodedNamePattern);
  if (nameMatches) {
    warn(`${filePath} may contain hardcoded names: ${nameMatches.join(', ')}`);
  }

  return violations === 0;
}

/**
 * Check required sections in markdown
 */
export function checkSections(content, requiredSections, filePath) {
  let allFound = true;

  for (const section of requiredSections) {
    const regex = new RegExp(`^##\\s+${section}`, 'm');
    if (!regex.test(content)) {
      fail(`${filePath} missing required section: ## ${section}`);
      allFound = false;
    }
  }

  return allFound;
}
