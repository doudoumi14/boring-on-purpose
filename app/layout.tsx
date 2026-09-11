import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boring on Purpose — investing you can understand in five minutes",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
