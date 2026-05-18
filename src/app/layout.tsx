import type { Metadata, Viewport } from "next";
import {
  DM_Mono,
  Instrument_Serif,
  Plus_Jakarta_Sans,
  Space_Grotesk
} from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display"
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body"
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://weldroblox.com"),
  title: "weld. - Get found without begging in Discord threads.",
  description:
    "A rebellious, Roblox-native talent network for creators and studios. Show shipped work, rates, and availability in one place.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  openGraph: {
    title: "weld. - Get found without begging in Discord threads.",
    description:
      "A rebellious, Roblox-native talent network for creators and studios. Show shipped work, rates, and availability in one place.",
    url: "https://weldroblox.com/",
    siteName: "weld.",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 484,
        alt: "weld. landing preview with sample developer profile cards."
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "weld. - Get found without begging in Discord threads.",
    description:
      "A rebellious, Roblox-native talent network for creators and studios. Show shipped work, rates, and availability in one place.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
