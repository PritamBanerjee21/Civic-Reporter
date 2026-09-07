import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import {
  Shield,
  AlertCircle,
  Users,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Landmark,
  Leaf,
  Building2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { IssueWithProfile } from '@/types'
import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  noStore()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const { data: allIssues } = await supabase.from('issues').select('status')
  const issues = allIssues || []
  const totalIssues = issues.length
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length
  const pendingCount = issues.filter((i) => i.status === 'pending').length
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length

  const { data: recentIssues } = await supabase
    .from('issues')
    .select('*, profiles:reported_by(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(3)

  const recent = (recentIssues || []) as IssueWithProfile[]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="relative container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-5">
              <Shield className="h-3 w-3" />
              Government of Jharkhand — SIH25031
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Crowdsourced Civic Issue{' '}
              <span className="text-primary">Reporting</span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Report issues, track progress, and help improve your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {!isAdmin ? (
                <Link href="/report">
                  <Button className="gap-2">
                    Report an Issue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button className="gap-2">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href={isAdmin ? '/issues' : '/my-reports'}>
                <Button variant="outline">
                  {isAdmin ? 'View All Issues' : 'My Reports'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Issues', value: totalIssues, color: 'text-foreground' },
              { label: 'Pending', value: pendingCount, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'In Progress', value: inProgressCount, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Resolved', value: resolvedCount, color: 'text-emerald-600 dark:text-emerald-400' },
            ].map(({ label, value, color }) => (
              <Card key={label} className="border-border/50">
                <CardContent className="pt-5 pb-4 px-4 text-center">
                  <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: AlertCircle, title: 'Report', desc: 'Submit a report with title, description, category, location, and photo.' },
              { icon: Users, title: 'Authorities Review', desc: 'Administrators review and address reports as work progresses.' },
              { icon: CheckCircle2, title: 'Resolved', desc: 'Track status from pending to in-progress to resolved.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Card key={title} className="border-border/50">
                <CardContent className="pt-6 pb-5 px-5 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[10px] font-semibold text-primary mb-1 tracking-widest uppercase">
                    Step {i + 1}
                  </div>
                  <h3 className="font-semibold mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Issue Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: AlertCircle, label: 'Pothole', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
              { icon: Users, label: 'Garbage', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
              { icon: MapPin, label: 'Streetlight', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
              { icon: AlertCircle, label: 'Water', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
              { icon: Shield, label: 'Other', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
            ].map(({ icon: Icon, label, color }) => (
              <Card key={label} className="border-border/50">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      {recent.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Recent Reports</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recent.map((issue) => (
                <Card key={issue.id} className="border-border/50">
                  <CardContent className="pt-5 pb-4 px-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{issue.title}</h3>
                      <StatusBadge status={issue.status} />
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {issue.category.replace('_', ' ')}
                    </Badge>
                    {issue.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {issue.profiles?.full_name || 'Anonymous'} &middot;{' '}
                      {new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">About This Platform</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Landmark, title: 'Government of Jharkhand', desc: 'SIH25031 — Crowdsourced civic issue reporting for municipal governance.' },
              { icon: Leaf, title: 'Clean & Green Technology', desc: 'Environmental and civic improvements — potholes, garbage, streetlights, water leaks.' },
              { icon: Building2, title: 'Community Driven', desc: 'Empowering citizens to participate in local governance and track resolution.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border/50">
                <CardContent className="pt-5 pb-4 px-5 space-y-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
