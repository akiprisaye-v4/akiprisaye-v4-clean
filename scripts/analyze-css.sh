#!/bin/bash
set -e

echo "🎨 ANALYSE CSS DÉTAILLÉE"
echo "========================"
echo ""

CSS_FILE=$(find dist/assets -name "*.css" | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "⚠️ Pas de fichier CSS trouvé.  Lancez 'npm run build' d'abord."
  exit 1
fi

echo "📦 Fichier analysé: $(basename $CSS_FILE)"
echo "📊 Taille: $(du -h $CSS_FILE | awk '{print $1}')"
echo ""

echo "🔍 Top 10 propriétés CSS les plus utilisées:"
grep -oE '\.[a-zA-Z0-9_-]+' $CSS_FILE | sort | uniq -c | sort -rn | head -10

echo ""
echo "📈 Statistiques:"
echo "  Total de classes: $(grep -oE '\.[a-zA-Z0-9_-]+' $CSS_FILE | sort -u | wc -l)"
echo "  Total de lignes: $(wc -l < $CSS_FILE)"
echo "  Media queries:  $(grep -c '@media' $CSS_FILE)"
echo "  Keyframes: $(grep -c '@keyframes' $CSS_FILE)"

echo ""
echo "✅ Analyse terminée!"
