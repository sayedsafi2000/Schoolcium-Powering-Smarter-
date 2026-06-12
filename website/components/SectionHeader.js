import { cn } from '@/lib/utils'

export default function SectionHeader({ label, title, subtitle, center = true, light = false }) {
  return (
    <div className={cn('mb-12', center && 'text-center')}>
      {label && (
        <span className={cn(
          'section-label mb-4',
          light ? 'bg-white/15 text-emerald-100' : 'bg-brand-50 text-brand-700'
        )}>
          <span className={cn('h-1.5 w-1.5 rounded-full', light ? 'bg-emerald-300' : 'bg-brand-500')} />
          {label}
        </span>
      )}
      <h2 className={cn(
        'text-3xl md:text-4xl font-extrabold leading-tight tracking-tight',
        light ? 'text-white' : 'text-slate-900'
      )} style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-4 text-base md:text-lg leading-relaxed',
          center && 'mx-auto max-w-2xl',
          light ? 'text-emerald-100' : 'text-slate-500'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
