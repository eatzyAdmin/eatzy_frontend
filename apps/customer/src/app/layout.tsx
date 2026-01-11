import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Oswald, Pathway_Gothic_One, Fjalla_One } from "next/font/google";
import { antonio } from "@repo/fonts";
import "./globals.css";
import Providers from "./providers";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
});
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald"
});
const pathwayGothic = Pathway_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pathway",
});
const fjallaOne = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fjalla",
});

export const metadata: Metadata = {
  title: "Eatzy - Discover Amazing Food",
  description: "Browse and discover amazing restaurants and recipes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eatzy",
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
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${antonio.variable} ${bebasNeue.variable} ${oswald.variable} ${pathwayGothic.variable} ${fjallaOne.variable} antialiased`}>
        <Providers>
          <SplashScreen />
          {children}
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
