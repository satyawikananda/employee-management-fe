import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/base/sidebar/app-sidebar";
import AppHeader from "@/components/base/app-header";
import { NotificationListener } from "@/components/base/app-notification-listener";

function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <NotificationListener />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainAppLayout