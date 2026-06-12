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

const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Other']),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z.string().optional(),
  }),
  guardianInfo: z.object({
    fatherName: z.string().optional(),
    fatherPhone: z.string().optional(),
    motherName: z.string().optional(),
    motherPhone: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  }),
  academicInfo: z.object({
    admissionDate: z.string(),
    admissionNumber: z.string().optional(),
    rollNumber: z.string().optional(),
    academicYear: z.string(),
  }),
  status: z.enum(['Active', 'Inactive', 'Graduated']),
})

export default function NewStudent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: '',
      personalInfo: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: ''
      },
      guardianInfo: {
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: '',
        guardianName: '',
        guardianPhone: ''
      },
      academicInfo: {
        admissionDate: new Date().toISOString().split('T')[0],
        admissionNumber: '',
        rollNumber: '',
        academicYear: '2024-2025'
      },
      status: 'Active'
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/students`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Student added successfully')
      router.push('/students')
    } catch (error) {
      toast.error('Failed to add student', {
        description: error.response?.data?.message || error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'guardian', label: 'Guardian Info' },
    { id: 'academic', label: 'Academic Info' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Student</h1>
          <p className="text-muted-foreground">Fill in the student information below</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <div className="flex gap-2 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </GlassCardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCardContent className="space-y-6 pt-6">
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input id="studentId" {...register('studentId')} />
                    {errors.studentId && (
                      <p className="text-sm text-destructive">{errors.studentId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...register('status')}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register('personalInfo.firstName')} />
                    {errors.personalInfo?.firstName && (
                      <p className="text-sm text-destructive">{errors.personalInfo.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register('personalInfo.lastName')} />
                    {errors.personalInfo?.lastName && (
                      <p className="text-sm text-destructive">{errors.personalInfo.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register('personalInfo.dateOfBirth')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...register('personalInfo.gender')}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" {...register('personalInfo.phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('personalInfo.email')} />
                    {errors.personalInfo?.email && (
                      <p className="text-sm text-destructive">{errors.personalInfo.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    id="address"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('personalInfo.address')}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'guardian' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" {...register('guardianInfo.fatherName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherPhone">Father's Phone</Label>
                    <Input id="fatherPhone" type="tel" {...register('guardianInfo.fatherPhone')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input id="motherName" {...register('guardianInfo.motherName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherPhone">Mother's Phone</Label>
                    <Input id="motherPhone" type="tel" {...register('guardianInfo.motherPhone')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian's Name</Label>
                    <Input id="guardianName" {...register('guardianInfo.guardianName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Guardian's Phone</Label>
                    <Input id="guardianPhone" type="tel" {...register('guardianInfo.guardianPhone')} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'academic' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admissionDate">Admission Date</Label>
                    <Input id="admissionDate" type="date" {...register('academicInfo.admissionDate')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admissionNumber">Admission Number</Label>
                    <Input id="admissionNumber" {...register('academicInfo.admissionNumber')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" {...register('academicInfo.rollNumber')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input id="academicYear" {...register('academicInfo.academicYear')} />
                  </div>
                </div>
              </motion.div>
            )}

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
                    Save Student
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
