import type {
  ImmobilierPropertyType,
  ImmobilierTransactionType,
} from "@/types/modules";

type LocaleLabel = { fr: string; en: string; ar: string };

export const IMMOBILIER_TRANSACTION_TYPES: Record<
  ImmobilierTransactionType,
  { label: LocaleLabel; description?: LocaleLabel }
> = {
  sale: {
    label: { fr: "À vendre", en: "For Sale", ar: "للبيع" },
  },
  rent: {
    label: { fr: "À louer", en: "For Rent", ar: "للإيجار" },
  },
  furnished_rent: {
    label: {
      fr: "Location meublée",
      en: "Furnished Rental",
      ar: "إيجار مفروش",
    },
    description: {
      fr: "Location meublée de 1 à 12 mois",
      en: "Furnished rental from 1 to 12 months",
      ar: "إيجار مفروش من 1 إلى 12 شهرًا",
    },
  },
  colocation: {
    label: { fr: "Colocation", en: "Shared", ar: "مشاركة" },
  },
};

export const IMMOBILIER_PROPERTY_TYPES: Record<
  ImmobilierPropertyType,
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
  duplex: {
    label: { fr: "Duplex", en: "Duplex", ar: "دوبلكس" },
    icon: "Layers",
  },
  land: {
    label: { fr: "Terrain", en: "Land", ar: "أرض" },
    icon: "Map",
  },
  commercial: {
    label: { fr: "Local commercial", en: "Commercial", ar: "محل تجاري" },
    icon: "Store",
  },
  office: {
    label: { fr: "Bureau", en: "Office", ar: "مكتب" },
    icon: "Briefcase",
  },
  warehouse: {
    label: { fr: "Entrepôt", en: "Warehouse", ar: "مستودع" },
    icon: "Warehouse",
  },
  garage: {
    label: { fr: "Garage / Parking", en: "Garage / Parking", ar: "كراج" },
    icon: "Car",
  },
  building: {
    label: { fr: "Immeuble", en: "Building", ar: "مبنى" },
    icon: "Building2",
  },
  farm: {
    label: { fr: "Ferme", en: "Farm", ar: "مزرعة" },
    icon: "Tractor",
  },
  other: {
    label: { fr: "Autre", en: "Other", ar: "آخر" },
    icon: "Home",
  },
};
