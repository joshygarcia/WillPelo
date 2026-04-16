import type { Metadata } from "next";
import { Inter, Anton, Black_Ops_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const blackOps = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-stencil",
  display: "swap",
});

const SITE_URL = "https://www.willnosecortaelpelo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "El Pelo de Will — Reto Real Madrid | Los Futbolitos",
    template: "%s | El Pelo de Will",
  },
  description:
    "¿Cuántos días lleva Will sin cortarse el pelo? Sigue el reto en vivo: el Real Madrid debe ganar 5 partidos seguidos sin penalti a favor. Inspirado en Los Futbolitos.",
  keywords: [
    "Will pelo",
    "Los Futbolitos",
    "Real Madrid",
    "reto pelo",
    "Will no se corta el pelo",
    "penalti Real Madrid",
    "racha Real Madrid",
    "Los Futbolitos reto",
    "Will Los Futbolitos",
    "futbol youtube",
    "La Liga",
    "Champions League",
  ],
  authors: [{ name: "@Josshygg", url: "https://www.instagram.com/josshygg/" }],
  creator: "@Josshygg",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "El Pelo de Will",
    title: "¡WILL NO SE CORTA EL PELO! — Reto Real Madrid",
    description:
      "Will prometió no cortarse el pelo hasta que el Real Madrid gane 5 seguidas sin penalti a favor. ¿Cuántos días lleva? ¡Míralo en vivo!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "El Pelo de Will — Reto Real Madrid | Los Futbolitos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "¡WILL NO SE CORTA EL PELO! — Reto Real Madrid",
    description:
      "Will prometió no cortarse el pelo hasta que el Real Madrid gane 5 seguidas sin penalti. ¿Cuántos días lleva?",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${anton.variable} ${blackOps.variable}`}
    >
      <body className="font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
