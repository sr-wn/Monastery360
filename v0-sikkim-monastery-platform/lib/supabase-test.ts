import { createClient } from '@supabase/supabase-js'

// Test Supabase connection
export async function testSupabaseConnection() {
  const supabaseUrl = 'https://fqjgzgkeoebfdldhdxkb.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxamd6Z2tlb2ViZmRsZGhkeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTYzNTUsImV4cCI6MjA3NDUzMjM1NX0.-W75gkbHlPRBLprVCl_JbrN3bDNe1e2Q9iuSMhWc6rg'
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test connection by fetching from a table
    const { data, error } = await supabase
      .from('monasteries')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Test authentication
export async function testSupabaseAuth() {
  const supabaseUrl = 'https://fqjgzgkeoebfdldhdxkb.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxamd6Z2tlb2ViZmRsZGhkeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTYzNTUsImV4cCI6MjA3NDUzMjM1NX0.-W75gkbHlPRBLprVCl_JbrN3bDNe1e2Q9iuSMhWc6rg'
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('Auth test (no user logged in):', error.message)
      return { success: true, user: null, message: 'No user logged in (expected)' }
    }
    
    console.log('✅ Supabase auth test successful!')
    return { success: true, user }
  } catch (err) {
    console.error('Supabase auth test error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

