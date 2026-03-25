import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '@/app/not-found';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('NotFound (404 page)', () => {
  it('renders "Trail Not Found" heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /trail not found/i })).toBeInTheDocument();
  });

  it('renders "Back to Home" and "Explore Trails" links', () => {
    render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const exploreLink = screen.getByRole('link', { name: /explore trails/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute('href', '/explore');
  });
});
