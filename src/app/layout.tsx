import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wahlströms Måleri & Bygg | Professionellt måleri i Stockholm",
  description:
    "Wahlströms Måleri & Bygg erbjuder professionell målning, spackling, tapetsering och fasadrenovering i Stockholm. Kontakta oss för en kostnadsfri offert.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
        <ThemeProvider>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen pt-20 sm:pt-26">
            {children}
          </main>
          <CTASection />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
