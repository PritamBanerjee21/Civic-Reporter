import { ReportForm } from '@/components/ReportForm'

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground mt-1">
          Help improve your community by reporting civic issues
        </p>
      </div>
      <ReportForm />
    </div>
  )
}
