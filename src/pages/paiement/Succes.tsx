/**
 * Payment Success Page
 * 
 * Route: /paiement/succes
 * 
 * CONTEXT:
 * - Clear confirmation message
 * - No upsell
 * - No tracking
 * - Ethical & institutional tone
 * - Confirms subscription is active
 * - Thanks user for supporting independent citizen tool
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';

export default function Succes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-green-500 dark:border-green-600 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            ✅ Merci
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-xl text-slate-700 dark:text-slate-300">
              Votre abonnement est actif.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Vous soutenez un outil citoyen indépendant.
            </p>
          </div>

          {/* Ethical Statement */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-8">
            <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
              Votre contribution finance l'infrastructure, l'agrégation des données
              et les modules avancés. L'accès citoyen reste gratuit pour tous.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Accueil
            </Link>
            <Link
              to="/mon-compte"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-all border border-slate-300 dark:border-slate-600"
            >
              <FileText className="w-5 h-5" />
              Mon compte
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Un email de confirmation vous a été envoyé par Stripe.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Questions ? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
