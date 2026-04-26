import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { MagicLinkForm } from "@/components/features/auth/MagicLinkForm";
import { WhatsAppFlow } from "@/components/features/auth/WhatsAppFlow";
import { Logo } from "@/components/shared/Logo";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  return (
    <main className="bg-creme-pale min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-[480px] space-y-6">
            <Logo size="lg" />
            <h1 className="font-display text-ink text-4xl leading-tight font-bold">
              Connexion à <span className="text-bleu">pap</span>
              <span className="text-corail">imo</span>
            </h1>

            <MagicLinkForm />

            <div className="flex items-center gap-3">
              <div className="bg-line h-px flex-1" />
              <span className="text-ink-soft text-xs">ou</span>
              <div className="bg-line h-px flex-1" />
            </div>

            <GoogleSignInButton />
            <WhatsAppFlow />

            <p className="text-ink-soft text-sm">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-bleu font-medium">
                Créer mon compte
              </Link>
            </p>
          </div>
        </section>

        <aside className="from-bleu to-corail hidden items-center justify-center bg-gradient-to-br p-12 lg:flex">
          <div className="rounded-3xl border border-white/30 bg-white/10 p-14 text-center backdrop-blur">
            <p className="font-display text-6xl font-bold text-white">papimo</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
