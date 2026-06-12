import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

const examSchema = z.object({
  examName: z.string().min(1, 'Exam name is required'),
  examType: z.string().min(1, 'Exam type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  totalMarks: z.string().min(1, 'Total marks required'),
  passingMarks: z.string().optional(),
})

export default function NewExam() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(examSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exams`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Exam created successfully')
      router.push('/exams')
    } catch (error) {
      toast.error('Failed to create exam')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Exam</h1>
          <p className="text-muted-foreground">Schedule a new examination</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle>Exam Details</GlassCardTitle>
        </GlassCardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name *</Label>
                <Input id="examName" placeholder="Midterm Exam" {...register('examName')} />
                {errors.examName && <p className="text-sm text-destructive">{errors.examName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type *</Label>
                <select id="examType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('examType')}>
                  <option value="">Select Type</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Quiz">Quiz</option>
                </select>
                {errors.examType && <p className="text-sm text-destructive">{errors.examType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" {...register('startDate')} />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input id="totalMarks" type="number" placeholder="100" {...register('totalMarks')} />
                {errors.totalMarks && <p className="text-sm text-destructive">{errors.totalMarks.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input id="passingMarks" type="number" placeholder="40" {...register('passingMarks')} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><Save className="mr-2 h-4 w-4" />Create Exam</>}
              </Button>
            </div>
          </GlassCardContent>
        </form>
      </GlassCard>
    </div>
  )
}
