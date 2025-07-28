export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_logs: {
        Row: {
          created_at: string
          id: string
          model_used: string | null
          prompt: string
          response: string
          subaccount_id: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_used?: string | null
          prompt: string
          response: string
          subaccount_id?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model_used?: string | null
          prompt?: string
          response?: string
          subaccount_id?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_logs_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversions: number | null
          cpc: number | null
          created_at: string
          ctr: number | null
          date: string
          id: string
          impressions: number | null
          platform: Database["public"]["Enums"]["campaign_platform"]
          roas: number | null
          spend: number | null
          subaccount_id: string
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date: string
          id?: string
          impressions?: number | null
          platform: Database["public"]["Enums"]["campaign_platform"]
          roas?: number | null
          spend?: number | null
          subaccount_id: string
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number | null
          platform?: Database["public"]["Enums"]["campaign_platform"]
          roas?: number | null
          spend?: number | null
          subaccount_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_copy: string | null
          budget: number | null
          created_at: string
          created_by: string
          creative_prompt: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          platform: Database["public"]["Enums"]["campaign_platform"]
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subaccount_id: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          ad_copy?: string | null
          budget?: number | null
          created_at?: string
          created_by: string
          creative_prompt?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          platform: Database["public"]["Enums"]["campaign_platform"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subaccount_id: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          ad_copy?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string
          creative_prompt?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          platform?: Database["public"]["Enums"]["campaign_platform"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subaccount_id?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          created_by: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          stage: Database["public"]["Enums"]["lead_stage"]
          subaccount_id: string
          tags: string[] | null
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["lead_stage"]
          subaccount_id: string
          tags?: string[] | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: Database["public"]["Enums"]["lead_stage"]
          subaccount_id?: string
          tags?: string[] | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          account_id: string | null
          account_name: string | null
          connected_by: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          platform: Database["public"]["Enums"]["campaign_platform"]
          refresh_token: string | null
          subaccount_id: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          connected_by: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          platform: Database["public"]["Enums"]["campaign_platform"]
          refresh_token?: string | null
          subaccount_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          connected_by?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          platform?: Database["public"]["Enums"]["campaign_platform"]
          refresh_token?: string | null
          subaccount_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          media_urls: string[] | null
          platform: Database["public"]["Enums"]["campaign_platform"]
          post_id: string | null
          scheduled_for: string
          status: string
          subaccount_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          media_urls?: string[] | null
          platform: Database["public"]["Enums"]["campaign_platform"]
          post_id?: string | null
          scheduled_for: string
          status?: string
          subaccount_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          media_urls?: string[] | null
          platform?: Database["public"]["Enums"]["campaign_platform"]
          post_id?: string | null
          scheduled_for?: string
          status?: string
          subaccount_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subaccounts: {
        Row: {
          address: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_subaccounts: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          subaccount_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          subaccount_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          subaccount_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subaccounts_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          action_type:
            | Database["public"]["Enums"]["workflow_action_type"]
            | null
          configuration: Json | null
          created_at: string
          id: string
          step_order: number
          step_type: string
          trigger_type:
            | Database["public"]["Enums"]["workflow_trigger_type"]
            | null
          workflow_id: string
        }
        Insert: {
          action_type?:
            | Database["public"]["Enums"]["workflow_action_type"]
            | null
          configuration?: Json | null
          created_at?: string
          id?: string
          step_order: number
          step_type: string
          trigger_type?:
            | Database["public"]["Enums"]["workflow_trigger_type"]
            | null
          workflow_id: string
        }
        Update: {
          action_type?:
            | Database["public"]["Enums"]["workflow_action_type"]
            | null
          configuration?: Json | null
          created_at?: string
          id?: string
          step_order?: number
          step_type?: string
          trigger_type?:
            | Database["public"]["Enums"]["workflow_trigger_type"]
            | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          subaccount_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          subaccount_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          subaccount_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_subaccount_access: {
        Args: { _subaccount_id: string }
        Returns: boolean
      }
    }
    Enums: {
      campaign_platform:
        | "facebook"
        | "instagram"
        | "youtube"
        | "google"
        | "linkedin"
      campaign_status: "draft" | "active" | "paused" | "completed" | "cancelled"
      lead_stage:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
      user_role: "admin" | "manager" | "member" | "client"
      workflow_action_type:
        | "send_email"
        | "add_tag"
        | "create_task"
        | "post_ad"
        | "send_sms"
      workflow_trigger_type:
        | "lead_created"
        | "email_opened"
        | "form_submitted"
        | "tag_added"
        | "date_time"
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
      campaign_platform: [
        "facebook",
        "instagram",
        "youtube",
        "google",
        "linkedin",
      ],
      campaign_status: ["draft", "active", "paused", "completed", "cancelled"],
      lead_stage: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
      user_role: ["admin", "manager", "member", "client"],
      workflow_action_type: [
        "send_email",
        "add_tag",
        "create_task",
        "post_ad",
        "send_sms",
      ],
      workflow_trigger_type: [
        "lead_created",
        "email_opened",
        "form_submitted",
        "tag_added",
        "date_time",
      ],
    },
  },
} as const
