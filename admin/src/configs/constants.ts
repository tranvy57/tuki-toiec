import { Download, FileText, LayoutDashboard, Plus } from "lucide-react";

export const APP_CONFIG = {
  // App meta
  APP_NAME: "TukiTOEIC",
  APP_DESCRIPTION: "Quản lý thi TOEIC",

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,

  // Cart
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,

  // URLs

  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
} as const;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[slug]",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  ORDERS: "/orders",
  LOGIN: "/login",
  REGISTER: "/register",
  SEARCH: "/search",
  CATEGORY: "/category/[slug]",
  BRAND: "/brand/[slug]",
} as const;

export const SIDE_BAR_MENU = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, isActive: true },
  {
    title: "Quản lý đề thi",
    icon: FileText,
    url: "/exams/list",
    items: [
      { title: "Danh sách đề thi", url: "/exams/list", icon: FileText },
      { title: "Tạo đề thi", url: "/exams/create", icon: Plus },
      { title: "Cào đề thi", url: "/exams/crawl", icon: Download },
    ],
  },
]

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
} as const;
