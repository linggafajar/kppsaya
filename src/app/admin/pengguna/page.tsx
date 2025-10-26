'use client';

import { AppSidebar } from "@/components/adminpage";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminPenggunaPage from "@/components/pengelolaanpengguna";

export default function AdminPengguna() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar className="w-64" />

        {/* Konten utama */}
        <main className="flex-1 p-8 bg-[hsl(var(--background))]">
          <AdminPenggunaPage />
        </main>
      </div>
    </SidebarProvider>
  );
}

