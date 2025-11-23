// Application Configuration
export const APP_CONFIG = {
  // App meta
  NAME: "TukiTOEIC",
  DESCRIPTION: "Quản lý thi TOEIC",
  VERSION: "1.0.0",

  // UI Configuration
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 64,

  // Business Logic
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],

  // Timeouts
  API_TIMEOUT: 30000,
  DEBOUNCE_DELAY: 300,

  // Theme
  DEFAULT_THEME: "light" as const,

  // LocalStorage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "tuki_admin_token",
    USER_DATA: "tuki_admin_user",
    LAYOUT_SETTINGS: "tuki_admin_layout",
    SIDEBAR_STATE: "tuki_admin_sidebar",
  },
} as const;

// Status Constants
export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// UI Constants
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;
