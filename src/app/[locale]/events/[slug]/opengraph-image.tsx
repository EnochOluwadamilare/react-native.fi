import { getEventBySlug } from '@/lib/events';
import { generateBlueprintOgImage } from '@/lib/og-helper';

import { Locale } from '@/i18n/config';

export const runtime = 'edge';
export const alt = 'Event';
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  const title = event
    ? event.title
    : slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  const formattedDate = event
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return generateBlueprintOgImage(
    title,
    slug,
    'MEETUP',
    undefined,
    event
      ? {
          date: formattedDate,
          venue: event.venue.name,
          city: event.venue.city,
        }
      : undefined,
  );
}
