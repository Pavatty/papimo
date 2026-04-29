import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // LODGE — Framboise
        lodge: {
          50: "var(--lodge-50)",
          100: "var(--lodge-100)",
          300: "var(--lodge-300)",
          500: "var(--lodge-500)",
          600: "var(--lodge-600)",
          700: "var(--lodge-700)",
          800: "var(--lodge-800)",
          900: "var(--lodge-900)",
          DEFAULT: "var(--lodge-primary)",
        },
        // Particuliers — Turquoise
        pap: {
          50: "var(--pap-50)",
          100: "var(--pap-100)",
          500: "var(--pap-500)",
          600: "var(--pap-600)",
          700: "var(--pap-700)",
          DEFAULT: "var(--pap-primary)",
        },
        // Agences — Jaune taxi (texte noir)
        agency: {
          50: "var(--agency-50)",
          100: "var(--agency-100)",
          400: "var(--agency-400)",
          500: "var(--agency-500)",
          600: "var(--agency-600)",
          700: "var(--agency-700)",
          800: "var(--agency-800)",
          DEFAULT: "var(--agency-primary)",
        },
        // pro DEPRECATED — alias agency pour rétrocompat
        pro: {
          50: "var(--pro-50)",
          100: "var(--pro-100)",
          500: "var(--pro-500)",
          600: "var(--pro-600)",
          700: "var(--pro-700)",
          DEFAULT: "var(--pro-primary)",
        },
        // Promoteurs — Vert
        developer: {
          50: "var(--developer-50)",
          100: "var(--developer-100)",
          500: "var(--developer-500)",
          600: "var(--developer-600)",
          700: "var(--developer-700)",
          800: "var(--developer-800)",
          DEFAULT: "var(--developer-primary)",
        },
        sej: {
          50: "var(--sej-50)",
          100: "var(--sej-100)",
          500: "var(--sej-500)",
          700: "var(--sej-700)",
          coral: "var(--sej-coral)",
          coralHover: "var(--sej-coral-hover)",
          mimosa: "var(--sej-mimosa)",
          DEFAULT: "var(--sej-primary)",
        },
        cream: "#FBF6EC",
        ink: "#1A1A1A",
        bleu: {
          DEFAULT: "rgb(var(--bleu) / <alpha-value>)",
          hover: "#BE123C",
          soft: "rgb(var(--bleu-soft) / <alpha-value>)",
          pale: "rgb(var(--bleu-pale) / <alpha-value>)",
        },
        "bleu-soft": "rgb(var(--bleu-soft) / <alpha-value>)",
        "bleu-pale": "rgb(var(--bleu-pale) / <alpha-value>)",
        corail: {
          DEFAULT: "rgb(var(--corail) / <alpha-value>)",
          hover: "#DD5C3D",
          soft: "rgb(var(--corail-soft) / <alpha-value>)",
          pale: "rgb(var(--corail-pale) / <alpha-value>)",
        },
        "corail-soft": "rgb(var(--corail-soft) / <alpha-value>)",
        "corail-pale": "rgb(var(--corail-pale) / <alpha-value>)",
        creme: {
          DEFAULT: "rgb(var(--creme) / <alpha-value>)",
          foncee: "#F0E8D7",
          pale: "rgb(var(--creme-pale) / <alpha-value>)",
        },
        "creme-pale": "rgb(var(--creme-pale) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        "blanc-casse": "#FFFFFF",
        "ink-rgb": "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        encre: "#1A1A1A",
        muted: "#6B6B6B",
        line: "rgb(var(--line) / <alpha-value>)",
        bordurewarm: {
          tertiary: "#E8E0D0",
          secondary: "#D6CDB8",
        },
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
          "var(--font-dm-sans)",
          "var(--font-manrope)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(26,26,26,0.06)",
        "card-hover": "0 8px 24px rgba(26,26,26,0.10)",
      },
      maxWidth: {
        container: "80rem",
      },
      height: {
        header: "4rem",
      },
    },
  },
};

export default config;
