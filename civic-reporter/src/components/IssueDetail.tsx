'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, User, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateIssueStatus } from '@/lib/actions/issues'
import type { IssueWithProfile, Status } from '@/types'

interface IssueDetailProps {
  issue: IssueWithProfile
}

const statusSteps: { key: Status; label: string; icon: typeof CheckCircle2 }[] = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'in_progress', label: 'In Progress', icon: Loader2 },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2 },
]

export function IssueDetail({ issue }: IssueDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStatus, setCurrentStatus] = useState<Status>(issue.status)
  const [successMessage, setSuccessMessage] = useState('')

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function handleStatusChange(newStatus: string) {
    setSuccessMessage('')
    startTransition(async () => {
      const result = await updateIssueStatus(issue.id, newStatus as Status)
      if (result.error) {
        console.error('Failed to update status:', result.error)
      } else {
        setCurrentStatus(newStatus as Status)
        setSuccessMessage('Status updated successfully')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/issues">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Details</h1>
          <p className="text-muted-foreground mt-1">View and manage this reported issue</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 rounded-lg px-4 py-3 text-sm">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl">{issue.title}</CardTitle>
                <StatusBadge status={currentStatus} />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {issue.category.replace('_', ' ')}
                </Badge>
                {issue.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{issue.location}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {issue.image_url && (
                <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={issue.image_url}
                    alt={issue.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {issue.description || 'No description provided.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Reported By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{issue.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(issue.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {statusSteps.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStatus === step.key
                  return (
                    <button
                      key={step.key}
                      onClick={() => handleStatusChange(step.key)}
                      disabled={isPending}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {step.label}
                    </button>
                  )
                })}
              </div>
              {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
