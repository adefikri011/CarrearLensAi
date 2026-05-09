import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CareerLens AI | Temukan Karier Terbaikmu",
  description: "Platform analisis karier berbasis AI yang membantu siapa saja — pelajar, fresh graduate, hingga profesional — menemukan jalur karier terbaik, menganalisis CV, dan membangun roadmap sukses.",
  keywords: ["analisis karier", "AI career", "CV analyzer", "roadmap karier", "Indonesia"],
  authors: [{ name: "CareerLens AI" }],
  openGraph: {
    title: "CareerLens AI | Temukan Karier Terbaikmu",
    description: "Analisis potensi kariermu dengan kecerdasan buatan terdepan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn(inter.variable)}>
      <body className="font-sans antialiased selection:bg-teal-50 selection:text-teal-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CareerLens AI",
              "url": "https://careerlens.ai",
            }),
          }}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
