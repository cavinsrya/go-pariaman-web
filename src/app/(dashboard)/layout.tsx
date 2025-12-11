import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardBreadcrumb from "./_components/dashboard-breadcrump";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthStoreProvider from "@/providers/auth-store-provider";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesStore = await cookies();
  const profile = JSON.parse(cookiesStore.get("user_profile")?.value ?? "{}");

  if (!profile || !profile.id) {
    redirect("/login");
  }
  return (
    <AuthStoreProvider profile={profile}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidde">
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DashboardBreadcrumb />
            </div>
          </header>
          <main className="gap-2 p-4 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthStoreProvider>
  );
}
