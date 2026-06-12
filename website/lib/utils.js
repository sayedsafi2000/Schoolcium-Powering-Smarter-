export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date, options = {}) {
  const d = new Date(date)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

export const CATEGORY_COLORS = {
  General:   { bg: 'bg-gray-100',   text: 'text-gray-700'  },
  Academic:  { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  Exam:      { bg: 'bg-red-100',    text: 'text-red-700'   },
  Admission: { bg: 'bg-green-100',  text: 'text-green-700' },
  Event:     { bg: 'bg-purple-100', text: 'text-purple-700'},
  Holiday:   { bg: 'bg-orange-100', text: 'text-orange-700'},
  Sports:    { bg: 'bg-teal-100',   text: 'text-teal-700'  },
  Cultural:  { bg: 'bg-pink-100',   text: 'text-pink-700'  },
  Other:     { bg: 'bg-gray-100',   text: 'text-gray-600'  },
}

export function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
}
