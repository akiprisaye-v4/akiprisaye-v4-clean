#!/bin/bash
set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPORT_DIR="audit-reports/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REPORT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 MEGA AUDIT COMPLET - akiprisaye-web"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📅 $(date)"
echo "📁 Rapports:  $REPORT_DIR"
echo ""

# ═══════════════════════════════════════════
# 1. STATISTIQUES PROJET
# ═══════════════════════════════════════════
echo -e "${BLUE}[1/12]${NC} 📊 Statistiques projet..."
{
  echo "# 📊 STATISTIQUES PROJET"
  echo ""
  echo "## Lignes de code"
  find src -name "*. tsx" -o -name "*. ts" -o -name "*. jsx" -o -name "*. js" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 || echo "Erreur calcul"
  echo ""
  echo "## Fichiers"
  echo "- Composants:  $(find src/components -name "*.tsx" -o -name "*.jsx" 2>/dev/null | wc -l)"
  echo "- Pages: $(find src/pages -name "*.tsx" -o -name "*.jsx" 2>/dev/null | wc -l)"
  echo "- Services: $(find src/services -name "*.ts" -o -name "*.js" 2>/dev/null | wc -l)"
  echo "- Tests: $(find src -name "*.test.*" 2>/dev/null | wc -l)"
  echo "- Hooks: $(find src/hooks -name "*.ts" 2>/dev/null | wc -l)"
  echo "- Utils: $(find src/utils -name "*.ts" 2>/dev/null | wc -l)"
} > "$REPORT_DIR/01-stats.md"
cat "$REPORT_DIR/01-stats.md"
echo ""

# ═══════════════════════════════════════════
# 2. SÉCURITÉ NPM
# ═══════════════════════════════════════════
echo -e "${BLUE}[2/12]${NC} 🔒 Audit sécurité npm..."
{
  echo "# 🔒 AUDIT SÉCURITÉ"
  echo ""
  npm audit --production 2>&1 || echo "Vulnérabilités détectées"
} > "$REPORT_DIR/02-security. txt"
npm audit --json > "$REPORT_DIR/02-security.json" 2>&1 || true

