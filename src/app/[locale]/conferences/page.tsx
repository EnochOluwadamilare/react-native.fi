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

      <div className='bg-white'>
        {/* Hero Section */}
        <section className='relative overflow-hidden bg-[rgb(var(--navy-950))] py-24 sm:py-28'>
          <div className='absolute inset-0'>
            <div
              className='absolute left-1/4 top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-20 blur-[100px]'
              style={{
                background:
                  'radial-gradient(circle, rgb(var(--finnish-blue)) 0%, transparent 70%)',
              }}
            />
            <div
              className='absolute right-0 bottom-0 h-[400px] w-[400px] translate-y-1/2 rounded-full opacity-15 blur-[80px]'
              style={{
                background:
                  'radial-gradient(circle, rgb(var(--accent-frost)) 0%, transparent 70%)',
              }}
            />
          </div>

          <div
            className='absolute inset-0 opacity-[0.02]'
            style={{
              backgroundImage: `
                linear-gradient(rgb(255 255 255) 1px, transparent 1px),
                linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />

          <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl text-center'>
              <span className='mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--accent-frost))]'>
                {t('heroEyebrow')}
              </span>
              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
                {t('heroTitle')}
              </h1>
              <p className='mt-6 text-lg leading-8 text-white/70'>
                {t('heroDescription')}
              </p>
              <div className='mt-8 flex flex-wrap justify-center gap-4'>
                <a
                  href='#conferences'
                  className='rounded-full bg-white px-6 py-3 font-mono text-sm font-semibold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg'
                >
                  {t('viewConferences')}
                </a>
                <a
                  href='#submit'
                  className='rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10'
                >
                  {t('submitConference')}
                </a>
              </div>
            </div>

            {nextConference && <NextUpHero conference={nextConference} />}
          </div>
        </section>

        {/* Main Conferences */}
        <section id='conferences' className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <span className='eyebrow mb-3 block'>
                {t('majorEventsEyebrow')}
              </span>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('majorEventsTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('majorEventsDescription')}
              </p>
            </div>

            <ConferencesGrid conferences={decorated} />
          </div>
        </section>

        {/* Read the guide callout */}
        <section className='bg-[rgb(var(--mono-50))] py-16'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <Link
              href='/articles/react-native-conferences-2026'
              className='group flex flex-col items-start justify-between gap-4 rounded-2xl border border-[rgb(var(--mono-200))] bg-white p-6 transition-all hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-lg sm:flex-row sm:items-center'
            >
              <div>
                <h3 className='text-lg font-semibold text-[rgb(var(--mono-900))] group-hover:text-[rgb(var(--finnish-blue))]'>
                  {t('readGuide')}
                </h3>
                <p className='mt-1 text-sm text-[rgb(var(--mono-600))]'>
                  {t('readGuideDescription')}
                </p>
              </div>
              <span className='inline-flex items-center gap-2 font-mono text-sm font-semibold text-[rgb(var(--finnish-blue))]'>
                {t('readGuide')} <span aria-hidden>&rarr;</span>
              </span>
            </Link>
          </div>
        </section>

        {/* Submit a conference */}
        <section
          id='submit'
          className='bg-[rgb(var(--mono-50))] py-24 sm:py-32'
        >
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <span className='eyebrow mb-3 block'>
                {t('submitSectionEyebrow')}
              </span>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('submitSectionTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('submitSectionDescription')}
              </p>
            </div>

            <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
              <a
                href={GITHUB_NEW_CONFERENCE_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-full bg-[rgb(var(--navy-950))] px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:shadow-lg'
              >
                {t('submitViaIssue')}
                <span aria-hidden>&rarr;</span>
              </a>
              <a
                href={GITHUB_EDIT_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-full border border-[rgb(var(--mono-300))] bg-white px-6 py-3 font-mono text-sm font-semibold text-[rgb(var(--mono-700))] transition-all hover:border-[rgb(var(--mono-400))]'
              >
                {t('submitViaPr')}
                <span aria-hidden>&rarr;</span>
              </a>
            </div>
            <p className='mt-4 text-sm text-[rgb(var(--mono-500))]'>
              {t('submitHint')}
            </p>
          </div>
        </section>

        {/* Why Attend Section */}
        <section className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('whyAttendTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('whyAttendDescription')}
              </p>
            </div>

            <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
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
              ).map((item) => (
                <div key={item.key} className='text-center'>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--finnish-blue))] text-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className='mt-4 text-lg font-semibold text-[rgb(var(--mono-900))]'>
                    {t(`whyAttend.${item.key}.title`)}
                  </h3>
                  <p className='mt-2 text-sm text-[rgb(var(--mono-600))]'>
                    {t(`whyAttend.${item.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Meetups */}
        <section className='bg-[rgb(var(--mono-50))] py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <span className='eyebrow mb-3 block'>{t('meetupsEyebrow')}</span>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('meetupsTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('meetupsDescription')}
              </p>
            </div>

            <div className='mt-12 grid gap-6 md:grid-cols-2'>
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
          </div>
        </section>

        {/* FAQ */}
        <section className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('faqTitle')}
              </h2>
              <dl className='mt-10 space-y-6 divide-y divide-[rgb(var(--mono-200))]'>
                {faq.map((item) => (
                  <div key={item.question} className='pt-6'>
                    <dt className='text-lg font-semibold text-[rgb(var(--mono-900))]'>
                      {item.question}
                    </dt>
                    <dd className='mt-2 text-[rgb(var(--mono-600))]'>
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='relative overflow-hidden bg-[rgb(var(--navy-950))] py-24 sm:py-32'>
          <div className='absolute inset-0'>
            <div
              className='absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]'
              style={{
                background:
                  'radial-gradient(circle, rgb(var(--finnish-blue)) 0%, transparent 70%)',
              }}
            />
          </div>

          <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                {t('ctaTitle')}
              </h2>
              <p className='mt-6 text-lg leading-8 text-white/70'>
                {t('ctaDescription')} {t('ctaMissingConference')}{' '}
                <a
                  href={GITHUB_EDIT_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline hover:text-white'
                >
                  {t('ctaAddOnGithub')}
                </a>
                .
              </p>
              <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <a
                  href='https://meetup.com/react-native-helsinki'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-mono text-sm font-bold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg hover:shadow-white/20'
                >
                  {t('joinMeetup')}
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
                <Link
                  href='/events'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-mono text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10'
                >
                  {t('seePastEvents')}
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
