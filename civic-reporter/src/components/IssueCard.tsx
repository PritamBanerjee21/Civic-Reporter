'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Issue, Category } from '@/types'
import { MapPin, Calendar } from 'lucide-react'

interface IssueCardProps {
  issue: Issue
  className?: string
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  pothole: {
    label: 'Pothole',
    className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
  garbage: {
    label: 'Garbage',
    className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50',
  },
  streetlight: {
    label: 'Streetlight',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50',
  },
  water: {
    label: 'Water',
    className: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800/50',
  },
  other: {
    label: 'Other',
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function IssueCard({ issue, className }: IssueCardProps) {
  const category = categoryConfig[issue.category]

  return (
    <Card className={cn('hover:shadow-md transition-shadow border-border/50', className)}>
      <CardHeader className="pb-2 pt-5 px-5">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">
            {issue.title}
          </CardTitle>
          <StatusBadge status={issue.status} />
        </div>
        <Badge
          variant="outline"
          className={cn('text-[10px] font-medium w-fit mt-1', category.className)}
        >
          {category.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5">
        {issue.image_url && (
          <div className="relative w-full h-36 rounded-lg overflow-hidden bg-muted">
            <Image
              src={issue.image_url}
              alt={issue.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {issue.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {issue.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{issue.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(issue.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
