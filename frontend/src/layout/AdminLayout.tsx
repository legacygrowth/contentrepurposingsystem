import { AdminSidebar } from "@/components/admin/sidebar/navbar/admin-sidebar";
import Header from "@/components/dashboard/header/Header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
