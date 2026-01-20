export type PriceSourceId = 'open_food_facts' | 'open_prices' | 'data_gouv';

export type PriceSearchStatus = 'OK' | 'NO_DATA' | 'UNAVAILABLE' | 'PARTIAL';

export type TerritoryCode =
  | 'fr'
  | 'gp'
  | 'mq'
  | 'gf'
  | 're'
  | 'yt'
  | 'pm'
  | 'bl'
  | 'mf';

export interface PriceObservation {
  source: PriceSourceId;
  productName?: string;
  brand?: string;
  barcode?: string;
  price: number;
  currency: 'EUR';
  unit?: 'unit' | 'kg' | 'l';
  observedAt?: string;
  territory?: TerritoryCode;
  metadata?: Record<string, string>;
}

export interface NormalizedPriceObservation extends PriceObservation {
  pricePerUnit?: number;
  normalizedLabel: string;
}

export interface PriceSearchInput {
  barcode?: string;
  query?: string;
  brand?: string;
  category?: string;
  territory?: TerritoryCode;
}

export interface PriceInterval {
  min: number | null;
  median: number | null;
  max: number | null;
  currency: 'EUR';
  priceCount: number;
}

export interface PriceSearchResult {
  status: PriceSearchStatus;
  intervals: PriceInterval[];
  confidence: number;
  observations: NormalizedPriceObservation[];
  warnings: string[];
  sourcesUsed: PriceSourceId[];
  territory: TerritoryCode;
  productName?: string;
  metadata: {
    queriedAt: string;
    queryUsed: string;
    territoryMessage?: string;
  };
}
