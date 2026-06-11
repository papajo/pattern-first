/**
 * Session memory for pattern execution tracking.
 *
 * Implements the 'session' and 'persistent' memory strategies from
 * the pattern schema. Tracks run history per (keyword, location) key.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Storage ───────────────────────────────────────────────────────────────

const MEMORY_DIR = path.join(__dirname, '..', '.memory');
const MEMORY_FILE = path.join(MEMORY_DIR, 'session-store.json');

/**
 * Ensure memory storage directory exists.
 */
function ensureStorage() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

/**
 * Load the full session store from disk.
 */
function loadStore() {
  ensureStorage();
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const raw = fs.readFileSync(MEMORY_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Warning: Could not read memory store: ${err.message}`);
  }
  return { runs: [], patterns: {} };
}

/**
 * Save the full session store to disk.
 */
function saveStore(store) {
  ensureStorage();
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Warning: Could not save memory store: ${err.message}`);
  }
}

// ─── Session API ───────────────────────────────────────────────────────────

/**
 * Record a completed run in session memory.
 */
function recordRun({ keyword, location, pattern, provider, summary, args }) {
  const store = loadStore();

  const key = `${keyword.toLowerCase()}:${location.toLowerCase()}`;

  // Initialize pattern entry
  if (!store.patterns[key]) {
    store.patterns[key] = {
      keyword,
      location,
      firstRun: new Date().toISOString(),
      runCount: 0,
      totalPassed: 0,
      totalFailed: 0,
      runs: [],
    };
  }

  const entry = store.patterns[key];
  entry.runCount++;
  entry.totalPassed += summary.passedCount;
  entry.totalFailed += summary.failedCount;

  entry.runs.push({
    runNumber: entry.runCount,
    timestamp: new Date().toISOString(),
    pattern: pattern,
    provider: provider || 'simulated',
    passed: summary.passedCount,
    failed: summary.failedCount,
    total: summary.total,
  });

  // Keep last 20 runs per key to limit storage growth
  if (entry.runs.length > 20) {
    entry.runs = entry.runs.slice(-20);
  }

  store.runs.push({
    key,
    timestamp: new Date().toISOString(),
    summary,
  });

  // Keep global run log trimmed to last 100
  if (store.runs.length > 100) {
    store.runs = store.runs.slice(-100);
  }

  saveStore(store);
  return entry;
}

/**
 * Get run history for a keyword+location combination.
 */
function getHistory(keyword, location) {
  const store = loadStore();
  const key = `${keyword.toLowerCase()}:${location.toLowerCase()}`;
  return store.patterns[key] || null;
}

/**
 * Get the full session store summary (all keywords).
 */
function getAllHistory() {
  const store = loadStore();
  const history = [];
  for (const [key, data] of Object.entries(store.patterns)) {
    history.push({
      key,
      keyword: data.keyword,
      location: data.location,
      runCount: data.runCount,
      totalPassed: data.totalPassed,
      totalFailed: data.totalFailed,
      lastRun: data.runs[data.runs.length - 1]?.timestamp || data.firstRun,
    });
  }
  return history.sort((a, b) => new Date(b.lastRun) - new Date(a.lastRun));
}

/**
 * Clear all session memory.
 */
function clearMemory() {
  const store = { runs: [], patterns: {} };
  saveStore(store);
}

module.exports = {
  recordRun,
  getHistory,
  getAllHistory,
  clearMemory,
};
