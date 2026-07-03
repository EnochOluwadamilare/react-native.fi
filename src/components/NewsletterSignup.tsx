'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Poppy } from '@/app/components/Poppy';

type Variant = 'inline' | 'banner' | 'minimal';

interface NewsletterSignupProps {
  variant?: Variant;
  className?: string;
}

const inputClass =
  'min-w-0 flex-1 rounded-full border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper))] px-5 py-3 text-base font-medium text-[rgb(var(--ink))] placeholder:text-[rgb(var(--ink))]/45 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sky))]';

export function NewsletterSignup({
  variant = 'banner',
  className = '',
}: NewsletterSignupProps) {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Subscription failed');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  };

  const errorNote = (extra = '') =>
    status === 'error' ? (
      <p
        className={`mt-3 rounded-lg border-2 border-[rgb(var(--poppy))] bg-[rgb(var(--paper))] px-3 py-2 text-sm font-bold text-[rgb(var(--poppy))] ${extra}`}
      >
        {errorMessage}
      </p>
    ) : null;

  if (status === 'success') {
    return (
      <div
        className={`rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--mint))] p-8 text-center text-[rgb(var(--paper))] ${className}`}
      >
        <p className='font-display text-xl font-extrabold'>
          {t('successTitle')}
        </p>
        <p className='mt-2 text-sm font-medium text-[rgb(var(--paper))]/90'>
          {t('successMessage')}
        </p>
      </div>
    );
  }

  // --- Variant: minimal (just input + button, no text) ---
  if (variant === 'minimal') {
    return (
      <div className={className}>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-2 sm:flex-row'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className={inputClass}
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='u-btn whitespace-nowrap border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--poppy))] hover:!bg-[rgb(var(--poppy))] hover:!text-[rgb(var(--paper))] disabled:opacity-60'
          >
            {status === 'loading' ? t('subscribing') : t('subscribe')}
          </button>
        </form>
        {errorNote()}
      </div>
    );
  }

  // --- Variant: inline (compact, for mid-article placement) ---
  if (variant === 'inline') {
    return (
      <div
        className={`rounded-2xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--paper-2))] p-6 sm:p-8 ${className}`}
      >
        <span className='font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[rgb(var(--poppy))]'>
          {t('bannerTitle')}
        </span>
        <p className='mt-2 font-display text-xl font-extrabold text-[rgb(var(--ink))]'>
          {t('inlineTitle')}
        </p>
        <p className='mt-1 text-sm font-medium leading-6 text-[rgb(var(--ink))]/75'>
          {t('inlineDescription')}
        </p>
        <form
          onSubmit={handleSubmit}
          className='mt-5 flex flex-col gap-2 sm:flex-row'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className={inputClass}
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='u-btn u-btn-fill whitespace-nowrap disabled:opacity-60'
          >
            {status === 'loading' ? t('subscribing') : t('subscribe')}
          </button>
        </form>
        {errorNote()}
        <p className='mt-3 text-xs font-semibold text-[rgb(var(--ink))]/50'>
          {t('privacy')}
        </p>
      </div>
    );
  }

  // --- Variant: banner (full-width, visual impact) ---
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-[3px] border-[rgb(var(--ink))] bg-[rgb(var(--ink))] px-8 py-14 text-[rgb(var(--paper))] sm:px-12 sm:py-16 ${className}`}
    >
      {/* Signature poppy mark, oversized in the corner */}
      <Poppy
        color='rgb(var(--poppy))'
        centerColor='rgb(var(--sun))'
        className='pointer-events-none absolute -right-10 -top-10 h-48 w-48 opacity-90 sm:h-64 sm:w-64'
      />

      <div className='relative max-w-2xl'>
        <span className='mb-4 inline-block font-display text-xs font-extrabold uppercase tracking-[0.18em] text-[rgb(var(--sun))]'>
          Newsletter
        </span>
        <h2 className='text-balance font-display text-3xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl'>
          {t('bannerTitle')}
        </h2>
        <p className='mt-2 text-sm font-bold text-[rgb(var(--paper))]/50'>
          {t('bannerByline')}
        </p>
        <p className='mt-4 max-w-xl text-base font-medium leading-7 text-[rgb(var(--paper))]/75'>
          {t('bannerDescription')}
        </p>
        <form
          onSubmit={handleSubmit}
          className='mt-8 flex flex-col gap-3 sm:flex-row'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className={`${inputClass} sm:max-w-sm`}
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='u-btn whitespace-nowrap border-[rgb(var(--paper))] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] hover:!border-[rgb(var(--poppy))] hover:!bg-[rgb(var(--poppy))] hover:!text-[rgb(var(--paper))] disabled:opacity-60'
          >
            {status === 'loading' ? t('subscribing') : t('bannerCta')}
          </button>
        </form>
        {errorNote()}
        <p className='mt-5 text-xs font-semibold text-[rgb(var(--paper))]/50'>
          {t('privacy')}
        </p>
      </div>
    </div>
  );
}
