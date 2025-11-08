# Configuration Cloudflare Pages

Pour que le site fonctionne correctement sur https://akiprisaye.pages.dev/, les paramètres suivants doivent être configurés dans le dashboard Cloudflare Pages :

## Paramètres de Build

1. **Framework preset** : Vite
2. **Build command** : `npm run build`
3. **Build output directory** : `dist`
4. **Root directory** : `/` (racine du projet)

## Variables d'environnement

Aucune variable d'environnement spéciale n'est requise pour le build basique.

## Vérification du Build

Pour vérifier localement que le build fonctionne :

```bash
npm install
npm run build
```

Cela devrait créer un dossier `dist/` avec :
- `index.html` - Page d'accueil avec carrousel
- `assets/` - Icônes et images optimisées
- Autres fichiers HTML de la PWA

## Structure Attendue

```
dist/
├── index.html (page principale avec carrousel)
├── assets/
│   ├── icon_192.png
│   ├── icon_256.png
│   ├── icon_512.png
│   └── images du carrousel
├── manifest.json
└── service-worker.js
```

## Dépannage

Si le site affiche une page blanche :
1. Vérifier que la build command est bien `npm run build`
2. Vérifier que le output directory est bien `dist`
3. Vérifier les logs de déploiement dans Cloudflare Pages
4. S'assurer qu'aucune erreur n'apparaît lors du build
