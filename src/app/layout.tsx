import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ScrollToTop } from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NameMongkol | วิเคราะห์ชื่อมงคล ทำนายชื่อ-นามสกุล แม่นยำที่สุด",
  description: "NameMongkol (เนมมงคล) บริการวิเคราะห์ชื่อมงคล ดูผลรวมชื่อ-นามสกุล พลังเงา และความหมายตามหลักเลขศาสตร์และทักษาปกรณ์ ฟรี! เช็คชื่อของคุณวันนี้เพื่อความเป็นสิริมงคล",
  keywords: ["NameMongkol", "ชื่อมงคล", "วิเคราะห์ชื่อ", "ตั้งชื่อมงคล", "ดูดวงชื่อ", "เลขศาสตร์"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.namemongkol.com'),
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://www.namemongkol.com',
    siteName: 'NameMongkol',
    title: 'NameMongkol - วิเคราะห์ชื่อมงคล อันดับ 1',
    description: 'เช็คชื่อมงคล วิเคราะห์ชื่อ-นามสกุล ฟรี! ด้วยศาสตร์คำนวณที่แม่นยำที่สุด',
    images: [
      {
        url: '/api/og?v=4',
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
    images: ['/api/og?v=4'],
  },
  alternates: {
    canonical: 'https://www.namemongkol.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.namemongkol.com/#website',
      'url': 'https://www.namemongkol.com',
      'name': 'NameMongkol',
      'description': 'บริการวิเคราะห์ชื่อมงคลและตั้งชื่อใหม่ตามหลักเลขศาสตร์',
      'publisher': {
        '@id': 'https://www.namemongkol.com/#organization'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://www.namemongkol.com/?name={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.namemongkol.com/#organization',
      'name': 'NameMongkol',
      'url': 'https://www.namemongkol.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.namemongkol.com/icon.png',
        'width': 512,
        'height': 512
      },
      'sameAs': [
        'https://www.facebook.com/namemongkol',
        // Add other social profiles here
      ]
    }
  ]
}

async function getSettings() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['gtm_id', 'tiktok_pixel_id', 'facebook_pixel_id']);

    // Default values
    const settings = {
      gtmId: 'GTM-WCW8R5BK',
      tiktokPixelId: '',
      facebookPixelId: ''
    };

    if (data) {
      data.forEach(item => {
        if (item.key === 'gtm_id') settings.gtmId = item.value || settings.gtmId;
        if (item.key === 'tiktok_pixel_id') settings.tiktokPixelId = item.value || '';
        if (item.key === 'facebook_pixel_id') settings.facebookPixelId = item.value || '';
      });
    }
    return settings;
  } catch (error) {
    return { gtmId: 'GTM-WCW8R5BK', tiktokPixelId: '', facebookPixelId: '' };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gtmId, tiktokPixelId, facebookPixelId } = await getSettings();

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManager gtmId={gtmId} />
        <CookieConsent />

        {/* Facebook Pixel */}
        {facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${facebookPixelId}');
                fbq('track', 'PageView');
                `}
          </Script>
        )}

        {/* TikTok Pixel */}
        {tiktokPixelId && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
                !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq.methods[i=0];i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);return ttq},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${tiktokPixelId}');
                ttq.page();
                }(window, document, 'ttq');
                `}
          </Script>
        )}

        <LayoutWrapper>
          {children}
          <ScrollToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
