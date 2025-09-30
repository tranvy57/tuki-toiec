"use client";

import { NAVIGATION_PATHS } from "@/constants/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavigationMenu } from "./navigation-menu";
import UserIcon from "./user-icon";
import Image from "next/image";

function Header() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isToeicApp = pathname?.startsWith(NAVIGATION_PATHS.TOEIC_BASE);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#ff776f] text-white">
      <Link href="/toeic" className="text-xl font-bold">
        <div className="flex items-center space-x-2">
          Tuki TOEIC®
        </div>
      </Link>

      <NavigationMenu className="hidden md:flex items-center space-x-6" />
    </nav>
  );
}

export default Header;
