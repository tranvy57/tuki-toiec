import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/provider/provider";
import { getLocale, getMessages } from "next-intl/server";
import AppInit from "@/components/AppInit";
import Header from "@/components/layout/header/header";
import WordPopupProvider from "@/provider/word-popup-provider";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tuki TOEIC",
  description: "Tuki TOEIC",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = "Asia/Ho_Chi_Minh"; // hoặc lấy động

  return (
    <>
      <AppInit />
      <Header />
      <WordPopupProvider>
        <div className="mt-18">{children}</div>
      </WordPopupProvider>
    </>
  );
}

