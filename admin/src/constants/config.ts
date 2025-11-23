// App configuration
export const APP_CONFIG = {
  // App meta
  APP_NAME: "TukiTOEIC Admin",
  APP_DESCRIPTION: "Hệ thống quản trị TukiTOEIC",
  VERSION: "1.0.0",

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword"],

  // UI
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,

  // Data refresh intervals (ms)
  REFRESH_INTERVALS: {
    DASHBOARD: 30000, // 30s
    ORDERS: 10000, // 10s
    ANALYTICS: 60000, // 1min
  },
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,

  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",

    // Users
    USERS: "/users",
    ROLES: "/roles",
    PERMISSIONS: "/permissions",

    // Learning content
    COURSES: "/courses",
    PHASES: "/phases",
    LESSONS: "/lessons",
    LESSON_CONTENTS: "/lesson-contents",

    // Tests & Questions
    TESTS: "/tests",
    QUESTIONS: "/questions",
    VOCABULARIES: "/vocabularies",

    // Commerce
    ORDERS: "/orders",
    USER_COURSES: "/user-courses",
    PAYMENTS: "/payments",

    // Analytics
    ANALYTICS: "/analytics",
    REPORTS: "/reports",
  },
} as const;

// Status configurations
export const STATUS_CONFIG = {
  COURSE: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    DRAFT: "draft",
  },

  PHASE: {
    LOCKED: "locked",
    ACTIVE: "active",
    COMPLETED: "completed",
  },

  ORDER: {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
  },

  PAYMENT: {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled",
  },
} as const;

// Content types
export const CONTENT_TYPES = {
  LESSON: {
    PLAN: "plan",
    EXERCISE: "exercise",
    MOCK: "mock",
    REVIEW: "review",
    AI: "ai",
  },

  LESSON_CONTENT: {
    VIDEO: "video",
    THEORY: "theory",
    STRATEGY: "strategy",
    VOCABULARY: "vocabulary",
    QUIZ: "quiz",
    EXPLANATION: "explanation",
  },

  QUESTION: {
    LISTENING: "listening",
    READING: "reading",
    SPEAKING: "speaking",
    WRITING: "writing",
  },
} as const;

// UI Colors for status, types, etc.
export const UI_COLORS = {
  STATUS: {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    LOCKED: "bg-gray-100 text-gray-600",
  },

  PRIORITY: {
    HIGH: "bg-red-100 text-red-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    LOW: "bg-green-100 text-green-800",
  },

  CONTENT_TYPE: {
    VIDEO: "bg-red-100 text-red-800",
    THEORY: "bg-blue-100 text-blue-800",
    STRATEGY: "bg-purple-100 text-purple-800",
    VOCABULARY: "bg-green-100 text-green-800",
    QUIZ: "bg-orange-100 text-orange-800",
    EXPLANATION: "bg-yellow-100 text-yellow-800",
  },
} as const;
