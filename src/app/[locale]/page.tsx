import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllArticles } from '@/lib/articles';
import {
  daysBetween,
  getAllConferences,
  getConferenceStatus,
  getNextConference,
} from '@/lib/conferences';
import { getAllDevelopers } from '@/lib/developers';
import { getAllEvents } from '@/lib/events';

import { FAQSection } from '@/components/FAQSection';
import { NewsletterSignup } from '@/components/NewsletterSignup';

import { Hero } from '@/app/components/hero';
import { siteConfig } from '@/constant/config';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        fi: `${siteConfig.url}/fi`,
        'x-default': `${siteConfig.url}/en`,
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tImages = await getTranslations('images');

  const articles = await getAllArticles();
  const events = getAllEvents();
  const developers = getAllDevelopers();
  const conferences = getAllConferences();
  const nextConference = getNextConference(conferences);

  const tNext = await getTranslations('home.nextConference');
  let nextConferenceTiming: string | null = null;
  if (nextConference) {
    const status = getConferenceStatus(nextConference);
    const days = daysBetween(nextConference.startDate);
    if (status === 'this-week' && days <= 0) {
      nextConferenceTiming = tNext('happeningNow');
    } else if (status === 'this-week') {
      nextConferenceTiming = tNext('thisWeek');
    } else {
      nextConferenceTiming = tNext('daysAway', { count: Math.max(days, 0) });
    }
  }

  return (
    <div className='bg-white'>
      <Hero
        articleCount={articles.length}
        developerCount={developers.length}
        conferenceCount={conferences.length}
      />

      {/* Bento Grid Section */}
      <section className='relative bg-[rgb(var(--mono-50))] py-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          {/* Section header */}
          <div className='mb-12 lg:mb-16'>
            <span className='eyebrow mb-3 block'>{t('exploreTitle')}</span>
            <h2 className='max-w-2xl text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl lg:text-5xl'>
              {t('exploreSubtitle')}
            </h2>
          </div>

          {/* Bento Grid — resource-first: Tutorials featured, then Developers, then Events */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2'>
            {/* Tutorials - Featured large card */}
            <Link
              href='/articles'
              className='group relative overflow-hidden rounded-3xl bg-[rgb(var(--navy-950))] p-8 md:col-span-2 lg:row-span-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[rgb(var(--finnish-blue)/0.1)]'
            >
              {/* Background image */}
              <div className='absolute inset-0'>
                <Image
                  alt={tImages('articlesAlt')}
                  src='/images/articles.jpg'
                  fill
                  sizes='(max-width: 768px) 100vw, 66vw'
                  className='object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[rgb(var(--navy-950))] via-[rgb(var(--navy-950))/80] to-transparent' />
              </div>

              {/* Content */}
              <div className='relative z-10 flex h-full min-h-[400px] flex-col justify-end lg:min-h-[500px]'>
                <span className='mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm'>
                  <span className='h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent-frost))]' />
                  {t('articles.count', { count: articles.length })}
                </span>
                <h3 className='mb-3 text-3xl font-bold text-white lg:text-4xl'>
                  {t('articles.title')}
                </h3>
                <p className='mb-6 max-w-md text-base text-white/70'>
                  {t('articles.description')}
                </p>
                <div className='inline-flex items-center gap-2 font-mono text-sm font-semibold text-[rgb(var(--accent-frost))] transition-all group-hover:gap-3'>
                  {t('articles.cta')}
                  <svg
                    className='h-4 w-4 transition-transform group-hover:translate-x-1'
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
                </div>
              </div>
            </Link>

            {/* Developers card */}
            <Link
              href='/developers'
              className='group relative overflow-hidden rounded-3xl border border-[rgb(var(--mono-200))] bg-white p-6 transition-all duration-300 hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-xl'
            >
              <div className='relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl'>
                <Image
                  alt={tImages('developersAlt')}
                  src='/images/developers.jpg'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              <span className='mb-2 inline-block rounded-full bg-[rgb(var(--mono-100))] px-3 py-1 font-mono text-xs font-semibold text-[rgb(var(--mono-600))]'>
                {t('developers.count', { count: developers.length })}
              </span>
              <h3 className='mb-2 text-xl font-bold text-[rgb(var(--mono-900))]'>
                {t('developers.title')}
              </h3>
              <p className='mb-4 text-sm text-[rgb(var(--mono-600))]'>
                {t('developers.description')}
              </p>
              <span className='inline-flex items-center gap-2 font-mono text-sm font-semibold text-[rgb(var(--finnish-blue))] transition-all group-hover:gap-3'>
                {t('developers.cta')}
                <span className='transition-transform group-hover:translate-x-1'>
                  &rarr;
                </span>
              </span>
            </Link>

            {/* Events card */}
            <Link
              href='/events'
              className='group relative overflow-hidden rounded-3xl border border-[rgb(var(--mono-200))] bg-white p-6 transition-all duration-300 hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-xl'
            >
              <div className='relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl'>
                <Image
                  alt={tImages('eventsAlt')}
                  src='/images/events.jpg'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              <span className='mb-2 inline-block rounded-full bg-[rgb(var(--finnish-blue)/0.1)] px-3 py-1 font-mono text-xs font-semibold text-[rgb(var(--finnish-blue))]'>
                {t('events.count', { count: events.length })}
              </span>
              <h3 className='mb-2 text-xl font-bold text-[rgb(var(--mono-900))]'>
                {t('events.title')}
              </h3>
              <p className='mb-4 text-sm text-[rgb(var(--mono-600))]'>
                {t('events.description')}
              </p>
              <span className='inline-flex items-center gap-2 font-mono text-sm font-semibold text-[rgb(var(--finnish-blue))] transition-all group-hover:gap-3'>
                {t('events.cta')}
                <span className='transition-transform group-hover:translate-x-1'>
                  &rarr;
                </span>
              </span>
            </Link>
          </div>

          {/* Contribute / open source - Full width card */}
          <a
            href='https://github.com/React-Native-Finland'
            target='_blank'
            rel='noopener noreferrer'
            className='group mt-4 block overflow-hidden rounded-3xl bg-gradient-to-r from-[rgb(var(--finnish-blue))] to-[rgb(var(--finnish-blue-dark))] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-[rgb(var(--finnish-blue)/0.2)] md:p-12'
          >
            <div className='flex flex-col items-start justify-between gap-8 md:flex-row md:items-center'>
              <div className='max-w-2xl'>
                <span className='mb-3 inline-block rounded-full bg-white/20 px-3 py-1 font-mono text-xs font-semibold text-white'>
                  {t('contribute.title')}
                </span>
                <h3 className='mb-3 text-2xl font-bold text-white md:text-3xl'>
                  {t('contribute.subtitle')}
                </h3>
                <p className='text-base text-white/80'>
                  {t('contribute.description')}
                </p>
              </div>
              <div className='flex items-center gap-3 rounded-full bg-white px-6 py-3 font-mono text-sm font-bold text-[rgb(var(--finnish-blue))] transition-all group-hover:shadow-lg'>
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                {t('contribute.cta')}
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Next conference strip */}
      {nextConference && (
        <section className='border-y border-[rgb(var(--mono-200))] bg-white py-10'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <Link
              href='/conferences'
              className='group flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--finnish-blue)/0.1)] text-[rgb(var(--finnish-blue))]'>
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
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--finnish-blue))]'>
                      {tNext('eyebrow')}
                    </span>
                    <span className='font-mono text-xs font-semibold text-[rgb(var(--mono-500))]'>
                      {nextConferenceTiming}
                    </span>
                  </div>
                  <h3 className='mt-1 text-lg font-bold text-[rgb(var(--mono-900))] group-hover:text-[rgb(var(--finnish-blue))]'>
                    {nextConference.name}
                  </h3>
                  <p className='text-sm text-[rgb(var(--mono-500))]'>
                    {nextConference.dateDetail} · {nextConference.location}
                  </p>
                </div>
              </div>
              <span className='inline-flex items-center gap-2 font-mono text-sm font-semibold text-[rgb(var(--finnish-blue))] transition-all group-hover:gap-3'>
                {tNext('cta')}
                <span className='transition-transform group-hover:translate-x-1'>
                  &rarr;
                </span>
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter — full-width hero-style section */}
      <section className='bg-[rgb(var(--mono-50))] py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <NewsletterSignup variant='banner' />
        </div>
      </section>

      {/* About / maintainer strip */}
      <section className='border-t border-[rgb(var(--mono-200))] bg-white py-16 sm:py-20'>
        <div className='mx-auto max-w-3xl px-6 lg:px-8'>
          <div className='flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left'>
            <Image
              src='/images/perttu.jpeg'
              alt='Perttu Lähteenlahti'
              width={96}
              height={96}
              className='h-24 w-24 flex-shrink-0 rounded-2xl object-cover ring-1 ring-[rgb(var(--mono-200))]'
            />
            <div>
              <span className='eyebrow mb-2 block'>{t('about.eyebrow')}</span>
              <h2 className='text-xl font-bold text-[rgb(var(--mono-900))] sm:text-2xl'>
                {t('about.title')}
              </h2>
              <p className='mt-3 text-base leading-7 text-[rgb(var(--mono-600))]'>
                {t('about.description')}
              </p>
              <div className='mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start'>
                <a
                  href='https://perttu.dev'
                  target='_blank'
                  rel='author noopener noreferrer'
                  className='inline-flex items-center gap-1 font-mono text-sm font-semibold text-[rgb(var(--finnish-blue))] transition-colors hover:text-[rgb(var(--finnish-blue-dark))]'
                >
                  {t('about.cta')}
                  <span>&rarr;</span>
                </a>
                <a
                  href='https://github.com/plahteenlahti'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-mono text-sm text-[rgb(var(--mono-500))] transition-colors hover:text-[rgb(var(--mono-900))]'
                >
                  GitHub
                </a>
                <a
                  href='https://twitter.com/plahteenlahti'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-mono text-sm text-[rgb(var(--mono-500))] transition-colors hover:text-[rgb(var(--mono-900))]'
                >
                  X
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA - Dark section */}
      <section className='relative overflow-hidden bg-[rgb(var(--navy-950))] py-24 sm:py-32'>
        {/* Background effects */}
        <div className='absolute inset-0'>
          <div
            className='absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]'
            style={{
              background:
                'radial-gradient(circle, rgb(var(--finnish-blue)) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Grid pattern */}
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
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>
              {t('community.title')}
            </h2>
            <p className='mt-6 text-lg leading-8 text-white/60'>
              {t('community.description')}
            </p>
            <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                href='/articles'
                className='group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-mono text-sm font-bold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg hover:shadow-white/20'
              >
                {t('community.ctaPrimary')}
                <svg
                  className='h-4 w-4 transition-transform group-hover:translate-x-1'
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
              </Link>
              <Link
                href='/conferences'
                className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-mono text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10'
              >
                {t('community.ctaSecondary')}
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
