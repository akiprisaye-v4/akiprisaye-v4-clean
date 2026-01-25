// test/setup.ts

/**
 * Global test setup for Vitest
 *
 * - Compatible with Vitest v4
 * - Compatible with React Testing Library
 * - Works with `globals: false`
 * - Shared between src/ and frontend/src/
 */

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});