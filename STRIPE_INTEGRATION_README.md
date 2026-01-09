# Stripe Checkout Integration - A KI PRI SA YÉ

## Overview

This document describes the Stripe Checkout integration for the A KI PRI SA YÉ platform.

## Fundamental Principles (NON-NEGOTIABLE)

✅ **Citizen access (FORMULE CITOYEN) remains 100% FREE forever**
✅ **No dark patterns, no forced payment, no paywall on public data**
✅ **Stripe Checkout ONLY (hosted payment pages - no card forms in app)**
✅ **Client-side only (no backend, no storage of banking data)**
✅ **GDPR & PCI compliant by design**

## Architecture

### 1. Environment Variables

Two new environment variables control the payment feature:

- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key (safe for frontend)
- `VITE_FEATURE_PAYMENTS`: Feature flag to enable/disable payments

**Files modified:**
- `.env.example` - Contains documentation and example values
- `.env.local` - Local development configuration (not committed to git)

### 2. Stripe Checkout Service

**File:** `src/services/stripeCheckout.ts`

Exports two functions:
- `redirectToCitizenPlusCheckout()` - Redirects to CITOYEN+ subscription checkout
- `redirectToAnalyseCheckout()` - Redirects to ANALYSE subscription checkout

**Important:** There is intentionally NO function for CITOYEN plan - it remains free forever.

### 3. Updated Pricing Page

**File:** `src/pages/Pricing.tsx`

Changes:
- Added "S'abonner" buttons for CITOYEN+ and ANALYSE plans only
- CITOYEN plan button remains "Commencer gratuitement" (no payment)
- Added ethical disclaimer: "Le paiement finance uniquement l'infrastructure et les modules avancés. L'accès citoyen reste gratuit."
- Buttons call Stripe Checkout redirect functions when payments are enabled

### 4. Payment Result Pages

**Success Page:** `src/pages/paiement/Succes.tsx`
- Route: `/paiement/succes`
- Clear confirmation message
- No upsell, no tracking
- Thanks user for supporting independent citizen tool

**Cancelled Page:** `src/pages/paiement/Annule.tsx`
- Route: `/paiement/annule`
- Neutral tone, no pressure
- Reminds user that citizen access remains free

### 5. Routing

**File:** `src/main.jsx`

Added routes with feature flag protection:
- `/paiement/succes` - Shows success page if payments enabled
- `/paiement/annule` - Shows cancelled page if payments enabled
- Both routes show "Fonctionnalité indisponible" if payments disabled

## Setup Instructions

### Step 1: Get Stripe Keys

1. Sign up at https://stripe.com
2. Go to Developers > API Keys
3. Copy your Publishable key (starts with `pk_test_` for test mode)

### Step 2: Create Stripe Products

1. Go to Products in Stripe Dashboard
2. Create two products:
   - **CITOYEN+**: 3.99€/month (or 39€/year)
   - **ANALYSE**: 9.90€/month (or 99€/year)
3. For each product, create a Payment Link
4. Configure success URL: `https://your-domain.com/paiement/succes`
5. Configure cancel URL: `https://your-domain.com/paiement/annule`

### Step 3: Update Checkout URLs

Edit `src/services/stripeCheckout.ts`:

```typescript
const STRIPE_CHECKOUT_URLS = {
  CITOYEN_PLUS: 'https://buy.stripe.com/YOUR_ACTUAL_CITOYEN_PLUS_URL',
  ANALYSE: 'https://buy.stripe.com/YOUR_ACTUAL_ANALYSE_URL',
};
```

### Step 4: Configure Environment

Update `.env.local`:

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_TEST_KEY
VITE_FEATURE_PAYMENTS=true
```

### Step 5: Test

1. Run `npm run dev`
2. Go to `/pricing` or `/tarifs`
3. Click "S'abonner" on CITOYEN+ or ANALYSE plan
4. You'll be redirected to Stripe Checkout
5. Use test card: 4242 4242 4242 4242
6. Complete the test payment
7. You should be redirected to `/paiement/succes`

## Production Deployment

### Before Going Live

1. Switch to live Stripe keys (starts with `pk_live_`)
2. Update Checkout URLs to use live Payment Links
3. Test with real payment method
4. Verify success/cancel redirects work correctly
5. Monitor Stripe Dashboard for successful payments

### Environment Variables for Production

```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_ACTUAL_LIVE_KEY
VITE_FEATURE_PAYMENTS=true
```

## Security & Compliance

### What We Do ✅

- Use Stripe Checkout (PCI DSS compliant hosted pages)
- Never handle card data in our application
- No backend, no database, no stored payment data
- Use feature flags to disable payments if needed
- Ethical transparency about what payments finance

### What We Don't Do ❌

- Store credit card numbers
- Handle payment processing directly
- Require payment for citizen access
- Use dark patterns or forced payments
- Track user payment behavior

## Guarantees

### Code Guarantees

1. **CITOYEN plan is always free** - Enforced in code with comments
2. **No payment button for CITOYEN plan** - Conditional rendering
3. **Ethical disclaimers** - Visible on pricing page
4. **Feature flag protection** - Can disable payments instantly
5. **No removed features** - All existing functionality preserved

### Comments in Code

Search for "GUARANTEE" in the codebase to find explicit guarantees:
- `src/services/stripeCheckout.ts:100` - CITOYEN plan is ALWAYS FREE
- `src/pages/Pricing.tsx:107` - CITOYEN plan never requires payment
- `src/pages/Pricing.tsx:285` - CITOYEN plan never shows payment button

## Troubleshooting

### Payments not working

1. Check `VITE_FEATURE_PAYMENTS=true` in `.env.local`
2. Verify Stripe public key is correct
3. Check browser console for errors
4. Ensure Checkout URLs are correct and active

### Success/Cancel pages not showing

1. Verify feature flag is enabled
2. Check Stripe Dashboard webhook configuration
3. Ensure redirect URLs match exactly

### Build fails

Run `npm run build` to check for errors. Our implementation uses the same patterns as existing pages and should not cause build failures.

## Support

Questions? Contact the development team or refer to:
- Stripe Documentation: https://stripe.com/docs
- Platform Methodology: `/methodologie`
- Contact Page: `/contact`
