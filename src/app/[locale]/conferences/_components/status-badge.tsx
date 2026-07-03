import { useTranslations } from 'next-intl';

import type { ConferenceStatus } from '@/lib/conferences';

const conferenceStatusStyles: Record<ConferenceStatus, string> = {
  past: 'border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] text-[rgb(var(--ink))]',
  'this-week':
    'border-[rgb(var(--ink))] bg-[rgb(var(--poppy))] text-[rgb(var(--paper))]',
  upcoming:
    'border-[rgb(var(--ink))] bg-[rgb(var(--sky))] text-[rgb(var(--paper))]',
  'far-future':
    'border-[rgb(var(--ink))] bg-[rgb(var(--sun))] text-[rgb(var(--ink))]',
};

export function ConferenceStatusBadge({
  status,
}: {
  status: ConferenceStatus;
}) {
  const t = useTranslations('conferences');
  const label = {
    past: t('statusPast'),
    'this-week': t('statusThisWeek'),
    upcoming: t('statusUpcoming'),
    'far-future': t('statusFarFuture'),
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border-2 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide ${conferenceStatusStyles[status]}`}
    >
      {label}
    </span>
  );
}
