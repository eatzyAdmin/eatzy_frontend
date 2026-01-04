import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { antonio } from "@repo/fonts";
import "./globals.css";
import Providers from "./providers";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Eatzy Driver",
  description: "Driver application for Eatzy platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eatzy Driver",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F7F7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} ${inter.variable} ${antonio.variable} antialiased text-[#1A1A1A] bg-[#F7F7F7]`}>
        <Providers>
          <SplashScreen />
          {children}
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
