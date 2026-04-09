"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Scale,
  ChevronLeft,
  LogOut,
  Menu,
  Code2,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  {
    href: "/dashboard/conversations",
    label: "Conversations",
    icon: MessageSquare,
  },
  { href: "/dashboard/intake", label: "Intake Config", icon: FileText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const settingsItems = [
  { href: "/dashboard/settings", label: "General", icon: Settings },
  { href: "/dashboard/settings/widget", label: "Widget", icon: Code2 },
  {
    href: "/dashboard/settings/integrations",
    label: "Integrations",
    icon: Plug,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-200",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-800 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-lg">Legal</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-800">
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                Settings
              </p>
            )}
            {settingsItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-600/10 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-800 p-3 space-y-1 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-800 flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
