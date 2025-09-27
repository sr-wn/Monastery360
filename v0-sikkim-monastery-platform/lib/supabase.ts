import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fqjgzgkeoebfdldhdxkb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxamd6Z2tlb2ViZmRsZGhkeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTYzNTUsImV4cCI6MjA3NDUzMjM1NX0.-W75gkbHlPRBLprVCl_JbrN3bDNe1e2Q9iuSMhWc6rg'

// Google OAuth Configuration - Use environment variables
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these from your Supabase project)
export interface Database {
  public: {
    Tables: {
      monasteries: {
        Row: {
          id: number
          name: string
          name_nepali: string
          latitude: number
          longitude: number
          address: string
          description: string
          description_nepali: string
          founded: string
          significance: string
          features: string[]
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          name_nepali: string
          latitude: number
          longitude: number
          address: string
          description: string
          description_nepali: string
          founded: string
          significance: string
          features: string[]
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_nepali?: string
          latitude?: number
          longitude?: number
          address?: string
          description?: string
          description_nepali?: string
          founded?: string
          significance?: string
          features?: string[]
          image?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: number
          user_id: string
          monastery_id: number
          visited_at: string
          rating?: number
          review?: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          monastery_id: number
          visited_at: string
          rating?: number
          review?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          monastery_id?: number
          visited_at?: string
          rating?: number
          review?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Typed Supabase client
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey)
