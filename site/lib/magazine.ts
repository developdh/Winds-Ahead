import data from '@/content/magazine.json';
export type MagazineIssue = Omit<typeof data.issues[number], 'corrections'> & { corrections: {date: string; body: {en: string; ko: string}}[] };
export const magazineIssues: MagazineIssue[] = data.issues;
export const findIssue = (id?: string) => magazineIssues.find(issue => issue.id === id);
export const shareImagePath = (locale: string, page: number, issue: MagazineIssue) => `/magazine/${issue.id}/edition-${issue.revision}/${locale}/${String(page).padStart(2, '0')}.jpg`;
export const sharePreviewPath = (locale: string, page: number, issue: MagazineIssue) => shareImagePath(locale, page, issue).replace('.jpg', '-preview.webp');
