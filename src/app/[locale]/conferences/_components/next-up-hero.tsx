import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { Conference } from '@/lib/conferences';
import { daysBetween, getConferenceStatus } from '@/lib/conferences';

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
    <div className='relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center'>
        {conference.ogImage && (
          <div className='relative aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-[rgb(var(--mono-100))] md:w-64 md:flex-shrink-0'>
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
            <span className='rounded-full bg-[rgb(var(--accent-frost)/0.2)] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--accent-frost))]'>
              {t('nextUpEyebrow')}
            </span>
            <span className='font-mono text-xs font-semibold text-white/70'>
              {timing}
            </span>
          </div>
          <h2 className='mt-3 text-2xl font-bold text-white sm:text-3xl'>
            {conference.name}
          </h2>
          <p className='mt-2 text-sm text-white/70'>
            {conference.dateDetail} · {conference.location}
          </p>
          <div className='mt-5 flex flex-wrap gap-3'>
            <a
              href={conference.ticketsUrl ?? conference.url}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full bg-white px-5 py-2.5 font-mono text-sm font-semibold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg'
            >
              {t('viewDetails')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
