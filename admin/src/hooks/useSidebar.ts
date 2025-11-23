import { useLayoutStore } from "@/stores/layoutStore";

export const useSidebar = () => {
  const {
    isOpen,
    isCollapsed,
    variant,
    setSidebarOpen,
    setSidebarCollapsed,
    setSidebarVariant,
    toggleSidebar,
    toggleSidebarCollapse,
  } = useLayoutStore();

  return {
    isOpen,
    isCollapsed,
    variant,
    open: () => setSidebarOpen(true),
    close: () => setSidebarOpen(false),
    toggle: toggleSidebar,
    collapse: () => setSidebarCollapsed(true),
    expand: () => setSidebarCollapsed(false),
    toggleCollapse: toggleSidebarCollapse,
    setVariant: setSidebarVariant,
  };
};
