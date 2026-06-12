import Head from 'next/head'
import Link from 'next/link'
import { BookOpen, ClipboardList, Award, GraduationCap } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const PROGRAMS = [
  {
    level: 'Pre-Primary',
    classes: 'Kindergarten I & II',
    icon: BookOpen,
    color: 'bg-pink-50 border-pink-200 text-pink-600',
    desc: 'A joyful, play-based learning environment that builds foundational literacy, numeracy, and social skills to prepare children for primary education.',
    subjects: ['Bengali', 'English', 'Mathematics', 'Drawing', 'Moral Education'],
  },
  {
    level: 'Primary Section',
    classes: 'Class 1 – 5',
    icon: BookOpen,
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    desc: 'NCTB-aligned primary curriculum focusing on core academic skills, language development, and character building through structured learning.',
    subjects: ['Bengali', 'English', 'Mathematics', 'Science', 'Bangladesh & Global Studies', 'Religion'],
  },
  {
    level: 'Junior Section',
    classes: 'Class 6 – 8',
    icon: ClipboardList,
    color: 'bg-green-50 border-green-200 text-green-600',
    desc: 'A transition phase that strengthens academics and introduces students to diverse subjects in preparation for secondary level.',
    subjects: ['Bengali', 'English', 'Mathematics', 'Science', 'ICT', 'History', 'Agriculture'],
  },
  {
    level: 'Secondary Section',
    classes: 'Class 9 – 10 (SSC)',
    icon: GraduationCap,
    color: 'bg-purple-50 border-purple-200 text-purple-600',
    desc: 'Rigorous SSC preparation with dedicated coaching in Science, Arts, and Commerce streams. Focused on board exam success.',
    subjects: ['Bengali', 'English', 'Physics', 'Chemistry', 'Biology', 'Higher Math', 'ICT', 'Religion'],
  },
]

const FEATURES = [
  { icon: Award,         title: 'Exam System',        desc: 'Regular class tests, mid-term, and annual exams following national examination patterns.' },
  { icon: ClipboardList, title: 'Class Routine',       desc: 'Structured daily timetable ensuring balanced coverage of all subjects.' },
  { icon: BookOpen,      title: 'NCTB Curriculum',     desc: 'Fully aligned with the National Curriculum and Textbook Board guidelines.' },
  { icon: GraduationCap, title: 'SSC Coaching',        desc: 'Dedicated preparation and coaching for SSC board examinations.' },
]

export default function AcademicsPage() {
  return (
    <>
      <Head>
        <title>Academics — Ideal Vision Academy</title>
        <meta name="description" content="Explore the academic programs at Ideal Vision Academy — Pre-Primary, Primary, Junior, and Secondary (SSC) sections." />
      </Head>

      <PageHero
        title="Academics"
        subtitle="Structured, nationally aligned programs from Pre-Primary to SSC."
        breadcrumbs={[{ label: 'Academics' }]}
      />

      {/* Programs */}
      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader
            label="Programs"
            title="Our Academic Programs"
            subtitle="We offer four levels of education designed to build strong foundations and prepare students for future success."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PROGRAMS.map(({ level, classes, icon: Icon, color, desc, subjects }) => (
              <div key={level} className={`rounded-2xl border-2 p-7 ${color.split(' ').slice(0, 2).join(' ')} hover:shadow-md transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{level}</h3>
                      <span className="text-xs bg-white/80 border rounded-full px-3 py-1 text-gray-600 font-medium">{classes}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <span key={s} className="text-xs bg-white rounded-full px-2.5 py-1 border border-gray-200 text-gray-600">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-school">
          <SectionHeader
            label="Curriculum"
            title="Our Academic Approach"
            subtitle="A well-rounded system that balances examinations, learning and personal development."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all card-hover text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Start Your Academic Journey?"
        subtitle="Apply now and join hundreds of students achieving their potential at Ideal Vision Academy."
        primaryLabel="Apply for Admission"
        primaryHref="/admission"
      />
    </>
  )
}
