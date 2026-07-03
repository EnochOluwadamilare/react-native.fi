'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import { Event } from '@/lib/events';

import { Link } from '@/i18n/navigation';

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fi' ? 'fi-FI' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function EventCard({
  event,
  isUpcoming,
}: {
  event: Event;
  isUpcoming: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations('events');

  return (
    <Link
      href={`/events/${event.slug}`}
      className='group relative flex flex-col overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] transition-transform duration-200 hover:-translate-y-1'
    >
      {/* OG Image */}
      <div className='relative aspect-[1200/630] overflow-hidden border-b-[3px] border-[rgb(var(--ink))]'>
        <Image
          src={`/${locale}/events/${event.slug}/opengraph-image`}
          alt={event.title}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='bg-[rgb(var(--paper-2))] object-cover'
          placeholder='blur'
          blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0Y0RjFFOCIvPjwvc3ZnPg=='
        />
        {isUpcoming && (
          <span className='absolute left-3 top-3 z-10 inline-flex items-center rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--mint))] px-3 py-1 font-display text-xs font-bold text-[rgb(var(--paper))]'>
            {t('upcomingBadge')}
          </span>
        )}
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='font-display text-xl font-bold leading-tight tracking-tight text-[rgb(var(--ink))] transition-colors group-hover:text-[rgb(var(--poppy))]'>
          {event.title}
        </h3>
        <div className='mt-3 flex flex-col gap-1.5 font-display text-xs font-bold tracking-wide text-[rgb(var(--ink))]/70'>
          <span>{formatDate(event.date, locale)}</span>
          <span className='font-medium text-[rgb(var(--ink))]/60'>
            {event.venue.name}, {event.venue.city}
          </span>
        </div>
        <div className='mt-auto flex items-center gap-2 pt-4 font-display text-xs font-bold text-[rgb(var(--ink))]/70'>
          <span className='text-[rgb(var(--poppy))]'>●</span>
          {t('talks', { count: event.talks.length })}
        </div>
      </div>
    </Link>
  );
}
