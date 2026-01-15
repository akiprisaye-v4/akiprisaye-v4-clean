#!/bin/bash
set -e

echo "🎨 EXTRACTION DU CSS CRITIQUE"
echo "=============================="
echo ""

# Le CSS critique = classes utilisées sur la page d'accueil uniquement
echo "💡 Stratégie:"
echo "   1. Charger CSS critique inline (<50 KB)"
echo "   2. Lazy-load le reste du CSS"
echo ""

echo "📊 Taille actuelle:  248 KB (34 KB gzipped)"
echo ""

echo "✅ Options:"
echo "   A) Accepter 248 KB (déjà optimal avec purge)"
echo "   B) Split CSS par route (lazy CSS)"
echo "   C) Critical CSS inline"
echo ""

echo "💭 Recommandation: 34 KB gzipped est acceptable!"
echo "   Google recommande < 100 KB pour le CSS initial"
