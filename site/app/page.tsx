import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Landing from "@/components/landing";
import { isLocale, LOCALE_COOKIE } from "@/lib/language-preference";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const jar = await cookies();
  const locale = jar.get(LOCALE_COOKIE)?.value;
  if (isLocale(locale) && query.welcome !== "1") redirect(`/${locale}`);
  return <Landing autoContinue={query.welcome !== "1"} />;
}
