import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowRight, CheckCircle, ChevronRight, Phone, MapPin,
  Download, Bell, BookOpen, Users, GraduationCap, Award
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import NoticeCard from '@/components/NoticeCard'
import TeacherCard from '@/components/TeacherCard'
import CTASection from '@/components/CTASection'
import { getPublicNotices } from '@/lib/api'

// ── Working image URLs (no external dependency) ───────────────────────────────
const IMG = {
  hero:       'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1200',
  classroom:  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600',
  students:   'https://images.pexels.com/photos/8471939/pexels-photo-8471939.jpeg?auto=compress&cs=tinysrgb&w=600',
  reading:    'https://images.pexels.com/photos/159621/books-bookstore-book-reading-159621.jpeg?auto=compress&cs=tinysrgb&w=600',
  school:     'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=800',
  teacher:    'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
  campus:     'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800',
}

const MOCK_TEACHERS = [
  { _id: '1', name: 'Md. Abdul Karim',   designation: 'Principal',   subject: 'Islamic Studies'  },
  { _id: '2', name: 'Mrs. Fatema Begum', designation: 'Sr. Teacher', subject: 'Bengali & English' },
  { _id: '3', name: 'Md. Rafiqul Islam', designation: 'Teacher',     subject: 'Mathematics'       },
  { _id: '4', name: 'Mrs. Nasrin Akter', designation: 'Teacher',     subject: 'Science'           },
]

