import {
  Heart,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Wrench,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ensureProfile } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { user, profile } = await ensureProfile();

  const profileWithFirst = profile as
    | (typeof profile & { first_name?: string | null })
    | null;
  const displayName =
    profile?.full_name?.trim() ||
    profileWithFirst?.first_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "vous";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <h1 className="font-display text-ink text-3xl font-bold">
        Bonjour {displayName}
      </h1>
      <p className="text-ink-soft mt-2 max-w-2xl">
        Bienvenue dans votre espace LODGE. Publiez une annonce, explorez le
        marché ou utilisez nos outils gratuits — tout est à portée de clic.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/publish"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex justify-center",
          )}
        >
          Publier ma première annonce
        </Link>
        <Link
          href="/search"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-bleu/30 text-bleu inline-flex justify-center",
          )}
        >
          Découvrir les annonces
        </Link>
        <Link
          href="/outils"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "inline-flex items-center justify-center gap-2",
          )}
        >
          <Wrench className="h-4 w-4" />
          Mes outils
        </Link>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/dashboard/listings"
          className="border-line bg-paper hover:border-bleu/30 group rounded-2xl border p-5 transition"
        >
          <LayoutGrid className="text-bleu mb-3 h-6 w-6" />
          <h2 className="text-ink text-base font-semibold">Mes annonces</h2>
          <p className="text-ink-soft mt-1 text-sm">
            Gérer vos brouillons et annonces publiées.
          </p>
          <span className="text-bleu mt-3 inline-block text-sm font-medium group-hover:underline">
            Ouvrir →
          </span>
        </Link>
        <Link
          href="/dashboard/listings?favorites=true"
          className="border-line bg-paper hover:border-corail/30 group rounded-2xl border p-5 transition"
        >
          <Heart className="text-corail mb-3 h-6 w-6" />
          <h2 className="text-ink text-base font-semibold">Mes favoris</h2>
          <p className="text-ink-soft mt-1 text-sm">
            Retrouvez les annonces que vous avez enregistrées.
          </p>
          <span className="text-corail mt-3 inline-block text-sm font-medium group-hover:underline">
            Voir tout →
          </span>
        </Link>
        <Link
          href="/messages"
          className="border-line bg-paper hover:border-bleu/30 group rounded-2xl border p-5 transition"
        >
          <MessageSquare className="text-bleu mb-3 h-6 w-6" />
          <h2 className="text-ink text-base font-semibold">Mes messages</h2>
          <p className="text-ink-soft mt-1 text-sm">
            Reprenez la conversation avec les acheteurs ou vendeurs.
          </p>
          <span className="text-bleu mt-3 inline-block text-sm font-medium group-hover:underline">
            Ouvrir →
          </span>
        </Link>
      </section>

      <section className="border-line bg-creme-pale mt-10 rounded-2xl border p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-ink flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="text-corail h-5 w-5" />
              Aller plus loin
            </h2>
            <p className="text-ink-soft mt-1 text-sm">
              Estimation, simulateur, frais d’achat : les outils LODGE pour
              préparer votre projet.
            </p>
          </div>
          <Link
            href="/outils/estimation"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "text-bleu mt-4 shrink-0 md:mt-0",
            )}
          >
            Voir les outils
          </Link>
        </div>
      </section>
    </main>
  );
}
