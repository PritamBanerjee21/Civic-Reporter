import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isHome = pathname === '/home'
  const isCitizenRoute = pathname.startsWith('/report') || pathname.startsWith('/my-reports')
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/issues')

  // Not logged in: redirect protected routes to login
  if (!user) {
    if (isHome || isCitizenRoute || isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Logged in: get role
  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  // Logged in + auth routes (login/register) → redirect to role home
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = role === 'admin' ? '/dashboard' : '/home'
    return NextResponse.redirect(redirectUrl)
  }

  // Logged in + citizen tries admin routes → redirect to /home
  if (user && isAdminRoute && role !== 'admin') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/home'
    return NextResponse.redirect(redirectUrl)
  }

  // Logged in + admin tries citizen routes → redirect to /dashboard
  if (user && isCitizenRoute && role === 'admin') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/home',
    '/login',
    '/register',
    '/report/:path*',
    '/my-reports/:path*',
    '/dashboard/:path*',
    '/issues/:path*',
  ],
}
