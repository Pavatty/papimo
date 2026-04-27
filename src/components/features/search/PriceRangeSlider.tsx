"use client";

type Props = {
  min?: number | undefined;
  max?: number | undefined;
  onChange: (next: {
    min?: number | undefined;
    max?: number | undefined;
  }) => void;
};

export function PriceRangeSlider({ min, max, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="Min"
          value={min ?? ""}
          onChange={(event) =>
            onChange({
              min: event.target.value
                ? Math.max(0, Number(event.target.value))
                : undefined,
              max,
            })
          }
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          type="number"
          min={0}
          step={1}
          placeholder="Max"
          value={max ?? ""}
          onChange={(event) =>
            onChange({
              min,
              max: event.target.value
                ? Math.max(0, Number(event.target.value))
                : undefined,
            })
          }
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {[50000, 100000, 200000, 500000].map((quickMin) => (
          <button
            key={quickMin}
            type="button"
            onClick={() => onChange({ min: quickMin, max })}
            className="border-line rounded-full border px-2 py-1 text-xs"
          >
            {quickMin.toLocaleString("fr-FR")}
          </button>
        ))}
      </div>
    </div>
  );
}
