import {
  Activity,
  BarChart3,
  BookOpen,
  Boxes,
  CheckSquare,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  Layers3,
  ListChecks,
  PlugZap,
  ScrollText,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { ROUTES } from "./routes";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: MenuItem[];
}

export const SIDEBAR_MENU: MenuItem[] = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Người dùng",
    url: ROUTES.USERS,
    icon: Users,
    items: [
      { title: "Danh sách người dùng", url: ROUTES.USERS, icon: Users },
    ],
  },
  {
    title: "Nội dung học tập",
    url: ROUTES.COURSES,
    icon: BookOpen,
    items: [
      { title: "Khóa học", url: ROUTES.COURSES, icon: BookOpen },
      { title: "Phase & lộ trình", url: ROUTES.PHASES, icon: Layers3 },
      { title: "Bài học", url: ROUTES.LESSONS, icon: Boxes },
      {
        title: "Nội dung bài học",
        url: ROUTES.LESSON_CONTENTS,
        icon: CheckSquare,
      },
    ],
  },
  {
    title: "Đề thi & Ngân hàng câu hỏi",
    url: ROUTES.TESTS,
    icon: FileText,
    items: [
      { title: "Đề thi TOEIC", url: ROUTES.TESTS, icon: FileText },
      { title: "Câu hỏi & đáp án", url: ROUTES.QUESTIONS, icon: ListChecks },
      { title: "Từ vựng", url: ROUTES.VOCABULARIES, icon: Download },
      { title: "Cào đề Study4", url: ROUTES.EXAMS_CRAWL, icon: Download },
    ],
  },
  {
    title: "Kết quả học tập",
    url: ROUTES.ATTEMPTS,
    icon: TrendingUp,
    items: [{ title: "Lần làm bài", url: ROUTES.ATTEMPTS, icon: Activity }],
  },
  {
    title: "Thương mại & thanh toán",
    url: ROUTES.ORDERS,
    icon: CreditCard,
    items: [
      { title: "Đơn hàng", url: ROUTES.ORDERS, icon: CreditCard },
      { title: "Khoá học của user", url: ROUTES.USER_COURSES, icon: BookOpen },
      { title: "Thanh toán VNPAY", url: ROUTES.PAYMENTS_VNPAY, icon: Download },
    ],
  },
  // {
  //   title: "Báo cáo & Analytics",
  //   url: ROUTES.ANALYTICS_OVERVIEW,
  //   icon: BarChart3,
  //   items: [
  //     { title: "Tổng quan", url: ROUTES.ANALYTICS_OVERVIEW, icon: BarChart3 },
  //     { title: "Doanh thu", url: ROUTES.ANALYTICS_REVENUE, icon: TrendingUp },
  //     {
  //       title: "Hiệu quả học tập",
  //       url: ROUTES.ANALYTICS_LEARNING,
  //       icon: TrendingUp,
  //     },
  //   ],
  // },
  // {
  //   title: "Cài đặt hệ thống",
  //   url: ROUTES.SETTINGS_SYSTEM,
  //   icon: Settings,
  //   items: [
  //     {
  //       title: "Thông tin hệ thống",
  //       url: ROUTES.SETTINGS_SYSTEM,
  //       icon: Settings,
  //     },
  //     {
  //       title: "Tích hợp & dịch vụ",
  //       url: ROUTES.SETTINGS_INTEGRATIONS,
  //       icon: PlugZap,
  //     },
  //   ],
  // },
];
