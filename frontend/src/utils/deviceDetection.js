/**
 * Device detection utilities for performance optimization
 */

/**
 * Check if the device is mobile
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device has touch support
 * @returns {boolean}
 */
export function hasTouchSupport() {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get device performance tier (low/medium/high)
 * Based on hardware concurrency and connection
 * @returns {'low'|'medium'|'high'}
 */
export function getDevicePerformanceTier() {
  if (typeof navigator === 'undefined') return 'medium';
  
  const cores = navigator.hardwareConcurrency || 4;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  // Low-end: < 4 cores or slow connection
  if (cores < 4 || (connection && connection.effectiveType === '2g')) {
    return 'low';
  }
  
  // High-end: >= 8 cores
  if (cores >= 8) {
    return 'high';
  }
  
  // Medium: everything else
  return 'medium';
}

/**
 * Get optimized map config based on device
 * @returns {Object}
 */
export function getOptimizedMapConfig() {
  const isMobile = isMobileDevice();
  const performanceTier = getDevicePerformanceTier();
  
  return {
    // Disable animations on low-end devices
    animate: performanceTier !== 'low',
    
    // Reduce marker density on mobile
    maxVisibleMarkers: isMobile ? 50 : 100,
    
    // Disable heavy features on low-end
    enableClustering: performanceTier !== 'low',
    
    // Adjust zoom animation duration
    zoomAnimationDuration: performanceTier === 'low' ? 0 : 250,
    
    // Device flags
    isMobile,
    performanceTier,
  };
}