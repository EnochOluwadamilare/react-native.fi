'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

import { Poppy } from '@/app/components/Poppy';
import { Link, usePathname } from '@/i18n/navigation';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navigation = [
    { name: t('events'), href: '/events' },
    { name: t('articles'), href: '/articles' },
    { name: t('developers'), href: '/developers' },
  ];

  return (
    <header className='sticky top-0 z-50 border-b-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))]/95 backdrop-blur'>
      <nav
        aria-label='Global'
        className='mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3 lg:px-8'
      >
        {/* Logo */}
        <div className='flex lg:flex-1'>
          <Link href='/' className='-m-1.5 flex items-center gap-2.5 p-1.5'>
            <span className='sr-only'>{t('siteName')}</span>
            <Poppy className='h-7 w-7' color='rgb(var(--ink))' />
            <span className='font-display text-lg font-extrabold tracking-tight'>
              react-native.fi
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className='flex lg:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-[rgb(var(--ink))] hover:bg-[rgb(var(--paper-2))]'
          >
            <span className='sr-only'>{t('openMenu')}</span>
            <Bars3Icon aria-hidden='true' className='h-6 w-6' />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className='hidden lg:flex lg:gap-x-6'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`border-b-[3px] pb-0.5 font-semibold transition-colors ${
                  isActive
                    ? 'border-[rgb(var(--poppy))]'
                    : 'border-transparent hover:border-[rgb(var(--poppy))]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right side — CTA & Language */}
        <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4'>
          <LanguageSwitcher />
          <a
            href='https://meetup.com/react-native-helsinki'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full border-[2.5px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] px-4 py-1.5 font-display text-sm font-bold text-[rgb(var(--paper))] transition-colors hover:border-[rgb(var(--poppy))] hover:bg-[rgb(var(--poppy))]'
          >
            Join Meetup
          </a>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm' />
        <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[rgb(var(--paper))] px-6 py-6 sm:max-w-sm sm:border-l-[3px] sm:border-[rgb(var(--ink))]'>
          <div className='flex items-center justify-between'>
            <Link
              href='/'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-1.5 flex items-center gap-2.5 p-1.5'
            >
              <Poppy className='h-8 w-8' color='rgb(var(--ink))' />
              <span className='font-display text-lg font-extrabold'>
                react-native.fi
              </span>
            </Link>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-lg p-2.5 text-[rgb(var(--ink))] hover:bg-[rgb(var(--paper-2))]'
            >
              <span className='sr-only'>{t('closeMenu')}</span>
              <XMarkIcon aria-hidden='true' className='h-6 w-6' />
            </button>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-my-6 divide-y-2 divide-[rgb(var(--ink))]'>
              <div className='space-y-1 py-6'>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-lg px-4 py-3 font-display text-base font-bold transition-colors ${
                        isActive
                          ? 'bg-[rgb(var(--sun))]'
                          : 'hover:bg-[rgb(var(--paper-2))]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className='py-6'>
                <a
                  href='https://meetup.com/react-native-helsinki'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mb-4 block rounded-full border-[2.5px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] px-4 py-3 text-center font-display text-sm font-bold text-[rgb(var(--paper))]'
                >
                  Join Meetup
                </a>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
