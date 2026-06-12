import * as React from "react"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/custom/glass-card"
import { cn } from "@/lib/utils"

export function ChartCard({ title, description, children, className, headerAction }) {
  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <GlassCardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <GlassCardTitle>{title}</GlassCardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      </GlassCardHeader>
      <GlassCardContent className="pt-0 pb-5">
        <div className="w-full h-[280px] md:h-[320px]">
          {children}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}
