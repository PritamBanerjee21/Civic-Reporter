import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { ListTodo, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { IssueWithProfile } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  noStore()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: allIssues } = await supabase
    .from('issues')
    .select('*, profiles:reported_by(full_name, role)')
    .order('created_at', { ascending: false })

  const issues = (allIssues || []) as IssueWithProfile[]
  const total = issues.length
  const pending = issues.filter((i) => i.status === 'pending').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const resolved = issues.filter((i) => i.status === 'resolved').length

  const recentIssues = issues.slice(0, 5)

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of all reported issues</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pending}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inProgress}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Resolved</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-5 px-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Issues</h2>
            <Link href="/issues">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          {recentIssues.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No issues reported yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {issue.title}
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {issue.category.replace('_', ' ')}
                      </TableCell>
                      <TableCell><StatusBadge status={issue.status} /></TableCell>
                      <TableCell className="text-muted-foreground">
                        {issue.profiles?.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDate(issue.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/issues/${issue.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
