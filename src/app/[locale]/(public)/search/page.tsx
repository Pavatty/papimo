import { SearchPage } from "@/components/features/search/SearchPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <SearchPage />
    </Suspense>
  );
}
