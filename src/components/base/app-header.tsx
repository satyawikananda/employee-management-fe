"use client"

import AppBreadcrumb from "@/components/base/app-breadcrumb"
import AppNotification from "@/components/base/app-notification"
import AppSearch from "@/components/base/app-search"
import { AppThemeToggle } from "@/components/base/app-theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"

function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-muted/20">
      <div className="flex items-center justify-between gap-2 px-4 py-2 m-4 w-full">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1 text-foreground" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <AppBreadcrumb />
        </div>
        <div className="flex items-center gap-4">
          <AppSearch />
          <AppThemeToggle />
          <AppNotification />
        </div>
      </div>
    </header>
  )
}

export default AppHeader