// src/services/territoryComparisonService.ts

export type TerritoryLike = string | null | undefined;
export type TerritoryScope = Set<string>;

export interface TerritoryPriceObservation {
  territory?: TerritoryLike;
  price?: number;
  pricePerUnit?: number;
  observedAt?: string; // ISO datetime
  date?: string; // YYYY-MM-DD
}

export interface TerritoryAverageMap {
  [territory: string]: number;
}

export interface TerritoryComparisonRow {
  territory: string;
  averagePrice: number;
  absoluteGap: number;
  relativeGap: number;
  rank: number;
}

export const DEFAULT_TERRITORY_SCOPE: TerritoryScope = new Set([
  'FR',
  'GP',
  'MQ',
  'GF',
  'RE',
  'YT',
]);

function avg(values: number[]): number {
  if (!values.length) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

export function normalizeTerritory(t: TerritoryLike): string | null {
  if (typeof t !== 'string') return null;
  const s = t.trim().toUpperCase();
  return s ? s : null;
}

function normalizeDate(obs: TerritoryPriceObservation): string | null {
  if (typeof obs.date === 'string') {
    const d = obs.date.trim();
    if (d) return d;
  }
  if (typeof obs.observedAt === 'string') {
    const ts = obs.observedAt.trim();
    if (ts) return ts.slice(0, 10); // YYYY-MM-DD
  }
  return null;
}

function pickValue(obs: TerritoryPriceObservation): number | null {
  const v = typeof obs.pricePerUnit === 'number' ? obs.pricePerUnit : obs.price;
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  return v;
}

function ensureScope(scope: any): TerritoryScope {
  // IMPORTANT: éviter `instanceof Set` (peut échouer selon le contexte Vitest)
  if (scope && typeof scope.has === 'function') {
    return scope as TerritoryScope;
  }
  return DEFAULT_TERRITORY_SCOPE;
}

export function calculateTerritoryAverages(
  observations: TerritoryPriceObservation[],
  scope: any = DEFAULT_TERRITORY_SCOPE
): TerritoryAverageMap {
  const effectiveScope = ensureScope(scope);
  const byTerr: Map<string, number[]> = new Map();

  for (const o of observations) {
    const terr = normalizeTerritory(o.territory);
    if (!terr) continue;
    if (effectiveScope && !effectiveScope.has(terr)) continue;

    const v = pickValue(o);
    if (v === null) continue;

    let arr = byTerr.get(terr);
    if (!arr) {
      arr = [];
      byTerr.set(terr, arr);
    }
    arr.push(v);
  }

  const out: TerritoryAverageMap = {};
  for (const [terr, values] of byTerr.entries()) {
    out[terr] = avg(values);
  }
  return out;
}

export function calculateTerritoryComparison(
  observations: TerritoryPriceObservation[],
  baseTerritory: string = 'FR',
  scope: any = DEFAULT_TERRITORY_SCOPE
): TerritoryComparisonRow[] {
  const effectiveScope = ensureScope(scope);
  const averages = calculateTerritoryAverages(observations, effectiveScope);

  const territories = Object.keys(averages);
  if (!territories.length) return [];

  // tri ascendant: moins cher en premier
  territories.sort((a, b) => averages[a] - averages[b]);

  const requestedBase = normalizeTerritory(baseTerritory);
  const effectiveBase =
    requestedBase && averages[requestedBase] !== undefined
      ? requestedBase
      : territories[0];

  const baseAvg = averages[effectiveBase];

  return territories.map((territory, index) => {
    const averagePrice = averages[territory];
    const absoluteGap = averagePrice - baseAvg;
    const relativeGap = baseAvg === 0 ? 0 : (absoluteGap / baseAvg) * 100;

    return {
      territory,
      averagePrice,
      absoluteGap,
      relativeGap,
      rank: index + 1,
    };
  });
}

export function buildTerritoryTimeSeries(
  observations: TerritoryPriceObservation[],
  scope: any = DEFAULT_TERRITORY_SCOPE
): Array<Record<string, any>> {
  const effectiveScope = ensureScope(scope);

  // date -> territory -> values
  const byDate: Map<string, Map<string, number[]>> = new Map();

  for (const o of observations) {
    const date = normalizeDate(o);
    if (!date) continue;

    const terr = normalizeTerritory(o.territory);
    if (!terr) continue;
    if (effectiveScope && !effectiveScope.has(terr)) continue;

    const v = pickValue(o);
    if (v === null) continue;

    let terrMap = byDate.get(date);
    if (!terrMap) {
      terrMap = new Map();
      byDate.set(date, terrMap);
    }

    let arr = terrMap.get(terr);
    if (!arr) {
      arr = [];
      terrMap.set(terr, arr);
    }
    arr.push(v);
  }

  const dates = Array.from(byDate.keys()).sort();

  // Format attendu par tes tests: { date, FR: x, GP: y, ... }
  return dates.map((date) => {
    const terrMap = byDate.get(date)!;
    const row: Record<string, any> = { date };

    for (const [terr, values] of terrMap.entries()) {
      row[terr] = avg(values);
    }

    return row;
  });
}