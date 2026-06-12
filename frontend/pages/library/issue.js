import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function IssueBook() {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [students, setStudents] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    bookId: '',
    studentId: '',
    dueDate: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [booksRes, studentsRes, issuesRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/issues?status=Issued`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      setBooks(booksRes.data.filter(book => (book.availableCopies || 0) > 0))
      setStudents(studentsRes.data)
      setIssues(issuesRes.data)

      const defaultDue = new Date()
      defaultDue.setDate(defaultDue.getDate() + 14)
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDue.toISOString().split('T')[0],
      }))
    } catch (error) {
      toast.error('Failed to load library data')
    } finally {
      setLoading(false)
    }
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/library/issue`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Book issued successfully')
      fetchData()
      setFormData(prev => ({ ...prev, bookId: '', studentId: '' }))
    } catch (error) {
      toast.error('Failed to issue book', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReturn = async (issueId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/library/return/${issueId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Book returned successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to return book')
    }
  }

  const selectClassName =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issue / Return Books</h1>
          <p className="text-muted-foreground">Manage book circulation</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Issue Book
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bookId">Book *</Label>
                <select
                  id="bookId"
                  className={selectClassName}
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  required
                >
                  <option value="">Select Book</option>
                  {books.map(book => (
                    <option key={book._id} value={book._id}>
                      {book.title} by {book.author} ({book.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student *</Label>
                <select
                  id="studentId"
                  className={selectClassName}
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.personalInfo?.firstName} {student.personalInfo?.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                 
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Issue Book
                </Button>
              </div>
            </form>
          )}
        </GlassCardContent>
      </GlassCard>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle>Currently Issued Books</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-3">
          {issues.length > 0 ? (
            issues.map(issue => {
              const isOverdue = new Date(issue.dueDate) < new Date()
              return (
                <div key={issue._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <div className="font-semibold">{issue.bookId?.title || 'Book'}</div>
                    <div className="text-sm text-muted-foreground">
                      {issue.studentId?.personalInfo?.firstName} {issue.studentId?.personalInfo?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                    <Button size="sm" onClick={() => handleReturn(issue._id)}>
                      Return
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground">No books currently issued</div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
