import * as React from "react"
import { cn } from "@/lib/utils"

const toneStyles = {
  default: "text-foreground bg-muted",
  success: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
  warning: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
  danger: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/40",
  info: "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40",
}

export function StatCard({ icon: Icon, title, value, change, variant = "default", className }) {
  return (
    <div className={cn("surface-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              change.startsWith('+') ? "text-emerald-600" : "text-red-600"
            )}>
              {change}
            </p>
          )}
        </div>

        {Icon && (
          <div className={cn("rounded-md p-2 shrink-0", toneStyles[variant] || toneStyles.default)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}
