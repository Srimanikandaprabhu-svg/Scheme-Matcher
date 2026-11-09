import { describe, it, expect } from 'vitest';
import { haversine } from '../shared/geo.js';

describe('Geospatial Haversine Tests', () => {
  it('calculates 0 km distance for identical coordinates', () => {
    const dist = haversine(12.9716, 77.5946, 12.9716, 77.5946);
    expect(dist).toBe(0);
  });

  it('calculates accurate distance between known Indian cities (Bengaluru to Chennai)', () => {
    // Bengaluru: 12.9716, 77.5946
    // Chennai: 13.0827, 80.2707
    // Expected distance: ~290 km
    const dist = haversine(12.9716, 77.5946, 13.0827, 80.2707);
    expect(dist).toBeGreaterThan(280);
    expect(dist).toBeLessThan(310);
  });
});
