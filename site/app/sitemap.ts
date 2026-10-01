import type { MetadataRoute } from 'next';
import { cosmetics } from '@/lib/catalog';
import { magazineIssues } from '@/lib/magazine';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/calendar', '/about', '/updates', '/magazine', ...magazineIssues.map(i => `/magazine/${i.id}`), ...cosmetics.map(c => `/cosmetics/${c.id}`)];
  return paths.flatMap(path => ['en', 'ko'].map(locale => ({
    url: `https://windsahead.com/${locale}${path}`,
    alternates: { languages: { en: `https://windsahead.com/en${path}`, ko: `https://windsahead.com/ko${path}` } },
  })));
}
