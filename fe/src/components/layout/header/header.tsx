"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { TOEIC_NAVIGATION } from "@/constants/navigation";

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Lộ trình", href: "/learning-path" },
  { name: "Thư viện", href: "/library" },
  { name: "Blog", href: "/blog" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this based on auth state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
          : "bg-white/60 backdrop-blur-lg border-b border-gray-100"
      }`}
    >
      <nav
        className={`container mx-auto px-4 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-3xl bg-gradient-to-r from-[var(--color-7)] to-[var(--primary)] bg-clip-text text-transparent">
                Tuki TOEIC
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {TOEIC_NAVIGATION.map((item) => (
              <div key={item.name} className="relative group">
                {/* Mục chính */}
                <Link
                  href={item.href || "#"}
                  className="text-gray-700 hover:text-primary font-medium flex items-center gap-1"
                >
                  {item.name}
                  {item.sub && (
                    <span className="text-gray-400 group-hover:text-primary">
                      ▾
                    </span>
                  )}
                </Link>

                {/* Sub menu */}
                {item.sub && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full hidden group-hover:block bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-52"
                  >
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center cursor-pointer">
                <span className="text-white font-semibold">U</span>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-[var(--color-7)] to-[var(--primary)] text-white rounded-lg font-medium overflow-hidden group"
                  >
                    <span className="relative z-10">Đăng ký</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[var(--color-7)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <div className="hidden md:flex items-center space-x-8">
                  {TOEIC_NAVIGATION.map((item) => (
                    <div key={item.name} className="relative group">
                      {/* Mục chính */}
                      <Link
                        href={item.href || "#"}
                        className="text-gray-700 hover:text-primary font-medium flex items-center gap-1"
                      >
                        {item.name}
                        {item.sub && (
                          <span className="text-gray-400 group-hover:text-primary">
                            ▾
                          </span>
                        )}
                      </Link>

                      {/* Sub menu */}
                      {item.sub && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full hidden group-hover:block bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-52"
                        >
                          {item.sub.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center">
                        <span className="text-white font-semibold">U</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        Tài khoản
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <button className="w-full px-6 py-2.5 bg-gradient-to-r from-[var(--color-7)] to-[var(--primary)] text-white rounded-lg font-medium">
                          Đăng ký
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
