/**
 * Subscription Model
 */

export type Plan = 'FREE' | 'CITIZEN_PREMIUM' | 'PRO' | 'BUSINESS' | 'ENTERPRISE' | 'INSTITUTION';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired';
export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startedAt: Date;
  endsAt?: Date;
  paymentProviderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDTO {
  userId: string;
  plan: Plan;
  billingCycle: BillingCycle;
  paymentProviderId?: string;
}

// In-memory store for demo (replace with actual database)
const subscriptions: Map<string, Subscription> = new Map();

export class SubscriptionModel {
  static async create(data: CreateSubscriptionDTO): Promise<Subscription> {
    const id = `sub_${Date.now()}`;
    const subscription: Subscription = {
      id,
      ...data,
      status: 'active',
      startedAt: new Date(),
      endsAt: this.calculateEndDate(data.billingCycle),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    subscriptions.set(id, subscription);
    return subscription;
  }

  static async findByUserId(userId: string): Promise<Subscription | null> {
    for (const sub of subscriptions.values()) {
      if (sub.userId === userId && sub.status === 'active') {
        return sub;
      }
    }
    return null;
  }

  static async findById(id: string): Promise<Subscription | null> {
    return subscriptions.get(id) || null;
  }

  static async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
    const subscription = subscriptions.get(id);
    if (!subscription) return null;

    const updated: Subscription = {
      ...subscription,
      ...data,
      updatedAt: new Date(),
    };
    
    subscriptions.set(id, updated);
    return updated;
  }

  static async cancel(id: string): Promise<Subscription | null> {
    return this.update(id, { status: 'canceled', endsAt: new Date() });
  }

  private static calculateEndDate(cycle: BillingCycle): Date {
    const now = new Date();
    if (cycle === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else {
      now.setFullYear(now.getFullYear() + 1);
    }
    return now;
  }
}

export default SubscriptionModel;
