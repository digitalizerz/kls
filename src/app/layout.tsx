import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Grease Interceptor Cleaning in Houston",
    template: `%s | ${siteConfig.displayName}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.displayName,
    title: "Grease Interceptor Cleaning in Houston | KLS Environmental",
    description: siteConfig.description,
    images: [{ url: siteConfig.heroImage, alt: "KLS vacuum truck and technician at a commercial grease interceptor." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grease Interceptor Cleaning in Houston | KLS Environmental",
    description: siteConfig.description,
    images: [siteConfig.heroImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-cream font-sans text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
