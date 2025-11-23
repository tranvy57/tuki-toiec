import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar/app-sidebar";
import { SiteHeader } from "@/components/side-bar/site-header";
import { useSidebar } from "@/hooks/useSidebar";
import { useLayoutStore } from "@/stores/layoutStore";
import { useResponsive } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function DashboardLayout() {
  const { theme } = useLayoutStore();
  const sidebar = useSidebar();
  const { isMobile } = useResponsive();

  // Auto-collapse sidebar on mobile - remove to prevent infinite loop
  // useEffect(() => {
  //   if (isMobile && sidebar.isOpen) {
  //     sidebar.close();
  //   }
  // }, [isMobile, sidebar.isOpen, sidebar.close]);

  return (
    <div className={cn("min-h-screen bg-gray-50", theme === 'dark' && 'dark')}>
      <SidebarProvider
        open={sidebar.isOpen}
        onOpenChange={sidebar.toggle}
        style={
          {
            "--sidebar-width": "280px",
            "--header-height": "64px",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant={sidebar.variant} />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
