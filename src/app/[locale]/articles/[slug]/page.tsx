import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';

import {
  articleTagLabels,
  getAllArticleSlugs,
  getArticleBySlug,
  getArticleContent,
  getRelatedArticles,
  hasTranslation,
} from '@/lib/articles';

import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import { AuthorBio } from '@/components/AuthorBio';
import { AuthorByline } from '@/components/AuthorByline';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Callout } from '@/components/Callout';
import { Keyboard } from '@/components/Keyboard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { RelatedArticles } from '@/components/RelatedArticles';
import { TableOfContents } from '@/components/TableOfContents';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

import { siteConfig } from '@/constant/config';
import { defaultLocale, Locale, locales } from '@/i18n/config';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

// Custom Image component that provides default dimensions
const ArticleImage = (
  props: React.ComponentProps<typeof Image> & { src: string; alt?: string },
) => {
  const { width, height, ...rest } = props;
  return (
    <Image
      {...rest}
      width={width || 800}
      height={height || 450}
      className={props.className || 'rounded-xl'}
      alt={props.alt || ''}
    />
  );
};

// Custom MDX components
const components = {
  Image: ArticleImage,
  Callout,
  Keyboard,
  YouTubeEmbed,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      {...(props as React.ComponentProps<typeof Image>)}
      width={800}
      height={450}
      className='rounded-xl'
      alt={props.alt || ''}
    />
  ),
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  // If this locale has no translation, canonical should point to the default locale
  const isUntranslated =
    locale !== defaultLocale && !hasTranslation(slug, locale);
  const canonicalUrl =
    article.canonical ||
    (isUntranslated
      ? `${siteConfig.url}/${defaultLocale}/articles/${slug}`
      : `${siteConfig.url}/${locale}/articles/${slug}`);
  const articleUrl = `${siteConfig.url}/${locale}/articles/${slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en/articles/${slug}`,
        fi: `${siteConfig.url}/fi/articles/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      type: 'article',
      publishedTime: article.date,
      ...(article.updatedAt && { modifiedTime: article.updatedAt }),
      authors: [
        typeof article.author === 'string'
          ? article.author
          : article.author.name,
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug, locale);
  const content = getArticleContent(slug, locale);

  if (!article || !content) {
    notFound();
  }

  // Check if viewing a fallback (English content on Finnish page)
  const isShowingFallback =
    locale !== defaultLocale && !hasTranslation(slug, locale);

  // Get related articles
  const relatedArticles = await getRelatedArticles(slug, locale, 3);

  // Compile MDX content
  const { content: mdxContent } = await compileMDX({
    source: content,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [rehypePrism],
      },
    },
  });

  const formattedDate = new Date(article.date).toLocaleDateString(
    locale === 'fi' ? 'fi-FI' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const formattedUpdatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString(
        locale === 'fi' ? 'fi-FI' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      )
    : null;

  const authorName =
    typeof article.author === 'string' ? article.author : article.author.name;
  const authorObject =
    typeof article.author === 'string' ? null : article.author;
  // E-E-A-T: link the author Person node to its canonical profile + socials.
  const authorUrl = authorObject
    ? authorObject.websiteUrl || `${siteConfig.url}${authorObject.href}`
    : undefined;
  const authorSameAs = authorObject
    ? [
        authorObject.websiteUrl,
        authorObject.xUrl,
        authorObject.linkedinUrl,
        authorObject.githubUrl,
      ].filter((u): u is string => Boolean(u))
    : undefined;
  const articleUrl = `${siteConfig.url}/${locale}/articles/${slug}`;
  const ogImageUrl = `${siteConfig.url}/${locale}/articles/${slug}/opengraph-image`;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        datePublished={article.date}
        dateModified={article.updatedAt}
        authorName={authorName}
        authorUrl={authorUrl}
        authorImage={
          authorObject ? `${siteConfig.url}${authorObject.imageUrl}` : undefined
        }
        authorJobTitle={authorObject?.role}
        authorSameAs={authorSameAs}
        url={articleUrl}
        imageUrl={ogImageUrl}
      />
      <article className='fade-in-up bg-[rgb(var(--paper))] py-16 text-[rgb(var(--ink))] sm:py-24'>
        <div className='mx-auto max-w-3xl px-6 lg:px-8'>
          {/* Breadcrumbs */}
          <Breadcrumbs
            homeLabel={locale === 'fi' ? 'Etusivu' : 'Home'}
            items={[
              {
                name: locale === 'fi' ? 'Artikkelit' : 'Articles',
                href: '/articles',
              },
              { name: article.title },
            ]}
          />

          {/* Fallback notice */}
          {isShowingFallback && (
            <div className='mb-8 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--sun))] p-4'>
              <p className='font-display text-sm font-bold text-[rgb(var(--ink))]'>
                {locale === 'fi'
                  ? 'Tätä artikkelia ei ole vielä käännetty suomeksi. Näytetään englanninkielinen versio.'
                  : 'This article is not yet translated. Showing the English version.'}
              </p>
            </div>
          )}

          <header className='mb-12'>
            {/* Tag / eyebrow pills */}
            {article.tags && article.tags.length > 0 && (
              <div className='mb-5 flex flex-wrap gap-2'>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/articles?tag=${tag}`}
                    className='rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] px-3 py-1 font-display text-xs font-bold text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--sun))]'
                  >
                    {articleTagLabels[tag]?.[locale === 'fi' ? 'fi' : 'en'] ??
                      tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className='font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[rgb(var(--ink))] sm:text-5xl'>
              {article.title}
            </h1>

            {/* Byline + meta (E-E-A-T: surface authorship up front) */}
            <div className='mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-sm font-bold text-[rgb(var(--ink))]/70'>
              {authorObject ? (
                <AuthorByline author={article.author} />
              ) : (
                <span className='text-[rgb(var(--ink))]'>
                  {locale === 'fi' ? 'Kirjoittanut' : 'By'} {authorName}
                </span>
              )}
              <span aria-hidden='true' className='text-[rgb(var(--poppy))]'>
                ●
              </span>
              <time dateTime={article.date}>{formattedDate}</time>
              {article.readingTime && (
                <>
                  <span aria-hidden='true' className='text-[rgb(var(--poppy))]'>
                    ●
                  </span>
                  <span>
                    {article.readingTime} min{' '}
                    {locale === 'fi' ? 'luku' : 'read'}
                  </span>
                </>
              )}
              {formattedUpdatedDate && (
                <>
                  <span aria-hidden='true' className='text-[rgb(var(--poppy))]'>
                    ●
                  </span>
                  <span>
                    {locale === 'fi' ? 'Päivitetty' : 'Updated'}{' '}
                    {formattedUpdatedDate}
                  </span>
                </>
              )}
            </div>

            <div className='relative mt-8 aspect-[1200/630] overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))]'>
              <Image
                src={`/${locale}/articles/${slug}/opengraph-image`}
                alt={article.title}
                fill
                sizes='(max-width: 768px) 100vw, 768px'
                className='object-cover'
                placeholder='blur'
                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMDAyYiIvPjwvc3ZnPg=='
                priority
              />
            </div>
          </header>

          {/* Table of Contents */}
          <TableOfContents locale={locale} />

          <div className='prose prose-lg prose-gray max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-gray-900'>
            {mdxContent}
          </div>

          {/* Author Bio */}
          <AuthorBio author={article.author} locale={locale} />

          {/* Newsletter Signup */}
          <NewsletterSignup variant='inline' className='mt-12' />

          {/* Related Articles */}
          <RelatedArticles articles={relatedArticles} locale={locale} />

          {/* Back to articles */}
          <div className='mt-12 border-t-[3px] border-[rgb(var(--ink))] pt-8'>
            <Link
              href={`/${locale}/articles`}
              className='group inline-flex items-center gap-2 font-display text-sm font-bold text-[rgb(var(--sky))] transition-colors hover:text-[rgb(var(--poppy))]'
            >
              <span className='inline-block transition-transform group-hover:-translate-x-1'>
                ←
              </span>
              {locale === 'fi' ? 'Takaisin artikkeleihin' : 'Back to articles'}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
