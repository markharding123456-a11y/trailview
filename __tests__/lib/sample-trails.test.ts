import { describe, it, expect } from 'vitest';
import {
  sampleTrails,
  regions,
  activityTypes,
  difficultyColors,
  difficultyLabels,
} from '@/lib/sample-trails';

describe('sample-trails data integrity', () => {
  it('all trails have required fields', () => {
    for (const trail of sampleTrails) {
      expect(trail.id).toBeTruthy();
      expect(trail.name).toBeTruthy();
      expect(trail.region).toBeTruthy();
      expect(trail.difficulty).toBeTruthy();
      expect(trail.coordinates.length).toBeGreaterThan(0);
    }
  });

  it('all difficulties are valid values', () => {
    const validDifficulties = ['green', 'blue', 'black', 'expert'];
    for (const trail of sampleTrails) {
      expect(validDifficulties).toContain(trail.difficulty);
    }
  });

  it('all coordinates have 3 elements [lat, lng, ele]', () => {
    for (const trail of sampleTrails) {
      for (const coord of trail.coordinates) {
        expect(coord).toHaveLength(3);
        expect(typeof coord[0]).toBe('number');
        expect(typeof coord[1]).toBe('number');
        expect(typeof coord[2]).toBe('number');
      }
    }
  });

  it('regions array matches trail regions', () => {
    const trailRegions = new Set(sampleTrails.map((t) => t.region));
    for (const region of regions) {
      expect(trailRegions.has(region.name)).toBe(true);
    }
  });

  it('activityTypes array has all unique values', () => {
    const unique = new Set(activityTypes);
    expect(unique.size).toBe(activityTypes.length);
  });

  it('difficultyColors has entries for all difficulty levels', () => {
    const levels = ['green', 'blue', 'black', 'expert'];
    for (const level of levels) {
      expect(difficultyColors[level]).toBeTruthy();
    }
  });

  it('difficultyLabels has entries for all difficulty levels', () => {
    const levels = ['green', 'blue', 'black', 'expert'];
    for (const level of levels) {
      expect(difficultyLabels[level]).toBeTruthy();
    }
  });
});
