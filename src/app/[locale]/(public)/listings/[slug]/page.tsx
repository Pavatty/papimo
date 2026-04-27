import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Legacy route redirect : /listings/[slug] → /annonce/[slug]
export default async function LegacyListingRedirect({ params }: PageProps) {
  const { locale, slug } = await params;
  permanentRedirect(`/${locale}/annonce/${slug}`);
}
