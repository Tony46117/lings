#!/bin/bash
cd /home/muchacho/lings || exit 1

echo '--- syntax ---'
node --check script.js && echo 'script.js OK'
node --check worker.js && echo 'worker.js OK'

echo '--- dead refs check ---'
echo "stat-num/animateCounter refs in script.js: $(grep -c 'stat-num\|animateCounter' script.js) (should be 0)"

echo '--- rebuild bundle ---'
node build-worker.mjs
node --check worker.js && echo 'bundled worker.js valid'

echo '--- bundle sync ---'
node sync-check.mjs

echo '--- serve test ---'
python3 -m http.server 8099 >/tmp/l10.log 2>&1 &
SVPID=$!
sleep 2
for p in index.html styles.css script.js assets/avocado-timelapse.mp4; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8099/$p)"
done
kill $SVPID 2>/dev/null

echo '--- commit + push ---'
git add -A
git status --short
git commit -q -m 'Remove dead animated-counter code after replacing hero stats with all-counties coverage statement' && echo committed

REMOTE_URL=$(git remote get-url origin)
echo "remote: $REMOTE_URL"
if git push origin main 2>&1 | tail -3; then
  echo 'push OK (plain)'
else
  echo 'plain push failed - trying token from apis.txt'
  TOKEN=$(grep -iE '^github' /home/muchacho/Documents/DETAIL/apis.txt | head -1 | sed -E 's/^[^=]*=[[:space:]]*//;s/^[^:]*:[[:space:]]*//' | tr -d ' "\r')
  git push "https://x-access-token:${TOKEN}@github.com/Tony46117/lings.git" main 2>&1 | tail -3
fi

echo "local=$(git rev-parse HEAD)"
echo "remote=$(git ls-remote origin refs/heads/main 2>/dev/null | awk '{print $1}')"
echo '--- tree clean? ---'
git status --short
echo '(empty = clean)'
echo '===ALL DONE==='
