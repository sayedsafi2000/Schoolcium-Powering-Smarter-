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

const teacherSchema = z.object({
  teacherId: z.string().min(1, 'Teacher ID is required'),
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Other']),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z.string().optional(),
  }),
  professionalInfo: z.object({
    employeeId: z.string().optional(),
    joiningDate: z.string(),
    qualification: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.coerce.number().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
  }),
  salary: z.object({
    amount: z.coerce.number().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
  }),
  status: z.enum(['Active', 'Inactive', 'On Leave', 'Resigned']),
})

export default function NewTeacher() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      teacherId: '',
      personalInfo: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
      },
      professionalInfo: {
        employeeId: '',
        joiningDate: new Date().toISOString().split('T')[0],
        qualification: '',
        specialization: '',
        experience: 0,
        department: '',
        designation: '',
      },
      salary: {
        amount: 0,
        accountNumber: '',
        bankName: '',
      },
      status: 'Active',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Teacher added successfully')
      router.push('/teachers')
    } catch (error) {
      toast.error('Failed to add teacher', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'professional', label: 'Professional Info' },
    { id: 'salary', label: 'Salary Info' },
  ]

  const selectClassName =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Teacher</h1>
          <p className="text-muted-foreground">Fill in the teacher information below</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
              >
                {tab.label}
              </Button>
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
                <GlassCardTitle className="mb-4">Personal Information</GlassCardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Teacher ID *</Label>
                    <Input id="teacherId" placeholder="TCH001" {...register('teacherId')} />
                    {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register('personalInfo.dateOfBirth')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select id="gender" className={selectClassName} {...register('personalInfo.gender')}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('personalInfo.email')} />
                    {errors.personalInfo?.email && (
                      <p className="text-sm text-destructive">{errors.personalInfo.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" {...register('personalInfo.phone')} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register('personalInfo.address')} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'professional' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <GlassCardTitle className="mb-4">Professional Information</GlassCardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" {...register('professionalInfo.employeeId')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input id="joiningDate" type="date" {...register('professionalInfo.joiningDate')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input id="qualification" {...register('professionalInfo.qualification')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" {...register('professionalInfo.specialization')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input id="experience" type="number" {...register('professionalInfo.experience')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" {...register('professionalInfo.department')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" {...register('professionalInfo.designation')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" className={selectClassName} {...register('status')}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'salary' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <GlassCardTitle className="mb-4">Salary Information</GlassCardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryAmount">Salary Amount</Label>
                    <Input id="salaryAmount" type="number" {...register('salary.amount')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" {...register('salary.accountNumber')} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...register('salary.bankName')} />
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
                    Create Teacher
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
