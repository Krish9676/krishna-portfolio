import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gopikrishna Nallagorla | Data Scientist · Remote Sensing & ML Engineer",
  description:
    "Agricultural Scientist turned Data Scientist specializing in satellite-based agricultural intelligence, Carbon MRV, farm credit scoring, and production ML systems. Core founding team at Elai AgriTech, Pune.",
  keywords: [
    "Data Scientist",
    "Remote Sensing",
    "AgriTech",
    "Carbon MRV",
    "Machine Learning",
    "Satellite Imagery",
    "GIS",
    "Precision Agriculture",
    "Gopikrishna Nallagorla",
    "Google Earth Engine",
    "Verra",
    "IPCC",
    "Farm Credit Scoring",
    "Deep Learning",
  ],
  themeColor: "#F4F7F4",
  authors: [{ name: "Gopikrishna Nallagorla" }],
  creator: "Gopikrishna Nallagorla",
  openGraph: {
    type: "website",
    title: "Gopikrishna Nallagorla | Data Scientist · Remote Sensing & ML Engineer",
    description:
      "Transforming satellite intelligence into real-world decisions — agricultural scientist, remote sensing expert, and production ML engineer.",
    siteName: "Gopikrishna Nallagorla Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gopikrishna Nallagorla | Data Scientist",
    description:
      "Transforming satellite intelligence into real-world decisions — for agriculture, carbon accountability, and farm finance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
