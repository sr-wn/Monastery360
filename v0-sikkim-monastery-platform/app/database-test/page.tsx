'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, Database, Users, MapPin, Calendar } from 'lucide-react'
import { SupabaseService } from '@/lib/supabase-service'

interface DatabaseStatus {
  connection: boolean
  usersTable: boolean
  monasteriesTable: boolean
  visitsTable: boolean
  error?: string
}

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      // Test basic connection by fetching monasteries
      const monasteries = await SupabaseService.getMonasteries()
      
      setStatus({
        connection: true,
        usersTable: true, // If we can fetch monasteries, the connection works
        monasteriesTable: true,
        visitsTable: true,
      })
    } catch (error) {
      console.error('Database test error:', error)
      setStatus({
        connection: false,
        usersTable: false,
        monasteriesTable: false,
        visitsTable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const runFullTest = async () => {
    setLoading(true)
    try {
      // Test monasteries
      const monasteries = await SupabaseService.getMonasteries()
      
      // Test user operations (if user is logged in)
      let userTest = null
      try {
        const currentUser = await SupabaseService.getCurrentUser()
        if (currentUser) {
          userTest = await SupabaseService.getUser(currentUser.id)
        }
      } catch (error) {
        console.log('User test failed (expected if not logged in):', error)
      }

      setTestResults({
        monasteries: {
          count: monasteries.length,
          data: monasteries.slice(0, 2) // Show first 2 monasteries
        },
        user: userTest ? 'User profile accessible' : 'No user logged in',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Full test error:', error)
      setTestResults({
        error: error instanceof Error ? error.message : 'Test failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Verify your Supabase database connection and table setup
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Status
            </CardTitle>
            <CardDescription>
              Current status of your Supabase database connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking database connection...</span>
              </div>
            ) : status ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {status.connection ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>Database Connection</span>
                  <Badge variant={status.connection ? "default" : "destructive"}>
                    {status.connection ? "Connected" : "Failed"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {status.monasteriesTable ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>Monasteries Table</span>
                  <Badge variant={status.monasteriesTable ? "default" : "destructive"}>
                    {status.monasteriesTable ? "Available" : "Missing"}
                  </Badge>
                </div>

                {status.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">{status.error}</p>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Run comprehensive tests on your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runFullTest} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Tests...
                </div>
              ) : (
                'Run Full Database Test'
              )}
            </Button>

            {testResults && (
              <div className="space-y-4">
                <h3 className="font-semibold">Test Results:</h3>
                
                {testResults.error ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">{testResults.error}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Monasteries: {testResults.monasteries?.count || 0} found</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>User: {testResults.user || 'Not tested'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Test Time: {new Date(testResults.timestamp).toLocaleString()}</span>
                    </div>

                    {testResults.monasteries?.data && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Sample Monasteries:</h4>
                        <div className="space-y-2">
                          {testResults.monasteries.data.map((monastery: any) => (
                            <div key={monastery.id} className="p-2 bg-muted rounded text-sm">
                              <strong>{monastery.name}</strong> - {monastery.location}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Database Setup</CardTitle>
            <CardDescription>
              If tests fail, follow these steps to set up your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Run Database Setup Script</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Supabase Dashboard → SQL Editor and run the script in:
              </p>
              <code className="block p-2 bg-muted rounded text-sm">
                scripts/check-database.sql
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Enable Google OAuth</h4>
              <p className="text-sm text-muted-foreground">
                Go to Authentication → Providers → Google and enable it with your credentials
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Check Environment Variables</h4>
              <p className="text-sm text-muted-foreground">
                Ensure your .env.local file has the correct Supabase credentials
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
