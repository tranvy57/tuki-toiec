import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Users, 
  User,
  LucideIcon
} from "lucide-react";

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}

export const TOEIC_NAVIGATION: NavigationItem[] = [
  {
    id: "home",
    name: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    id: "study-plan",
    name: "Kế hoạch học",
    href: "/study-plan", 
    icon: ClipboardList,
  },
  {
    id: "vocabulary",
    name: "Từ vựng",
    href: "/vocabulary",
    icon: BookOpen,
  },
  {
    id: "tests",
    name: "Đề thi",
    href: "/tests",
    icon: Users,
  },
  {
    id: "profile",
    name: "Hồ sơ",
    href: "/profile",
    icon: User,
  },
];

export const NAVIGATION_PATHS = {
  TOEIC_BASE: "/toeic",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;
