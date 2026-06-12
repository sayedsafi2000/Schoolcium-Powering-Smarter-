import Link from 'next/link'
import { Calendar, Download, Pin, ArrowRight, FileText } from 'lucide-react'
import { formatDate, getCategoryStyle } from '@/lib/utils'

export default function NoticeCard({ notice }) {
  const { bg, text } = getCategoryStyle(notice.category)

  return (
    <article className="clay-card overflow-hidden flex flex-col group">
      {/* Image */}
      {notice.featuredImage?.url ? (
        <div className="h-44 overflow-hidden bg-slate-100">
          <img src={notice.featuredImage.url} alt={notice.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-3 bg-gradient-to-r from-brand-500 to-blue-500 rounded-t-3xl" />
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className={`badge ${bg} ${text}`}>{notice.category}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(notice.noticeDate)}
          </span>
        </div>

        {/* Important */}
        {notice.isImportant && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-2 bg-amber-50 rounded-lg px-2.5 py-1.5 w-fit">
            <Pin className="h-3.5 w-3.5" />
            Important Notice
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {notice.title}
        </h3>

        {/* Desc */}
        {notice.shortDescription && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {notice.shortDescription}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-slate-50">
          <Link href={`/notices/${notice.slug}`}
            className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
            Read More <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {notice.attachments?.length > 0 && (
            <a href={notice.attachments[0].url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-600 transition-colors font-medium">
              <Download className="h-3.5 w-3.5" />
              PDF
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
