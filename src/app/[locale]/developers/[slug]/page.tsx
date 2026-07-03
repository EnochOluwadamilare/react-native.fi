import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getAllArticles } from '@/lib/articles';
import { getAllDevelopers, getDeveloperBySlug } from '@/lib/developers';

import { PersonJsonLd } from '@/components/PersonJsonLd';

import { ArticleCard } from '@/app/components/article-card';
import { PoppyField } from '@/app/components/Poppy';
import { siteConfig } from '@/constant/config';
import { Locale, locales } from '@/i18n/config';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

function isAvailable(availability?: string) {
  if (!availability) return false;
  const a = availability.toLowerCase();
  return (
    (a.includes('available') || a.includes('saatav') || a.includes('open')) &&
    !a.includes('not') &&
    !a.includes('ei ')
  );
}

export function generateStaticParams() {
  const developers = getAllDevelopers();
  return locales.flatMap((locale) =>
    developers.map((dev) => ({
      locale,
      slug: dev.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const developer = getDeveloperBySlug(slug);

  if (!developer) {
    return {
      title: 'Developer Not Found',
    };
  }

  return {
    title: `${developer.name} - React Native Developer in Finland`,
    description: developer.bio,
  };
}

export default async function DeveloperPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('social');
  const developer = getDeveloperBySlug(slug);

  if (!developer) {
    notFound();
  }

  // Get articles by this developer
  const allArticles = await getAllArticles();
  const developerArticles = allArticles.filter((article) => {
    const authorName =
      typeof article.author === 'string' ? article.author : article.author.name;
    return authorName === developer.name;
  });

  // Build social URLs for sameAs
  const sameAs = [
    developer.xUrl,
    developer.linkedinUrl,
    developer.githubUrl,
    developer.websiteUrl,
  ].filter(Boolean) as string[];

  const developerUrl = `${siteConfig.url}/${locale}/developers/${slug}`;
  const ogImageUrl = `${siteConfig.url}/${locale}/developers/${slug}/opengraph-image`;

  const available = isAvailable(developer.availability);

  return (
    <>
      <PersonJsonLd
        name={developer.name}
        jobTitle={developer.role}
        description={developer.bio}
        url={developerUrl}
        imageUrl={ogImageUrl}
        sameAs={sameAs}
        location={developer.location}
        knowsAbout={developer.expertise}
      />
      <div className='bg-[rgb(var(--paper))] text-[rgb(var(--ink))]'>
        {/* Bold color-blocked profile header */}
        <section className='fade-in-up relative overflow-hidden border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--poppy))] text-[rgb(var(--paper))]'>
          <PoppyField className='pointer-events-none absolute inset-0 h-full w-full opacity-30' />
          <div className='relative mx-auto flex max-w-[1180px] flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:gap-8 lg:px-8 lg:py-20'>
            <div className='relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] sm:h-36 sm:w-36'>
              <Image
                alt={developer.name}
                src={developer.imageUrl}
                fill
                sizes='144px'
                className='object-cover'
                priority
              />
            </div>

            <div className='min-w-0'>
              <h1 className='font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[0.94] tracking-tight'>
                {developer.name}
              </h1>
              <p className='mt-3 font-display text-lg font-bold sm:text-xl'>
                {developer.role}
              </p>
              {developer.location && (
                <p className='mt-1 font-display text-sm font-bold opacity-90'>
                  ◆ {developer.location}
                </p>
              )}
              {developer.availability && (
                <span
                  className={`mt-4 inline-flex items-center gap-2 rounded-full border-2 border-[rgb(var(--ink))] px-4 py-1.5 font-display text-sm font-bold ${
                    available
                      ? 'bg-[rgb(var(--mint))] text-[rgb(var(--paper))]'
                      : 'bg-[rgb(var(--paper-2))] text-[rgb(var(--ink))]'
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      available
                        ? 'bg-[rgb(var(--paper))]'
                        : 'bg-[rgb(var(--poppy))]'
                    }`}
                    aria-hidden='true'
                  />
                  {developer.availability}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className='mx-auto max-w-[1180px] px-6 py-16 lg:px-8'>
          <div className='max-w-3xl'>
            {/* Bio */}
            <p className='text-lg font-medium leading-8 text-[rgb(var(--ink))]/85'>
              {developer.bio}
            </p>

            {/* Expertise */}
            {developer.expertise && developer.expertise.length > 0 && (
              <div className='mt-8'>
                <h2 className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                  {locale === 'fi' ? 'Osaaminen' : 'Expertise'}
                </h2>
                <ul className='mt-3 flex flex-wrap gap-2' role='list'>
                  {developer.expertise.map((skill) => (
                    <li
                      key={skill}
                      className='rounded-full border-2 border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] px-3 py-1 font-display text-sm font-bold text-[rgb(var(--ink))]'
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Links */}
            <div className='mt-8'>
              <h2 className='font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[rgb(var(--poppy))]'>
                {locale === 'fi' ? 'Yhteystiedot' : 'Find me on'}
              </h2>
              <ul role='list' className='mt-3 flex gap-x-5'>
                {developer.xUrl && (
                  <li>
                    <a
                      href={developer.xUrl}
                      className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--poppy))]'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='sr-only'>{t('x')}</span>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='size-6'
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
                      className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--sky))]'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='sr-only'>{t('linkedin')}</span>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='size-6'
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
                      className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--mint))]'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='sr-only'>{t('github')}</span>
                      <svg
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                        className='size-6'
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
                      className='text-[rgb(var(--ink))] transition-colors hover:text-[rgb(var(--sun))]'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='sr-only'>{t('website')}</span>
                      <svg
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={1.5}
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                        className='size-6'
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
          </div>

          {/* Articles by this developer */}
          {developerArticles.length > 0 && (
            <section className='mt-16 border-t-[3px] border-[rgb(var(--ink))] pt-16'>
              <div className='mb-8 flex items-baseline gap-3'>
                <span className='u-num'>01</span>
                <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
                  {locale === 'fi'
                    ? `${developer.name} kirjoittamat artikkelit`
                    : `Articles by ${developer.name}`}
                </h2>
              </div>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {developerArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Back link */}
          <div className='mt-16'>
            <Link
              href='/developers'
              className='group font-display font-bold text-[rgb(var(--sky))]'
            >
              <span className='inline-block transition-transform group-hover:-translate-x-1'>
                ←
              </span>{' '}
              {locale === 'fi'
                ? 'Takaisin kehittäjiin'
                : 'Back to all developers'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
