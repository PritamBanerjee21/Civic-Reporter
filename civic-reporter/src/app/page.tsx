import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Users, CheckCircle2, AlertCircle, MapPin, Camera } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span>Civic Reporter</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Shield className="h-3.5 w-3.5" />
            SIH25031 — Government of Jharkhand
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your Voice,{' '}
            <span className="text-primary">Your Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Report civic issues like potholes, broken streetlights, garbage, and water leaks.
            Track their resolution and hold local authorities accountable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Start Reporting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to improve your neighborhood
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertCircle,
                title: 'Report',
                desc: 'Submit a report with title, description, category, location, and an optional photo.',
              },
              {
                icon: Users,
                title: 'Review',
                desc: 'Municipal administrators review reports, assign priority, and begin addressing them.',
              },
              {
                icon: CheckCircle2,
                title: 'Resolve',
                desc: 'Track the status from pending to in-progress to resolved. Your community improves.',
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative group">
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-6 px-6 text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-5">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-xs font-semibold text-primary mb-2 tracking-wide uppercase">
                      Step {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Report Across Categories</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From potholes to water leaks — report any civic issue in your area
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: AlertCircle, label: 'Pothole', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
              { icon: Users, label: 'Garbage', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
              { icon: MapPin, label: 'Streetlight', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
              { icon: Camera, label: 'Water', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
              { icon: Shield, label: 'Other', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
            ].map(({ icon: Icon, label, color }) => (
              <Card key={label} className="border-border/50">
                <CardContent className="pt-6 pb-5 flex flex-col items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join citizens improving their communities one report at a time.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 px-8">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Civic Reporter. Built with Next.js, Supabase, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  )
}
