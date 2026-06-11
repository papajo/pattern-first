#!/usr/bin/env bash
#
# Example: Run with verbose per-check detail output.
#
# Usage:
#   bash examples/run-verbose.sh

set -euo pipefail

KEYWORD="Coffee Maker"
LOCATION="US"

echo "=== Pattern-First AI: Product Research (Verbose) ==="
echo "Keyword:  $KEYWORD"
echo "Location: $LOCATION"
echo ""

node "$(dirname "$0")/../pattern-runner" \
  --keyword "$KEYWORD" \
  --location "$LOCATION" \
  --verbose
