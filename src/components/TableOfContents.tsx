'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ locale }: { locale?: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const article = document.querySelector('article .prose');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || '';
      }
      return {
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      };
    });
    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const title = locale === 'fi' ? 'Sisällysluettelo' : 'Table of Contents';

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const links = (
    <ol className='space-y-1'>
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
          <a
            href={`#${heading.id}`}
            className={`block border-l-2 py-0.5 pl-3 text-sm transition-colors ${
              activeId === heading.id
                ? 'border-indigo-600 font-medium text-indigo-600'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
            onClick={(e) => handleClick(e, heading.id)}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: floating sticky ToC in the left margin (xl+ screens) */}
      <nav
        aria-label={title}
        className='pointer-events-none fixed top-28 left-[max(1.5rem,calc((100vw-48rem)/2-17rem))] z-10 hidden w-56 xl:block'
      >
        <div className='pointer-events-auto max-h-[calc(100vh-9rem)] overflow-y-auto pr-2'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            {title}
          </p>
          {links}
        </div>
      </nav>

      {/* Mobile / tablet: collapsible card inline above content */}
      <nav
        aria-label={title}
        className='mb-8 rounded-lg border border-gray-200 bg-gray-50 xl:hidden'
      >
        <button
          type='button'
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className='flex w-full items-center justify-between p-4 text-left'
        >
          <span className='text-sm font-semibold text-gray-900'>{title}</span>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${
              mobileOpen ? 'rotate-180' : ''
            }`}
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m19.5 8.25-7.5 7.5-7.5-7.5'
            />
          </svg>
        </button>
        {mobileOpen && <div className='px-4 pb-4'>{links}</div>}
      </nav>
    </>
  );
}
