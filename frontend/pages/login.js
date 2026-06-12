import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { LogIn, Loader2, GraduationCap } from 'lucide-react'
import { loginSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function Login({ setUser }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      toast.success('Welcome back!')
      router.push('/')
    } catch (error) {
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Please check your credentials'
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
          <h1 className="text-xl font-semibold">Sign in to Schoolcium</h1>
          <p className="mt-1 text-sm text-muted-foreground">School management for admins, teachers, and staff</p>
        </div>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Account login</GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@school.edu"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </GlassCardContent>

          <GlassCardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              No account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </GlassCardFooter>
        </GlassCard>
      </div>
    </div>
  )
}
