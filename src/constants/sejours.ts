import type {
  SejoursAccommodationType,
  SejoursPropertyType,
} from "@/types/modules";

type LocaleLabel = { fr: string; en: string; ar: string };

export const SEJOURS_PROPERTY_TYPES: Record<
  SejoursPropertyType,
  { label: LocaleLabel }
> = {
  entire_place: {
    label: { fr: "Logement entier", en: "Entire Place", ar: "مكان كامل" },
  },
  private_room: {
    label: { fr: "Chambre privée", en: "Private Room", ar: "غرفة خاصة" },
  },
  shared_room: {
    label: { fr: "Chambre partagée", en: "Shared Room", ar: "غرفة مشتركة" },
  },
};

export const SEJOURS_ACCOMMODATION_TYPES: Record<
  SejoursAccommodationType,
  { label: LocaleLabel; icon: string }
> = {
  apartment: {
    label: { fr: "Appartement", en: "Apartment", ar: "شقة" },
    icon: "Building",
  },
  house: {
    label: { fr: "Maison", en: "House", ar: "منزل" },
    icon: "Home",
  },
  villa: {
    label: { fr: "Villa", en: "Villa", ar: "فيلا" },
    icon: "Castle",
  },
  studio: {
    label: { fr: "Studio", en: "Studio", ar: "استوديو" },
    icon: "DoorClosed",
  },
  bungalow: {
    label: { fr: "Bungalow", en: "Bungalow", ar: "بنغل" },
    icon: "Home",
  },
  cottage: {
    label: { fr: "Chalet", en: "Cottage", ar: "كوخ" },
    icon: "Tent",
  },
  cabin: {
    label: { fr: "Cabane", en: "Cabin", ar: "كابينة" },
    icon: "TreePine",
  },
  chalet: {
    label: { fr: "Chalet montagne", en: "Chalet", ar: "شاليه" },
    icon: "Mountain",
  },
  boat: {
    label: { fr: "Bateau", en: "Boat", ar: "قارب" },
    icon: "Ship",
  },
  camper: {
    label: { fr: "Camping-car", en: "Camper", ar: "عربة تخييم" },
    icon: "Caravan",
  },
  other: {
    label: { fr: "Autre", en: "Other", ar: "آخر" },
    icon: "Home",
  },
};
