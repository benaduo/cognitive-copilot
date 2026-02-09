import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognitive Co-Pilot",
  description: "A smart assistant for individuals with cognitive disabilities",
  keywords: ["Cognitive Co-Pilot", "AI", "Accessibility", "Assistive Technology"],
  authors: [
    {
      name: "Benjamin Aduo",
      url: "https://github.com/benjaminaduo",
    },
  ],
  creator: "Benjamin Aduo",
  icons: {
    icon: "/app-logo.png",
  },
  themeColor: "#0ea5e9",
  manifest: "/manifest.webmanifest",
};

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
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
