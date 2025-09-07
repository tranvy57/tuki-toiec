"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { register } from "@/api/userApi";
import { showError, showSuccess } from "@/libs/toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (username.trim().length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (password.trim().length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!displayName.trim()) {
      newErrors.displayName = "Tên hiển thị không được để trống";
    }

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    const data = { username, password, displayName, email };

    try {
      const response = await register(data);
      if (response.data) {
        showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        localStorage.removeItem("accessToken");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else
        setErrors({ general: "Đăng ký không thành công. Vui lòng thử lại." });
    } catch (error) {
      const apiMessage = (error as any)?.response?.data?.message;
      showError(apiMessage || "Đăng ký không thành công. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="min-w-[300px] max-w-[500px] bg-white flex flex-col justify-center items-center md:border md:px-8 md:py-6 rounded-2xl md:shadow-2xl space-y-4">
        <Image
          src={"/avt.jpg"}
          width={80}
          height={80}
          alt="Tiệm vẽ Climping Rose"
          className="rounded-full md:mb-2"
        />{" "}
        <div className="w-full">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold py-2">Tiệm vẽ Climping Rose</h1>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className=" font-semibold py-2">Đăng ký</h1>
          </div>
          <Label className="mb-2">Tên đăng nhập</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>
        <div className="w-full">
          <Label className="mb-2">Mật khẩu</Label>
          <Input
            className="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="w-full">
          <Label className="mb-2">Tên hiển thị</Label>
          <Input
            className="w-full"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm">{errors.displayName}</p>
          )}
        </div>
        <div className="w-full">
          <Label className="mb-2">Email</Label>
          <Input
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
        <div className="w-full py-2 flex text-gray-500 mt-4">
          <MoveLeft size={20} />
          <Link
            href="/"
            className="underline underline-offset-4 text-sm float-left ml-1"
          >
            back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
