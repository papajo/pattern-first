/**
 * Knowledge base retriever for the TechCorp Knowledge Assistant.
 *
 * Loads documents from a knowledge directory, indexes them by keyword,
 * and retrieves relevant excerpts for a given question.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Document types ────────────────────────────────────────────────────────

const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.json'];

// ─── Document loader ───────────────────────────────────────────────────────

/**
 * Load all documents from a knowledge directory.
 * Returns an array of { id, title, filePath, content, sections }.
 */
function loadDocuments(knowledgeDir) {
  if (!fs.existsSync(knowledgeDir)) {
    throw new Error(`Knowledge directory not found: ${knowledgeDir}`);
  }

  const docs = [];
  const files = fs.readdirSync(knowledgeDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

    const filePath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const name = path.basename(file, ext);

    docs.push({
      id: name,
      title: inferTitle(content, name),
      filePath: file,
      content,
      sections: extractSections(content),
      tokens: content.split(/\s+/).length,
    });
  }

  return docs;
}

function inferTitle(content, filename) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : filename.replace(/[-_]/g, ' ');
}

function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentHeading = 'preamble';
  let currentContent = [];
  let startLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^##?\s+(.+)/);

    if (headingMatch) {
      if (currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n').trim(),
          startLine,
          endLine: i,
        });
      }
      currentHeading = headingMatch[1].trim();
      currentContent = [];
      startLine = i + 1;
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n').trim(),
      startLine,
      endLine: lines.length,
    });
  }

  return sections;
}

// ─── Search engine ─────────────────────────────────────────────────────────

function searchKnowledge(question, docs, options = {}) {
  const maxResults = options.maxResults || 5;
  const minScore = options.minScore || 0.1;

  const queryTerms = question.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2 && !isStopWord(t));

  const results = [];

  for (const doc of docs) {
    for (const section of doc.sections) {
      const score = scoreSection(queryTerms, section, doc);
      if (score >= minScore) {
        results.push({
          document: doc.id,
          documentTitle: doc.title,
          section: section.heading,
          excerpt: extractExcerpt(section.content, queryTerms, 300),
          score: round2(score * 100),
          startLine: section.startLine,
          endLine: section.endLine,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

function scoreSection(queryTerms, section, doc) {
  if (queryTerms.length === 0) return 0;

  const sectionLower = section.content.toLowerCase();
  const headingLower = section.heading.toLowerCase();
  const titleLower = doc.title.toLowerCase();
  let score = 0;

  for (const term of queryTerms) {
    if (headingLower.includes(term)) score += 3.0;
    if (titleLower.includes(term)) score += 1.0;
    const regex = new RegExp(term, 'gi');
    const matches = (sectionLower.match(regex) || []).length;
    score += matches * 0.5;
  }

  return Math.min(score / (queryTerms.length * 2), 1.0);
}

function extractExcerpt(content, terms, maxLen) {
  if (content.length <= maxLen) return content;

  const lower = content.toLowerCase();
  let bestIdx = 0;

  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx >= 0) {
      bestIdx = Math.max(bestIdx, Math.max(0, idx - maxLen / 3));
      break;
    }
  }

  let excerpt = content.substring(bestIdx, bestIdx + maxLen);
  if (bestIdx > 0) excerpt = '...' + excerpt;
  if (bestIdx + maxLen < content.length) excerpt = excerpt + '...';
  return excerpt;
}

function isStopWord(word) {
  const stops = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can',
    'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been',
    'its', 'how', 'why', 'who', 'what', 'when', 'where', 'which',
    'this', 'that', 'with', 'from', 'they', 'their', 'them', 'will',
    'would', 'could', 'should', 'about', 'into', 'over', 'after',
    'than', 'then', 'these', 'those', 'very', 'just', 'also', 'more',
  ]);
  return stops.has(word);
}

// ─── Answer formatter ─────────────────────────────────────────────────────

function formatAnswer(question, results, docs) {
  if (results.length === 0) {
    return {
      question,
      found: false,
      confidence: 0,
      answer: 'No relevant information found in the knowledge base.',
      citations: [],
      documentCount: docs.length,
    };
  }

  const primary = results[0];

  return {
    question,
    found: true,
    answer: primary.excerpt,
    confidence: primary.score,
    citations: results.map(r => ({
      document: r.documentTitle,
      section: r.section,
      file: `${r.document}.md`,
      relevance: r.score,
    })),
    documentCount: docs.length,
  };
}

// ─── Knowledge Assistant ───────────────────────────────────────────────────

function answerQuestion(question, knowledgeDir) {
  const docs = loadDocuments(knowledgeDir);
  const results = searchKnowledge(question, docs);
  return formatAnswer(question, results, docs);
}

function validateAnswer(question, answer, docs) {
  const checks = [];

  // C1: Citation Present
  const hasCitation = answer.found && answer.citations.length > 0;
  checks.push({
    id: 'C1',
    metric: 'Citation Present',
    status: hasCitation ? 'pass' : 'fail',
    actual: answer.citations.length,
    threshold: 1,
    message: hasCitation
      ? `Found ${answer.citations.length} relevant section(s)`
      : 'No citations found — answer is not grounded in documents',
  });

  // C2: Confidence Score
  const highConfidence = answer.found && answer.confidence >= 50;
  checks.push({
    id: 'C2',
    metric: 'Confidence Score',
    status: !answer.found ? 'fail' : (highConfidence ? 'pass' : 'fail'),
    actual: answer.found ? answer.confidence : 0,
    threshold: 50,
    message: !answer.found
      ? 'No answer found in knowledge base'
      : highConfidence
        ? `Confidence: ${answer.confidence}% — reliable match`
        : `Low confidence (${answer.confidence}%) — answer may be unreliable`,
  });

  // C3: Knowledge Base Access
  const docsFound = docs.length > 0;
  checks.push({
    id: 'C3',
    metric: 'Knowledge Base Access',
    status: docsFound ? 'pass' : 'fail',
    actual: docs.length,
    threshold: 1,
    message: docsFound
      ? `Loaded ${docs.length} document(s)`
      : 'No documents found in knowledge base',
  });

  const passed = checks.every(c => c.status === 'pass');
  return { checks, passed, passedCount: checks.filter(c => c.status === 'pass').length };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = {
  loadDocuments,
  searchKnowledge,
  formatAnswer,
  answerQuestion,
  validateAnswer,
};
