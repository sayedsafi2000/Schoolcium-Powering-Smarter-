import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  ArrowLeft, Upload, FileText, Download, CheckCircle2,
  XCircle, AlertCircle, Loader2, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// ── CSV template columns ─────────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
  'student_id', 'first_name', 'last_name', 'date_of_birth', 'gender',
  'phone', 'email', 'address', 'blood_group',
  'father_name', 'father_phone', 'mother_name', 'mother_phone',
  'guardian_name', 'guardian_phone',
  'admission_date', 'admission_number', 'roll_number', 'section', 'academic_year',
  'status',
]

const SAMPLE_ROW = [
  'STU-001', 'Rahim', 'Uddin', '2010-05-15', 'Male',
  '01712345678', 'rahim@example.com', 'Badaghat, Sunamganj', 'B+',
  'Karim Uddin', '01812345678', 'Fatema Begum', '01912345678',
  '', '',
  '2024-01-01', 'ADM-2024-001', '01', 'A', '2024-2025',
  'Active',
]

function downloadTemplate() {
  const csv = [TEMPLATE_HEADERS.join(','), SAMPLE_ROW.join(',')].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'students_import_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ImportStudents({ user }) {
  const router = useRouter()
  const fileRef = useRef(null)

  const [file,       setFile]       = useState(null)
  const [importing,  setImporting]  = useState(false)
  const [result,     setResult]     = useState(null)
  const [dragOver,   setDragOver]   = useState(false)

  // Guard
  if (user && user.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.csv')) {
      toast.error('Only .csv files are accepted')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const handleImport = async () => {
    if (!file) { toast.error('Please select a CSV file first'); return }
    setImporting(true)
    setResult(null)
    try {
      const token = localStorage.getItem('token')
      const form  = new FormData()
      form.append('file', file)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/students/import-csv`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      )
      setResult(res.data)
      if (res.data.imported > 0) {
        toast.success(`${res.data.imported} students imported successfully`)
      } else {
        toast.warning('No students were imported. Check errors below.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Import Students via CSV</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bulk import old or existing student records from a CSV file.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/students')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Download template */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Step 1 — Download the CSV Template
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Download the template below. Fill in your student data following the exact column names.
            <br />
            Required columns: <code className="bg-muted px-1 rounded text-xs">student_id</code>,{' '}
            <code className="bg-muted px-1 rounded text-xs">first_name</code>. All others are optional.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['student_id *', 'first_name *', 'last_name', 'gender', 'phone', 'father_name',
              'admission_number', 'roll_number', 'academic_year', 'status'].map(col => (
              <span key={col} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">
                {col}
              </span>
            ))}
            <span className="text-xs text-muted-foreground">+ more…</span>
          </div>
          <Button onClick={downloadTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download Template (CSV)
          </Button>
        </GlassCardContent>
      </GlassCard>

      {/* File upload */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-base">
            <Upload className="h-4 w-4" />
            Step 2 — Upload Your CSV File
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · CSV
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); setResult(null) }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-sm">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">CSV files only — max 5 MB</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-1.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">How it works:</p>
            <p>• If a <code className="bg-background px-1 rounded">student_id</code> already exists, that record will be <strong>updated</strong>.</p>
            <p>• If it's new, a new student will be <strong>created</strong>.</p>
            <p>• Rows with errors are skipped — other rows still import successfully.</p>
            <p>• Date format: <code className="bg-background px-1 rounded">YYYY-MM-DD</code> (e.g. 2010-05-15)</p>
          </div>

          {/* Import button */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="gap-2"
            >
              {importing
                ? <><Loader2 className="h-4 w-4 animate-spin" />Importing…</>
                : <><Upload className="h-4 w-4" />Import Students</>}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Results */}
      {result && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-base">
              {result.imported > 0
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                : <AlertCircle className="h-4 w-4 text-amber-500" />}
              Import Results
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{result.imported}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">Imported</p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{result.skipped}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Skipped</p>
              </div>
              <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{result.imported + result.skipped}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Total Rows</p>
              </div>
            </div>

            {/* Errors */}
            {result.errors?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Skipped Rows ({result.errors.length})
                </p>
                <div className="rounded-lg border border-border overflow-hidden max-h-52 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <div key={i}
                      className="flex items-start gap-3 px-4 py-2.5 border-b border-border last:border-0 text-sm">
                      <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                        Row {err.row}
                      </Badge>
                      <span className="text-muted-foreground">{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={() => router.push('/students')}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                View All Students
              </Button>
              <Button variant="outline" onClick={() => { setFile(null); setResult(null) }}>
                Import Another File
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      )}
    </div>
  )
}
