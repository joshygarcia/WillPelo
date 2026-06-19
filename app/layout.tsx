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
  verification: {
    google: "jzJFtcmF5qSa6v3qcospGCYePEx3HSwzVLi8lC2pNRc",
  },
  title: {
    default: "¡ÚLTIMA HORA! Will abandona el reto y se tiñe de rubio",
    template: "%s | El Pelo de Will",
  },
  description:
    "BOMBAZO: Will tiró la toalla en el día 128 SIN cortarse el pelo. Se tiñó de RUBIO por otra apuesta y el reto del Real Madrid nunca se cumplió. ¡Mira el video!",
  keywords: [
    "Will rubio",
    "Will abandona el reto",
    "reto del pelo de Will",
    "Will se tiñe de rubio",
    "Will día 128",
    "Los Futbolitos",
    "Will Los Futbolitos",
    "reto Real Madrid penalti",
    "willnosecortaelpelo",
    "Will no se corta el pelo",
    "Will pelo rubio platino",
    "última hora Will pelo",
  ],
  authors: [{ name: "@Josshygg", url: "https://www.instagram.com/josshygg/" }],
  creator: "@Josshygg",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "El Pelo de Will",
    title: "¡WILL ABANDONA EL RETO! — Día 128, ahora es RUBIO",
    description:
      "Will tiró la toalla en el día 128 sin cortarse el pelo: se tiñó de rubio por otra apuesta. El reto del Real Madrid nunca se cumplió. ¡Mira el video!",
    // og:image y twitter:image los genera automáticamente app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "¡WILL ABANDONA EL RETO! — Día 128, ahora es RUBIO",
    description:
      "Will se rindió en el día 128 sin cortarse el pelo: se tiñó de rubio por otra apuesta. El reto del Real Madrid nunca se cumplió.",
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