CRITICAL=$(cat "$REPORT_DIR/02-security.json" | jq -r '.metadata.vulnerabilities. critical // 0' 2>/dev/null || echo "0")
HIGH=$(cat "$REPORT_DIR/02-security.json" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")

if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
  echo -e "${RED}⚠️  $CRITICAL critical, $HIGH high${NC}"
else
  echo -e "${GREEN}✅ Pas de vulnérabilités critiques${NC}"
fi
echo ""

# ═══════════════════════════════════════════
# 3. LINTING
# ═══════════════════════════════════════════
echo -e "${BLUE}[3/12]${NC} 📝 Analyse statique (ESLint)..."
{
  echo "# 📝 LINTING (ESLint)"
  echo ""
  npm run lint 2>&1 || true
} > "$REPORT_DIR/03-lint.txt"

WARNINGS=$(grep -c "warning" "$REPORT_DIR/03-lint.txt" 2>/dev/null || echo "0")
ERRORS=$(grep -c "error" "$REPORT_DIR/03-lint.txt" 2>/dev/null || echo "0")
echo "   Warnings: $WARNINGS | Errors: $ERRORS"
echo ""

# ═══════════════════════════════════════════
# 4. TESTS
# ═══════════════════════════════════════════
echo -e "${BLUE}[4/12]${NC} 🧪 Tests unitaires..."
{
  echo "# 🧪 TESTS"
  echo ""
  npm test -- --run --reporter=verbose 2>&1 || echo "Tests échoués"
} > "$REPORT_DIR/04-tests.txt"
npm test -- --run --reporter=json > "$REPORT_DIR/04-tests.json" 2>&1 || true

if grep -q "Test Files.*passed" "$REPORT_DIR/04-tests.txt" 2>/dev/null; then
  echo -e "${GREEN}✅ Tests passés${NC}"
else
  echo -e "${YELLOW}⚠️  Vérifier les tests${NC}"
fi
echo ""

# ═══════════════════════════════════════════
# 5. BUILD
# ═══════════════════════════════════════════
echo -e "${BLUE}[5/12]${NC} 📦 Build production..."
npm run build > "$REPORT_DIR/05-build.log" 2>&1 || echo "Build échoué" > "$REPORT_DIR/05-build.log"

if [ -d "dist" ]; then
  BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
  echo "   Taille:  $BUILD_SIZE"
  du -sh dist > "$REPORT_DIR/05-build-size.txt"
else
  echo -e "${RED}❌ Build échoué${NC}"
fi
echo ""

# ═══════════════════════════════════════════
# 6. BUNDLE ANALYSIS
# ═══════════════════════════════════════════
echo -e "${BLUE}[6/12]${NC} 📊 Analyse des bundles..."
if [ -d "dist" ]; then
  {
    echo "# 📊 BUNDLE ANALYSIS"
    echo ""
    echo "## Top 20 plus gros fichiers JS"
    find dist -type f -name "*.js" -exec du -h {} \; 2>/dev/null | sort -rh | head -20
    echo ""
    echo "## Résumé"
    echo "- Fichiers JS: $(find dist -name "*.js" 2>/dev/null | wc -l)"
    echo "- Fichiers CSS: $(find dist -name "*.css" 2>/dev/null | wc -l)"
    echo "- Images: $(find dist -name "*. png" -o -name "*.jpg" -o -name "*.webp" 2>/dev/null | wc -l)"
  } > "$REPORT_DIR/06-bundle. txt"
  echo "   $(find dist -name "*.js" 2>/dev/null | wc -l) fichiers JS"
else
  echo "   ⚠️  Pas de dist/"
fi
echo ""

# ═══════════════════════════════════════════
# 7. DÉPENDANCES
# ═══════════════════════════════════════════
echo -e "${BLUE}[7/12]${NC} 📚 Analyse des dépendances..."
{
  echo "# 📚 DÉPENDANCES"
  echo ""
  echo "## Installées"
  npm list --depth=0 2>&1 || true
  echo ""
  echo "## Outdated"
  npm outdated 2>&1 || echo "Toutes à jour"
} > "$REPORT_DIR/07-dependencies.txt"
npm outdated --json > "$REPORT_DIR/07-outdated.json" 2>&1 || echo "{}" > "$REPORT_DIR/07-outdated.json"

PROD_DEPS=$(cat package.json | jq '. dependencies | length' 2>/dev/null || echo "? ")
DEV_DEPS=$(cat package.json | jq '. devDependencies | length' 2>/dev/null || echo "?")
echo "   Production: $PROD_DEPS | Dev: $DEV_DEPS"
echo ""

# ═══════════════════════════════════════════
# 8. ACCESSIBILITÉ
# ═══════════════════════════════════════════
echo -e "${BLUE}[8/12]${NC} ♿ Check accessibilité..."
{
  echo "# ♿ ACCESSIBILITÉ"
  echo ""
  echo "## Attributs ARIA"
  grep -r "aria-" src/ 2>/dev/null | wc -l || echo "0"
  echo ""
  echo "## Attributs alt sur images"
  grep -r "<img" src/ 2>/dev/null | grep -c "alt=" || echo "0"
} > "$REPORT_DIR/08-accessibility.txt"
echo "   $(grep -r "aria-" src/ 2>/dev/null | wc -l || echo 0) attributs ARIA"
echo ""

# ═══════════════════════════════════════════
# 9. SEO
# ═══════════════════════════════════════════
echo -e "${BLUE}[9/12]${NC} 🔍 Analyse SEO..."
{
  echo "# 🔍 SEO"
  echo ""
  echo "## Meta tags"
  grep -r "<meta" index.html public/ 2>/dev/null | wc -l || echo "0"
  echo ""
  echo "## Structured Data"
  grep -r "application/ld+json" src/ 2>/dev/null | wc -l || echo "0"
} > "$REPORT_DIR/09-seo.txt"
echo "   Vérification basique effectuée"
echo ""

# ═══════════════════════════════════════════
# 10. PERFORMANCE
# ═══════════════════════════════════════════
echo -e "${BLUE}[10/12]${NC} ⚡ Métriques performance..."
{
  echo "# ⚡ PERFORMANCE"
  echo ""
  echo "## Lazy loading"
  echo "- React. lazy:  $(grep -r "React.lazy" src/ 2>/dev/null | wc -l)"
  echo "- Dynamic import: $(grep -r "import(" src/ 2>/dev/null | wc -l)"
  echo ""
  echo "## Optimisations"
  echo "- useMemo: $(grep -r "useMemo" src/ 2>/dev/null | wc -l)"
  echo "- useCallback: $(grep -r "useCallback" src/ 2>/dev/null | wc -l)"
  echo "- React.memo: $(grep -r "React.memo\|memo(" src/ 2>/dev/null | wc -l)"
} > "$REPORT_DIR/10-performance.txt"
cat "$REPORT_DIR/10-performance.txt" | grep -E "^- " | head -5
echo ""

# ═══════════════════════════════════════════
# 11. GIT STATS
# ═══════════════════════════════════════════
echo -e "${BLUE}[11/12]${NC} 📈 Statistiques Git..."
{
  echo "# 📈 GIT STATS"
  echo ""
  echo "## Derniers commits"
  git log --oneline -10
  echo ""
  echo "## Contributors"
  git shortlog -sn --all --no-merges | head -10
  echo ""
  echo "## Branches"
  git branch -a | wc -l
} > "$REPORT_DIR/11-git.txt" 2>&1 || echo "Erreur Git" > "$REPORT_DIR/11-git.txt"
echo "   $(git log --oneline | wc -l) commits"
echo ""

# ═══════════════════════════════════════════
# 12. RAPPORT FINAL
# ═══════════════════════════════════════════
echo -e "${BLUE}[12/12]${NC} 📋 Génération rapport final..."

cat > "$REPORT_DIR/README.md" << SUMMARY
# 🔍 MEGA AUDIT COMPLET
**Date:** $(date)  
**Projet:** akiprisaye-web  
**Branch:** $(git branch --show-current 2>/dev/null || echo "unknown")

---

## 📊 VUE D'ENSEMBLE

| Catégorie | Résultat |
|-----------|----------|
| 📊 Lignes de code | $(find src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "? ") |
| 🔒 Vulnérabilités | $CRITICAL critical, $HIGH high |
| 📝 Warnings ESLint | $WARNINGS |
| 📝 Errors ESLint | $ERRORS |
| 📦 Build size | ${BUILD_SIZE:-"N/A"} |
| 📚 Deps Production | $PROD_DEPS |
| 📚 Deps Dev | $DEV_DEPS |
| 🧪 Tests | $(find src -name "*.test.*" 2>/dev/null | wc -l) fichiers |
| 📈 Commits | $(git log --oneline 2>/dev/null | wc -l || echo "?") |

---

## 📁 FICHIERS GÉNÉRÉS

$(ls -1 "$REPORT_DIR" | grep -v "README.md" | sed 's/^/- /')

---

## 🎯 ACTIONS RECOMMANDÉES

$(if [ "$CRITICAL" -gt 0 ]; then echo "- 🚨 **URGENT:** Corriger $CRITICAL vulnérabilités critiques"; fi)
$(if [ "$HIGH" -gt 0 ]; then echo "- ⚠️  Corriger $HIGH vulnérabilités high"; fi)
$(if [ "$ERRORS" -gt 0 ]; then echo "- 🔧 Corriger $ERRORS erreurs ESLint"; fi)
$(if [ "$WARNINGS" -gt 10 ]; then echo "- 🧹 Réduire les $WARNINGS warnings ESLint"; fi)
$(if [ !  -d "dist" ]; then echo "- ❌ Build échoué - à investiguer"; fi)

---

## 📖 COMMENT LIRE CE RAPPORT

1. **Sécurité:** Voir \`02-security.txt\`
2. **Qualité code:** Voir \`03-lint.txt\`
3. **Tests:** Voir \`04-tests.txt\`
4. **Performance:** Voir \`06-bundle.txt\` et \`10-performance.txt\`
5. **Dépendances:** Voir \`07-dependencies.txt\`

---

**Généré par:** \`scripts/mega-audit.sh\`  
**Durée:** ~2-5 minutes
SUMMARY

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ AUDIT TERMINÉ! ${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Rapports dans: $REPORT_DIR/"
echo ""
echo "📖 Voir le résumé:"
echo "   cat $REPORT_DIR/README. md"
echo ""
echo "📊 Fichiers générés:"
ls -1 "$REPORT_DIR/" | sed 's/^/   - /'
echo ""

# Afficher le résumé
cat "$REPORT_DIR/README.md"
