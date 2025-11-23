// Admin Dashboard Routes
export const ADMIN_ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",

  // Dashboard
  DASHBOARD: "/dashboard",

  // User Management
  USERS: "/users",
  ROLES: "/roles",
  PERMISSIONS: "/permissions",

  // Content Management
  COURSES: "/courses",
  PHASES: "/phases",
  LESSONS: "/lessons",
  LESSON_CONTENTS: "/lesson-contents",

  // Exam Management
  TESTS: "/tests",
  QUESTIONS: "/questions",
  VOCABULARIES: "/vocabularies",
  EXAMS_CRAWL: "/exams/crawl",
  EXAM_CREATE: "/exams/create",
  EXAM_DETAIL: (id: string) => `/exams/${id}`,

  // Results & Analytics
  ATTEMPTS: "/attempts",
  USER_PROGRESS: "/user-progress",
  STUDY_TASKS: "/study-tasks",
  SPEAKING_ATTEMPTS: "/speaking-attempts",

  // Commerce
  ORDERS: "/orders",
  USER_COURSES: "/user-courses",
  PAYMENTS_VNPAY: "/payments/vnpay",

  // Analytics & Reports
  ANALYTICS: "/analytics",
  ANALYTICS_OVERVIEW: "/analytics/overview",
  ANALYTICS_REVENUE: "/analytics/revenue",
  ANALYTICS_LEARNING: "/analytics/learning",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_SYSTEM: "/settings/system",
  SETTINGS_INTEGRATIONS: "/settings/integrations",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    DETAIL: (id: string) => `/users/${id}`,
  },

  // Courses
  COURSES: {
    LIST: "/courses",
    CREATE: "/courses",
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    DETAIL: (id: string) => `/courses/${id}`,
  },

  // Exams
  EXAMS: {
    LIST: "/exams",
    CREATE: "/exams",
    UPDATE: (id: string) => `/exams/${id}`,
    DELETE: (id: string) => `/exams/${id}`,
    DETAIL: (id: string) => `/exams/${id}`,
    CRAWL: "/exams/crawl",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    CHARTS: "/dashboard/charts",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
  },
} as const;

// Legacy ROUTES export for backward compatibility
export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Users & Permissions
  USERS: "/users",
  ROLES: "/roles",
  PERMISSIONS: "/permissions",

  // Learning Content
  COURSES: "/courses",
  PHASES: "/phases",
  LESSONS: "/lessons",
  LESSON_CONTENTS: "/lesson-contents",
  LESSONS_CONTENTS: (lessonId: string) => `/lessons/${lessonId}/contents`,

  // Tests & Questions
  TESTS: "/tests",
  TEST_DETAIL: (id: string) => `/tests/${id}`,
  QUESTIONS: "/questions",
  VOCABULARIES: "/vocabularies",
  EXAMS_CRAWL: "/exams/crawl",

  // Learning Results
  ATTEMPTS: "/attempts",
  USER_PROGRESS: "/user-progress",
  STUDY_TASKS: "/study-tasks",
  SPEAKING_ATTEMPTS: "/speaking-attempts",

  // Commerce
  ORDERS: "/orders",
  USER_COURSES: "/user-courses",
  PAYMENTS_VNPAY: "/payments/vnpay",

  // Analytics
  ANALYTICS_OVERVIEW: "/analytics/overview",
  ANALYTICS_REVENUE: "/analytics/revenue",
  ANALYTICS_LEARNING: "/analytics/learning",

  // Settings
  SETTINGS_SYSTEM: "/settings/system",
  SETTINGS_INTEGRATIONS: "/settings/integrations",
} as const;

// Page metadata
export const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.USERS]: "Quản lý người dùng",
  [ROUTES.COURSES]: "Quản lý khóa học",
  [ROUTES.PHASES]: "Quản lý Phase & lộ trình",
  [ROUTES.LESSONS]: "Quản lý bài học",
  [ROUTES.LESSON_CONTENTS]: "Quản lý nội dung bài học",
  [ROUTES.TESTS]: "Quản lý đề thi",
  [ROUTES.QUESTIONS]: "Quản lý câu hỏi",
  [ROUTES.VOCABULARIES]: "Quản lý từ vựng",
  [ROUTES.ORDERS]: "Quản lý đơn hàng",
  [ROUTES.ATTEMPTS]: "Lần làm bài",
} as const;

// Breadcrumb configurations
export const BREADCRUMB_CONFIG = {
  [ROUTES.COURSES]: [
    { label: "Dashboard", href: ROUTES.DASHBOARD },
    { label: "Nội dung học tập" },
    { label: "Khóa học" },
  ],
  [ROUTES.PHASES]: [
    { label: "Dashboard", href: ROUTES.DASHBOARD },
    { label: "Nội dung học tập" },
    { label: "Phase & lộ trình" },
  ],
  [ROUTES.LESSONS]: [
    { label: "Dashboard", href: ROUTES.DASHBOARD },
    { label: "Nội dung học tập" },
    { label: "Bài học" },
  ],
  [ROUTES.LESSON_CONTENTS]: [
    { label: "Dashboard", href: ROUTES.DASHBOARD },
    { label: "Nội dung học tập" },
    { label: "Nội dung bài học" },
  ],
} as const;
