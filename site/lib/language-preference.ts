import type { Locale } from "@/lib/catalog";
export const LOCALE_COOKIE = "winds-ahead-locale";
export const LOCALE_STORAGE = "winds-ahead:locale:v1";
let sessionLocale: Locale | null = null;
export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ko";
}
export function storedLocale(): Locale | null {
  if (sessionLocale) return sessionLocale;
  try {
    const value = localStorage.getItem(LOCALE_STORAGE);
    if (isLocale(value)) return value;
  } catch {}
  try {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(LOCALE_COOKIE + "="))
      ?.split("=")[1];
    return isLocale(cookie) ? cookie : null;
  } catch {
    return null;
  }
}
export function rememberLocale(locale: Locale): boolean {
  sessionLocale = locale;
  let persisted = false;
  try {
    localStorage.setItem(LOCALE_STORAGE, locale);
    persisted = localStorage.getItem(LOCALE_STORAGE) === locale;
  } catch {}
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    persisted ||= document.cookie
      .split("; ")
      .includes(`${LOCALE_COOKIE}=${locale}`);
  } catch {}
  return persisted;
}
