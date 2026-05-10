/**
 * Application Express - Backend A KI PRI SA YÉ
 * Version Phoenix 2.1 - Correctif Export Prisma
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
import apiKeyRoutes from './api/routes/apiKey.routes.js';
import v1Routes from './api/v1/index.js';
import publicApiRoutes from './api/routes/publicApi.js';
import geocodingRoutes from './routes/geocoding.js';
import storesRoutes from './routes/stores.js';
import productsRoutes from './routes/products.js';
import basketRoutes from './routes/basket.js';
import subscriptionRoutes from './api/routes/subscription.routes.js';
import promoRoutes from './api/routes/promo.routes.js';
import affiliateRoutes from './api/routes/affiliate.routes.js';
import analyticsRoutes from './api/routes/analytics.routes.js';
import pricesRoutes from './api/routes/prices.routes.js';
import receiptsRoutes from './routes/receipts.js';
import compareRoutes from './routes/compare.js';
import territoriesRoutes from './routes/territories.js';
import historyRoutes from './routes/history.js';
import signalRoutes from './routes/signal.js';
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

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 10000;
const nodeEnv = process.env.NODE_ENV || 'production';

// CRITIQUE : Exportation nommée "prisma" pour la compatibilité avec les middlewares
export { default as prisma } from './database/prisma.js';

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

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ========================================
// Routes
// ========================================

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});

app.get('/', (_req, res) => {
  res.json({ name: 'A KI PRI SA YÉ API', status: 'Phoenix Live' });
});

// Fonction de sécurité anti-crash (undefined router)
const safeUse = (path: string, router: any) => {
  if (router) {
    app.use(path, router);
  } else {
    console.error(`⚠️ Route ignorée (undefined) : ${path}`);
  }
};

if (process.env.ENABLE_SWAGGER !== 'false') setupSwagger(app);
app.use('/api', apiLimiter);

// Montage des routes
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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ========================================
// Démarrage
// ========================================

async function startServer() {
  try {
    await prisma.$connect();
    console.info('✅ Connexion DB OK');
    if (nodeEnv === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
      syncScheduler.start();
    }
    app.listen(port, () => {
      console.info(`🚀 Serveur prêt sur le port ${port}`);
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

startServer();
export default app;