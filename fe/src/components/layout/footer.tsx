"use client";

import Link from "next/link";
import { Facebook, Youtube, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-b from-pink-400 via-purple-500 to-slate-900 text-white overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Soft blur effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 backdrop-blur-[0.5px]"></div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-500 to-slate-700 flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 border border-white/10">
                  <span className="text-white font-bold text-2xl tracking-tight">
                    T
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                    Tuki TOEIC
                  </h2>
                  <p className="text-xs text-white/60 font-medium">
                    Smart Learning Platform
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed font-light max-w-xs">
              Nền tảng học TOEIC thông minh với công nghệ AI. Lộ trình cá nhân
              hóa, phản hồi thời gian thực để đạt điểm mục tiêu.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-base tracking-wide">
              Liên kết nhanh
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Tính năng", href: "/features" },
                { name: "Bảng giá", href: "/pricing" },
                { name: "Blog", href: "/blog" },
                { name: "Liên hệ", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-pink-200 transition-all text-sm font-light inline-block hover:translate-x-2 duration-300 relative group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute inset-0 scale-0 group-hover:scale-100 bg-white/5 rounded-md transition-transform duration-300 -z-0 -m-1 p-1"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Resources */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-base tracking-wide">
              Tài nguyên học tập
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Từ vựng TOEIC", href: "/vocabulary" },
                { name: "Bài kiểm tra", href: "/practice-tests" },
                { name: "Lộ trình học", href: "/study-path" },
                { name: "Ngữ pháp", href: "/grammar" },
                { name: "Listening", href: "/listening" },
                { name: "Reading", href: "/reading" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-purple-200 transition-all text-sm font-light inline-block hover:translate-x-2 duration-300 relative group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute inset-0 scale-0 group-hover:scale-100 bg-white/5 rounded-md transition-transform duration-300 -z-0 -m-1 p-1"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-base tracking-wide mb-6">
                Kết nối với chúng tôi
              </h3>
              <div className="flex space-x-4">
                {[
                  {
                    icon: Facebook,
                    href: "#",
                    gradient: "from-blue-500 to-blue-600",
                    shadow: "shadow-blue-500/25",
                    name: "Facebook",
                  },
                  {
                    icon: Youtube,
                    href: "#",
                    gradient: "from-red-500 to-red-600",
                    shadow: "shadow-red-500/25",
                    name: "YouTube",
                  },
                  {
                    icon: Linkedin,
                    href: "#",
                    gradient: "from-blue-600 to-blue-700",
                    shadow: "shadow-blue-600/25",
                    name: "LinkedIn",
                  },
                  {
                    icon: Send,
                    href: "#",
                    gradient: "from-pink-500 to-purple-600",
                    shadow: "shadow-pink-500/25",
                    name: "Telegram",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg ${social.shadow} hover:shadow-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 border border-white/10 group`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-base tracking-wide mb-3">
                Đăng ký nhận tin
              </h4>
              <p className="text-xs text-white/60 mb-4 font-light leading-relaxed">
                Nhận thông tin mới nhất về TOEIC và tips học tập hiệu quả
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl text-sm h-12 backdrop-blur-sm font-light"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-slate-600 hover:from-pink-400 hover:via-purple-400 hover:to-slate-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 rounded-xl h-12 font-medium hover:scale-[1.02] border border-white/10"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Đăng ký ngay
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-white/60 font-light">
                © {new Date().getFullYear()} Tuki TOEIC. Tất cả quyền được bảo
                lưu.
              </p>
              <p className="text-xs text-white/40 mt-1 font-light">
                Developed with ❤️ for TOEIC learners in Vietnam
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/60">
              <Link
                href="/privacy"
                className="hover:text-pink-200 transition-colors duration-300 font-light"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="hover:text-pink-200 transition-colors duration-300 font-light"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/support"
                className="hover:text-pink-200 transition-colors duration-300 font-light"
              >
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
