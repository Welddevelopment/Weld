import { SOURCE_VARIANTS } from "@/dynamic landing page/lib/sample-data";

export type SourceVariant = keyof typeof SOURCE_VARIANTS;

export function firstSearchParamValue(
  value: string | string[] | undefined
) {
  return Array.isArray(value) ? value[0] : value;
}

export function getSourceVariantFromRaw(source: string | null | undefined): SourceVariant {
  const normalized = String(source ?? "").trim().toLowerCase();

  if (normalized.includes("discord")) {
    return "discord";
  }

  if (normalized === "x" || normalized.includes("twitter")) {
    return "x";
  }

  if (normalized.includes("linkedin")) {
    return "linkedin";
  }

  return "default";
}

export function getSourceVariantFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
) {
  return getSourceVariantFromRaw(
    firstSearchParamValue(searchParams.utm_source) ??
      firstSearchParamValue(searchParams.src) ??
      firstSearchParamValue(searchParams.source)
  );
}

export function buildSearchString(
  searchParams: Record<string, string | string[] | undefined>,
  omittedKeys: string[] = []
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (omittedKeys.includes(key)) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry) {
          params.append(key, entry);
        }
      });
      return;
    }

    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}
