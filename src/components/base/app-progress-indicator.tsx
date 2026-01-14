"use client"

import { cn } from "@/lib/utils"

interface AppProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
}

export function AppProgressIndicator({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
  ...props
}: AppProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn("w-full space-y-2", className)} {...props}>
      <div className="flex justify-between text-sm items-center">
        {label && <span className="font-medium">{label}</span>}
        {showPercentage && (
          <span className="text-muted-foreground">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
