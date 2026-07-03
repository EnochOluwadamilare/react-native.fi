import Image from 'next/image';
import Link from 'next/link';

import type { ArticleAuthor } from '@/lib/articles';

interface AuthorBylineProps {
  author: string | ArticleAuthor;
}

// Compact author byline shown directly under the hero image. Surfaces early
// E-E-A-T signals (who wrote this, their role, where) without repeating the
// full bio, which lives at the bottom of the article.
export function AuthorByline({ author }: AuthorBylineProps) {
  if (typeof author === 'string') return null;

  const credentials = [author.role, author.location]
    .filter(Boolean)
    .join(' · ');

  return (
    <span className='flex items-center gap-2.5'>
      {author.imageUrl && (
        <Link
          href={author.href as '/developers'}
          className='shrink-0'
          aria-label={author.name}
        >
          <Image
            src={author.imageUrl}
            alt={author.name}
            width={44}
            height={44}
            className='h-11 w-11 rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] object-cover'
          />
        </Link>
      )}
      <span className='min-w-0 leading-tight'>
        <Link
          href={author.href as '/developers'}
          rel='author'
          className='font-display text-sm font-bold text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--poppy))]'
        >
          {author.name}
        </Link>
        {credentials && (
          <span className='block truncate text-xs font-medium text-[rgb(var(--ink))]/60'>
            {credentials}
          </span>
        )}
      </span>
    </span>
  );
}
