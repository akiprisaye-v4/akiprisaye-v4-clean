/**
 * Middleware d'authentification JWT
 *
 * Vérifie la présence et validité du token JWT dans les requêtes
 * Injecte les informations utilisateur dans req.user
 *
 * Conformité RGPD:
 * - Minimisation des données (uniquement userId et email)
 * - Traçabilité des accès via logs
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from '../../security/jwt.js';

// Extension du type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware d'authentification JWT
 *
 * Extrait et vérifie le token JWT du header Authorization
 * En cas de succès, ajoute req.user avec les infos utilisateur
 * En cas d'échec, retourne 401 Unauthorized
 *
 * @param req - Request Express
 * @param res - Response Express
 * @param next - Next function
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extraire le token du header Authorization
    const token = extractTokenFromHeader(req.headers.authorization);

    // Vérifier et décoder le token
    const payload = verifyAccessToken(token);

    // Injecter les infos utilisateur dans la requête
    req.user = payload;

    // Continuer vers le handler suivant
    next();
  } catch (error) {
    // Log de sécurité (sans exposer le token)
    console.warn('[AUTH] Tentative d\'accès non autorisée:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });

    // Réponse 401 Unauthorized
    res.status(401).json({
      error: 'Non autorisé',
      message: error instanceof Error ? error.message : 'Token invalide',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware optionnel d'authentification
 *
 * Tente d'extraire et vérifier le token JWT
 * Si présent et valide, ajoute req.user
 * Si absent ou invalide, continue sans erreur
 *
 * Utile pour les endpoints avec contenu public/privé mixte
 *
 * @param req - Request Express
 * @param res - Response Express
 * @param next - Next function
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyAccessToken(token);
    req.user = payload;
  } catch (error) {
    // Ignorer les erreurs, continuer sans user
    req.user = undefined;
  }

  next();
}
