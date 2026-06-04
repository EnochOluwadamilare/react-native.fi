'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import type { Conference, ConferenceStatus } from '@/lib/conferences';

import { ConferenceStatusBadge } from './status-badge';

export interface DecoratedConference extends Conference {
  status: ConferenceStatus;
}

type RegionFilter = 'all' | 'Europe' | 'US' | 'UK';
type FormatFilter = 'all' | 'Workshops' | 'Single-track' | 'One-day';

export function ConferencesGrid({
  conferences,
}: {
  conferences: DecoratedConference[];
}) {
  const t = useTranslations('conferences');
  const [region, setRegion] = useState<RegionFilter>('all');
  const [format, setFormat] = useState<FormatFilter>('all');

  const upcoming = useMemo(
    () => conferences.filter((c) => c.status !== 'past'),
    [conferences],
  );
  const past = useMemo(
    () => conferences.filter((c) => c.status === 'past'),
    [conferences],
  );

  const filteredUpcoming = useMemo(() => {
    return upcoming.filter((c) => {
      if (region !== 'all' && c.region !== region) return false;
      if (format !== 'all' && !c.formats.includes(format)) return false;
      return true;
    });
  }, [upcoming, region, format]);

  const regionChips: { value: RegionFilter; label: string }[] = [
    { value: 'all', label: t('filterAll') },
    { value: 'Europe', label: t('filterEurope') },
    { value: 'US', label: t('filterUS') },
    { value: 'UK', label: t('filterUK') },
  ];

  const formatChips: { value: FormatFilter; label: string }[] = [
    { value: 'all', label: t('filterFormatAll') },
    { value: 'Workshops', label: t('filterWorkshops') },
    { value: 'Single-track', label: t('filterSingleTrack') },
    { value: 'One-day', label: t('filterOneDay') },
  ];

  return (
    <>
      <div className='mt-8 flex flex-wrap items-center gap-2'>
        <div
          className='flex flex-wrap gap-2'
          role='group'
          aria-label={t('filterRegionLabel')}
        >
          {regionChips.map((chip) => (
            <button
              key={chip.value}
              type='button'
              aria-pressed={region === chip.value}
              onClick={() => setRegion(chip.value)}
              className={
                region === chip.value
                  ? 'rounded-full bg-[rgb(var(--navy-950))] px-3 py-1.5 font-mono text-xs font-semibold text-white'
                  : 'rounded-full border border-[rgb(var(--mono-200))] bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[rgb(var(--mono-700))] hover:border-[rgb(var(--mono-300))]'
              }
            >
              {chip.label}
            </button>
          ))}
        </div>
        <span className='mx-2 h-4 w-px bg-[rgb(var(--mono-200))]' />
        <div
          className='flex flex-wrap gap-2'
          role='group'
          aria-label={t('filterFormatLabel')}
        >
          {formatChips.map((chip) => (
            <button
              key={chip.value}
              type='button'
              aria-pressed={format === chip.value}
              onClick={() => setFormat(chip.value)}
              className={
                format === chip.value
                  ? 'rounded-full bg-[rgb(var(--navy-950))] px-3 py-1.5 font-mono text-xs font-semibold text-white'
                  : 'rounded-full border border-[rgb(var(--mono-200))] bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[rgb(var(--mono-700))] hover:border-[rgb(var(--mono-300))]'
              }
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredUpcoming.map((conf) => (
          <ConferenceCard key={conf.name} conference={conf} />
        ))}
      </div>

      {filteredUpcoming.length === 0 && (
        <div className='mt-8 rounded-2xl border border-dashed border-[rgb(var(--mono-300))] bg-[rgb(var(--mono-50))] p-8 text-center'>
          <h3 className='text-lg font-semibold text-[rgb(var(--mono-900))]'>
            {t('noConferencesTitle')}
          </h3>
          <p className='mt-2 text-sm text-[rgb(var(--mono-600))]'>
            {t('noConferencesDescription')}
          </p>
        </div>
      )}

      {past.length > 0 && (
        <div className='mt-20'>
          <h3 className='text-xl font-bold text-[rgb(var(--mono-900))]'>
            {t('pastEventsTitle')}
          </h3>
          <p className='mt-2 text-sm text-[rgb(var(--mono-600))]'>
            {t('pastEventsDescription')}
          </p>
          <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {past.map((conf) => (
              <PastConferenceCard key={conf.name} conference={conf} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ConferenceCard({ conference }: { conference: DecoratedConference }) {
  const t = useTranslations('conferences');

  return (
    <a
      href={conference.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group relative flex flex-col overflow-hidden rounded-2xl border border-[rgb(var(--mono-200))] bg-white transition-all duration-300 hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-xl'
    >
      {conference.ogImage ? (
        <div className='relative aspect-[1200/630] w-full overflow-hidden bg-[rgb(var(--mono-100))]'>
          <Image
            src={conference.ogImage}
            alt={conference.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        </div>
      ) : (
        <div className='flex aspect-[1200/630] w-full items-center justify-center bg-[rgb(var(--mono-100))]'>
          <span className='text-lg font-bold text-[rgb(var(--mono-300))]'>
            {conference.name}
          </span>
        </div>
      )}

      <div className='flex flex-1 flex-col p-6'>
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <ConferenceStatusBadge status={conference.status} />
        </div>

        <h3 className='text-xl font-bold text-[rgb(var(--mono-900))] group-hover:text-[rgb(var(--finnish-blue))]'>
          {conference.name}
        </h3>

        <div className='mt-2 flex items-center gap-2 text-sm text-[rgb(var(--mono-500))]'>
          <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
          {conference.location} · {conference.dateDetail}
        </div>

        <p className='mt-3 text-sm leading-6 text-[rgb(var(--mono-600))]'>
          {conference.description}
        </p>

        <div className='mt-4 flex flex-wrap gap-2'>
          {conference.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full bg-[rgb(var(--mono-100))] px-2 py-0.5 text-xs font-medium text-[rgb(var(--mono-600))]'
            >
              {tag}
            </span>
          ))}
        </div>

        <span className='mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--finnish-blue))]'>
          {t('officialSite')} <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </a>
  );
}

function PastConferenceCard({
  conference,
}: {
  conference: DecoratedConference;
}) {
  const t = useTranslations('conferences');
  return (
    <div className='rounded-xl border border-[rgb(var(--mono-200))] bg-white p-5'>
      <div className='flex items-center justify-between'>
        <h4 className='font-semibold text-[rgb(var(--mono-900))]'>
          {conference.name}
        </h4>
        <ConferenceStatusBadge status='past' />
      </div>
      <p className='mt-1 text-xs text-[rgb(var(--mono-500))]'>
        {conference.dateDetail} · {conference.location}
      </p>
      {conference.pastTalksUrl && (
        <a
          href={conference.pastTalksUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-flex items-center gap-1 text-xs font-medium text-[rgb(var(--finnish-blue))] hover:underline'
        >
          {t('watchTalks')} <span aria-hidden>&rarr;</span>
        </a>
      )}
    </div>
  );
}
