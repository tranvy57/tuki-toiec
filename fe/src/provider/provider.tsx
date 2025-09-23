"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header/header";
import { persistor, store } from "@/store/store";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({
  children,
  locale,
  messages,
  timeZone,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
  messages: any;
  timeZone: string;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              timeZone={timeZone}
            >
              <Toaster
                position="top-right"
                toastOptions={{
                  classNames: {
                    toast: "text-xs",
                    icon: "text-pink-500",
                  },
                }}
              />
              <HideLayoutWrapper>{children}</HideLayoutWrapper>
            </NextIntlClientProvider>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

function HideLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";
  const hideFooter = pathname === "/checkout";

  return (
    <>
      {!hideLayout && <Header />}
      <main className="py-15 flex flex-col md:gap-8 max-w-full mx-auto">
        {children}
      </main>
      {!hideLayout && !hideFooter && <Footer />}
    </>
  );
}
