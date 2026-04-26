import { Heart, LayoutGrid, LogOut, MessageSquare } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { signOut } from "@/lib/auth/actions";
import { ensureProfile } from "@/lib/auth/session";

export default async function DashboardPage() {
  const { user, profile } = await ensureProfile();

  const fullName = profile?.full_name ?? user?.email ?? "Utilisateur";
  const firstName = fullName.split(" ")[0] ?? "Utilisateur";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className="bg-creme-pale min-h-screen">
      <header className="border-line bg-paper border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <div className="bg-bleu-soft text-bleu inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
              {initials}
            </div>
            <div className="text-right">
              <p className="text-ink text-sm font-semibold">{fullName}</p>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-ink-soft hover:text-bleu inline-flex items-center gap-1 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="font-display text-ink text-3xl font-bold">
          Bonjour {firstName}
        </h1>
        <p className="text-ink-soft mt-2">
          Bienvenue dans votre espace papimo.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="border-line bg-paper rounded-2xl border p-5">
            <LayoutGrid className="text-bleu mb-3 h-6 w-6" />
            <h2 className="text-ink text-base font-semibold">Mes annonces</h2>
            <p className="text-ink-soft mt-1 text-sm">Bientôt disponible.</p>
          </article>
          <article className="border-line bg-paper rounded-2xl border p-5">
            <Heart className="text-corail mb-3 h-6 w-6" />
            <h2 className="text-ink text-base font-semibold">Mes favoris</h2>
            <p className="text-ink-soft mt-1 text-sm">Bientôt disponible.</p>
          </article>
          <article className="border-line bg-paper rounded-2xl border p-5">
            <MessageSquare className="text-bleu mb-3 h-6 w-6" />
            <h2 className="text-ink text-base font-semibold">Mes messages</h2>
            <p className="text-ink-soft mt-1 text-sm">Bientôt disponible.</p>
          </article>
        </section>
      </main>

      <footer className="border-line bg-paper mt-12 border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 text-xs text-gray-500">
          © papimo
        </div>
      </footer>
    </div>
  );
}
