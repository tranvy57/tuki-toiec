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
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          <AppInit />
          <Header />
          <div className="mt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

