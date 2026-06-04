import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

import { ArticleTag } from '@/lib/article-tags';
import { getDeveloperByName, getDeveloperBySlug } from '@/lib/developers';
import { Developer } from '@/lib/developers';

import { defaultLocale, Locale } from '@/i18n/config';

export type { ArticleTag } from '@/lib/article-tags';
export { articleTagLabels } from '@/lib/article-tags';

export interface ArticleAuthor {
  name: string;
  role: string;
  href: string;
  imageUrl: string;
  bio?: string;
  location?: string;
  expertise?: string[];
  websiteUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  description: string;
  tags?: ArticleTag[];
  readingTime?: number;
  author: string | ArticleAuthor;
  imageUrl?: string;
  canonical?: string;
  locale?: Locale;
  hasTranslation?: boolean;
}

// Map a Developer record to a rich article author (with E-E-A-T fields)
function developerToAuthor(dev: Developer, tagline?: string): ArticleAuthor {
  return {
    name: dev.name,
    role: tagline || dev.role,
    href: `/developers/${dev.slug}`,
    imageUrl: dev.imageUrl,
    bio: dev.bio,
    location: dev.location,
    expertise: dev.expertise,
    websiteUrl: dev.websiteUrl,
    xUrl: dev.xUrl,
    linkedinUrl: dev.linkedinUrl,
    githubUrl: dev.githubUrl,
  };
}

// Build a rich author object by matching a developer via authorSlug, or by
// falling back to the plain `author` name. Returns the raw string only when no
// matching developer exists.
function resolveAuthor(
  metadata: Partial<Article> & { authorSlug?: string; authorTagline?: string },
): Article['author'] {
  if (metadata.authorSlug) {
    const dev = getDeveloperBySlug(metadata.authorSlug);
    if (dev) return developerToAuthor(dev, metadata.authorTagline);
  }

  if (typeof metadata.author === 'string' && metadata.author) {
    const dev = getDeveloperByName(metadata.author);
    if (dev) return developerToAuthor(dev, metadata.authorTagline);
  }

  return metadata.author || '';
}

