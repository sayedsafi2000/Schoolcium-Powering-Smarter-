import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const classSchema = z.object({
  className:    z.string().min(1, 'Class name is required'),
  section:      z.string().optional(),
  capacity:     z.string().optional(),
  room:         z.string().optional(),
  classTeacher: z.string().optional(),
})

export default function NewClass() {
  const router   = useRouter()
  const [isLoading,       setIsLoading]       = useState(false)
  const [teachers,        setTeachers]        = useState([])
  const [loadingTeachers, setLoadingTeachers] = useState(true)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: '', section: '', capacity: '', room: '', classTeacher: '',
    },
  })

  // Fetch teachers for the dropdown
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setTeachers(res.data || []))
      .catch(() => toast.error('Failed to load teachers'))
      .finally(() => setLoadingTeachers(false))
  }, [])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        className:   data.className,
        section:     data.section     || undefined,
        roomNumber:  data.room        || undefined,
        capacity:    data.capacity    ? Number(data.capacity) : undefined,
        classTeacher:data.classTeacher && data.classTeacher !== ''
                       ? data.classTeacher
                       : undefined,
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/academic/classes`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Class added successfully')
      router.push('/classes')
    } catch (error) {
      toast.error('Failed to add class', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper: get display name from teacher object
  const teacherName = (t) => {
    const first = t.personalInfo?.firstName || ''
    const last  = t.personalInfo?.lastName  || ''
    const name  = `${first} ${last}`.trim() || t.teacherId || 'Unknown'
    const desig = t.professionalInfo?.designation || ''
    return desig ? `${name} — ${desig}` : name
  }

  const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
    'ring-offset-background focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Class</h1>
          <p className="text-muted-foreground">Create a new class section</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Class Information</GlassCardTitle>
        </GlassCardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCardContent className="space-y-5 pt-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Class Name + Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name *</Label>
                  <Input id="className" placeholder="e.g., Class 10" {...register('className')} />
                  {errors.className && (
                    <p className="text-sm text-destructive">{errors.className.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" placeholder="e.g., A" {...register('section')} />
                </div>
              </div>

              {/* Capacity + Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="e.g., 40" {...register('capacity')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input id="room" placeholder="e.g., 101" {...register('room')} />
                </div>
              </div>

              {/* Class Teacher Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="classTeacher" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  Class Teacher
                </Label>

                {loadingTeachers ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <select
                    id="classTeacher"
                    className={selectClass}
                    {...register('classTeacher')}
                  >
                    <option value="">— Select a teacher (optional) —</option>
                    {teachers.length === 0 ? (
                      <option disabled>No teachers found. Add teachers first.</option>
                    ) : (
                      teachers
                        .filter(t => t.status === 'Active' || !t.status)
                        .map(t => (
                          <option key={t._id} value={t._id}>
                            {teacherName(t)}
                          </option>
                        ))
                    )}
                  </select>
                )}
                <p className="text-xs text-muted-foreground">
                  Teachers are fetched from the Teachers module.
                </p>
              </div>
            </motion.div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" />Save Class</>
                )}
              </Button>
            </div>
          </GlassCardContent>
        </form>
      </GlassCard>
    </div>
  )
}
