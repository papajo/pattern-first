/**
 * Provider abstraction layer for multi-model orchestration.
 *
 * Each provider implements a standard interface:
 *   { id, name, description, runChecks(products, pattern, options) }
 *
 * This allows the same pattern to be executed against different backends
 * (simulated, Claude, GPT, Ollama, etc.) without changing the pattern file.
 */

'use strict';

const { runChecks } = require('./checks');

// ─── Provider Registry ─────────────────────────────────────────────────────

const providers = {};

// ─── Built-in: Simulated (Local) Provider ──────────────────────────────────

providers['simulated'] = {
  id: 'simulated',
  name: 'Simulated (Local)',
  description: 'Deterministic local execution with simulated market data. No API keys needed.',
  capabilities: ['checks', 'constraint-report'],

  runChecks(products, pattern, options = {}) {
    return runChecks(products, pattern);
  },
};

// ─── Provider registration API ─────────────────────────────────────────────

/**
 * Register a new provider at runtime.
 * External packages can call this to add backends.
 */
function registerProvider(provider) {
  if (!provider.id || !provider.name || typeof provider.runChecks !== 'function') {
    throw new Error('Provider must have id, name, and runChecks()');
  }
  providers[provider.id] = provider;
}

/**
 * Get a provider by ID. Falls back to 'simulated'.
 */
function getProvider(id) {
  if (id && providers[id]) return providers[id];
  if (id) console.warn(`Provider "${id}" not found. Falling back to "simulated".`);
  return providers['simulated'];
}

/**
 * List all registered providers.
 */
function listProviders() {
  return Object.values(providers).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    capabilities: p.capabilities || [],
  }));
}

/**
 * Run the same pattern against multiple providers for comparison.
 */
function compareProviders(products, pattern, providerIds = ['simulated']) {
  const results = {};
  for (const id of providerIds) {
    const provider = getProvider(id);
    if (!provider) {
      results[id] = { error: `Provider "${id}" not found` };
      continue;
    }
    try {
      results[id] = {
        provider: provider.name,
        result: provider.runChecks(products, pattern),
      };
    } catch (err) {
      results[id] = { provider: provider.name, error: err.message };
    }
  }
  return results;
}

module.exports = {
  providers,
  registerProvider,
  getProvider,
  listProviders,
  compareProviders,
};
