"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotification } from "@/components/provider/notification.provider"

function AppNotification() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotification()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="text-muted-foreground" size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 shadow-lg border-border/50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <span className="text-sm font-semibold">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              className="text-primary text-xs font-medium cursor-pointer hover:underline"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </span>
          )}
        </div>

        <div className="flex flex-col max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-all cursor-pointer",
                  !notification.isRead ? "bg-primary/5" : "bg-transparent"
                )}
              >
                <div className={cn("mt-0.5 p-2 rounded-full shrink-0", notification.bgColor)}>
                  <notification.icon size={16} className={notification.color} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm leading-none", !notification.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                      {notification.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground pt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border bg-muted/20">
          <p className="w-full text-center text-xs font-medium text-primary hover:underline py-1 cursor-pointer">
            View all notifications
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AppNotification