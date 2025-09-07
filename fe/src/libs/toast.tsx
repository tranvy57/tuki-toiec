// lib/toast.ts
import { toast } from "sonner";
import { Ban, Check, LogIn, X } from "lucide-react";

export const showSuccess = (message: string) =>
  toast.success(message, {
    icon: <Check className="text-pink-500 w-4 h-4" />,
    className: "bg-pink-100 text-pink-700 text-xs max-w-[220px]",
  });

export const showError = (message: string) =>
  toast.error(message, {
    icon: <Ban className="text-red-500 w-4 h-4" />,
    className: "bg-red-100 text-red-700 text-xs max-w-[220px]",
  });

export const showLoginWarning = () => {
  toast("Bạn cần đăng nhập để tiếp tục", {
    icon: <LogIn className="text-yellow-500 w-4 h-4" />,
    position: "top-center", // Nằm giữa trên
    className:
      "bg-yellow-100 text-yellow-800 text-sm px-4 py-2 rounded shadow-lg max-w-[300px]",
    dismissible: true, // Cho phép người dùng tắt
    action: {
      label: "Đăng nhập",
      onClick: () => (window.location.href = "/login"),
    },
    cancel: {
      label: <X className="w-4 h-4" />,
      onClick: () => {}, // No-op or custom close logic
    },
  });
};
