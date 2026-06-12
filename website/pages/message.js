import Head from 'next/head'
import Link from 'next/link'
import { User2, Quote } from 'lucide-react'
import PageHero from '@/components/PageHero'
import CTASection from '@/components/CTASection'

export default function MessagePage() {
  return (
    <>
      <Head>
        <title>Principal's Message — Ideal Vision Academy</title>
        <meta name="description" content="Read the message from the Principal of Ideal Vision Academy, Badaghat, Sunamganj." />
      </Head>

      <PageHero
        title="Principal's Message"
        subtitle="A word from our leadership on education, values, and the future."
        breadcrumbs={[{ label: "Principal's Message" }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Photo Card */}
            <div className="text-center">
              <div className="mx-auto h-44 w-44 rounded-2xl bg-gray-100 border-4 border-primary-100 overflow-hidden flex items-center justify-center">
                <User2 className="h-20 w-20 text-gray-300" />
              </div>
              <div className="mt-4">
                <p className="font-bold text-gray-900 text-lg">Md. [Principal Name]</p>
                <p className="text-primary-600 text-sm font-medium">Principal</p>
                <p className="text-gray-400 text-xs mt-1">Ideal Vision Academy</p>
              </div>
              <div className="mt-4 h-1 w-16 bg-primary-600 rounded mx-auto" />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-10 w-10 text-primary-100" />
                <div className="pl-8 space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                  <p>
                    Dear Students, Parents, and Visitors,
                  </p>
                  <p>
                    It is with immense pride and joy that I welcome you to <strong>Ideal Vision Academy</strong>. Since our establishment, our school has been a pillar of quality education in Badaghat, Sunamganj, striving every day to shape the minds and characters of our students.
                  </p>
                  <p>
                    At Ideal Vision Academy, we believe that education is not just about textbooks and examinations. It is about building the whole person — intellectually sharp, morally grounded, and socially responsible. Our teachers are not just educators; they are mentors, guides, and role models.
                  </p>
                  <p>
                    We are committed to maintaining the highest standards of academic excellence while fostering creativity, discipline, and compassion in every student. Our goal is to prepare each child not just for board exams, but for life itself.
                  </p>
                  <p>
                    I invite every parent to partner with us on this journey. Together — school, family, and community — we can build brighter futures for the children of Sunamganj.
                  </p>
                  <p className="font-semibold text-primary-700 pt-2">
                    Warm regards,<br />
                    Md. [Principal Name]<br />
                    <span className="text-gray-500 font-normal text-sm">Principal, Ideal Vision Academy</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Values */}
      <section className="py-12 bg-gray-50">
        <div className="container-school max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Guiding Principles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Knowledge', 'Discipline', 'Creativity', 'Moral Values'].map((value) => (
              <div key={value} className="bg-white rounded-xl py-5 px-3 shadow-sm border border-gray-100">
                <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="h-3 w-3 rounded-full bg-primary-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
