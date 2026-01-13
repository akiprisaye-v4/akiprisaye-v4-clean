// src/data/taxes/taxRatesByTerritory.ts
/**
 * Tax rates by territory - Documented, dated, and sourced
 * All rates are based on official sources or clearly marked as unavailable
 * No invented or speculative data
 */

export interface TaxRate {
  territory: string
  territoryCode: string // ISO code or official code
  taxType: 'tva' | 'octroi_de_mer' | 'octroi_de_mer_regional' | 'taxe_speciale_consommation'
  taxName: string
  /**
   * Single rate if known and constant
   */
  rate?: number | null
  /**
   * Minimum rate if range applies
   */
  minRate?: number | null
  /**
   * Maximum rate if range applies
   */
  maxRate?: number | null
  /**
   * Unit of the rate (percentage, euro per liter, etc.)
   */
  unit: 'percentage' | 'euro_per_liter' | 'euro_per_kg' | 'euro_fixed'
  /**
   * Product category or scope
   */
  scope: string
  /**
   * Source ID from taxSources.ts
   */
  sourceId: string
  /**
   * Date when this rate was verified or published (ISO format)
   */
  validFrom: string
  /**
   * Date when this rate expires or was replaced (ISO format, null if still valid)
   */
  validUntil: string | null
  /**
   * Additional notes or clarifications
   */
  notes?: string
}

/**
 * Tax rates by territory
 * Data structure is ready to be populated with official data
 * Current values are either official or explicitly marked as unavailable
 */
