/**
 * Output formatting for pattern-runner.
 *
 * Supports modes:
 *   table     — Human-readable terminal report with colors (ANSI)
 *   json      — Machine-readable JSON payload
 *   verbose   — Table + per-check details
 *   memory    — Run history display
 *   knowledge — Knowledge Q&A answer display
 */

'use strict';

// ─── ANSI helpers ──────────────────────────────────────────────────────────

const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function icon(status) {
  switch (status) {
    case 'pass': return `${GREEN}✓${RESET}`;
    case 'fail': return `${RED}✗${RESET}`;
    default: return '?';
  }
}

function fmtLabel(label, value) {
  const padded = String(value).padStart(8, ' ');
  return `  ${label}: ${padded}`;
}

// ─── Format: table (default, product research) ─────────────────────────────

function formatReport(results, args, pattern, provider) {
  const lines = [];
  const totalChecks = results.passed[0]?.checks.length
    || results.failed[0]?.checks.length
    || '?';

  lines.push('');
  lines.push(`${BOLD}Pattern-First AI — Product Research Runner${RESET}`);
  lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
  lines.push(`Pattern:  ${pattern.name || 'Unnamed Pattern'}`);
  lines.push(`Keyword:  ${args.keyword}`);
  lines.push(`Location: ${args.location}`);
  lines.push(`Provider: ${provider ? provider.name : 'simulated'}`);
  lines.push(`Source:   Simulated (Google Trends proxy)`);
  lines.push('');

  const s = results.summary;
  const passColor = s.passedCount > 0 ? GREEN : RED;
  lines.push(`${BOLD}Results — ${passColor}${s.passedCount}${RESET}${BOLD} of ${s.total} products passed all ${totalChecks} checks${RESET}`);
  lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
  lines.push('');

  if (results.passed.length > 0) {
    lines.push(`${GREEN}${BOLD}✅ Products that PASSED all checks${RESET}`);
    lines.push('');
    for (const pr of results.passed) {
      lines.push(`  ${BOLD}${pr.product.name}${RESET}  ${GREEN}★ Pass: ${pr.passedCount}/${pr.checks.length}${RESET}`);
      lines.push(`     ${fmtLabel('Market Share', fmtPct(pr.product.market_share))}  ${icon(pr.checks[0]?.status)}`);
      lines.push(`     ${fmtLabel('Search Vol', fmtNum(pr.product.search_volume))}  ${icon(pr.checks[1]?.status)}`);
      lines.push(`     ${fmtLabel('Score', pr.product.score)}         ${icon(pr.checks[2]?.status)}`);
      lines.push(`     ${fmtLabel('Competition', pr.product.competition_count)}     ${icon(pr.checks[3]?.status)}`);
      lines.push(`     ${fmtLabel('Margin', fmtPct(pr.product.profit_margin))}  ${icon(pr.checks[4]?.status)}`);
      lines.push(`     ${fmtLabel('Saturation', pr.product.keyword_saturation)}      ${icon(pr.checks[5]?.status)}`);
      lines.push(`     ${fmtLabel('Reviews', pr.product.review_volume)}       ${icon(pr.checks[6]?.status)}`);
      lines.push('');
    }
  }

  if (results.failed.length > 0) {
    lines.push(`${RED}${BOLD}❌ Products that FAILED${RESET}`);
    lines.push('');
    for (const pr of results.failed) {
      const firstFail = pr.checks.find(c => c.status === 'fail');
      lines.push(`  ${BOLD}${pr.product.name}${RESET}`);
      lines.push(`     ${RED}✗${RESET} Failed ${pr.failedCount}/${pr.checks.length} checks`);
      if (firstFail) {
        lines.push(`     ${RED}✗${RESET} First failure: ${firstFail.id} (${firstFail.metric}: ${fmtVal(firstFail.actual)} ${firstFail.condition} ${fmtVal(firstFail.threshold)})`);
      }
      lines.push('');
    }
  }

  if (results.constraintReport && results.failed.length > 0) {
    const cr = results.constraintReport;
    lines.push(`${YELLOW}${BOLD}📊 Constraint Report${RESET}`);
    lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
    lines.push(`  Most restrictive: ${cr.criterionId} (${cr.metric} ${cr.condition} ${fmtVal(cr.threshold)})`);
    lines.push(`  Failed:           ${cr.failedCount} product(s)`);
    lines.push(`  Average actual:   ${fmtVal(cr.averageActual)}`);
    lines.push(`  ${YELLOW}💡 ${cr.suggestion}${RESET}`);
    lines.push('');
  }

  lines.push(`${DIM}─── pattern-runner complete${'─'.repeat(28)}${RESET}`);
  lines.push('');

  return lines.join('\n');
}

// ─── Format: verbose ───────────────────────────────────────────────────────

