import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewSubject() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    description: '',
    creditHours: 0,
    department: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/subjects`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Subject created successfully')
      router.push('/academic')
    } catch (error) {
      toast.error('Failed to create subject', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Add New Subject"
      description="Create a new academic subject"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Create Subject"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subjectCode">Subject Code *</Label>
          <Input id="subjectCode" value={formData.subjectCode} onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subjectName">Subject Name *</Label>
          <Input id="subjectName" value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="creditHours">Credit Hours</Label>
          <Input id="creditHours" type="number" value={formData.creditHours} onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}
