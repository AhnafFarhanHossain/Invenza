import type { Metadata } from "next";
import { Play, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const play = Play({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Invenza - Inventory & Order Management",
  description: "The Ultimate Inventory Management and Order Tracking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className={`${play.variable} ${geistMono.variable} h-full`}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </head>
        <body className="antialiased bg-neutral-50 overflow-x-hidden">
          {children}
          <Toaster />
        </body>
      </html>
    </>
  );
}
