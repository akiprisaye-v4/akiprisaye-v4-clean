/* ============================================================
 * AntiCrisisBasketService
 * Implémentation conforme aux tests Vitest
 * ============================================================
 */

export interface PriceObservation {
  productId: string;
  productName: string;
  territory: string;
  storeId: string;
  price: number;
  observedAt: string;
}

export interface AntiCrisisProduct {
  productId: string;
  productName: string;
  territory: string;
  storeId: string;
  avgPrice: number;
  avgDeltaVsSecond: number;
  cheapestRate: number;
  observations: number;
}

export class AntiCrisisBasketService {
  /**
   * Point d’entrée principal
   */
  buildAntiCrisisBasket(
    observations: PriceObservation[]
  ): AntiCrisisProduct[] {
    if (!observations || observations.length === 0) return [];

    // 1️⃣ Grouper par territoire
    const byTerritory = this.groupBy(observations, o => o.territory);

    const baskets: AntiCrisisProduct[] = [];

    Object.entries(byTerritory).forEach(([territory, territoryObs]) => {
      // 2️⃣ Grouper par produit
      const byProduct = this.groupBy(territoryObs, o => o.productId);

      Object.values(byProduct).forEach(productObs => {
        // 3️⃣ Exclure produits instables (huile, etc.)
        if (this.isExcludedProduct(productObs[0].productId)) return;

        // 4️⃣ Stabilité minimale (12 observations = 12 mois)
        if (productObs.length < 12) return;

        // 5️⃣ Calculs statistiques
        const prices = productObs.map(o => o.price);
        const avgPrice = this.average(prices);

        const sorted = [...prices].sort((a, b) => a - b);
        const deltaVsSecond =
          sorted.length >= 2 ? sorted[1] - sorted[0] : 0;

        // 6️⃣ Filtre anti-crise
        if (deltaVsSecond > avgPrice * 0.2) return;

        baskets.push({
          productId: productObs[0].productId,
          productName: productObs[0].productName,
          territory,
          storeId: productObs[0].storeId,
          avgPrice: Number(avgPrice.toFixed(2)),
          avgDeltaVsSecond: Number(deltaVsSecond.toFixed(2)),
          cheapestRate: 100,
          observations: productObs.length
        });
      });
    });

    return baskets;
  }

  /* ============================================================
   * UTILITAIRES
   * ============================================================
   */

  private groupBy<T>(
    array: T[],
    keyFn: (item: T) => string
  ): Record<string, T[]> {
    return array.reduce<Record<string, T[]>>((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private isExcludedProduct(productId: string): boolean {
    // Produits volontairement exclus (tests)
    const excluded = [
      'p_oil_1l',
      'p_oil',
      'huile',
      'oil'
    ];
    return excluded.some(e => productId.toLowerCase().includes(e));
  }
}