import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse Web — Analisis Saham IDX",
  description: "Analisis teknikal, screener, trading plan, SAPTA, dan broker flow untuk saham IDX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />
        </div>
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
