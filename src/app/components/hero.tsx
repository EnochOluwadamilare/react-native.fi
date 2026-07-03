'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { PoppyField } from './Poppy';

type HeroProps = {
  articleCount?: number;
  developerCount?: number;
  conferenceCount?: number;
};

export const Hero = ({ articleCount }: HeroProps) => {
  const t = useTranslations('hero');

  return (
    <section className='grid grid-cols-1 border-b-[3px] border-[rgb(var(--ink))] lg:grid-cols-[1.15fr_0.85fr]'>
      {/* Left — the statement */}
      <div className='fade-in-up px-6 py-16 sm:px-10 lg:py-24 lg:pl-[max(4vw,calc((100vw-1180px)/2))] lg:pr-12'>
        <h1 className='mb-6 font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-tight'>
          <span className='block'>React</span>
          <span className='block text-[rgb(var(--poppy))]'>Native</span>
          <span className='block'>
            in <span className='text-[rgb(var(--sky))]'>{t('country')}</span>.
          </span>
        </h1>

        <p className='max-w-[42ch] text-lg font-medium text-[rgb(var(--ink))]/85'>
          {t('description')}
        </p>

        <div className='mt-8 flex flex-wrap gap-3'>
          <Link href='/articles' className='u-btn u-btn-fill'>
            {t('viewEvents')} →
          </Link>
          <Link href='/developers' className='u-btn u-btn-out'>
            {t('learnMore')}
          </Link>
        </div>
      </div>

      {/* Right — poppy field with the signature badge */}
      <div className='relative grid min-h-[300px] place-items-center overflow-hidden border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--poppy))] lg:border-l-[3px] lg:border-t-0'>
        <PoppyField className='absolute inset-0 h-full w-full opacity-60' />
        <div className='u-spin-in relative grid h-44 w-44 place-items-center rounded-full border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] text-center'>
          <div>
            <span className='block font-display text-4xl font-extrabold leading-none'>
              {articleCount ?? '40'}+
            </span>
            <span className='mt-1 block text-xs font-bold tracking-[0.1em]'>
              {t('statTutorials').toUpperCase()} · EN/FI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
