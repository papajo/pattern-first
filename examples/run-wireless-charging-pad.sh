#!/usr/bin/env bash
#
# Example: Run product research for "Wireless Charging Pad" in the US market.
#
# Usage:
#   bash examples/run-wireless-charging-pad.sh

set -euo pipefail

KEYWORD="Wireless Charging Pad"
LOCATION="US"

echo "=== Pattern-First AI: Product Research ==="
echo "Keyword:  $KEYWORD"
echo "Location: $LOCATION"
echo ""

node "$(dirname "$0")/../pattern-runner" \
  --keyword "$KEYWORD" \
  --location "$LOCATION" \
  "$@"
