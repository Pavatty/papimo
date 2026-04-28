import type { ReactNode } from "react";

import { getBrandSettings } from "@/data/repositories/app-settings";

import { Footer } from "./Footer";
import { Header } from "./Header";

export async function PublicLayout({ children }: { children: ReactNode }) {
  const brand = await getBrandSettings();
  const part1 = brand?.logo_part1 ?? "pap";
  const part2 = brand?.logo_part2 ?? "imo";

  return (
    <>
      <Header brandPart1={part1} brandPart2={part2} />
      <div className="min-h-[calc(100dvh-4rem)] flex-1">{children}</div>
      <Footer brandPart1={part1} brandPart2={part2} />
    </>
  );
}
