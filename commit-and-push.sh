#!/usr/bin/env bash
set -e
rm -f prepare-commit.sh scan-secrets.sh
git add -A
git commit -m "Rebuild portfolio: Vite + React + Supabase (replaces old site)

Full-stack developer portfolio with admin panel, Supabase Auth + RLS,
realtime content editing, music player, resume upload, and security
hardening (input validation, DB constraints, CSP headers)."
echo "--- commit created ---"
git log --oneline -1
echo "--- pushing (force, replaces old history) ---"
git push --force origin main 2>&1 | tail -3
echo "--- remote head after push ---"
git ls-remote origin main
