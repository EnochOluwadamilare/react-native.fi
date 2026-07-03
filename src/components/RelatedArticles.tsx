import { Article } from '@/lib/articles';

import { ArticleCard } from '@/app/components/article-card';

interface RelatedArticlesProps {
  articles: Article[];
  locale: string;
}

export function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className='mt-16 border-t-[3px] border-[rgb(var(--ink))] pt-12'>
      <div className='mb-8 flex items-baseline gap-3'>
        <span className='font-display text-2xl font-extrabold text-[rgb(var(--poppy))]'>
          ✿
        </span>
        <h2 className='font-display text-2xl font-extrabold tracking-tight text-[rgb(var(--ink))] sm:text-3xl'>
          {locale === 'fi'
            ? 'Aiheeseen liittyvät artikkelit'
            : 'Related Articles'}
        </h2>
      </div>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
