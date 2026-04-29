import {
  Heart,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { ensureProfile } from "@/lib/auth/session";

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
    <main className="bg-cream min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-ink text-3xl font-medium">Bonjour {displayName}</h1>
        <p className="mt-2 max-w-2xl text-base text-gray-500">
          Bienvenue dans votre espace LODGE. Publiez une annonce, explorez le
          marché ou utilisez nos outils gratuits.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/publish"
            className="bg-lodge hover:bg-lodge-700 inline-flex justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            Publier ma première annonce
          </Link>
          <Link
            href="/search"
            className="text-ink inline-flex justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Découvrir les annonces
          </Link>
          <Link
            href="/outils"
            className="text-ink inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            <Wrench className="h-4 w-4" />
            Mes outils
          </Link>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <Link
            href="/dashboard/listings"
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="bg-lodge-50 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <LayoutGrid className="text-lodge h-5 w-5" />
            </div>
            <h2 className="text-ink text-base font-medium">Mes annonces</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gérer vos brouillons et annonces publiées.
            </p>
            <span className="text-lodge mt-3 inline-block text-sm font-medium group-hover:underline">
              Ouvrir →
            </span>
          </Link>
          <Link
            href="/dashboard/favoris"
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="bg-lodge-50 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Heart className="text-lodge h-5 w-5" />
            </div>
            <h2 className="text-ink text-base font-medium">Mes favoris</h2>
            <p className="mt-1 text-sm text-gray-500">
              Retrouvez les annonces que vous avez enregistrées.
            </p>
            <span className="text-lodge mt-3 inline-block text-sm font-medium group-hover:underline">
              Voir tout →
            </span>
          </Link>
          <Link
            href="/messages"
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="bg-lodge-50 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <MessageSquare className="text-lodge h-5 w-5" />
            </div>
            <h2 className="text-ink text-base font-medium">Mes messages</h2>
            <p className="mt-1 text-sm text-gray-500">
              Reprenez la conversation avec acheteurs ou vendeurs.
            </p>
            <span className="text-lodge mt-3 inline-block text-sm font-medium group-hover:underline">
              Ouvrir →
            </span>
          </Link>
        </section>

        <section className="bg-lodge-50 mt-10 rounded-xl p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-ink inline-flex items-center gap-2 text-lg font-medium">
                <Sparkles className="text-lodge h-5 w-5" />
                Aller plus loin
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Estimation, simulateur, frais d&apos;achat — les outils LODGE
                pour préparer votre projet.
              </p>
            </div>
            <Link
              href="/outils/estimation"
              className="bg-lodge hover:bg-lodge-700 inline-flex shrink-0 justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Voir les outils
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
