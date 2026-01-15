## 📋 Pre-merge Checklist

- [ ] ✅ Branch synced with `main` (no conflicts)
- [ ] ✅ CI checks passing
- [ ] ✅ Code reviewed

## 🔄 Sync with main before requesting merge

```bash
git fetch origin main
git merge origin/main
# Resolve conflicts if any
git push

# 3. Commit les changements
git add scripts/smart-merge.sh . github/pull_request_template. md
git commit -m "chore: add merge tools to prevent conflicts

- Smart merge script with conflict detection
- PR template with sync checklist"
git push
# Workflow pour notifier les PRs en retard
cat > . github/workflows/pr-sync-reminder.yml << 'EOF'
name: PR Sync Reminder

on:
  schedule:
    - cron: '0 9 * * 1'  # Tous les lundis à 9h
  workflow_dispatch:     # Manuel

jobs:
  check-prs:
    runs-on:  ubuntu-latest
    steps: 
      - uses: actions/checkout@v4
      
      - name: Check outdated PRs
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          echo "🔍 Checking open PRs..."
          
          gh pr list --state open --json number,title,headRefName,updatedAt | \
          jq -r '.[] | select(.updatedAt < (now - 259200)) | "\(.number) \(.headRefName)"' | \
          while read pr branch; do
            echo "⚠️ PR #$pr is behind main"
            
            gh pr comment "$pr" --body "👋 **Reminder:** This PR may be behind \`main\`. 

Please sync to avoid merge conflicts: 
\`\`\`bash
git fetch origin main
git merge origin/main
git push
\`\`\`

Or use:  \`./scripts/smart-merge.sh $pr\`"
          done
