import { redirect } from "next/navigation";

import { ProfileEditForm } from "@/components/features/profile/ProfileEditForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfileEditPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="bg-creme-pale min-h-screen px-4 py-8">
      <ProfileEditForm
        profile={
          (profile as {
            full_name?: string | null;
            avatar_url?: string | null;
            phone?: string | null;
            bio?: string | null;
            preferred_language?: string | null;
            notifications_email?: boolean | null;
            notifications_push?: boolean | null;
            account_type?: string | null;
            verified_email?: boolean | null;
            verified_phone?: boolean | null;
            member_since?: string | null;
          }) ?? {}
        }
      />
    </main>
  );
}