function formatVerbose(results, args, pattern, provider) {
  const lines = [];
  lines.push(formatReport(results, args, pattern, provider));

  lines.push(`${BOLD}🔍 Per-Check Detail${RESET}`);
  lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
  lines.push('');

  const allResults = [...results.passed, ...results.failed];
  for (const pr of allResults) {
    lines.push(`  ${BOLD}${pr.product.name}${RESET}`);
    for (const check of pr.checks) {
      const statusIcon = check.status === 'pass' ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      const actualStr = check.actual !== undefined ? ` (actual: ${fmtVal(check.actual)}` : '';
      const thresholdStr = check.threshold !== undefined ? `, threshold: ${fmtVal(check.threshold)})` : '';
      lines.push(`    ${statusIcon} ${check.id} ${check.metric}${actualStr}${thresholdStr}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Format: JSON ──────────────────────────────────────────────────────────

function formatJson(results, args, provider) {
  const payload = {
    runner: 'pattern-first-ai',
    version: '0.1.0',
    keyword: args.keyword,
    location: args.location,
    provider: provider ? provider.id : 'simulated',
    timestamp: new Date().toISOString(),
    summary: results.summary,
    constraintReport: results.constraintReport,
    products: {
      passed: results.passed.map(pr => ({
        id: pr.product.id,
        name: pr.product.name,
        passedCount: pr.passedCount,
        totalChecks: pr.checks.length,
        metrics: pr.product,
      })),
      failed: results.failed.map(pr => ({
        id: pr.product.id,
        name: pr.product.name,
        passedCount: pr.passedCount,
        totalChecks: pr.checks.length,
        metrics: pr.product,
        firstFailure: pr.firstFailure,
      })),
    },
  };

  return JSON.stringify(payload, null, 2);
}

// ─── Format: memory history ────────────────────────────────────────────────

function formatMemory(history, args) {
  const lines = [];
  lines.push('');
  lines.push(`${BOLD}Run History: ${history.keyword} (${history.location})${RESET}`);
  lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
  lines.push(`First run:  ${history.firstRun}`);
  lines.push(`Total runs: ${history.runCount}`);
  lines.push(`Total pass: ${history.totalPassed}`);
  lines.push(`Total fail: ${history.totalFailed}`);
  lines.push('');
  lines.push(`${BOLD}Recent runs:${RESET}`);
  for (const run of history.runs.slice(-10).reverse()) {
    const date = new Date(run.timestamp).toLocaleString();
    lines.push(`  #${run.runNumber} [${date}] ${run.passed}/${run.total} passed (${run.provider})`);
  }
  lines.push('');
  return lines.join('\n');
}

// ─── Format: knowledge answer ──────────────────────────────────────────────

function formatKnowledgeAnswer(question, answer, validation, provider) {
  const lines = [];

  lines.push('');
  lines.push(`${BOLD}TechCorp Knowledge Assistant${RESET}`);
  lines.push(`${DIM}${'─'.repeat(52)}${RESET}`);
  lines.push(`Provider: ${provider.name}`);
  lines.push(`Question: ${question}`);
  lines.push(`Documents: ${answer.documentCount} loaded`);
  lines.push('');

  if (answer.found) {
    lines.push(`${BOLD}Answer:${RESET}`);
    lines.push('');
    lines.push(`  ${answer.answer}`);
    lines.push('');
    lines.push(`${BOLD}Citations:${RESET}`);
    for (const c of answer.citations) {
      const scoreColor = c.relevance >= 50 ? GREEN : YELLOW;
      lines.push(`  [${scoreColor}${c.relevance}%${RESET}] ${c.document} > ${c.section}`);
    }
    lines.push('');
  } else {
    lines.push(`${YELLOW}${answer.answer}${RESET}`);
    lines.push('');
  }

  // Validation checks
  lines.push(`${BOLD}Quality Checks:${RESET}`);
  for (const check of validation.checks) {
    const statusIcon = check.status === 'pass' ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    lines.push(`  ${statusIcon} ${check.id} ${check.metric}: ${check.message}`);
  }
  lines.push('');

  const passIcon = validation.passed ? `${GREEN}✓ PASS${RESET}` : `${RED}✗ FAIL${RESET}`;
  lines.push(`Quality verdict: ${passIcon} (${validation.passedCount}/${validation.checks.length})`);
  lines.push('');
  lines.push(`${DIM}─── question answered${'─'.repeat(35)}${RESET}`);
  lines.push('');

  return lines.join('\n');
}

// ─── Value formatting helpers ──────────────────────────────────────────────

function fmtPct(val) {
  if (val === undefined || val === null) return 'N/A';
  return `${(val * 100).toFixed(0)}%`;
}

function fmtNum(val) {
  if (val === undefined || val === null) return 'N/A';
  return Number(val).toLocaleString();
}

function fmtVal(val) {
  if (val === undefined || val === null) return 'N/A';
  if (typeof val === 'number' && val < 1) return fmtPct(val);
  if (typeof val === 'number') return String(val);
  return String(val);
}

module.exports = { formatReport, formatVerbose, formatJson, formatMemory, formatKnowledgeAnswer };
