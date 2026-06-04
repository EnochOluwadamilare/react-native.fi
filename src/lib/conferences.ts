import { z } from 'zod';

import conferencesData from '@/data/conferences.json';
import conferencesFaqData from '@/data/conferences-faq.json';
import meetupsData from '@/data/meetups.json';
import { Conference, Meetup } from '@/data/types';

import type { Locale } from '@/i18n/config';

export type { Conference, Meetup };

export interface ConferenceFaq {
  question: string;
  answer: string;
}

export type ConferenceStatus = 'past' | 'this-week' | 'upcoming' | 'far-future';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const conferenceSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  dateDetail: z.string().min(1),
  startDate: dateSchema,
  endDate: dateSchema,
  description: z.string().min(1),
  url: z.string().url(),
  tags: z.array(z.string().min(1)),
  recurring: z.string().min(1),
  region: z.enum(['Europe', 'US', 'UK', 'Asia']),
  formats: z.array(
    z.enum([
      'Single-track',
      'Multi-track',
      'Workshops',
      'One-day',
      'Multi-day',
    ]),
  ),
  ticketsUrl: z.string().url().optional(),
  priceRange: z.string().optional(),
  pastTalksUrl: z.string().url().optional(),
  discountCode: z.string().optional(),
  ogImage: z.string().optional(),
});

const meetupSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  frequency: z.string().min(1),
});

const conferenceFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const conferences = z.array(conferenceSchema).parse(conferencesData);
const meetups = z.array(meetupSchema).parse(meetupsData);
const conferencesFaq = z
  .object({
    en: z.array(conferenceFaqSchema),
    fi: z.array(conferenceFaqSchema),
  })
  .parse(conferencesFaqData);

export function getAllConferences(): Conference[] {
  return conferences;
}

export function getAllMeetups(): Meetup[] {
  return meetups;
}

export function getConferencesFaq(locale: Locale): ConferenceFaq[] {
  return conferencesFaq[locale];
}

export function daysBetween(target: string, now: Date = new Date()): number {
  const targetDate = new Date(target);
  const days = Math.ceil((targetDate.getTime() - now.getTime()) / MS_PER_DAY);
  return Object.is(days, -0) ? 0 : days;
}

export function getConferenceStatus(
  conf: Conference,
  now: Date = new Date(),
): ConferenceStatus {
  const end = new Date(conf.endDate);
  if (end.getTime() < now.getTime() - MS_PER_DAY) {
    return 'past';
  }
  const daysToStart = daysBetween(conf.startDate, now);
  if (daysToStart <= 7) return 'this-week';
  if (daysToStart <= 60) return 'upcoming';
  return 'far-future';
}

export function sortConferencesByDate(
  conferences: Conference[],
  now: Date = new Date(),
): Conference[] {
  const upcoming: Conference[] = [];
  const past: Conference[] = [];
  for (const conf of conferences) {
    if (getConferenceStatus(conf, now) === 'past') {
      past.push(conf);
    } else {
      upcoming.push(conf);
    }
  }
  upcoming.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
  past.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
  return [...upcoming, ...past];
}

export function getNextConference(
  conferences: Conference[],
  now: Date = new Date(),
): Conference | null {
  const upcoming = conferences
    .filter((c) => getConferenceStatus(c, now) !== 'past')
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  return upcoming[0] ?? null;
}
