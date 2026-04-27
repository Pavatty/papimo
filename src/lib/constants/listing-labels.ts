import type {
  ListingTransactionType,
  ListingPropertyType,
  ListingAmenity,
  ListingHeatingType,
  ListingDPERating,
  ListingOrientation,
  ListingFurnishedLevel,
  ListingCondition,
} from "./listing-schema";

type Locale = "fr" | "en" | "ar";
type LabelMap<K extends string> = Record<K, Record<Locale, string>>;

export const TRANSACTION_TYPE_LABELS: LabelMap<ListingTransactionType> = {
  sale: { fr: "Vente", en: "Sale", ar: "بيع" },
  rent: { fr: "Location", en: "Rent", ar: "إيجار" },
  seasonal_rent: {
    fr: "Location saisonnière",
    en: "Seasonal rent",
    ar: "إيجار موسمي",
  },
  colocation: { fr: "Colocation", en: "Shared housing", ar: "سكن مشترك" },
};

export const PROPERTY_TYPE_LABELS: LabelMap<ListingPropertyType> = {
  apartment: { fr: "Appartement", en: "Apartment", ar: "شقة" },
  house: { fr: "Maison", en: "House", ar: "منزل" },
  villa: { fr: "Villa", en: "Villa", ar: "فيلا" },
  studio: { fr: "Studio", en: "Studio", ar: "استوديو" },
  duplex: { fr: "Duplex", en: "Duplex", ar: "دوبلكس" },
  land: { fr: "Terrain", en: "Land", ar: "أرض" },
  commercial_space: {
    fr: "Local commercial",
    en: "Commercial space",
    ar: "محل تجاري",
  },
  shop: { fr: "Boutique", en: "Shop", ar: "متجر" },
  office: { fr: "Bureau", en: "Office", ar: "مكتب" },
  warehouse: { fr: "Entrepôt", en: "Warehouse", ar: "مستودع" },
  garage_parking: {
    fr: "Garage / Parking",
    en: "Garage / Parking",
    ar: "كراج / موقف",
  },
  building: { fr: "Immeuble", en: "Building", ar: "عمارة" },
  farm: { fr: "Ferme", en: "Farm", ar: "مزرعة" },
  other: { fr: "Autre", en: "Other", ar: "أخرى" },
};

export const AMENITY_LABELS: LabelMap<ListingAmenity> = {
  parking: { fr: "Parking", en: "Parking", ar: "موقف سيارات" },
  elevator: { fr: "Ascenseur", en: "Elevator", ar: "مصعد" },
  balcony: { fr: "Balcon", en: "Balcony", ar: "شرفة" },
  terrace: { fr: "Terrasse", en: "Terrace", ar: "تراس" },
  garden: { fr: "Jardin", en: "Garden", ar: "حديقة" },
  pool: { fr: "Piscine", en: "Pool", ar: "حمام سباحة" },
  ac: { fr: "Climatisation", en: "Air conditioning", ar: "تكييف" },
  heating: { fr: "Chauffage", en: "Heating", ar: "تدفئة" },
  furnished: { fr: "Meublé", en: "Furnished", ar: "مفروش" },
  new_construction: { fr: "Neuf", en: "New construction", ar: "بناء جديد" },
  sea_view: { fr: "Vue mer", en: "Sea view", ar: "إطلالة على البحر" },
  mountain_view: {
    fr: "Vue montagne",
    en: "Mountain view",
    ar: "إطلالة على الجبل",
  },
  city_view: { fr: "Vue ville", en: "City view", ar: "إطلالة على المدينة" },
  fiber: { fr: "Fibre optique", en: "Fiber", ar: "ألياف بصرية" },
  security: { fr: "Sécurité", en: "Security", ar: "أمن" },
  caretaker: { fr: "Gardien", en: "Caretaker", ar: "حارس" },
  alarm: { fr: "Alarme", en: "Alarm", ar: "إنذار" },
  intercom: { fr: "Interphone", en: "Intercom", ar: "إنتركم" },
  double_glazing: {
    fr: "Double vitrage",
    en: "Double glazing",
    ar: "زجاج مزدوج",
  },
  fireplace: { fr: "Cheminée", en: "Fireplace", ar: "موقد" },
  cellar: { fr: "Cave", en: "Cellar", ar: "قبو" },
  dishwasher: { fr: "Lave-vaisselle", en: "Dishwasher", ar: "غسالة صحون" },
  washing_machine: {
    fr: "Lave-linge",
    en: "Washing machine",
    ar: "غسالة ملابس",
  },
};

