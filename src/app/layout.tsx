import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

import Providers from "@/context/Providers";
import SplashScreenWrapper from "./splashScreen";
import { defaultSeo, siteConfig } from "@/config/seo";
import PageTransition from "@/components/animations/PageTransition";
import PageViewTracker from "@/components/analytics/PageViewTracker";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a0001e",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultSeo.title || "ForvrMurr | Luxury Perfume Samples",
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultSeo.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.handle,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
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
};

// Basic fallback component for the root layout suspense
const RootLoadingFallback = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <p>Loading ForvrMurr...</p>
      {/* You could add a logo or a more sophisticated skeleton here */}
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-cursorstyle="true">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Providers>
          <SplashScreenWrapper>
            <Suspense fallback={<RootLoadingFallback />}>
              <PageViewTracker />
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </SplashScreenWrapper>
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}
