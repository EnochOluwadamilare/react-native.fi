'use client';

import { useSearchParams } from 'next/navigation';

import { ArticleTag } from '@/lib/article-tags';
import { Article } from '@/lib/articles';

import { ArticleCard } from '@/app/components/article-card';

export function ArticleFilteredGrid({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') as ArticleTag | null;

  const filtered = activeTag
    ? articles.filter((a) => a.tags?.includes(activeTag))
    : articles;

  if (filtered.length === 0) {
    return (
      <div className='mt-12 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] px-6 py-16 text-center'>
        <p className='font-display text-xl font-bold text-[rgb(var(--ink))]'>
          No articles found for this category.
        </p>
      </div>
    );
  }

  return (
    <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {filtered.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
