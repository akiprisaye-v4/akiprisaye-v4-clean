/**
 * Application Express - Backend A KI PRI SA YÉ
 * Version Phoenix 3.2 - Stable (Correction Port & Prisma)
 */

import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prismaInstance from './database/prisma.js';

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

// Import Swagger
import { setupSwagger } from './api/docs/swagger.js';

dotenv.config();

const app: Express = express();

/**
 * CRITIQUE : Exportation nommée "prisma" indispensable pour tes middlewares.
 */
export const prisma = prismaInstance;

// Middlewares globaux
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé (Healthcheck) - Indispensable pour que Render sache que tout va bien
app.get('/health', async (_req, res) => {
  try {
    await prismaInstance.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (e) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.get('/', (_req, res) => {
  res.json({ 
    name: 'A KI PRI SA YÉ API', 
    status: 'Phoenix Operational',
    version: '3.2' 
  });
});

// Sécurité anti-crash pour les routes indéfinies
const safeUse = (path: string, router: any) => {
  if (router) app.use(path, router);
  else console.warn(`⚠️ Route ignorée : ${path}`);
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

// Gestion d'erreurs
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/**
 * NOTE : On ne met plus "app.listen" ici. 
 * C'est le fichier server.ts qui gère le démarrage propre du Phoenix.
 */
export default app;