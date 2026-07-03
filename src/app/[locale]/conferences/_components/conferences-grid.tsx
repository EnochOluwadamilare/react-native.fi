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

  const pillClass = (active: boolean) =>
    active
      ? 'rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--ink))] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-[rgb(var(--paper))]'
      : 'rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper))] px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--sun))]';

  return (
    <>
      <div className='mt-8 flex flex-wrap items-center gap-3'>
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
              className={pillClass(region === chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <span className='mx-1 h-5 w-[2px] bg-[rgb(var(--ink))]' />
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
              className={pillClass(format === chip.value)}
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
        <div className='mt-8 rounded-2xl border-[3px] border-dashed border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-8 text-center'>
          <h3 className='font-display text-lg font-bold text-[rgb(var(--ink))]'>
            {t('noConferencesTitle')}
          </h3>
          <p className='mt-2 text-sm font-medium opacity-70'>
            {t('noConferencesDescription')}
          </p>
        </div>
      )}

      {past.length > 0 && (
        <div className='mt-20'>
          <div className='mb-6 flex items-baseline gap-3'>
            <span className='u-num'>02</span>
            <h3 className='font-display text-2xl font-extrabold tracking-tight sm:text-3xl'>
              {t('pastEventsTitle')}
            </h3>
          </div>
          <p className='-mt-3 max-w-[60ch] text-sm font-medium opacity-70'>
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
      className='group relative flex flex-col overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] transition-transform hover:-translate-y-1'
    >
      {conference.ogImage ? (
        <div className='relative aspect-[1200/630] w-full overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))]'>
          <Image
            src={conference.ogImage}
            alt={conference.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        </div>
      ) : (
        <div className='flex aspect-[1200/630] w-full items-center justify-center border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))]'>
          <span className='font-display text-lg font-extrabold opacity-40'>
            {conference.name}
          </span>
        </div>
      )}

      <div className='flex flex-1 flex-col p-6'>
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <ConferenceStatusBadge status={conference.status} />
        </div>

        <h3 className='font-display text-xl font-extrabold leading-tight tracking-tight transition-colors group-hover:text-[rgb(var(--poppy))]'>
          {conference.name}
        </h3>

        <div className='mt-2 font-display text-sm font-bold uppercase tracking-wide opacity-70'>
          ● {conference.location} · {conference.dateDetail}
        </div>

        <p className='mt-3 text-sm font-medium leading-6 opacity-80'>
          {conference.description}
        </p>

        <div className='mt-4 flex flex-wrap gap-2'>
          {conference.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper))] px-2.5 py-0.5 font-display text-xs font-bold'
            >
              {tag}
            </span>
          ))}
        </div>

        <span className='mt-auto pt-5 font-display font-bold text-[rgb(var(--sky))]'>
          {t('officialSite')}{' '}
          <span
            aria-hidden
            className='inline-block transition-transform group-hover:translate-x-1'
          >
            →
          </span>
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
    <div className='rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-5'>
      <div className='flex items-start justify-between gap-2'>
        <h4 className='font-display text-base font-extrabold leading-tight tracking-tight'>
          {conference.name}
        </h4>
        <ConferenceStatusBadge status='past' />
      </div>
      <p className='mt-1 font-display text-xs font-bold uppercase tracking-wide opacity-60'>
        {conference.dateDetail} · {conference.location}
      </p>
      {conference.pastTalksUrl && (
        <a
          href={conference.pastTalksUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-flex items-center gap-1 font-display text-xs font-bold text-[rgb(var(--sky))] hover:text-[rgb(var(--poppy))]'
        >
          {t('watchTalks')} <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
