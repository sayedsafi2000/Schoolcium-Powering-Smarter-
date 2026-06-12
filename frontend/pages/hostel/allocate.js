import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function AllocateRoom() {
  const router = useRouter()
  const [rooms, setRooms] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    roomId: '',
    bedNumber: '1',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [roomsRes, studentsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hostel/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      setRooms(roomsRes.data.filter(room => (room.occupiedBeds || 0) < (room.totalBeds || 0)))
      setStudents(studentsRes.data.filter(student => !student.hostel?.roomId))
    } catch (error) {
      toast.error('Failed to load allocation data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/hostel/allocate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Room allocated successfully')
      router.push('/hostel')
    } catch (error) {
      toast.error('Failed to allocate room', {
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
          <h1 className="text-3xl font-bold">Allocate Room</h1>
          <p className="text-muted-foreground">Assign hostel room to a student</p>
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
            Room Allocation
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student *</Label>
                <select
                  id="studentId"
                  className={selectClassName}
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.personalInfo?.firstName} {student.personalInfo?.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Available Room *</Label>
                <select
                  id="roomId"
                  className={selectClassName}
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      Room {room.roomNumber} - Floor {room.floor || 'N/A'} ({room.occupiedBeds}/{room.totalBeds} beds)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedNumber">Bed Number *</Label>
                <Input
                  id="bedNumber"
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                 
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Allocating...
                    </>
                  ) : (
                    'Allocate Room'
                  )}
                </Button>
              </div>
            </form>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
