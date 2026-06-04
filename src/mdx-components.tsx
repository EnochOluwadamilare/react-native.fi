import type { MDXComponents } from 'mdx/types';

import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import { Callout } from '@/components/Callout';
import { Keyboard } from '@/components/Keyboard';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ArticleJsonLd,
    Callout,
    Keyboard,
    YouTubeEmbed,
  };
}
