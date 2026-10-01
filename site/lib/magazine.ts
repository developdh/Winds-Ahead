import data from '@/content/magazine.json';
export type MagazineIssue = Omit<typeof data.issues[number], 'corrections'> & { corrections: {date: string; body: {en: string; ko: string}}[] };
export const magazineIssues: MagazineIssue[] = data.issues;
export const findIssue = (id?: string) => magazineIssues.find(issue => issue.id === id);
export const shareImagePath = (locale: string, page: number) => `/magazine/issue-01/${locale}/${String(page).padStart(2, '0')}.png`;
