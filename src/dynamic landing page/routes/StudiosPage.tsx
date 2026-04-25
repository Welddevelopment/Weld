import type { Metadata } from "next";
import { redirect } from "next/navigation";

import MarketingPage from "@/dynamic landing page/components/MarketingPage";
import {
  buildSearchString,
  firstSearchParamValue,
  getSourceVariantFromSearchParams
} from "@/dynamic landing page/lib/source-variant";

export const metadata: Metadata = {
  title: "weld. - Hire Roblox talent without thread diving.",
  description:
    "Screen shipped work, role fit, rates, and availability before your first message. Join the studio beta."
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
