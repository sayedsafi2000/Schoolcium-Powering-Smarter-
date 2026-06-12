import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { UserPlus, Loader2, GraduationCap } from 'lucide-react'
import { registerSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function Register({ setUser }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const { confirmPassword, ...registerData } = data
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, registerData)
      localStorage.setItem('token', res.data.token)
      if (setUser) setUser(res.data.user)
      toast.success('Account created successfully')
      router.push('/')
    } catch (error) {
      toast.error('Registration failed', {
        description: error.response?.data?.message || 'Please try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register to access the school portal</p>
        </div>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Registration form</GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="johndoe" {...register('username')} />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@school.edu" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" {...register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" placeholder="Repeat password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('role')}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </GlassCardContent>

          <GlassCardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already registered?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </GlassCardFooter>
        </GlassCard>
      </div>
    </div>
  )
}
