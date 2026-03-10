#!/bin/bash
set -e

echo "=== Building server ==="
npm run server:build

echo "=== Building Expo static bundle ==="
npm run expo:static:build

echo "=== Build complete ==="
