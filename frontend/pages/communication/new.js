import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewAnnouncement() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'General',
    targetAudience: ['All'],
    classes: [],
    expiryDate: '',
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClasses(res.data)
    } catch (error) {
      toast.error('Failed to load classes')
    }
  }

  const toggleAudience = (value) => {
    if (value === 'All') {
      setFormData({ ...formData, targetAudience: ['All'] })
      return
    }
    const current = formData.targetAudience.filter(a => a !== 'All')
    setFormData({
      ...formData,
      targetAudience: current.includes(value)
        ? current.filter(a => a !== value)
        : [...current, value],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Announcement created')
      router.push('/communication')
    } catch (error) {
      toast.error('Failed to create announcement', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Create Announcement"
      description="Publish a new school announcement"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Publish"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select id="type" className={selectClassName} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Event">Event</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="content">Content *</Label>
          <textarea
            id="content"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Target Audience</Label>
          <div className="flex flex-wrap gap-3">
            {['All', 'Students', 'Teachers', 'Parents', 'Staff'].map(audience => (
              <label key={audience} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.targetAudience.includes(audience)}
                  onChange={() => toggleAudience(audience)}
                />
                {audience}
              </label>
            ))}
          </div>
        </div>
      </div>
    </FormPageLayout>
  )
}
