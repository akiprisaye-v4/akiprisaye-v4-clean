/**
 * Subscription Controller
 * Minimal backend for subscription management
 * NO excessive data collection, NO sensitive business data
 */

import { Request, Response } from 'express';
import { PlanService } from '../services/PlanService.js';
import { PaymentProvider } from '../services/PaymentProvider.js';
import { UserModel } from '../models/User.js';
import { SubscriptionModel } from '../models/Subscription.js';

export class SubscriptionController {
  /**
   * Create a new subscription
   * POST /api/subscriptions
   */
  async create(req: Request, res: Response) {
    try {
      const { email, plan, billingCycle, territory, usageType } = req.body;

      // Validation
      if (!email || !plan || !billingCycle || !territory) {
        return res.status(400).json({
          error: 'Données manquantes',
          required: ['email', 'plan', 'billingCycle', 'territory']
        });
      }

      // Verify plan exists
      if (!PlanService.isValidPlan(plan)) {
        return res.status(400).json({
          error: 'Plan invalide',
          validPlans: ['FREE', 'CITIZEN_PREMIUM', 'PRO', 'BUSINESS', 'ENTERPRISE']
        });
      }

      // Find or create user
      let user = await UserModel.findByEmail(email);
      if (!user) {
        user = await UserModel.create({
          email,
          territory,
          role: this.mapUsageTypeToRole(usageType),
        });
      }

      // Free plan doesn't require payment
      if (plan === 'FREE') {
        const subscription = await SubscriptionModel.create({
          userId: user.id,
          plan: 'FREE',
          billingCycle: 'monthly',
        });

        return res.json({
          success: true,
          subscription,
          message: 'Accès gratuit activé'
        });
      }

      // For paid plans, initiate payment
      const paymentIntent = await PaymentProvider.createPaymentIntent({
        userId: user.id,
        plan,
        billingCycle,
        territory,
      });

      return res.json({
        success: true,
        paymentIntent,
        message: 'Paiement à confirmer'
      });

    } catch (error) {
      console.error('Subscription creation error:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de l\'abonnement'
      });
    }
  }

  /**
   * Get user subscription status
   * GET /api/subscriptions/status/:email
   */
  async getStatus(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.json({
          plan: 'FREE',
          status: 'active',
          features: PlanService.getFeatures('FREE')
        });
      }

      const subscription = await SubscriptionModel.findByUserId(user.id);

      if (!subscription) {
        return res.json({
          plan: 'FREE',
          status: 'active',
          features: PlanService.getFeatures('FREE')
        });
      }

      return res.json({
        plan: subscription.plan,
        status: subscription.status,
        billingCycle: subscription.billingCycle,
        endsAt: subscription.endsAt,
        features: PlanService.getFeatures(subscription.plan)
      });

    } catch (error) {
      console.error('Get subscription error:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  }

  /**
   * Cancel subscription (1-click, no questions)
   * POST /api/subscriptions/cancel
   */
  async cancel(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      const subscription = await SubscriptionModel.findByUserId(user.id);

      if (!subscription) {
        return res.status(404).json({
          error: 'Aucun abonnement actif trouvé'
        });
      }

      // Cancel immediately, no grace period tricks
      await SubscriptionModel.cancel(subscription.id);

      // Cancel payment provider subscription
      if (subscription.paymentProviderId) {
        await PaymentProvider.cancelSubscription(subscription.paymentProviderId);
      }

      return res.json({
        success: true,
        message: 'Abonnement résilié immédiatement. Aucune relance ne sera envoyée.',
        newPlan: 'FREE'
      });

    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return res.status(500).json({
        error: 'Erreur lors de la résiliation'
      });
    }
  }

  /**
   * Check feature access
   * GET /api/subscriptions/access/:email/:feature
   */
  async checkAccess(req: Request, res: Response) {
    try {
      const { email, feature } = req.params;

      const user = await UserModel.findByEmail(email);
      const subscription = user ? await SubscriptionModel.findByUserId(user.id) : null;
      const plan = subscription?.plan || 'FREE';

      const hasAccess = PlanService.canUseFeature(plan, feature as any);

      return res.json({
        hasAccess,
        plan,
        feature,
        message: hasAccess 
          ? 'Accès autorisé' 
          : PlanService.getAccessDeniedMessage(feature as any, plan)
      });

    } catch (error) {
      console.error('Access check error:', error);
      return res.status(500).json({
        error: 'Erreur lors de la vérification d\'accès'
      });
    }
  }

  private mapUsageTypeToRole(usageType: string): 'citizen' | 'pro' | 'org' {
    const roleMap: Record<string, 'citizen' | 'pro' | 'org'> = {
      'citoyen': 'citizen',
      'pro': 'pro',
      'organisation': 'org',
    };
    return roleMap[usageType] || 'citizen';
  }
}

export default new SubscriptionController();
