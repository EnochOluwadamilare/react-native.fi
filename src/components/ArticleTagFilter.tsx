'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { ArticleTag, articleTagLabels } from '@/lib/article-tags';

export function ArticleTagFilter({
  availableTags,
}: {
  availableTags: ArticleTag[];
}) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'en';
  const activeTag = searchParams.get('tag') as ArticleTag | null;

  const handleTagClick = (tag: ArticleTag | null) => {
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }
    router.push(url.pathname + url.search, { scroll: false });
  };

  const pillBase =
    'rounded-full border-2 border-[rgb(var(--ink))] px-4 py-1.5 font-display text-sm font-bold transition-colors';
  const pillActive = 'bg-[rgb(var(--ink))] text-[rgb(var(--paper))]';
  const pillInactive =
    'bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:bg-[rgb(var(--sun))]';

  return (
    <div className='flex flex-wrap gap-2.5'>
      <button
        onClick={() => handleTagClick(null)}
        aria-pressed={!activeTag}
        className={`${pillBase} ${!activeTag ? pillActive : pillInactive}`}
      >
        {locale === 'fi' ? 'Kaikki' : 'All'}
      </button>
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          aria-pressed={activeTag === tag}
          className={`${pillBase} ${
            activeTag === tag ? pillActive : pillInactive
          }`}
        >
          {articleTagLabels[tag][locale === 'fi' ? 'fi' : 'en']}
        </button>
      ))}
    </div>
  );
}
