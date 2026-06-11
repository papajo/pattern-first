/**
 * Pattern file loading and resolution.
 */

'use strict';

const fs = require('fs');
const path = require('path');

function loadPattern(patternPath) {
  const resolved = path.resolve(patternPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Pattern file not found: ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  let pattern;

  try {
    pattern = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in pattern file: ${err.message}`);
  }

  // Validate minimal required fields
  if (!pattern.intent || !pattern.intent.success_criteria) {
    throw new Error('Pattern missing required field: intent.success_criteria');
  }

  if (!Array.isArray(pattern.intent.success_criteria) || pattern.intent.success_criteria.length === 0) {
    throw new Error('Pattern must have at least one success criterion');
  }

  return pattern;
}

function findPattern(name) {
  // Check patterns/ directory
  const patternsDir = path.join(__dirname, '..', 'patterns');
  const candidates = [
    path.join(patternsDir, `${name}.json`),
    path.join(patternsDir, name),
    path.resolve(name),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Pattern "${name}" not found. Check --list-patterns for available patterns.`);
}

module.exports = { loadPattern, findPattern };
