import { getDeveloperBySlug } from '@/lib/developers';
import { generateBlueprintOgImage } from '@/lib/og-helper';

import { Locale } from '@/i18n/config';

export const runtime = 'edge';
export const alt = 'Developer';
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const developer = getDeveloperBySlug(slug);

  const name = developer
    ? developer.name
    : slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  return generateBlueprintOgImage(name, slug, 'DEVELOPER');
}
