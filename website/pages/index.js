import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowRight, BookOpen, Users, Award, GraduationCap, Phone, MapPin,
  Download, ChevronRight, Star, Shield, Lightbulb, Heart,
  Building, Library, CheckCircle, Bell
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import NoticeCard from '@/components/NoticeCard'
import TeacherCard from '@/components/TeacherCard'
import CTASection from '@/components/CTASection'
import { getPublicNotices } from '@/lib/api'

const MOCK_TEACHERS = [
  { _id: '1', name: 'Md. Abdul Karim',      designation: 'Principal',   subject: 'Islamic Studies' },
  { _id: '2', name: 'Mrs. Fatema Begum',    designation: 'Sr. Teacher', subject: 'Bengali & English' },
  { _id: '3', name: 'Md. Rafiqul Islam',    designation: 'Teacher',     subject: 'Mathematics' },
  { _id: '4', name: 'Mrs. Nasrin Akter',    designation: 'Teacher',     subject: 'Science' },
]

const PROGRAMS = [
  { label: 'Pre-Primary', classes: 'KG I & II',  color: 'bg-pink-50   border-pink-100',  dot: 'bg-pink-400',   icon: '🌱' },
  { label: 'Primary',     classes: 'Class 1–5',  color: 'bg-blue-50   border-blue-100',  dot: 'bg-blue-500',   icon: '📚' },
  { label: 'Junior',      classes: 'Class 6–8',  color: 'bg-purple-50 border-purple-100',dot: 'bg-purple-500', icon: '✏️' },
  { label: 'Secondary',   classes: 'Class 9–10', color: 'bg-amber-50  border-amber-100', dot: 'bg-amber-500',  icon: '🎓' },
]

const FACILITIES = [
  { emoji: '🏫', label: 'Modern Classrooms' },
  { emoji: '📖', label: 'School Library' },
  { emoji: '💻', label: 'Computer / ICT Lab' },
  { emoji: '⚽', label: 'Sports Ground' },
  { emoji: '🎭', label: 'Cultural Programs' },
  { emoji: '🛡️', label: 'Safe Environment' },
]

const WHY_US = [
  'Experienced & caring teachers',
  'Strong board exam results',
  'NCTB-aligned curriculum',
  'Sports & cultural activities',
  'Regular parent meetings',
  'Affordable quality education',
]

