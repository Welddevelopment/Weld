import type { Metadata } from "next";
import { redirect } from "next/navigation";

import MarketingPage from "@/dynamic-landing-page/components/MarketingPage";
import {
  buildSearchString,
  firstSearchParamValue,
  getSourceVariantFromSearchParams
} from "@/dynamic-landing-page/lib/source-variant";

export const metadata: Metadata = {
  title: "weld. - Scout Roblox talent by proof, rate, and fit.",
  description:
    "Review friendly Roblox talent cards with role fit, rates, availability, links, proof, and shipped work before the first message."
};

export default function StudiosPage({
  searchParams = {}
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const requestedType = firstSearchParamValue(searchParams.type);

  if (requestedType === "developer") {
    const nextSearch = buildSearchString(searchParams, ["type"]);
    redirect(nextSearch ? `/?${nextSearch}` : "/");
  }

  return (
    <MarketingPage
      initialMode="studio"
      sourceVariant={getSourceVariantFromSearchParams(searchParams)}
      page="studios"
    />
  );
}
