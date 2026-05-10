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
    const snapshot = await buildInviteProgressSnapshot(params.inviteCode);

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
