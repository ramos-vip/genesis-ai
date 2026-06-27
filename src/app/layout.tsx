import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/shared/providers";
import { clerkAppearance } from "@/shared/lib";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
  display:  "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
});

/* ─── SEO Metadata ────────────────────────────────────────────────────────── */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default:  "Genesis AI — Build Your AI Workforce in Minutes",
    template: "%s | Genesis AI",
  },

  description:
    "Create AI employees for Sales, Support, Content, SEO, Email and Operations. Deploy your first AI employee in under 5 minutes. Powered by Gemini 2.5 Flash with RAG-powered knowledge retrieval.",

  keywords: [
    "AI workforce",
    "AI employees",
    "AI SaaS",
    "customer support AI",
    "sales AI",
    "content AI",
    "knowledge base",
    "RAG",
    "Gemini AI",
    "automation",
    "no-code AI",
  ],

  authors:  [{ name: "Genesis AI" }],
  creator:  "Genesis AI",
  publisher:"Genesis AI",

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         APP_URL,
    siteName:    "Genesis AI",
    title:       "Genesis AI — Build Your AI Workforce in Minutes",
    description: "Deploy AI employees for Sales, Support, Content and Operations. Real-time streaming, knowledge-grounded, 24/7 availability.",
    images: [
      {
        url:    "/og.png",
        width:  1200,
        height: 630,
        alt:    "Genesis AI — Build Your AI Workforce",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Genesis AI — Build Your AI Workforce in Minutes",
    description: "Deploy AI employees for Sales, Support, Content and Operations. No engineers required.",
    images:      ["/og.png"],
    creator:     "@genesisai",
  },

  icons: {
    icon:             "/favicon.ico",
    shortcut:         "/favicon.ico",
    apple:            "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",

  alternates: {
    canonical: APP_URL,
  },

  verification: {
    google: "genesis-ai-google-verification",
  },
};

/* ─── JSON-LD Structured Data ─────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":               "SoftwareApplication",
      "@id":                 `${APP_URL}/#software`,
      "name":                "Genesis AI",
      "applicationCategory": "BusinessApplication",
      "operatingSystem":     "Web",
      "description":         "AI workforce platform for deploying AI employees across Sales, Support, Content, SEO, Email and Operations.",
      "url":                 APP_URL,
      "offers": {
        "@type":         "Offer",
        "price":         "0",
        "priceCurrency": "USD",
        "description":   "Free plan available. Pro from $49/month.",
      },
      "featureList": [
        "AI Employee deployment",
        "RAG-powered knowledge base",
        "Real-time streaming AI chat",
        "Analytics dashboard",
        "Gemini 2.5 Flash integration",
      ],
    },
    {
      "@type": "Organization",
      "@id":   `${APP_URL}/#organization`,
      "name":  "Genesis AI",
      "url":    APP_URL,
      "logo":  `${APP_URL}/logo.png`,
      "sameAs": [
        "https://github.com/ramos-vip/genesis-ai",
      ],
    },
    {
      "@type":          "WebSite",
      "@id":            `${APP_URL}/#website`,
      "name":           "Genesis AI",
      "url":             APP_URL,
      "publisher": { "@id": `${APP_URL}/#organization` },
      "potentialAction": {
        "@type":       "SearchAction",
        "target":      { "@type": "EntryPoint", "urlTemplate": `${APP_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

/* ─── Root layout ─────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Performance: preconnect to font CDN */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Theme color for PWA / mobile browser UI */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <ClerkProvider appearance={clerkAppearance}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
