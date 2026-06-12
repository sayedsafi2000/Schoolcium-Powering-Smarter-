import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

const classSchema = z.object({
  className: z.string().min(1, 'Class name is required'),
  section: z.string().optional(),
  capacity: z.string().optional(),
  room: z.string().optional(),
  classTeacher: z.string().optional(),
})

export default function NewClass() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: '',
      section: '',
      capacity: '',
      room: '',
      classTeacher: '',
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        ...data,
        roomNumber: data.room,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Class added successfully')
      router.push('/classes')
    } catch (error) {
      toast.error('Failed to add class', {
        description: error.response?.data?.message || error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Class</h1>
          <p className="text-muted-foreground">Create a new class section</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle>Class Information</GlassCardTitle>
        </GlassCardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCardContent className="space-y-6 pt-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
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
            </motion.div>

            <div className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
               
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Class
                  </>
                )}
              </Button>
            </div>
          </GlassCardContent>
        </form>
      </GlassCard>
    </div>
  )
}
