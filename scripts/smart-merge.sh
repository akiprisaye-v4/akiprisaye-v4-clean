#!/bin/bash
set -e

PR=$1

if [ -z "$PR" ]; then
  echo "Usage:  ./scripts/smart-merge.sh <PR_NUMBER>"
  exit 1
fi

echo "🔄 Fetching PR #$PR..."
gh pr checkout "$PR"

echo "🔄 Syncing with main..."
git fetch origin main

if !  git merge origin/main --no-edit; then
  echo ""
  echo "❌ MERGE CONFLICTS DETECTED!"
  echo ""
  echo "📝 Conflicted files:"
  git diff --name-only --diff-filter=U
  echo ""
  echo "👉 Resolve conflicts, then run:"
  echo "   git add ."
  echo "   git commit"
  echo "   git push"
  echo "   ./scripts/smart-merge.sh $PR"
  exit 1
fi

echo "✅ No conflicts!  Pushing..."
git push

echo "🚀 Merging PR #$PR..."
gh pr merge "$PR" --squash --delete-branch --admin

echo ""
echo "✅ PR #$PR merged successfully!"
