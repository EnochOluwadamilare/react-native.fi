import { siteConfig } from '@/constant/config';
import { Link } from '@/i18n/navigation';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
}

export function Breadcrumbs({ items, homeLabel = 'Home' }: BreadcrumbsProps) {
  // Build full URLs for JSON-LD
  const jsonLdItems = items
    .filter((item) => item.href)
    .map((item) => ({
      name: item.name,
      url: item.href?.startsWith('http')
        ? item.href
        : `${siteConfig.url}${item.href}`,
    }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: siteConfig.url,
      },
      ...jsonLdItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
      // Add current page (last item without href)
      ...(items.length > 0 && !items[items.length - 1].href
        ? [
            {
              '@type': 'ListItem',
              position: jsonLdItems.length + 2,
              name: items[items.length - 1].name,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label='Breadcrumb' className='mb-6'>
        <ol className='flex flex-wrap items-center gap-2 font-display text-sm font-bold'>
          <li>
            <Link
              href='/'
              className='text-[rgb(var(--ink))]/55 transition-colors hover:text-[rgb(var(--poppy))]'
            >
              {homeLabel}
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className='flex items-center gap-2'>
              <span aria-hidden='true' className='text-[rgb(var(--ink))]/30'>
                /
              </span>
              {item.href ? (
                <Link
                  href={item.href as '/events' | '/articles' | '/developers'}
                  className='text-[rgb(var(--ink))]/55 transition-colors hover:text-[rgb(var(--poppy))]'
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current='page'
                  className='line-clamp-1 text-[rgb(var(--ink))]'
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
