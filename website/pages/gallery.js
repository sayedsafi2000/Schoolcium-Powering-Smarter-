import Head from 'next/head'
import { useState } from 'react'
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'

const CATEGORIES = ['All', 'Campus', 'Classroom', 'Students', 'Events', 'Cultural Program', 'Sports Day']

// Mock gallery items — replace with backend data when gallery API is ready
const MOCK_GALLERY = [
  { id: 1, src: null, alt: 'School Campus', category: 'Campus', placeholder: '#1a6b3c' },
  { id: 2, src: null, alt: 'Science Classroom', category: 'Classroom', placeholder: '#1e3a8a' },
  { id: 3, src: null, alt: 'Students Assembly', category: 'Students', placeholder: '#d97706' },
  { id: 4, src: null, alt: 'Annual Sports Day', category: 'Sports Day', placeholder: '#dc2626' },
  { id: 5, src: null, alt: 'Cultural Program 2024', category: 'Cultural Program', placeholder: '#7c3aed' },
  { id: 6, src: null, alt: 'School Library', category: 'Campus', placeholder: '#059669' },
  { id: 7, src: null, alt: 'Classroom Study', category: 'Classroom', placeholder: '#2563eb' },
  { id: 8, src: null, alt: 'Prize Giving Ceremony', category: 'Events', placeholder: '#db2777' },
  { id: 9, src: null, alt: 'School Gate', category: 'Campus', placeholder: '#0891b2' },
]

export default function GalleryPage() {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = filter === 'All' ? MOCK_GALLERY : MOCK_GALLERY.filter((g) => g.category === filter)

  return (
    <>
      <Head>
        <title>Gallery — Ideal Vision Academy</title>
        <meta name="description" content="Photo gallery of Ideal Vision Academy — campus, students, events, cultural programs and sports." />
      </Head>

      <PageHero
        title="Gallery"
        subtitle="Moments from our campus, events, and student life."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <SectionHeader label="Photos" title="School Gallery" />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 hover:shadow-lg transition-all"
                style={{ background: item.placeholder + '20' }}
                onClick={() => setLightbox(item)}
                aria-label={item.alt}
              >
                {item.src ? (
                  <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-2"
                    style={{ background: item.placeholder + '15' }}
                  >
                    <ImageIcon className="h-8 w-8" style={{ color: item.placeholder + 'aa' }} />
                    <span className="text-xs font-medium text-gray-500 px-2 text-center">{item.alt}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="h-7 w-7 text-white drop-shadow-lg" />
                </div>
                {/* Category badge */}
                <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            More photos will be added as gallery images are uploaded through the admin panel.
          </p>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.src ? (
              <img src={lightbox.src} alt={lightbox.alt} className="w-full h-auto max-h-[80vh] object-contain" />
            ) : (
              <div
                className="flex items-center justify-center h-72 rounded-xl"
                style={{ background: lightbox.placeholder + '30' }}
              >
                <div className="text-center">
                  <ImageIcon className="h-14 w-14 mx-auto mb-3 opacity-30" />
                  <p className="text-gray-400 text-sm">{lightbox.alt}</p>
                </div>
              </div>
            )}
            <div className="bg-white py-3 px-4">
              <p className="font-semibold text-gray-800 text-sm">{lightbox.alt}</p>
              <p className="text-xs text-gray-400">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}

      <CTASection />
    </>
  )
}
