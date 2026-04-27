"use client";

import { useEffect, useMemo, useReducer } from "react";
import { useLocale, useTranslations } from "next-intl";

import { usePublishDraft } from "@/hooks/usePublishDraft";

import { Step1TransactionType } from "./steps/Step1TransactionType";
import { Step2Category } from "./steps/Step2Category";
import { Step3Location } from "./steps/Step3Location";
import { Step4Specs } from "./steps/Step4Specs";
import { Step5Photos } from "./steps/Step5Photos";
import { Step6PriceDescription } from "./steps/Step6PriceDescription";
import { Step7Pack } from "./steps/Step7Pack";
import type { ListingPack, PublishFormState } from "./types";

type Props = {
  initialData: PublishFormState;
  preferredCurrency?: "TND" | "EUR" | "USD" | "MAD" | "DZD";
  onQuitRequest?: () => void;
};

type Action =
  | { type: "patch"; payload: Partial<PublishFormState> }
  | { type: "setStep"; payload: number };

type State = {
  currentStep: number;
  form: PublishFormState;
};

function reducer(state: State, action: Action): State {
  if (action.type === "patch") {
    return { ...state, form: { ...state.form, ...action.payload } };
  }
  if (action.type === "setStep") {
    return { ...state, currentStep: action.payload };
  }
  return state;
}

const steps = [
  "Transaction",
  "Catégorie",
  "Localisation",
  "Caractéristiques",
  "Photos",
  "Prix & description",
  "Pack",
];

export function PublishStepper({
  initialData,
  preferredCurrency,
  onQuitRequest,
}: Props) {
  const t = useTranslations("publishPage");
  const locale = useLocale();
  const [state, dispatch] = useReducer(reducer, {
    currentStep: 1,
    form: initialData,
  });

  const draftPayload = useMemo(
    () => ({
      id: state.form.id,
      type: state.form.type,
      category: state.form.category,
      title: state.form.title,
      description: state.form.description,
      price: state.form.price,
      currency: state.form.currency,
      surface_m2: state.form.surface_m2,
      rooms: state.form.rooms,
      bedrooms: state.form.bedrooms,
      bathrooms: state.form.bathrooms,
      floor: state.form.floor,
      total_floors: state.form.total_floors,
      year_built: state.form.year_built,
      latitude: state.form.latitude,
      longitude: state.form.longitude,
      address: state.form.address,
      city: state.form.city,
      neighborhood: state.form.neighborhood,
      country_code: state.form.country_code,
      pack: state.form.pack,
      amenities: state.form.amenities,
    }),
    [state.form],
  );

  const { isSaving, lastSavedAt, savedId } = usePublishDraft(draftPayload);
  useEffect(() => {
    if (savedId && !state.form.id) {
      dispatch({ type: "patch", payload: { id: savedId } });
    }
  }, [savedId, state.form.id]);
  const progress = (state.currentStep / steps.length) * 100;

  return (
    <section className="border-line bg-paper rounded-3xl border p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="w-full">
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>{t("stepProgress", { current: state.currentStep })}</span>
            <span>{steps[state.currentStep - 1]}</span>
          </div>
          <div className="bg-bleu-soft h-2 rounded">
            <div
              className="bg-corail h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="ml-4 text-right font-mono text-xs text-gray-500">
          {isSaving
            ? t("draftSaving")
            : lastSavedAt
              ? t("draftSaved", {
                  time: lastSavedAt.toLocaleTimeString(locale),
                })
              : t("draftUnsaved")}
        </p>
      </div>

      <div className="min-h-[420px]">
        {state.currentStep === 1 ? (
          <Step1TransactionType
            value={state.form.type ?? "sale"}
            onChange={(type) => dispatch({ type: "patch", payload: { type } })}
          />
        ) : null}
        {state.currentStep === 2 ? (
          <Step2Category
            value={state.form.category ?? "apartment"}
            onChange={(category) =>
              dispatch({ type: "patch", payload: { category } })
            }
          />
        ) : null}
        {state.currentStep === 3 ? (
          <Step3Location
            value={{
              address: state.form.address,
              city: state.form.city,
              neighborhood: state.form.neighborhood,
              latitude: state.form.latitude,
              longitude: state.form.longitude,
              country_code: state.form.country_code,
            }}
            onChange={(patch) => dispatch({ type: "patch", payload: patch })}
          />
        ) : null}
        {state.currentStep === 4 ? (
          <Step4Specs
            value={{
              surface_m2: state.form.surface_m2,
              rooms: state.form.rooms,
              bedrooms: state.form.bedrooms,
              bathrooms: state.form.bathrooms,
              floor: state.form.floor,
              total_floors: state.form.total_floors,
              year_built: state.form.year_built,
              amenities: state.form.amenities,
            }}
            onChange={(patch) => dispatch({ type: "patch", payload: patch })}
          />
        ) : null}
        {state.currentStep === 5 ? (
          <Step5Photos
            {...(state.form.id ? { listingId: state.form.id } : {})}
            pack={state.form.pack as ListingPack}
            images={state.form.images}
            onImagesChange={(images) =>
              dispatch({ type: "patch", payload: { images } })
            }
          />
        ) : null}
        {state.currentStep === 6 ? (
          <Step6PriceDescription
            {...(preferredCurrency ? { preferredCurrency } : {})}
            value={{
              price: state.form.price,
              currency: state.form.currency,
              title: state.form.title,
              description: state.form.description,
              city: state.form.city,
              neighborhood: state.form.neighborhood,
              country_code: state.form.country_code,
              type: state.form.type ?? "sale",
              surface_m2: state.form.surface_m2,
            }}
            onChange={(patch) => dispatch({ type: "patch", payload: patch })}
          />
        ) : null}
        {state.currentStep === 7 ? (
          <Step7Pack
            value={state.form.pack}
            {...(state.form.id ? { listingId: state.form.id } : {})}
            onChange={(pack) => dispatch({ type: "patch", payload: { pack } })}
          />
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (state.currentStep === 1 && onQuitRequest) {
              onQuitRequest();
              return;
            }
            dispatch({
              type: "setStep",
              payload: Math.max(1, state.currentStep - 1),
            });
          }}
          disabled={state.currentStep === 1 && !onQuitRequest}
          className="border-line text-ink rounded-xl border bg-white px-4 py-2.5 text-sm disabled:opacity-50"
        >
          {state.currentStep === 1 && onQuitRequest
            ? t("cancelStep1")
            : t("previous")}
        </button>
        <button
          type="button"
          onClick={() =>
            dispatch({
              type: "setStep",
              payload: Math.min(7, state.currentStep + 1),
            })
          }
          disabled={state.currentStep === 7}
          className="bg-corail rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {t("next")}
        </button>
      </div>
    </section>
  );
}
