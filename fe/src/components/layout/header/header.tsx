"use client";

import { Globe, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Separator } from "@radix-ui/react-dropdown-menu";
import UserIcon from "./user-icon";
import { useAppSelector } from "@/hooks/store-hook";
import { showLoginWarning } from "@/libs/toast";
import { useRouter } from "next/navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("home");

  const { authenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

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

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 md:py-1 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo + Tiêu đề */}
        <div className="flex justify-between items-center gap-2 py-2">
          <Link href="/">
            <Image
              src={"/avt.jpg"}
              alt="logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </Link>

          <div>
            <p className="font-bold text-md lg:text-lg text-gray-700">
              Tuki Toiec
            </p>
            <p className=" text-sm font-thin italic">
              Han doi cho de, han ke phu tinh
            </p>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Link href="/cart">
            <ShoppingCart className="icon-button" />
          </Link>

          {/* Nút menu mobile */}
          <Sheet>
            <SheetTrigger className="md:hidden text-primary">
              <Menu className="icon-button" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                {/* <Link className="menu-link" href="/">
                  {t("menu.home")}
                </Link>
                <Link className="menu-link" href="/paintings">
                  {t("menu.products")}
                </Link>
                <Link className="menu-link" href="/feedbacks">
                  {t("menu.feedbacks")}
                </Link> */}
                {/* <Link className="menu-link" href="#">
                  {t("menu.blog")}
                </Link> */}
                {/* <Link className="menu-link" href="/payment-instruction">
                  Hướng dẫn thanh toán
                </Link> */}
                <div className="flex gap-4 text-gray-700">
                  {/* <Link href="/cart">
                    <ShoppingCart className="icon-button" />
                  </Link> */}
                  <UserIcon />
                  {/* <LanguageSwitcher /> */}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex gap-4 ">
          {/* <Link className="menu-link" href="/">
            {t("menu.home")}
          </Link>
          <Link className="menu-link" href="/paintings">
            {t("menu.products")}
          </Link>
          <Link className="menu-link" href="/feedbacks">
            {t("menu.feedbacks")}
          </Link> */}
          {/* <Link className="menu-link" href="#">
            {t("menu.blog")}
          </Link> */}
          {/* <Link className="menu-link" href="/payment-instruction">
            Hướng dẫn thanh toán
          </Link> */}

          <div className="flex gap-4 text-gray-700">
            <div className="flex gap-4 text-gray-700">
              {/* <button onClick={handleClick}>
                <ShoppingCart className="icon-button" />
              </button> */}
              <UserIcon />
              {/* <LanguageSwitcher /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
