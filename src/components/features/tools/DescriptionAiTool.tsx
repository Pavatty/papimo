"use client";

import { useState, useTransition } from "react";

import { improveDescription } from "@/app/[locale]/(public)/outils/actions";

export function DescriptionAiTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [warning, setWarning] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border-line h-44 w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Collez une description ou un brief."
      />
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            const result = await improveDescription(input, {});
            setOutput(result.content);
            setWarning(result.warning ?? "");
          })
        }
        disabled={isPending || !input.trim()}
        className="bg-corail mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white"
      >
        Améliorer avec l&#39;IA
      </button>

      {warning ? <p className="text-ink-soft mt-2 text-xs">{warning}</p> : null}
      {output ? (
        <div className="bg-creme-pale mt-4 rounded-xl p-4">
          <pre className="text-ink text-sm whitespace-pre-wrap">{output}</pre>
          <button
            type="button"
            className="border-line mt-3 rounded-lg border bg-white px-3 py-2 text-xs"
            onClick={() => navigator.clipboard.writeText(output)}
          >
            Copier
          </button>
        </div>
      ) : null}
    </section>
  );
}
