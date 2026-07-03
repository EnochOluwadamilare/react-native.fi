import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllDevelopers } from '@/lib/developers';

import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';

import { DeveloperCard } from './developer-card';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'developers' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/developers`,
      languages: {
        en: `${siteConfig.url}/en/developers`,
        fi: `${siteConfig.url}/fi/developers`,
      },
    },
  };
}

export default async function DevelopersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('developers');
  const developers = getAllDevelopers();

  return (
    <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
      {/* Bold Unikko page header */}
      <header className='relative overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sky))] text-[rgb(var(--paper))]'>
        <PoppyField className='absolute inset-0 h-full w-full opacity-25' />
        <div className='fade-in-up relative mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
          <span className='inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-4 py-1.5 text-sm font-bold text-[rgb(var(--ink))]'>
            ✿ {developers.length} {t('title')}
          </span>
          <h1 className='mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight'>
            {t('title')}
          </h1>
          <p className='mt-5 max-w-[52ch] text-lg font-medium text-[rgb(var(--paper))]/90'>
            {t('description')}
          </p>
        </div>
      </header>

      <div className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
        {/* Directory */}
        <div className='mb-8 flex items-baseline gap-3'>
          <span className='u-num'>01</span>
          <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {t('title')}
          </h2>
        </div>

        {/* Developer list */}
        <ul
          role='list'
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        >
          {developers.map((developer, index) => (
            <DeveloperCard
              key={developer.slug}
              developer={developer}
              index={index}
            />
          ))}
        </ul>

        {/* Add yourself — bottom of page */}
        <div className='mt-20 rounded-3xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-8 sm:p-10'>
          <div className='mb-8 flex items-baseline gap-3'>
            <span className='u-num'>02</span>
            <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
              {t('addYourself')}
            </h2>
          </div>
          <p className='max-w-2xl font-medium opacity-80'>
            {t('addDescription')}
          </p>

          <div className='mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2'>
            {/* Left: Step-by-step guide */}
            <div>
              <h3 className='font-display text-lg font-bold'>
                {t('howToAdd')}
              </h3>
              <p className='mt-1 text-sm font-medium opacity-70'>
                {t('howToAddDescription')}
              </p>
              <ol className='mt-5 space-y-4'>
                {[0, 1, 2, 3].map((index) => (
                  <li key={index} className='flex gap-3'>
                    <span className='flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] font-display text-sm font-extrabold'>
                      {index + 1}
                    </span>
                    <div className='text-sm'>
                      <p className='font-display font-bold'>
                        {t(`steps.${index}.title`)}
                      </p>
                      <p className='mt-0.5 font-medium opacity-70'>
                        {t(`steps.${index}.description`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                href='https://github.com/React-Native-Finland/react-native.fi'
                target='_blank'
                rel='noopener noreferrer'
                className='u-btn u-btn-fill mt-7'
              >
                {t('startPR')}
                <svg
                  className='size-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                  />
                </svg>
              </a>
            </div>

            {/* Right: Profile template preview */}
            <div>
              <h3 className='font-display text-lg font-bold'>
                {t('templateTitle')}
              </h3>
              <p className='mt-1 text-sm font-medium opacity-70'>
                {t('templateDescription')}
              </p>
              <pre className='mt-4 overflow-x-auto rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] p-4 text-xs leading-relaxed text-[rgb(var(--paper))]/90'>
                {`{
  "slug": "your-name",
  "name": "Your Name",
  "role": "Your Role at Company",
  "location": "City, Finland",
  "imageUrl": "/images/your-name.jpg",
  "bio": "A short bio about yourself...",
  "xUrl": "https://twitter.com/...",
  "linkedinUrl": "https://linkedin.com/in/...",
  "githubUrl": "https://github.com/...",
  "websiteUrl": "https://...",
  "expertise": ["React Native", "..."],
  "availability": "Available for hire"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
