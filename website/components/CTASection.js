import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTASection({
  title    = 'Ready to Join Ideal Vision Academy?',
  subtitle = 'Give your child the best education in Sunamganj. Enroll today.',
  primaryLabel   = 'Apply for Admission',
  primaryHref    = '/admission',
  secondaryLabel = 'Contact Us',
  secondaryHref  = '/contact',
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-slate-900 py-20">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
      <div className="container-school relative text-center">
        <span className="inline-block bg-white/10 text-teal-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/10">
          Enroll Today
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
        <p className="mt-4 text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={primaryHref} className="btn-white">
            {primaryLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={secondaryHref} className="btn-outline-white">
            {secondaryLabel}
          </Link>
        </div>
        <a href="tel:01773763422"
          className="mt-5 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors font-medium">
          <Phone className="h-4 w-4" />
          Or call: 01773-763422
        </a>
      </div>
    </section>
  )
}
