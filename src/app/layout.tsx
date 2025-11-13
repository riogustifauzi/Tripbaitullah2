import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripbaitullah - Platform Umroh Terpercaya",
  description: "Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman di Indonesia. Temukan paket umroh sesuai budget dan kebutuhan Anda.",
  keywords: ["umroh", "paket umroh", "travel umroh", "haji", "ibadah", "makkah", "madinah", "tripbaitullah"],
  authors: [{ name: "Tripbaitullah" }],
  icons: {
    icon: [
      { url: '/uploads/1762771904921-h15y0ji.png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/uploads/1762771904921-h15y0ji.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Tripbaitullah - Platform Umroh Terpercaya",
    description: "Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman",
    url: "https://tripbaitullah2.vercel.app",
    siteName: "Tripbaitullah",
    type: "website",
    images: [
      {
        url: "/kaaba-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Tripbaitullah - Platform Umroh Terpercaya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripbaitullah - Platform Umroh Terpercaya",
    description: "Platform terpercaya untuk menemukan paket umroh terbaik",
    images: ["/kaaba-hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
