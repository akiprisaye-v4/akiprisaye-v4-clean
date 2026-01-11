/**
 * priceAnalysis.ts — Price calculation and analysis utilities
 * 
 * Purpose: Pure functions for price-related calculations
 * Used by: Price alerts, comparisons, charts, analysis components
 * 
 * @module priceAnalysis
 */

/**
 * Calculate percentage change between two prices
 * 
 * @param currentPrice - Current price
 * @param previousPrice - Previous price
 * @returns Percentage change (can be positive or negative)
 */
export function calculatePercentageChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Calculate absolute price change
 * 
 * @param currentPrice - Current price
 * @param previousPrice - Previous price
 * @returns Absolute change (can be positive or negative)
 */
export function calculateAbsoluteChange(currentPrice: number, previousPrice: number): number {
  return currentPrice - previousPrice;
}

/**
 * Calculate price as percentage of income
 * 
 * @param price - Price or budget amount
 * @param income - Income amount
 * @returns Percentage of income
 */
export function calculatePercentOfIncome(price: number, income: number): number {
  if (income === 0) return 0;
  return (price / income) * 100;
}

/**
 * Calculate savings compared to reference price
 * 
 * @param currentPrice - Current price
 * @param referencePrice - Reference price (e.g., best price)
 * @returns Savings as percentage
 */
export function calculateSavingsPercentage(currentPrice: number, referencePrice: number): number {
  if (referencePrice === 0) return 0;
  return ((currentPrice - referencePrice) / referencePrice) * 100;
}

/**
 * Find best (minimum) price in a list
 * 
 * @param prices - Array of price values
 * @returns Minimum price or 0 if array is empty
 */
export function findBestPrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  return Math.min(...prices);
}

/**
 * Find worst (maximum) price in a list
 * 
 * @param prices - Array of price values
 * @returns Maximum price or 0 if array is empty
 */
export function findWorstPrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  return Math.max(...prices);
}

/**
 * Calculate average price
 * 
 * @param prices - Array of price values
 * @returns Average price or 0 if array is empty
 */
export function calculateAveragePrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return sum / prices.length;
}

/**
 * Calculate median price
 * 
 * @param prices - Array of price values
 * @returns Median price or 0 if array is empty
 */
export function calculateMedianPrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Compare unit prices to detect false bargains
 * 
 * @param formats - Array of product formats with unitPrice
 * @returns Object with best, worst formats and analysis
 */
export function analyzeFalseBargains<T extends { unitPrice: number }>(formats: T[]) {
  if (formats.length === 0) {
    return { best: null, worst: null, sortedFormats: [] };
  }
  
  const sortedFormats = [...formats].sort((a, b) => a.unitPrice - b.unitPrice);
  const best = sortedFormats[0];
  const worst = sortedFormats[sortedFormats.length - 1];
  
  return {
    best,
    worst,
    sortedFormats,
  };
}

/**
 * Calculate deficit or surplus
 * 
 * @param income - Income amount
 * @param budget - Budget amount
 * @returns Object with difference, isDeficit flag, and percentage
 */
export function calculateBudgetAnalysis(income: number, budget: number) {
  const difference = income - budget;
  const isDeficit = difference < 0;
  const percentOfIncome = calculatePercentOfIncome(budget, income);
  
  return {
    difference,
    isDeficit,
    percentOfIncome,
    absoluteDifference: Math.abs(difference),
  };
}

/**
 * Check if a price is abnormal compared to historical data
 * 
 * @param currentPrice - Current price
 * @param historicalPrices - Array of historical prices
 * @param deviationThreshold - Standard deviation threshold (default: 2)
 * @returns true if price is abnormal
 */
export function isAbnormalPrice(
  currentPrice: number,
  historicalPrices: number[],
  deviationThreshold: number = 2
): boolean {
  if (historicalPrices.length === 0) return false;
  
  const mean = calculateAveragePrice(historicalPrices);
  const squaredDiffs = historicalPrices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / historicalPrices.length;
  const stdDev = Math.sqrt(variance);
  
  const deviation = Math.abs(currentPrice - mean) / stdDev;
  return deviation > deviationThreshold;
}
