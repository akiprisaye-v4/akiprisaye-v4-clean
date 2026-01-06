export type Territory = 'GP' | 'MQ' | 'RE' | 'GF' | 'FR' | 'YT';

export interface PriceObservation {
  productId: string;
  productLabel: string;
  territory: Territory;
  price: number;
  source: string;
  observedAt: string; // ISO
}
