#!/bin/sh
set -e

echo "[entrypoint] simulations-service: prisma generate…"
npx --no-install prisma generate

echo "[entrypoint] simulations-service: prisma db push…"
npx --no-install prisma db push --skip-generate --accept-data-loss || {
  echo "[entrypoint] db push failed — service will exit"
  exit 1
}

if [ -f "prisma/seed.ts" ]; then
  echo "[entrypoint] simulations-service: seeding (idempotent)…"
  TS_NODE_TRANSPILE_ONLY=true \
  TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node","target":"ES2022","esModuleInterop":true,"resolveJsonModule":true}' \
  npx --no-install ts-node prisma/seed.ts || echo "[entrypoint] seed completed with warnings"
fi

echo "[entrypoint] starting: $@"
exec "$@"
