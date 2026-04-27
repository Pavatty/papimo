import { DM_Sans, Geist, Instrument_Serif, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className={`${geist.variable} ${manrope.variable} ${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.mapbox.com" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://events.mapbox.com"
          crossOrigin=""
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
