import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/provider/provider";
import { getLocale, getMessages } from "next-intl/server";
import AppInit from "@/components/AppInit";
import MessengerButton from "@/components/layout/MessageButton";

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
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = "Asia/Ho_Chi_Minh";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          <AppInit />
          {children}
        </Providers>
      </body>
    </html>
  );
}
