import { Phone, Mail } from 'lucide-react'

export default function TopContactBar() {
  return (
    <div className="bg-brand-800 text-white text-xs hidden md:block">
      <div className="container-school flex items-center justify-between py-2.5">
        <div className="flex items-center gap-6">
          <a href="tel:01773763422" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors font-medium">
            <Phone className="h-3.5 w-3.5" />
            01773-763422
          </a>
          <a href="mailto:idealvisionacademy@gmail.com" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
            <Mail className="h-3.5 w-3.5" />
            idealvisionacademy@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          Admissions Open 2025–2026
        </div>
      </div>
    </div>
  )
}
