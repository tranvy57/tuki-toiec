"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hook";
import { showSuccess } from "@/libs/toast";
import { logout } from "@/store/slice/auth-slice";
import { Divide, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserIcon() {
  const { authenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    showSuccess("Đăng xuất thành công!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          {authenticated && user ? (
            <Image
              src={
                user.avatar ||
                "https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg"
              }
              alt="User Avatar"
              height={32}
              width={32}
              className="rounded-full"
            />
          ) : (
            <Button variant="ghost" className="icon-button">
              <UserRound className="icon-button" />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {!authenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">Đăng nhập</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/register">Đăng ký</Link>
            </DropdownMenuItem> */}
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <Link href="/user">Tài khoản của tôi</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/user?tab=orders">Đơn hàng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Đăng xuất
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
