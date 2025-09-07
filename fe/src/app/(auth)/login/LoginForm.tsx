"use client";
import { login, loginGoogle } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hook";
import { showError, showSuccess } from "@/libs/toast";
import { doLogin, doLoginGoogle } from "@/store/slice/auth-slice";
import { GoogleLogin } from "@react-oauth/google";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FacebookLoginButton from "./LoginFacebookButton";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ username: "", password: "" });
  const { loading, error } = useAppSelector((state) => state.auth);
  const { authenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      showSuccess("Login successful!");
      router.push("/");
    }
  }, [authenticated]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // tránh reload trang
    dispatch(doLogin(form));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="min-w-[200px] max-w-[500px] bg-white flex flex-col justify-center items-center md:border md:px-8 md:py-6 rounded-2xl md:shadow-2xl">
        <Image
          src={"/avt.jpg"}
          width={80}
          height={80}
          alt="Tiệm vẽ Climping Rose"
          className="rounded-full md:mb-2"
        />

        <div className="w-full">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold py-2">Tiệm vẽ Climping Rose</h1>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Tài khoản</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading && <p className="text-sm">Loading...</p>}
              {!loading && <p className="text-sm">Login</p>}
            </Button>
            {/* {error && showError(error)} */}

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                hoặc
              </span>
            </div>

            <div className="w-full flex flex-col gap-2 justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const idToken = (credentialResponse as any).credential;
                    if (!idToken) throw new Error("No credential received");

                    dispatch(doLoginGoogle({ idToken }));
                    router.push("/");
                  } catch (error) {
                    console.error("Login error:", error);
                    showError("Đăng nhập Google thất bại");
                  }
                }}
                onError={() => {
                  showError("Google Login thất bại");
                }}
              />

              <FacebookLoginButton />
            </div>
          </div>

          <div className="text-center text-sm mt-4">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Đăng ký
            </Link>
          </div>

          <div className="w-full py-2 flex text-gray-500 mt-4">
            <MoveLeft size={20} />
            <Link
              href="/"
              className="underline underline-offset-4 text-sm float-left ml-1"
            >
              Trở về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
