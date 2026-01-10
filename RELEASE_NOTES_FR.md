# Notes de version Google Play - A KI PRI SA YÉ

## Version 1.0.0 - Test interne / Alpha

**Type de version** : Version de test initiale  
**Audience** : Testeurs internes et utilisateurs précoces  
**Langue** : Français (France)  
**Date** : Janvier 2026

---

## Notes de version (à copier dans Google Play Console)

### fr-FR

**Version 1.0.0 - Première version de test**

- Première version de test public de l'observatoire des prix
- Fonctionnalités principales disponibles : consultation des prix, comparaisons territoriales, historiques
- Interface utilisateur optimisée pour mobile
- Accès aux données d'observation citoyenne et publiques
- Système de scan de codes-barres pour recherche de produits
- Consultation hors ligne des données récemment consultées
- Focus sur la stabilité et les performances de l'application
- Collecte de retours utilisateurs pour amélioration continue
- Outil d'information à caractère pédagogique, sans conseil d'achat
- Version de test destinée aux testeurs pour validation fonctionnelle

**Important** : Cette version est destinée aux tests. Vos retours sont essentiels pour améliorer l'application avant le lancement public.

---

## Changelog technique (interne)

### Ajouts
- Architecture Capacitor pour déploiement multi-plateformes
- Intégration système de scan de codes-barres
- Module d'observation des prix en temps réel
- Système de comparaison territoriale
- Historiques de prix consultables
- Mode hors ligne pour consultation des données
- Interface adaptative mobile/tablette

### Technique
- Target SDK : Android 35 (Android 15)
- Min SDK : Android 23 (Android 6.0)
- Architecture : Hybrid (Capacitor + Web)
- Java : Version 17
- Build : Android App Bundle (.aab)
- Signature : Google Play App Signing

### Sécurité
- Permissions minimales (INTERNET uniquement)
- Données chiffrées en transit
- Conformité RGPD
- Politique de confidentialité accessible

### Performance
- Optimisation du chargement initial
- Cache intelligent pour consultation hors ligne
- Compression des assets
- Lazy loading des images

---

## Prochaines versions prévues

### Version 1.1.0 (À venir)
- Amélioration de la recherche de produits
- Ajout de filtres avancés
- Optimisation de l'interface utilisateur
- Corrections basées sur retours testeurs

### Version 1.2.0 (À venir)
- Système de notifications (optionnel)
- Partage de données d'observation
- Amélioration du mode hors ligne
- Support tablettes optimisé

---

## Instructions pour les testeurs

### Comment tester efficacement
1. Testez les fonctionnalités principales (recherche, scan, comparaison)
2. Vérifiez la stabilité sur différentes versions Android
3. Testez la navigation et l'ergonomie
4. Vérifiez les temps de chargement
5. Testez le mode hors ligne

### Comment signaler un problème
- Utilisez le canal de feedback Play Console
- Indiquez votre modèle Android et version OS
- Décrivez précisément le problème rencontré
- Joignez une capture d'écran si possible

### Zones prioritaires de test
- Système de scan de codes-barres
- Recherche de produits
- Affichage des comparaisons territoriales
- Consultation des historiques
- Performance générale

---

## Support et contact

Pour toute question concernant cette version de test :
- Consultez la documentation en ligne
- Utilisez le système de feedback intégré
- Consultez les mentions légales et CGU

---

## Conformité et mentions légales

- Application d'information publique
- Données issues d'observations citoyennes et sources publiques
- Aucun conseil d'achat
- Outil pédagogique à vocation informative
- Conformité RGPD
- Politique de confidentialité disponible

---

**Note importante** : Cette version de test ne garantit pas la disponibilité continue du service. Des interruptions peuvent survenir pour maintenance et amélioration.
