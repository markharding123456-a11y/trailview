import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('name=TestUser'),
}));

vi.mock('@/lib/supabase', () => ({
  getTrails: vi.fn().mockResolvedValue([]),
  supabase: { from: vi.fn() },
}));

describe('Contributor page', () => {
  it('renders "TrailView Contributor" text', async () => {
    const ContributorPage = (await import('@/app/contributor/page')).default;
    render(<ContributorPage />);
    const text = await screen.findByText('TrailView Contributor');
    expect(text).toBeInTheDocument();
  });

  it('loading state shows spinner', async () => {
    const ContributorPage = (await import('@/app/contributor/page')).default;
    const { container } = render(<ContributorPage />);
    // The spinner has animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
