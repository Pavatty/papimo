"use client";

import { KeyRound, Tag } from "lucide-react";

import type { TransactionType } from "../types";

type Props = {
  value?: TransactionType;
  onChange: (value: TransactionType) => void;
};

export function Step1TransactionType({ value, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        { id: "sale" as const, title: "Vente", icon: Tag },
        { id: "rent" as const, title: "Location", icon: KeyRound },
      ].map((option) => {
        const Icon = option.icon;
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-2xl border bg-white p-8 text-left transition-transform duration-200 hover:scale-[1.02] ${
              selected ? "border-bleu bg-bleu-pale" : "border-line"
            }`}
          >
            <Icon className="text-bleu mb-4 h-8 w-8" />
            <h3 className="text-ink text-xl font-semibold">{option.title}</h3>
          </button>
        );
      })}
    </div>
  );
}
