import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Settings({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      schoolName: '',
      schoolCode: '',
      address: '',
      phone: '',
      email: '',
      academicYear: '',
      sessionStart: '',
      currency: '',
      timezone: '',
    },
  })

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchSettings()
  }, [user])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      reset(res.data)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/settings`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Settings saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-96 w-full max-w-2xl rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <GlassCard className="max-w-2xl">
        <GlassCardHeader>
          <GlassCardTitle>School settings</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School name</Label>
                <Input id="schoolName" {...register('schoolName', { required: 'Required' })} />
                {errors.schoolName && <p className="text-sm text-destructive">{errors.schoolName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolCode">School code</Label>
                <Input id="schoolCode" {...register('schoolCode')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic year</Label>
                <Input id="academicYear" {...register('academicYear')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionStart">Session start</Label>
                <Input id="sessionStart" type="date" {...register('sessionStart')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register('currency')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" {...register('timezone')} />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save settings
                </>
              )}
            </Button>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