export const HEATING_TYPE_LABELS: LabelMap<ListingHeatingType> = {
  central: {
    fr: "Chauffage central",
    en: "Central heating",
    ar: "تدفئة مركزية",
  },
  individual_gas: {
    fr: "Gaz individuel",
    en: "Individual gas",
    ar: "غاز فردي",
  },
  individual_electric: {
    fr: "Électrique individuel",
    en: "Individual electric",
    ar: "كهرباء فردية",
  },
  fuel: { fr: "Mazout", en: "Fuel", ar: "وقود" },
  solar: { fr: "Solaire", en: "Solar", ar: "شمسي" },
  none: { fr: "Aucun", en: "None", ar: "لا يوجد" },
};

export const DPE_RATING_LABELS: LabelMap<ListingDPERating> = {
  A: {
    fr: "A (très performant)",
    en: "A (very efficient)",
    ar: "أ (فعال جداً)",
  },
  B: { fr: "B", en: "B", ar: "ب" },
  C: { fr: "C", en: "C", ar: "ج" },
  D: { fr: "D", en: "D", ar: "د" },
  E: { fr: "E", en: "E", ar: "هـ" },
  F: { fr: "F", en: "F", ar: "و" },
  G: { fr: "G (peu performant)", en: "G (low efficiency)", ar: "ز (منخفض)" },
  not_specified: { fr: "Non précisé", en: "Not specified", ar: "غير محدد" },
};

export const ORIENTATION_LABELS: LabelMap<ListingOrientation> = {
  north: { fr: "Nord", en: "North", ar: "شمال" },
  south: { fr: "Sud", en: "South", ar: "جنوب" },
  east: { fr: "Est", en: "East", ar: "شرق" },
  west: { fr: "Ouest", en: "West", ar: "غرب" },
  north_east: { fr: "Nord-Est", en: "North-East", ar: "شمال شرق" },
  north_west: { fr: "Nord-Ouest", en: "North-West", ar: "شمال غرب" },
  south_east: { fr: "Sud-Est", en: "South-East", ar: "جنوب شرق" },
  south_west: { fr: "Sud-Ouest", en: "South-West", ar: "جنوب غرب" },
};

export const FURNISHED_LEVEL_LABELS: LabelMap<ListingFurnishedLevel> = {
  unfurnished: { fr: "Non meublé", en: "Unfurnished", ar: "غير مفروش" },
  semi_furnished: { fr: "Semi-meublé", en: "Semi-furnished", ar: "نصف مفروش" },
  fully_furnished: {
    fr: "Entièrement meublé",
    en: "Fully furnished",
    ar: "مفروش بالكامل",
  },
};

export const CONDITION_LABELS: LabelMap<ListingCondition> = {
  new: { fr: "Neuf", en: "New", ar: "جديد" },
  excellent: {
    fr: "Excellent état",
    en: "Excellent condition",
    ar: "حالة ممتازة",
  },
  good: { fr: "Bon état", en: "Good condition", ar: "حالة جيدة" },
  needs_refresh: { fr: "À rafraîchir", en: "Needs refresh", ar: "يحتاج تجديد" },
  needs_renovation: {
    fr: "À rénover",
    en: "Needs renovation",
    ar: "يحتاج ترميم",
  },
};

// Helper générique pour récupérer un label
export function getLabel<K extends string>(
  labelMap: LabelMap<K>,
  key: K,
  locale: Locale = "fr",
): string {
  return labelMap[key]?.[locale] ?? key;
}
