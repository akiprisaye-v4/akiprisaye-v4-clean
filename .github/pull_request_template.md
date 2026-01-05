# ✅ CHECKLIST PR — A KI PRI SA YÉ

**Objectif : stabilité totale, mobile-first, zéro écran noir, CI verte**

Merci de cocher chaque point avant soumission.  
⚠️ Toute non-conformité peut entraîner le rejet automatique de la PR.

---

## 1️⃣ Stabilité & sécurité globale

- [ ] Aucun écran noir possible (ErrorBoundary global actif)
- [ ] Aucune exception JS non interceptée (try/catch sur modules sensibles)
- [ ] Aucun crash bloquant sur mobile
- [ ] Tous les modules sont fail-soft (fallback UI systématique)

## 2️⃣ UX mobile & superpositions

- [ ] Panier non superposé au chat en version mobile
- [ ] Z-index harmonisés (chat < panier < modales)
- [ ] Scroll verrouillé lors des modales
- [ ] Navigation utilisable à une main (mobile-first)

## 3️⃣ Caméra, image & fallback

- [ ] Accès caméra optionnel, jamais bloquant
- [ ] Fallback automatique Upload image fonctionnel
- [ ] Timeout caméra géré proprement
- [ ] Message utilisateur clair en cas d'échec caméra
- [ ] Aucune dépendance CI à la caméra ou au hardware

## 4️⃣ OCR & comparateur produit

- [ ] Comparateur fonctionne avec EAN
- [ ] Comparateur fonctionne sans EAN (OCR texte / estimation)
- [ ] Message explicite si reconnaissance partielle
- [ ] Aucune action utilisateur bloquée par l'OCR

## 5️⃣ Données & logique métier

- [ ] Produits locaux sans code-barres pris en charge
- [ ] Recherche fuzzy / alternative active si EAN absent
- [ ] Score de confiance visible (EAN / OCR / estimation)
- [ ] Aucune donnée silencieusement inventée

## 6️⃣ Tests & dette technique

- [ ] Aucun test Jest résiduel (jest is not defined éliminé)
- [ ] Stack test Vitest uniquement
- [ ] Aucun test caméra / image dans la CI
- [ ] Tests non bloquants pour les features hardware

## 7️⃣ CI / Cloudflare Pages

- [ ] Build Cloudflare Pages OK
- [ ] Aucun warning bloquant
- [ ] Redirections sans boucle infinie
- [ ] Aucun fichier interdit (vidéo, zip, design source)
- [ ] Dépôt sans Git LFS

## 8️⃣ Documentation & transparence

- [ ] README à jour (fallback caméra documenté)
- [ ] Badge CI Camera-safe présent
- [ ] Badge Offline-first / Mobile-first présent
- [ ] Comportement OCR expliqué simplement

## 9️⃣ Validation finale

- [ ] Test réel effectué sur smartphone Android
- [ ] Import image testé → comparateur fonctionnel
- [ ] Chat, panier, comparateur testés ensemble
- [ ] Aucun module manquant ou non branché

---

## 🔒 RÈGLE DE MERGE

❌ **Aucun merge autorisé si une seule case n'est pas cochée.**
