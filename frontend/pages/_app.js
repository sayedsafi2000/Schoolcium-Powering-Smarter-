import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import AppLayout from '../components/layout/app-layout'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className={`${inter.className} flex items-center justify-center min-h-screen bg-background`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className={inter.className}>
        <AppLayout user={user} setUser={setUser}>
          <Component {...pageProps} user={user} setUser={setUser} />
        </AppLayout>
        <Toaster position="bottom-right" richColors closeButton />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
