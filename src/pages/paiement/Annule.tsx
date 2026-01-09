/**
 * Payment Cancelled Page
 * 
 * Route: /paiement/annule
 * 
 * CONTEXT:
 * - Neutral tone
 * - No pressure
 * - No dark patterns
 * - Reminds user that citizen access remains free
 * - Provides clear next steps
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, Home, CreditCard, Info } from 'lucide-react';

export default function Annule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Cancelled Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Paiement annulé
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Le paiement a été annulé.
            </p>
          </div>

          {/* Reminder: Citizen Access is Free */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <Info className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  L'accès citoyen reste gratuit
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                  Vous pouvez continuer à utiliser gratuitement toutes les fonctionnalités
                  de la formule CITOYEN : données publiques, comparateurs essentiels,
                  modules pédagogiques, et bien plus.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-all border border-slate-300 dark:border-slate-600"
            >
              <CreditCard className="w-5 h-5" />
              Voir les tarifs
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Aucun montant n'a été débité.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Questions ? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
