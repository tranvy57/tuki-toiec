import { useState, useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";

// Hook for admin dashboard data
export const useAdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    premiumUsers: 0,
    revenue: 0,
    tests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats({
        users: 15240,
        premiumUsers: 3120,
        revenue: 245600,
        tests: 850,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

// Hook for page management
export const usePage = () => {
  const {
    pageTitle,
    breadcrumbs,
    pageLoading,
    setPageTitle,
    setBreadcrumbs,
    setPageLoading,
  } = useLayoutStore();

  const setPage = (
    title: string,
    breadcrumbs?: Array<{ title: string; href?: string }>
  ) => {
    setPageTitle(title);
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }
  };

  return {
    pageTitle,
    breadcrumbs,
    pageLoading,
    setPage,
    setPageTitle,
    setBreadcrumbs,
    setPageLoading,
  };
};

// Hook for responsive behavior
export const useResponsive = () => {
  const { isMobile, screenSize, setMobile, setScreenSize } = useLayoutStore();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const newIsMobile = width < 768;

      let newScreenSize: "sm" | "md" | "lg" | "xl" = "lg";
      if (width < 640) newScreenSize = "sm";
      else if (width < 768) newScreenSize = "md";
      else if (width < 1024) newScreenSize = "lg";
      else newScreenSize = "xl";

      // Chỉ update khi giá trị thực sự thay đổi
      if (isMobile !== newIsMobile) {
        setMobile(newIsMobile);
      }

      if (screenSize !== newScreenSize) {
        setScreenSize(newScreenSize);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []); // Empty dependency array to avoid infinite loops

  return {
    isMobile,
    screenSize,
    isTablet: screenSize === "md",
    isDesktop: screenSize === "lg" || screenSize === "xl",
  };
};

// Hook for modal management
export const useModal = () => {
  const { activeModal, modals, openModal, closeModal, toggleModal } =
    useLayoutStore();

  const isOpen = (modalId: string) => Boolean(modals[modalId]);

  return {
    activeModal,
    modals,
    isOpen,
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
  };
};
