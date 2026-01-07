import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NameMongkol - วิเคราะห์ชื่อมงคล",
  description: "วิเคราะห์ชื่อ-นามสกุล ดูผลรวม พลังเงา และความหมายมงคล ฟรี",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://namemongkol-nine.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://namemongkol-nine.vercel.app',
    siteName: 'NameMongkol',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'NameMongkol - วิเคราะห์ชื่อมงคล',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NameMongkol - วิเคราะห์ชื่อมงคล',
    description: 'วิเคราะห์ชื่อ-นามสกุล ดูผลรวม พลังเงา และความหมายมงคล ฟรี',
    images: ['/api/og'],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManager gtmId="GTM-WCW8R5BK" />
        <LayoutWrapper>
          {children}
          <ScrollToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
