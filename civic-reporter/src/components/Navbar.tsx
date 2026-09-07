'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Shield, LogOut, User, Home } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

interface NavbarProps {
  user: {
    id: string
    email: string | undefined
    user_metadata: {
      full_name?: string
      role?: string
      avatar_url?: string
    }
  }
  isAdmin?: boolean
}

export function Navbar({ user, isAdmin = false }: NavbarProps) {
  const router = useRouter()
  const fullName = user.user_metadata?.full_name || 'User'
  const role = user.user_metadata?.role || 'citizen'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleLogout() {
    await logout()
    router.refresh()
  }

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span>Civic Reporter</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/home"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            {isAdmin ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/issues"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  All Issues
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/report"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  Report Issue
                </Link>
                <Link
                  href="/my-reports"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  My Reports
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email || ''}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(isAdmin ? '/dashboard' : '/my-reports')}
                  className="flex items-center gap-2 w-full cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive flex items-center gap-2 w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge
              variant={role === 'admin' ? 'default' : 'secondary'}
              className={cn(
                'text-xs hidden sm:inline-flex',
                role === 'admin' && 'bg-primary text-primary-foreground'
              )}
            >
              {role === 'admin' ? 'Admin' : 'Citizen'}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
