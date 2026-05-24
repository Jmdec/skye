"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, LogOut, Sparkles, MessageSquare, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const adminRoutes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Orders", icon: Package, href: "/admin/orders" },
    { label: "Inquiries", icon: MessageSquare, href: "/admin/contacts" },
        { label: "Annoucements", icon: Megaphone, href: "/admin/announcements" },
         { label: "NewsletterSubscriber", icon: Megaphone, href: "/admin/newsletter" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-60 bg-white border-r border-pink-100/80">
      {/* Brand */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md shadow-pink-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-pink-300 font-semibold leading-none mb-0.5">
              Skye Avenue
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-none">
              Admin
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-pink-100 via-rose-100 to-transparent mb-4" />

      {/* Nav label */}
      <p className="px-6 text-[9px] uppercase tracking-[0.25em] text-pink-300 font-semibold mb-2">
        Menu
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {adminRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium shadow-md shadow-pink-200"
                  : "text-gray-500 hover:bg-pink-50 hover:text-pink-600",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{route.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 mx-3 mb-4">
        <div className="h-px bg-gradient-to-r from-pink-100 via-rose-100 to-transparent mb-3" />
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group">
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
