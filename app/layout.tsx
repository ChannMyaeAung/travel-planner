import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import NavbarServer from "@/components/NavbarServer";

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

// Navbar skeleton shown while the async session lookup streams in.
// Matches the h-16 height of the real Navbar to prevent layout shift.
function NavbarSkeleton() {
  return <div className="h-16 sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50" />;
}

// RootLayout is now a plain (non-async) server component — no dynamic data
// access here means the static HTML shell is sent to the browser immediately.
// The session-dependent Navbar streams in via the Suspense boundary.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarServer />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
