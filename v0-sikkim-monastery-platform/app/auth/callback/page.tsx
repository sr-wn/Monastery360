'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          setTimeout(() => router.push('/'), 2000)
        } else {
          setStatus('error')
          setMessage('No session found. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <h2 className="text-xl font-semibold">Processing Authentication</h2>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Success!</h2>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="w-12 h-12 text-red-600" />
                <h2 className="text-xl font-semibold text-red-800">Authentication Failed</h2>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

