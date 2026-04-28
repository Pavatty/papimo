import { CheckCircle2, FileText } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

type Params = { locale: string };

const TYPE_LABELS: Record<string, string> = {
  passport: "Passeport",
  id_card: "Carte d'identité",
  drivers_license: "Permis de conduire",
  selfie: "Selfie",
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-sejours-turquoise-light text-sejours-turquoise",
  pending: "bg-sejours-sun/30 text-sejours-sun-text",
  rejected: "bg-coeur-soft text-coeur",
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Approuvé",
  pending: "En cours",
  rejected: "Rejeté",
};

export default async function VerificationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("verification_documents")
    .select("id, document_type, status, created_at, rejection_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const isVerified = docs?.some((d) => d.status === "approved") ?? false;

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <header className="mb-6">
          <h1 className="text-encre dark:text-creme text-3xl font-bold">
            Vérification d&apos;identité
          </h1>
          <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
            Inspirez confiance aux hôtes et voyageurs LODGE Séjours.
          </p>
        </header>

        {isVerified ? (
          <div className="bg-sejours-turquoise-light border-sejours-turquoise rounded-card mb-8 flex items-center gap-3 border-2 p-5">
            <CheckCircle2
              className="text-sejours-turquoise h-6 w-6 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-sejours-turquoise text-base font-semibold">
                Compte vérifié
              </p>
              <p className="text-encre/70 mt-0.5 text-xs">
                Le badge &laquo;&nbsp;Vérifié&nbsp;&raquo; est maintenant
                visible sur votre profil.
              </p>
            </div>
          </div>
        ) : (
          <div className="border-bordurewarm-tertiary bg-blanc-casse rounded-card dark:bg-encre/95 mb-8 border p-6">
            <p className="text-encre dark:text-creme text-base font-medium">
              Pas encore vérifié
            </p>
            <p className="text-encre/70 dark:text-creme/70 mt-2 text-sm">
              Téléchargez votre passeport, carte d&apos;identité ou permis de
              conduire. Notre équipe vérifie sous 24h.
            </p>
            <button
              type="button"
              className="bg-sejours-coral hover:bg-sejours-coral-hover focus-visible:ring-sejours-coral mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Télécharger mes documents
            </button>
          </div>
        )}

        <section>
          <h2 className="text-encre dark:text-creme mb-3 text-base font-semibold">
            Historique
          </h2>
          {docs && docs.length > 0 ? (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="border-bordurewarm-tertiary bg-blanc-casse dark:bg-encre/95 flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div>
                    <p className="text-encre dark:text-creme text-sm font-medium">
                      {TYPE_LABELS[d.document_type] ?? d.document_type}
                    </p>
                    <p className="text-encre/60 dark:text-creme/60 text-xs">
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    {d.status === "rejected" && d.rejection_reason ? (
                      <p className="text-coeur mt-1 text-xs">
                        {d.rejection_reason}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${STATUS_STYLES[d.status] ?? "bg-creme-foncee text-encre"}`}
                  >
                    {STATUS_LABELS[d.status] ?? d.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-encre/60 text-sm">
              Aucun document soumis pour le moment.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
