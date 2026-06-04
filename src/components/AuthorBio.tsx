import Image from 'next/image';
import Link from 'next/link';

import type { ArticleAuthor } from '@/lib/articles';

interface AuthorBioProps {
  author: string | ArticleAuthor;
  locale: string;
}

interface SocialLink {
  href: string;
  label: string;
}

export function AuthorBio({ author, locale }: AuthorBioProps) {
  if (typeof author === 'string') return null;

  const socials: SocialLink[] = [
    author.websiteUrl && { href: author.websiteUrl, label: 'Website' },
    author.xUrl && { href: author.xUrl, label: 'X' },
    author.linkedinUrl && { href: author.linkedinUrl, label: 'LinkedIn' },
    author.githubUrl && { href: author.githubUrl, label: 'GitHub' },
  ].filter(Boolean) as SocialLink[];

  return (
    <div className='mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
        {author.imageUrl && (
          <Link
            href={author.href as '/developers'}
            className='shrink-0'
            aria-label={author.name}
          >
            <Image
              src={author.imageUrl}
              alt={author.name}
              width={72}
              height={72}
              className='rounded-full object-cover ring-1 ring-gray-200'
            />
          </Link>
        )}
        <div className='min-w-0'>
          <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
            {locale === 'fi' ? 'Kirjoittaja' : 'Written by'}
          </p>
          <Link
            href={author.href as '/developers'}
            rel='author'
            className='text-lg font-semibold text-gray-900 hover:text-indigo-600'
          >
            {author.name}
          </Link>
          {(author.role || author.location) && (
            <p className='mt-0.5 text-sm text-gray-600'>
              {[author.role, author.location].filter(Boolean).join(' · ')}
            </p>
          )}

          {author.bio && (
            <p className='mt-3 text-sm leading-relaxed text-gray-700'>
              {author.bio}
            </p>
          )}

          {author.expertise && author.expertise.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {author.expertise.map((skill) => (
                <span
                  key={skill}
                  className='rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200'
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {socials.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-4'>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
