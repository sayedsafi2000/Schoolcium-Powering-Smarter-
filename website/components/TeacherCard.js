import { User2 } from 'lucide-react'

export default function TeacherCard({ teacher }) {
  const name = teacher.personalInfo
    ? `${teacher.personalInfo.firstName} ${teacher.personalInfo.lastName}`
    : teacher.name || 'Teacher'
  const subject     = teacher.professionalInfo?.specialization || teacher.subject || ''
  const designation = teacher.professionalInfo?.designation    || teacher.designation || 'Teacher'
  const photo       = teacher.personalInfo?.photo || teacher.photo || null

  return (
    <div className="clay-card p-6 text-center group">
      <div className="relative mx-auto mb-4 h-20 w-20">
        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 to-blue-50 border-2 border-white shadow-md">
          {photo
            ? <img src={photo} alt={name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="h-full w-full flex items-center justify-center">
                <User2 className="h-10 w-10 text-slate-300" />
              </div>
          }
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-brand-500 border-2 border-white" />
      </div>
      <h3 className="font-bold text-slate-900 text-sm leading-tight">{name}</h3>
      <p className="text-xs text-brand-600 font-semibold mt-1">{designation}</p>
      {subject && <p className="text-xs text-slate-400 mt-0.5">{subject}</p>}
    </div>
  )
}
