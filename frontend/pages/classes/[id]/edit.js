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

export default function EditClass() {
  const router = useRouter()
  const { id } = router.query
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ className: '', section: '', capacity: '', roomNumber: '', classTeacher: '', academicYear: '' })

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([classesRes, teachersRes]) => {
      const cls = classesRes.data.find(c => c._id === id)
      if (cls) setForm({ className: cls.className || '', section: cls.section || '', capacity: cls.capacity || '', roomNumber: cls.roomNumber || '', classTeacher: cls.classTeacher?._id || '', academicYear: cls.academicYear || '' })
      setTeachers(teachersRes.data || [])
    })
    .catch(() => toast.error('Failed to load class'))
    .finally(() => setFetching(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const payload = { ...form, capacity: form.capacity ? Number(form.capacity) : undefined, classTeacher: form.classTeacher || undefined }
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Class updated')
      router.push('/classes')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  const teacherName = t => {
    const n = `${t.personalInfo?.firstName||''} ${t.personalInfo?.lastName||''}`.trim() || t.teacherId
    const d = t.professionalInfo?.designation || ''
    return d ? `${n} — ${d}` : n
  }

  if (fetching) return <div className="space-y-4 max-w-2xl mx-auto"><Skeleton className="h-10 w-48" /><Skeleton className="h-80 w-full rounded-lg" /></div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Edit Class</h1><p className="text-muted-foreground text-sm">{form.className} {form.section}</p></div>
        <Button variant="outline" onClick={() => router.push('/classes')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
      <GlassCard>
        <GlassCardHeader><GlassCardTitle>Class Information</GlassCardTitle></GlassCardHeader>
        <GlassCardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Class Name *</Label><Input value={form.className} onChange={e=>setForm(f=>({...f,className:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Section</Label><Input value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e=>setForm(f=>({...f,capacity:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Room Number</Label><Input value={form.roomNumber} onChange={e=>setForm(f=>({...f,roomNumber:e.target.value}))} /></div>
          </div>
          <div className="space-y-1"><Label>Class Teacher</Label>
            <select className={sel} value={form.classTeacher} onChange={e=>setForm(f=>({...f,classTeacher:e.target.value}))}>
              <option value="">— None —</option>
              {teachers.filter(t=>t.status==='Active'||!t.status).map(t=><option key={t._id} value={t._id}>{teacherName(t)}</option>)}
            </select>
          </div>
          <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academicYear} onChange={e=>setForm(f=>({...f,academicYear:e.target.value}))} placeholder="2024-2025" /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.push('/classes')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
