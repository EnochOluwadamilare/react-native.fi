import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { Conference } from '@/lib/conferences';
import { daysBetween, getConferenceStatus } from '@/lib/conferences';

import { PoppyField } from '@/app/components/Poppy';

export function NextUpHero({ conference }: { conference: Conference }) {
  const t = useTranslations('conferences');
  const status = getConferenceStatus(conference);
  const days = daysBetween(conference.startDate);

  let timing: string;
  if (status === 'this-week' && days <= 0) {
    timing = t('nextUpHappeningNow');
  } else if (status === 'this-week') {
    timing = t('nextUpThisWeek');
  } else {
    timing = t('nextUpDaysAway', { count: Math.max(days, 0) });
  }

  return (
    <div className='fade-in-up relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--poppy))] text-[rgb(var(--paper))]'>
      <PoppyField className='pointer-events-none absolute inset-0 h-full w-full opacity-40' />
      <div className='relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8'>
        {conference.ogImage && (
          <div className='relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] md:w-64 md:flex-shrink-0'>
            <Image
              src={conference.ogImage}
              alt={conference.name}
              fill
              sizes='(max-width: 768px) 100vw, 256px'
              className='object-cover'
            />
          </div>
        )}
        <div className='flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-[rgb(var(--ink))]'>
              ✿ {t('nextUpEyebrow')}
            </span>
            <span className='font-display text-xs font-bold uppercase tracking-wider text-[rgb(var(--paper))]/90'>
              {timing}
            </span>
          </div>
          <h2 className='mt-4 font-display text-3xl font-extrabold leading-[0.95] tracking-tight sm:text-4xl'>
            {conference.name}
          </h2>
          <p className='mt-3 font-display text-sm font-bold uppercase tracking-wide text-[rgb(var(--paper))]/90'>
            {conference.dateDetail} · {conference.location}
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <a
              href={conference.ticketsUrl ?? conference.url}
              target='_blank'
              rel='noopener noreferrer'
              className='u-btn border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--sun))] hover:!bg-[rgb(var(--sun))]'
            >
              {t('viewDetails')} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
