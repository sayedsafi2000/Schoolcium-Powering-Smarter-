import Head from 'next/head'
import { Building, BookOpen, Monitor, Trees, Music, Shield, Users, Sun } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const FACILITIES = [
  {
    icon: Building,
    title: 'Modern Classrooms',
    desc: 'Spacious, well-ventilated classrooms designed for comfortable learning with proper lighting and seating arrangements.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BookOpen,
    title: 'School Library',
    desc: 'A well-stocked library with a wide range of textbooks, reference books, fiction, and educational materials for all levels.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Monitor,
    title: 'Computer / ICT Lab',
    desc: 'A dedicated computer lab with internet access for students to develop digital literacy and ICT skills.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Trees,
    title: 'Playground & Sports',
    desc: 'Open outdoor spaces and sports facilities for physical education, team sports and recreational activities.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Music,
    title: 'Cultural Activities',
    desc: 'Regular cultural programs, performances, debates and competitions that nurture creativity and confidence.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    desc: 'A secure, clean and disciplined school environment where every student feels safe and respected.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Users,
    title: 'Parent Communication',
    desc: 'Regular parent-teacher meetings, progress reports and open communication channels with school management.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Sun,
    title: 'Moral Education',
    desc: 'Integrated moral, religious and civic education programs that build character and social responsibility.',
    color: 'bg-orange-50 text-orange-600',
  },
]

export default function FacilitiesPage() {
  return (
    <>
      <Head>
        <title>Facilities — Ideal Vision Academy</title>
        <meta name="description" content="Explore the facilities at Ideal Vision Academy — modern classrooms, library, ICT lab, sports, and a safe learning environment." />
      </Head>

      <PageHero
        title="Our Facilities"
        subtitle="Everything your child needs to learn, grow and thrive."
        breadcrumbs={[{ label: 'Facilities' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader
            label="Campus"
            title="What We Offer"
            subtitle="Our campus is designed to provide a complete, well-rounded educational experience."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all card-hover">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary-700">
        <div className="container-school text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            A Complete Learning Environment
          </h2>
          <p className="text-green-100 max-w-2xl mx-auto text-sm leading-relaxed">
            At Ideal Vision Academy, we believe every child deserves the best tools and space to learn. Our facilities support academic, physical, creative and moral development under one roof.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  )
}
