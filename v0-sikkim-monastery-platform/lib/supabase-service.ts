import { supabase, supabaseTyped, Database } from './supabase'

// Type definitions
type Monastery = Database['public']['Tables']['monasteries']['Row']
type MonasteryInsert = Database['public']['Tables']['monasteries']['Insert']
type MonasteryUpdate = Database['public']['Tables']['monasteries']['Update']

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type Visit = Database['public']['Tables']['visits']['Row']
type VisitInsert = Database['public']['Tables']['visits']['Insert']

export class SupabaseService {
  // Monastery operations
  static async getMonasteries(): Promise<Monastery[]> {
    const { data, error } = await supabaseTyped
      .from('monasteries')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching monasteries:', error)
      throw error
    }

    return data || []
  }

  static async getMonasteryById(id: number): Promise<Monastery | null> {
    const { data, error } = await supabaseTyped
      .from('monasteries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching monastery:', error)
      return null
    }

    return data
  }

  static async createMonastery(monastery: MonasteryInsert): Promise<Monastery | null> {
    const { data, error } = await supabaseTyped
      .from('monasteries')
      .insert(monastery)
      .select()
      .single()

    if (error) {
      console.error('Error creating monastery:', error)
      throw error
    }

    return data
  }

  static async updateMonastery(id: number, updates: MonasteryUpdate): Promise<Monastery | null> {
    const { data, error } = await supabaseTyped
      .from('monasteries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating monastery:', error)
      throw error
    }

    return data
  }

  static async deleteMonastery(id: number): Promise<boolean> {
    const { error } = await supabaseTyped
      .from('monasteries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting monastery:', error)
      throw error
    }

    return true
  }

  // User operations
  static async getUser(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseTyped
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching user:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        })
        return null
      }

      return data
    } catch (err) {
      console.error('Error in getUser:', err)
      return null
    }
  }

  static async createUser(user: UserInsert): Promise<User | null> {
    const { data, error } = await supabaseTyped
      .from('users')
      .insert(user)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw error
    }

    return data
  }

  static async updateUser(id: string, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await supabaseTyped
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }

    return data
  }

  // Visit operations
  static async getUserVisits(userId: string): Promise<Visit[]> {
    const { data, error } = await supabaseTyped
      .from('visits')
      .select(`
        *,
        monasteries (
          id,
          name,
          image
        )
      `)
      .eq('user_id', userId)
      .order('visited_at', { ascending: false })

    if (error) {
      console.error('Error fetching user visits:', error)
      throw error
    }

    return data || []
  }

  static async createVisit(visit: VisitInsert): Promise<Visit | null> {
    const { data, error } = await supabaseTyped
      .from('visits')
      .insert(visit)
      .select()
      .single()

    if (error) {
      console.error('Error creating visit:', error)
      throw error
    }

    return data
  }

  static async getMonasteryVisits(monasteryId: number): Promise<Visit[]> {
    const { data, error } = await supabaseTyped
      .from('visits')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url
        )
      `)
      .eq('monastery_id', monasteryId)
      .order('visited_at', { ascending: false })

    if (error) {
      console.error('Error fetching monastery visits:', error)
      throw error
    }

    return data || []
  }

  // Authentication helpers
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      console.error('Error signing up:', error)
      throw error
    }

    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error)
      throw error
    }

    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  }

  // Create or update user profile from auth user
  static async createOrUpdateUserProfile(authUser: any): Promise<User | null> {
    try {
      if (!authUser) return null

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Try to get existing user first
      const existingUser = await this.getUser(authUser.id)
      
      if (existingUser) {
        // Update existing user
        return await this.updateUser(authUser.id, {
          name: userData.name,
          avatar_url: userData.avatar_url,
          updated_at: new Date().toISOString()
        })
      } else {
        // Create new user
        return await this.createUser(userData)
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      return null
    }
  }

  // Real-time subscriptions
  static subscribeToMonasteries(callback: (monasteries: Monastery[]) => void) {
    return supabaseTyped
      .channel('monasteries')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'monasteries' },
        async () => {
          const monasteries = await this.getMonasteries()
          callback(monasteries)
        }
      )
      .subscribe()
  }

  static subscribeToVisits(callback: (visits: Visit[]) => void) {
    return supabaseTyped
      .channel('visits')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'visits' },
        async () => {
          const visits = await this.getUserVisits('current-user-id') // You'll need to pass the actual user ID
          callback(visits)
        }
      )
      .subscribe()
  }
}

export default SupabaseService

