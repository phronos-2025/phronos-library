#!/bin/bash
# Version hypotheses with timestamp
# Creates a dated snapshot of RESEARCH-HYPOTHESES.md

set -e

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M)
SOURCE="hypotheses/RESEARCH-HYPOTHESES.md"
DEST="hypotheses/versions/${DATE}-${TIME}-hypotheses.md"

if [ ! -f "$SOURCE" ]; then
    echo "Error: $SOURCE not found"
    exit 1
fi

cp "$SOURCE" "$DEST"
echo "Created snapshot: $DEST"

# Add to git
git add "$DEST"
echo "Staged for commit"

# Show diff summary if there's a previous version
PREV=$(ls -t hypotheses/versions/*.md 2>/dev/null | head -2 | tail -1)
if [ -n "$PREV" ] && [ "$PREV" != "$DEST" ]; then
    echo ""
    echo "Changes from previous version:"
    diff --brief "$PREV" "$DEST" || true
fi
