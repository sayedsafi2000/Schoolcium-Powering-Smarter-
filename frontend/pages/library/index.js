import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Library({ user }) {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [issues, setIssues] = useState([])
  const [activeTab, setActiveTab] = useState('books')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/student/books')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_URL

      const [booksRes, issuesRes] = await Promise.all([
        axios.get(`${base}/library/books`, { headers }),
        axios.get(`${base}/library/issues?status=Issued`, { headers }),
      ])
      setBooks(booksRes.data)
      setIssues(issuesRes.data)
    } catch {
      toast.error('Failed to load library data')
    } finally {
      setLoading(false)
    }
  }

  const bookColumns = useMemo(() => [
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span> },
    { accessorKey: 'author', header: 'Author' },
    { accessorKey: 'isbn', header: 'ISBN', cell: ({ row }) => row.getValue('isbn') || '—' },
    { accessorKey: 'totalCopies', header: 'Total' },
    { accessorKey: 'availableCopies', header: 'Available' },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => row.getValue('category') || '—' },
  ], [])

  const issueColumns = useMemo(() => [
    { id: 'book', header: 'Book', cell: ({ row }) => row.original.bookId?.title || '—' },
    { id: 'student', header: 'Student', cell: ({ row }) => {
      const s = row.original.studentId?.personalInfo
      return s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() || '—' : '—'
    }},
    { id: 'issueDate', header: 'Issued', cell: ({ row }) => new Date(row.original.issueDate).toLocaleDateString() },
    { id: 'dueDate', header: 'Due', cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString() },
    { id: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge> },
    { id: 'fine', header: 'Fine', cell: ({ row }) => formatCurrency(row.original.fineAmount || 0) },
  ], [])

  const stats = useMemo(() => ({
    totalBooks: books.length,
    available: books.reduce((sum, b) => sum + (b.availableCopies || 0), 0),
    issued: issues.length,
  }), [books, issues])

  if (loading && books.length === 0 && issues.length === 0) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-48 ml-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={activeTab === 'books' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('books')}>Books</Button>
          <Button variant={activeTab === 'issues' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('issues')}>Issued</Button>
        </div>
        {user?.role === 'admin' && (
          <>
            <Link href="/library/issue"><Button variant="outline"><BookOpen className="h-4 w-4 mr-2" />Issue book</Button></Link>
            <Link href="/library/new"><Button><Plus className="h-4 w-4 mr-2" />Add book</Button></Link>
          </>
        )}
      </PageActions>

      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={BookOpen} title="Total titles" value={stats.totalBooks} variant="info" />
          <StatCard icon={BookOpen} title="Available copies" value={stats.available} variant="success" />
          <StatCard icon={BookOpen} title="Currently issued" value={stats.issued} variant="warning" />
        </div>
      )}

      <GlassCard className="p-5">
        {loading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <DataTable
            columns={activeTab === 'books' ? bookColumns : issueColumns}
            data={activeTab === 'books' ? books : issues}
            searchKey={activeTab === 'books' ? 'title' : undefined}
          />
        )}
      </GlassCard>
    </div>
  )
}
