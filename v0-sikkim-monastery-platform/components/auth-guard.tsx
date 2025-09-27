'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during hydration
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show login prompt
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="w-full max-w-md relative">
          {/* Back Button */}
          <Link 
            href="/"
            className="absolute -top-12 left-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Login Required Card */}
          <Card className="border-border/50 shadow-xl bg-background/95 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl font-heading">Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to access this feature and continue your spiritual journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  This page requires you to be signed in to your Monastery360 account.
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full h-11 border-border hover:bg-muted/50 transition-all duration-200 rounded-lg"
                    asChild
                  >
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>Join thousands of users exploring Sikkim's sacred heritage</p>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, show protected content
  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuthGuard<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
