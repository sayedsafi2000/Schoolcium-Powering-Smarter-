import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function NewRoute() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState([])
  const [staff, setStaff] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    routeName: '',
    routeNumber: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
    monthlyFee: 0,
    vehicle: '',
    driver: '',
    status: 'Active',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [vehiclesRes, staffRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      setVehicles(vehiclesRes.data)
      setStaff(staffRes.data)
    } catch (error) {
      toast.error('Failed to load form data')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transport/routes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Route created successfully')
      router.push('/transport/routes')
    } catch (error) {
      toast.error('Failed to create route', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const selectClassName =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Transport Route</h1>
          <p className="text-muted-foreground">Create a new school transport route</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Route Details
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name *</Label>
                <Input id="routeName" value={formData.routeName} onChange={(e) => setFormData({ ...formData, routeName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routeNumber">Route Number *</Label>
                <Input id="routeNumber" value={formData.routeNumber} onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startLocation">Start Location *</Label>
                <Input id="startLocation" value={formData.startLocation} onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endLocation">End Location *</Label>
                <Input id="endLocation" value={formData.endLocation} onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input id="distance" type="number" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Fee</Label>
                <Input id="monthlyFee" type="number" value={formData.monthlyFee} onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <select id="vehicle" className={selectClassName} value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}>
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.vehicleNumber} - {v.vehicleType}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <select id="driver" className={selectClassName} value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })}>
                  <option value="">Select Driver</option>
                  {staff.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.personalInfo?.firstName} {s.personalInfo?.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Route'}
              </Button>
            </div>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
