import Head from 'next/head'
import Link from 'next/link'
import { Phone, Mail, CheckCircle, FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const STEPS = [
  { step: '01', title: 'Visit School', desc: 'Come to our campus and collect the admission form from the office.' },
  { step: '02', title: 'Fill in Form', desc: 'Complete the admission form with accurate student and guardian information.' },
  { step: '03', title: 'Submit Documents', desc: 'Submit the required documents along with the completed form.' },
  { step: '04', title: 'Admission Test', desc: 'Some classes require a short admission test — our staff will guide you.' },
  { step: '05', title: 'Confirmation', desc: 'Upon approval, receive the confirmation letter and pay admission fees.' },
]

const DOCUMENTS = [
  'Recent passport-sized photographs (3 copies)',
  'Birth certificate (photocopy)',
  'Previous class mark sheet / result (if applicable)',
  'National ID / Birth Certificate of parents',
  'Transfer certificate (if transferring from another school)',
]

const CLASSES = [
  { name: 'Kindergarten I', seats: 30 },
  { name: 'Kindergarten II', seats: 30 },
  { name: 'Class 1', seats: 40 },
  { name: 'Class 2', seats: 40 },
  { name: 'Class 3', seats: 40 },
  { name: 'Class 4', seats: 40 },
  { name: 'Class 5', seats: 40 },
  { name: 'Class 6', seats: 50 },
  { name: 'Class 7', seats: 50 },
  { name: 'Class 8', seats: 50 },
  { name: 'Class 9', seats: 60 },
  { name: 'Class 10', seats: 60 },
]

const FAQS = [
  { q: 'When does admission open?', a: 'Admissions typically open in January for the new academic year starting in February. Check our notice board for exact dates.' },
  { q: 'Is there an admission test?', a: 'Class 1 and above may require a short oral or written test to assess readiness. KG admissions are generally open.' },
  { q: 'What are the school timings?', a: 'School runs from 8:00 AM to 2:30 PM, Saturday to Thursday. Friday is the weekly holiday.' },
  { q: 'Are there monthly tuition fees?', a: 'Yes, there are monthly tuition fees. Please contact the school office for the current fee structure.' },
  { q: 'Do you offer extra coaching?', a: 'Yes, we provide extra coaching for SSC students, especially in Mathematics, Science and English.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 text-sm">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
          {a}
        </div>
      )}
    </div>
  )
}

export default function AdmissionPage() {
  return (
    <>
      <Head>
        <title>Admission — Ideal Vision Academy</title>
        <meta name="description" content="Apply for admission to Ideal Vision Academy, Badaghat, Sunamganj. Learn the process, required documents and available classes." />
      </Head>

      <PageHero
        title="Admission"
        subtitle="Join Ideal Vision Academy — where every child's potential is nurtured."
        breadcrumbs={[{ label: 'Admission' }]}
      />

      {/* Admission Banner */}
      <section className="bg-amber-50 border-b border-amber-100 py-8">
        <div className="container-school text-center">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Now Open</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Admissions Open for Academic Year 2025–2026</h2>
          <p className="text-gray-600 mt-2">Seats are limited. Apply today to secure your child's place.</p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:01773763422" className="btn-primary flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call to Apply
            </a>
            <a href="mailto:idealvisionacademy@gmail.com" className="btn-outline flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader label="Process" title="How to Apply" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-extrabold mb-4 shadow-md">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents & Classes */}
      <section className="py-16 bg-gray-50">
        <div className="container-school grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Documents */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
            <ul className="space-y-3">
              {DOCUMENTS.map((doc) => (
                <li key={doc} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Class Availability */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Availability</h2>
            <div className="grid grid-cols-2 gap-3">
              {CLASSES.map(({ name, seats }) => (
                <div key={name} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                  <span className="text-xs text-primary-600 font-semibold">{seats} seats</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-school max-w-2xl">
          <SectionHeader label="FAQ" title="Frequently Asked Questions" />
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Admission */}
      <section className="py-12 bg-primary-50 border-t border-primary-100">
        <div className="container-school text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Have Questions About Admission?</h2>
          <p className="text-gray-600 text-sm mb-6">Contact us directly — we're happy to help.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:01773763422" className="btn-primary flex items-center gap-2">
              <Phone className="h-4 w-4" /> 01773-763422
            </a>
            <a href="mailto:idealvisionacademy@gmail.com" className="btn-outline flex items-center gap-2">
              <Mail className="h-4 w-4" /> Send Email
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
