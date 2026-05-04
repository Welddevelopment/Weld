import { redirect } from "next/navigation";

import { resolveLegacySignup } from "@/dynamic-landing-page/lib/service";

export default async function LegacySignupPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const inviteCode = await resolveLegacySignup(searchParams);

  if (!inviteCode) {
    redirect("/");
  }

  redirect(`/invite/${inviteCode}`);
}
