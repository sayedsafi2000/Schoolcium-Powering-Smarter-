import { cn } from '@/lib/utils'

export function PageActions({ children, className }) {
  if (!children) return null

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      {children}
    </div>
  )
}

export function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  )
}
