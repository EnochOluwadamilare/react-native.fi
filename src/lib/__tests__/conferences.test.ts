import type { Conference } from '@/data/types';

import {
  daysBetween,
  getConferenceStatus,
  sortConferencesByDate,
} from '../conferences';

const baseConference: Conference = {
  name: 'Test Conf',
  location: 'Helsinki, Finland',
  date: 'May 2026',
  dateDetail: 'May 20-21, 2026',
  startDate: '2026-05-20',
  endDate: '2026-05-21',
  description: 'A test conference.',
  url: 'https://example.com',
  tags: ['React Native'],
  recurring: 'Annual',
  region: 'Europe',
  formats: ['Multi-day'],
};

describe('conference date helpers', () => {
  const now = new Date('2026-05-13T12:00:00.000Z');

  it('calculates whole days remaining with ceiling semantics', () => {
    expect(daysBetween('2026-05-14', now)).toBe(1);
    expect(daysBetween('2026-05-13', now)).toBe(0);
    expect(daysBetween('2026-05-12', now)).toBe(-1);
  });

  it('marks conferences happening within seven days as this week', () => {
    expect(getConferenceStatus(baseConference, now)).toBe('this-week');
  });

  it('keeps a conference active through its end date', () => {
    expect(
      getConferenceStatus(
        {
          ...baseConference,
          startDate: '2026-05-11',
          endDate: '2026-05-13',
        },
        now,
      ),
    ).toBe('this-week');
  });

  it('sorts upcoming conferences first, then past conferences newest first', () => {
    const sorted = sortConferencesByDate(
      [
        {
          ...baseConference,
          name: 'Past older',
          startDate: '2026-03-01',
          endDate: '2026-03-02',
        },
        {
          ...baseConference,
          name: 'Upcoming later',
          startDate: '2026-07-01',
          endDate: '2026-07-02',
        },
        {
          ...baseConference,
          name: 'Upcoming sooner',
          startDate: '2026-06-01',
          endDate: '2026-06-02',
        },
        {
          ...baseConference,
          name: 'Past newer',
          startDate: '2026-04-01',
          endDate: '2026-04-02',
        },
      ],
      now,
    );

    expect(sorted.map((conference) => conference.name)).toEqual([
      'Upcoming sooner',
      'Upcoming later',
      'Past newer',
      'Past older',
    ]);
  });
});
