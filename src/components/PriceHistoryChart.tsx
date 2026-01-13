/**
 * Price History Chart Component
 * Interactive chart displaying price evolution over time
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PriceHistoryPoint } from '../types/priceHistory';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
  showTrendLine?: boolean;
  showAverage?: boolean;
}

export function PriceHistoryChart({ data, showTrendLine = false, showAverage = false }: PriceHistoryChartProps) {
  // Group data by store
  const storeData = new Map<string, PriceHistoryPoint[]>();
  data.forEach(point => {
    const existing = storeData.get(point.storeName) || [];
    existing.push(point);
    storeData.set(point.storeName, existing);
  });

  // Transform data for Recharts
  const chartData = Array.from(
    data.reduce((acc, point) => {
      if (!acc.has(point.date)) {
        acc.set(point.date, { date: point.date });
      }
      const entry = acc.get(point.date)!;
      entry[point.storeName] = point.price;
      return acc;
    }, new Map<string, any>())
  ).map(([_, value]) => value);

  // Calculate average if needed
  if (showAverage) {
    const avgPrice = data.reduce((sum, p) => sum + p.price, 0) / data.length;
    chartData.forEach(entry => {
      entry.average = avgPrice;
    });
  }

  // Get unique store names for colors
  const stores = Array.from(storeData.keys());
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        Évolution des Prix
      </h3>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Aucune donnée d'historique disponible
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toFixed(2)}€`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}€`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            
            {stores.map((store, i) => (
              <Line
                key={store}
                type="monotone"
                dataKey={store}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}

            {showAverage && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Moyenne"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
        <p>
          Les données affichées proviennent de sources multiples: contributions citoyennes, données officielles et partenaires.
          La fiabilité de chaque point est indiquée par son opacité.
        </p>
      </div>
    </div>
  );
}
