import Head from 'next/head'
import { useState, useEffect } from 'react'
import PageHero from '@/components/PageHero'
import TeacherCard from '@/components/TeacherCard'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'
import { getPublicTeachers } from '@/lib/api'

// Mock teachers used as fallback
const MOCK_TEACHERS = [
  { _id: 'm1', name: 'Md. Abdul Karim',     designation: 'Principal',       subject: 'Islamic Studies',    department: 'Administration' },
  { _id: 'm2', name: 'Mrs. Fatema Begum',   designation: 'Sr. Teacher',     subject: 'Bengali & English',  department: 'Languages' },
  { _id: 'm3', name: 'Md. Rafiqul Islam',   designation: 'Teacher',         subject: 'Mathematics',         department: 'Science & Math' },
  { _id: 'm4', name: 'Mrs. Nasrin Akter',   designation: 'Teacher',         subject: 'Science',             department: 'Science & Math' },
  { _id: 'm5', name: 'Md. Jahangir Hossain',designation: 'Teacher',         subject: 'Social Studies',      department: 'Social Science' },
  { _id: 'm6', name: 'Miss Rumpa Dey',      designation: 'Jr. Teacher',     subject: 'English',             department: 'Languages' },
  { _id: 'm7', name: 'Md. Shahin Mia',      designation: 'Teacher',         subject: 'ICT & Computer',      department: 'ICT' },
  { _id: 'm8', name: 'Mrs. Sabina Khanam',  designation: 'Teacher',         subject: 'Home Economics',      department: 'Arts' },
]

const DEPARTMENTS = ['All', 'Administration', 'Languages', 'Science & Math', 'Social Science', 'ICT', 'Arts']

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dept, setDept] = useState('All')

  useEffect(() => {
    getPublicTeachers()
      .then((data) => {
        setTeachers(data && data.length > 0 ? data : MOCK_TEACHERS)
      })
      .catch(() => setTeachers(MOCK_TEACHERS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = dept === 'All'
    ? teachers
    : teachers.filter((t) => (t.department || t.professionalInfo?.department) === dept)

  return (
    <>
      <Head>
        <title>Our Teachers — Ideal Vision Academy</title>
        <meta name="description" content="Meet the dedicated and qualified teaching staff of Ideal Vision Academy, Badaghat, Sunamganj." />
      </Head>

      <PageHero
        title="Our Teachers"
        subtitle="Dedicated educators shaping the future of every student."
        breadcrumbs={[{ label: 'Teachers' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader label="Faculty" title="Meet Our Teaching Staff" />

          {/* Department filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  dept === d
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No teachers found in this department.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((teacher) => (
                <TeacherCard key={teacher._id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Join Our Community"
        subtitle="Ideal Vision Academy welcomes students, parents and educators committed to excellence."
      />
    </>
  )
}
