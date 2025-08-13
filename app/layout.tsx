import type { Metadata } from "next";
import { Play, Lekton } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const play = Play({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const lekton = Lekton({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Invenza",
  description: "The Ultimate Inventory Management and Order Tracking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className={`${play.variable} ${lekton.variable} h-full`}>
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </>
  );
}
