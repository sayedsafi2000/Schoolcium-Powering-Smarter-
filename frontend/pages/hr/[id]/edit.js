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

export default function EditStaff() {
  const router = useRouter()
  const { id } = router.query
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [tab, setTab] = useState('personal')
  const [form, setForm] = useState({
    staffId: '', status: 'Active',
    personalInfo: { firstName: '', lastName: '', gender: 'Male', phone: '', email: '', address: '' },
    professionalInfo: { designation: '', department: '', qualification: '', experience: '' },
    salary: { amount: '', bankName: '', accountNumber: '' },
  })

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const s = res.data
        setForm({
          staffId: s.staffId || '', status: s.status || 'Active',
          personalInfo: { firstName: s.personalInfo?.firstName || '', lastName: s.personalInfo?.lastName || '', gender: s.personalInfo?.gender || 'Male', phone: s.personalInfo?.phone || '', email: s.personalInfo?.email || '', address: s.personalInfo?.address || '' },
          professionalInfo: { designation: s.professionalInfo?.designation || '', department: s.professionalInfo?.department || '', qualification: s.professionalInfo?.qualification || '', experience: s.professionalInfo?.experience || '' },
          salary: { amount: s.salary?.amount || '', bankName: s.salary?.bankName || '', accountNumber: s.salary?.accountNumber || '' },
        })
      })
      .catch(() => toast.error('Failed to load staff record'))
      .finally(() => setFetching(false))
  }, [id])

  const set = (section, key, val) => setForm(f => ({ ...f, [section]: { ...f[section], [key]: val } }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/hr/${id}`, form, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Staff record updated')
      router.push('/hr')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  if (fetching) return <div className="space-y-4 max-w-2xl mx-auto"><Skeleton className="h-10 w-48" /><Skeleton className="h-80 w-full rounded-lg" /></div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Edit Staff</h1><p className="text-muted-foreground text-sm">{form.personalInfo.firstName} {form.personalInfo.lastName}</p></div>
        <Button variant="outline" onClick={() => router.push('/hr')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
      <GlassCard>
        <GlassCardHeader>
          <div className="flex gap-2 border-b">
            {[['personal','Personal'],['professional','Professional'],['salary','Salary']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab===k?'text-primary border-b-2 border-primary':'text-muted-foreground hover:text-foreground'}`}>{l}</button>
            ))}
          </div>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4 pt-6">
          {tab === 'personal' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>First Name *</Label><Input value={form.personalInfo.firstName} onChange={e=>set('personalInfo','firstName',e.target.value)} /></div>
              <div className="space-y-1"><Label>Last Name</Label><Input value={form.personalInfo.lastName} onChange={e=>set('personalInfo','lastName',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Phone</Label><Input value={form.personalInfo.phone} onChange={e=>set('personalInfo','phone',e.target.value)} /></div>
              <div className="space-y-1"><Label>Status</Label>
                <select className={sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {['Active','Inactive','On Leave','Resigned'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.personalInfo.email} onChange={e=>set('personalInfo','email',e.target.value)} /></div>
            <div className="space-y-1"><Label>Address</Label><textarea className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.personalInfo.address} onChange={e=>set('personalInfo','address',e.target.value)} /></div>
          </>}
          {tab === 'professional' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Designation *</Label><Input value={form.professionalInfo.designation} onChange={e=>set('professionalInfo','designation',e.target.value)} /></div>
              <div className="space-y-1"><Label>Department</Label><Input value={form.professionalInfo.department} onChange={e=>set('professionalInfo','department',e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Qualification</Label><Input value={form.professionalInfo.qualification} onChange={e=>set('professionalInfo','qualification',e.target.value)} /></div>
              <div className="space-y-1"><Label>Experience (years)</Label><Input type="number" value={form.professionalInfo.experience} onChange={e=>set('professionalInfo','experience',e.target.value)} /></div>
            </div>
          </>}
          {tab === 'salary' && <>
            <div className="space-y-1"><Label>Monthly Salary</Label><Input type="number" value={form.salary.amount} onChange={e=>set('salary','amount',e.target.value)} /></div>
            <div className="space-y-1"><Label>Bank Name</Label><Input value={form.salary.bankName} onChange={e=>set('salary','bankName',e.target.value)} /></div>
            <div className="space-y-1"><Label>Account Number</Label><Input value={form.salary.accountNumber} onChange={e=>set('salary','accountNumber',e.target.value)} /></div>
          </>}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.push('/hr')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