export default function HomePage() {
  const [notices, setNotices]         = useState([])
  const [loadingNotices, setLoading]  = useState(true)

  useEffect(() => {
    getPublicNotices({ limit: 3 })
      .then(d => setNotices(d.notices || []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Head>
        <title>Ideal Vision Academy — Building Bright Futures | Badaghat, Sunamganj</title>
        <meta name="description" content="Ideal Vision Academy, Badaghat — a premier school in Sunamganj, Bangladesh committed to quality education, discipline and moral values." />
      </Head>

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-blue-800 min-h-[88vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.04] -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/[0.04] translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="container-school relative py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Admissions Open · 2025–2026
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Building Bright Futures Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                  Quality Education
                </span>
              </h1>

              <p className="text-lg text-emerald-100 leading-relaxed max-w-lg mb-10">
                Ideal Vision Academy is committed to nurturing knowledge, discipline, creativity and moral values for students in Sunamganj.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/admission" className="btn-white">
                  Apply for Admission <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn-outline-white">
                  About Our School
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                {[
                  { val: '800+', lbl: 'Students' },
                  { val: '30+',  lbl: 'Teachers' },
                  { val: '15+',  lbl: 'Years' },
                  { val: '98%',  lbl: 'Pass Rate' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="text-center">
                    <p className="text-2xl font-extrabold text-white">{val}</p>
                    <p className="text-xs text-emerald-300 font-semibold mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Info card cluster */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { emoji: '🏆', title: 'Top Results',     desc: '98% pass rate in SSC examinations',       bg: 'bg-white' },
                { emoji: '👨‍🏫', title: 'Expert Faculty',  desc: '30+ qualified and experienced teachers',  bg: 'bg-brand-50' },
                { emoji: '📚', title: 'Full Curriculum',  desc: 'NCTB-aligned Pre-Primary to Class 10',     bg: 'bg-blue-50' },
                { emoji: '🌿', title: 'Safe Campus',      desc: 'Clean, disciplined & welcoming environment',bg: 'bg-amber-50' },
              ].map(({ emoji, title, desc, bg }, i) => (
                <div key={title} className={`${bg} rounded-3xl p-5 shadow-clay ${i === 1 ? 'mt-6' : ''} ${i === 2 ? '-mt-3' : ''}`}>
                  <span className="text-3xl block mb-2">{emoji}</span>
                  <p className="font-bold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ADMISSION BANNER ──────────────────────────────────────────────── */}
      <section className="bg-amber-500">
        <div className="container-school py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-amber-900 font-bold text-sm flex items-center gap-2">
            <span className="text-lg">📢</span>
            Admissions are open for 2025–2026. Limited seats available — apply early!
          </p>
          <Link href="/admission" className="bg-amber-900 text-white text-xs font-bold px-5 py-2 rounded-2xl hover:bg-amber-950 transition-colors shrink-0">
            Apply Now →
          </Link>
        </div>
      </section>

      {/* ─── ABOUT PREVIEW ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Stat boxes */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-4xl p-8 text-white shadow-glow-green">
                  <p className="text-5xl font-extrabold">800+</p>
                  <p className="text-emerald-200 text-sm mt-2 font-medium">Happy Students</p>
                </div>
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-4xl p-8 text-white mt-8">
                  <p className="text-5xl font-extrabold">30+</p>
                  <p className="text-blue-200 text-sm mt-2 font-medium">Qualified Teachers</p>
                </div>
                <div className="bg-amber-400 rounded-4xl p-8 text-amber-900 -mt-4">
                  <p className="text-5xl font-extrabold">15+</p>
                  <p className="text-amber-800 text-sm mt-2 font-medium">Years of Service</p>
                </div>
                <div className="bg-slate-900 rounded-4xl p-8 text-white mt-4">
                  <p className="text-5xl font-extrabold">98%</p>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Pass Rate</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div>
              <SectionHeader
                label="About Us"
                title="A School Built on Values & Vision"
                subtitle="Ideal Vision Academy has been shaping generations in Badaghat with a commitment to academic excellence and character building."
                center={false}
              />
              <ul className="mt-6 space-y-3">
                {WHY_US.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-3 flex-wrap">
                <Link href="/about"   className="btn-primary">Learn More</Link>
                <Link href="/message" className="btn-outline">Principal's Message</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACADEMIC PROGRAMS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="container-school">
          <SectionHeader
            label="Academics"
            title="Our Academic Programs"
            subtitle="From kindergarten to SSC — a structured path for every stage of learning."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS.map(({ label, classes, color, dot, icon }) => (
              <div key={label} className={`clay-card rounded-3xl p-7 border-2 ${color}`}>
                <div className="text-4xl mb-4">{icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <h3 className="font-extrabold text-slate-900">{label}</h3>
                </div>
                <p className="text-sm text-slate-500 font-medium">{classes}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/academics" className="btn-outline">View Full Academics</Link>
          </div>
        </div>
      </section>

      {/* ─── NOTICE BOARD ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHeader
              label="Notice Board"
              title="Latest Notices"
              subtitle="Stay updated with school announcements."
              center={false}
            />
            <Link href="/notices" className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline shrink-0">
              All Notices <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingNotices ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-3xl h-60 animate-pulse" />)}
            </div>
          ) : notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices.map(n => <NoticeCard key={n._id} notice={n} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No notices published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── TEACHERS PREVIEW ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="container-school">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHeader
              label="Faculty"
              title="Meet Our Teachers"
              subtitle="Dedicated educators committed to student success."
              center={false}
            />
            <Link href="/teachers" className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline shrink-0">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {MOCK_TEACHERS.map(t => <TeacherCard key={t._id} teacher={t} />)}
          </div>
        </div>
      </section>

      {/* ─── FACILITIES ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-brand-700 via-brand-600 to-blue-700 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
        <div className="container-school relative">
          <SectionHeader label="Campus" title="Our Facilities" subtitle="Everything your child needs to learn, grow and thrive." light />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FACILITIES.map(({ emoji, label }) => (
              <div key={label} className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl p-5 text-center transition-all cursor-default">
                <span className="text-3xl block mb-3">{emoji}</span>
                <p className="text-sm font-semibold text-white leading-tight">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/facilities" className="btn-outline-white">See All Facilities</Link>
          </div>
        </div>
      </section>

      {/* ─── DOWNLOADS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <SectionHeader label="Downloads" title="Important Documents" subtitle="Get admission forms, class routines, exam schedules and more." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {['Admission Form', 'Class Routine', 'Exam Schedule'].map(name => (
              <Link key={name} href="/downloads"
                className="clay-card p-5 flex items-center gap-4 hover:border-brand-200">
                <div className="h-11 w-11 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Download className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/downloads" className="btn-outline">View All Downloads</Link>
          </div>
        </div>
      </section>

      {/* ─── CONTACT STRIP ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="container-school">
          <div className="clay-card rounded-4xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Have questions? Get in touch.
              </h2>
              <p className="text-slate-500 mt-2 text-sm">We're happy to help with admissions, queries or any information.</p>
              <div className="flex flex-wrap gap-4 mt-5">
                <a href="tel:01773763422" className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                  <Phone className="h-4 w-4" />01773-763422
                </a>
                <span className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="h-4 w-4" />Badaghat, Sunamganj
                </span>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/contact"   className="btn-primary">Contact Us</Link>
              <Link href="/admission" className="btn-outline">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
