import { Suspense } from "react";

import { SearchPage } from "@/components/features/search/SearchPage";
import {
  getPropertyTypes,
  getTransactionTypes,
} from "@/data/repositories/taxonomies";

export default async function Page() {
  const [transactionTypes, propertyTypes] = await Promise.all([
    getTransactionTypes(),
    getPropertyTypes(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <SearchPage
        transactionTypes={transactionTypes.map((t) => ({
          code: t.code,
          label_fr: t.label_fr,
          label_ar: t.label_ar,
          label_en: t.label_en,
        }))}
        propertyTypes={propertyTypes.map((p) => ({
          code: p.code,
          label_fr: p.label_fr,
          label_ar: p.label_ar,
          label_en: p.label_en,
        }))}
      />
    </Suspense>
  );
}
