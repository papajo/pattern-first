/**
 * Deterministic mock product data generator.
 *
 * Produces simulated products with metrics calibrated so that
 * roughly 30-50% pass all 7 falsifiability checks (ProductResearchMVP).
 * Deterministic per keyword for reproducible results.
 */

'use strict';

// ─── Seeded PRNG (Mulberry32) ──────────────────────────────────────────────

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ─── Product name generation ───────────────────────────────────────────────

function generateProductName(keyword, index, rand) {
  const prefixes = ['Pro', 'Elite', 'Ultra', 'Premium', 'Smart', 'Advanced', 'Eco', 'Swift'];
  const suffixes = ['Plus', 'Max', 'X', 'V2', 'Go', 'Air', 'Prime', 'Neo'];
  const prefixIdx = Math.floor(rand() * prefixes.length);
  const suffixIdx = Math.floor(rand() * suffixes.length);
  const variants = [
    `${prefixes[prefixIdx]} ${keyword}`,
    `${keyword} ${suffixes[suffixIdx]}`,
    `${prefixes[prefixIdx]} ${keyword} ${suffixes[suffixIdx]}`,
  ];
  return variants[index % variants.length];
}

// ─── Main generator ────────────────────────────────────────────────────────

/**
 * Generate simulated products for a keyword + location.
 *
 * Products alternate between two generation modes:
 *   pass-biased  — metrics cluster safely inside all passing thresholds
 *   fail-biased  — metrics span wide ranges, most fall outside at least one threshold
 *
 * This ensures a deterministic mix of ~3-5 passing products out of 10.
 */
function generateProducts(keyword, location, options = {}) {
  const count = options.count || 10;
  const seed = hashString(`${keyword.toLowerCase()}:${location.toLowerCase()}`);
  const rand = mulberry32(seed);

  const products = [];

  for (let i = 0; i < count; i++) {
    const passBiased = (i % 2 === 0);

    const product = {
      id: `P${String(i + 1).padStart(3, '0')}`,
      name: generateProductName(keyword, i, rand),
      location: location,
    };

    if (passBiased) {
      // Safely inside passing thresholds (99%+ pass probability per metric)
      product.market_share = round2(0.55 + rand() * 0.35);         // 0.55 – 0.90     (need > 0.50)
      product.search_volume = Math.floor(7000 + rand() * 18000);   // 7k – 25k        (need > 5k)
      product.score = round1(1 + rand() * 6);                      // 1 – 7           (need < 10)
      product.competition_count = Math.floor(rand() * 4);          // 0 – 3           (need < 5)
      product.profit_margin = round2(0.35 + rand() * 0.33);        // 0.35 – 0.68     (need > 0.30)
      product.keyword_saturation = round1(rand() * 2.5);           // 0 – 2.5         (need < 3)
      product.review_volume = Math.floor(5 + rand() * 40);         // 5 – 45          (need < 50)
    } else {
      // Wide range straddling thresholds — most fail at least one check
      product.market_share = round2(0.10 + rand() * 0.80);         // 0.10 – 0.90
      product.search_volume = Math.floor(500 + rand() * 25000);    // 500 – 25.5k
      product.score = round1(1 + rand() * 22);                     // 1 – 23
      product.competition_count = Math.floor(rand() * 13);          // 0 – 12
      product.profit_margin = round2(0.05 + rand() * 0.63);        // 0.05 – 0.68
      product.keyword_saturation = round1(rand() * 7);              // 0 – 7
      product.review_volume = Math.floor(5 + rand() * 150);         // 5 – 155
    }

    products.push(product);
  }

  return products;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

module.exports = { generateProducts };
