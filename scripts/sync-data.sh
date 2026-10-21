#!/usr/bin/env bash
# Refresh the bundled offline snapshot from the live site (used on first launch with no network).
set -e; cd "$(dirname "$0")/.."; curl -fsSL https://kitchengenome.soulbound.co.kr/data.js -o www/data/data.js; echo "www/data/data.js $(wc -c < www/data/data.js) bytes"
