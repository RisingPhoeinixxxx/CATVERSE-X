import type { Metadata } from "next";
import { Orbitron, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "CATVERSE X",
  description:
    "AI-Powered Digital Twin & Rescue Intelligence Platform for Cats",
  keywords: [
    "Cats",
    "AI",
    "Rescue",
    "Digital Twin",
    "Hackathon",
    "CatVerse X",
  ],
  authors: [{ name: "CATVERSE X Team" }],
  icons: {
    icon: "/favicon.ico",
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
  data-scroll-behavior="smooth"
>
      <body
        className={`
        ${orbitron.variable}
        ${inter.variable}
        ${spaceGrotesk.variable}
        antialiased
        bg-[#050816]
        text-white
        overflow-x-hidden
      `}
      >
        {children}
      </body>
    </html>
  );
}