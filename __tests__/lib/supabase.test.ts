import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Trail, Submission } from '@/lib/supabase';

const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

describe('supabase lib exports', () => {
  it('Trail type has expected shape', () => {
    const trail: Trail = {
      id: '1',
      name: 'Test Trail',
      region_id: 'r1',
      activity_types: ['Hiking'],
      difficulty: 'green',
      distance_km: 5,
      elevation_gain_m: 200,
      latitude: 49.0,
      longitude: -123.0,
      gpx_coordinates: null,
      video_status: 'not_filmed',
      filmed_date: null,
      notes: null,
      description: 'A test trail',
      highlights: [],
      season: null,
      duration_min: null,
      video_url: null,
      gpx_url: null,
      thumbnail_url: null,
      contributor_id: null,
      contributor_name: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };
    expect(trail.id).toBe('1');
    expect(trail.name).toBe('Test Trail');
    expect(trail.activity_types).toEqual(['Hiking']);
    expect(trail.difficulty).toBe('green');
  });

  it('Submission type has expected shape', () => {
    const submission: Submission = {
      id: 's1',
      trail_name: 'New Trail',
      activity_types: ['Mountain Biking'],
      region: 'Vancouver',
      difficulty: 'blue',
      description: null,
      video_key: null,
      gpx_key: null,
      thumbnail_key: null,
      gpx_coordinates: null,
      distance_km: null,
      elevation_gain_m: null,
      latitude: null,
      longitude: null,
      status: 'pending',
      reviewer_notes: null,
      reviewed_at: null,
      contributor_name: 'Jane',
      contributor_email: 'jane@example.com',
      submitted_at: '2025-06-01T00:00:00Z',
    };
    expect(submission.id).toBe('s1');
    expect(submission.status).toBe('pending');
    expect(submission.activity_types).toEqual(['Mountain Biking']);
  });

  it('getTrails returns expected shape when mocked', async () => {
    const mockTrails: Trail[] = [
      {
        id: '1',
        name: 'Mock Trail',
        region_id: 'r1',
        activity_types: ['Hiking'],
        difficulty: 'green',
        distance_km: 3,
        elevation_gain_m: 100,
        latitude: 49.0,
        longitude: -123.0,
        gpx_coordinates: null,
        video_status: 'live',
        filmed_date: null,
        notes: null,
        description: null,
        highlights: [],
        season: null,
        duration_min: null,
        video_url: null,
        gpx_url: null,
        thumbnail_url: null,
        contributor_id: null,
        contributor_name: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      },
    ];

    mockFrom.mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: mockTrails, error: null }),
      }),
    });

    const { getTrails } = await import('@/lib/supabase');
    const result = await getTrails();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Mock Trail');
    expect(result[0].video_status).toBe('live');
  });
});
