import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100dvh-4rem)] flex-1">{children}</div>
      <Footer />
    </>
  );
}
