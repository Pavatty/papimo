import { notFound, redirect } from "next/navigation";

import { ReviewForm } from "@/components/features/sejours/ReviewForm";
import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

type Params = { locale: string; id: string };

export default async function ReviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, guest_id, host_id, listing_id, status, check_out_date")
    .eq("id", id)
    .maybeSingle();

  if (!booking) notFound();

  const isGuest = booking.guest_id === user.id;
  const isHost = booking.host_id === user.id;
  if (!isGuest && !isHost) notFound();

  const today = new Date().toISOString().slice(0, 10);
  if (booking.check_out_date > today) {
    return (
      <main className="bg-creme min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          <h1 className="text-encre dark:text-creme mb-3 text-3xl font-bold">
            Avis indisponible
          </h1>
          <p className="text-encre/70 dark:text-creme/70">
            Vous pourrez laisser un avis après la fin du séjour (
            {booking.check_out_date}).
          </p>
        </div>
      </main>
    );
  }

  if (
    booking.status === "cancelled_by_guest" ||
    booking.status === "cancelled_by_host"
  ) {
    return (
      <main className="bg-creme min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          <h1 className="text-encre dark:text-creme mb-3 text-3xl font-bold">
            Avis indisponible
          </h1>
          <p className="text-encre/70 dark:text-creme/70">
            Pas d&apos;avis sur une réservation annulée.
          </p>
        </div>
      </main>
    );
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", booking.id)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  if (existing) {
    return (
      <main className="bg-creme min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          <h1 className="text-encre dark:text-creme mb-3 text-3xl font-bold">
            Avis déjà publié
          </h1>
          <p className="text-encre/70 dark:text-creme/70">
            Vous avez déjà laissé un avis pour cette réservation.
          </p>
        </div>
      </main>
    );
  }

  const reviewType: "guest_to_host" | "host_to_guest" = isGuest
    ? "guest_to_host"
    : "host_to_guest";

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <header className="mb-6">
          <h1 className="text-encre dark:text-creme text-3xl font-bold">
            {reviewType === "guest_to_host"
              ? "Évaluer votre séjour"
              : "Évaluer votre voyageur"}
          </h1>
          <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
            Aidez la communauté LODGE Séjours à grandir avec un retour
            authentique.
          </p>
        </header>

        <ReviewForm
          bookingId={booking.id}
          reviewType={reviewType}
          redirectTo={`/${locale}/dashboard/reservations`}
        />
      </div>
    </main>
  );
}
