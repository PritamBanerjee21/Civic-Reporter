import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { ReactNode } from 'react'

export default async function CitizenLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const navbarUser = {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.user_metadata?.full_name,
      role: profile?.role,
      avatar_url: user.user_metadata?.avatar_url,
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={navbarUser} isAdmin={profile?.role === 'admin'} />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 w-full">
        {children}
      </main>
      <footer className="border-t py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Civic Reporter. Built with Next.js, Supabase, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  )
}