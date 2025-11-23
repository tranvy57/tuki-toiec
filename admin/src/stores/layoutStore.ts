import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type BreakpointSize = "sm" | "md" | "lg" | "xl";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  variant: "default" | "floating" | "inset";
}

interface LayoutState extends SidebarState {
  // Theme state
  theme: Theme;

  // Responsive state
  isMobile: boolean;
  screenSize: BreakpointSize;

  // Loading states
  globalLoading: boolean;
  pageLoading: boolean;

  // Modal/Dialog states
  activeModal: string | null;
  modals: Record<string, boolean>;

  // Navigation state
  breadcrumbs: Array<{ title: string; href?: string }>;
  pageTitle: string;

  // Actions - Sidebar
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarVariant: (variant: SidebarState["variant"]) => void;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;

  // Actions - Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Actions - Responsive
  setMobile: (isMobile: boolean) => void;
  setScreenSize: (size: BreakpointSize) => void;

  // Actions - Loading
  setGlobalLoading: (loading: boolean) => void;
  setPageLoading: (loading: boolean) => void;

  // Actions - Modal
  openModal: (modal: string) => void;
  closeModal: (modal?: string) => void;
  toggleModal: (modal: string) => void;

  // Actions - Navigation
  setBreadcrumbs: (
    breadcrumbs: Array<{ title: string; href?: string }>
  ) => void;
  setPageTitle: (title: string) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      // Initial state - Sidebar
      isOpen: true,
      isCollapsed: false,
      variant: "default",

      // Initial state - Theme
      theme: "light",

      // Initial state - Responsive
      isMobile: false,
      screenSize: "lg",

      // Initial state - Loading
      globalLoading: false,
      pageLoading: false,

      // Initial state - Modal
      activeModal: null,
      modals: {},

      // Initial state - Navigation
      breadcrumbs: [],
      pageTitle: "",

      // Sidebar actions
      setSidebarOpen: (open) => set({ isOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setSidebarVariant: (variant) => set({ variant }),
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleSidebarCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      // Theme actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      // Responsive actions
      setMobile: (isMobile) => set({ isMobile }),
      setScreenSize: (screenSize) => set({ screenSize }),

      // Loading actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      setPageLoading: (loading) => set({ pageLoading: loading }),

      // Modal actions
      openModal: (modal) =>
        set((state) => ({
          activeModal: modal,
          modals: { ...state.modals, [modal]: true },
        })),
      closeModal: (modal) =>
        set((state) => {
          if (!modal) {
            return { activeModal: null, modals: {} };
          }
          const newModals = { ...state.modals };
          delete newModals[modal];
          return {
            activeModal: state.activeModal === modal ? null : state.activeModal,
            modals: newModals,
          };
        }),
      toggleModal: (modal) =>
        set((state) => {
          const isOpen = state.modals[modal];
          if (isOpen) {
            const newModals = { ...state.modals };
            delete newModals[modal];
            return {
              activeModal:
                state.activeModal === modal ? null : state.activeModal,
              modals: newModals,
            };
          } else {
            return {
              activeModal: modal,
              modals: { ...state.modals, [modal]: true },
            };
          }
        }),

      // Navigation actions
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      setPageTitle: (pageTitle) => set({ pageTitle }),
    }),
    {
      name: "layout-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        theme: state.theme,
        variant: state.variant,
      }),
    }
  )
);
