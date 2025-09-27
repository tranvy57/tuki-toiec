import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/provider/provider";
import { getLocale, getMessages } from "next-intl/server";
import AppInit from "@/components/AppInit";
import Header from "@/components/layout/header/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Climping Rose",
  description: "Tiệm vẽ Climping Rose - Tiệm tranh số hóa tại Nhật",
  icons: {
    icon: "/avt.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppInit />
        <Header />
        <div style={{ height: "calc(100vh - 50px)" }}>{children}</div>
      </body>
    </html>
  );
}
