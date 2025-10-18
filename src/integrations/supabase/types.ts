export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_managers: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ad_recharges: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string
          id: string
          payment_method: string | null
          processed_at: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_recharges_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_data: {
        Row: {
          amount_spent: number | null
          campaign_name: string
          conversations_started: number | null
          cost_per_conversation: number | null
          cost_per_result: number | null
          cpc: number | null
          cpm: number | null
          created_at: string | null
          ctr: number | null
          frequency: number | null
          id: string
          impressions: number | null
          link_clicks: number | null
          reach: number | null
          results: number | null
          updated_at: string | null
          user_id: string
          week_end: string | null
          week_start: string | null
        }
        Insert: {
          amount_spent?: number | null
          campaign_name: string
          conversations_started?: number | null
          cost_per_conversation?: number | null
          cost_per_result?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string | null
          ctr?: number | null
          frequency?: number | null
          id?: string
          impressions?: number | null
          link_clicks?: number | null
          reach?: number | null
          results?: number | null
          updated_at?: string | null
          user_id: string
          week_end?: string | null
          week_start?: string | null
        }
        Update: {
          amount_spent?: number | null
          campaign_name?: string
          conversations_started?: number | null
          cost_per_conversation?: number | null
          cost_per_result?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string | null
          ctr?: number | null
          frequency?: number | null
          id?: string
          impressions?: number | null
          link_clicks?: number | null
          reach?: number | null
          results?: number | null
          updated_at?: string | null
          user_id?: string
          week_end?: string | null
          week_start?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          daily_budget: number | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          performance_metrics: Json | null
          start_date: string | null
          status: string | null
          target_audience: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          daily_budget?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          daily_budget?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          assigned_to: string | null
          category: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          is_completed: boolean | null
          is_recurring: boolean | null
          last_occurrence_date: string | null
          priority: string | null
          recurrence_days: Json | null
          recurrence_interval: number | null
          recurrence_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          last_occurrence_date?: string | null
          priority?: string | null
          recurrence_days?: Json | null
          recurrence_interval?: number | null
          recurrence_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          last_occurrence_date?: string | null
          priority?: string | null
          recurrence_days?: Json | null
          recurrence_interval?: number | null
          recurrence_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          category: string | null
          created_at: string
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Lunaris: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          client_confirmed_at: string | null
          created_at: string | null
          created_by: string
          id: string
          message: string | null
          pix_code: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_confirmed_at?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          message?: string | null
          pix_code: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_confirmed_at?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          message?: string | null
          pix_code?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          manager_id: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          manager_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          manager_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sheets_sync_config: {
        Row: {
          created_at: string
          id: string
          last_sync: string | null
          sheet_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_sync?: string | null
          sheet_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_sync?: string | null
          sheet_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          campaign_id: string | null
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          performance_data: Json | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          performance_data?: Json | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          performance_data?: Json | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategies_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          title: string
          updated_at: string | null
          uploaded_by: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          title: string
          updated_at?: string | null
          uploaded_by: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          title?: string
          updated_at?: string | null
          uploaded_by?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      sync_all_google_sheets: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
