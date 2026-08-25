#!/usr/bin/env bash
# Run this before zipping/sharing the project. node_modules and dist are
# platform-specific / rebuildable and should never be shipped in a zip —
# npm install regenerates node_modules correctly for whatever OS runs it.
set -e
rm -rf node_modules dist
echo "Cleaned. Zip the folder now, or run: npm install && npm run build"
