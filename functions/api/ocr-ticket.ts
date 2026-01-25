import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Initialisation Express
const app = express();
app.use(cors());
app.use(express.json());

// ======================================================
// CONFIG
// ======================================================

// Chemin vers le méga fichier JSON (SOURCE OFFICIELLE)
const DATA_FILE_PATH = path.join(
  __dirname,
  '../../frontend/public/data/mega-panier-anti-crise.json'
);

// ======================================================
// UTILITAIRES
// ======================================================

function loadMegaDataset() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error('Fichier mega-panier-anti-crise.json introuvable');
  }

  const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

// ======================================================
// ROUTES API
// ======================================================

/**
 * GET /api/health
 * Vérification rapide que l’API est en ligne
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'A KI PRI SA YÉ API',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/panier/anti-crise
 * Retourne le méga dataset complet
 */
app.get('/panier/anti-crise', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Impossible de charger le panier anti-crise'
    });
  }
});

/**
 * GET /api/panier/anti-crise/recommandation
 * Retourne uniquement le magasin recommandé
 */
app.get('/panier/anti-crise/recommandation', (_req, res) => {
  try {
    const data = loadMegaDataset();
    const basket = data.baskets?.[0];

    if (!basket?.recommendedStore) {
      return res.status(404).json({
        error: 'Aucune recommandation disponible'
      });
    }

    res.json({
      basketId: basket.basketId,
      recommendedStore: basket.recommendedStore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erreur lors du calcul de la recommandation'
    });
  }
});

/**
 * GET /api/stores
 * Liste des magasins
 */
app.get('/stores', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.stores || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de charger les magasins' });
  }
});

/**
 * GET /api/products
 * Liste des produits essentiels
 */
app.get('/products', (_req, res) => {
  try {
    const data = loadMegaDataset();
    res.json(data.products || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de charger les produits' });
  }
});

// ======================================================
// EXPORT
// ======================================================

export default app;