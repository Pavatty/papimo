"use client";

import { useState } from "react";

type RoomItem = { id: string; room: string; note: string; files: File[] };

export function InventoryMobileTool() {
  const [items, setItems] = useState<RoomItem[]>([
    { id: crypto.randomUUID(), room: "Salon", note: "", files: [] },
  ]);

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <p className="text-ink-soft text-sm">
        Phase 1: upload manuel pièce par pièce. Phase 2: Vision AI à venir.
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border-line rounded-xl border p-3">
            <input
              value={item.room}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((it) =>
                    it.id === item.id ? { ...it, room: e.target.value } : it,
                  ),
                )
              }
              className="border-line w-full rounded-lg border px-2 py-1.5 text-sm"
              placeholder="Pièce"
            />
            <textarea
              value={item.note}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((it) =>
                    it.id === item.id ? { ...it, note: e.target.value } : it,
                  ),
                )
              }
              className="border-line mt-2 w-full rounded-lg border px-2 py-1.5 text-sm"
              placeholder="Notes"
            />
            <input
              type="file"
              multiple
              accept="image/*"
              className="mt-2 block text-xs"
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((it) =>
                    it.id === item.id
                      ? { ...it, files: Array.from(e.target.files ?? []) }
                      : it,
                  ),
                )
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setItems((prev) => [
            ...prev,
            { id: crypto.randomUUID(), room: "", note: "", files: [] },
          ])
        }
        className="bg-corail mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-white"
      >
        Ajouter une pièce
      </button>
    </section>
  );
}
