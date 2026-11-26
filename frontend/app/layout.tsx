import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retina-scope-final.vercel.app"),
  title: "RetinaScope AI | Explainable Diabetic Retinopathy Screening",
  description: "RetinaScope AI by Team Shadow is a research prototype for diabetic retinopathy screening with EfficientNet-B0, single- and dual-eye analysis, Grad-CAM and district-level planning.",
  applicationName: "RetinaScope AI",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "RetinaScope AI | Explainable Retinal Screening",
    description: "Explore the Team Shadow research prototype for retinal image analysis, Grad-CAM and healthcare resource planning.",
    url: "https://retina-scope-final.vercel.app/",
    siteName: "RetinaScope AI",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "RetinaScope AI | Explainable Retinal Screening",
    description: "A research prototype for AI-assisted diabetic retinopathy screening and district planning.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F3EC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable} ${dmMono.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
