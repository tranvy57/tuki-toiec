import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar/app-sidebar";
import { SiteHeader } from "@/components/side-bar/site-header";

export function DashboardLayout() {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-6">
          <Outlet /> {/* 👈 chỗ render page con */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
