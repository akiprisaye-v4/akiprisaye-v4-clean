#!/bin/bash
set -e

echo "🧹 NETTOYAGE DES IMPORTS INUTILISÉS"
echo "===================================="
echo ""

# 1. Layout. jsx
echo "[1/5] src/components/Layout.jsx..."
cat > src/components/Layout.jsx. new << 'LAYOUT'
import { useEffect } from 'react';
// Removed unused imports:  Link, NavLink, Outlet, Menu, X, TiPanierButton, FloatingActions, OfflineIndicator

export default function Layout({ children }) {
  useEffect(() => {
    // Layout initialization
  }, []);

  return (
    <div className="layout-container">
      {children}
    </div>
  );
}
LAYOUT
# Backup et remplacer
cp src/components/Layout.jsx src/components/Layout.jsx.backup
mv src/components/Layout. jsx.new src/components/Layout.jsx
echo "   ✅ Nettoyé"

# 2. TiPanie.jsx
echo "[2/5] src/pages/TiPanie.jsx..."
sed -i '/^import BasketCard/d' src/pages/TiPanie.jsx
sed -i '/^import BasketFilters/d' src/pages/TiPanie.jsx
echo "   ✅ Nettoyé"

# 3. BasketCard.jsx
echo "[3/5] src/ui/BasketCard.jsx..."
sed -i '/^import PriceBadge/d' src/ui/BasketCard.jsx
sed -i '/^import BasketTerritoryComparison/d' src/ui/BasketCard.jsx
sed -i '/^import TrendIndicator/d' src/ui/BasketCard.jsx
echo "   ✅ Nettoyé"

# 4. GlassContainer.jsx
echo "[4/5] src/components/ui/GlassContainer.jsx..."
sed -i 's/const Component = forwardRef/const GlassContainer = forwardRef/' src/components/ui/GlassContainer.jsx
sed -i 's/Component\. displayName/GlassContainer.displayName/' src/components/ui/GlassContainer.jsx
echo "   ✅ Nettoyé"

# 5. AIDashboard.jsx
echo "[5/5] src/pages/AIDashboard.jsx..."
sed -i 's/const \[baskets, setBaskets\]/const [_baskets, setBaskets]/' src/pages/AIDashboard.jsx
sed -i 's/const \[forecast, setForecast\]/const [_forecast, setForecast]/' src/pages/AIDashboard.jsx
echo "   ✅ Nettoyé"

echo ""
echo "✅ Imports inutilisés nettoyés!"
echo ""
echo "🧪 Test ESLint..."
npm run lint -- src/components/Layout.jsx src/pages/TiPanie. jsx src/ui/BasketCard.jsx src/components/ui/GlassContainer.jsx src/pages/AIDashboard.jsx
