'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-test'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SupabaseTestPage() {
  const [connectionTest, setConnectionTest] = useState<{
    loading: boolean
    result: any
  }>({ loading: false, result: null })

  const [authTest, setAuthTest] = useState<{
    loading: boolean
    result: any
  }>({ loading: false, result: null })

  const [monasteriesTest, setMonasteriesTest] = useState<{
    loading: boolean
    result: any
  }>({ loading: false, result: null })

  const runConnectionTest = async () => {
    setConnectionTest({ loading: true, result: null })
    const result = await testSupabaseConnection()
    setConnectionTest({ loading: false, result })
  }

  const runAuthTest = async () => {
    setAuthTest({ loading: true, result: null })
    const result = await testSupabaseAuth()
    setAuthTest({ loading: false, result })
  }

  const testMonasteriesTable = async () => {
    setMonasteriesTest({ loading: true, result: null })
    try {
      const { data, error } = await supabase
        .from('monasteries')
        .select('*')
        .limit(5)
      
      setMonasteriesTest({ 
        loading: false, 
        result: { success: !error, data, error: error?.message } 
      })
    } catch (err) {
      setMonasteriesTest({ 
        loading: false, 
        result: { 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        } 
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Supabase Integration Test</h1>
          <p className="text-muted-foreground">
            Test your Supabase connection and database operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Connection Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runConnectionTest} 
                disabled={connectionTest.loading}
                className="w-full"
              >
                {connectionTest.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  'Test Supabase Connection'
                )}
              </Button>
              
              {connectionTest.result && (
                <div className={`p-3 rounded-lg ${
                  connectionTest.result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {connectionTest.result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      connectionTest.result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {connectionTest.result.success ? 'Connection Successful!' : 'Connection Failed'}
                    </span>
                  </div>
                  {connectionTest.result.error && (
                    <p className="text-sm text-red-700">{connectionTest.result.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auth Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Authentication Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runAuthTest} 
                disabled={authTest.loading}
                className="w-full"
              >
                {authTest.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Auth...
                  </>
                ) : (
                  'Test Supabase Auth'
                )}
              </Button>
              
              {authTest.result && (
                <div className={`p-3 rounded-lg ${
                  authTest.result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {authTest.result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      authTest.result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {authTest.result.success ? 'Auth Test Successful!' : 'Auth Test Failed'}
                    </span>
                  </div>
                  {authTest.result.message && (
                    <p className="text-sm text-green-700">{authTest.result.message}</p>
                  )}
                  {authTest.result.error && (
                    <p className="text-sm text-red-700">{authTest.result.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monasteries Table Test */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Database Table Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testMonasteriesTable} 
                disabled={monasteriesTest.loading}
                className="w-full"
              >
                {monasteriesTest.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Monasteries Table...
                  </>
                ) : (
                  'Test Monasteries Table'
                )}
              </Button>
              
              {monasteriesTest.result && (
                <div className={`p-3 rounded-lg ${
                  monasteriesTest.result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {monasteriesTest.result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      monasteriesTest.result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {monasteriesTest.result.success ? 'Table Access Successful!' : 'Table Access Failed'}
                    </span>
                  </div>
                  
                  {monasteriesTest.result.error && (
                    <p className="text-sm text-red-700 mb-2">{monasteriesTest.result.error}</p>
                  )}
                  
                  {monasteriesTest.result.data && (
                    <div className="mt-3">
                      <p className="text-sm text-green-700 mb-2">
                        Found {monasteriesTest.result.data.length} monasteries:
                      </p>
                      <div className="space-y-2">
                        {monasteriesTest.result.data.map((monastery: any) => (
                          <div key={monastery.id} className="text-xs bg-white p-2 rounded border">
                            <strong>{monastery.name}</strong> - {monastery.latitude}, {monastery.longitude}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">🔒 Security Notice</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-2">
              <strong>Important:</strong> Your Supabase credentials are now integrated into the project.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>The anon key is safe to use in client-side code (it's designed for public use)</li>
              <li>Make sure to set up Row Level Security (RLS) policies in your Supabase dashboard</li>
              <li>Never commit your service role key to version control</li>
              <li>For production, use environment variables instead of hardcoded values</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

