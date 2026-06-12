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

export default function EditStudent({ user }) {
  const router = useRouter()
  const { id } = router.query
  const [loading, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [tab, setTab] = useState('personal')
  const [form, setForm] = useState({
    studentId: '', status: 'Active',
    personalInfo: { firstName: '', lastName: '', dateOfBirth: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: '' },
    guardianInfo: { fatherName: '', fatherPhone: '', motherName: '', motherPhone: '', guardianName: '', guardianPhone: '' },
    academicInfo: { admissionDate: '', admissionNumber: '', rollNumber: '', section: '', academicYear: '' },
  })

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const s = res.data
        setForm({
          studentId: s.studentId || '',
          status: s.status || 'Active',
          personalInfo: {
            firstName:   s.personalInfo?.firstName   || '',
            lastName:    s.personalInfo?.lastName    || '',
            dateOfBirth: s.personalInfo?.dateOfBirth ? s.personalInfo.dateOfBirth.split('T')[0] : '',
            gender:      s.personalInfo?.gender      || 'Male',
            phone:       s.personalInfo?.phone       || '',
            email:       s.personalInfo?.email       || '',
            address:     s.personalInfo?.address     || '',
            bloodGroup:  s.personalInfo?.bloodGroup  || '',
          },
          guardianInfo: {
            fatherName:  s.guardianInfo?.fatherName  || '',
            fatherPhone: s.guardianInfo?.fatherPhone || '',
            motherName:  s.guardianInfo?.motherName  || '',
            motherPhone: s.guardianInfo?.motherPhone || '',
            guardianName: s.guardianInfo?.guardianName || '',
            guardianPhone:s.guardianInfo?.guardianPhone|| '',
          },
          academicInfo: {
            admissionDate:   s.academicInfo?.admissionDate ? s.academicInfo.admissionDate.split('T')[0] : '',
            admissionNumber: s.academicInfo?.admissionNumber || '',
            rollNumber:      s.academicInfo?.rollNumber      || '',
            section:         s.academicInfo?.section         || '',
            academicYear:    s.academicInfo?.academicYear    || '',
          },
        })
      })
      .catch(() => toast.error('Failed to load student'))
      .finally(() => setFetching(false))
  }, [id])

  const set = (section, key, val) => setForm(f => ({ ...f, [section]: { ...f[section], [key]: val } }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, form, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Student updated')
      router.push('/students')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  const tabs = ['personal', 'guardian', 'academic']

  if (fetching) return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Edit Student</h1><p className="text-muted-foreground text-sm">{form.personalInfo.firstName} {form.personalInfo.lastName}</p></div>
        <Button variant="outline" onClick={() => router.push('/students')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <div className="flex gap-2 border-b">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {t === 'personal' ? 'Personal Info' : t === 'guardian' ? 'Guardian Info' : 'Academic Info'}
              </button>
            ))}
          </div>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4 pt-6">
          {tab === 'personal' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Student ID</Label><Input value={form.studentId} onChange={e => setForm(f => ({...f, studentId: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Status</Label>
                <select className={sel} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                  {['Active','Inactive','Graduated','Transferred'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>First Name *</Label><Input value={form.personalInfo.firstName} onChange={e => set('personalInfo','firstName',e.target.value)} /></div>
              <div className="space-y-1"><Label>Last Name</Label><Input value={form.personalInfo.lastName} onChange={e => set('personalInfo','lastName',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" value={form.personalInfo.dateOfBirth} onChange={e => set('personalInfo','dateOfBirth',e.target.value)} /></div>
              <div className="space-y-1"><Label>Gender</Label>
                <select className={sel} value={form.personalInfo.gender} onChange={e => set('personalInfo','gender',e.target.value)}>
                  {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Phone</Label><Input value={form.personalInfo.phone} onChange={e => set('personalInfo','phone',e.target.value)} /></div>
              <div className="space-y-1"><Label>Blood Group</Label><Input value={form.personalInfo.bloodGroup} onChange={e => set('personalInfo','bloodGroup',e.target.value)} placeholder="A+, B-, O+" /></div>
            </div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.personalInfo.email} onChange={e => set('personalInfo','email',e.target.value)} /></div>
            <div className="space-y-1"><Label>Address</Label><textarea className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.personalInfo.address} onChange={e => set('personalInfo','address',e.target.value)} /></div>
          </>}

          {tab === 'guardian' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Father Name</Label><Input value={form.guardianInfo.fatherName} onChange={e => set('guardianInfo','fatherName',e.target.value)} /></div>
              <div className="space-y-1"><Label>Father Phone</Label><Input value={form.guardianInfo.fatherPhone} onChange={e => set('guardianInfo','fatherPhone',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Mother Name</Label><Input value={form.guardianInfo.motherName} onChange={e => set('guardianInfo','motherName',e.target.value)} /></div>
              <div className="space-y-1"><Label>Mother Phone</Label><Input value={form.guardianInfo.motherPhone} onChange={e => set('guardianInfo','motherPhone',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Guardian Name</Label><Input value={form.guardianInfo.guardianName} onChange={e => set('guardianInfo','guardianName',e.target.value)} /></div>
              <div className="space-y-1"><Label>Guardian Phone</Label><Input value={form.guardianInfo.guardianPhone} onChange={e => set('guardianInfo','guardianPhone',e.target.value)} /></div>
            </div>
          </>}

          {tab === 'academic' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Admission Date</Label><Input type="date" value={form.academicInfo.admissionDate} onChange={e => set('academicInfo','admissionDate',e.target.value)} /></div>
              <div className="space-y-1"><Label>Admission Number</Label><Input value={form.academicInfo.admissionNumber} onChange={e => set('academicInfo','admissionNumber',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Roll Number</Label><Input value={form.academicInfo.rollNumber} onChange={e => set('academicInfo','rollNumber',e.target.value)} /></div>
              <div className="space-y-1"><Label>Section</Label><Input value={form.academicInfo.section} onChange={e => set('academicInfo','section',e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academicInfo.academicYear} onChange={e => set('academicInfo','academicYear',e.target.value)} placeholder="2024-2025" /></div>
          </>}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.push('/students')}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
