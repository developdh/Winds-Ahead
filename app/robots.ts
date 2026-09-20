import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/en/watchlist', '/ko/watchlist'] }, sitemap: 'https://windsahead.com/sitemap.xml' };
}
