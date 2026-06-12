import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  ArrowLeft, Loader2, Bell, Image as ImageIcon,
  Paperclip, X, FileText, Eye, EyeOff, Pin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'

const CATEGORIES = ['General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Sports', 'Cultural', 'Other']

export default function NewNotice({ user }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [attachmentFile, setAttachmentFile] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    category: 'General',
    noticeDate: new Date().toISOString().split('T')[0],
    isPublished: false,
    isImportant: false,
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')

      // Step 1: Create the notice
      const noticeRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notices`,
        {
          ...formData,
          isPublished: formData.isPublished.toString(),
          isImportant: formData.isImportant.toString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const noticeId = noticeRes.data._id

      // Step 2: Upload featured image if selected
      if (imageFile) {
        const imgData = new FormData()
        imgData.append('image', imageFile)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}/image`,
          imgData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      }

      // Step 3: Upload attachment if selected
      if (attachmentFile) {
        const attData = new FormData()
        attData.append('file', attachmentFile)
        attData.append('name', attachmentFile.name)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}/attachments`,
          attData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      }

      toast.success('Notice created successfully')
      router.push('/notices')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create notice')
    } finally {
      setSaving(false)
    }
  }

  const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Notice</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new school notice or announcement</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notice Details
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter notice title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
              <Input
                id="slug"
                placeholder="notice-slug-url"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                placeholder="Brief summary (max 300 chars)"
                maxLength={300}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/300</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className={selectClass}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticeDate">Notice Date</Label>
                <Input
                  id="noticeDate"
                  type="date"
                  value={formData.noticeDate}
                  onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content *</Label>
              <textarea
                id="content"
                className="flex min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="Write the full notice content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Publish Settings */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Publish Settings</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
              className={`flex items-center gap-3 flex-1 rounded-lg border-2 p-4 text-left transition-colors ${
                formData.isPublished
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  : 'border-border bg-background'
              }`}
            >
              {formData.isPublished
                ? <Eye className="h-5 w-5 text-green-600" />
                : <EyeOff className="h-5 w-5 text-muted-foreground" />}
              <div>
                <p className="font-medium text-sm">
                  {formData.isPublished ? 'Published' : 'Draft'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.isPublished ? 'Visible on public website' : 'Only visible to admins'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isImportant: !formData.isImportant })}
              className={`flex items-center gap-3 flex-1 rounded-lg border-2 p-4 text-left transition-colors ${
                formData.isImportant
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                  : 'border-border bg-background'
              }`}
            >
              <Pin className={`h-5 w-5 ${formData.isImportant ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium text-sm">
                  {formData.isImportant ? 'Pinned / Important' : 'Normal Priority'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.isImportant ? 'Highlighted at the top' : 'Regular notice listing'}
                </p>
              </div>
            </button>
          </GlassCardContent>
        </GlassCard>

        {/* Featured Image */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Featured Image
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg border border-border max-h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Max 5MB. JPG, PNG, WebP supported.</p>
          </GlassCardContent>
        </GlassCard>

        {/* Attachment */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              File Attachment (PDF / Document)
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
              onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
            />
            {attachmentFile && (
              <div className="flex items-center gap-2 rounded-md border border-border p-3">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{attachmentFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentFile(null)}
                  className="text-destructive hover:opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Max 20MB. PDF, Word, Excel, PowerPoint, ZIP supported.</p>
            <p className="text-xs text-muted-foreground">You can add more attachments after creating the notice from the edit page.</p>
          </GlassCardContent>
        </GlassCard>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
            ) : (
              'Create Notice'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
