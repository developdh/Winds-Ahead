import { cookies } from "next/headers";
import PreferenceGate from "@/components/preference-gate";
import { isLocale, LOCALE_COOKIE } from "@/lib/language-preference";
import { notFound } from "next/navigation";
import SiteApp from "@/components/site-app";
import { findCosmetic, nameOf, pageNames, descriptions, type Locale, type View } from "@/lib/catalog";
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
function resolve(locale: string, slug: string[] = []) {
  if (locale !== "en" && locale !== "ko") return null;
  if (!slug.length)
    return { locale: locale as Locale, view: "catalog" as View };
  if (slug.length === 2 && slug[0] === "cosmetics" && findCosmetic(slug[1]))
    return {
      locale: locale as Locale,
      view: "detail" as View,
      itemId: slug[1],
    };
  if (
    slug.length === 1 &&
    ["calendar", "watchlist", "updates", "about"].includes(slug[0])
  )
    return { locale: locale as Locale, view: slug[0] as View };
  return null;
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const route = resolve(locale, slug);
  if (!route) return { title: "Not found · Winds Ahead" };
  const query = await searchParams;
  const selectedId = route.itemId ?? (["catalog", "calendar", "watchlist"].includes(route.view) && typeof query.item === "string" ? query.item : undefined);
  const item = selectedId ? findCosmetic(selectedId) : undefined;
  const title = item
    ? nameOf(item, route.locale)
    : pageNames[route.view as keyof typeof pageNames]?.[route.locale];
  const canonical = item ? `/${locale}/cosmetics/${item.id}` : `/${locale}${slug?.length ? "/" + slug.join("/") : ""}`;
  const description = item ? descriptions[item.id][route.locale] : locale === "ko"
    ? "연운 중국·글로벌 외관, 획득 정보와 출시 일정. 공식 발표와 운영자 예상을 구분해 확인하세요."
    : "Where Winds Meet cosmetics, acquisition details and release schedules. Official announcements and editorial estimates stay separate.";
  return {
    title: `${title} · Winds Ahead / 연운경`,
    description,
    openGraph: { title: `${title} · Winds Ahead`, description, url: canonical, siteName: "Winds Ahead · 연운경", locale: locale === "ko" ? "ko_KR" : "en_US", type: "website" },
    robots: route.view === "watchlist" ? { index: false, follow: true } : undefined,
    alternates: {
      canonical,
      languages: {
        en: item ? `/en/cosmetics/${item.id}` : `/en${slug?.length ? "/" + slug.join("/") : ""}`,
        ko: item ? `/ko/cosmetics/${item.id}` : `/ko${slug?.length ? "/" + slug.join("/") : ""}`,
      },
    },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const route = resolve(locale, slug);
  if (!route) notFound();
  const jar = await cookies();
  const query = await searchParams;
  const hasPreference =
    isLocale(jar.get(LOCALE_COOKIE)?.value) || query.entry === locale;
  return (
    <PreferenceGate
      hasPreference={hasPreference}
      returnPath={slug?.length ? "/" + slug.join("/") : ""}
    >
      <SiteApp {...route} />
    </PreferenceGate>
  );
}
