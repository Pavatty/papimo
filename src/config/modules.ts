// Registry central des modules LODGE.
// LODGE = Immobilier + Séjours (2 modules uniquement).
// Les modules futurs (rentacar / experiences / services) ont été retirés —
// ils seront réintégrés si la traction des 2 verticales actuelles le justifie.

export interface ModuleConfig {
  id: string;
  name: { fr: string; en: string; ar: string };
  slug: string;
  icon: string; // nom d'icône lucide-react
  enabled: boolean;
  color: string; // tailwind color
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
      fr: "Vente, location et colocation immobilière",
      en: "Real estate sale, rental and shared housing",
      ar: "بيع وإيجار ومشاركة السكن",
    },
    order: 1,
  },
  sejours: {
    id: "sejours",
    name: { fr: "Séjours", en: "Stays", ar: "إقامات" },
    slug: "sejours",
    icon: "Palmtree",
    enabled: true,
    color: "red",
    description: {
      fr: "Locations saisonnières et vacances",
      en: "Holiday rentals and vacation stays",
      ar: "إيجارات موسمية وعطلات",
    },
    order: 2,
  },
};

export type ModuleId = keyof typeof MODULES;

export function getEnabledModules(): ModuleConfig[] {
  return Object.values(MODULES)
    .filter((m) => m.enabled)
    .sort((a, b) => a.order - b.order);
}

export function getAllModules(): ModuleConfig[] {
  return Object.values(MODULES).sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
  return Object.values(MODULES).find((m) => m.slug === slug);
}

export function getModuleById(id: string): ModuleConfig | undefined {
  return MODULES[id as ModuleId];
}

export function isModuleEnabled(id: string): boolean {
  return MODULES[id as ModuleId]?.enabled ?? false;
}

export const ENABLED_MODULE_IDS: ModuleId[] = (
  Object.keys(MODULES) as ModuleId[]
).filter((id) => MODULES[id]?.enabled === true);
