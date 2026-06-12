import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react'
import TopContactBar from './TopContactBar'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/admission', label: 'Admission' },
  { href: '/teachers',  label: 'Teachers' },
  { href: '/notices',   label: 'Notices' },
  { href: '/events',    label: 'Events' },
  { href: '/gallery',   label: 'Gallery' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/contact',   label: 'Contact' },
]

export default function SiteHeader() {
  const router = useRouter()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [router.pathname])

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full bg-white transition-all duration-200',
      scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'border-b border-slate-100'
    )}>
      <TopContactBar />

      <div className="container-school">
        <div className="flex items-center justify-between h-[70px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800
                              flex items-center justify-center shadow-md
                              group-hover:shadow-lg group-hover:scale-105 transition-all">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="leading-none">
              <p className="font-bold text-slate-900 text-base leading-tight">Ideal Vision</p>
              <p className="text-xs text-brand-600 font-semibold tracking-wide">Academy · Badaghat</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(link => {
              const active = router.pathname === link.href
              return (
                <Link key={link.href} href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all',
                    active
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                  )}>
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-brand-600" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/admission" className="btn-primary text-xs px-5 py-2.5">
              Apply Now
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <nav className="container-school py-4 space-y-1">
            {NAV.map(link => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-2xl text-sm font-semibold transition-all',
                  router.pathname === link.href
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-700'
                )}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <Link href="/admission" className="btn-primary w-full justify-center">
                Apply for Admission
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
