import Link from 'next/link'
import { GraduationCap, Phone, Mail, MapPin, Facebook, Youtube, ArrowRight } from 'lucide-react'

const QUICK = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About Us' },
  { href: '/message',   label: "Principal's Message" },
  { href: '/academics', label: 'Academics' },
  { href: '/admission', label: 'Admission' },
  { href: '/contact',   label: 'Contact' },
]

const ACADEMIC = [
  { href: '/notices',   label: 'Notice Board' },
  { href: '/events',    label: 'Events & News' },
  { href: '/gallery',   label: 'Gallery' },
  { href: '/teachers',  label: 'Our Teachers' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/facilities',label: 'Facilities' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Top CTA strip */}
      <div className="bg-brand-700">
        <div className="container-school py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-xl">Ready to enroll your child?</p>
            <p className="text-emerald-200 text-sm mt-0.5">Admissions are open for 2025–2026 academic year.</p>
          </div>
          <Link href="/admission" className="btn-white shrink-0">
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-school py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-2xl bg-brand-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Ideal Vision Academy</p>
                <p className="text-xs text-slate-500">Badaghat, Sunamganj</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Committed to nurturing knowledge, discipline, creativity and moral values for the next generation.
            </p>
            <div className="flex gap-2 mt-6">
              {[
                { Icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                { Icon: Youtube,  href: '#', color: 'hover:bg-red-600'  },
              ].map(({ Icon, href, color }) => (
                <a key={href} href={href}
                  className={`h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center
                              text-slate-400 hover:text-white ${color} transition-all`}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Academic</h4>
            <ul className="space-y-3">
              {ACADEMIC.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:01773763422" className="flex items-start gap-3 group">
                  <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-700 transition-colors">
                    <Phone className="h-3.5 w-3.5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone</p>
                    <p className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors font-semibold">01773-763422</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:idealvisionacademy@gmail.com" className="flex items-start gap-3 group">
                  <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-700 transition-colors">
                    <Mail className="h-3.5 w-3.5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="text-xs text-slate-300 group-hover:text-emerald-400 transition-colors break-all">idealvisionacademy@gmail.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Address</p>
                  <p className="text-sm text-slate-300">Badaghat, Sunamganj, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-school py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Ideal Vision Academy, Badaghat. All rights reserved.</p>
          <p>Powered by <span className="text-brand-500 font-semibold">Schoolcium</span></p>
        </div>
      </div>
    </footer>
  )
}
