import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getDeveloperBySlug } from '@/lib/developers';
import { getAllEvents, getEventBySlug } from '@/lib/events';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EventJsonLd } from '@/components/EventJsonLd';

import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale, locales } from '@/i18n/config';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export function generateStaticParams() {
  const events = getAllEvents();
  return locales.flatMap((locale) =>
    events.map((event) => ({
      locale,
      slug: event.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: _locale } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} - React Native Helsinki`,
    description: event.description,
  };
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fi' ? 'fi-FI' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function EventPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('events');
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Create ISO datetime for structured data
  const startDateTime = `${event.date}T${event.startTime}:00`;
  const endDateTime = `${event.date}T${event.endTime}:00`;
  const eventUrl = `${siteConfig.url}/${locale}/events/${slug}`;
  const ogImageUrl = `${siteConfig.url}/${locale}/events/${slug}/opengraph-image`;

  return (
    <>
      <EventJsonLd
        name={event.title}
        description={event.description}
        startDate={startDateTime}
        endDate={endDateTime}
        location={{
          name: event.venue.name,
          address: event.venue.address,
          city: event.venue.city,
        }}
        url={eventUrl}
        imageUrl={ogImageUrl}
        organizer={event.host}
      />
      <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
        {/* Bold color-blocked header */}
        <section className='fade-in-up grid grid-cols-1 border-b-[3px] border-[rgb(var(--ink))] lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='px-6 pb-16 pt-10 sm:px-10 lg:pb-24 lg:pl-[max(4vw,calc((100vw-1180px)/2))] lg:pr-12'>
            <Breadcrumbs
              homeLabel={locale === 'fi' ? 'Etusivu' : 'Home'}
              items={[
                {
                  name: locale === 'fi' ? 'Tapahtumat' : 'Events',
                  href: '/events',
                },
                { name: event.title },
              ]}
            />

            <span
              className={`inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] px-4 py-1.5 font-display text-sm font-bold ${
                event.isPast
                  ? 'bg-[rgb(var(--paper-2))] text-[rgb(var(--ink))]'
                  : 'bg-[rgb(var(--mint))] text-[rgb(var(--paper))]'
              }`}
            >
              ✿{' '}
              {event.isPast
                ? locale === 'fi'
                  ? 'Mennyt tapahtuma'
                  : 'Past Event'
                : t('upcomingBadge')}
            </span>

            <h1 className='my-6 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[0.94] tracking-tight'>
              {event.title}
            </h1>

            <p className='max-w-[52ch] text-lg font-medium text-[rgb(var(--ink))]/85'>
              {event.description}
            </p>

            {!event.isPast && (
              <div className='mt-8'>
                <a
                  href='https://meetup.com/react-native-helsinki'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='u-btn u-btn-fill'
                >
                  {locale === 'fi'
                    ? 'Ilmoittaudu Meetup.comissa'
                    : 'RSVP on Meetup.com'}{' '}
                  →
                </a>
              </div>
            )}
          </div>

          {/* Date / venue meta on a saturated color block */}
          <div className='relative overflow-hidden border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sun))] lg:border-l-[3px] lg:border-t-0'>
            <PoppyField className='pointer-events-none absolute inset-0 h-full w-full opacity-25' />
            <dl className='relative flex h-full flex-col justify-center gap-6 px-6 py-12 sm:px-10'>
              <div>
                <dt className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                  {locale === 'fi' ? 'Päivämäärä' : 'Date'}
                </dt>
                <dd className='mt-1 font-display text-lg font-bold text-[rgb(var(--ink))]'>
                  {formatDate(event.date, locale)}
                </dd>
              </div>
              <div>
                <dt className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                  {locale === 'fi' ? 'Aika' : 'Time'}
                </dt>
                <dd className='mt-1 font-display text-lg font-bold text-[rgb(var(--ink))]'>
                  {event.startTime} – {event.endTime} {event.timezone}
                </dd>
              </div>
              <div>
                <dt className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                  {locale === 'fi' ? 'Sijainti' : 'Location'}
                </dt>
                <dd className='mt-1 font-display text-lg font-bold text-[rgb(var(--ink))]'>
                  {event.venue.name}
                </dd>
                <dd className='font-medium text-[rgb(var(--ink))]/70'>
                  {event.venue.address}
                </dd>
                <dd className='font-medium text-[rgb(var(--ink))]/70'>
                  {event.venue.city}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className='mx-auto max-w-[1180px] px-6 py-16 lg:px-8'>
          {/* --- 01 Talks --- */}
          <section>
            <div className='mb-8 flex items-baseline gap-3'>
              <span className='u-num'>01</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {locale === 'fi' ? 'Esitykset' : 'Talks'}{' '}
                <span className='text-[rgb(var(--ink))]/40'>
                  ({event.talks.length})
                </span>
              </h2>
            </div>

            <div className='grid gap-6'>
              {event.talks.map((talk, index) => {
                const developer = talk.speaker.slug
                  ? getDeveloperBySlug(talk.speaker.slug)
                  : null;

                return (
                  <article
                    key={index}
                    className='rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] p-6 sm:p-8'
                  >
                    <div className='flex flex-wrap items-start gap-3'>
                      <span className='font-display text-2xl font-extrabold text-[rgb(var(--ink))]/25'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className='flex-1'>
                        <h3 className='font-display text-xl font-bold leading-tight tracking-tight text-[rgb(var(--ink))] sm:text-2xl'>
                          {talk.title}
                        </h3>
                        {talk.level && (
                          <span className='mt-3 inline-flex rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sky))] px-3 py-1 font-display text-xs font-bold text-[rgb(var(--paper))]'>
                            {talk.level}
                          </span>
                        )}
                        {talk.description && (
                          <p className='mt-4 text-base font-medium leading-7 text-[rgb(var(--ink))]/80'>
                            {talk.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Speaker */}
                    <div className='mt-6 flex items-center gap-3 border-t-[3px] border-[rgb(var(--ink))] pt-5'>
                      {developer?.imageUrl ? (
                        <img
                          src={developer.imageUrl}
                          alt={talk.speaker.name}
                          className='size-11 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] object-cover'
                        />
                      ) : (
                        <div className='flex size-11 items-center justify-center rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] font-display font-bold text-[rgb(var(--ink))]'>
                          {talk.speaker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        {developer ? (
                          <Link
                            href={`/developers/${developer.slug}`}
                            className='font-display font-bold text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--poppy))]'
                          >
                            {talk.speaker.name}
                          </Link>
                        ) : (
                          <p className='font-display font-bold text-[rgb(var(--ink))]'>
                            {talk.speaker.name}
                          </p>
                        )}
                        <p className='font-display text-xs font-bold uppercase tracking-wide text-[rgb(var(--ink))]/50'>
                          {locale === 'fi' ? 'Puhuja' : 'Speaker'}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* --- 02 Practical info --- */}
          <section className='mt-16 border-t-[3px] border-[rgb(var(--ink))] pt-16'>
            <div className='mb-8 flex items-baseline gap-3'>
              <span className='u-num'>02</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {locale === 'fi' ? 'Käytännön tiedot' : 'Practical Info'}
              </h2>
            </div>

            <div className='rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-6 sm:p-8'>
              <p className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                {locale === 'fi' ? 'Järjestäjä' : 'Hosted by'}
              </p>
              <p className='mt-1 font-display text-2xl font-extrabold tracking-tight text-[rgb(var(--ink))]'>
                {event.host}
              </p>

              {!event.isPast && (
                <div className='mt-6 border-t-[3px] border-[rgb(var(--ink))] pt-6'>
                  <p className='max-w-[54ch] text-base font-medium leading-7 text-[rgb(var(--ink))]/80'>
                    {locale === 'fi'
                      ? 'Ilmoittaudu Meetup.comissa varmistaaksesi paikkasi ja saadaksesi tapahtumatiedotteet.'
                      : 'RSVP on Meetup.com to secure your spot and get event updates.'}
                  </p>
                  <a
                    href='https://meetup.com/react-native-helsinki'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='u-btn u-btn-fill mt-5'
                  >
                    {locale === 'fi'
                      ? 'Ilmoittaudu Meetup.comissa'
                      : 'RSVP on Meetup.com'}{' '}
                    →
                  </a>
                </div>
              )}
            </div>

            <div className='mt-10'>
              <Link
                href='/events'
                className='group font-display font-bold text-[rgb(var(--sky))]'
              >
                <span className='inline-block transition-transform group-hover:-translate-x-1'>
                  ←
                </span>{' '}
                {locale === 'fi'
                  ? 'Takaisin tapahtumiin'
                  : 'Back to all events'}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
