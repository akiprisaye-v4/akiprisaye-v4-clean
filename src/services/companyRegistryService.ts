/**
 * Company Registry Service
 * 
 * Centralized service for managing and accessing company data.
 * Supports lookup by any identifier: SIRET, SIREN, VAT, or internal ID.
 * 
 * Key principle: ONE identifier is enough to retrieve full company information.
 */

import type { Company, CompanyLookupCriteria } from '../types/company';
import {
  isValidSiret,
  isValidSiren,
  isValidVat,
  normalizeSiret,
  normalizeSiren,
  normalizeVat,
  extractSirenFromSiret,
  extractSirenFromVat,
} from '../utils/companyValidation';

/**
 * In-memory company registry
 * In production, this would be replaced with Firestore/database queries
 */
const companyRegistry: Map<string, Company> = new Map();

/**
 * Index by SIRET code for fast lookups
 */
const siretIndex: Map<string, string> = new Map(); // SIRET -> company ID

/**
 * Index by SIREN code for fast lookups
 * One SIREN can have multiple SIRET (establishments)
 */
const sirenIndex: Map<string, Set<string>> = new Map(); // SIREN -> Set of company IDs

/**
 * Index by VAT code for fast lookups
 */
const vatIndex: Map<string, string> = new Map(); // VAT -> company ID

/**
 * Register a company in the registry
 */
export function registerCompany(company: Company): void {
  companyRegistry.set(company.id, company);

  if (company.siretCode) {
    const normalizedSiret = normalizeSiret(company.siretCode);
    if (normalizedSiret) {
      siretIndex.set(normalizedSiret, company.id);
    }
  }

  if (company.sirenCode) {
    const normalizedSiren = normalizeSiren(company.sirenCode);
    if (normalizedSiren) {
      if (!sirenIndex.has(normalizedSiren)) {
        sirenIndex.set(normalizedSiren, new Set());
      }
      sirenIndex.get(normalizedSiren)!.add(company.id);
    }
  }

  if (company.vatCode) {
    const normalizedVat = normalizeVat(company.vatCode);
    if (normalizedVat) {
      vatIndex.set(normalizedVat, company.id);
    }
  }
}

/**
 * Lookup company by SIRET
 */
export function getCompanyBySiret(siretCode: string): Company | null {
  if (!isValidSiret(siretCode)) return null;

  const normalized = normalizeSiret(siretCode);
  if (!normalized) return null;

  const companyId = siretIndex.get(normalized);
  return companyId ? companyRegistry.get(companyId) || null : null;
}

/**
 * Lookup companies by SIREN
 */
export function getCompaniesBySiren(sirenCode: string): Company[] {
  if (!isValidSiren(sirenCode)) return [];

  const normalized = normalizeSiren(sirenCode);
  if (!normalized) return [];

  const companyIds = sirenIndex.get(normalized);
  if (!companyIds) return [];

  const companies: Company[] = [];

  for (const id of Array.from(companyIds)) {
    const company = companyRegistry.get(id);
    if (company) {
      companies.push(company);
    }
  }

  return companies;
}

/**
 * Lookup company by VAT
 */
export function getCompanyByVat(vatCode: string): Company | null {
  if (!isValidVat(vatCode)) return null;

  const normalized = normalizeVat(vatCode);
  if (!normalized) return null;

  const companyId = vatIndex.get(normalized);
  return companyId ? companyRegistry.get(companyId) || null : null;
}

/**
 * Lookup company by internal ID
 */
export function getCompanyById(id: string): Company | null {
  return companyRegistry.get(id) || null;
}

/**
 * Unified company lookup
 */
export function getCompany(identifier: string): Company | null {
  if (!identifier) return null;

  let company = getCompanyById(identifier);
  if (company) return company;

  if (isValidSiret(identifier)) {
    company = getCompanyBySiret(identifier);
    if (company) return company;
  }

  if (isValidSiren(identifier)) {
    const companies = getCompaniesBySiren(identifier);
    if (companies.length > 0) {
      const hq = companies.find(c => c.siretCode?.endsWith('00001'));
      return hq || companies[0];
    }
  }

  if (isValidVat(identifier)) {
    company = getCompanyByVat(identifier);
    if (company) return company;
  }

  return null;
}

/**
 * Search companies by criteria
 */
export function searchCompanies(criteria: CompanyLookupCriteria): Company[] {
  const results: Company[] = [];

  if (criteria.internalId) {
    const company = getCompanyById(criteria.internalId);
    if (company) results.push(company);
    return results;
  }

  if (criteria.siretCode) {
    const company = getCompanyBySiret(criteria.siretCode);
    if (company) results.push(company);
    return results;
  }

  if (criteria.sirenCode) {
    return getCompaniesBySiren(criteria.sirenCode);
  }

  if (criteria.vatCode) {
    const company = getCompanyByVat(criteria.vatCode);
    if (company) results.push(company);
    return results;
  }

  for (const company of Array.from(companyRegistry.values())) {
    let match = true;

    if (criteria.legalName) {
      const searchTerm = criteria.legalName.toLowerCase();
      match =
        company.legalName.toLowerCase().includes(searchTerm) ||
        company.tradeName?.toLowerCase().includes(searchTerm) === true;
    }

    if (criteria.territory && match) {
      match =
        company.headOffice.department.toLowerCase().includes(criteria.territory.toLowerCase()) ||
        company.headOffice.city.toLowerCase().includes(criteria.territory.toLowerCase());
    }

    if (match) {
      results.push(company);
    }
  }

  return results;
}

/**
 * Utilities
 */
export function getAllCompanies(): Company[] {
  return Array.from(companyRegistry.values());
}

export function clearCompanyRegistry(): void {
  companyRegistry.clear();
  siretIndex.clear();
  sirenIndex.clear();
  vatIndex.clear();
}

export function getCompanyCount(): number {
  return companyRegistry.size;
}

export function isCompanyActive(company: Company): boolean {
  return company.activityStatus === 'ACTIVE';
}

export function getEstablishments(sirenCode: string): Company[] {
  return getCompaniesBySiren(sirenCode);
}

export function getHeadquarters(sirenCode: string): Company | null {
  const establishments = getCompaniesBySiren(sirenCode);
  return establishments.find(c => c.siretCode?.endsWith('00001')) || null;
}