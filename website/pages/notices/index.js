import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Search, Bell } from 'lucide-react'
import PageHero from '@/components/PageHero'
import NoticeCard from '@/components/NoticeCard'
import SectionHeader from '@/components/SectionHeader'
import { getPublicNotices } from '@/lib/api'

const CATS = ['All','General','Academic','Exam','Admission','Event','Holiday','Sports','Cultural','Other']

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCat]    = useState('All')
  const [search, setSearch]   = useState('')
  const [input, setInput]     = useState('')
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const LIMIT = 9

  useEffect(() => { fetch_() }, [category, search, page])

  const fetch_ = () => {
    setLoading(true)
    getPublicNotices({ category, search, limit: LIMIT, page })
      .then(d => { setNotices(d.notices || []); setTotal(d.total || 0) })
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }

  const totalPages = Math.ceil(total / LIMIT)
  const important  = notices.filter(n => n.isImportant)
  const regular    = notices.filter(n => !n.isImportant)

  return (
    <>
      <Head>
        <title>Notice Board — Ideal Vision Academy</title>
        <meta name="description" content="Latest notices and announcements from Ideal Vision Academy, Badaghat." />
      </Head>

      <PageHero title="Notice Board" subtitle="Official notices, announcements and updates from school."
        breadcrumbs={[{ label: 'Notice Board' }]} />

      <section className="py-14 bg-slate-50 min-h-screen">
        <div className="container-school">
          {/* Search & Filters */}
          <div className="clay-card p-4 mb-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <form onSubmit={e => { e.preventDefault(); setSearch(input); setPage(1) }}
              className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search notices…"
                className="input-base pl-10"
                value={input} onChange={e => setInput(e.target.value)} />
            </form>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c} onClick={() => { setCat(c); setPage(1) }}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                    category === c
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_,i) => <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />)}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-24">
              <Bell className="h-14 w-14 mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No notices found.</p>
              {search && <button onClick={() => { setSearch(''); setInput('') }}
                className="mt-3 text-brand-600 text-sm font-semibold underline">Clear search</button>}
            </div>
          ) : (
            <>
              {important.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📌</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Pinned Notices</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {important.map(n => <NoticeCard key={n._id} notice={n} />)}
                  </div>
                  {regular.length > 0 && <hr className="my-8 border-slate-100" />}
                </div>
              )}
              {regular.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {regular.map(n => <NoticeCard key={n._id} notice={n} />)}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors">
                    ← Previous
                  </button>
                  {[...Array(totalPages)].map((_,i) => (
                    <button key={i} onClick={() => setPage(i+1)}
                      className={`h-10 w-10 rounded-2xl text-sm font-bold transition-all ${
                        page===i+1 ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-50'
                      }`}>
                      {i+1}
                    </button>
                  ))}
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
