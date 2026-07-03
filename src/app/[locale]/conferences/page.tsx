import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  getAllConferences,
  getAllMeetups,
  getConferencesFaq,
  getConferenceStatus,
  getNextConference,
  sortConferencesByDate,
} from '@/lib/conferences';

import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';

import {
  ConferencesGrid,
  DecoratedConference,
} from './_components/conferences-grid';
import { NextUpHero } from './_components/next-up-hero';

type Props = {
  params: Promise<{ locale: Locale }>;
};

const GITHUB_EDIT_URL =
  'https://github.com/React-Native-Finland/react-native.fi/edit/main/src/data/conferences.json';

const GITHUB_NEW_CONFERENCE_URL =
  'https://github.com/React-Native-Finland/react-native.fi/issues/new?title=Add%20conference%3A%20%5Bname%5D&body=%23%23%20Conference%20details%0A%0A-%20%2A%2AName%2A%2A%3A%20%0A-%20%2A%2ALocation%2A%2A%3A%20%0A-%20%2A%2ADates%2A%2A%3A%20%0A-%20%2A%2AWebsite%2A%2A%3A%20%0A-%20%2A%2AFocus%20%2F%20topics%2A%2A%3A%20%0A-%20%2A%2AAnything%20else%2A%2A%3A%20';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'conferences' });

  const title = t('metaTitle');
  const description = t('metaDescription');
  const url = `${siteConfig.url}/${locale}/conferences`;
  const image = `${siteConfig.url}/images/conferences/app-js-conf.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/conferences`,
      languages: {
        en: `${siteConfig.url}/en/conferences`,
        fi: `${siteConfig.url}/fi/conferences`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: t('heroTitle'),
        },
      ],
      locale: locale === 'fi' ? 'fi_FI' : 'en_US',
      alternateLocale: locale === 'fi' ? 'en_US' : 'fi_FI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
    },
  };
}

