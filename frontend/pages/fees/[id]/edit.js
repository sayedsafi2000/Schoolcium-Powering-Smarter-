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

export default function EditFee() {
  const router = useRouter()
  const { id } = router.query
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    feeType: 'Tuition', amount: '', paidAmount: '', dueDate: '', paidDate: '',
    status: 'Pending', paymentMethod: '', transactionId: '', receiptNumber: '',
    remarks: '', academicYear: '',
  })

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const f = res.data
        setForm({
          feeType: f.feeType || 'Tuition', amount: f.amount || '',
          paidAmount: f.paidAmount || '', dueDate: f.dueDate ? f.dueDate.split('T')[0] : '',
          paidDate: f.paidDate ? f.paidDate.split('T')[0] : '',
          status: f.status || 'Pending', paymentMethod: f.paymentMethod || '',
          transactionId: f.transactionId || '', receiptNumber: f.receiptNumber || '',
          remarks: f.remarks || '', academicYear: f.academicYear || '',
        })
      })
      .catch(() => toast.error('Failed to load fee record'))
      .finally(() => setFetching(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/fees/${id}`, {
        ...form,
        amount: Number(form.amount),
        paidAmount: Number(form.paidAmount) || 0,
        paymentMethod: form.paymentMethod || undefined,
        paidDate: form.paidDate || undefined,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Fee record updated')
      router.push('/fees')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  if (fetching) return <div className="space-y-4 max-w-2xl mx-auto"><Skeleton className="h-10 w-48" /><Skeleton className="h-80 w-full rounded-lg" /></div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Edit Fee Record</h1></div>
        <Button variant="outline" onClick={() => router.push('/fees')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
      <GlassCard>
        <GlassCardHeader><GlassCardTitle>Fee Details</GlassCardTitle></GlassCardHeader>
        <GlassCardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Fee Type</Label>
              <select className={sel} value={form.feeType} onChange={e=>setForm(f=>({...f,feeType:e.target.value}))}>
                {['Tuition','Exam','Other'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Status</Label>
              <select className={sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {['Pending','Partial','Paid','Overdue'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Total Amount</Label><Input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Paid Amount</Label><Input type="number" value={form.paidAmount} onChange={e=>setForm(f=>({...f,paidAmount:e.target.value}))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Paid Date</Label><Input type="date" value={form.paidDate} onChange={e=>setForm(f=>({...f,paidDate:e.target.value}))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Payment Method</Label>
              <select className={sel} value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))}>
                <option value="">— Select —</option>
                {['Cash','Bank Transfer','Online','Cheque'].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academicYear} onChange={e=>setForm(f=>({...f,academicYear:e.target.value}))} placeholder="2024-2025" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Transaction ID</Label><Input value={form.transactionId} onChange={e=>setForm(f=>({...f,transactionId:e.target.value}))} /></div>
            <div className="space-y-1"><Label>Receipt Number</Label><Input value={form.receiptNumber} onChange={e=>setForm(f=>({...f,receiptNumber:e.target.value}))} /></div>
          </div>
          <div className="space-y-1"><Label>Remarks</Label><textarea className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.remarks} onChange={e=>setForm(f=>({...f,remarks:e.target.value}))} /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.push('/fees')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
