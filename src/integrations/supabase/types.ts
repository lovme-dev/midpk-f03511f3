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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
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
          page_views: number | null
          path: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          visit_time: string | null
          visitors: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          ip_address?: string | null
          page_views?: number | null
          path?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visit_time?: string | null
          visitors?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          ip_address?: string | null
          page_views?: number | null
          path?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visit_time?: string | null
          visitors?: number | null
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
      content_blocks: {
        Row: {
          block_key: string
          content: string | null
          created_at: string | null
          data: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          page_name: string
          sort_order: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          block_key: string
          content?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          page_name: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          block_key?: string
          content?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          page_name?: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
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
      game_profiles: {
        Row: {
          created_at: string | null
          game: string
          id: string
          player_id: string | null
          region: string | null
          server: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          game: string
          id?: string
          player_id?: string | null
          region?: string | null
          server?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          game?: string
          id?: string
          player_id?: string | null
          region?: string | null
          server?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      inquiry_email_log: {
        Row: {
          body: string | null
          created_at: string | null
          customer_email: string | null
          id: string
          inquiry_id: string | null
          recipient_email: string | null
          sent_at: string | null
          sent_by: string | null
          status: string | null
          subject: string | null
          template_type: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          customer_email?: string | null
          id?: string
          inquiry_id?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          template_type?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          customer_email?: string | null
          id?: string
          inquiry_id?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          template_type?: string | null
        }
        Relationships: []
      }
      live_users: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_seen: string | null
          path: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_seen?: string | null
          path?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
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
          body: string | null
          created_at: string | null
          data: Json | null
          icon_url: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read: boolean | null
          sent_at: string | null
          title: string
          type: string | null
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          data?: Json | null
          icon_url?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read?: boolean | null
          sent_at?: string | null
          title: string
          type?: string | null
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          data?: Json | null
          icon_url?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read?: boolean | null
          sent_at?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          currency_code: string | null
          customer_email: string | null
          customer_name: string | null
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
          refund_reason: string | null
          refund_status: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
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
          refund_reason?: string | null
          refund_status?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
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
          refund_reason?: string | null
          refund_status?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      orders_archive: {
        Row: {
          archived_at: string
          archived_reason: string | null
          currency_code: string | null
          customer_email: string | null
          customer_name: string | null
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
          username: string | null
        }
        Insert: {
          archived_at?: string
          archived_reason?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
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
          username?: string | null
        }
        Update: {
          archived_at?: string
          archived_reason?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
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
          username?: string | null
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
          page_id: string | null
          page_name: string | null
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
          page_id?: string | null
          page_name?: string | null
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
          page_id?: string | null
          page_name?: string | null
          path?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_credentials: {
        Row: {
          account_number: string | null
          account_title: string | null
          created_at: string | null
          id: string
          instructions: string | null
          is_active: boolean | null
          method_key: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          account_title?: string | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          method_key: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          account_title?: string | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          method_key?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_method_settings: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          enabled: boolean
          id: string
          method_key: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          enabled?: boolean
          id?: string
          method_key: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          enabled?: boolean
          id?: string
          method_key?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blocked_at: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          blocked_at?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          blocked_at?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string | null
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
        Relationships: []
      }
      pubg_accounts: {
        Row: {
          created_at: string | null
          description: string | null
          discount: number | null
          id: string
          is_active: boolean | null
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
          discount?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
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
          discount?: number | null
          id?: string
          is_active?: boolean | null
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
      pubg_uc_page_content: {
        Row: {
          characters_image_url: string | null
          content_key: string
          created_at: string | null
          data: Json | null
          desktop_banner_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          mobile_banner_url: string | null
          page_name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          characters_image_url?: string | null
          content_key: string
          created_at?: string | null
          data?: Json | null
          desktop_banner_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mobile_banner_url?: string | null
          page_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          characters_image_url?: string | null
          content_key?: string
          created_at?: string | null
          data?: Json | null
          desktop_banner_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mobile_banner_url?: string | null
          page_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string | null
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      redeem_codes: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          player_id: string | null
          redeem_code: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          used_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          player_id?: string | null
          redeem_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          player_id?: string | null
          redeem_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      redeem_codes_archive: {
        Row: {
          archived_at: string
          archived_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          original_id: string | null
          player_id: string | null
          redeem_code: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          original_id?: string | null
          player_id?: string | null
          redeem_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          original_id?: string | null
          player_id?: string | null
          redeem_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      saved_cards: {
        Row: {
          card_brand: string | null
          card_holder: string | null
          created_at: string | null
          expiry_month: string | null
          expiry_year: string | null
          id: string
          is_default: boolean | null
          last_four: string | null
          token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_holder?: string | null
          created_at?: string | null
          expiry_month?: string | null
          expiry_year?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_holder?: string | null
          created_at?: string | null
          expiry_month?: string | null
          expiry_year?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_assets: {
        Row: {
          asset_key: string | null
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          mime_type: string | null
          name: string | null
          size: number | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          asset_key?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          name?: string | null
          size?: number | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          asset_key?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          name?: string | null
          size?: number | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      site_banners: {
        Row: {
          banner_key: string | null
          created_at: string | null
          description: string | null
          desktop_image_url: string | null
          device_type: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          light_color: string | null
          light_enabled: boolean | null
          light_intensity: number | null
          light_spread: number | null
          link_url: string | null
          mobile_image_url: string | null
          page_name: string
          position_x: number | null
          position_y: number | null
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
          zoom_level: number | null
        }
        Insert: {
          banner_key?: string | null
          created_at?: string | null
          description?: string | null
          desktop_image_url?: string | null
          device_type?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          light_color?: string | null
          light_enabled?: boolean | null
          light_intensity?: number | null
          light_spread?: number | null
          link_url?: string | null
          mobile_image_url?: string | null
          page_name: string
          position_x?: number | null
          position_y?: number | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
          zoom_level?: number | null
        }
        Update: {
          banner_key?: string | null
          created_at?: string | null
          description?: string | null
          desktop_image_url?: string | null
          device_type?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          light_color?: string | null
          light_enabled?: boolean | null
          light_intensity?: number | null
          light_spread?: number | null
          link_url?: string | null
          mobile_image_url?: string | null
          page_name?: string
          position_x?: number | null
          position_y?: number | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
          zoom_level?: number | null
        }
        Relationships: []
      }
      uc_packages: {
        Row: {
          amount: number | null
          created_at: string | null
          currency_code: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          name: string
          popular: boolean | null
          price: number
          product_type: string | null
          sort_order: number | null
          uc_amount: number
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency_code?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          popular?: boolean | null
          price?: number
          product_type?: string | null
          sort_order?: number | null
          uc_amount?: number
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency_code?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          popular?: boolean | null
          price?: number
          product_type?: string | null
          sort_order?: number | null
          uc_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          delivered: boolean | null
          id: string
          is_read: boolean | null
          message: string | null
          notification_id: string | null
          read: boolean | null
          read_at: string | null
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          delivered?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_id?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          delivered?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_id?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string | null
          type?: string | null
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
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
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
      assign_default_role: { Args: { p_user_id: string }; Returns: undefined }
      check_auth_rate_limit: { Args: { p_email: string }; Returns: boolean }
      delete_old_pending_failed_orders: { Args: never; Returns: undefined }
      grant_role_by_email: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          user_email: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          user_email: string
        }
        Returns: Json
      }
      submit_redeem_code: {
        Args: { p_player_id: string; p_redeem_code: string; p_username: string }
        Returns: Json
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
