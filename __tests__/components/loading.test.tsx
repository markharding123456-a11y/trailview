import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from '@/app/components/loading';

describe('Loading', () => {
  it('renders with default "Loading..." text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text prop', () => {
    render(<Loading text="Fetching trails..." />);
    expect(screen.getByText('Fetching trails...')).toBeInTheDocument();
  });
});
