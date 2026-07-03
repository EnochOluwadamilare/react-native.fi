import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ArticleTag, getAllArticles } from '@/lib/articles';

import { ArticleFilteredGrid } from '@/components/ArticleFilteredGrid';
import { ArticleTagFilter } from '@/components/ArticleTagFilter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NewsletterSignup } from '@/components/NewsletterSignup';

import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'articles' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/articles`,
      languages: {
        en: `${siteConfig.url}/en/articles`,
        fi: `${siteConfig.url}/fi/articles`,
      },
    },
  };
}

export default async function LearnAndArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('articles');
  const articles = await getAllArticles(locale);

  // Collect unique tags from articles
  const availableTags = Array.from(
    new Set(articles.flatMap((a) => a.tags || [])),
  ).sort() as ArticleTag[];

  // CollectionPage structured data
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('pageDescription'),
    url: `${siteConfig.url}/${locale}/articles`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/${locale}/articles/${article.slug}`,
        name: article.title,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: 'React Native Finland',
      url: siteConfig.url,
    },
  };

  return (
    <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero — hard-ruled split with poppy block */}
      <section className='grid grid-cols-1 border-b-[3px] border-[rgb(var(--ink))] lg:grid-cols-[1.15fr_0.85fr]'>
        {/* Left — the statement */}
        <div className='fade-in-up px-6 py-14 sm:px-10 lg:py-20 lg:pl-[max(4vw,calc((100vw-1180px)/2))] lg:pr-12'>
          <Breadcrumbs
            homeLabel={locale === 'fi' ? 'Etusivu' : 'Home'}
            items={[{ name: locale === 'fi' ? 'Artikkelit' : 'Articles' }]}
          />

          <span className='mt-2 inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--sun))] px-4 py-1.5 font-display text-sm font-bold'>
            ✿ {t('header')}
          </span>

          <h1 className='my-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight'>
            {t('title')}
          </h1>

          <p className='max-w-[52ch] text-lg font-medium text-[rgb(var(--ink))]/85'>
            {t('description')}
          </p>
        </div>

        {/* Right — poppy field block */}
        <div className='relative grid min-h-[260px] place-items-center overflow-hidden border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--poppy))] lg:border-l-[3px] lg:border-t-0'>
          <PoppyField className='absolute inset-0 h-full w-full opacity-60' />
          <div className='relative grid h-40 w-40 place-items-center rounded-full border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] text-center'>
            <div>
              <span className='block font-display text-4xl font-extrabold leading-none'>
                {articles.length}+
              </span>
              <span className='mt-1 block font-display text-xs font-bold tracking-[0.1em]'>
                {t('communityArticles').toUpperCase()} · EN/FI
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-[1180px] px-6 py-16 sm:py-20 lg:px-8'>
        {/* Articles section header */}
        <div className='mb-8 flex items-baseline gap-3'>
          <span className='u-num'>01</span>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {t('communityArticles')}
          </h2>
        </div>
        <p className='max-w-[60ch] font-medium opacity-80'>
          {t('communityDescription')}
        </p>

        {/* Tag filter */}
        {availableTags.length > 0 && (
          <div className='mt-8'>
            <Suspense>
              <ArticleTagFilter availableTags={availableTags} />
            </Suspense>
          </div>
        )}

        {articles.length > 0 && (
          <Suspense>
            <ArticleFilteredGrid articles={articles} />
          </Suspense>
        )}
      </div>

      {/* Newsletter Signup */}
      <section className='border-t-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] py-20'>
        <div className='mx-auto max-w-[1180px] px-6 lg:px-8'>
          <NewsletterSignup variant='banner' />
        </div>
      </section>
    </div>
  );
}
