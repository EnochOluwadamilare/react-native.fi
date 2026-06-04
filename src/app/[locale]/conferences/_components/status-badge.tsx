import { useTranslations } from 'next-intl';

import type { ConferenceStatus } from '@/lib/conferences';

const conferenceStatusStyles: Record<ConferenceStatus, string> = {
  past: 'bg-[rgb(var(--mono-100))] text-[rgb(var(--mono-500))]',
  'this-week':
    'bg-[rgb(var(--accent-frost)/0.15)] text-[rgb(var(--navy-950))] ring-1 ring-[rgb(var(--accent-frost)/0.5)]',
  upcoming: 'bg-[rgb(var(--finnish-blue)/0.1)] text-[rgb(var(--finnish-blue))]',
  'far-future': 'bg-[rgb(var(--mono-100))] text-[rgb(var(--mono-600))]',
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
      className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${conferenceStatusStyles[status]}`}
    >
      {label}
    </span>
  );
}
