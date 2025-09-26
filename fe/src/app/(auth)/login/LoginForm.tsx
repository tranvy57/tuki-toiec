"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showError, showSuccess } from "@/libs/toast"
import { GoogleLogin } from "@react-oauth/google"
import { BookOpen, GraduationCap, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import FacebookLoginButton from "./LoginFacebookButton"
import { useAuth } from "@/hooks"

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { login, loading, error, authenticated, loginGoogle } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      router.push("/")
    }
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (authenticated) {
      showSuccess("Login successful!")
      router.push("/")
    }
  }, [authenticated])

  useEffect(() => {
    if (error) {
      showError(error)
    }
  }, [error])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login({ username: form.username, password: form.password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/8 rounded-full blur-lg animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className={`w-full max-w-md relative z-10 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-8 animate-pulse-glow">
          <div className={`text-center mb-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <GraduationCap className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
              Tuki TOEIC
            </h1>
            <p className="text-muted-foreground text-sm">{"Nâng cao kỹ năng tiếng Anh của bạn"}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className={`space-y-2 ${isVisible ? "animate-slide-up stagger-1" : "opacity-0"}`}>
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Tài khoản
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập của bạn"
                  type="text"
                  required
                  value={form.username}
                  onChange={handleChange}
                  className="h-12 pl-4 pr-4 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                />
              </div>
            </div>

            <div className={`space-y-2 ${isVisible ? "animate-slide-up stagger-2" : "opacity-0"}`}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mật khẩu
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu của bạn"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`${isVisible ? "animate-slide-up stagger-3" : "opacity-0"}`}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </div>

            <div className={`relative ${isVisible ? "animate-slide-up stagger-4" : "opacity-0"}`}>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">hoặc tiếp tục với</span>
              </div>
            </div>

            <div className={`space-y-3 ${isVisible ? "animate-slide-up stagger-5" : "opacity-0"}`}>
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const idToken = (credentialResponse as any).credential
                      if (!idToken) throw new Error("No credential received")
                      loginGoogle(idToken)
                      router.push("/")
                    } catch (error) {
                      console.error("Login error:", error)
                      showError("Đăng nhập Google thất bại")
                    }
                  }}
                  onError={() => {
                    showError("Google Login thất bại")
                  }}
                />
              </div>

              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <FacebookLoginButton />
              </div>
            </div>
          </form>

          <div className={`text-center mt-8 ${isVisible ? "animate-slide-up stagger-5" : "opacity-0"}`}>
            <p className="text-sm text-muted-foreground">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute -z-10 top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div
            className="absolute bottom-20 left-10 w-1 h-1 bg-primary/60 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
