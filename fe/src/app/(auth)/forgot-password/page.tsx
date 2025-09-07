"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/libs/toast";
import axios from "axios";
import Image from "next/image";
import { forgotPassword, resetPassword } from "@/api/authApi";
import PinkSpinner from "@/components/ui/pink-spiner";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      showSuccess("Đã gửi OTP đến email.");
      setStep(2);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Gửi OTP thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return showError("Mật khẩu xác nhận không khớp.");
    }

    try {
      setLoading(true);
      await resetPassword({ email, otp, newPassword });
      router.push("/login");
      showSuccess("Đổi mật khẩu thành công.");
    } catch (error: any) {
      showError(error?.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {loading && <PinkSpinner />}
      <div className="min-w-[300px] max-w-[500px] bg-white flex flex-col justify-center items-center md:border md:px-8 md:py-6 rounded-2xl md:shadow-2xl space-y-4">
        <Image
          src={"/avt.jpg"}
          width={80}
          height={80}
          alt="Tiệm vẽ Climping Rose"
          className="rounded-full md:mb-2"
        />{" "}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold py-2">Tiệm vẽ Climping Rose</h1>
        </div>
        <p className="font-semibold mb-4 text-center">Quên mật khẩu</p>
        <p className="w-[300px] text-gray-600 text-sm mb-4 text-center">
          Nhập mail bạn đã đăng ký tài khoản tại Climping Rose để reset mật khẩu
        </p>
        {step === 1 ? (
          <>
            <Input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full" onClick={handleSendOtp}>
              Gửi OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full" onClick={handleResetPassword}>
              Đổi mật khẩu
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
