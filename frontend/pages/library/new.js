import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewBook() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: '',
    totalCopies: 1,
    price: 0,
    shelfNumber: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Book added successfully')
      router.push('/library')
    } catch (error) {
      toast.error('Failed to add book', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Add New Book"
      description="Add a book to the library catalog"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Add Book"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalCopies">Total Copies *</Label>
          <Input id="totalCopies" type="number" value={formData.totalCopies} onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shelfNumber">Shelf Number</Label>
          <Input id="shelfNumber" value={formData.shelfNumber} onChange={(e) => setFormData({ ...formData, shelfNumber: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}
