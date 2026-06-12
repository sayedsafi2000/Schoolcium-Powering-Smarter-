import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const glassCardVariants = cva(
  "surface-card transition-shadow",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md",
        bordered: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const GlassCard = React.forwardRef(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glassCardVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
))
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 px-5 py-4 border-b border-border", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-semibold leading-none", className)}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-5 py-4 border-t border-border", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardFooter,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
}