// Calculate reading time from MDX content (words per minute)
function calculateReadingTime(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/^import\s+.*$/gm, '') // remove imports
    .replace(/^export\s+.*$/gm, '') // remove exports
    .replace(/[#*_\[\]()]/g, ''); // remove markdown syntax
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Content directory for localized articles
const contentDirectory = path.join(process.cwd(), 'src/content/articles');

// Helper to extract the exported article object from MDX content
function extractArticleMetadata(content: string): Partial<Article> | null {
  // Look for: export const article = { ... }
  const match = content.match(/export const article = ({[\s\S]*?})/);
  if (match && match[1]) {
    try {
      const metadata = new Function(`return ${match[1]}`)();
      return metadata;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse article metadata:', e);
      return null;
    }
  }
  return null;
}

// Check if a translation exists for a given article slug and locale
export function hasTranslation(slug: string, locale: Locale): boolean {
  const localePath = path.join(contentDirectory, locale, slug, 'page.mdx');
  return fs.existsSync(localePath);
}

// Get article by slug for a specific locale (with fallback to default locale)
export async function getArticleBySlug(
  slug: string,
  locale: Locale,
): Promise<Article | null> {
  // Try locale-specific first
  let articlePath = path.join(contentDirectory, locale, slug, 'page.mdx');
  let usedLocale = locale;

  // Fallback to default locale if translation doesn't exist
  if (!fs.existsSync(articlePath) && locale !== defaultLocale) {
    articlePath = path.join(contentDirectory, defaultLocale, slug, 'page.mdx');
    usedLocale = defaultLocale;
  }

  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(articlePath, 'utf8');
  const metadata = extractArticleMetadata(fileContents);

  if (!metadata) {
    return null;
  }

  return {
    slug,
    title: metadata.title || 'Untitled',
    date: metadata.date || new Date().toISOString(),
    updatedAt: (metadata as Record<string, string>).updatedAt,
    description: metadata.description || '',
    tags: (metadata as Record<string, unknown>).tags as
      | ArticleTag[]
      | undefined,
    readingTime: calculateReadingTime(fileContents),
    author: resolveAuthor(
      metadata as Partial<Article> & {
        authorSlug?: string;
        authorTagline?: string;
      },
    ),
    imageUrl: `/${locale}/articles/${slug}/opengraph-image`,
    canonical: (metadata as Record<string, string>).canonical,
    locale: usedLocale,
    hasTranslation: hasTranslation(slug, locale),
  };
}

// Get all articles for a specific locale
export async function getAllArticles(
  locale: Locale = defaultLocale,
): Promise<Article[]> {
  const localeDirectory = path.join(contentDirectory, locale);

  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  const articleFiles = await glob('**/page.mdx', { cwd: localeDirectory });

  const articles = await Promise.all(
    articleFiles.map(async (filename) => {
      const slug = path.dirname(filename);
      const fullPath = path.join(localeDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const metadata = extractArticleMetadata(fileContents);

      if (!metadata) {
        return null;
      }

      return {
        slug,
        title: metadata.title || 'Untitled',
        date: metadata.date || new Date().toISOString(),
        updatedAt: (metadata as Record<string, string>).updatedAt,
        description: metadata.description || '',
        tags: (metadata as Record<string, unknown>).tags as
          | ArticleTag[]
          | undefined,
        readingTime: calculateReadingTime(fileContents),
        author: resolveAuthor(
          metadata as Partial<Article> & {
            authorSlug?: string;
            authorTagline?: string;
          },
        ),
        imageUrl: `/${locale}/articles/${slug}/opengraph-image`,
        locale,
        hasTranslation: true,
      } as Article;
    }),
  );

  const validArticles = articles.filter((a): a is Article => a !== null);

  return validArticles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get all unique article slugs across all locales
export async function getAllArticleSlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const locales = fs
    .readdirSync(contentDirectory)
    .filter((f) => fs.statSync(path.join(contentDirectory, f)).isDirectory());

  for (const locale of locales) {
    const localeDir = path.join(contentDirectory, locale);
    const files = await glob('**/page.mdx', { cwd: localeDir });
    files.forEach((f) => slugs.add(path.dirname(f)));
  }

  return Array.from(slugs);
}

// Get related articles based on shared tags
export async function getRelatedArticles(
  currentSlug: string,
  locale: Locale = defaultLocale,
  limit: number = 3,
): Promise<Article[]> {
  const allArticles = await getAllArticles(locale);
  const current = allArticles.find((a) => a.slug === currentSlug);
  if (!current || !current.tags?.length) {
    return allArticles.filter((a) => a.slug !== currentSlug).slice(0, limit);
  }

  const scored = allArticles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => ({
      article: a,
      score: (a.tags || []).filter((t) => current.tags!.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.article.date).getTime() - new Date(a.article.date).getTime(),
    );

  return scored.slice(0, limit).map((s) => s.article);
}

// Process MDX content to strip imports/exports and convert image paths
function processContent(content: string, slug: string, locale: Locale): string {
  let processed = content;

  // Remove all import statements
  processed = processed.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  processed = processed.replace(/^import\s+['"].*?['"];?\s*$/gm, '');

  // Remove export const article = { ... } blocks (multi-line with nested braces)
  processed = processed.replace(
    /export const article = \{[^}]*(?:\{[^}]*\}[^}]*)*\};?\s*/g,
    '',
  );

  // Remove export const metadata = { ... } blocks (more complex with nested objects)
  // Use a function to handle brace matching
  const metadataMatch = processed.match(/export const metadata = \{/);
  if (metadataMatch && metadataMatch.index !== undefined) {
    const startIdx = metadataMatch.index;
    let braceCount = 0;
    let endIdx = startIdx;
    let inString = false;
    let stringChar = '';

    for (let i = startIdx; i < processed.length; i++) {
      const char = processed[i];
      const prevChar = i > 0 ? processed[i - 1] : '';

      // Handle string detection
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      // Count braces outside of strings
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;

        if (braceCount === 0 && char === '}') {
          endIdx = i + 1;
          break;
        }
      }
    }

    // Remove the metadata export including trailing semicolon and whitespace
    const afterMetadata = processed.slice(endIdx).replace(/^;?\s*/, '');
    processed = processed.slice(0, startIdx) + afterMetadata;
  }

  // Remove export default function/component (handles JSX with nested parens)
  // Match "export default (props) => (" and start counting from the last (
  const defaultMatch = processed.match(/export default \(props\) => \(/);
  if (defaultMatch && defaultMatch.index !== undefined) {
    const matchEnd = defaultMatch.index + defaultMatch[0].length;
    const startIdx = defaultMatch.index;
    // Start counting from after "=> (" - so we begin with parenCount = 1
    let parenCount = 1;
    let endIdx = matchEnd;

    for (let i = matchEnd; i < processed.length; i++) {
      const char = processed[i];
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;

      if (parenCount === 0) {
        endIdx = i + 1;
        break;
      }
    }

    const afterExport = processed.slice(endIdx).replace(/^;?\s*/, '');
    processed = processed.slice(0, startIdx) + afterExport;
  }

  // Fallback: remove simpler export default statements
  processed = processed.replace(/^export default.*?;?\s*$/gm, '');

  // Convert Image components with imported src to use public paths
  // <Image src={VariableName} ... /> -> <Image src="/content/articles/locale/slug/filename.webp" ... />
  const imageVarRegex = /<Image\s+src=\{(\w+)\}/g;
  const imageVars: Record<string, string> = {};

  // Extract image variable mappings from original imports
  const importMatches = Array.from(
    content.matchAll(/import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"]/g),
  );
  for (const match of importMatches) {
    const varName = match[1];
    const fileName = match[2];
    imageVars[varName] = `/content/articles/${locale}/${slug}/${fileName}`;
  }

  // Replace image variables with actual paths
  processed = processed.replace(imageVarRegex, (match, varName) => {
    const imagePath = imageVars[varName];
    if (imagePath) {
      return `<Image src="${imagePath}"`;
    }
    return match;
  });

  // Clean up multiple empty lines
  processed = processed.replace(/\n{3,}/g, '\n\n');

  return processed.trim();
}

// Get raw MDX content for an article
export function getArticleContent(slug: string, locale: Locale): string | null {
  // Try locale-specific first
  let articlePath = path.join(contentDirectory, locale, slug, 'page.mdx');
  let usedLocale = locale;

  // Fallback to default locale
  if (!fs.existsSync(articlePath) && locale !== defaultLocale) {
    articlePath = path.join(contentDirectory, defaultLocale, slug, 'page.mdx');
    usedLocale = defaultLocale;
  }

  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(articlePath, 'utf8');
  return processContent(rawContent, slug, usedLocale);
}
