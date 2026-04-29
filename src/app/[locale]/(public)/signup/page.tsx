import Image from "next/image";

import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { MagicLinkForm } from "@/components/features/auth/MagicLinkForm";
import { Link } from "@/i18n/navigation";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 inline-block">
            <span className="text-lodge text-2xl font-semibold tracking-tight">
              LODGE
            </span>
          </Link>

          <h1 className="text-ink mb-2 text-2xl font-medium">
            Créer un compte LODGE
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Publiez vos annonces et trouvez votre prochain bien.
          </p>

          <div className="space-y-4">
            <GoogleSignInButton />

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs tracking-wider text-gray-500 uppercase">
                ou
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <MagicLinkForm />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
            En continuant, vous acceptez nos{" "}
            <Link href="/legal/cgv" className="text-ink underline">
              Conditions Générales
            </Link>{" "}
            et notre{" "}
            <Link href="/legal/confidentialite" className="text-ink underline">
              Politique de Confidentialité
            </Link>
            .
          </p>

          <p className="mt-8 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-lodge font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
          alt="Salon lumineux Méditerranée"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </section>
    </main>
  );
}
