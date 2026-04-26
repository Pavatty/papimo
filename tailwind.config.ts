import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bleu: "rgb(var(--bleu) / <alpha-value>)",
        "bleu-soft": "rgb(var(--bleu-soft) / <alpha-value>)",
        "bleu-pale": "rgb(var(--bleu-pale) / <alpha-value>)",
        corail: "rgb(var(--corail) / <alpha-value>)",
        "corail-soft": "rgb(var(--corail-soft) / <alpha-value>)",
        "corail-pale": "rgb(var(--corail-pale) / <alpha-value>)",
        creme: "rgb(var(--creme) / <alpha-value>)",
        "creme-pale": "rgb(var(--creme-pale) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        green: "rgb(var(--green) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        display: [
          "var(--font-geist)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-manrope)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
};

export default config;
