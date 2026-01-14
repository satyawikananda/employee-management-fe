"use client"

import { cn } from "@/lib/utils"

interface AppPaddingLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function AppPaddingLayout({ children, className, ...props }: AppPaddingLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col w-full",
        "p-4 sm:p-6 lg:p-8",
        "min-h-[calc(100vh-4rem)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default AppPaddingLayout