#!/usr/bin/env bash
#
# Example: Run product research for "Yoga Mat" in the DE market.
#
# Usage:
#   bash examples/run-yoga-mat.sh

set -euo pipefail

KEYWORD="Yoga Mat"
LOCATION="DE"

echo "=== Pattern-First AI: Product Research ==="
echo "Keyword:  $KEYWORD"
echo "Location: $LOCATION"
echo ""

node "$(dirname "$0")/../pattern-runner" \
  --keyword "$KEYWORD" \
  --location "$LOCATION" \
  "$@"
