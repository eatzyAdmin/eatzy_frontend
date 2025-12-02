import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { antonio } from "@repo/fonts";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Eatzy Restaurant",
  description: "Restaurant management portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${antonio.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
