/**
 * Access Levels System
 * Service civique numérique - Observatoire public indépendant
 * L'accès aux données essentielles est libre
 */

export type AccessLevel =
  | 'PUBLIC'
  | 'EXTENDED'
  | 'ANALYSIS'
  | 'INSTITUTIONAL';

export const ACCESS_LEVEL_PRICES = {
  PUBLIC: { 
    monthly: 0, 
    yearly: 0,
    description: 'Accès citoyen de base — Consultation libre des données publiques observées'
  },
  EXTENDED: { 
    monthly: 2.50, 
    yearly: 25,
    description: 'Contribution volontaire au maintien du service'
  },
  ANALYSIS: { 
    monthly: 12, 
    yearly: 120,
    description: 'Accès aux outils d\'analyse pour l\'observation territoriale'
  },
  INSTITUTIONAL: { 
    monthly: null, 
    yearly: null,
    description: 'Convention annuelle — Accès contractuel aux données publiques consolidées'
  },
} as const;

export const FEATURES = {
  // Accès Public (Gratuit pour tous)
  PRICE_COMPARISON: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  TERRITORY_VIEW: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  PRICE_SOURCES_VISIBLE: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  BASIC_HISTORY: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  READ_ONLY_ACCESS: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  NO_ADS: ['PUBLIC', 'EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  
  // Accès Étendu Citoyen
  LOCAL_ALERTS: ['EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  EXTENDED_HISTORY: ['EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  PRODUCT_TRACKING: ['EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  TEMPORAL_COMPARISON: ['EXTENDED', 'ANALYSIS', 'INSTITUTIONAL'],
  
  // Accès Analyse Territoriale
  MULTI_TERRITORY: ['ANALYSIS', 'INSTITUTIONAL'],
  LONG_TIME_SERIES: ['ANALYSIS', 'INSTITUTIONAL'],
  DOMAIN_AGGREGATION: ['ANALYSIS', 'INSTITUTIONAL'],
  CSV_EXPORT_LIMITED: ['ANALYSIS', 'INSTITUTIONAL'],
  METHODOLOGY_ACCESS: ['ANALYSIS', 'INSTITUTIONAL'],
  
  // Licence Institutionnelle
  ALL_DOMAINS: ['INSTITUTIONAL'],
  ADVANCED_EXPORT: ['INSTITUTIONAL'],
  CONSOLIDATED_SERIES: ['INSTITUTIONAL'],
  GLOBAL_INDICES: ['INSTITUTIONAL'],
  TECHNICAL_DOCUMENTATION: ['INSTITUTIONAL'],
  PUBLIC_API: ['INSTITUTIONAL'],
  AUDITABILITY: ['INSTITUTIONAL'],
  TRACEABILITY: ['INSTITUTIONAL'],
} as const;

export type Feature = keyof typeof FEATURES;

/**
 * Check if an access level has a specific feature
 */
export const canUse = (level: AccessLevel, feature: Feature): boolean => {
  return FEATURES[feature].includes(level);
};

/**
 * Get pricing for an access level
 */
export const getAccessPrice = (
  level: AccessLevel, 
  billingCycle: 'monthly' | 'yearly'
): number | null => {
  return ACCESS_LEVEL_PRICES[level][billingCycle];
};

/**
 * Get feature description
 */
export const getFeatureDescription = (feature: Feature): string => {
  const descriptions: Record<Feature, string> = {
    // Accès Public
    PRICE_COMPARISON: 'Comparateur citoyen DOM · ROM · COM',
    TERRITORY_VIEW: 'Consultation par territoire',
    PRICE_SOURCES_VISIBLE: 'Prix observés, datés et sourcés',
    BASIC_HISTORY: 'Historique simple',
    READ_ONLY_ACCESS: 'Lecture seule',
    NO_ADS: 'Sans publicité',
    
    // Accès Étendu
    LOCAL_ALERTS: 'Alertes locales de variation de prix',
    EXTENDED_HISTORY: 'Historique étendu (12 mois)',
    PRODUCT_TRACKING: 'Suivi de produits / territoires',
    TEMPORAL_COMPARISON: 'Comparaisons temporelles simples',
    
    // Accès Analyse
    MULTI_TERRITORY: 'Comparaisons multi-territoires',
    LONG_TIME_SERIES: 'Séries temporelles longues',
    DOMAIN_AGGREGATION: 'Agrégation par domaine (alimentation, énergie, mobilité…)',
    CSV_EXPORT_LIMITED: 'Exports CSV limités',
    METHODOLOGY_ACCESS: 'Méthodologie détaillée',
    
    // Licence Institutionnelle
    ALL_DOMAINS: 'Tous les domaines agrégés',
    ADVANCED_EXPORT: 'Export open-data avancé (CSV / JSON)',
    CONSOLIDATED_SERIES: 'Séries consolidées multi-services',
    GLOBAL_INDICES: 'Accès indices globaux',
    TECHNICAL_DOCUMENTATION: 'Documentation technique',
    PUBLIC_API: 'API publique',
    AUDITABILITY: 'Auditabilité complète',
    TRACEABILITY: 'Transparence méthodologique',
  };
  
  return descriptions[feature];
};

export default {
  canUse,
  getAccessPrice,
  getFeatureDescription,
  ACCESS_LEVEL_PRICES,
  FEATURES,
};
