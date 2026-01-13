// src/data/taxes/taxDefinitions.ts
/**
 * Pedagogical definitions of taxes and indirect levies
 * All definitions are neutral, institutional, and sourced
 */

export interface TaxDefinition {
  id: string
  name: string
  shortDescription: string
  officialRole: string
  legalFramework: string
  knownLimitations: string
  pedagogicalExample: string
}

/**
 * Tax definitions with pedagogical content
 * Each tax has a neutral explanation of its purpose and legal framework
 */
export const TAX_DEFINITIONS: Record<string, TaxDefinition> = {
  tva: {
    id: 'tva',
    name: 'TVA (Taxe sur la Valeur Ajoutée)',
    shortDescription: 'Taxe indirecte sur la consommation appliquée sur la plupart des biens et services',
    officialRole: 'Principale ressource fiscale de l\'État français, finance les services publics et les infrastructures',
    legalFramework: 'Code général des impôts - Articles 256 et suivants. Directive européenne 2006/112/CE',
    knownLimitations: 'Les taux de TVA diffèrent entre la métropole et les territoires ultramarins. Certains produits bénéficient de taux réduits.',
    pedagogicalExample: 'Un produit vendu 10€ HT avec une TVA à 20% coûtera 12€ TTC. La TVA de 2€ est collectée par le vendeur pour le compte de l\'État.',
  },
  octroi_de_mer: {
    id: 'octroi_de_mer',
    name: 'Octroi de Mer',
    shortDescription: 'Taxe locale appliquée dans les DOM sur les produits importés et certains produits locaux',
    officialRole: 'Finance les collectivités territoriales ultramarines et protège la production locale en favorisant les produits fabriqués localement',
    legalFramework: 'Code général des impôts - Articles 1er à 10 de l\'annexe IV. Loi du 2 juillet 2004',
    knownLimitations: 'Son impact varie significativement selon les territoires (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte) et les catégories de produits. Certains produits de première nécessité peuvent être exonérés.',
    pedagogicalExample: 'L\'octroi de mer peut représenter entre 0% et 30% du prix selon le produit et le territoire. Un produit importé peut être taxé à 15%, tandis qu\'un produit local similaire sera exonéré ou taxé à un taux réduit.',
  },
  octroi_de_mer_regional: {
    id: 'octroi_de_mer_regional',
    name: 'Octroi de Mer Régional (OMR)',
    shortDescription: 'Taxe additionnelle à l\'octroi de mer, affectée aux régions ultramarines',
    officialRole: 'Finance les budgets régionaux dans les DOM pour les infrastructures et le développement économique local',
    legalFramework: 'Code général des impôts - Articles 1er à 10 de l\'annexe IV. Créé par la loi du 2 juillet 2004',
    knownLimitations: 'S\'ajoute à l\'octroi de mer classique. Les taux varient selon les régions et les produits.',
    pedagogicalExample: 'L\'OMR s\'ajoute à l\'octroi de mer. Si l\'octroi de mer est de 10% et l\'OMR de 2,5%, le produit subira une taxation totale de 12,5% au titre de ces deux taxes.',
  },
  taxe_speciale_consommation: {
    id: 'taxe_speciale_consommation',
    name: 'Taxe Spéciale de Consommation',
    shortDescription: 'Taxes spécifiques sur certains produits (carburants, alcools, tabacs)',
    officialRole: 'Finance les collectivités locales et régule la consommation de produits spécifiques pour des raisons de santé publique ou environnementales',
    legalFramework: 'Code général des impôts - Articles divers selon les produits. Directives européennes sur les accises',
    knownLimitations: 'Les montants varient fortement selon le type de produit et le territoire. Ces taxes peuvent représenter une part importante du prix final.',
    pedagogicalExample: 'Sur un litre d\'essence à 1,50€, la taxe spéciale de consommation peut représenter 0,60€, soit 40% du prix de vente.',
  },
}

/**
 * Get tax definition by ID
 */
export function getTaxDefinition(taxId: string): TaxDefinition | undefined {
  return TAX_DEFINITIONS[taxId]
}

/**
 * Get all tax definitions as array
 */
export function getAllTaxDefinitions(): TaxDefinition[] {
  return Object.values(TAX_DEFINITIONS)
}
