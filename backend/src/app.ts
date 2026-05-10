/**
 * Application Express - Backend A KI PRI SA YÉ
 * Version Corrigée pour Déploiement Render
 * Sécurité anti-crash sur le chargement des routes
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './database/prisma.js';

// Import routes
import authRoutes from './api/routes/auth.routes.js';
import legalEntityRoutes from './api/routes/legalEntity.routes.js';
import auditRoutes from './audit/audit.routes.js';
import adminRoutes from './admin/admin.routes.js';
import opendataRoutes from './api/routes/opendata.routes.js';
// API Gateway routes
import apiKeyRoutes from './api/routes/apiKey.routes.js';
import v1Routes from './api/v1/index.js';
import publicApiRoutes from './api/routes/publicApi.js';
// Infrastructure routes
import geocodingRoutes from './routes/geocoding.js';
import storesRoutes from './routes/stores.js';
import productsRoutes from './routes/products.js';
// Basket comparison routes
import basketRoutes from './routes/basket.js';
// Subscription & Payment routes
import subscriptionRoutes from './api/routes/subscription.routes.js';
// Promo code routes
import promoRoutes from './api/routes/promo.routes.js';
// Affiliate routes
import affiliateRoutes from './api/routes/affiliate.routes.js';
// Analytics routes
import analyticsRoutes from './api/routes/analytics.routes.js';
// Verified Pricing routes
import pricesRoutes from './api/routes/prices.routes.js';
// Receipt OCR Import routes
import receiptsRoutes from './routes/receipts.js';
// Price comparison routes
import compareRoutes from './routes/compare.js';
import territoriesRoutes from './routes/territories.js';
import historyRoutes from './routes/history.js';
import signalRoutes from './routes/signal.js';
// Monetization engine routes
import marketplaceRoutes from './api/routes/marketplace.routes.js';
import affiliatesRoutes from './api/routes/affiliates.routes.js';
import reportsRoutes from './api/routes/reports.routes.js';
import sponsorshipRoutes from './api/routes/sponsorship.routes.js';

// Import middlewares
import { apiLimiter } from './api/middlewares/rateLimit.middleware.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './api/middlewares/error.middleware.js';

// Import Swagger & Scheduler
import { setupSwagger } from './api/docs/swagger.js';
import { syncScheduler } from './services/scheduler/syncScheduler.js';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 10000;
const nodeEnv = process.env.NODE_ENV || 'production';

// Re-export shared Prisma client
export { default as prismaShared } from './database/prisma.js';

// ========================================
// Middlewares globaux
// ========================================

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de sécurité
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

// ========================================
// Routes de base
// ========================================

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.get('/', (_req, res) => {
  res.json({ 
    name: 'A KI PRI SA YÉ API', 
    version: '4.0.0', 
    status: 'Running on Render',
    message: 'Backend Phoenix opérationnel' 
  });
});

// ========================================
// Sécurité : Montage des routes
// ========================================

// Fonction pour éviter le crash si une route est "undefined"
const safeUse = (path: string, router: any) => {
  if (router) {
    app.use(path, router);
  } else {
    console.error(`⚠️ ALERTE : La route pour ${path} est indéfinie et a été ignorée pour éviter le crash.`);
  }
};

if (process.env.ENABLE_SWAGGER !== 'false') setupSwagger(app);

app.use('/api', apiLimiter);

// Montage sécurisé de toutes tes routes
safeUse('/api/auth', authRoutes);
safeUse('/api/v1', v1Routes);
safeUse('/api/v1', publicApiRoutes);
safeUse('/api/api-keys', apiKeyRoutes);
safeUse('/api/legal-entities', legalEntityRoutes);
safeUse('/api/audit', auditRoutes);
safeUse('/api/admin', adminRoutes);
safeUse('/api/opendata', opendataRoutes);
safeUse('/api/geocoding', geocodingRoutes);
safeUse('/api/stores', storesRoutes);
safeUse('/api/products', productsRoutes);
safeUse('/api/basket', basketRoutes);
safeUse('/api/subscriptions', subscriptionRoutes);
safeUse('/api/promos', promoRoutes);
safeUse('/api/affiliates', affiliateRoutes);
safeUse('/api/analytics', analyticsRoutes);
safeUse('/api/prices', pricesRoutes);
safeUse('/api/receipts', receiptsRoutes);
safeUse('/api/compare', compareRoutes);
safeUse('/api/territories', territoriesRoutes);
safeUse('/api/products', historyRoutes);
safeUse('/api/products', signalRoutes);
safeUse('/api/marketplace', marketplaceRoutes);
safeUse('/api/affiliates', affiliatesRoutes);
safeUse('/api/reports', reportsRoutes);
safeUse('/api/sponsorship', sponsorshipRoutes);

// ========================================
// Gestion des erreurs
// ========================================

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ========================================
// Démarrage du serveur
// ========================================

async function startServer() {
  try {
    await prisma.$connect();
    console.info('✅ Connexion à la base de données établie');

    if (nodeEnv === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
      syncScheduler.start();
    }

    app.listen(port, () => {
      console.info('========================================');
      console.info(`🚀 Serveur Phoenix démarré sur le port ${port}`);
      console.info('========================================');
    });
  } catch (error) {
    console.error('❌ Erreur fatale au démarrage:', error);
    process.exit(1);
  }
}

// Arrêt gracieux
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Lancement automatique
startServer();

export default app;