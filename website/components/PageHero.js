import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function PageHero({ title, subtitle, breadcrumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-blue-700 py-20 md:py-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/[0.03]" />

      <div className="container-school relative text-center">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center gap-1.5 text-sm text-emerald-200 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                {c.href
                  ? <Link href={c.href} className="hover:text-white transition-colors">{c.label}</Link>
                  : <span className="text-white font-semibold">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
