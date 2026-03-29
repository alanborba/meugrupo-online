import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MeuGrupo.Online — Encontre e Divulgue Grupos",
  description:
    "A maior plataforma para divulgar e encontrar grupos de WhatsApp, Telegram, Discord e muito mais. Cadastre seu grupo e alcance milhares de pessoas!",
  keywords: [
    "grupos whatsapp",
    "grupos telegram",
    "grupos discord",
    "divulgar grupo",
    "encontrar grupo",
    "meugrupo",
  ],
  openGraph: {
    title: "MeuGrupo.Online — Encontre e Divulgue Grupos",
    description:
      "A maior plataforma para divulgar e encontrar grupos. Cadastre o seu agora!",
    url: "https://meugrupo.online",
    siteName: "MeuGrupo.Online",
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
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
