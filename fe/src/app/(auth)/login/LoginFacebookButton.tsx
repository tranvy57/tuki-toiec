"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useAppDispatch } from "@/hooks/store-hook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB: any;
  }
}

export default function FacebookLoginButton() {
  const { loginFacebook } = useAuth();
  const router = useRouter();
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
        status: true,
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    window.FB.login(
      function (response: any) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          loginFacebook(accessToken);
          router.push("/");
        } else {
          console.warn(" Người dùng từ chối hoặc đóng popup.");
        }
      },
      {
        scope: "public_profile,email",
        display: "popup",
      }
    );
  };

  return (
    <div
      onClick={handleLogin}
      className="py-2 px-2 rounded bg-white border hover:bg-blue-50 flex justify-between text-black text-sm"
    >
      <Image src="fb.svg" alt="Facebook Icon" width={24} height={24} />
      <p className="flex-1 text-center">Đăng nhập bằng Facebook</p>
    </div>
  );
}
