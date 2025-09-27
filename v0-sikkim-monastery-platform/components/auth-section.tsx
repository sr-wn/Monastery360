'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

interface AuthSectionProps {
  variant?: 'desktop' | 'mobile'
  onMobileMenuClose?: () => void
}

export function AuthSection({ variant = 'desktop', onMobileMenuClose }: AuthSectionProps) {
  const [mounted, setMounted] = useState(false)
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show loading skeleton during hydration
    if (variant === 'desktop') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-muted animate-pulse rounded-lg" />
          <div className="w-16 h-8 bg-muted animate-pulse rounded-lg" />
        </div>
      )
    } else {
      return (
        <div className="space-y-2">
          <div className="w-full h-10 bg-muted animate-pulse rounded-lg" />
          <div className="w-full h-10 bg-muted animate-pulse rounded-lg" />
        </div>
      )
    }
  }

  if (user) {
    if (variant === 'desktop') {
      return (
        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-border">
          <div className="w-8 h-8 rounded-full border bg-primary/10 flex items-center justify-center">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <span className="text-sm max-w-[160px] truncate">
            {user.user_metadata?.name || user.email?.split('@')[0]}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent"
            onClick={signOut}
            disabled={loading}
          >
            Sign out
          </Button>
        </div>
      )
    } else {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <div className="w-6 h-6 rounded-full border bg-primary/10 flex items-center justify-center">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-3 h-3 text-primary" />
              )}
            </div>
            <span className="text-sm truncate">
              {user.user_metadata?.name || user.email?.split('@')[0]}
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              signOut()
              onMobileMenuClose?.()
            }}
            disabled={loading}
          >
            Sign out
          </Button>
        </div>
      )
    }
  }

  // Not logged in
  if (variant === 'desktop') {
    return (
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          className="bg-transparent border-border hover:bg-muted/50 transition-all duration-200 rounded-lg"
          asChild
        >
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-lg"
          asChild
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )
  } else {
    return (
      <>
        <Button
          variant="outline"
          className="w-full bg-transparent border-border hover:bg-muted/50 transition-all duration-200 rounded-lg"
          asChild
          onClick={onMobileMenuClose}
        >
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-lg"
          asChild
          onClick={onMobileMenuClose}
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </>
    )
  }
}
