/**
 * Inflation Dashboard Overview Component
 * Key metrics and visualization for local inflation
 */

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { inflationService } from '../services/inflationService';
import type { InflationMetrics } from '../types/inflation';

export function InflationDashboard() {
  const [metrics, setMetrics] = useState<InflationMetrics | null>(null);
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [timeframe]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await inflationService.calculateInflation(timeframe);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load inflation metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Aucune donnée disponible</p>
      </div>
    );
  }

  const avgInflation = metrics.territories.reduce((sum, t) => sum + t.overallInflationRate, 0) / metrics.territories.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Tableau de Bord Inflation
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Suivi transparent de l'évolution des prix dans les territoires d'Outre-mer
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6 flex gap-2">
          {(['1m', '3m', '6m', '1y'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-colors
                ${timeframe === tf 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              {tf === '1m' && '1 mois'}
              {tf === '3m' && '3 mois'}
              {tf === '6m' && '6 mois'}
              {tf === '1y' && '1 an'}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Inflation Moyenne
              </div>
              {avgInflation > 3 ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {avgInflation.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Tous territoires confondus
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Écart Métropole
              </div>
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              +{(metrics.territories.reduce((sum, t) => sum + (t.comparedToMetropole || 0), 0) / metrics.territories.length).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Prix moyens comparés
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Alertes Actives
              </div>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {metrics.territories.filter(t => t.overallInflationRate > 5).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Territoires à haute inflation (&gt;5%)
            </div>
          </div>
        </div>

        {/* Territory Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Comparaison par Territoire
          </h2>
          <div className="space-y-4">
            {metrics.territories.map(territory => (
              <div key={territory.territory} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {territory.territoryName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-semibold
                      ${territory.overallInflationRate > 5 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                        territory.overallInflationRate > 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
                        'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      }
                    `}>
                      {territory.overallInflationRate.toFixed(1)}%
                    </div>
                    {territory.comparedToMetropole && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        +{territory.comparedToMetropole.toFixed(1)}% vs Métropole
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      territory.overallInflationRate > 5 ? 'bg-red-500' :
                      territory.overallInflationRate > 3 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(territory.overallInflationRate * 10, 100)}%` }}
                  />
                </div>

                {/* Top Categories */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {territory.categories.slice(0, 4).map(cat => (
                    <div key={cat.category} className="text-xs">
                      <span className="text-slate-600 dark:text-slate-400">{cat.category}:</span>
                      <span className={`ml-1 font-semibold ${
                        cat.inflationRate > 5 ? 'text-red-600 dark:text-red-400' :
                        cat.inflationRate > 3 ? 'text-orange-600 dark:text-orange-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {cat.inflationRate > 0 ? '+' : ''}{cat.inflationRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                À propos de ces données
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Les taux d'inflation sont calculés à partir des observations de prix collectées 
                par les citoyens et les sources officielles. Les données sont mises à jour quotidiennement 
                et reflètent les variations réelles constatées sur le terrain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
