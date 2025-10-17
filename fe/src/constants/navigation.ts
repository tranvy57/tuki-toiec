import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Users, 
  User,
  Mic,
  Bot,
  LucideIcon
} from "lucide-react";

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}
// constants/navigation.ts
export const TOEIC_NAVIGATION = [
  { name: "Trang chủ", href: "" },
  {
    name: "Học tập",
    sub: [
      { name: "Khóa học", href: "/courses" },
      { name: "Lộ trình học", href: "/learning-path" },
      { name: "Từ vựng", href: "/vocabulary" },
    ],
  },
  {
    name: "Ôn luyện",
    sub: [
      { name: "Luyện Listening", href: "/practice/listening" },
      { name: "Luyện Reading", href: "/practice/reading" },
      { name: "Luyện Writing", href: "/practice/writing" },
      { name: "Luyện Speaking", href: "/practice/speaking" },
    ],
  },
  { name: "Thi thử", href: "/tests" },
  { name: "Trợ lý AI", href: "/assistant" },
  // { name: "Liên hệ", href: "/contact" },
];


export const NAVIGATION_PATHS = {
  TOEIC_BASE: "/toeic",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;
