import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display-face",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-face",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: `${site.name} | Consultório em Palhoça`,
  description: site.description,
  metadataBase: new URL("https://wiggersodontologia.com.br"),
  openGraph: {
    title: site.fullName,
    description: site.description,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/video/wiggers-hero-rotate-scrub.mp4?v=25s"
          as="video"
          type="video/mp4"
          media="(min-width: 769px)"
        />
        <link
          rel="preload"
          href="/video/wiggers-hero-mobile-scrub.mp4?v=1"
          as="video"
          type="video/mp4"
          media="(max-width: 768px)"
        />
        <link rel="preload" href="/brand/wiggers-logo@2x.png" as="image" />
      </head>
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
