"use client";

import { differenceInDays, format } from "date-fns";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";

import { Calendar } from "@/components/ui/calendar";

export type BookingPanelListing = {
  id: string;
  base_price_per_night: number | null;
  currency: string;
  min_nights: number | null;
  max_nights: number | null;
  max_guests: number | null;
  instant_booking: boolean | null;
};

export type AvailabilityDay = {
  date: string;
  available: boolean;
};

type Props = {
  listing: BookingPanelListing;
  availability: AvailabilityDay[];
  serviceFeePercent?: number;
};

export function SejourBookingPanel({
  listing,
  availability,
  serviceFeePercent = 10,
}: Props) {
  const t = useTranslations("sejours");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);

  const disabledDates = useMemo(
    () =>
      availability
        .filter((d) => !d.available)
        .map((d) => new Date(d.date + "T00:00:00")),
    [availability],
  );

  const checkIn = range?.from;
  const checkOut = range?.to;
  const nights =
    checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 0) : 0;
  const pricePerNight = Number(listing.base_price_per_night ?? 0);
  const basePrice = nights * pricePerNight;
  const serviceFee = (basePrice * serviceFeePercent) / 100;
  const total = basePrice + serviceFee;
  const minNights = listing.min_nights ?? 1;
  const maxGuests = listing.max_guests ?? 10;
  const canReserve = nights >= minNights && guests > 0 && guests <= maxGuests;

  return (
    <aside className="border-sejours-turquoise bg-blanc-casse rounded-card dark:bg-encre/95 sticky top-24 border-2 p-5 shadow-md">
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-sejours-coral text-3xl font-bold">
          {pricePerNight.toLocaleString("fr-FR")} {listing.currency}
        </span>
        <span className="text-encre/60 dark:text-creme/60 text-sm">
          {" / "}
          {t("perNight")}
        </span>
      </div>

      {listing.instant_booking ? (
        <p className="bg-sejours-sun/30 text-sejours-sun-text mb-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t("instantBooking")}
        </p>
      ) : null}

      <div className="mb-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={[{ before: new Date() }, ...disabledDates]}
          numberOfMonths={1}
        />
      </div>

      {checkIn && checkOut ? (
        <div className="text-encre/70 dark:text-creme/70 mb-3 grid grid-cols-2 gap-2 text-xs">
          <div className="border-bordurewarm-tertiary rounded-md border p-2">
            <p className="text-[10px] tracking-wide uppercase opacity-70">
              {t("checkIn")}
            </p>
            <p className="text-encre dark:text-creme font-semibold">
              {format(checkIn, "dd/MM/yyyy")}
            </p>
          </div>
          <div className="border-bordurewarm-tertiary rounded-md border p-2">
            <p className="text-[10px] tracking-wide uppercase opacity-70">
              {t("checkOut")}
            </p>
            <p className="text-encre dark:text-creme font-semibold">
              {format(checkOut, "dd/MM/yyyy")}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-4">
        <label
          htmlFor="sejour-guests"
          className="text-encre dark:text-creme mb-1 block text-sm font-medium"
        >
          {t("guests")}
        </label>
        <input
          id="sejour-guests"
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
          className="border-bordurewarm-tertiary text-encre dark:text-creme dark:bg-encre/30 focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {nights > 0 ? (
        <div className="text-encre dark:text-creme mb-4 space-y-2 text-sm">
          <div className="text-encre/70 dark:text-creme/70 flex justify-between">
            <span>
              {nights} × {pricePerNight.toLocaleString("fr-FR")}{" "}
              {listing.currency}
            </span>
            <span>
              {basePrice.toLocaleString("fr-FR")} {listing.currency}
            </span>
          </div>
          <div className="text-encre/70 dark:text-creme/70 flex justify-between">
            <span>{t("serviceFee")}</span>
            <span>
              {serviceFee.toLocaleString("fr-FR")} {listing.currency}
            </span>
          </div>
          <div className="border-bordurewarm-tertiary flex justify-between border-t pt-2 font-semibold">
            <span>{t("totalLine")}</span>
            <span className="text-sejours-coral">
              {total.toLocaleString("fr-FR")} {listing.currency}
            </span>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canReserve}
        className="bg-sejours-coral hover:bg-sejours-coral-hover focus-visible:ring-sejours-coral w-full rounded-md py-3 text-sm font-semibold text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("reserve")}
      </button>

      {minNights > 1 ? (
        <p className="text-encre/60 dark:text-creme/60 mt-3 text-center text-xs">
          {t("minNights", { n: minNights })}
        </p>
      ) : null}
    </aside>
  );
}
