import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function NewRoom() {
  const router = useRouter()
  const [hostels, setHostels] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    hostelId: '',
    roomNumber: '',
    floor: 1,
    totalBeds: 2,
    status: 'Available',
  })

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hostel/hostels`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHostels(res.data)
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, hostelId: res.data[0]._id }))
      }
    } catch (error) {
      toast.error('Failed to load hostels')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hostel/rooms`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Room added successfully')
      router.push('/hostel')
    } catch (error) {
      toast.error('Failed to add room', {
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
          <h1 className="text-3xl font-bold">Add Hostel Room</h1>
          <p className="text-muted-foreground">Create a new room in a hostel</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Room Details
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hostelId">Hostel *</Label>
                <select id="hostelId" className={selectClassName} value={formData.hostelId} onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })} required>
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel._id} value={hostel._id}>{hostel.hostelName} ({hostel.type})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number *</Label>
                <Input id="roomNumber" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBeds">Total Beds *</Label>
                <Input id="totalBeds" type="number" value={formData.totalBeds} onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 1 })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" className={selectClassName} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Add Room'}
              </Button>
            </div>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
