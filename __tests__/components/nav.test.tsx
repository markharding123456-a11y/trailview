import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Nav from '@/app/components/nav';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Nav', () => {
  it('renders the TRAILVIEW logo text', () => {
    render(<Nav />);
    expect(screen.getByText('TRAILVIEW')).toBeInTheDocument();
  });

  it('renders desktop nav links', () => {
    render(<Nav />);
    expect(screen.getAllByText('How It Works').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Activities').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contribute').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Upload').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Explore').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThanOrEqual(1);
  });

  it('hamburger button exists and is accessible', () => {
    render(<Nav />);
    const button = screen.getByRole('button', { name: /open menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
