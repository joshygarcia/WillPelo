import type { Metadata } from "next";
import { Inter, Anton, Black_Ops_One } from "next/font/google";
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

export const metadata: Metadata = {
  title: "El Pelo de Will — Reto Real Madrid",
  description:
    "Cuenta los días que Will lleva sin cortarse el pelo a la espera de que el Real Madrid gane 5 partidos seguidos sin penalti a favor.",
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
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
