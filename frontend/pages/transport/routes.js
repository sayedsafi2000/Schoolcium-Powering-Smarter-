import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { ArrowLeft, Plus, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function TransportRoutes() {
  const router = useRouter()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/routes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRoutes(res.data)
    } catch (error) {
      toast.error('Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transport Routes</h1>
          <p className="text-muted-foreground">Manage school transport routes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/transport')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Link href="/transport/routes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </Link>
        </div>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            All Routes
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {routes.length > 0 ? (
            routes.map(route => (
              <div key={route._id} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg">{route.routeName}</div>
                    <div className="text-sm text-muted-foreground">
                      {route.startLocation || 'Start'} → {route.endLocation || 'End'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Route No: {route.routeNumber || 'N/A'} • Distance: {route.distance || 0} km
                    </div>
                    {route.stops?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {route.stops.map((stop, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {stop.stopName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant={route.status === 'Active' ? 'default' : 'secondary'}>
                    {route.status || 'Active'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No routes found. Add your first route to get started.
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
