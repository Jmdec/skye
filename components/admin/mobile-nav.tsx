"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Package, Home, LogOut, MessageSquare, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/products",
  },
    {
    label: "Orders",
    icon: Package,
    href: "/admin/orders",
  },
  {
    label: "Inquiries",
    icon: MessageSquare,
    href: "/admin/contacts",
  },
  {
    label: "Announcements",
    icon: Megaphone,
    href: "/admin/announcements",
  },
   {
    label: "Newsletter",
    icon: Megaphone,
    href: "/admin/newsletter",
  },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-4">
      <h1 className="text-xl font-bold">Admin</h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-slate-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-slate-900">
          <nav className="flex flex-col p-4 space-y-2 mt-8">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{route.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-slate-800">
              <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
