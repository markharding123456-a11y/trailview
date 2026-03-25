import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssetUrl, formatFileSize, uploadGpx } from '@/lib/cloudflare';

describe('cloudflare helpers', () => {
  describe('getAssetUrl', () => {
    it('returns correct URL format', () => {
      expect(getAssetUrl('trail-123/file.gpx')).toBe('/api/assets/trail-123%2Ffile.gpx');
    });

    it('encodes special characters in the key', () => {
      expect(getAssetUrl('path with spaces')).toBe('/api/assets/path%20with%20spaces');
    });
  });

  describe('formatFileSize', () => {
    it('returns "0 B" for zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('returns bytes for small values', () => {
      expect(formatFileSize(500)).toBe('500.0 B');
    });

    it('returns KB for kilobyte values', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('returns MB for megabyte values', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB');
      expect(formatFileSize(5242880)).toBe('5.0 MB');
    });

    it('returns GB for gigabyte values', () => {
      expect(formatFileSize(1073741824)).toBe('1.0 GB');
    });
  });

  describe('uploadGpx', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('calls fetch with correct path and headers', async () => {
      const mockResult = { success: true, key: 'k', url: '/u', size: 100 };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as Response);

      const file = new File(['<gpx></gpx>'], 'trail.gpx', { type: 'application/gpx+xml' });
      const result = await uploadGpx(file, 'trail-123');

      expect(fetchSpy).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
        method: 'POST',
      }));
      expect(result).toEqual(mockResult);
    });

    it('includes auth token when provided', async () => {
      const mockResult = { success: true, key: 'k', url: '/u', size: 100 };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as Response);

      const file = new File(['<gpx></gpx>'], 'trail.gpx');
      await uploadGpx(file, 'trail-123', 'my-token');

      const callArgs = fetchSpy.mock.calls[0];
      const options = callArgs[1] as RequestInit;
      expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer my-token');
    });
  });
});
