import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewAdmission() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    applicantName: '',
    dateOfBirth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    applyingClass: '',
    previousSchool: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admissions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Application submitted successfully')
      router.push('/admissions')
    } catch (error) {
      toast.error('Failed to submit application', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="New Admission Application"
      description="Submit a new student admission application"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Submit Application"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="applicantName">Applicant Name *</Label>
          <Input id="applicantName" value={formData.applicantName} onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select id="gender" className={selectClassName} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="applyingClass">Applying Class *</Label>
          <select id="applyingClass" className={selectClassName} value={formData.applyingClass} onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })} required>
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.className} {cls.section}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="previousSchool">Previous School</Label>
          <Input id="previousSchool" value={formData.previousSchool} onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian Name</Label>
          <Input id="guardianName" value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardianPhone">Guardian Phone</Label>
          <Input id="guardianPhone" value={formData.guardianPhone} onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}