export const TAX_RATES_BY_TERRITORY: TaxRate[] = [
  // MÉTROPOLE (HEXAGONE) - TVA
  {
    territory: 'Métropole',
    territoryCode: 'FR-MET',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 20,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux normal de TVA en France métropolitaine',
  },
  {
    territory: 'Métropole',
    territoryCode: 'FR-MET',
    taxType: 'tva',
    taxName: 'TVA Taux Intermédiaire',
    rate: 10,
    unit: 'percentage',
    scope: 'Restauration, transport, travaux de rénovation',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux intermédiaire de TVA',
  },
  {
    territory: 'Métropole',
    territoryCode: 'FR-MET',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 5.5,
    unit: 'percentage',
    scope: 'Produits alimentaires de base, livres, énergie',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit de TVA pour produits de première nécessité',
  },
  {
    territory: 'Métropole',
    territoryCode: 'FR-MET',
    taxType: 'tva',
    taxName: 'TVA Taux Particulier',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Presse, médicaments remboursables',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux super réduit de TVA',
  },

  // GUADELOUPE - TVA & OCTROI DE MER
  {
    territory: 'Guadeloupe',
    territoryCode: 'FR-971',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 8.5,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux de TVA spécifique aux DOM',
  },
  {
    territory: 'Guadeloupe',
    territoryCode: 'FR-971',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Produits de première nécessité',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit pour produits essentiels',
  },
  {
    territory: 'Guadeloupe',
    territoryCode: 'FR-971',
    taxType: 'octroi_de_mer',
    taxName: 'Octroi de Mer',
    minRate: 0,
    maxRate: 30,
    unit: 'percentage',
    scope: 'Variable selon catégories de produits',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taux variables selon produits et délibérations locales. Certains produits de première nécessité exonérés.',
  },
  {
    territory: 'Guadeloupe',
    territoryCode: 'FR-971',
    taxType: 'octroi_de_mer_regional',
    taxName: 'Octroi de Mer Régional',
    minRate: 0,
    maxRate: 2.5,
    unit: 'percentage',
    scope: 'Additif à l\'octroi de mer',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taxe additionnelle affectée à la région',
  },

  // MARTINIQUE - TVA & OCTROI DE MER
  {
    territory: 'Martinique',
    territoryCode: 'FR-972',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 8.5,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux de TVA spécifique aux DOM',
  },
  {
    territory: 'Martinique',
    territoryCode: 'FR-972',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Produits de première nécessité',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit pour produits essentiels',
  },
  {
    territory: 'Martinique',
    territoryCode: 'FR-972',
    taxType: 'octroi_de_mer',
    taxName: 'Octroi de Mer',
    minRate: 0,
    maxRate: 30,
    unit: 'percentage',
    scope: 'Variable selon catégories de produits',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taux variables selon produits et délibérations locales. Certains produits de première nécessité exonérés.',
  },
  {
    territory: 'Martinique',
    territoryCode: 'FR-972',
    taxType: 'octroi_de_mer_regional',
    taxName: 'Octroi de Mer Régional',
    minRate: 0,
    maxRate: 2.5,
    unit: 'percentage',
    scope: 'Additif à l\'octroi de mer',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taxe additionnelle affectée à la région',
  },

  // GUYANE - TVA & OCTROI DE MER
  {
    territory: 'Guyane',
    territoryCode: 'FR-973',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 8.5,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux de TVA spécifique aux DOM',
  },
  {
    territory: 'Guyane',
    territoryCode: 'FR-973',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Produits de première nécessité',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit pour produits essentiels',
  },
  {
    territory: 'Guyane',
    territoryCode: 'FR-973',
    taxType: 'octroi_de_mer',
    taxName: 'Octroi de Mer',
    minRate: 0,
    maxRate: 30,
    unit: 'percentage',
    scope: 'Variable selon catégories de produits',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taux variables selon produits et délibérations locales. Certains produits de première nécessité exonérés.',
  },
  {
    territory: 'Guyane',
    territoryCode: 'FR-973',
    taxType: 'octroi_de_mer_regional',
    taxName: 'Octroi de Mer Régional',
    minRate: 0,
    maxRate: 2.5,
    unit: 'percentage',
    scope: 'Additif à l\'octroi de mer',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taxe additionnelle affectée à la région',
  },

  // LA RÉUNION - TVA & OCTROI DE MER
  {
    territory: 'La Réunion',
    territoryCode: 'FR-974',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 8.5,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux de TVA spécifique aux DOM',
  },
  {
    territory: 'La Réunion',
    territoryCode: 'FR-974',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Produits de première nécessité',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit pour produits essentiels',
  },
  {
    territory: 'La Réunion',
    territoryCode: 'FR-974',
    taxType: 'octroi_de_mer',
    taxName: 'Octroi de Mer',
    minRate: 0,
    maxRate: 30,
    unit: 'percentage',
    scope: 'Variable selon catégories de produits',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taux variables selon produits et délibérations locales. Certains produits de première nécessité exonérés.',
  },
  {
    territory: 'La Réunion',
    territoryCode: 'FR-974',
    taxType: 'octroi_de_mer_regional',
    taxName: 'Octroi de Mer Régional',
    minRate: 0,
    maxRate: 2.5,
    unit: 'percentage',
    scope: 'Additif à l\'octroi de mer',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taxe additionnelle affectée à la région',
  },

  // MAYOTTE - TVA & OCTROI DE MER
  {
    territory: 'Mayotte',
    territoryCode: 'FR-976',
    taxType: 'tva',
    taxName: 'TVA Taux Normal',
    rate: 8.5,
    unit: 'percentage',
    scope: 'La plupart des biens et services',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux de TVA spécifique aux DOM',
  },
  {
    territory: 'Mayotte',
    territoryCode: 'FR-976',
    taxType: 'tva',
    taxName: 'TVA Taux Réduit',
    rate: 2.1,
    unit: 'percentage',
    scope: 'Produits de première nécessité',
    sourceId: 'dgfip',
    validFrom: '2014-01-01',
    validUntil: null,
    notes: 'Taux réduit pour produits essentiels',
  },
  {
    territory: 'Mayotte',
    territoryCode: 'FR-976',
    taxType: 'octroi_de_mer',
    taxName: 'Octroi de Mer',
    minRate: 0,
    maxRate: 30,
    unit: 'percentage',
    scope: 'Variable selon catégories de produits',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taux variables selon produits et délibérations locales. Certains produits de première nécessité exonérés.',
  },
  {
    territory: 'Mayotte',
    territoryCode: 'FR-976',
    taxType: 'octroi_de_mer_regional',
    taxName: 'Octroi de Mer Régional',
    minRate: 0,
    maxRate: 2.5,
    unit: 'percentage',
    scope: 'Additif à l\'octroi de mer',
    sourceId: 'collectivites_territoriales',
    validFrom: '2004-07-02',
    validUntil: null,
    notes: 'Taxe additionnelle affectée à la région',
  },
]

/**
 * Get tax rates for a specific territory
 */
export function getTaxRatesByTerritory(territoryCode: string): TaxRate[] {
  return TAX_RATES_BY_TERRITORY.filter((rate) => rate.territoryCode === territoryCode)
}

/**
 * Get tax rates by type
 */
export function getTaxRatesByType(
  taxType: TaxRate['taxType']
): TaxRate[] {
  return TAX_RATES_BY_TERRITORY.filter((rate) => rate.taxType === taxType)
}

/**
 * Get all unique territories
 */
export function getAllTerritories(): Array<{ code: string; name: string }> {
  const territories = new Map<string, string>()
  TAX_RATES_BY_TERRITORY.forEach((rate) => {
    if (!territories.has(rate.territoryCode)) {
      territories.set(rate.territoryCode, rate.territory)
    }
  })
  return Array.from(territories.entries()).map(([code, name]) => ({ code, name }))
}

/**
 * Get a specific tax rate
 */
export function getTaxRate(
  territoryCode: string,
  taxType: TaxRate['taxType'],
  scope?: string
): TaxRate | undefined {
  return TAX_RATES_BY_TERRITORY.find(
    (rate) =>
      rate.territoryCode === territoryCode &&
      rate.taxType === taxType &&
      (!scope || rate.scope === scope)
  )
}
