import Head from 'next/head'
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

// Fallback download items — replace with backend API data when available
const MOCK_DOWNLOADS = [
  { id: 1, name: 'Admission Form 2025', desc: 'Official admission form for the 2025–2026 academic year.', type: 'PDF', icon: FileText, color: 'bg-red-50 text-red-600', url: '#' },
  { id: 2, name: 'Class Routine (Primary)', desc: 'Weekly class schedule for Class 1–5.', type: 'PDF', icon: FileText, color: 'bg-blue-50 text-blue-600', url: '#' },
  { id: 3, name: 'Class Routine (Secondary)', desc: 'Weekly class schedule for Class 6–10.', type: 'PDF', icon: FileText, color: 'bg-blue-50 text-blue-600', url: '#' },
  { id: 4, name: 'Exam Schedule – Annual', desc: 'Annual examination timetable for all classes.', type: 'PDF', icon: FileText, color: 'bg-purple-50 text-purple-600', url: '#' },
  { id: 5, name: 'Syllabus 2025 (Primary)', desc: 'Complete syllabus for Class 1–5, 2025 academic year.', type: 'PDF', icon: FileText, color: 'bg-green-50 text-green-600', url: '#' },
  { id: 6, name: 'Syllabus 2025 (Secondary)', desc: 'Complete syllabus for Class 6–10, 2025 academic year.', type: 'PDF', icon: FileText, color: 'bg-green-50 text-green-600', url: '#' },
  { id: 7, name: 'School Prospectus 2025', desc: 'Full school prospectus with information, fees and policies.', type: 'PDF', icon: File, color: 'bg-amber-50 text-amber-600', url: '#' },
  { id: 8, name: 'Result Sheet Template', desc: 'Template form for recording student examination results.', type: 'XLSX', icon: FileSpreadsheet, color: 'bg-teal-50 text-teal-600', url: '#' },
]

export default function DownloadsPage() {
  return (
    <>
      <Head>
        <title>Downloads — Ideal Vision Academy</title>
        <meta name="description" content="Download admission forms, class routines, exam schedules, syllabi and other documents from Ideal Vision Academy." />
      </Head>

      <PageHero
        title="Downloads"
        subtitle="Admission forms, routines, syllabi and other important documents."
        breadcrumbs={[{ label: 'Downloads' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader
            label="Documents"
            title="Download Centre"
            subtitle="Access all important school documents in one place."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_DOWNLOADS.map(({ id, name, desc, type, icon: Icon, color, url }) => (
              <div
                key={id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex gap-4 card-hover"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-snug">{name}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{type}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      onClick={url === '#' ? (e) => { e.preventDefault(); alert('Document will be available soon.') } : undefined}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-primary-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600 text-sm">
              Documents marked "#" will be available soon. Contact the school office for immediate assistance.
            </p>
            <a href="tel:01773763422" className="btn-primary mt-4 inline-flex">
              Call School Office
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
