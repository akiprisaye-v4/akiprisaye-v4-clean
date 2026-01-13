/**
 * Alert Form Component
 * Create and edit price alerts
 */

import { useState } from 'react';
import { AlertTriangle, Save, X } from 'lucide-react';
import type { AlertType } from '../types/priceAlerts';

interface AlertFormProps {
  productEAN?: string;
  productName?: string;
  onSave: (alert: any) => void;
  onCancel: () => void;
}

export function AlertForm({ productEAN = '', productName = '', onSave, onCancel }: AlertFormProps) {
  const [formData, setFormData] = useState({
    productEAN,
    productName,
    alertType: 'price_drop' as AlertType,
    threshold: 10,
    territory: 'GP',
    emailEnabled: true,
    pushEnabled: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        Créer une Alerte Prix
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Produit *
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            placeholder="Nom du produit"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Code EAN (optionnel)
          </label>
          <input
            type="text"
            value={formData.productEAN}
            onChange={(e) => setFormData({ ...formData, productEAN: e.target.value })}
            placeholder="3017620422003"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Type d'alerte *
          </label>
          <select
            value={formData.alertType}
            onChange={(e) => setFormData({ ...formData, alertType: e.target.value as AlertType })}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="price_drop">Baisse de prix</option>
            <option value="price_increase">Hausse de prix</option>
            <option value="shrinkflation">Réduction de quantité (shrinkflation)</option>
          </select>
        </div>

        {/* Threshold */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Seuil ({formData.alertType === 'price_drop' || formData.alertType === 'price_increase' ? '%' : 'g/ml'}) *
          </label>
          <input
            type="number"
            value={formData.threshold}
            onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
            min="0"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {formData.alertType === 'price_drop' && 'Me prévenir si le prix baisse de plus de ce pourcentage'}
            {formData.alertType === 'price_increase' && 'Me prévenir si le prix augmente de plus de ce pourcentage'}
            {formData.alertType === 'shrinkflation' && 'Me prévenir si la quantité diminue'}
          </p>
        </div>

        {/* Territory */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Territoire *
          </label>
          <select
            value={formData.territory}
            onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="GP">Guadeloupe</option>
            <option value="MQ">Martinique</option>
            <option value="GF">Guyane</option>
            <option value="RE">La Réunion</option>
            <option value="YT">Mayotte</option>
          </select>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Notifications
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="email"
              checked={formData.emailEnabled}
              onChange={(e) => setFormData({ ...formData, emailEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="email" className="text-sm text-slate-700 dark:text-slate-300">
              Email
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="push"
              checked={formData.pushEnabled}
              onChange={(e) => setFormData({ ...formData, pushEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="push" className="text-sm text-slate-700 dark:text-slate-300">
              Notifications push
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            Créer l'alerte
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
