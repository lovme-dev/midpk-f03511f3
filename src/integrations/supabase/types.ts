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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Relationships: []
      }
      admin_notification_history: {
        Row: {
          body: string
          created_at: string
          currency_code: string | null
          event_type: string
          id: string
          order_id: string | null
          package_name: string | null
          player_id: string | null
          price: number | null
          sent_to_count: number | null
          title: string
          total_admins: number | null
        }
        Insert: {
          body: string
          created_at?: string
          currency_code?: string | null
          event_type: string
          id?: string
          order_id?: string | null
          package_name?: string | null
          player_id?: string | null
          price?: number | null
          sent_to_count?: number | null
          title: string
          total_admins?: number | null
        }
        Update: {
          body?: string
          created_at?: string
          currency_code?: string | null
          event_type?: string
          id?: string
          order_id?: string | null
          package_name?: string | null
          player_id?: string | null
          price?: number | null
          sent_to_count?: number | null
          title?: string
          total_admins?: number | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          ip_address: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          ip_address?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          ip_address?: string | null
          views?: number | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          status: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          status?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customer_inquiries_archive: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          original_created_at: string | null
          original_id: string
          original_updated_at: string | null
          status: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          original_created_at?: string | null
          original_id: string
          original_updated_at?: string | null
          status?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          original_created_at?: string | null
          original_id?: string
          original_updated_at?: string | null
          status?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inquiry_email_log: {
        Row: {
          customer_email: string
          id: string
          inquiry_id: string | null
          sent_at: string
          sent_by: string | null
          subject: string | null
          template_type: string | null
        }
        Insert: {
          customer_email: string
          id?: string
          inquiry_id?: string | null
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          template_type?: string | null
        }
        Update: {
          customer_email?: string
          id?: string
          inquiry_id?: string | null
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          template_type?: string | null
        }
        Relationships: []
      }
      live_users: {
        Row: {
          created_at: string | null
          id: string
          last_seen: string | null
          path: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen?: string | null
          path?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen?: string | null
          path?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          icon_url: string | null
          id: string
          message: string
          sent_at: string
          sent_by: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          message: string
          sent_at?: string
          sent_by?: string | null
          title: string
          type?: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          message?: string
          sent_at?: string
          sent_by?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          currency_code: string | null
          email_sent_at: string | null
          exchange_rate: number | null
          id: string
          package_id: string | null
          payment_method: string | null
          payment_screenshot_url: string | null
          pkr_amount: number | null
          player_id: string | null
          price: number | null
          product_amount: string | null
          product_code: string | null
          product_name: string | null
          product_type: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency_code?: string | null
          email_sent_at?: string | null
          exchange_rate?: number | null
          id?: string
          package_id?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          pkr_amount?: number | null
          player_id?: string | null
          price?: number | null
          product_amount?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency_code?: string | null
          email_sent_at?: string | null
          exchange_rate?: number | null
          id?: string
          package_id?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          pkr_amount?: number | null
          player_id?: string | null
          price?: number | null
          product_amount?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "uc_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_archive: {
        Row: {
          archived_at: string
          archived_reason: string | null
          currency_code: string | null
          email_sent_at: string | null
          exchange_rate: number | null
          id: string
          original_created_at: string | null
          original_id: string
          original_updated_at: string | null
          package_id: string | null
          payment_method: string | null
          payment_screenshot_url: string | null
          pkr_amount: number | null
          player_id: string | null
          price: number | null
          product_amount: string | null
          product_code: string | null
          product_name: string | null
          product_type: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          archived_at?: string
          archived_reason?: string | null
          currency_code?: string | null
          email_sent_at?: string | null
          exchange_rate?: number | null
          id?: string
          original_created_at?: string | null
          original_id: string
          original_updated_at?: string | null
          package_id?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          pkr_amount?: number | null
          player_id?: string | null
          price?: number | null
          product_amount?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          archived_at?: string
          archived_reason?: string | null
          currency_code?: string | null
          email_sent_at?: string | null
          exchange_rate?: number | null
          id?: string
          original_created_at?: string | null
          original_id?: string
          original_updated_at?: string | null
          package_id?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          pkr_amount?: number | null
          player_id?: string | null
          price?: number | null
          product_amount?: string | null
          product_code?: string | null
          product_name?: string | null
          product_type?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_meta: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          id: string
          keywords: string | null
          og_image_url: string | null
          page_id: string
          path: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          page_id: string
          path?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          page_id?: string
          path?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country_name: string | null
          created_at: string | null
          device_type: string | null
          id: string
          path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          country_name?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          country_name?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blocked_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blocked_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blocked_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pubg_account_credentials: {
        Row: {
          account_id: string | null
          created_at: string | null
          email: string
          id: string
          password: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          password: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          password?: string
        }
        Relationships: [
          {
            foreignKeyName: "pubg_account_credentials_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "pubg_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pubg_accounts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          price: number
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_duration: number | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          price: number
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          price?: number
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_duration?: number | null
          video_url?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      redeem_codes: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          player_id: string
          redeem_code: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          player_id: string
          redeem_code: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          player_id?: string
          redeem_code?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      redeem_codes_archive: {
        Row: {
          archived_at: string
          archived_by: string | null
          created_at: string
          id: string
          notes: string | null
          original_id: string
          player_id: string
          redeem_code: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          username: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          original_id: string
          player_id: string
          redeem_code: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          original_id?: string
          player_id?: string
          redeem_code?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      saved_cards: {
        Row: {
          card_last_four: string
          card_type: string
          cardholder_name: string
          created_at: string
          expiry_month: string
          expiry_year: string
          id: string
          is_default: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_last_four: string
          card_type?: string
          cardholder_name: string
          created_at?: string
          expiry_month: string
          expiry_year: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_last_four?: string
          card_type?: string
          cardholder_name?: string
          created_at?: string
          expiry_month?: string
          expiry_year?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_banners: {
        Row: {
          banner_key: string
          created_at: string | null
          description: string | null
          device_type: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          light_color: string | null
          light_enabled: boolean | null
          light_intensity: number | null
          light_spread: number | null
          page_name: string
          position_x: number | null
          position_y: number | null
          title: string | null
          updated_at: string | null
          zoom_level: number | null
        }
        Insert: {
          banner_key: string
          created_at?: string | null
          description?: string | null
          device_type?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          light_color?: string | null
          light_enabled?: boolean | null
          light_intensity?: number | null
          light_spread?: number | null
          page_name: string
          position_x?: number | null
          position_y?: number | null
          title?: string | null
          updated_at?: string | null
          zoom_level?: number | null
        }
        Update: {
          banner_key?: string
          created_at?: string | null
          description?: string | null
          device_type?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          light_color?: string | null
          light_enabled?: boolean | null
          light_intensity?: number | null
          light_spread?: number | null
          page_name?: string
          position_x?: number | null
          position_y?: number | null
          title?: string | null
          updated_at?: string | null
          zoom_level?: number | null
        }
        Relationships: []
      }
      uc_packages: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          name: string
          popular: boolean | null
          price: number
          uc_amount: number
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          name: string
          popular?: boolean | null
          price: number
          uc_amount: number
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          name?: string
          popular?: boolean | null
          price?: number
          uc_amount?: number
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          delivered: boolean
          delivered_at: string | null
          id: string
          notification_id: string
          read: boolean
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered?: boolean
          delivered_at?: string | null
          id?: string
          notification_id: string
          read?: boolean
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivered?: boolean
          delivered_at?: string | null
          id?: string
          notification_id?: string
          read?: boolean
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      website_colors: {
        Row: {
          color_key: string
          color_value: string
          created_at: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          color_key: string
          color_value: string
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          color_key?: string
          color_value?: string
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_default_role: { Args: { p_user_id: string }; Returns: undefined }
      auto_update_cancelled_to_refund_review: {
        Args: never
        Returns: undefined
      }
      check_auth_rate_limit: { Args: { p_email: string }; Returns: boolean }
      delete_old_pending_failed_orders: { Args: never; Returns: undefined }
      grant_role_by_email: {
        Args: { target_role: string; user_email: string }
        Returns: Json
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      increment_auth_attempts: { Args: { p_email: string }; Returns: undefined }
      list_admins: {
        Args: never
        Returns: {
          email: string
          since: string
          user_id: string
        }[]
      }
      list_users_with_admin_status: {
        Args: never
        Returns: {
          email: string
          is_admin: boolean
          user_id: string
        }[]
      }
      log_admin_action: {
        Args: {
          p_action_type: string
          p_admin_id: string
          p_details?: Json
          p_target_id?: string
        }
        Returns: undefined
      }
      reset_auth_attempts: { Args: { p_user_id: string }; Returns: undefined }
      revoke_role_by_email: {
        Args: { target_role: string; user_email: string }
        Returns: Json
      }
      submit_redeem_code: {
        Args: { p_player_id: string; p_redeem_code: string; p_username: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
