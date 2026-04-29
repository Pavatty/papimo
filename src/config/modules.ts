// Registry central des modules LODGE. Toggler enabled=true|false pour
// activer/désactiver une partie de la plateforme (nav + routes + filtres
// reposent sur cette source de vérité).

export interface ModuleConfig {
  id: string;
  name: { fr: string; en: string; ar: string };
  slug: string;
  icon: string; // nom d'icône lucide-react
  enabled: boolean;
  color: string; // tailwind color name
  description: { fr: string; en: string; ar: string };
  order: number;
}

export const MODULES: Record<string, ModuleConfig> = {
  immobilier: {
    id: "immobilier",
    name: { fr: "Immobilier", en: "Real Estate", ar: "عقارات" },
    slug: "immobilier",
    icon: "Building2",
    enabled: true,
    color: "blue",
    description: {
      fr: "Vente, location et colocation entre particuliers",
      en: "Sale, rental and shared housing between individuals",
      ar: "بيع وإيجار ومشاركة السكن بين الأفراد",
    },
    order: 1,
  },
  sejours: {
    id: "sejours",
    name: { fr: "Séjours", en: "Stays", ar: "إقامات" },
    slug: "sejours",
    icon: "Palmtree",
    enabled: true,
    color: "cyan",
    description: {
      fr: "Locations saisonnières et vacances",
      en: "Holiday rentals and vacation stays",
      ar: "إيجارات موسمية وعطلات",
    },
    order: 2,
  },
  rentacar: {
    id: "rentacar",
    name: {
      fr: "Location voitures",
      en: "Car Rental",
      ar: "تأجير سيارات",
    },
    slug: "rentacar",
    icon: "Car",
    enabled: false,
    color: "orange",
    description: {
      fr: "Location de voitures entre particuliers",
      en: "Car rental between individuals",
      ar: "تأجير سيارات بين الأفراد",
    },
    order: 3,
  },
  experiences: {
    id: "experiences",
    name: { fr: "Expériences", en: "Experiences", ar: "تجارب" },
    slug: "experiences",
    icon: "Compass",
    enabled: false,
    color: "purple",
    description: {
      fr: "Activités et expériences locales",
      en: "Local activities and experiences",
      ar: "أنشطة وتجارب محلية",
    },
    order: 4,
  },
  services: {
    id: "services",
    name: { fr: "Services", en: "Services", ar: "خدمات" },
    slug: "services",
    icon: "Wrench",
    enabled: false,
    color: "green",
    description: {
      fr: "Services à domicile et prestataires locaux",
      en: "Home services and local providers",
      ar: "خدمات منزلية ومقدمي خدمات محليين",
    },
    order: 5,
  },
};

export function getEnabledModules(): ModuleConfig[] {
  return Object.values(MODULES)
    .filter((m) => m.enabled)
    .sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
  return Object.values(MODULES).find((m) => m.slug === slug);
}

export function isModuleEnabled(id: string): boolean {
  return MODULES[id]?.enabled ?? false;
}
