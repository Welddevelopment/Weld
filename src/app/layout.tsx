import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://weldroblox.com"),
  title: "weld. - Roblox talent cards for swiping and sparking.",
  description:
    "A friendly Roblox talent marketplace where developers and studios review role, rate, availability, proof, and shipped work in one swipeable card.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  openGraph: {
    title: "weld. - Roblox talent cards for swiping and sparking.",
    description:
      "A friendly Roblox talent marketplace where developers and studios review role, rate, availability, proof, and shipped work in one swipeable card.",
    url: "https://weldroblox.com/",
    siteName: "weld.",
    images: [{ url: "/og-image.png" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "weld. - Roblox talent cards for swiping and sparking.",
    description:
      "A friendly Roblox talent marketplace where developers and studios review role, rate, availability, proof, and shipped work in one swipeable card.",
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
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
