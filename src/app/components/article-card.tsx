'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export type ArticleCardProps = {
  article: {
    slug?: string;
    href?: string;
    title: string;
    description: string;
    date: string;
    readingTime?: number;
    imageUrl?: string;
    locale?: string;
    category?: { title: string; href: string };
    author?:
      | string
      | {
          name: string;
          role: string;
          tagline?: string;
          href: string;
          imageUrl: string;
        };
  };
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const params = useParams();
  const locale = (params?.locale as string) || article.locale || 'en';

  // Use either the provided href or construct one from the slug with locale
  const href = article.href || `/${locale}/articles/${article.slug}`;

  // Helper to handle both string and object authors
  const author =
    typeof article.author === 'string'
      ? { name: article.author, role: '', tagline: '', href: '#', imageUrl: '' }
      : article.author;

  // Generate OG image URL from slug - use locale-aware path
  const ogImageUrl = article.slug
    ? `/${locale}/articles/${article.slug}/opengraph-image`
    : null;

  // Use OG image if available, otherwise fall back to provided imageUrl
  const displayImage = ogImageUrl || article.imageUrl;

  const articleLocale = (article.locale ?? 'en').toUpperCase();
  const isFi = (article.locale ?? 'en') === 'fi';

  return (
    <article className='group relative flex flex-col overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] transition-transform duration-200 hover:-translate-y-1'>
      {displayImage && (
        <div className='relative block aspect-[1200/630] w-full border-b-[3px] border-[rgb(var(--ink))]'>
          <Image
            src={displayImage}
            alt={article.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='bg-[rgb(var(--paper-2))] object-cover'
            placeholder='blur'
            blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0Y0RjFFOCIvPjwvc3ZnPg=='
          />
          {/* EN/FI pill */}
          <span
            className={`absolute right-3 top-3 z-10 rounded-full border-2 px-3 py-1 font-display text-xs font-bold ${
              isFi
                ? 'border-[rgb(var(--ink))] bg-[rgb(var(--sky))] text-[rgb(var(--paper))]'
                : 'border-[rgb(var(--ink))] bg-[rgb(var(--sun))] text-[rgb(var(--ink))]'
            }`}
          >
            {articleLocale}
          </span>
        </div>
      )}
      <div className='flex flex-1 flex-col p-5'>
        {article.category && (
          <a
            href={article.category.href}
            className='relative z-10 mb-3 inline-flex w-fit rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] px-3 py-1 font-display text-xs font-bold text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--sun))]'
          >
            {article.category.title}
          </a>
        )}
        <h3 className='font-display text-xl font-bold leading-tight tracking-tight text-[rgb(var(--ink))] transition-colors group-hover:text-[rgb(var(--poppy))]'>
          {article.href ? (
            <a href={article.href}>
              <span className='absolute inset-0' />
              {article.title}
            </a>
          ) : (
            <Link href={href}>
              <span className='absolute inset-0' />
              {article.title}
            </Link>
          )}
        </h3>

        <div className='mt-2 flex items-center gap-2 font-display text-xs font-bold tracking-wide text-[rgb(var(--ink))]/60'>
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {article.readingTime && (
            <>
              <span className='text-[rgb(var(--poppy))]'>●</span>
              <span>{article.readingTime} min read</span>
            </>
          )}
        </div>

        <p className='mt-3 line-clamp-3 text-sm font-medium leading-6 text-[rgb(var(--ink))]/80'>
          {article.description}
        </p>

        {author && (
          <div className='relative mt-auto flex items-center gap-x-3 pt-5'>
            {author.imageUrl ? (
              <img
                src={author.imageUrl}
                alt=''
                className='size-9 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] object-cover'
              />
            ) : (
              <div className='flex size-9 items-center justify-center rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] font-display font-bold text-[rgb(var(--ink))]'>
                {author.name.charAt(0)}
              </div>
            )}
            <div className='text-sm leading-5'>
              <p className='font-display font-bold text-[rgb(var(--ink))]'>
                {author.href && author.href !== '#' ? (
                  <a href={author.href}>
                    <span className='absolute inset-0' />
                    {author.name}
                  </a>
                ) : (
                  <span>{author.name}</span>
                )}
              </p>
              {author.role && (
                <p className='font-medium text-[rgb(var(--ink))]/60'>
                  {author.role}
                </p>
              )}
              {author.tagline && (
                <p className='text-xs font-medium text-[rgb(var(--ink))]/50'>
                  {author.tagline}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
