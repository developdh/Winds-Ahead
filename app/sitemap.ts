import type { MetadataRoute } from 'next';
import { cosmetics } from '@/lib/catalog';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/calendar', '/about', '/updates', ...cosmetics.map(c => `/cosmetics/${c.id}`)];
  return paths.flatMap(path => ['en', 'ko'].map(locale => ({
    url: `https://windsahead.com/${locale}${path}`,
    alternates: { languages: { en: `https://windsahead.com/en${path}`, ko: `https://windsahead.com/ko${path}` } },
  })));
}
