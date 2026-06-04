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
    <div className='mt-6 flex items-center gap-3'>
      {author.imageUrl && (
        <Link
          href={author.href as '/developers'}
          className='shrink-0'
          aria-label={author.name}
        >
          <Image
            src={author.imageUrl}
            alt={author.name}
            width={48}
            height={48}
            className='rounded-full object-cover ring-1 ring-gray-200'
          />
        </Link>
      )}
      <div className='min-w-0'>
        <Link
          href={author.href as '/developers'}
          rel='author'
          className='text-sm font-semibold text-gray-900 hover:text-indigo-600'
        >
          {author.name}
        </Link>
        {credentials && (
          <p className='truncate text-xs text-gray-500'>{credentials}</p>
        )}
      </div>
    </div>
  );
}
