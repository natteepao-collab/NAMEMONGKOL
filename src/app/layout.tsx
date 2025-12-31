import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <LayoutWrapper>
          {children}
          <ScrollToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
