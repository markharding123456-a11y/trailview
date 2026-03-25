import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ElevationChart from '@/app/components/elevation-chart';

describe('ElevationChart', () => {
  const defaultProps = {
    elevations: [100, 150, 200, 180, 220],
    currentIndex: 2,
    minEle: 100,
    maxEle: 220,
    totalDistanceKm: 5.0,
    difficulty: 'blue' as const,
  };

  it('renders an SVG element', () => {
    const { container } = render(<ElevationChart {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with provided elevation data', () => {
    render(<ElevationChart {...defaultProps} />);
    // Check that min/max elevation labels are displayed
    expect(screen.getByText('220m')).toBeInTheDocument();
    expect(screen.getByText('100m')).toBeInTheDocument();
    expect(screen.getByText('5 km')).toBeInTheDocument();
  });
});
