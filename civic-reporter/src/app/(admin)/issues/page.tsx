import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { AdminIssuesList } from '@/components/AdminIssuesList'
import type { IssueWithProfile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminIssuesPage() {
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

  return <AdminIssuesList issues={issues} />
}
