import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { PageHeader } from '@/components/custom/page-header'
import { ArrowLeft, Loader2 } from 'lucide-react'

export function FormPageLayout({ title, description, onBack, onSubmit, isLoading, submitLabel = 'Save', children }) {
  return (
    <div className="page-shell max-w-3xl">
      <PageHeader title={title} description={description}>
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Details</GlassCardTitle>
        </GlassCardHeader>
        <form onSubmit={onSubmit}>
          <GlassCardContent className="space-y-4 pt-0">
            {children}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </GlassCardContent>
        </form>
      </GlassCard>
    </div>
  )
}

export const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
