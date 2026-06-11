#!/usr/bin/env bash
#
# Example: Run with machine-readable JSON output.
#
# Usage:
#   bash examples/run-json-output.sh

set -euo pipefail

KEYWORD="Smart Lighting"
LOCATION="US"

echo "=== Pattern-First AI: Product Research (JSON) ===" >&2
echo "Keyword:  $KEYWORD" >&2
echo "Location: $LOCATION" >&2
echo "" >&2

node "$(dirname "$0")/../pattern-runner" \
  --keyword "$KEYWORD" \
  --location "$LOCATION" \
  --format json
