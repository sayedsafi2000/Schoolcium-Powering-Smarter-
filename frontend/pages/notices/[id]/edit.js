import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  ArrowLeft, Loader2, Bell, Image as ImageIcon,
  Paperclip, X, FileText, Eye, EyeOff, Pin, Trash2, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const CATEGORIES = ['General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Sports', 'Cultural', 'Other']

export default function EditNotice({ user }) {
  const router = useRouter()
  const { id } = router.query

  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [newImageFile, setNewImageFile] = useState(null)
  const [newImagePreview, setNewImagePreview] = useState(null)
  const [newAttachmentFile, setNewAttachmentFile] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    category: 'General',
    noticeDate: '',
    isPublished: false,
    isImportant: false,
  })

  useEffect(() => {
    if (user?.role !== 'admin') { router.push('/'); return }
    if (id) fetchNotice()
  }, [user, id])

  const fetchNotice = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const n = res.data
      setNotice(n)
      setFormData({
        title: n.title,
        slug: n.slug,
        shortDescription: n.shortDescription || '',
        content: n.content,
        category: n.category,
        noticeDate: n.noticeDate ? new Date(n.noticeDate).toISOString().split('T')[0] : '',
        isPublished: n.isPublished,
        isImportant: n.isImportant,
      })
    } catch {
      toast.error('Failed to load notice')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`,
        {
          ...formData,
          isPublished: formData.isPublished.toString(),
          isImportant: formData.isImportant.toString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Notice updated successfully')
      fetchNotice()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notice')
    } finally {
      setSaving(false)
    }
  }

  const handleUploadImage = async () => {
    if (!newImageFile) return
    setUploadingImage(true)
    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('image', newImageFile)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/image`,
        data,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      )
      toast.success('Image uploaded')
      setNewImageFile(null)
      setNewImagePreview(null)
      fetchNotice()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!confirm('Remove featured image?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Image removed')
      fetchNotice()
    } catch {
      toast.error('Failed to remove image')
    }
  }

  const handleUploadAttachment = async () => {
    if (!newAttachmentFile) return
    setUploadingFile(true)
    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('file', newAttachmentFile)
      data.append('name', newAttachmentFile.name)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/attachments`,
        data,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      )
      toast.success('Attachment uploaded')
      setNewAttachmentFile(null)
      fetchNotice()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload attachment')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleRemoveAttachment = async (attachmentId) => {
    if (!confirm('Remove this attachment?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/attachments/${attachmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Attachment removed')
      fetchNotice()
    } catch {
      toast.error('Failed to remove attachment')
    }
  }

  const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Notice not found.{' '}
        <button className="underline" onClick={() => router.push('/notices')}>Back to notices</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Notice</h1>
          <p className="text-muted-foreground text-sm mt-1 truncate max-w-sm">{notice.title}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/notices')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                maxLength={300}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/300</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className={selectClass}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Notice Date</Label>
                <Input
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
                className="flex min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
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
                <p className="font-medium text-sm">{formData.isPublished ? 'Published' : 'Draft'}</p>
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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/notices')}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Featured Image Section */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Featured Image
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {notice.featuredImage?.url && (
            <div className="relative inline-block">
              <img
                src={notice.featuredImage.url}
                alt="Featured"
                className="rounded-lg border border-border max-h-52 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow hover:opacity-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <Label>Upload New Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setNewImageFile(f)
                    setNewImagePreview(URL.createObjectURL(f))
                  }
                }}
              />
            </div>
            <Button
              type="button"
              onClick={handleUploadImage}
              disabled={!newImageFile || uploadingImage}
            >
              {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
          {newImagePreview && (
            <img src={newImagePreview} alt="New preview" className="rounded border border-border max-h-32 object-cover" />
          )}
          <p className="text-xs text-muted-foreground">Max 5MB. JPG, PNG, WebP.</p>
        </GlassCardContent>
      </GlassCard>

      {/* Attachments Section */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Attachments
            {notice.attachments?.length > 0 && (
              <Badge variant="secondary">{notice.attachments.length}</Badge>
            )}
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {/* Existing attachments */}
          {notice.attachments?.length > 0 ? (
            <div className="space-y-2">
              {notice.attachments.map((att) => (
                <div
                  key={att._id}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{att.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{att.type}</p>
                  </div>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att._id)}
                    className="text-destructive hover:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No attachments yet.</p>
          )}

          {/* Upload new attachment */}
          <div className="flex items-end gap-3 pt-2 border-t border-border">
            <div className="flex-1 space-y-1">
              <Label>Add Attachment</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
                onChange={(e) => setNewAttachmentFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              type="button"
              onClick={handleUploadAttachment}
              disabled={!newAttachmentFile || uploadingFile}
            >
              {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Max 20MB. PDF, Word, Excel, PowerPoint, ZIP supported.
          </p>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
