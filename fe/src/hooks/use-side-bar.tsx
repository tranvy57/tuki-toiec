"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage safely
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("ui.sidebarCollapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (mounted) localStorage.setItem("ui.sidebarCollapsed", String(collapsed));
  }, [collapsed, mounted]);

  // Keyboard shortcut: Ctrl/Cmd + \
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggle = useCallback(() => setCollapsed((prev) => !prev), []);

  // Tránh re-render không cần thiết cho cây con
  const value = useMemo<SidebarContextType>(
    () => ({
      collapsed,
      toggle,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, toggle, mobileOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
