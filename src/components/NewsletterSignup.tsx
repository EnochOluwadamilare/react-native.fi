'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Variant = 'inline' | 'banner' | 'minimal';

interface NewsletterSignupProps {
  variant?: Variant;
  className?: string;
}

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

  if (status === 'success') {
    return (
      <div
        className={`rounded-2xl border border-green-200 bg-green-50 p-8 text-center ${className}`}
      >
        <p className='text-lg font-semibold text-green-800'>
          {t('successTitle')}
        </p>
        <p className='mt-2 text-sm text-green-600'>{t('successMessage')}</p>
      </div>
    );
  }

  // --- Variant: minimal (just input + button, no text) ---
  if (variant === 'minimal') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className='min-w-0 flex-1 rounded-lg border border-[rgb(var(--mono-200))] bg-white px-4 py-2.5 text-sm text-[rgb(var(--mono-900))] placeholder:text-[rgb(var(--mono-400))] focus:border-[rgb(var(--finnish-blue))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--finnish-blue))]'
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='btn-primary whitespace-nowrap rounded-lg px-5 py-2.5 text-sm'
          >
            {status === 'loading' ? t('subscribing') : t('subscribe')}
          </button>
        </form>
        {status === 'error' && (
          <p className='mt-2 text-sm text-red-600'>{errorMessage}</p>
        )}
      </div>
    );
  }

  // --- Variant: inline (compact, for mid-article placement) ---
  if (variant === 'inline') {
    return (
      <div
        className={`rounded-2xl border border-[rgb(var(--finnish-blue)/0.2)] bg-[rgb(var(--finnish-blue)/0.04)] p-6 sm:p-8 ${className}`}
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6'>
          <div className='flex-1'>
            <p className='text-lg font-bold text-[rgb(var(--mono-900))]'>
              {t('inlineTitle')}
            </p>
            <p className='mt-1 text-sm leading-6 text-[rgb(var(--mono-600))]'>
              {t('inlineDescription')}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='mt-4 flex gap-2'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className='min-w-0 flex-1 rounded-lg border border-[rgb(var(--mono-200))] bg-white px-4 py-2.5 text-sm text-[rgb(var(--mono-900))] placeholder:text-[rgb(var(--mono-400))] focus:border-[rgb(var(--finnish-blue))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--finnish-blue))]'
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='btn-primary whitespace-nowrap rounded-lg px-5 py-2.5 text-sm'
          >
            {status === 'loading' ? t('subscribing') : t('subscribe')}
          </button>
        </form>
        {status === 'error' && (
          <p className='mt-2 text-sm text-red-600'>{errorMessage}</p>
        )}
        <p className='mt-3 text-xs text-[rgb(var(--mono-400))]'>
          {t('privacy')}
        </p>
      </div>
    );
  }

  // --- Variant: banner (full-width, visual impact) ---
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[rgb(var(--navy-950))] px-8 py-16 sm:px-12 sm:py-20 ${className}`}
    >
      {/* Background gradient orb */}
      <div
        className='hero-orb-primary absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]'
        style={{
          background:
            'radial-gradient(circle, rgb(var(--finnish-blue)) 0%, transparent 70%)',
        }}
      />
      <div
        className='hero-orb-frost absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full opacity-15 blur-[80px]'
        style={{
          background:
            'radial-gradient(circle, rgb(var(--accent-frost)) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: `
            linear-gradient(rgb(255 255 255) 1px, transparent 1px),
            linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className='relative mx-auto max-w-2xl text-center'>
        <span className='eyebrow mb-4 inline-block text-[rgb(var(--accent-frost))]'>
          Newsletter
        </span>
        <h2 className='text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl'>
          {t('bannerTitle')}
        </h2>
        <p className='mt-2 text-sm font-medium text-white/40'>
          {t('bannerByline')}
        </p>
        <p className='mt-4 text-base leading-7 text-white/60'>
          {t('bannerDescription')}
        </p>
        <form
          onSubmit={handleSubmit}
          className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className='min-w-0 flex-1 rounded-full border-0 bg-white px-5 py-3.5 text-sm text-[rgb(var(--mono-900))] placeholder:text-[rgb(var(--mono-400))] focus:ring-2 focus:ring-[rgb(var(--accent-frost))] focus:outline-none sm:max-w-sm'
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            className='btn-primary whitespace-nowrap rounded-full px-8 py-3.5 text-sm'
          >
            {status === 'loading' ? t('subscribing') : t('subscribe')}
          </button>
        </form>
        {status === 'error' && (
          <p className='mt-3 text-sm text-red-400'>{errorMessage}</p>
        )}
        <p className='mt-5 text-xs text-white/40'>{t('privacy')}</p>
      </div>
    </div>
  );
}