const PROGRAMS = [
  { label: 'Pre-Primary', classes: 'KG I & II',  bg: 'bg-rose-50  border-rose-100',  dot: 'bg-rose-400',  icon: '🌱' },
  { label: 'Primary',     classes: 'Class 1–5',  bg: 'bg-sky-50   border-sky-100',   dot: 'bg-sky-500',   icon: '📚' },
  { label: 'Junior',      classes: 'Class 6–8',  bg: 'bg-violet-50 border-violet-100',dot: 'bg-violet-500',icon: '✏️' },
  { label: 'Secondary',   classes: 'Class 9–10', bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500', icon: '🎓' },
]

const FACILITIES = [
  { emoji: '🏫', label: 'Modern Classrooms' },
  { emoji: '📖', label: 'School Library'    },
  { emoji: '💻', label: 'Computer Lab'      },
  { emoji: '⚽', label: 'Sports Ground'     },
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
  const [notices, setNotices]        = useState([])
  const [loadingNotices, setLoading] = useState(true)

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
        <meta name="description" content="Ideal Vision Academy, Badaghat — a premier school in Sunamganj, Bangladesh." />
      </Head>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 min-h-[90vh] flex items-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="Students in school"
            className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-800/70 to-transparent" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 h-48 w-48 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />

        <div className="container-school relative py-24 md:py-32 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left content ── */}
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/20 backdrop-blur-sm text-teal-200
                              text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8
                              border border-brand-400/30">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                Admissions Open · 2025–2026
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]
                             tracking-tight mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Building Bright Futures Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400">
                  Quality Education
                </span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-10">
                Ideal Vision Academy is committed to nurturing knowledge, discipline, creativity and moral values for students in Sunamganj, Bangladesh.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/admission" className="btn-white">
                  Apply for Admission <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn-outline-white">
                  About Our School
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 grid grid-cols-4 gap-4">
                {[
                  { val: '800+', lbl: 'Students' },
                  { val: '30+',  lbl: 'Teachers'  },
                  { val: '15+',  lbl: 'Years'     },
                  { val: '98%',  lbl: 'Pass Rate' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="bg-white/10 backdrop-blur-sm border border-white/10
                                            rounded-2xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-white">{val}</p>
                    <p className="text-xs text-teal-300 font-semibold mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Image collage ── */}
            <div className="hidden lg:flex flex-col gap-3">
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden h-64 shadow-2xl ring-2 ring-white/10">
                <img src={IMG.classroom} alt="Students learning in classroom"
                  className="w-full h-full object-cover" />
              </div>
              {/* Two side images */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden h-40 shadow-xl ring-1 ring-white/10">
                  <img src={IMG.students} alt="Happy students"
                    className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-40 shadow-xl ring-1 ring-white/10">
                  <img src={IMG.reading} alt="Books and education"
                    className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Badge strip */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl
                              p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Ideal Vision Academy</p>
                    <p className="text-teal-300 text-xs">Badaghat, Sunamganj</p>
                  </div>
                </div>
                <div className="bg-teal-500/20 border border-teal-400/30 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-white font-extrabold text-lg leading-none">A+</p>
                  <p className="text-teal-300 text-xs">Rated School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Admission ticker ── */}
      <section className="bg-amber-500 py-3.5">
        <div className="container-school flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-amber-900 font-bold text-sm flex items-center gap-2">
            <span className="text-base">📢</span>
            Admissions are open for 2025–2026. Limited seats — apply early!
          </p>
          <Link href="/admission"
            className="bg-amber-900 text-white text-xs font-bold px-5 py-2 rounded-2xl
                       hover:bg-amber-950 transition-colors shrink-0 whitespace-nowrap">
            Apply Now →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Image side */}
            <div className="space-y-3">
              <div className="rounded-3xl overflow-hidden h-72 shadow-xl">
                <img src={IMG.school} alt="School campus"
                  className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 text-white shadow-glow-teal">
                  <p className="text-4xl font-extrabold">800+</p>
                  <p className="text-teal-200 text-sm mt-1 font-medium">Students</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white">
                  <p className="text-4xl font-extrabold">30+</p>
                  <p className="text-slate-300 text-sm mt-1 font-medium">Teachers</p>
                </div>
                <div className="bg-amber-400 rounded-3xl p-6 text-amber-900">
                  <p className="text-4xl font-extrabold">15+</p>
                  <p className="text-amber-800 text-sm mt-1 font-medium">Years</p>
                </div>
                <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 text-white">
                  <p className="text-4xl font-extrabold">98%</p>
                  <p className="text-teal-100 text-sm mt-1 font-medium">Pass Rate</p>
                </div>
              </div>
            </div>

            {/* Text side */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          ACADEMIC PROGRAMS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container-school">
          <SectionHeader
            label="Academics"
            title="Our Academic Programs"
            subtitle="From kindergarten to SSC — a structured path for every stage of learning."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS.map(({ label, classes, bg, dot, icon }) => (
              <div key={label} className={`clay-card border-2 ${bg} p-7`}>
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

      {/* ══════════════════════════════════════════════════════════════════════
          CAMPUS PHOTOS STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader label="Campus Life" title="Life at Ideal Vision Academy" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { src: IMG.classroom, alt: 'Classroom learning'  },
              { src: IMG.students,  alt: 'Students together'   },
              { src: IMG.teacher,   alt: 'Teacher with class'  },
              { src: IMG.campus,    alt: 'School campus'       },
            ].map(({ src, alt }) => (
              <div key={alt} className="rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all group">
                <img src={src} alt={alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          NOTICE BOARD
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container-school">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHeader
              label="Notice Board"
              title="Latest Notices"
              subtitle="Stay updated with school announcements."
              center={false}
            />
            <Link href="/notices"
              className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline shrink-0">
              All Notices <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingNotices ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl h-60 animate-pulse" />)}
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

      {/* ══════════════════════════════════════════════════════════════════════
          TEACHERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHeader
              label="Faculty"
              title="Meet Our Teachers"
              subtitle="Dedicated educators committed to student success."
              center={false}
            />
            <Link href="/teachers"
              className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline shrink-0">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {MOCK_TEACHERS.map(t => <TeacherCard key={t._id} teacher={t} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FACILITIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-school relative">
          <SectionHeader label="Campus" title="Our Facilities"
            subtitle="Everything your child needs to learn, grow and thrive." light />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FACILITIES.map(({ emoji, label }) => (
              <div key={label}
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl
                           p-5 text-center transition-all cursor-default backdrop-blur-sm">
                <span className="text-3xl block mb-3">{emoji}</span>
                <p className="text-sm font-semibold text-white leading-tight">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/facilities" className="btn-outline-white">See All Facilities</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DOWNLOADS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <SectionHeader label="Downloads" title="Important Documents"
            subtitle="Admission forms, routines, exam schedules and more." />
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

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="container-school">
          <div className="clay-card rounded-4xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Have questions? Get in touch.
              </h2>
              <p className="text-slate-500 mt-2 text-sm">We're happy to help with admissions, queries or any information.</p>
              <div className="flex flex-wrap gap-5 mt-5">
                <a href="tel:01773763422"
                  className="flex items-center gap-2 text-brand-700 font-bold text-sm hover:text-brand-800">
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
