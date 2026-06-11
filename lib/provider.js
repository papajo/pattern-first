/**
 * Provider abstraction layer for multi-model orchestration.
 *
 * Each provider implements a standard interface:
 *   { id, name, description, runChecks(products, pattern, options) }
 *
 * Supports product research providers and knowledge base providers.
 */

'use strict';

const { runChecks } = require('./checks');
const { answerQuestion, validateAnswer } = require('./knowledge');
const path = require('path');

// ─── Provider Registry ─────────────────────────────────────────────────────

const providers = {};

// ─── Built-in: Simulated (Local) Provider ──────────────────────────────────

providers['simulated'] = {
  id: 'simulated',
  name: 'Simulated (Local)',
  description: 'Deterministic local execution with simulated market data. No API keys needed.',
  type: 'research',
  capabilities: ['checks', 'constraint-report'],

  runChecks(products, pattern, options = {}) {
    return runChecks(products, pattern);
  },
};

// ─── Built-in: TechCorp Knowledge Provider ─────────────────────────────────

providers['techcorp-knowledge'] = {
  id: 'techcorp-knowledge',
  name: 'TechCorp Knowledge Assistant',
  description: 'Answers questions about TechCorp using only approved internal documents from the knowledge base.',
  type: 'knowledge',
  capabilities: ['qa', 'citation', 'document-retrieval'],

  runChecks(products, pattern, options = {}) {
    // This provider handles question-answering, not product checks
    // The 'products' parameter is unused — knowledge provider reads from
    // its own data source (.knowledge/techcorp/)
    return runChecks(products, pattern);
  },

  /**
   * Answer a natural language question from the TechCorp knowledge base.
   */
  answerQuestion(question, knowledgeDir) {
    const dir = knowledgeDir || path.join(__dirname, '..', '.knowledge', 'techcorp');
    return answerQuestion(question, dir);
  },

  /**
   * Validate the answer against the pattern's success criteria.
   */
  validateAnswer(question, answer, knowledgeDir) {
    const dir = knowledgeDir || path.join(__dirname, '..', '.knowledge', 'techcorp');
    const { loadDocuments } = require('./knowledge');
    const docs = loadDocuments(dir);
    return validateAnswer(question, answer, docs);
  },
};

// ─── Provider registration API ─────────────────────────────────────────────

function registerProvider(provider) {
  if (!provider.id || !provider.name || typeof provider.runChecks !== 'function') {
    throw new Error('Provider must have id, name, and runChecks()');
  }
  providers[provider.id] = provider;
}

function getProvider(id) {
  if (id && providers[id]) return providers[id];
  if (id) console.warn(`Provider "${id}" not found. Falling back to "simulated".`);
  return providers['simulated'];
}

function listProviders() {
  return Object.values(providers).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    type: p.type || 'research',
    capabilities: p.capabilities || [],
  }));
}

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
