import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllDevelopers } from '@/lib/developers';

import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'consulting' });

  const title = t('pageTitle');
  const description = t('pageDescription');

  return {
    title,
    description,
    keywords: t('keywords'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/consulting`,
      languages: {
        en: `${siteConfig.url}/en/consulting`,
        fi: `${siteConfig.url}/fi/consulting`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteConfig.url}/${locale}/consulting`,
    },
  };
}

const services = [
  {
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
      />
    ),
  },
  {
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      />
    ),
  },
  {
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 10V3L4 14h7v7l9-11h-7z'
      />
    ),
  },
  {
    icon: (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
      />
    ),
  },
];

export default async function ConsultingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('consulting');
  const developers = getAllDevelopers();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('pageTitle'),
    description: t('pageDescription'),
    provider: {
      '@type': 'Organization',
      name: 'React Native Finland',
      url: siteConfig.url,
      areaServed: {
        '@type': 'Country',
        name: 'Finland',
      },
    },
    serviceType: 'React Native Development Consulting',
    areaServed: [
      { '@type': 'Country', name: 'Finland' },
      { '@type': 'Continent', name: 'Europe' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [0, 1, 2, 3].map((i) => ({
      '@type': 'Question',
      name: t(`faq.${i}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.${i}.answer`),
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
        <div className='relative overflow-hidden bg-[rgb(var(--navy-950))] py-24 sm:py-32'>
          <div className='absolute inset-0'>
            <div
              className='absolute left-1/4 top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-20 blur-[100px]'
              style={{
                background:
                  'radial-gradient(circle, rgb(var(--finnish-blue)) 0%, transparent 70%)',
              }}
            />
          </div>

          <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
                {t('title')}
              </h1>
              <p className='mt-6 text-lg leading-8 text-white/70'>
                {t('subtitle')}
              </p>
              <div className='mt-8 flex flex-wrap justify-center gap-4'>
                <Link
                  href='/developers'
                  className='rounded-full bg-white px-6 py-3 font-mono text-sm font-semibold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg'
                >
                  {t('ctaBrowse')}
                </Link>
                <a
                  href='https://github.com/React-Native-Finland/react-native.fi/discussions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10'
                >
                  {t('ctaContact')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('servicesTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('servicesSubtitle')}
              </p>
            </div>

            <div className='mt-16 grid gap-8 md:grid-cols-2'>
              {services.map((service, index) => (
                <div
                  key={index}
                  className='rounded-2xl border border-[rgb(var(--mono-200))] p-8 transition-all hover:border-[rgb(var(--finnish-blue)/0.3)] hover:shadow-lg'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--finnish-blue))] text-white'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      {service.icon}
                    </svg>
                  </div>
                  <h3 className='mt-4 text-xl font-semibold text-[rgb(var(--mono-900))]'>
                    {t(`services.${index}.title`)}
                  </h3>
                  <p className='mt-2 text-[rgb(var(--mono-600))]'>
                    {t(`services.${index}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Finland Section */}
        <section className='bg-[rgb(var(--mono-50))] py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('whyTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('whySubtitle')}
              </p>
            </div>

            <div className='mt-16 grid gap-6 md:grid-cols-3'>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className='rounded-xl border border-[rgb(var(--mono-200))] bg-white p-8 text-center'
                >
                  <h3 className='text-lg font-semibold text-[rgb(var(--mono-900))]'>
                    {t(`why.${index}.title`)}
                  </h3>
                  <p className='mt-2 text-sm text-[rgb(var(--mono-600))]'>
                    {t(`why.${index}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developers Preview */}
        <section className='py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:mx-0'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('developersTitle')}
              </h2>
              <p className='mt-4 text-lg text-[rgb(var(--mono-600))]'>
                {t('developersSubtitle', { count: developers.length })}
              </p>
            </div>
            <div className='mt-8'>
              <Link
                href='/developers'
                className='inline-flex items-center gap-2 rounded-full bg-[rgb(var(--finnish-blue))] px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:shadow-lg'
              >
                {t('ctaBrowse')}
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className='bg-[rgb(var(--mono-50))] py-24 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl'>
              <h2 className='text-3xl font-bold tracking-tight text-[rgb(var(--mono-900))] sm:text-4xl'>
                {t('faqTitle')}
              </h2>
              <dl className='mt-10 space-y-6 divide-y divide-[rgb(var(--mono-200))]'>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className='pt-6'>
                    <dt className='text-lg font-semibold text-[rgb(var(--mono-900))]'>
                      {t(`faq.${index}.question`)}
                    </dt>
                    <dd className='mt-2 text-[rgb(var(--mono-600))]'>
                      {t(`faq.${index}.answer`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='relative overflow-hidden bg-[rgb(var(--navy-950))] py-24 sm:py-32'>
          <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                {t('ctaTitle')}
              </h2>
              <p className='mt-6 text-lg leading-8 text-white/70'>
                {t('ctaDescription')}
              </p>
              <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link
                  href='/developers'
                  className='inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-mono text-sm font-bold text-[rgb(var(--navy-950))] transition-all hover:shadow-lg hover:shadow-white/20'
                >
                  {t('ctaBrowse')}
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
                </Link>
                <a
                  href='https://github.com/React-Native-Finland/react-native.fi/discussions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-mono text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10'
                >
                  {t('ctaContact')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
