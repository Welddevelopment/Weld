import { headers } from "next/headers";
import { notFound } from "next/navigation";

import InviteExperience from "@/dynamic-landing-page/components/InviteExperience";
import { buildInviteProgressSnapshot } from "@/dynamic-landing-page/lib/service";
import { getSourceVariantFromRaw } from "@/dynamic-landing-page/lib/source-variant";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params
}: {
  params: { inviteCode: string };
}) {
  try {
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || "https";
    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || `${proto}://${host}`;
    const snapshot = await buildInviteProgressSnapshot(params.inviteCode, origin);

    return (
      <InviteExperience
        initialSnapshot={snapshot}
        sourceVariant={getSourceVariantFromRaw(snapshot.lead.utmSource)}
      />
    );
  } catch {
    notFound();
  }
}
