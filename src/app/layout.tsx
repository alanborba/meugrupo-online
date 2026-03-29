import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meugrupo.online'),
  title: "MeuGrupo.Online — Encontre e Divulgue Grupos",
  description:
    "A maior plataforma para divulgar e encontrar grupos de WhatsApp, Telegram, Discord e muito mais. Cadastre o seu grupo, canal, site ou rede social gratuitamente e alcance milhares de pessoas!",
  keywords: [
    "grupos whatsapp",
    "grupos telegram",
    "grupos discord",
    "canais youtube",
    "divulgar grupo",
    "encontrar grupo",
    "meugrupo",
    "meu grupo online"
  ],
  authors: [{ name: "MeuGrupo.Online" }],
  creator: "MeuGrupo.Online",
  publisher: "MeuGrupo.Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "MeuGrupo.Online — Encontre e Divulgue Grupos",
    description:
      "A maior plataforma para divulgar e encontrar grupos. Cadastre o seu agora e alcance novos seguidores diariamente!",
    url: "https://www.meugrupo.online",
    siteName: "MeuGrupo.Online",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeuGrupo.Online — Encontre e Divulgue Grupos",
    description: "A maior plataforma para divulgar e encontrar grupos. Cadastre o seu agora e alcance novos seguidores diariamente!",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MeuGrupo.Online",
              "url": "https://www.meugrupo.online",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.meugrupo.online/explorar?busca={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
