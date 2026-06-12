import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewHostel() {
  const router = useRouter()
  const [staff, setStaff] = useState([])
  const [saving, setSaving] = useState(false)
  const [facilityInput, setFacilityInput] = useState('')
  const [formData, setFormData] = useState({
    hostelName: '',
    type: 'Boys',
    address: '',
    totalRooms: 0,
    totalBeds: 0,
    warden: '',
    monthlyFee: 0,
    facilities: [],
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
      toast.error('Failed to load staff list')
    }
  }

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      })
      setFacilityInput('')
    }
  }

  const removeFacility = (index) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hostel/hostels`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Hostel created successfully')
      router.push('/hostel')
    } catch (error) {
      toast.error('Failed to create hostel', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Add New Hostel"
      description="Create a new hostel building"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Create Hostel"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hostelName">Hostel Name *</Label>
          <Input id="hostelName" value={formData.hostelName} onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <select id="type" className={selectClassName} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalRooms">Total Rooms *</Label>
          <Input id="totalRooms" type="number" value={formData.totalRooms} onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalBeds">Total Beds *</Label>
          <Input id="totalBeds" type="number" value={formData.totalBeds} onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 0 })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyFee">Monthly Fee</Label>
          <Input id="monthlyFee" type="number" value={formData.monthlyFee} onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warden">Warden</Label>
          <select id="warden" className={selectClassName} value={formData.warden} onChange={(e) => setFormData({ ...formData, warden: e.target.value })}>
            <option value="">Select Warden</option>
            {staff.map(s => (
              <option key={s._id} value={s._id}>
                {s.personalInfo?.firstName} {s.personalInfo?.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <textarea
            id="address"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Facilities</Label>
          <div className="flex gap-2">
            <Input
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
              placeholder="Add facility and press Enter"
            />
            <Button type="button" variant="outline" onClick={addFacility}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.facilities.map((facility, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
                {facility}
                <button type="button" onClick={() => removeFacility(index)} className="text-destructive hover:opacity-80">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </FormPageLayout>
  )
}
