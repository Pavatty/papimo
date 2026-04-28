import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

type BookingRow = {
  id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  status: string;
  total_price: number;
  currency: string;
  listing: { title: string | null; city: string | null } | null;
  guest?: { full_name: string | null } | null;
};

type Params = { locale: string };

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-sejours-turquoise-light text-sejours-turquoise",
  pending_payment: "bg-sejours-sun/30 text-sejours-sun-text",
  cancelled_by_guest: "bg-coeur-soft text-coeur",
  cancelled_by_host: "bg-coeur-soft text-coeur",
  completed: "bg-confiance-soft text-confiance",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmée",
  pending_payment: "En attente de paiement",
  cancelled_by_guest: "Annulée (voyageur)",
  cancelled_by_host: "Annulée (hôte)",
  completed: "Terminée",
};

function formatDateRange(start: string, end: string): string {
  const fmt = (s: string) => {
    const d = new Date(s + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };
  return `${fmt(start)} → ${fmt(end)}`;
}

export default async function ReservationsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const supabase = await createClient();

  const { data: guestRaw } = await supabase
    .from("bookings")
    .select(
      "id, check_in_date, check_out_date, num_guests, status, total_price, currency, listing:listings(title, city)",
    )
    .eq("guest_id", user.id)
    .order("created_at", { ascending: false });

  const { data: hostRaw } = await supabase
    .from("bookings")
    .select(
      "id, check_in_date, check_out_date, num_guests, status, total_price, currency, listing:listings(title, city), guest:profiles!bookings_guest_id_fkey(full_name)",
    )
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  const guestBookings = (guestRaw ?? []) as unknown as BookingRow[];
  const hostBookings = (hostRaw ?? []) as unknown as BookingRow[];

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-8">
          <h1 className="text-encre dark:text-creme inline-flex items-center gap-2 text-3xl font-bold">
            <Sparkles className="text-sejours-turquoise h-7 w-7" aria-hidden />
            Mes réservations
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-sejours-turquoise mb-4 text-xl font-semibold">
              Vos voyages ({guestBookings.length})
            </h2>
            <ul className="space-y-3">
              {guestBookings.length === 0 ? (
                <li className="border-bordurewarm-tertiary text-encre/60 rounded-md border border-dashed p-6 text-center text-sm">
                  Aucun voyage planifié.
                </li>
              ) : null}
              {guestBookings.map((b) => (
                <li
                  key={b.id}
                  className="border-sejours-turquoise/40 bg-blanc-casse dark:bg-encre/95 rounded-card border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-encre dark:text-creme font-semibold">
                        {b.listing?.title ?? "—"}
                      </p>
                      <p className="text-encre/60 dark:text-creme/60 text-xs">
                        {b.listing?.city ?? ""} · {b.num_guests} voyageur(s)
                      </p>
                      <p className="text-encre/70 dark:text-creme/70 mt-2 text-sm">
                        {formatDateRange(b.check_in_date, b.check_out_date)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${STATUS_STYLES[b.status] ?? "bg-creme-foncee text-encre"}`}
                    >
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-sejours-coral mt-3 text-sm font-semibold">
                    {Number(b.total_price).toLocaleString("fr-FR")} {b.currency}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sejours-coral mb-4 text-xl font-semibold">
              Vos hôtes ({hostBookings.length})
            </h2>
            <ul className="space-y-3">
              {hostBookings.length === 0 ? (
                <li className="border-bordurewarm-tertiary text-encre/60 rounded-md border border-dashed p-6 text-center text-sm">
                  Aucun voyageur pour vos annonces.
                </li>
              ) : null}
              {hostBookings.map((b) => (
                <li
                  key={b.id}
                  className="border-sejours-coral/40 bg-blanc-casse dark:bg-encre/95 rounded-card border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-encre dark:text-creme font-semibold">
                        {b.listing?.title ?? "—"}
                      </p>
                      <p className="text-encre/60 dark:text-creme/60 text-xs">
                        Voyageur : {b.guest?.full_name ?? "—"} · {b.num_guests}{" "}
                        pers.
                      </p>
                      <p className="text-encre/70 dark:text-creme/70 mt-2 text-sm">
                        {formatDateRange(b.check_in_date, b.check_out_date)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${STATUS_STYLES[b.status] ?? "bg-creme-foncee text-encre"}`}
                    >
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-sejours-coral mt-3 text-sm font-semibold">
                    {Number(b.total_price).toLocaleString("fr-FR")} {b.currency}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
