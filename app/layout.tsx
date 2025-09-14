import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner - Plan Your Perfect Journey",
  description:
    "Discover, plan, and visualize your dream trips with our interactive travel planner. Create detailed itineraries, explore destinations on a 3D globe, and track your adventures around the world.",
  keywords: [
    "travel",
    "planner",
    "trip",
    "itinerary",
    "vacation",
    "globe",
    "destinations",
    "travel planning",
  ],
  authors: [{ name: "Chan Myae Aung" }],
  creator: "Travel Planner",
  openGraph: {
    title: "Travel Planner - Plan Your Perfect Journey",
    description:
      "Discover, plan, and visualize your dream trips with our interactive travel planner.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Planner - Plan Your Perfect Journey",
    description:
      "Discover, plan, and visualize your dream trips with our interactive travel planner.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
