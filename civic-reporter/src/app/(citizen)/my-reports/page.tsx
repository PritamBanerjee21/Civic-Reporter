import { createClient } from '@/lib/supabase/server'
import { IssueCard } from '@/components/IssueCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, FileText } from 'lucide-react'
import type { Issue } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function MyReportsPage() {
  noStore()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let issues: Issue[] = []

  if (user) {
    const { data } = await supabase
      .from('issues')
      .select('*')
      .eq('reported_by', user.id)
      .order('created_at', { ascending: false })

    issues = data || []
  }

  if (issues.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track the progress of issues you&apos;ve reported
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-medium mb-2">No reports yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven&apos;t submitted any reports yet. Start by reporting an issue in your community.
          </p>
          <Link href="/report">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Report an Issue
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            {issues.length} {issues.length === 1 ? 'report' : 'reports'} submitted
          </p>
        </div>
        <Link href="/report">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  )
}
