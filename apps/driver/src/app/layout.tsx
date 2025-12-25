import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { antonio } from "@repo/fonts";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Eatzy Driver",
  description: "Driver application for Eatzy platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} ${inter.variable} ${antonio.variable} antialiased text-[#1A1A1A] bg-[#F7F7F7]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
