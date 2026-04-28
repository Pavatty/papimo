import { BadgeCheck, Shield, Users, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TrustSignals() {
  const t = await getTranslations("home.trust");
  const items = [
    { icon: Shield, label: t("secure") },
    { icon: Users, label: t("p2p") },
    { icon: Zap, label: t("fast") },
    { icon: BadgeCheck, label: t("verified") },
  ];
  return (
    <section
      className="bg-creme dark:bg-encre/40 border-bordurewarm-tertiary dark:border-encre/20 border-y py-6"
      aria-label={t("aria")}
    >
      <div className="mx-auto max-w-7xl px-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="text-encre/70 dark:text-creme/70 flex items-center gap-2 text-sm"
            >
              <Icon className="text-bleu size-4" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
