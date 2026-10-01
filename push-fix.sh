#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "▶ typecheck + build locally…"
npm run build

git add -A
git status

if git diff --cached --quiet; then
  echo "Nothing to commit — pushing main anyway…"
else
  git commit -m "$(cat <<'EOF'
Update kettle title styles, carousel and settle speed for Pages

EOF
)"
fi

git push origin main
echo ""
echo "Pushed. Watch: https://github.com/artbashkirov/smarttu/actions"
echo "Site: https://artbashkirov.github.io/smarttu/"
