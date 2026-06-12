import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const sel = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

export default function EditExam() {
  const router = useRouter()
  const { id } = router.query
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    examName: '', examType: 'Quiz', startDate: '', endDate: '',
    totalMarks: '', passingMarks: '', duration: '', instructions: '', status: 'Scheduled',
  })

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const e = res.data
        setForm({
          examName: e.examName || '', examType: e.examType || 'Quiz',
          startDate: e.startDate ? e.startDate.split('T')[0] : '',
          endDate: e.endDate ? e.endDate.split('T')[0] : '',
          totalMarks: e.totalMarks || '', passingMarks: e.passingMarks || '',
          duration: e.duration || '', instructions: e.instructions || '',
          status: e.status || 'Scheduled',
        })
      })
      .catch(() => toast.error('Failed to load exam'))
      .finally(() => setFetching(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/exams/${id}`, {
        ...form,
        totalMarks: Number(form.totalMarks),
        passingMarks: form.passingMarks ? Number(form.passingMarks) : undefined,
        duration: form.duration ? Number(form.duration) : undefined,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Exam updated')
      router.push('/exams')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  if (fetching) return <div className="space-y-4 max-w-2xl mx-auto"><Skeleton className="h-10 w-48" /><Skeleton className="h-80 w-full rounded-lg" /></div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Edit Exam</h1><p className="text-muted-foreground text-sm">{form.examName}</p></div>
        <Button variant="outline" onClick={() => router.push('/exams')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
      <GlassCard>
        <GlassCardHeader><GlassCardTitle>Exam Details</GlassCardTitle></GlassCardHeader>
        <GlassCardContent className="space-y-4 pt-6">
          <div className="space-y-1"><Label>Exam Name *</Label><Input value={form.examName} onChange={e=>setForm(f=>({...f,examName:e.target.value}))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Exam Type</Label>
              <select className={sel} value={form.examType} onChange={e=>setForm(f=>({...f,examType:e.target.value}))}>
                {['Quiz','Midterm','Final','Assignment','Project'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Status</Label>
              <select className={sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {['Scheduled','Ongoing','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} /></div>
            <div className="space-y-1"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><Label>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={e=>setForm(f=>({...f,totalMarks:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Passing Marks</Label><Input type="number" value={form.passingMarks} onChange={e=>setForm(f=>({...f,passingMarks:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} /></div>
          </div>
          <div className="space-y-1"><Label>Instructions</Label><textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.push('/exams')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
