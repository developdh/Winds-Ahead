"use client";
import { useEffect, useState } from "react";
import {
  storedLocale,
  isLocale,
  rememberLocale,
} from "@/lib/language-preference";
import Landing from "@/components/landing";
import LoadingScene from "@/components/loading-scene";
export default function PreferenceGate({
  hasPreference,
  returnPath,
  children,
}: {
  hasPreference: boolean;
  returnPath: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(hasPreference);
  const [checked, setChecked] = useState(hasPreference);
  useEffect(() => {
    const url = new URL(location.href);
    const entry = url.searchParams.get("entry");
    if (isLocale(entry)) {
      rememberLocale(entry);
      url.searchParams.delete("entry");
      history.replaceState(history.state, "", url);
    }
    setReady(hasPreference || !!storedLocale());
    setChecked(true);
  }, [hasPreference]);
  if (!checked) return <LoadingScene />;
  return ready ? (
    children
  ) : (
    <Landing returnPath={returnPath} autoContinue={false} />
  );
}
