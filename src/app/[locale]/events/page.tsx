import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllConferences, getAllMeetups } from '@/lib/conferences';
import { getPastEvents, getUpcomingEvents } from '@/lib/events';

import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';

import { EventCard } from './event-card';

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
    <div className='bg-white'>
      {/* Hero Image */}
      <div className='relative h-64 w-full sm:h-80 lg:h-96'>
        <Image
          src='/images/events.jpg'
          alt={t('heroAlt')}
          fill
          sizes='100vw'
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-white' />
      </div>

      <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:mx-0'>
          <h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
            {t('title')}
          </h1>
          <p className='mt-6 text-lg text-gray-600'>{t('description')}</p>
        </div>

        {/* --- Section 1: Conferences --- */}
        <section className='mt-16'>
          <div className='flex items-end justify-between'>
            <div>
              <span className='eyebrow mb-3 block'>
                {t('conferencesTitle')}
              </span>
              <h2 className='text-2xl font-semibold text-[rgb(var(--mono-900))]'>
                {t('conferencesDescription')}
              </h2>
            </div>
          </div>

          <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {conferences.map((conf) => (
              <a
                key={conf.name}
                href={conf.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group overflow-hidden rounded-2xl border border-[rgb(var(--mono-200))] bg-white transition-all duration-300 hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-xl'
              >
                {/* OG Image */}
                {conf.ogImage ? (
                  <div className='relative aspect-[1200/630] w-full overflow-hidden bg-[rgb(var(--mono-100))]'>
                    <Image
                      src={conf.ogImage}
                      alt={conf.name}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                    />
                  </div>
                ) : (
                  <div className='flex aspect-[1200/630] w-full items-center justify-center bg-[rgb(var(--mono-100))]'>
                    <span className='text-lg font-bold text-[rgb(var(--mono-300))]'>
                      {conf.name}
                    </span>
                  </div>
                )}

                <div className='p-5'>
                  <div className='mb-3 flex items-center justify-between'>
                    <span className='rounded-full bg-[rgb(var(--finnish-blue)/0.1)] px-3 py-1 font-mono text-xs font-semibold text-[rgb(var(--finnish-blue))]'>
                      {conf.date}
                    </span>
                  </div>

                  <h3 className='text-lg font-bold text-[rgb(var(--mono-900))] group-hover:text-[rgb(var(--finnish-blue))]'>
                    {conf.name}
                  </h3>

                  <div className='mt-1 flex items-center gap-2 text-sm text-[rgb(var(--mono-500))]'>
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
                    {conf.location}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className='mt-8 text-center'>
            <a
              href={`/${locale}/conferences`}
              className='inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--finnish-blue))] hover:underline'
            >
              {t('conferencesViewAll')}
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
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </a>
          </div>
        </section>

        {/* --- Section 2: Meetup Groups Worldwide --- */}
        <section className='mt-16 border-t border-gray-200 pt-16'>
          <span className='eyebrow mb-3 block'>{t('meetupsTitle')}</span>
          <h2 className='text-2xl font-semibold text-[rgb(var(--mono-900))]'>
            {t('meetupsDescription')}
          </h2>

          <div className='mt-8 grid gap-6 sm:grid-cols-2'>
            {meetups.map((meetup) => (
              <a
                key={meetup.name}
                href={meetup.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-start gap-4 rounded-xl border border-[rgb(var(--mono-200))] bg-white p-6 transition-all hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-lg'
              >
                <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--mono-100))] transition-colors group-hover:bg-[rgb(var(--finnish-blue))]'>
                  <svg
                    className='h-6 w-6 text-[rgb(var(--mono-600))] transition-colors group-hover:text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-[rgb(var(--mono-900))] group-hover:text-[rgb(var(--finnish-blue))]'>
                      {meetup.name}
                    </h3>
                    <span className='rounded-full bg-[rgb(var(--mono-100))] px-2 py-0.5 text-xs font-medium text-[rgb(var(--mono-600))]'>
                      {meetup.frequency}
                    </span>
                  </div>
                  <p className='mt-1 text-sm text-[rgb(var(--mono-500))]'>
                    {meetup.location}
                  </p>
                  <p className='mt-2 text-sm text-[rgb(var(--mono-600))]'>
                    {meetup.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- Section 3: React Native Helsinki --- */}
        <section className='mt-16 border-t border-gray-200 pt-16'>
          <div className='flex items-end justify-between'>
            <div>
              <span className='eyebrow mb-3 block'>{t('helsinkiTitle')}</span>
              <h2 className='text-2xl font-semibold text-[rgb(var(--mono-900))]'>
                {t('helsinkiDescription')}
              </h2>
            </div>
            <a
              href='https://meetup.com/react-native-helsinki'
              target='_blank'
              rel='noopener noreferrer'
              className='btn-primary hidden items-center gap-2 rounded-full px-6 py-2.5 text-sm sm:inline-flex'
            >
              {t('helsinkiJoin')}
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
            </a>
          </div>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('upcoming')}
              </h3>
              <div className='mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} isUpcoming={true} />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className='mt-12'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('past')}
              </h3>
              <div className='mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
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

          {/* Mobile CTA for Meetup.com */}
          <div className='mt-8 text-center sm:hidden'>
            <a
              href='https://meetup.com/react-native-helsinki'
              target='_blank'
              rel='noopener noreferrer'
              className='btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm'
            >
              {t('helsinkiJoin')}
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
