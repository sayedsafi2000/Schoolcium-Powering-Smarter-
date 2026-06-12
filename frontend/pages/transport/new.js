import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function NewVehicle() {
  const router = useRouter()
  const [staff, setStaff] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Bus',
    capacity: 40,
    driver: '',
    conductor: '',
    status: 'Active',
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStaff(res.data)
    } catch (error) {
      toast.error('Failed to load staff')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transport/vehicles`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Vehicle added successfully')
      router.push('/transport')
    } catch (error) {
      toast.error('Failed to add vehicle', {
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
          <h1 className="text-3xl font-bold">Add Vehicle</h1>
          <p className="text-muted-foreground">Register a new transport vehicle</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Vehicle Details
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input id="vehicleNumber" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <select id="vehicleType" className={selectClassName} value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} required>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" className={selectClassName} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
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
              <div className="space-y-2">
                <Label htmlFor="conductor">Conductor</Label>
                <select id="conductor" className={selectClassName} value={formData.conductor} onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}>
                  <option value="">Select Conductor</option>
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
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Add Vehicle'}
              </Button>
            </div>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
