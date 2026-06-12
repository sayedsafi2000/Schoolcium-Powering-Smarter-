import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

export default function NewBanner() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'homepage',
    order: 0,
    link: '',
    isActive: true,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) {
      toast.error('Please select a banner image')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('image', imageFile)
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('position', formData.position)
      data.append('order', formData.order)
      data.append('link', formData.link)
      data.append('isActive', formData.isActive)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/banners`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Banner uploaded successfully')
      router.push('/banners')
    } catch (error) {
      toast.error('Failed to upload banner', {
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
          <h1 className="text-3xl font-bold">Upload Banner</h1>
          <p className="text-muted-foreground">Add a new website banner image</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Banner Details
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <select id="position" className={selectClassName} value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
                  <option value="homepage">Homepage</option>
                  <option value="about">About</option>
                  <option value="contact">Contact</option>
                  <option value="gallery">Gallery</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input id="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image *</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : 'Upload Banner'}
              </Button>
            </div>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