export default async function ConferencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'conferences' });

  const allConferences = getAllConferences();
  const sorted = sortConferencesByDate(allConferences);
  const decorated: DecoratedConference[] = sorted.map((conf) => ({
    ...conf,
    status: getConferenceStatus(conf),
  }));
  const nextConference = getNextConference(allConferences);
  const meetups = getAllMeetups();
  const faq = getConferencesFaq(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('heroTitle'),
    description: t('metaDescription'),
    itemListElement: decorated.map((conf, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Event',
        name: conf.name,
        description: conf.description,
        startDate: conf.startDate,
        endDate: conf.endDate,
        eventStatus:
          conf.status === 'past'
            ? 'https://schema.org/EventCompleted'
            : 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: conf.location,
        },
        image: conf.ogImage ? `${siteConfig.url}${conf.ogImage}` : undefined,
        url: conf.url,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        offers: conf.ticketsUrl
          ? {
              '@type': 'Offer',
              url: conf.ticketsUrl,
              availability:
                conf.status === 'past'
                  ? 'https://schema.org/SoldOut'
                  : 'https://schema.org/InStock',
            }
          : undefined,
      },
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
        {/* Hero Section */}
        <section className='relative overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sky))] py-24 text-[rgb(var(--paper))] sm:py-28'>
          <PoppyField className='pointer-events-none absolute inset-0 h-full w-full opacity-30' />

          <div className='relative mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='fade-in-up mx-auto max-w-3xl text-center'>
              <span className='mb-5 inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider text-[rgb(var(--ink))]'>
                ✿ {t('heroEyebrow')}
              </span>
              <h1 className='font-display text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[0.9] tracking-tight'>
                {t('heroTitle')}
              </h1>
              <p className='mt-6 text-lg font-medium leading-8 text-[rgb(var(--paper))]/85'>
                {t('heroDescription')}
              </p>
              <div className='mt-8 flex flex-wrap justify-center gap-3'>
                <a
                  href='#conferences'
                  className='u-btn border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--sun))] hover:!bg-[rgb(var(--sun))]'
                >
                  {t('viewConferences')} →
                </a>
                <a
                  href='#submit'
                  className='u-btn border-[rgb(var(--paper))] text-[rgb(var(--paper))] hover:!bg-[rgb(var(--paper))] hover:!text-[rgb(var(--ink))]'
                >
                  {t('submitConference')}
                </a>
              </div>
            </div>

            {nextConference && <NextUpHero conference={nextConference} />}
          </div>
        </section>

        {/* Main Conferences */}
        <section id='conferences' className='py-20 sm:py-28'>
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='mb-4 flex items-baseline gap-3'>
              <span className='u-num'>01</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('majorEventsTitle')}
              </h2>
            </div>
            <p className='max-w-[60ch] text-lg font-medium opacity-80'>
              {t('majorEventsDescription')}
            </p>

            <ConferencesGrid conferences={decorated} />
          </div>
        </section>

        {/* Read the guide callout */}
        <section className='border-y-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] py-16'>
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <Link
              href='/articles/react-native-conferences-2026'
              className='group flex flex-col items-start justify-between gap-4 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] p-6 transition-transform hover:-translate-y-1 sm:flex-row sm:items-center'
            >
              <div>
                <h3 className='font-display text-lg font-bold transition-colors group-hover:text-[rgb(var(--poppy))]'>
                  {t('readGuide')}
                </h3>
                <p className='mt-1 text-sm font-medium opacity-70'>
                  {t('readGuideDescription')}
                </p>
              </div>
              <span className='inline-flex items-center gap-2 font-display font-bold text-[rgb(var(--sky))]'>
                {t('readGuide')}{' '}
                <span
                  aria-hidden
                  className='inline-block transition-transform group-hover:translate-x-1'
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* Submit a conference */}
        <section
          id='submit'
          className='bg-[rgb(var(--paper-2))] py-20 sm:py-28'
        >
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='mb-4 flex items-baseline gap-3'>
              <span className='u-num'>03</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('submitSectionTitle')}
              </h2>
            </div>
            <p className='max-w-[60ch] text-lg font-medium opacity-80'>
              {t('submitSectionDescription')}
            </p>

            <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
              <a
                href={GITHUB_NEW_CONFERENCE_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='u-btn u-btn-fill'
              >
                {t('submitViaIssue')} →
              </a>
              <a
                href={GITHUB_EDIT_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='u-btn u-btn-out'
              >
                {t('submitViaPr')} →
              </a>
            </div>
            <p className='mt-4 text-sm font-medium opacity-60'>
              {t('submitHint')}
            </p>
          </div>
        </section>

        {/* Why Attend Section */}
        <section className='border-t-[3px] border-[rgb(var(--ink))] py-20 sm:py-28'>
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='mb-4 flex items-baseline gap-3'>
              <span className='u-num'>04</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('whyAttendTitle')}
              </h2>
            </div>
            <p className='max-w-[60ch] text-lg font-medium opacity-80'>
              {t('whyAttendDescription')}
            </p>

            <div className='mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
              {(
                [
                  {
                    key: 'learn',
                    icon: (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    ),
                  },
                  {
                    key: 'network',
                    icon: (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    ),
                  },
                  {
                    key: 'workshops',
                    icon: (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                      />
                    ),
                  },
                  {
                    key: 'earlyAccess',
                    icon: (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    ),
                  },
                ] as const
              ).map((item, i) => {
                const tileColors = [
                  'bg-[rgb(var(--poppy))] text-[rgb(var(--paper))]',
                  'bg-[rgb(var(--sky))] text-[rgb(var(--paper))]',
                  'bg-[rgb(var(--mint))] text-[rgb(var(--paper))]',
                  'bg-[rgb(var(--sun))] text-[rgb(var(--ink))]',
                ];
                return (
                  <div
                    key={item.key}
                    className='rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] p-6'
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[rgb(var(--ink))] ${tileColors[i % tileColors.length]}`}
                    >
                      <svg
                        className='h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        {item.icon}
                      </svg>
                    </div>
                    <h3 className='mt-4 font-display text-lg font-bold'>
                      {t(`whyAttend.${item.key}.title`)}
                    </h3>
                    <p className='mt-2 text-sm font-medium opacity-80'>
                      {t(`whyAttend.${item.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Community Meetups */}
        <section className='border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] py-20 sm:py-28'>
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='mb-4 flex items-baseline gap-3'>
              <span className='u-num'>05</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('meetupsTitle')}
              </h2>
            </div>
            <p className='max-w-[60ch] text-lg font-medium opacity-80'>
              {t('meetupsDescription')}
            </p>

            <div className='mt-10 grid gap-5 md:grid-cols-2'>
              {meetups.map((meetup) => (
                <a
                  key={meetup.name}
                  href={meetup.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-start gap-4 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] p-6 transition-transform hover:-translate-y-1'
                >
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sky))] text-[rgb(var(--paper))]'>
                    <svg
                      className='h-6 w-6'
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
                    <div className='flex items-center justify-between gap-2'>
                      <h3 className='font-display text-lg font-bold transition-colors group-hover:text-[rgb(var(--poppy))]'>
                        {meetup.name}
                      </h3>
                      <span className='whitespace-nowrap rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-2.5 py-0.5 font-display text-xs font-bold'>
                        {meetup.frequency}
                      </span>
                    </div>
                    <p className='mt-1 font-display text-sm font-bold uppercase tracking-wide opacity-60'>
                      {meetup.location}
                    </p>
                    <p className='mt-2 text-sm font-medium opacity-80'>
                      {meetup.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className='border-t-[3px] border-[rgb(var(--ink))] py-20 sm:py-28'>
          <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
            <div className='mb-8 flex items-baseline gap-3'>
              <span className='u-num'>06</span>
              <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {t('faqTitle')}
              </h2>
            </div>
            <dl className='border-b-2 border-[rgb(var(--ink))]'>
              {faq.map((item) => (
                <div
                  key={item.question}
                  className='border-t-2 border-[rgb(var(--ink))] py-5'
                >
                  <dt className='font-display text-lg font-bold'>
                    {item.question}
                  </dt>
                  <dd className='mt-2 font-medium opacity-80'>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA Section */}
        <section className='border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] py-20 text-[rgb(var(--paper))] sm:py-28'>
          <div className='mx-auto max-w-[1180px] px-6 text-center lg:px-8'>
            <h2 className='mx-auto max-w-3xl text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl'>
              {t('ctaTitle')}
            </h2>
            <p className='mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-[rgb(var(--paper))]/70'>
              {t('ctaDescription')} {t('ctaMissingConference')}{' '}
              <a
                href={GITHUB_EDIT_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='font-bold text-[rgb(var(--sun))] underline hover:text-[rgb(var(--paper))]'
              >
                {t('ctaAddOnGithub')}
              </a>
              .
            </p>
            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <a
                href='https://meetup.com/react-native-helsinki'
                target='_blank'
                rel='noopener noreferrer'
                className='u-btn border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--poppy))] hover:!bg-[rgb(var(--poppy))] hover:!text-[rgb(var(--paper))]'
              >
                {t('joinMeetup')} →
              </a>
              <Link
                href='/events'
                className='u-btn border-[rgb(var(--paper))] text-[rgb(var(--paper))] hover:!bg-[rgb(var(--paper))] hover:!text-[rgb(var(--ink))]'
              >
                {t('seePastEvents')} →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
