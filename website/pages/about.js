import Head from 'next/head'
import Link from 'next/link'
import { Eye, Target, Heart, CheckCircle } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const VALUES = [
  { icon: '👁️', title: 'Vision', color: 'bg-blue-50 border-blue-100',   desc: 'To be the leading centre of academic excellence in Sunamganj, producing responsible, knowledgeable and ethical citizens.' },
  { icon: '🎯', title: 'Mission', color: 'bg-green-50 border-green-100', desc: 'To provide quality education through a nurturing environment that develops the full potential of every student.' },
  { icon: '💎', title: 'Values', color: 'bg-purple-50 border-purple-100',desc: 'Integrity, discipline, compassion, excellence, and community service guide every decision we make.' },
]

const WHY = [
  'Experienced and caring faculty',
  'Strong focus on board exam results',
  'Balanced academics, arts & sports',
  'Affordable quality education',
  'Safe, clean, welcoming campus',
  'Regular parent-teacher communication',
  'Extra-curricular & cultural programs',
  'Nationally aligned NCTB curriculum',
]

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — Ideal Vision Academy</title>
        <meta name="description" content="Learn about Ideal Vision Academy's history, vision, mission and core values." />
      </Head>

      <PageHero title="About Us" subtitle="Our story, values, and commitment to your child's future."
        breadcrumbs={[{ label: 'About' }]} />

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="container-school max-w-4xl text-center">
          <SectionHeader label="Our School" title="Ideal Vision Academy" />
          <div className="space-y-4 text-slate-600 text-base leading-relaxed">
            <p>Ideal Vision Academy is a reputed educational institution located in Badaghat, Sunamganj, Bangladesh. Since our founding, we have been dedicated to providing quality education to students of all backgrounds.</p>
            <p>We follow the national curriculum set by NCTB and prepare students for SSC board examinations. We take pride in our qualified faculty, structured programs, and a supportive environment that encourages curiosity, creativity and discipline.</p>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-20 bg-slate-50">
        <div className="container-school">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, color, desc }) => (
              <div key={title} className={`clay-card border-2 ${color} p-8 text-center`}>
                <span className="text-5xl block mb-4">{icon}</span>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-school">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader label="Why Choose Us" title="Why Ideal Vision Academy?" center={false} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {WHY.map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/admission" className="btn-primary">Apply Now</Link>
                <Link href="/contact"   className="btn-outline">Contact Us</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-4xl p-8 text-white shadow-glow-green">
                <p className="text-5xl font-extrabold">15+</p>
                <p className="text-emerald-200 text-sm mt-2">Years of Excellence</p>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-4xl p-8 text-white mt-8">
                <p className="text-5xl font-extrabold">800+</p>
                <p className="text-blue-200 text-sm mt-2">Total Students</p>
              </div>
              <div className="bg-amber-400 rounded-4xl p-8 text-amber-900 -mt-4">
                <p className="text-5xl font-extrabold">30+</p>
                <p className="text-amber-800 text-sm mt-2">Qualified Staff</p>
              </div>
              <div className="bg-slate-900 rounded-4xl p-8 text-white mt-4">
                <p className="text-5xl font-extrabold">98%</p>
                <p className="text-slate-400 text-sm mt-2">Pass Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Be a Part of Ideal Vision Academy" subtitle="Join hundreds of students building their futures at our school." />
    </>
  )
}
