"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { LucideIcon } from "lucide-react"

export interface AppNotification {
  id: string
  title: string
  description: string
  time: string
  icon: LucideIcon
  color: string
  bgColor: string
  isRead: boolean
}

interface NotificationContextType {
  notifications: AppNotification[]
  addNotification: (notification: Omit<AppNotification, "id" | "time" | "isRead">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const addNotification = (notification: Omit<AppNotification, "id" | "time" | "isRead">) => {
    const newNotification: AppNotification = {
      ...notification,
      id: crypto.randomUUID(),
      time: "Just now",
      isRead: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
