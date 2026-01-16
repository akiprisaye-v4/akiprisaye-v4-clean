#!/bin/bash
set -e

echo "🔄 CORRECTION DES HOOK DEPENDENCIES"
echo "===================================="
echo ""

# 1. IndiceVieChere.jsx
echo "[1/8] src/components/IndiceVieChere.jsx..."
# Ajouter fetchIndices aux deps
sed -i '/useEffect.*fetchIndices/,/\[\]);/{s/\[\]);/[fetchIndices]);/}' src/components/IndiceVieChere.jsx
echo "   ✅ Fixed"

# 2. ListeCourses.jsx
echo "[2/8] src/components/ListeCourses.jsx..."
sed -i '/useCallback.*calculerMagasinsProches/,/\[magasinsProches\]);/{s/\[magasinsProches\]);/[magasinsProches, calculerMagasinsProches]);/}' src/components/ListeCourses.jsx
echo "   ✅ Fixed"

# 3 & 4. MapLeaflet.jsx (2 hooks)
echo "[3/8] src/components/MapLeaflet. jsx (hook 1)..."
sed -i '35s/\[\]);/[loadLeaflet]);/' src/components/MapLeaflet.jsx
echo "[4/8] src/components/MapLeaflet.jsx (hook 2)..."
sed -i '42s/\[/[updateMap, /' src/components/MapLeaflet.jsx
echo "   ✅ Fixed (2 hooks)"

# 5. NewsWidget.jsx
echo "[5/8] src/components/NewsWidget. jsx..."
# Ajouter state pour setError d'abord
sed -i '/const \[news, setNews\]/a\  const [error, setError] = useState(null);' src/components/NewsWidget. jsx
# Puis fix deps
sed -i '/useEffect.*fetchNews/,/\[\]);/{s/\[\]);/[fetchNews]);/}' src/components/NewsWidget.jsx
echo "   ✅ Fixed"

# 6. PalmaresEnseignes.jsx
echo "[6/8] src/components/PalmaresEnseignes.jsx..."
sed -i '/useEffect.*fetchRankings/,/\[\]);/{s/\[\]);/[fetchRankings]);/}' src/components/PalmaresEnseignes.jsx
echo "   ✅ Fixed"

# 7. PriceAlertCenter.jsx
echo "[7/8] src/components/PriceAlertCenter.jsx..."
sed -i '/useEffect.*loadAlerts/,/\[\]);/{s/\[\]);/[loadAlerts]);/}' src/components/PriceAlertCenter.jsx
echo "   ✅ Fixed"

# 8. TiPanieSolidaire.jsx
echo "[8/8] src/components/TiPanieSolidaire.jsx..."
sed -i '/useEffect.*fetchData/,/\[\]);/{s/\[\]);/[fetchData]);/}' src/components/TiPanieSolidaire.jsx
echo "   ✅ Fixed"

echo ""
echo "✅ Hook dependencies corrigées!"
echo ""
echo "🧪 Test ESLint..."
npm run lint -- src/components/IndiceVieChere.jsx src/components/ListeCourses. jsx src/components/MapLeaflet.jsx src/components/NewsWidget.jsx src/components/PalmaresEnseignes. jsx src/components/PriceAlertCenter.jsx src/components/TiPanieSolidaire.jsx
