import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/lib/supabase', () => ({
  getTrails: vi.fn().mockResolvedValue([]),
  supabase: { from: vi.fn() },
}));

describe('Leaderboard page', () => {
  it('renders "Leaderboard" heading', async () => {
    const LeaderboardPage = (await import('@/app/leaderboard/page')).default;
    render(<LeaderboardPage />);
    const heading = await screen.findByText('TrailView Leaderboard');
    expect(heading).toBeInTheDocument();
  });

  it('loading state shows spinner', async () => {
    const LeaderboardPage = (await import('@/app/leaderboard/page')).default;
    const { container } = render(<LeaderboardPage />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
