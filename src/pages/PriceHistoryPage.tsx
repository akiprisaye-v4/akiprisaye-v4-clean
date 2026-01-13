/**
 * Price History Page
 * Display price evolution charts and statistics
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { historyService } from '../services/historyService';
import type { PriceHistoryPoint, Timeframe } from '../types/priceHistory';

export default function PriceHistoryPage() {
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [timeframe]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual product EAN from URL params or search
      const mockEan = '3017620422003';
      const history = await historyService.getPriceHistory(mockEan, timeframe);
      setData(history.dataPoints);
    } catch (error) {
      console.error('Failed to load price history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Historique des Prix - A KI PRI SA YÉ</title>
        <meta 
          name="description" 
          content="Consultez l'évolution des prix dans le temps avec des graphiques interactifs" 
        />
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Historique des Prix
          </h1>

          {/* Timeframe Selector */}
          <div className="mb-6 flex gap-2">
            {(['7d', '30d', '90d', '365d'] as Timeframe[]).map(tf => (
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
                {tf === '7d' && '7 jours'}
                {tf === '30d' && '30 jours'}
                {tf === '90d' && '90 jours'}
                {tf === '365d' && '1 an'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-600 dark:text-slate-400">Chargement...</div>
            </div>
          ) : (
            <PriceHistoryChart data={data} showTrendLine showAverage />
          )}
        </div>
      </div>
    </>
  );
}
