import {
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Truck,
  Users,
  ChartSpline,
} from "lucide-react"

export const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Shipped",
    description: "Your order #12345 has been shipped and is on its way.",
    icon: Truck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    isRead: false,
    time: "2m ago"
  },
  {
    id: 2,
    title: "New Message",
    description: "You have a new message from the support team.",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    isRead: false,
    time: "1h ago"
  },
  {
    id: 3,
    title: "System Alert",
    description: "Your subscription is about to expire in 3 days.",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    isRead: true,
    time: "5h ago"
  },
  {
    id: 4,
    title: "Task Completed",
    description: "Project 'Dashboard Redesign' has been marked as complete.",
    icon: CheckCircle2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    isRead: true,
    time: "1d ago"
  }
]

export const menu = {
  navMain: [
    {
      title: "Employee",
      url: "/",
      icon: Users,
    },
  ],
  navGrowth: [
    {
      title: "Customers",
      url: "/customers",
      icon: Users
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartSpline
    },
  ],
  navComponent: [
    {
      title: "Card",
      url: "/components/card"
    }
  ]
}