'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { NewsletterSignup } from '@/components/NewsletterSignup';

import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tNewsletter = useTranslations('newsletter');

  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-[rgb(var(--mono-200))] bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20'>
        {/* Top section */}
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8'>
          {/* Brand column */}
          <div className='lg:col-span-2'>
            <Link href='/' className='group inline-flex items-center gap-3'>
              <Image
                src='/icon.png'
                alt=''
                width={40}
                height={40}
                className='h-10 w-10'
              />
              <div>
                <div className='font-mono text-base font-bold text-[rgb(var(--mono-900))]'>
                  {t('siteName')}
                </div>
                <div className='font-mono text-xs text-[rgb(var(--mono-500))]'>
                  {t('tagline')}
                </div>
              </div>
            </Link>
            <p className='mt-6 max-w-md text-sm leading-6 text-[rgb(var(--mono-600))]'>
              Building the React Native community in Finland. Join our meetups,
              learn from articles, and connect with fellow developers.
            </p>

            {/* Social links */}
            <div className='mt-6 flex items-center gap-4'>
              <a
                href='https://meetup.com/react-native-helsinki'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--mono-100))] text-[rgb(var(--mono-600))] transition-all hover:bg-[rgb(var(--finnish-blue))] hover:text-white'
                aria-label='Meetup'
              >
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M6.98.555a.518.518 0 0 0-.105.011.53.53 0 1 0 .222 1.04.533.533 0 0 0 .409-.633.531.531 0 0 0-.526-.418zm6.455.638a.984.984 0 0 0-.514.143.99.99 0 1 0 1.02 1.699.99.99 0 0 0 .34-1.36.992.992 0 0 0-.846-.482zm-3.03 2.236a5.029 5.029 0 0 0-4.668 3.248 3.33 3.33 0 0 0-1.46.551 3.374 3.374 0 0 0-.94 4.562 3.634 3.634 0 0 0-.605 4.649 3.603 3.603 0 0 0 2.465 1.597c.018.732.238 1.466.686 2.114a3.9 3.9 0 0 0 5.423.992c.068-.047.12-.106.184-.157.987.881 2.47 1.026 3.607.24a2.91 2.91 0 0 0 1.162-1.69 4.238 4.238 0 0 0 2.584-.739 4.274 4.274 0 0 0 1.19-5.789 2.466 2.466 0 0 0 .433-3.308 2.448 2.448 0 0 0-1.316-.934 4.436 4.436 0 0 0-.776-2.873 4.467 4.467 0 0 0-5.195-1.656 5.106 5.106 0 0 0-2.773-.807zm-5.603.817a.759.759 0 0 0-.423.135.758.758 0 1 0 .863 1.248.757.757 0 0 0 .193-1.055.758.758 0 0 0-.633-.328zm15.994 2.37a.842.842 0 0 0-.47.151.845.845 0 1 0 1.175.215.845.845 0 0 0-.705-.365zm-8.15 1.028c.063 0 .124.005.182.014a.901.901 0 0 1 .45.187c.169.134.273.241.432.393.24.227.414.089.534.02.208-.122.369-.219.984-.208.633.011 1.363.237 1.514 1.317.168 1.199-1.966 4.289-1.817 5.722.106 1.01 1.815.299 1.96 1.22.186 1.198-2.136.753-2.667.493-.832-.408-1.337-1.34-1.12-2.26.16-.688 1.7-3.498 1.757-3.93.059-.44-.177-.476-.324-.484-.19-.01-.34.081-.526.362-.169.255-2.082 4.085-2.248 4.398-.296.56-.67.694-1.044.674-.548-.029-.798-.32-.72-.848.047-.31 1.26-3.049 1.323-3.476.039-.265-.013-.546-.275-.68-.263-.135-.572.07-.664.227-.128.215-1.848 4.706-2.032 5.038-.316.576-.65.76-1.152.784-1.186.056-2.065-.92-1.678-2.116.173-.532 1.316-4.571 1.895-5.599.389-.69 1.468-1.216 2.217-.892.387.167.925.437 1.084.507.366.163.759-.277.913-.412.155-.134.302-.276.49-.357.142-.06.343-.095.532-.094zm10.88 2.057a.468.468 0 0 0-.093.011.467.467 0 0 0-.36.555.47.47 0 0 0 .557.36.47.47 0 0 0 .36-.557.47.47 0 0 0-.464-.37zm-22.518.81a.997.997 0 0 0-.832.434 1 1 0 1 0 1.39-.258 1 1 0 0 0-.558-.176zm21.294 2.094a.635.635 0 0 0-.127.013.627.627 0 0 0-.48.746.628.628 0 0 0 .746.483.628.628 0 0 0 .482-.746.63.63 0 0 0-.621-.496zm-18.24 6.097a.453.453 0 0 0-.092.012.464.464 0 1 0 .195.908.464.464 0 0 0 .356-.553.465.465 0 0 0-.459-.367zm13.675 1.55a1.044 1.044 0 0 0-.583.187 1.047 1.047 0 1 0 1.456.265 1.044 1.044 0 0 0-.873-.451zM11.4 22.154a.643.643 0 0 0-.36.115.646.646 0 0 0-.164.899.646.646 0 0 0 .899.164.646.646 0 0 0 .164-.898.646.646 0 0 0-.54-.28z' />
                </svg>
              </a>
              <a
                href='https://github.com/React-Native-Finland'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--mono-100))] text-[rgb(var(--mono-600))] transition-all hover:bg-[rgb(var(--mono-900))] hover:text-white'
                aria-label='GitHub'
              >
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </a>
              <a
                href='https://twitter.com/plahteenlahti'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--mono-100))] text-[rgb(var(--mono-600))] transition-all hover:bg-[rgb(var(--mono-900))] hover:text-white'
                aria-label='Twitter/X'
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className='font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--mono-900))]'>
              Explore
            </h3>
            <ul className='mt-4 space-y-3'>
              <li>
                <Link
                  href='/events'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  {tNav('events')}
                </Link>
              </li>
              <li>
                <Link
                  href='/articles'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  {tNav('articles')}
                </Link>
              </li>
              <li>
                <Link
                  href='/developers'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  {tNav('developers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--mono-900))]'>
              Resources
            </h3>
            <ul className='mt-4 space-y-3'>
              <li>
                <Link
                  href='/conferences'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  RN Conferences 2026
                </Link>
              </li>
              <li>
                <a
                  href='https://fullstackopen.com/en/part10'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  Full Stack Open
                </a>
              </li>
              <li>
                <a
                  href='https://reactnative.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  React Native Docs
                </a>
              </li>
              <li>
                <a
                  href='https://expo.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-[rgb(var(--mono-600))] transition-colors hover:text-[rgb(var(--finnish-blue))]'
                >
                  Expo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='mt-12 border-t border-[rgb(var(--mono-200))] pt-8'>
          <div className='max-w-md'>
            <p className='font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(var(--mono-900))]'>
              {tNewsletter('footerTitle')}
            </p>
            <p className='mt-2 mb-4 text-sm text-[rgb(var(--mono-600))]'>
              {tNewsletter('footerDescription')}
            </p>
            <NewsletterSignup variant='minimal' />
          </div>
        </div>

        {/* Divider */}
        <div className='mt-12 border-t border-[rgb(var(--mono-200))] pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <p className='text-sm text-[rgb(var(--mono-500))]'>
              &copy; {currentYear} {t('siteName')}. {t('builtBy')}{' '}
              <a
                href='https://perttu.dev'
                rel='author'
                className='font-medium text-[rgb(var(--finnish-blue))] transition-colors hover:text-[rgb(var(--finnish-blue-dark))]'
              >
                Perttu Lähteenlahti
              </a>
              <span className='text-[rgb(var(--mono-400))]'>
                {' '}
                · {t('maintainerRole')}
              </span>
            </p>
            <div className='flex items-center gap-4'>
              <span className='font-mono text-xs text-[rgb(var(--mono-400))]'>
                Made in Helsinki
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
