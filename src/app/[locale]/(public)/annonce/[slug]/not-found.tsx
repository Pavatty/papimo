import Link from "next/link";

export default function ListingNotFound() {
  const locale = "fr";
  return (
    <div className="max-w-container mx-auto px-4 py-20 text-center">
      <h1 className="text-encre dark:text-creme mb-3 font-serif text-4xl">
        Annonce introuvable
      </h1>
      <p className="text-muted dark:text-creme/60 mb-8">
        Cette annonce a été retirée ou n&apos;existe pas.
      </p>
      <Link
        href={`/${locale}/search`}
        className="bg-corail hover:bg-corail-hover rounded-control inline-block px-6 py-3 font-medium text-white transition"
      >
        Voir toutes les annonces
      </Link>
    </div>
  );
}
