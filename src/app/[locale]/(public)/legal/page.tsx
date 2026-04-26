import { Link } from "@/i18n/navigation";

export default function LegalIndexPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <h1 className="text-ink text-3xl font-bold">Informations légales</h1>
      <ul className="mt-5 space-y-2 text-sm">
        <li>
          <Link href="/legal/cgu" className="text-bleu underline">
            Conditions générales d&#39;utilisation
          </Link>
        </li>
        <li>
          <Link href="/legal/cgv" className="text-bleu underline">
            Conditions générales de vente
          </Link>
        </li>
        <li>
          <Link href="/legal/confidentialite" className="text-bleu underline">
            Politique de confidentialité
          </Link>
        </li>
        <li>
          <Link href="/legal/cookies" className="text-bleu underline">
            Politique cookies
          </Link>
        </li>
        <li>
          <Link href="/legal/mentions-legales" className="text-bleu underline">
            Mentions légales
          </Link>
        </li>
      </ul>
    </main>
  );
}
