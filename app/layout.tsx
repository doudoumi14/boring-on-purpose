import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// The same pairing as adembrouri.com: Source Serif 4 for the titles, Source
// Sans 3 for everything read. next/font serves both from this site, with
// fallbacks sized to them.
const display = Source_Serif_4({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] });
const text = Source_Sans_3({ variable: "--font-text", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boring on Purpose: investing you can understand in five minutes",
  description:
    "A free, no-signup tool that turns your age, savings and retirement goal into a plain index-fund plan. No stock picking, no jargon, nothing stored.",
  openGraph: {
    title: "Boring on Purpose",
    description:
      "Investing should take five minutes to understand. Build a plain index-fund plan for your retirement.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
