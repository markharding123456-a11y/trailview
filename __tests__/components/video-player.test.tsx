import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VideoPlayer from '@/app/components/video-player';

describe('VideoPlayer', () => {
  const defaultProps = {
    videoUrl: 'https://example.com/video.mp4',
    isDemo: false,
    isPlaying: false,
    videoReady: true,
    progress: 0.5,
    speed: 12.5,
    currentElevation: 850,
    distanceCovered: '2.5',
    totalDistanceKm: 5.0,
    elapsedMin: 1,
    elapsedSecRem: 30,
    totalMin: 3,
    totalSecRem: 0,
    hasCoords: true,
    onPlayPause: vi.fn(),
    onScrub: vi.fn(),
  };

  it('renders a video element', () => {
    render(<VideoPlayer {...defaultProps} />);
    const video = screen.getByLabelText('Trail video player');
    expect(video).toBeInTheDocument();
    expect(video.tagName.toLowerCase()).toBe('video');
  });

  it('play/pause button renders', () => {
    render(<VideoPlayer {...defaultProps} />);
    const button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();
  });

  it('HUD displays speed, elevation, distance values', () => {
    render(<VideoPlayer {...defaultProps} />);
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Elevation')).toBeInTheDocument();
    expect(screen.getByText('Distance')).toBeInTheDocument();
  });
});
