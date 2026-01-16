#!/bin/bash
set -e

echo "🔍 ANALYSE DÉTAILLÉE DU BUNDLE"
echo "=============================="
echo ""

# Build production
echo "📦 Building..."
npm run build

echo ""
echo "📊 STATISTIQUES DÉTAILLÉES:"
echo ""

# Analyser les imports
echo "🔍 Top 20 plus gros modules:"
find dist/assets -name "*.js" -type f -exec du -h {} \; | sort -h -r | head -20

echo ""
echo "📦 Taille par catégorie:"
echo "  Vendor (React, etc.):"
find dist/assets -name "*react*" -o -name "*vendor*" 2>/dev/null | xargs du -ch 2>/dev/null | tail -1

echo "  Charts:"
find dist/assets -name "*chart*" -o -name "*Chart*" | xargs du -ch 2>/dev/null | tail -1

echo "  Maps:"
find dist/assets -name "*Carte*" -o -name "*map*" | xargs du -ch 2>/dev/null | tail -1

echo ""
echo "✅ Analyse terminée!"
