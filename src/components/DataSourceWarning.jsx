/**
 * DataSourceWarning Component
 * 
 * Displays critical warnings about data sources throughout the application.
 * Shows when data is demonstration/non-official.
 */

import { Card } from './card.jsx';

export function DataSourceWarning({ dataStatus, requiredSources, compact = false }) {
  // Only show warning if data is not official
  if (dataStatus === 'OFFICIEL' || dataStatus === 'OFFICIAL') {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 text-sm">
        <p className="text-red-800 dark:text-red-200 font-semibold">
          ⚠️ Données de démonstration - Ne pas utiliser en production
        </p>
      </div>
    );
  }

  return (
    <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-6">
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            AVERTISSEMENT CRITIQUE - Données non officielles
          </h3>
          
          <div className="space-y-3 text-sm text-red-700 dark:text-red-300">
            <p className="font-semibold">
              Les données affichées sont des DONNÉES DE DÉMONSTRATION.
            </p>
            
            <p>
              Elles ne doivent <strong>PAS</strong> être utilisées pour des décisions réelles
              ou être citées comme référence.
            </p>

            {requiredSources && requiredSources.length > 0 && (
              <div className="pt-3 border-t border-red-300 dark:border-red-700">
                <p className="font-semibold mb-2">
                  Sources officielles requises :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {requiredSources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-red-300 dark:border-red-700">
              <p className="text-xs">
                <strong>Statut actuel :</strong> {dataStatus || 'DEMONSTRATION'}
                <br />
                <strong>Action requise :</strong> Remplacer par données officielles tracées
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function OfficialDataBadge({ source, date, link }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg text-xs">
      <span className="text-green-700 dark:text-green-300">
        ✓ <strong>Source:</strong> {source}
      </span>
      {date && (
        <span className="text-green-600 dark:text-green-400">
          • {date}
        </span>
      )}
      {link && (
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 dark:text-green-400 hover:underline"
        >
          🔗
        </a>
      )}
    </div>
  );
}

export function DataUnavailableNotice({ dataType, suggestedSources }) {
  return (
    <Card className="border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">ℹ️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
            Donnée non disponible
          </h3>
          
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            Les données pour <strong>{dataType}</strong> ne sont pas encore disponibles.
          </p>

          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            Ce module nécessite des données issues de sources officielles.
          </p>

          {suggestedSources && suggestedSources.length > 0 && (
            <div className="pt-3 border-t border-amber-300 dark:border-amber-700">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Sources officielles suggérées :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-amber-700 dark:text-amber-300">
                {suggestedSources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-amber-300 dark:border-amber-700">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              💡 Vous disposez d'une source officielle ? Contactez-nous pour l'intégrer.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DataSourceWarning;
