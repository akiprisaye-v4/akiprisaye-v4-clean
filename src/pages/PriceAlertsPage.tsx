/**
 * Price Alerts Page
 * Manage price alerts for products
 */

import { Helmet } from 'react-helmet-async';
import { AlertForm } from '../components/AlertForm';

export default function PriceAlertsPage() {
  const handleSave = (alertData: any) => {
    console.log('Alert created:', alertData);
    // TODO: Implement actual alert creation with backend
    alert('Alerte créée avec succès ! (TODO: Backend integration)');
  };

  const handleCancel = () => {
    console.log('Alert creation cancelled');
  };

  return (
    <>
      <Helmet>
        <title>Alertes Prix - A KI PRI SA YÉ</title>
        <meta 
          name="description" 
          content="Créez des alertes pour être notifié des changements de prix sur vos produits favoris" 
        />
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <AlertForm onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </>
  );
}
