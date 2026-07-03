'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Developer } from '@/lib/developers';

import { Link } from '@/i18n/navigation';

const ACCENTS = [
  'bg-[rgb(var(--poppy))] text-[rgb(var(--paper))]',
  'bg-[rgb(var(--sky))] text-[rgb(var(--paper))]',
  'bg-[rgb(var(--sun))] text-[rgb(var(--ink))]',
  'bg-[rgb(var(--mint))] text-[rgb(var(--paper))]',
] as const;

function isAvailable(availability?: string) {
  if (!availability) return false;
  const a = availability.toLowerCase();
  return (
    (a.includes('available') || a.includes('saatav') || a.includes('open')) &&
    !a.includes('not') &&
    !a.includes('ei ')
  );
}

export function DeveloperCard({
  developer,
  index = 0,
}: {
  developer: Developer;
  index?: number;
}) {
  const t = useTranslations('social');
  const accent = ACCENTS[index % ACCENTS.length];
  const available = isAvailable(developer.availability);

  return (
    <li className='group flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] transition-transform duration-150 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0'>
      {/* Colored header band with framed photo */}
      <Link
        href={`/developers/${developer.slug}`}
        className={`flex items-center gap-4 border-b-[3px] border-[rgb(var(--ink))] p-4 ${accent}`}
      >
        <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))]'>
          <Image
            alt={developer.name}
            src={developer.imageUrl}
            fill
            sizes='80px'
            className='object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none'
          />
        </div>
        <div className='min-w-0'>
          <h3 className='font-display text-xl font-extrabold leading-tight tracking-tight'>
            {developer.name}
          </h3>
          <p className='mt-0.5 truncate text-sm font-bold opacity-90'>
            {developer.role}
          </p>
          {developer.location && (
            <p className='mt-0.5 text-xs font-semibold opacity-80'>
              ◆ {developer.location}
            </p>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className='flex flex-1 flex-col p-4'>
        {/* Availability status */}
        {developer.availability && (
          <p className='flex items-center gap-2 font-display text-xs font-bold'>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                available ? 'bg-[rgb(var(--mint))]' : 'bg-[rgb(var(--poppy))]'
              }`}
              aria-hidden='true'
            />
            {developer.availability}
          </p>
        )}

        {/* Expertise pills */}
        {developer.expertise && developer.expertise.length > 0 && (
          <ul className='mt-3 flex flex-wrap gap-2' role='list'>
            {developer.expertise.slice(0, 4).map((skill) => (
              <li
                key={skill}
                className='rounded-full border-2 border-[rgb(var(--ink))] px-2.5 py-0.5 font-display text-xs font-bold'
              >
                {skill}
              </li>
            ))}
          </ul>
        )}

        {/* Social links */}
        <ul role='list' className='mt-auto flex gap-x-4 pt-5'>
          {developer.xUrl && (
            <li>
              <a
                href={developer.xUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--poppy))]'
              >
                <span className='sr-only'>{t('x')}</span>
                <svg
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  aria-hidden='true'
                  className='size-5'
                >
                  <path d='M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z' />
                </svg>
              </a>
            </li>
          )}
          {developer.linkedinUrl && (
            <li>
              <a
                href={developer.linkedinUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--sky))]'
              >
                <span className='sr-only'>{t('linkedin')}</span>
                <svg
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  aria-hidden='true'
                  className='size-5'
                >
                  <path
                    d='M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z'
                    clipRule='evenodd'
                    fillRule='evenodd'
                  />
                </svg>
              </a>
            </li>
          )}
          {developer.githubUrl && (
            <li>
              <a
                href={developer.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--mint))]'
              >
                <span className='sr-only'>{t('github')}</span>
                <svg
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='size-5'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </li>
          )}
          {developer.websiteUrl && (
            <li>
              <a
                href={developer.websiteUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--sun))]'
              >
                <span className='sr-only'>{t('website')}</span>
                <svg
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={1.5}
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='size-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                  />
                </svg>
              </a>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
}
