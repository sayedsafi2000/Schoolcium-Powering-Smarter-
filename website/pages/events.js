import Head from 'next/head'
import { Calendar, Tag } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const MOCK_EVENTS = [
  { id: 1, title: 'Annual Sports Day 2025', date: '2025-02-15', category: 'Sports', image: null, desc: 'An exciting day of inter-house sports competition, athletics, and team events for all students.' },
  { id: 2, title: 'Annual Prize-Giving Ceremony', date: '2025-03-10', category: 'Academic', image: null, desc: 'Celebrating student achievements, merit awards and recognitions for the academic year.' },
  { id: 3, title: 'Independence Day Celebration', date: '2025-03-26', category: 'National', image: null, desc: 'Patriotic programs, recitations and cultural performances to mark Bangladesh Independence Day.' },
  { id: 4, title: 'Science Fair', date: '2025-04-05', category: 'Academic', image: null, desc: 'Students showcase their science projects and experiments in this annual academic event.' },
  { id: 5, title: 'Cultural Program & Eid Celebration', date: '2025-04-01', category: 'Cultural', image: null, desc: 'Music, dance, poetry and cultural performances celebrating Eid and Bangladeshi culture.' },
  { id: 6, title: 'Parent-Teacher Meeting', date: '2025-04-20', category: 'Academic', image: null, desc: 'A dedicated session for parents to meet teachers and discuss student progress and performance.' },
]

const CATEGORY_COLORS = {
  Sports:   'bg-teal-100 text-teal-700',
  Academic: 'bg-blue-100 text-blue-700',
  National: 'bg-red-100 text-red-700',
  Cultural: 'bg-pink-100 text-pink-700',
  General:  'bg-gray-100 text-gray-700',
}

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>Events & News — Ideal Vision Academy</title>
        <meta name="description" content="Latest events, news and updates from Ideal Vision Academy, Badaghat, Sunamganj." />
      </Head>

      <PageHero
        title="Events & News"
        subtitle="What's happening at Ideal Vision Academy."
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader
            label="Latest"
            title="Upcoming Events & News"
            subtitle="Stay informed about school events, programs and activities."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EVENTS.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden card-hover"
              >
                {/* Image placeholder */}
                <div className="h-44 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-primary-200" />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`badge-category ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General}`}>
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{event.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">
            Events will be updated dynamically from the admin panel soon.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  )
}
