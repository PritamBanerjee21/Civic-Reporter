import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { IssueDetail } from '@/components/IssueDetail'
import type { IssueWithProfile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  noStore()
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: issue, error } = await supabase
    .from('issues')
    .select('*, profiles:reported_by(full_name, role)')
    .eq('id', id)
    .single()

  if (error || !issue) {
    notFound()
  }

  return <IssueDetail issue={issue as IssueWithProfile} />
}
