"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users } from "lucide-react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full px-4 ">
      <div className="max-w-7xl mx-auto w-full flex gap-6">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 shrink-0 transition-transform duration-300 ease-in-out
            ${isOpen ? "block" : "hidden"} sm:block`}
        >
          <div className="px-3 py-4 space-y-2">
            <nav className="space-y-2 font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/users"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {/* Toggle button on mobile */}
          <div className="mb-4 sm:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-label="Toggle sidebar"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
