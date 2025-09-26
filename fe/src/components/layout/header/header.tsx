"use client";

import { NAVIGATION_PATHS } from "@/constants/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "./mobile-menu";
import { NavigationMenu } from "./navigation-menu";
import UserIcon from "./user-icon";

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
        <div className="flex items-center space-x-8">
          <Link href="/toeic" className="text-xl font-bold">
            Tuki TOEIC®
          </Link>
          
          <NavigationMenu className="hidden md:flex items-center space-x-6" />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* <UserIcon />
          <MobileMenu isToeicApp={isToeicApp} /> */}
        </div>
      </nav>
    );
  
}

export default Header;