#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

REPO_URL="https://github.com/artbashkirov/smarttu.git"

if [[ ! -d .git ]]; then
  git init
  git checkout -b main
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git add -A
git status

git commit -m "$(cat <<'EOF'
Deploy Tuvio device search prototype to GitHub Pages

EOF
)" || echo "Nothing new to commit (ok if already committed)"

git push -u origin main

echo ""
echo "Enable Pages (GitHub Actions) if not already:"
echo "  Settings → Pages → Source: GitHub Actions"
echo "  or: gh api repos/artbashkirov/smarttu/pages -X POST -f build_type=workflow"
echo ""
echo "Site: https://artbashkirov.github.io/smarttu/"
