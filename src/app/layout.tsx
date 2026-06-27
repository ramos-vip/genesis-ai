import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/shared/providers";
import { clerkAppearance } from "@/shared/lib";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Project Genesis — Build Your AI Workforce in Minutes",
    template: "%s | Project Genesis",
  },
  description:
    "Create AI employees for Sales, Support, SEO, Content and Operations in one platform.",
  keywords: ["AI", "SaaS", "AI employees", "automation"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ClerkProvider appearance={clerkAppearance}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
