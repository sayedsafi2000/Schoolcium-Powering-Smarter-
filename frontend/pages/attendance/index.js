import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Excused']

export default function Attendance({ user }) {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [saving, setSaving] = useState(false)

  const canMark = user?.role === 'admin' || user?.role === 'teacher'

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    if (!canMark) {
      router.push('/')
      return
    }
    loadClasses()
  }, [user])

  useEffect(() => {
    if (!classId) {
      setStudents([])
      setRecords({})
      return
    }
    loadRoster()
  }, [date, classId])

  const loadClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClasses(res.data)
    } catch {
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const loadRoster = async () => {
    setLoadingRoster(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_URL

      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get(`${base}/students`, { headers }),
        axios.get(`${base}/attendance`, {
          headers,
          params: { date, classId, type: 'student' },
        }),
      ])

      const classStudents = studentsRes.data.filter(s => {
        const cls = s.academicInfo?.class
        const id = cls?._id || cls
        return id === classId
      })

      const existing = {}
      attendanceRes.data.forEach(record => {
        const sid = record.studentId?._id || record.studentId
        if (sid) {
          existing[sid] = {
            status: record.status,
            remarks: record.remarks || '',
            existingId: record._id,
          }
        }
      })

      const initial = {}
      classStudents.forEach(student => {
        initial[student._id] = {
          status: existing[student._id]?.status || 'Present',
          remarks: existing[student._id]?.remarks || '',
          existingId: existing[student._id]?.existingId,
        }
      })

      setStudents(classStudents)
      setRecords(initial)
    } catch {
      toast.error('Failed to load attendance roster')
    } finally {
      setLoadingRoster(false)
    }
  }

  const setStatus = useCallback((studentId, status) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }))
  }, [])

  const setRemarks = useCallback((studentId, remarks) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }))
  }, [])

  const markAll = useCallback((status) => {
    setRecords(prev => {
      const next = { ...prev }
      students.forEach(s => {
        next[s._id] = { ...next[s._id], status }
      })
      return next
    })
  }, [students])

  const summary = useMemo(() => {
    const counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 }
    Object.values(records).forEach(r => {
      if (counts[r.status] !== undefined) counts[r.status] += 1
    })
    return counts
  }, [records])

  const handleSave = async () => {
    if (!classId || students.length === 0) {
      toast.error('Select a class with students')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_URL

      const toCreate = []
      const toUpdate = []

      students.forEach(student => {
        const record = records[student._id]
        const payload = {
          studentId: student._id,
          class: classId,
          status: record?.status || 'Present',
          remarks: record?.remarks || undefined,
        }
        if (record?.existingId) {
          toUpdate.push({ id: record.existingId, payload })
        } else {
          toCreate.push(payload)
        }
      })

      await Promise.all([
        ...toUpdate.map(({ id, payload }) =>
          axios.put(`${base}/attendance/${id}`, payload, { headers })
        ),
        toCreate.length > 0
          ? axios.post(`${base}/attendance/bulk`, {
              date,
              type: 'student',
              records: toCreate,
            }, { headers })
          : Promise.resolve(),
      ])

      toast.success('Attendance saved')
      loadRoster()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendanceDate">Date</Label>
            <Input
              id="attendanceDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="attendanceClass">Class</Label>
            <select
              id="attendanceClass"
              className={selectClassName}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}{cls.section ? ` — ${cls.section}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saving || !classId || students.length === 0}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save attendance
                </>
              )}
            </Button>
          </div>
        </div>

        {classId && students.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Summary:</span>
            {Object.entries(summary).map(([status, count]) => (
              <span key={status} className="tabular-nums">
                {status}: <strong>{count}</strong>
              </span>
            ))}
            <div className="ml-auto flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(status => (
                <Button key={status} variant="outline" size="sm" onClick={() => markAll(status)}>
                  Mark all {status.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden">
        {!classId ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Select a class to mark attendance
          </div>
        ) : loadingRoster ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No students found in this class
          </div>
        ) : (
          <div className="divide-y divide-border">
            {students.map(student => {
              const first = student.personalInfo?.firstName || ''
              const last = student.personalInfo?.lastName || ''
              const name = `${first} ${last}`.trim() || 'Unknown'
              const record = records[student._id] || { status: 'Present', remarks: '' }

              return (
                <div
                  key={student._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {getInitials(name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{student.studentId}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatus(student._id, status)}
                        className={cn(
                          'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                          record.status === status
                            ? status === 'Present'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : status === 'Absent'
                                ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
                                : status === 'Late'
                                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                  : 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <Input
                    className="sm:max-w-[180px]"
                    placeholder="Remarks"
                    value={record.remarks}
                    onChange={(e) => setRemarks(student._id, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
