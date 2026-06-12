import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Loader2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function CollectFee() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [pendingFees, setPendingFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    feeId: '',
    paidAmount: '',
    paymentMethod: 'Cash',
    transactionId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.studentId) {
      fetchStudentFees(formData.studentId)
    } else {
      setPendingFees([])
      setFormData(prev => ({ ...prev, feeId: '' }))
    }
  }, [formData.studentId])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStudents(res.data)
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentFees = async (studentId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const unpaid = res.data.filter(fee => fee.status !== 'Paid')
      setPendingFees(unpaid)
      if (unpaid.length > 0) {
        setFormData(prev => ({
          ...prev,
          feeId: unpaid[0]._id,
          paidAmount: String((unpaid[0].amount || 0) - (unpaid[0].paidAmount || 0)),
        }))
      }
    } catch (error) {
      toast.error('Failed to load student fees')
    }
  }

  const selectedFee = pendingFees.find(fee => fee._id === formData.feeId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.feeId || !formData.paidAmount) {
      toast.error('Please select a fee and enter amount')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/fees/${formData.feeId}/pay`,
        {
          paidAmount: parseFloat(formData.paidAmount),
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Fee collected successfully')
      router.push('/fees')
    } catch (error) {
      toast.error('Failed to collect fee', {
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
          <h1 className="text-3xl font-bold">Collect Fee</h1>
          <p className="text-muted-foreground">Record student fee payment</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <GlassCard >
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Details
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
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value, feeId: '' })}
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

              {pendingFees.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="feeId">Pending Fee *</Label>
                    <select
                      id="feeId"
                      className={selectClassName}
                      value={formData.feeId}
                      onChange={(e) => {
                        const fee = pendingFees.find(f => f._id === e.target.value)
                        setFormData({
                          ...formData,
                          feeId: e.target.value,
                          paidAmount: fee ? String((fee.amount || 0) - (fee.paidAmount || 0)) : '',
                        })
                      }}
                      required
                    >
                      {pendingFees.map(fee => (
                        <option key={fee._id} value={fee._id}>
                          {fee.feeType} - Due: {formatCurrency(fee.amount - (fee.paidAmount || 0))}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedFee && (
                    <div className="p-4 rounded-xl bg-muted/50 text-sm space-y-1">
                      <div>Total Amount: {formatCurrency(selectedFee.amount)}</div>
                      <div>Paid: {formatCurrency(selectedFee.paidAmount || 0)}</div>
                      <div>Due: {formatCurrency((selectedFee.amount || 0) - (selectedFee.paidAmount || 0))}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="paidAmount">Payment Amount *</Label>
                    <Input
                      id="paidAmount"
                      type="number"
                      step="0.01"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      className={selectClassName}
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Online">Online</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="Optional reference number"
                    />
                  </div>
                </>
              ) : formData.studentId ? (
                <div className="p-4 rounded-xl bg-muted/50 text-center text-muted-foreground">
                  No pending fees for this student
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.feeId}
                 
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Collect Fee'
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
