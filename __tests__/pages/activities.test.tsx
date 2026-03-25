import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActivitiesPage from '@/app/activities/page';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const allActivities = [
  'Mountain Biking',
  'Motorcycle',
  'ATV/UTV',
  'Skiing/Snowboarding',
  'Snowmobile',
  'Hiking',
  'Hunting',
  'Camping/Overlanding',
  'Horseback Riding',
  'Fishing',
  'Cross-Country Skiing',
  'Snowshoeing',
  'Rock Climbing',
];

describe('Activities page', () => {
  it('renders all 13 activity types', () => {
    render(<ActivitiesPage />);
    for (const activity of allActivities) {
      expect(screen.getByText(activity)).toBeInTheDocument();
    }
  });

  it('renders activity descriptions', () => {
    render(<ActivitiesPage />);
    // Spot-check a few descriptions
    expect(
      screen.getByText(/Singletrack, flow trails, and bike park descents/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Backcountry logging roads, technical singletrack/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Approach trails and beta for BC/)
    ).toBeInTheDocument();
  });
});
