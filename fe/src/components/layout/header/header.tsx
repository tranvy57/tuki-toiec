"use client";

import { 
  Globe, 
  Menu, 
  ShoppingCart, 
  UserRound, 
  X,
  Home, 
  BookOpen, 
  ClipboardList, 
  Users, 
  User
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./language-switcher";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";
import UserIcon from "./user-icon";
import { useAppSelector } from "@/hooks/store-hook";
import { showLoginWarning } from "@/libs/toast";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/libs";

const toeicNavigation = [
  {
    name: "Trang chủ",
    href: "/home",
    icon: Home,
  },
  {
    name: "Kế hoạch học",
    href: "/study-plan", 
    icon: ClipboardList,
  },
  {
    name: "Từ vựng",
    href: "/vocabulary",
    icon: BookOpen,
  },
  {
    name: "Đề thi",
    href: "/tests",
    icon: Users,
  },
  {
    name: "Hồ sơ",
    href: "/profile",
    icon: User,
  },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("home");

  const { authenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  // Check if we're in TOEIC app
  const isToeicApp = pathname?.startsWith('/toeic');
  
  // Debug log
  console.log('Current pathname:', pathname, 'isToeicApp:', isToeicApp);

  const handleClick = () => {
    if (!authenticated) {
      showLoginWarning();
    } else {
      router.push("/cart");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure we're mounted and have pathname before rendering
  if (!mounted) {
    return null;
  }

  if (isToeicApp) {
    // TOEIC App Header
    return (
      <>
        {/* Desktop Navigation */}
        
      </>
    );
  }

  // Original Header for other pages
  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 md:py-1 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo + Tiêu đề */}
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#ff776f] text-white">
          <div className="flex items-center space-x-8">
            <Link href="/toeic" className="text-xl font-bold">
              Tuki TOEIC®
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {toeicNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden md:flex bg-white/20 text-white border-white/20">
              Level: Beginner
            </Badge>
            <div className="hidden md:block">
              <UserIcon />
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <UserIcon />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    {toeicNavigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-[#ff776f] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        {/* Bottom Tab Navigation for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
          <div className="flex">
            {toeicNavigation.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center py-2 px-1 text-xs",
                    isActive
                      ? "text-[#ff776f]"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
