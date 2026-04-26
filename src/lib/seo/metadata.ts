import type { Metadata } from "next";

import { BRAND } from "@/config/brand";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? BRAND.url;
const SUPPORTED_LOCALES = BRAND.supportedLocales;

export function absoluteUrl(pathname: string) {
  return `${ORIGIN}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function localeAlternates(pathnameWithoutLocale: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      absoluteUrl(`/${locale}${pathnameWithoutLocale}`),
    ]),
  );
  return {
    canonical: absoluteUrl(`/${BRAND.defaultLocale}${pathnameWithoutLocale}`),
    languages,
  };
}

type BuildMetadataInput = {
  title: string;
  description: string;
  pathnameWithoutLocale: string;
  locale: string;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description,
  pathnameWithoutLocale,
  locale,
  ogImage,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(`/${locale}${pathnameWithoutLocale}`);
  return {
    title,
    description,
    alternates: localeAlternates(pathnameWithoutLocale),
    openGraph: {
      title,
      description,
      locale,
      type: "website",
      url: canonical,
      siteName: BRAND.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export type ListingJsonLdInput = {
  title: string;
  description: string | null;
  images: string[];
  datePosted: string;
  price: number;
  currency: string;
  countryCode: string;
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  url: string;
};

export function buildRealEstateJsonLd(input: ListingJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: input.title,
    description: input.description ?? "",
    url: input.url,
    image: input.images,
    datePosted: input.datePosted,
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: input.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: input.countryCode,
      addressLocality: input.city,
      streetAddress: input.address ?? undefined,
    },
    geo:
      input.latitude && input.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: input.latitude,
            longitude: input.longitude,
          }
        : undefined,
  };
}
