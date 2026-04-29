import { Calendar as CalendarIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { HostCalendarManager } from "@/components/features/sejours/HostCalendarManager";
import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

type Params = { locale: string; id: string };

export default async function HostCalendarPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, owner_id, rental_type")
    .eq("id", id)
    .maybeSingle();

  if (!listing || listing.owner_id !== user.id) notFound();
  if (listing.rental_type !== "short_term") {
    return (
      <main className="bg-creme min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
          <p className="text-encre/70">
            Le calendrier de disponibilité n&apos;est disponible que pour les
            annonces de type Séjours (short_term).
          </p>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: avail } = await supabase
    .from("availability_calendars")
    .select("date, available")
    .eq("listing_id", id)
    .gte("date", today)
    .order("date");

  const blockedDates = (avail ?? [])
    .filter((d) => !d.available)
    .map((d) => d.date);

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-6">
          <h1 className="text-encre dark:text-creme inline-flex items-center gap-2 text-3xl font-bold">
            <CalendarIcon
              className="text-sejours-turquoise h-7 w-7"
              aria-hidden
            />
            Calendrier de {listing.title}
          </h1>
          <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
            Gérez vos disponibilités. Bloquez ou libérez des plages de dates.
          </p>
        </header>

        <HostCalendarManager
          listingId={listing.id}
          blockedDates={blockedDates}
        />
      </div>
    </main>
  );
}
