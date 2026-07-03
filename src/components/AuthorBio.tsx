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
    <div className='mt-12 rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-6 sm:p-8'>
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
              className='h-[72px] w-[72px] rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] object-cover'
            />
          </Link>
        )}
        <div className='min-w-0'>
          <p className='font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[rgb(var(--poppy))]'>
            {locale === 'fi' ? 'Kirjoittaja' : 'Written by'}
          </p>
          <Link
            href={author.href as '/developers'}
            rel='author'
            className='font-display text-xl font-bold text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--poppy))]'
          >
            {author.name}
          </Link>
          {(author.role || author.location) && (
            <p className='mt-0.5 text-sm font-semibold text-[rgb(var(--ink))]/60'>
              {[author.role, author.location].filter(Boolean).join(' · ')}
            </p>
          )}

          {author.bio && (
            <p className='mt-3 text-sm font-medium leading-relaxed text-[rgb(var(--ink))]/80'>
              {author.bio}
            </p>
          )}

          {author.expertise && author.expertise.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {author.expertise.map((skill) => (
                <span
                  key={skill}
                  className='rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper))] px-3 py-0.5 font-display text-xs font-bold text-[rgb(var(--ink))]'
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
                  className='font-display text-sm font-bold text-[rgb(var(--sky))] transition-colors hover:text-[rgb(var(--poppy))]'
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
