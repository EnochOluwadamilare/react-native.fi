import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllConferences, getAllMeetups } from '@/lib/conferences';
import { getPastEvents, getUpcomingEvents } from '@/lib/events';

import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';

import { EventCard } from './event-card';

const MEETUP_COLORS = [
  'bg-[rgb(var(--poppy))]',
  'bg-[rgb(var(--sky))]',
  'bg-[rgb(var(--sun))]',
  'bg-[rgb(var(--mint))]',
];

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/events`,
      languages: {
        en: `${siteConfig.url}/en/events`,
        fi: `${siteConfig.url}/fi/events`,
      },
    },
  };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const conferences = getAllConferences();
  const meetups = getAllMeetups();
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
      {/* Bold split hero */}
      <section className='fade-in-up grid grid-cols-1 border-b-[3px] border-[rgb(var(--ink))] lg:grid-cols-[1.15fr_0.85fr]'>
        <div className='px-6 py-16 sm:px-10 lg:py-24 lg:pl-[max(4vw,calc((100vw-1180px)/2))] lg:pr-12'>
          <span className='inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-4 py-1.5 font-display text-sm font-bold'>
            ✿ {t('helsinkiTitle')}
          </span>
          <h1 className='my-6 font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.92] tracking-tight'>
            {t('title')}
          </h1>
          <p className='max-w-[46ch] text-lg font-medium text-[rgb(var(--ink))]/85'>
            {t('description')}
          </p>
          <div className='mt-8'>
            <a
              href='https://meetup.com/react-native-helsinki'
              target='_blank'
              rel='noopener noreferrer'
              className='u-btn u-btn-fill'
            >
              {t('helsinkiJoin')} →
            </a>
          </div>
        </div>

        <div className='relative grid min-h-[280px] place-items-center overflow-hidden border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sky))] lg:border-l-[3px] lg:border-t-0'>
          <PoppyField className='absolute inset-0 h-full w-full opacity-30' />
          <div className='relative grid h-40 w-40 place-items-center rounded-full border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] text-center'>
            <div>
              <span className='block font-display text-4xl font-extrabold leading-none'>
                {upcomingEvents.length || meetups.length}
              </span>
              <span className='mt-1 block font-display text-xs font-bold tracking-[0.1em]'>
                {(upcomingEvents.length
                  ? t('upcoming')
                  : t('meetupsTitle')
                ).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-[1180px] px-6 py-16 lg:px-8'>
        {/* --- 01 Conferences --- */}
        <section>
          <div className='mb-8 flex flex-wrap items-baseline justify-between gap-3'>
            <div className='flex items-baseline gap-3'>
              <span className='u-num'>01</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('conferencesTitle')}
              </h2>
            </div>
            <a
              href={`/${locale}/conferences`}
              className='group font-display font-bold text-[rgb(var(--sky))]'
            >
              {t('conferencesViewAll')}{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1'>
                →
              </span>
            </a>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {conferences.map((conf) => (
              <a
                key={conf.name}
                href={conf.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] transition-transform duration-200 hover:-translate-y-1'
              >
                {conf.ogImage ? (
                  <div className='relative aspect-[1200/630] w-full overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))]'>
                    <Image
                      src={conf.ogImage}
                      alt={conf.name}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='flex aspect-[1200/630] w-full items-center justify-center border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))]'>
                    <span className='font-display text-lg font-bold text-[rgb(var(--ink))]/40'>
                      {conf.name}
                    </span>
                  </div>
                )}

                <div className='p-5'>
                  <span className='mb-3 inline-flex rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sky))] px-3 py-1 font-display text-xs font-bold text-[rgb(var(--paper))]'>
                    {conf.date}
                  </span>
                  <h3 className='font-display text-lg font-bold text-[rgb(var(--ink))] transition-colors group-hover:text-[rgb(var(--poppy))]'>
                    {conf.name}
                  </h3>
                  <div className='mt-1 font-display text-sm font-bold text-[rgb(var(--ink))]/60'>
                    {conf.location}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- 02 Meetup groups worldwide --- */}
        <section className='mt-16 border-t-[3px] border-[rgb(var(--ink))] pt-16'>
          <div className='mb-8 flex items-baseline gap-3'>
            <span className='u-num'>02</span>
            <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
              {t('meetupsTitle')}
            </h2>
          </div>

          <div className='grid gap-6 sm:grid-cols-2'>
            {meetups.map((meetup, i) => (
              <a
                key={meetup.name}
                href={meetup.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-start gap-4 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] p-6 transition-transform duration-200 hover:-translate-y-1'
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[rgb(var(--ink))] font-display text-lg font-extrabold text-[rgb(var(--paper))] ${MEETUP_COLORS[i % MEETUP_COLORS.length]}`}
                >
                  {meetup.name.charAt(0)}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <h3 className='font-display text-lg font-bold text-[rgb(var(--ink))] transition-colors group-hover:text-[rgb(var(--poppy))]'>
                      {meetup.name}
                    </h3>
                    <span className='whitespace-nowrap rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] px-2.5 py-0.5 font-display text-xs font-bold'>
                      {meetup.frequency}
                    </span>
                  </div>
                  <p className='mt-1 font-display text-sm font-bold text-[rgb(var(--ink))]/60'>
                    {meetup.location}
                  </p>
                  <p className='mt-2 text-sm font-medium text-[rgb(var(--ink))]/80'>
                    {meetup.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- 03 React Native Helsinki --- */}
        <section className='mt-16 border-t-[3px] border-[rgb(var(--ink))] pt-16'>
          <div className='mb-8 flex items-baseline gap-3'>
            <span className='u-num'>03</span>
            <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
              {t('helsinkiTitle')}
            </h2>
          </div>

          {upcomingEvents.length > 0 && (
            <div>
              <h3 className='mb-4 font-display text-lg font-extrabold uppercase tracking-wide text-[rgb(var(--poppy))]'>
                {t('upcoming')}
              </h3>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} isUpcoming={true} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className='mt-12'>
              <h3 className='mb-4 font-display text-lg font-extrabold uppercase tracking-wide text-[rgb(var(--ink))]/50'>
                {t('past')}
              </h3>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.slug}
                    event={event}
                    isUpcoming={false}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
