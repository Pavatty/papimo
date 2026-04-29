"use client";

import { format } from "date-fns";
import { CalendarOff, Check } from "lucide-react";
import { useState, useTransition } from "react";
import type { DateRange } from "react-day-picker";

import { setAvailability } from "@/app/actions/availability";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  listingId: string;
  blockedDates: string[];
};

export function HostCalendarManager({ listingId, blockedDates }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blocked = blockedDates.map((d) => new Date(d + "T00:00:00"));

  const action = (available: boolean) => {
    if (!range?.from || !range?.to) return;
    const dates: string[] = [];
    const cursor = new Date(range.from);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(range.to);
    end.setHours(0, 0, 0, 0);
    while (cursor <= end) {
      dates.push(format(cursor, "yyyy-MM-dd"));
      cursor.setDate(cursor.getDate() + 1);
    }
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await setAvailability({
        listingId,
        dates,
        available,
      });
      if (result.ok) {
        setSuccess(true);
        setRange(undefined);
        window.setTimeout(() => setSuccess(false), 2500);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="border-bordurewarm-tertiary bg-blanc-casse dark:bg-encre/95 rounded-card border p-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          modifiers={{ blocked }}
          modifiersClassNames={{
            blocked: "bg-coeur-soft text-coeur line-through",
          }}
          numberOfMonths={2}
        />
      </div>

      <div className="space-y-3">
        <div className="border-bordurewarm-tertiary bg-blanc-casse dark:bg-encre/95 rounded-card border p-5">
          <p className="text-encre dark:text-creme mb-2 text-sm font-semibold">
            Plage sélectionnée
          </p>
          {range?.from && range?.to ? (
            <p className="text-encre/70 dark:text-creme/70 text-sm">
              {format(range.from, "dd/MM/yyyy")} →{" "}
              {format(range.to, "dd/MM/yyyy")}
            </p>
          ) : (
            <p className="text-encre/60 dark:text-creme/60 text-sm">
              Sélectionnez une plage de dates dans le calendrier.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => action(false)}
              disabled={!range?.from || !range?.to || pending}
              className="bg-coeur hover:bg-coeur/90 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarOff className="h-4 w-4" aria-hidden />
              Bloquer
            </button>
            <button
              type="button"
              onClick={() => action(true)}
              disabled={!range?.from || !range?.to || pending}
              className="bg-vert hover:bg-vert-hover inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" aria-hidden />
              Libérer
            </button>
          </div>

          {success ? (
            <p className="bg-confiance-soft text-confiance mt-3 rounded-md px-3 py-2 text-xs">
              Disponibilité mise à jour.
            </p>
          ) : null}
          {error ? (
            <p className="bg-coeur-soft text-coeur mt-3 rounded-md px-3 py-2 text-xs">
              {error}
            </p>
          ) : null}
        </div>

        <div className="bg-sejours-sky/30 dark:bg-sejours-sky/15 rounded-md p-4">
          <p className="text-encre/70 dark:text-creme/70 text-xs leading-relaxed">
            Les dates bloquées (rouge) sont indisponibles pour les voyageurs.
            Les réservations confirmées bloquent automatiquement le calendrier ;
            cette page permet de bloquer manuellement (vacances perso, travaux,
            etc.).
          </p>
        </div>
      </div>
    </div>
  );
}
