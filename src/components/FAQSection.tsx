'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQSection() {
  const t = useTranslations('home.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Get FAQ items from translations
  const faqItems: FAQItem[] = [
    {
      question: t('questions.0.question'),
      answer: t('questions.0.answer'),
    },
    {
      question: t('questions.1.question'),
      answer: t('questions.1.answer'),
    },
    {
      question: t('questions.2.question'),
      answer: t('questions.2.answer'),
    },
    {
      question: t('questions.3.question'),
      answer: t('questions.3.answer'),
    },
  ];

  // Generate FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div className='text-[rgb(var(--ink))]'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className='mb-8 flex items-baseline gap-3'>
        <span className='u-num'>?</span>
        <h2 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
          {t('title')}
        </h2>
      </div>

      <dl className='border-b-[3px] border-[rgb(var(--ink))]'>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className='border-t-[3px] border-[rgb(var(--ink))]'
            >
              <dt>
                <button
                  type='button'
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className='group flex w-full items-center gap-4 py-5 text-left'
                >
                  <span className='font-display text-lg font-extrabold tabular-nums text-[rgb(var(--ink))]/40'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className='flex-1 font-display text-xl font-bold leading-tight transition-colors group-hover:text-[rgb(var(--poppy))]'>
                    {item.question}
                  </span>
                  <span
                    aria-hidden='true'
                    className='grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-[rgb(var(--ink))] font-display text-2xl font-extrabold leading-none text-[rgb(var(--poppy))]'
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </dt>
              <dd
                id={`faq-answer-${index}`}
                hidden={!isOpen}
                className='max-w-[68ch] pb-6 pl-[3.25rem] text-base font-medium leading-7 text-[rgb(var(--ink))]/80'
              >
                {item.answer}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
