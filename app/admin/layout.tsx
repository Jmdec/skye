import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing products",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50">
        <AdminSidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-64">
        <div className="md:hidden">
          <AdminMobileNav />
        </div>
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}