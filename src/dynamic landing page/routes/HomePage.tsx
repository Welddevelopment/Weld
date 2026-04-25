import type { Metadata } from "next";
import { redirect } from "next/navigation";

import MarketingPage from "@/dynamic landing page/components/MarketingPage";
import {
  buildSearchString,
  firstSearchParamValue,
  getSourceVariantFromSearchParams
} from "@/dynamic landing page/lib/source-variant";

export const metadata: Metadata = {
  title: "weld. - Get discovered by Roblox studios.",
  description:
    "Build one Roblox profile that proves you ship, shows your rate and availability, and gets you better-fit studio intros."
};

export default function HomePage({
  searchParams = {}
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const requestedType = firstSearchParamValue(searchParams.type);

  if (requestedType === "studio") {
    const nextSearch = buildSearchString(searchParams, ["type"]);
    redirect(nextSearch ? `/studios?${nextSearch}` : "/studios");
  }

  return (
    <MarketingPage
      initialMode="developer"
      sourceVariant={getSourceVariantFromSearchParams(searchParams)}
      page="landing"
    />
  );
}
