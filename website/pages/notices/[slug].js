import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Calendar, ArrowLeft, Download, FileText, Pin, Bell } from 'lucide-react'
import { getPublicNoticeBySlug, getPublicNotices } from '@/lib/api'
import { formatDate, getCategoryStyle } from '@/lib/utils'
import NoticeCard from '@/components/NoticeCard'

export default function NoticeDetailPage() {
  const router = useRouter()
  const { slug } = router.query
  const [notice,   setNotice]   = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setNotFound(false)
    getPublicNoticeBySlug(slug)
      .then(data => {
        setNotice(data)
        return getPublicNotices({ category: data.category, limit: 3 })
      })
      .then(d => setRelated((d.notices||[]).filter(n=>n.slug!==slug).slice(0,3)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="container-school py-16 max-w-3xl">
      <div className="h-8 w-40 bg-slate-100 rounded-2xl animate-pulse mb-6" />
      <div className="bg-white rounded-4xl h-96 animate-pulse" />
    </div>
  )

  if (notFound || !notice) return (
    <div className="container-school py-24 text-center">
      <Bell className="h-16 w-16 text-slate-200 mx-auto mb-4" />
      <h1 className="text-2xl font-extrabold text-slate-700">Notice not found</h1>
      <p className="text-slate-400 mt-2 text-sm">This notice may have been removed or is unavailable.</p>
      <Link href="/notices" className="btn-primary mt-6 inline-flex">← Back to Notice Board</Link>
    </div>
  )

  const { bg, text } = getCategoryStyle(notice.category)

  return (
    <>
      <Head>
        <title>{notice.title} — Ideal Vision Academy</title>
        <meta name="description" content={notice.shortDescription || notice.title} />
      </Head>

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container-school max-w-3xl">
          <Link href="/notices"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Notice Board
          </Link>

          <article className="bg-white rounded-4xl shadow-clay overflow-hidden">
            {notice.featuredImage?.url && (
              <div className="h-64 overflow-hidden">
                <img src={notice.featuredImage.url} alt={notice.title} className="w-full h-full object-cover" />
              </div>
            )}
            {/* Top color bar if no image */}
            {!notice.featuredImage?.url && (
              <div className="h-2 bg-gradient-to-r from-brand-500 to-blue-500" />
            )}

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`badge ${bg} ${text}`}>{notice.category}</span>
                {notice.isImportant && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                    <Pin className="h-3.5 w-3.5" /> Important
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-auto">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(notice.noticeDate)}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                {notice.title}
              </h1>

              {notice.shortDescription && (
                <p className="text-base text-slate-600 leading-relaxed border-l-4 border-brand-400 pl-5 bg-brand-50/50 py-3 rounded-r-xl mb-8 italic">
                  {notice.shortDescription}
                </p>
              )}

              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {notice.content}
              </div>

              {notice.attachments?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-brand-600" />
                    Attachments ({notice.attachments.length})
                  </h3>
                  <div className="space-y-3">
                    {notice.attachments.map(att => (
                      <a key={att._id} href={att.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
                        <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                          <Download className="h-5 w-5 text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-brand-700 truncate">{att.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{att.type}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                          Download
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6">Related Notices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(n => <NoticeCard key={n._id} notice={n} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
