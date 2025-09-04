import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar.tsx'
import { AppSidebar } from './components/side-bar/app-sidebar.tsx'
import { SiteHeader } from './components/side-bar/site-header.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
      </SidebarInset>
    </SidebarProvider>
  </StrictMode>
);
