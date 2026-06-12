export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'agent'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          status: string
          follow_up_date: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          status?: string
          follow_up_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          status?: string
          follow_up_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          id: string
          title: string
          client_id: string | null
          value: number | null
          stage: string
          probability: number | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_id?: string | null
          value?: number | null
          stage?: string
          probability?: number | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_id?: string | null
          value?: number | null
          stage?: string
          probability?: number | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          source: string | null
          status: string
          follow_up_date: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          follow_up_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          follow_up_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          body: string
          lead_id: string | null
          client_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          body: string
          lead_id?: string | null
          client_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          body?: string
          lead_id?: string | null
          client_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          name: string
          file_url: string
          type: string | null
          client_id: string | null
          deal_id: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          file_url: string
          type?: string | null
          client_id?: string | null
          deal_id?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          file_url?: string
          type?: string | null
          client_id?: string | null
          deal_id?: string | null
          uploaded_by?: string
          created_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'agent'
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'agent'
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'agent'
          joined_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
