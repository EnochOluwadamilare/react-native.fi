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
import { getAllEvents, getUpcomingEvents } from '@/lib/events';

import { FAQSection } from '@/components/FAQSection';
import { NewsletterSignup } from '@/components/NewsletterSignup';

import { Hero } from '@/app/components/hero';
import { siteConfig } from '@/constant/config';
import { Link } from '@/i18n/navigation';

import { DeveloperCard } from './developers/developer-card';

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

  const articles = await getAllArticles();
  const events = getAllEvents();
  const upcomingEvents = getUpcomingEvents();
  const featuredEvent = upcomingEvents[0] ?? events[0];
  const developers = getAllDevelopers();
  const conferences = getAllConferences();
  const nextConference = getNextConference(conferences);

  const latestArticles = articles.slice(0, 4);
  const featuredDevelopers = developers.slice(0, 3);

  const pillars = [
    {
      letter: 'A',
      href: '/articles',
      title: t('articles.title'),
      description: t('articles.description'),
      cta: t('articles.cta'),
      hover: 'hover:bg-[rgb(var(--poppy))] hover:text-[rgb(var(--paper))]',
    },
    {
      letter: 'B',
      href: '/developers',
      title: t('developers.title'),
      description: t('developers.description'),
      cta: t('developers.cta'),
      hover: 'hover:bg-[rgb(var(--sky))] hover:text-[rgb(var(--paper))]',
    },
    {
      letter: 'C',
      href: '/events',
      title: t('events.title'),
      description: t('events.description'),
      cta: t('events.cta'),
      hover: 'hover:bg-[rgb(var(--sun))]',
    },
    {
      letter: 'D',
      href: '/conferences',
      title: t('conferences.title'),
      description: t('conferences.description'),
      cta: t('conferences.cta'),
      hover: 'hover:bg-[rgb(var(--mint))] hover:text-[rgb(var(--paper))]',
    },
  ];

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

  const eventDate = featuredEvent
    ? new Date(featuredEvent.date).toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const marqueeItems = [
    t('articles.title'),
    t('developers.title'),
    'React Native Helsinki',
    t('conferences.title'),
    t('contribute.title'),
  ];

  return (
    <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
      <Hero
        articleCount={articles.length}
        developerCount={developers.length}
        conferenceCount={conferences.length}
      />

      {/* Print marquee */}
      <div className='overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] text-[rgb(var(--paper))]'>
        <div className='u-marquee-track py-3 font-display text-base font-bold tracking-wide'>
          {[0, 1].map((dup) => (
            <span key={dup}>
              {marqueeItems.map((item) => (
                <span key={item}>
                  <span className='mx-5 text-[rgb(var(--sun))]'>✿</span>
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 01 — Pillars */}
      <section
        id='resources'
        className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'
      >
        <div className='mb-10 flex items-baseline gap-3'>
          <span className='u-num'>01</span>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {t('exploreSubtitle')}
          </h2>
        </div>
        <div className='grid grid-cols-1 border-l-[3px] border-t-[3px] border-[rgb(var(--ink))] sm:grid-cols-2'>
          {pillars.map((p) => (
            <Link
              key={p.letter}
              href={p.href}
              className={`group border-b-[3px] border-r-[3px] border-[rgb(var(--ink))] p-8 transition-colors ${p.hover}`}
            >
              <div className='font-display text-5xl font-extrabold leading-none'>
                {p.letter}
              </div>
              <h3 className='mb-2 mt-3 font-display text-2xl font-bold'>
                {p.title}
              </h3>
              <p className='max-w-[34ch] font-medium opacity-80'>
                {p.description}
              </p>
              <div className='mt-4 font-bold'>
                {p.cta}{' '}
                <span className='inline-block transition-transform group-hover:translate-x-1'>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 02 — Latest guides */}
      <section className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
        <div className='mb-8 flex items-baseline gap-3'>
          <span className='u-num'>02</span>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {t('articles.title')}
          </h2>
        </div>
        <div className='border-b-2 border-[rgb(var(--ink))]'>
          {latestArticles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className='group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t-2 border-[rgb(var(--ink))] py-5'
            >
              <span className='font-display text-xl font-extrabold'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className='block font-display text-xl font-bold transition-colors group-hover:text-[rgb(var(--poppy))]'>
                  {article.title}
                </span>
                {article.description && (
                  <span className='mt-0.5 block text-sm font-medium opacity-70'>
                    {article.description}
                  </span>
                )}
              </span>
              <span
                className={`whitespace-nowrap rounded-full border-2 px-3 py-1 text-xs font-bold ${
                  article.locale === 'fi'
                    ? 'border-[rgb(var(--sky))] bg-[rgb(var(--sky))] text-[rgb(var(--paper))]'
                    : 'border-[rgb(var(--ink))] bg-[rgb(var(--sun))]'
                }`}
              >
                {(article.locale ?? 'en').toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 03 — Developer directory */}
      <section className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
        <div className='mb-8 flex items-baseline gap-3'>
          <span className='u-num'>03</span>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {t('developers.title')}
          </h2>
        </div>
        <ul
          role='list'
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        >
          {featuredDevelopers.map((dev, i) => (
            <DeveloperCard key={dev.slug} developer={dev} index={i} />
          ))}
        </ul>

        <div className='mt-8 flex flex-wrap gap-3'>
          <Link href='/developers' className='u-btn u-btn-fill'>
            {t('developers.cta')} →
          </Link>
          <a
            href='https://github.com/React-Native-Finland'
            target='_blank'
            rel='noopener noreferrer'
            className='u-btn u-btn-out'
          >
            {t('contribute.cta')}
          </a>
        </div>
      </section>

      {/* 04 — Meetup */}
      {featuredEvent && (
        <section className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
          <div className='mb-8 flex items-baseline gap-3'>
            <span className='u-num'>04</span>
            <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
              React Native Helsinki
            </h2>
          </div>
          <div className='grid grid-cols-1 items-center gap-6 rounded-3xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sky))] p-8 text-[rgb(var(--paper))] sm:p-10 md:grid-cols-[1fr_auto]'>
            <div>
              <span className='font-display text-sm font-bold tracking-[0.08em] text-[rgb(var(--sun))]'>
                ● {eventDate} · {featuredEvent.venue.city}
              </span>
              <h3 className='my-2 font-display text-3xl font-extrabold leading-none sm:text-4xl'>
                {featuredEvent.title}
              </h3>
              <p className='max-w-[52ch] font-medium text-[rgb(var(--paper))]/85'>
                {featuredEvent.description}
              </p>
            </div>
            <a
              href='https://meetup.com/react-native-helsinki'
              target='_blank'
              rel='noopener noreferrer'
              className='u-btn shrink-0 border-[rgb(var(--sun))] bg-[rgb(var(--sun))] text-[rgb(var(--ink))] hover:!bg-[rgb(var(--paper))] hover:!border-[rgb(var(--paper))]'
            >
              {t('events.cta')} →
            </a>
          </div>
        </section>
      )}

      {/* Next conference strip */}
      {nextConference && (
        <section className='border-y-[3px] border-[rgb(var(--ink))]'>
          <Link
            href='/conferences'
            className='group mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-2 px-6 py-6 sm:flex-row sm:items-center lg:px-8'
          >
            <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
              <span className='font-display text-sm font-extrabold uppercase tracking-wider text-[rgb(var(--poppy))]'>
                {tNext('eyebrow')}
              </span>
              <span className='text-sm font-bold opacity-60'>
                {nextConferenceTiming}
              </span>
              <span className='font-display text-lg font-bold'>
                {nextConference.name}
              </span>
              <span className='text-sm font-medium opacity-60'>
                {nextConference.dateDetail} · {nextConference.location}
              </span>
            </div>
            <span className='font-bold'>
              {tNext('cta')}{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1'>
                →
              </span>
            </span>
          </Link>
        </section>
      )}

      {/* FAQ */}
      <section className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
        <FAQSection />
      </section>

      {/* Newsletter */}
      <section className='border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] py-20'>
        <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
          <NewsletterSignup variant='banner' />
        </div>
      </section>

      {/* Community CTA — ink block */}
      <section className='bg-[rgb(var(--ink))] py-20 text-[rgb(var(--paper))] sm:py-28'>
        <div className='mx-auto max-w-[1180px] px-6 text-center lg:px-8'>
          <h2 className='mx-auto max-w-3xl text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl'>
            {t('community.title')}
          </h2>
          <p className='mx-auto mt-5 max-w-2xl text-lg font-medium text-[rgb(var(--paper))]/70'>
            {t('community.description')}
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              href='/articles'
              className='u-btn border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--poppy))] hover:!bg-[rgb(var(--poppy))] hover:!text-[rgb(var(--paper))]'
            >
              {t('community.ctaPrimary')} →
            </Link>
            <Link
              href='/conferences'
              className='u-btn border-[rgb(var(--paper))] text-[rgb(var(--paper))] hover:!bg-[rgb(var(--paper))] hover:!text-[rgb(var(--ink))]'
            >
              {t('community.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Maintainer */}
      <section className='border-t-[3px] border-[rgb(var(--ink))] py-16'>
        <div className='mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:items-start sm:text-left lg:px-8'>
          <Image
            src='/images/perttu.jpeg'
            alt='Perttu Lähteenlahti'
            width={96}
            height={96}
            className='h-24 w-24 shrink-0 rounded-2xl border-[3px] border-[rgb(var(--ink))] object-cover'
          />
          <div>
            <span className='font-display text-sm font-extrabold uppercase tracking-wider text-[rgb(var(--poppy))]'>
              {t('about.eyebrow')}
            </span>
            <h2 className='mt-1 font-display text-xl font-bold sm:text-2xl'>
              {t('about.title')}
            </h2>
            <p className='mt-3 font-medium leading-7 opacity-80'>
              {t('about.description')}
            </p>
            <a
              href='https://perttu.dev'
              target='_blank'
              rel='author noopener noreferrer'
              className='mt-4 inline-block font-bold text-[rgb(var(--sky))] hover:text-[rgb(var(--poppy))]'
            >
              {t('about.cta')} →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
