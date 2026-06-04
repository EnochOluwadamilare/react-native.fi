import { siteConfig } from '@/constant/config';

interface ArticleJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  authorId?: string;
  authorImage?: string;
  authorJobTitle?: string;
  authorSameAs?: string[];
  url: string;
  imageUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  authorId,
  authorImage,
  authorJobTitle,
  authorSameAs,
  url,
  imageUrl,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorId && { '@id': authorId }),
      ...(authorUrl && { url: authorUrl }),
      ...(authorImage && { image: authorImage }),
      ...(authorJobTitle && { jobTitle: authorJobTitle }),
      ...(authorSameAs && authorSameAs.length > 0 && { sameAs: authorSameAs }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'React Native Finland',
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon/apple-touch-icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
