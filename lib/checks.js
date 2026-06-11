/**
 * Falsifiability check engine.
 *
 * Maps pattern success_criteria to comparison functions and runs them
 * against product data. Returns structured results with pass/fail per check.
 */

'use strict';

// ─── Metric field mapping ──────────────────────────────────────────────────

const METRIC_FIELD_MAP = {
  'Market Share': 'market_share',
  'Search Volume': 'search_volume',
  'Score': 'score',
  'Competition Count': 'competition_count',
  'Profit Margin': 'profit_margin',
  'Keyword Saturation': 'keyword_saturation',
  'Review Volume': 'review_volume',
};

// ─── Comparison operators ──────────────────────────────────────────────────

const OPERATORS = {
  'must be greater than': (a, b) => a > b,
  'must be less than': (a, b) => a < b,
  'must be greater than or equal to': (a, b) => a >= b,
  'must be less than or equal to': (a, b) => a <= b,
  'must equal': (a, b) => a === b,
};

// ─── Check runner ──────────────────────────────────────────────────────────

/**
 * Run all checks from a pattern against an array of products.
 *
 * @param {Array} products - Product data objects
 * @param {Object} pattern - Loaded pattern definition
 * @returns {Object} { passed, failed, summary }
 */
function runChecks(products, pattern) {
  const criteria = pattern.intent.success_criteria;

  const passed = [];
  const failed = [];

  // Track per-criterion failure count for constraint report
  const criterionFailCounts = {};
  const criterionTotals = {};
  for (const c of criteria) {
    criterionFailCounts[c.id] = 0;
    criterionTotals[c.id] = 0;
  }

  for (const product of products) {
    const productResults = {
      product,
      checks: [],
      passedCount: 0,
      failedCount: 0,
      passed: true,
      firstFailure: null,
    };

    for (const criterion of criteria) {
      const fieldName = METRIC_FIELD_MAP[criterion.metric];
      const operatorFn = OPERATORS[criterion.condition];

      if (!fieldName) {
        productResults.checks.push({
          id: criterion.id,
          metric: criterion.metric,
          status: 'error',
          message: `Unknown metric: ${criterion.metric}`,
        });
        productResults.failedCount++;
        continue;
      }

      if (!operatorFn) {
        productResults.checks.push({
          id: criterion.id,
          metric: criterion.metric,
          status: 'error',
          message: `Unknown operator: ${criterion.condition}`,
        });
        productResults.failedCount++;
        continue;
      }

      const actualValue = product[fieldName];
      const threshold = criterion.value;
      const checkPassed = operatorFn(actualValue, threshold);

      criterionTotals[criterion.id]++;

      if (checkPassed) {
        productResults.checks.push({
          id: criterion.id,
          metric: criterion.metric,
          status: 'pass',
          actual: actualValue,
          threshold: threshold,
          condition: criterion.condition,
        });
        productResults.passedCount++;
      } else {
        criterionFailCounts[criterion.id]++;
        productResults.checks.push({
          id: criterion.id,
          metric: criterion.metric,
          status: 'fail',
          actual: actualValue,
          threshold: threshold,
          condition: criterion.condition,
        });
        productResults.failedCount++;
        productResults.passed = false;
        if (!productResults.firstFailure) {
          productResults.firstFailure = criterion.id;
        }
      }
    }

    if (productResults.passed) {
      passed.push(productResults);
    } else {
      failed.push(productResults);
    }
  }

  // Sort passed by count of passed checks desc, then by product id
  passed.sort((a, b) => b.passedCount - a.passedCount || a.product.id.localeCompare(b.product.id));
  failed.sort((a, b) => b.passedCount - a.passedCount || a.product.id.localeCompare(b.product.id));

  // Compute constraint report
  const mostRestrictive = findMostRestrictive(criterionFailCounts, criteria, failed);

  return {
    passed,
    failed,
    summary: {
      total: products.length,
      passedCount: passed.length,
      failedCount: failed.length,
      passedRate: products.length > 0 ? Math.round((passed.length / products.length) * 100) : 0,
    },
    constraintReport: mostRestrictive,
  };
}

/**
 * Identify the most restrictive criterion from failed products.
 */
function findMostRestrictive(failCounts, criteria, failedResults) {
  let maxFailId = null;
  let maxFailCount = 0;

  for (const c of criteria) {
    if (failCounts[c.id] > maxFailCount) {
      maxFailCount = failCounts[c.id];
      maxFailId = c.id;
    }
  }

  if (!maxFailId || maxFailCount === 0) {
    return null;
  }

  const criterion = criteria.find(c => c.id === maxFailId);
  const failingProducts = failedResults.filter(r =>
    r.checks.some(ch => ch.id === maxFailId && ch.status === 'fail')
  );

  // Compute average actual value for the failing metric
  const fieldName = METRIC_FIELD_MAP[criterion.metric];
  const avgActual = failingProducts.length > 0
    ? round2(failingProducts.reduce((sum, r) => sum + (r.product[fieldName] || 0), 0) / failingProducts.length)
    : 'N/A';

  return {
    criterionId: maxFailId,
    metric: criterion.metric,
    condition: criterion.condition,
    threshold: criterion.value,
    failedCount: maxFailCount,
    averageActual: avgActual,
    suggestion: generateSuggestion(criterion, avgActual),
  };
}

function generateSuggestion(criterion, avgActual) {
  const metric = criterion.metric;
  const threshold = criterion.value;

  if (criterion.condition === 'must be greater than') {
    return `Try increasing the ${metric} threshold to ${Math.ceil(avgActual)} (currently ${threshold}).`;
  } else if (criterion.condition === 'must be less than') {
    return `Try increasing the ${metric} threshold to ${Math.ceil(avgActual)} (currently ${threshold}).`;
  }
  return `Review the ${metric} criterion threshold (currently ${threshold}).`;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { runChecks };
