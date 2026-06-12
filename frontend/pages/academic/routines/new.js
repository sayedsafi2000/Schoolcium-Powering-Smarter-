import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewRoutine() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    teacher: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    academicYear: '2024-2025',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setClasses(classesRes.data)
      setSubjects(subjectsRes.data)
      setTeachers(teachersRes.data)
    } catch (error) {
      toast.error('Failed to load form data')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/routines`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Routine created successfully')
      router.push('/academic')
    } catch (error) {
      toast.error('Failed to create routine', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Create Class Routine"
      description="Add a new timetable entry"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Create Routine"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <select id="class" className={selectClassName} value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} required>
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.className} {cls.section}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <select id="subject" className={selectClassName} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required>
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="teacher">Teacher *</Label>
          <select id="teacher" className={selectClassName} value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} required>
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.personalInfo?.firstName} {teacher.personalInfo?.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="day">Day *</Label>
          <select id="day" className={selectClassName} value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <Input id="room" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}
