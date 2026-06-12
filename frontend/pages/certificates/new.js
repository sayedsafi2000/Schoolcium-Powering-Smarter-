import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewCertificate() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    certificateType: 'Transfer',
    studentId: '',
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStudents(res.data)
    } catch (error) {
      toast.error('Failed to load students')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/certificates`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Certificate request submitted')
      router.push('/certificates')
    } catch (error) {
      toast.error('Failed to submit request', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Apply for Certificate"
      description="Submit a certificate request for a student"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Submit Request"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="certificateType">Certificate Type *</Label>
          <select id="certificateType" className={selectClassName} value={formData.certificateType} onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })} required>
            <option value="Transfer">Transfer Certificate</option>
            <option value="Character">Character Certificate</option>
            <option value="Bonafide">Bonafide Certificate</option>
            <option value="Migration">Migration Certificate</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">Student *</Label>
          <select id="studentId" className={selectClassName} value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.personalInfo?.firstName} {student.personalInfo?.lastName} - {student.studentId}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FormPageLayout>
  )
}
