import {
  Cog,
  DollarSign,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { SettingInput } from "@/components/admin/SettingInput";
import { SettingToggle } from "@/components/admin/SettingToggle";
import { getAppSettingsByCategory } from "@/lib/settings";

const NUMBER_KEY_HINTS = new Set([
  "sejours_commission_percent",
  "sejours_host_fee_percent",
  "sejours_guest_fee_percent",
  "free_listings_limit_individual",
  "free_listings_limit_agency",
  "pro_plan_starter_price",
  "pro_plan_business_price",
  "pro_plan_premium_price",
  "listing_price_min",
  "listing_price_max",
  "listing_photos_min",
  "listing_photos_max",
  "listing_description_min_chars",
  "booking_cancellation_limit",
  "pricing_weekend_increase_percent",
  "pricing_summer_increase_percent",
  "pricing_longstay_7days_discount",
  "pricing_longstay_30days_discount",
  "rate_limit_publish_per_day",
  "anti_agency_max_free_listings",
]);

const BOOLEAN_KEY_HINTS = new Set([
  "sejours_enabled",
  "instant_booking_enabled",
  "reviews_enabled",
  "verification_required",
  "ai_recommendations_enabled",
  "messaging_enabled",
]);

const SECTIONS: Array<{
  category: string;
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}> = [
  { category: "monetization", title: "Monétisation", icon: DollarSign },
  { category: "features", title: "Features", icon: Sparkles },
  { category: "moderation", title: "Modération", icon: ShieldCheck },
  { category: "pricing", title: "Pricing dynamique", icon: TrendingUp },
];

export const metadata = {
  title: "Paramètres LODGE — Admin",
};

export default async function AdminSettingsPage() {
  const sections = await Promise.all(
    SECTIONS.map(async (s) => ({
      ...s,
      items: await getAppSettingsByCategory(s.category),
    })),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-encre dark:text-creme inline-flex items-center gap-2 text-3xl font-bold">
          <Cog className="text-vert h-7 w-7" aria-hidden />
          Paramètres LODGE
        </h1>
        <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
          Toutes les valeurs DB-driven — modifiables sans déploiement.
        </p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          if (section.items.length === 0) return null;

          return (
            <section
              key={section.category}
              className="border-bordurewarm-tertiary bg-blanc-casse dark:bg-encre/95 rounded-card border-2 p-6"
            >
              <h2 className="text-encre dark:text-creme mb-4 inline-flex items-center gap-2 text-xl font-semibold">
                <Icon className="text-vert h-5 w-5" aria-hidden />
                {section.title}
              </h2>

              {section.category === "features" ? (
                <div className="space-y-2">
                  {section.items.map((item) =>
                    BOOLEAN_KEY_HINTS.has(item.key) ? (
                      <SettingToggle
                        key={item.key}
                        label={item.description ?? item.key}
                        settingKey={item.key}
                        value={item.value === "true"}
                        description={item.key}
                      />
                    ) : (
                      <SettingInput
                        key={item.key}
                        label={item.description ?? item.key}
                        settingKey={item.key}
                        value={item.value}
                        description={item.key}
                        type="text"
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <SettingInput
                      key={item.key}
                      label={item.description ?? item.key}
                      settingKey={item.key}
                      value={item.value}
                      description={item.key}
                      type={NUMBER_KEY_HINTS.has(item.key) ? "number" : "text"}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
