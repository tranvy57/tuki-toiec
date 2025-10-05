import { useSidebar } from "@/hooks/use-side-bar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      title={
        collapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"
      }
    >
      {collapsed ? (
        <PanelLeftOpen className="w-5 h-5 text-slate-600" />
      ) : (
        <PanelLeftClose  className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}