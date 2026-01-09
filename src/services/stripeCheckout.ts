/**
 * Stripe Checkout Integration Service
 * 
 * CONTEXT (NON-NEGOTIABLE):
 * - Citizen access (FORMULE CITOYEN) remains 100% FREE forever
 * - No dark patterns, no forced payment, no paywall on public data
 * - Stripe Checkout ONLY (hosted payment pages - no card forms in app)
 * - Client-side only (no backend, no storage of banking data)
 * - GDPR & PCI compliant by design
 * 
 * This service provides redirect functions to Stripe Checkout hosted pages
 * for CITOYEN+ and ANALYSE subscriptions only.
 */

/**
 * Stripe Checkout URLs (hardcoded for now)
 * These should be replaced with actual Stripe Checkout URLs from your Stripe account
 * 
 * To create Stripe Checkout URLs:
 * 1. Go to https://dashboard.stripe.com/
 * 2. Navigate to Products > Add Product
 * 3. Create products for CITOYEN+ (3.99€/month) and ANALYSE (9.90€/month)
 * 4. Create Payment Links for each product
 * 5. Replace the URLs below with your actual Stripe Checkout URLs
 */
const STRIPE_CHECKOUT_URLS = {
  // CITOYEN+ subscription: 3.99€/month or 39€/year
  // TODO: Replace with actual Stripe Payment Link URL before going live
  CITOYEN_PLUS: 'https://buy.stripe.com/REPLACE_WITH_ACTUAL_CITOYEN_PLUS_PAYMENT_LINK',
  
  // ANALYSE subscription: 9.90€/month or 99€/year
  // TODO: Replace with actual Stripe Payment Link URL before going live
  ANALYSE: 'https://buy.stripe.com/REPLACE_WITH_ACTUAL_ANALYSE_PAYMENT_LINK',
};

/**
 * Check if payments feature is enabled
 * @returns true if VITE_FEATURE_PAYMENTS is enabled
 */
function isPaymentsEnabled(): boolean {
  return import.meta.env.VITE_FEATURE_PAYMENTS === 'true';
}

/**
 * Redirect to Stripe Checkout for CITOYEN+ subscription
 * 
 * CITOYEN+ Plan (3.99€/month or 39€/year):
 * - Comfort & time-saving features
 * - Multi-store basket comparison
 * - Price history (3, 6, 12 months)
 * - Advanced filters
 * - PDF export
 * 
 * This function:
 * 1. Checks if payments are enabled via VITE_FEATURE_PAYMENTS
 * 2. Redirects to Stripe Checkout hosted page
 * 3. Shows neutral message if disabled
 */
export function redirectToCitizenPlusCheckout(): void {
  if (!isPaymentsEnabled()) {
    // More informative message when payments are disabled
    alert('Les paiements ne sont pas encore activés. Vous pouvez utiliser gratuitement la formule CITOYEN avec toutes les fonctionnalités essentielles.');
    return;
  }

  // Redirect to Stripe Checkout hosted page
  // The hosted page handles:
  // - Payment form (PCI compliant)
  // - Customer information
  // - Success/cancel redirects
  // - Subscription creation
  window.location.href = STRIPE_CHECKOUT_URLS.CITOYEN_PLUS;
}

/**
 * Redirect to Stripe Checkout for ANALYSE subscription
 * 
 * ANALYSE Plan (9.90€/month or 99€/year):
 * - For associations, journalists, experts, institutions
 * - All CITOYEN+ features
 * - Detailed territorial indices
 * - DOM ↔ Metropole comparisons
 * - Complete logistics modules
 * - Extended multi-year history
 * - CSV & graph exports
 * 
 * This function:
 * 1. Checks if payments are enabled via VITE_FEATURE_PAYMENTS
 * 2. Redirects to Stripe Checkout hosted page
 * 3. Shows neutral message if disabled
 */
export function redirectToAnalyseCheckout(): void {
  if (!isPaymentsEnabled()) {
    // More informative message when payments are disabled
    alert('Les paiements ne sont pas encore activés. Vous pouvez utiliser gratuitement la formule CITOYEN avec toutes les fonctionnalités essentielles.');
    return;
  }

  // Redirect to Stripe Checkout hosted page
  window.location.href = STRIPE_CHECKOUT_URLS.ANALYSE;
}

/**
 * GUARANTEE: CITOYEN plan is ALWAYS FREE
 * 
 * There is intentionally NO function for CITOYEN plan payments.
 * The citizen formula remains 100% free, forever.
 * This is a fundamental principle of the platform.
 * 
 * - No account required for citizen access
 * - No payment required for citizen access
 * - No paywall on public data
 * - No dark patterns
 */
