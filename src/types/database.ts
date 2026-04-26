export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      auth_otp: {
        Row: {
          attempts: number;
          code: string;
          created_at: string;
          expires_at: string;
          id: string;
          ip: string | null;
          phone: string;
          used: boolean;
          user_agent: string | null;
        };
        Insert: {
          attempts?: number;
          code: string;
          created_at?: string;
          expires_at: string;
          id?: string;
          ip?: string | null;
          phone: string;
          used?: boolean;
          user_agent?: string | null;
        };
        Update: {
          attempts?: number;
          code?: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          ip?: string | null;
          phone?: string;
          used?: boolean;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      ad_campaigns: {
        Row: {
          advertiser_email: string | null;
          advertiser_name: string;
          alt_text: string | null;
          cities: string[] | null;
          clicks: number;
          country_codes: string[];
          created_at: string;
          daily_budget: number | null;
          ends_at: string;
          id: string;
          image_url: string | null;
          impressions: number;
          is_active: boolean;
          slot: Database["public"]["Enums"]["ad_slot"];
          starts_at: string;
          target_url: string | null;
        };
        Insert: {
          advertiser_email?: string | null;
          advertiser_name: string;
          alt_text?: string | null;
          cities?: string[] | null;
          clicks?: number;
          country_codes?: string[];
          created_at?: string;
          daily_budget?: number | null;
          ends_at: string;
          id?: string;
          image_url?: string | null;
          impressions?: number;
          is_active?: boolean;
          slot: Database["public"]["Enums"]["ad_slot"];
          starts_at: string;
          target_url?: string | null;
        };
        Update: {
          advertiser_email?: string | null;
          advertiser_name?: string;
          alt_text?: string | null;
          cities?: string[] | null;
          clicks?: number;
          country_codes?: string[];
          created_at?: string;
          daily_budget?: number | null;
          ends_at?: string;
          id?: string;
          image_url?: string | null;
          impressions?: number;
          is_active?: boolean;
          slot?: Database["public"]["Enums"]["ad_slot"];
          starts_at?: string;
          target_url?: string | null;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          action: string;
          admin_id: string | null;
          after_data: Json | null;
          before_data: Json | null;
          created_at: string;
          id: string;
          ip: string | null;
          target_id: string | null;
          target_type: string | null;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          admin_id?: string | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          id?: string;
          ip?: string | null;
          target_id?: string | null;
          target_type?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          admin_id?: string | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          id?: string;
          ip?: string | null;
          target_id?: string | null;
          target_type?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      boosts: {
        Row: {
          created_at: string;
          ends_at: string;
          id: string;
          listing_id: string;
          starts_at: string;
          transaction_id: string | null;
          type: Database["public"]["Enums"]["boost_type"];
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          id?: string;
          listing_id: string;
          starts_at?: string;
          transaction_id?: string | null;
          type: Database["public"]["Enums"]["boost_type"];
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          id?: string;
          listing_id?: string;
          starts_at?: string;
          transaction_id?: string | null;
          type?: Database["public"]["Enums"]["boost_type"];
        };
        Relationships: [
          {
            foreignKeyName: "boosts_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "boosts_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          buyer_id: string;
          created_at: string;
          id: string;
          last_message_at: string;
          listing_id: string;
          seller_id: string;
          status: Database["public"]["Enums"]["conversation_status"];
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          listing_id: string;
          seller_id: string;
          status?: Database["public"]["Enums"]["conversation_status"];
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          listing_id?: string;
          seller_id?: string;
          status?: Database["public"]["Enums"]["conversation_status"];
        };
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          listing_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          listing_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          listing_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          created_at: string;
          id: string;
          listing_id: string | null;
          partner_id: string | null;
          price: number | null;
          sent_at: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          type: Database["public"]["Enums"]["lead_type"];
          user_data: Json;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          listing_id?: string | null;
          partner_id?: string | null;
          price?: number | null;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          type: Database["public"]["Enums"]["lead_type"];
          user_data: Json;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          listing_id?: string | null;
          partner_id?: string | null;
          price?: number | null;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          type?: Database["public"]["Enums"]["lead_type"];
          user_data?: Json;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      listing_amenities: {
        Row: {
          amenity_key: string;
          id: string;
          listing_id: string;
          value: string;
        };
        Insert: {
          amenity_key: string;
          id?: string;
          listing_id: string;
          value?: string;
        };
        Update: {
          amenity_key?: string;
          id?: string;
          listing_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listing_amenities_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      listing_images: {
        Row: {
          alt_text: string | null;
          created_at: string;
          height: number | null;
          id: string;
          is_cover: boolean;
          listing_id: string;
          position: number;
          url: string;
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_cover?: boolean;
          listing_id: string;
          position?: number;
          url: string;
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_cover?: boolean;
          listing_id?: string;
          position?: number;
          url?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      listings: {
        Row: {
          address: string | null;
          bathrooms: number | null;
          bedrooms: number | null;
          category: Database["public"]["Enums"]["listing_category"];
          city: string;
          contacts_count: number;
          country_code: string;
          created_at: string;
          currency: Database["public"]["Enums"]["currency_code"];
          description: string | null;
          expires_at: string | null;
          favorites_count: number;
          floor: number | null;
          governorate: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          neighborhood: string | null;
          owner_id: string;
          pack: Database["public"]["Enums"]["listing_pack"];
          price: number;
          rooms: number | null;
          search_vector: unknown;
          slug: string | null;
          status: Database["public"]["Enums"]["listing_status"];
          surface_m2: number | null;
          title: string;
          total_floors: number | null;
          type: Database["public"]["Enums"]["listing_type"];
          updated_at: string;
          views_count: number;
          year_built: number | null;
        };
        Insert: {
          address?: string | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          category: Database["public"]["Enums"]["listing_category"];
          city: string;
          contacts_count?: number;
          country_code?: string;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string | null;
          expires_at?: string | null;
          favorites_count?: number;
          floor?: number | null;
          governorate?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
          owner_id: string;
          pack?: Database["public"]["Enums"]["listing_pack"];
          price: number;
          rooms?: number | null;
          search_vector?: unknown;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          surface_m2?: number | null;
          title: string;
          total_floors?: number | null;
          type: Database["public"]["Enums"]["listing_type"];
          updated_at?: string;
          views_count?: number;
          year_built?: number | null;
        };
        Update: {
          address?: string | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          category?: Database["public"]["Enums"]["listing_category"];
          city?: string;
          contacts_count?: number;
          country_code?: string;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string | null;
          expires_at?: string | null;
          favorites_count?: number;
          floor?: number | null;
          governorate?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
          owner_id?: string;
          pack?: Database["public"]["Enums"]["listing_pack"];
          price?: number;
          rooms?: number | null;
          search_vector?: unknown;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          surface_m2?: number | null;
          title?: string;
          total_floors?: number | null;
          type?: Database["public"]["Enums"]["listing_type"];
          updated_at?: string;
          views_count?: number;
          year_built?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          attachments: Json;
          content: string;
          conversation_id: string;
          created_at: string;
          flag_reason: string | null;
          flagged: boolean;
          id: string;
          read_at: string | null;
          sender_id: string;
        };
        Insert: {
          attachments?: Json;
          content: string;
          conversation_id: string;
          created_at?: string;
          flag_reason?: string | null;
          flagged?: boolean;
          id?: string;
          read_at?: string | null;
          sender_id: string;
        };
        Update: {
          attachments?: Json;
          content?: string;
          conversation_id?: string;
          created_at?: string;
          flag_reason?: string | null;
          flagged?: boolean;
          id?: string;
          read_at?: string | null;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      partners: {
        Row: {
          balance: number;
          city: string | null;
          country_code: string | null;
          created_at: string;
          email: string | null;
          id: string;
          is_active: boolean;
          leads_count: number;
          logo_url: string | null;
          name: string;
          phone: string | null;
          plan: string;
          type: Database["public"]["Enums"]["partner_type"];
          website: string | null;
        };
        Insert: {
          balance?: number;
          city?: string | null;
          country_code?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          leads_count?: number;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          plan?: string;
          type: Database["public"]["Enums"]["partner_type"];
          website?: string | null;
        };
        Update: {
          balance?: number;
          city?: string | null;
          country_code?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          leads_count?: number;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          plan?: string;
          type?: Database["public"]["Enums"]["partner_type"];
          website?: string | null;
        };
        Relationships: [];
      };
      price_index: {
        Row: {
          avg_price_m2_rent: number | null;
          avg_price_m2_sale: number | null;
          city: string;
          country_code: string;
          id: string;
          neighborhood: string | null;
          period: string;
          source: string | null;
          transactions_count: number | null;
        };
        Insert: {
          avg_price_m2_rent?: number | null;
          avg_price_m2_sale?: number | null;
          city: string;
          country_code: string;
          id?: string;
          neighborhood?: string | null;
          period: string;
          source?: string | null;
          transactions_count?: number | null;
        };
        Update: {
          avg_price_m2_rent?: number | null;
          avg_price_m2_sale?: number | null;
          city?: string;
          country_code?: string;
          id?: string;
          neighborhood?: string | null;
          period?: string;
          source?: string | null;
          transactions_count?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          country_code: string;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_verified: boolean;
          kyc_status: Database["public"]["Enums"]["kyc_status"];
          last_seen_at: string | null;
          phone: string | null;
          preferred_currency: Database["public"]["Enums"]["currency_code"];
          preferred_language: Database["public"]["Enums"]["locale_code"];
          role: Database["public"]["Enums"]["user_role"];
          totp_secret: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          country_code?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_verified?: boolean;
          kyc_status?: Database["public"]["Enums"]["kyc_status"];
          last_seen_at?: string | null;
          phone?: string | null;
          preferred_currency?: Database["public"]["Enums"]["currency_code"];
          preferred_language?: Database["public"]["Enums"]["locale_code"];
          role?: Database["public"]["Enums"]["user_role"];
          totp_secret?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          country_code?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_verified?: boolean;
          kyc_status?: Database["public"]["Enums"]["kyc_status"];
          last_seen_at?: string | null;
          phone?: string | null;
          preferred_currency?: Database["public"]["Enums"]["currency_code"];
          preferred_language?: Database["public"]["Enums"]["locale_code"];
          role?: Database["public"]["Enums"]["user_role"];
          totp_secret?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          listing_id: string;
          moderator_id: string | null;
          reason: string;
          reporter_id: string;
          resolution: string | null;
          resolved_at: string | null;
          status: Database["public"]["Enums"]["report_status"];
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          listing_id: string;
          moderator_id?: string | null;
          reason: string;
          reporter_id: string;
          resolution?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          listing_id?: string;
          moderator_id?: string | null;
          reason?: string;
          reporter_id?: string;
          resolution?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
        };
        Relationships: [
          {
            foreignKeyName: "reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_moderator_id_fkey";
            columns: ["moderator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_searches: {
        Row: {
          alert_frequency: Database["public"]["Enums"]["alert_frequency"];
          created_at: string;
          criteria: Json;
          id: string;
          last_alert_at: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"];
          created_at?: string;
          criteria: Json;
          id?: string;
          last_alert_at?: string | null;
          name: string;
          user_id: string;
        };
        Update: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"];
          created_at?: string;
          criteria?: Json;
          id?: string;
          last_alert_at?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          description: string | null;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          description?: string | null;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          description?: string | null;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          auto_renew: boolean;
          created_at: string;
          expires_at: string | null;
          id: string;
          payment_method: string | null;
          plan: string;
          started_at: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          transaction_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auto_renew?: boolean;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          payment_method?: string | null;
          plan: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          transaction_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auto_renew?: boolean;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          payment_method?: string | null;
          plan?: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          transaction_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          completed_at: string | null;
          created_at: string;
          currency: Database["public"]["Enums"]["currency_code"];
          gateway: Database["public"]["Enums"]["payment_gateway"] | null;
          gateway_ref: string | null;
          gateway_response: Json | null;
          id: string;
          metadata: Json | null;
          status: Database["public"]["Enums"]["transaction_status"];
          type: Database["public"]["Enums"]["transaction_type"];
          user_id: string;
        };
        Insert: {
          amount: number;
          completed_at?: string | null;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          gateway?: Database["public"]["Enums"]["payment_gateway"] | null;
          gateway_ref?: string | null;
          gateway_response?: Json | null;
          id?: string;
          metadata?: Json | null;
          status?: Database["public"]["Enums"]["transaction_status"];
          type: Database["public"]["Enums"]["transaction_type"];
          user_id: string;
        };
        Update: {
          amount?: number;
          completed_at?: string | null;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          gateway?: Database["public"]["Enums"]["payment_gateway"] | null;
          gateway_ref?: string | null;
          gateway_response?: Json | null;
          id?: string;
          metadata?: Json | null;
          status?: Database["public"]["Enums"]["transaction_status"];
          type?: Database["public"]["Enums"]["transaction_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_listing_view: {
        Args: { listing_id: string };
        Returns: undefined;
      };
      is_admin: { Args: { _uid: string }; Returns: boolean };
      log_audit_event: {
        Args: {
          p_action: string;
          p_after_data: Json | null;
          p_before_data: Json | null;
          p_target_id: string | null;
          p_target_type: string;
        };
        Returns: string;
      };
      search_listings: {
        Args: { filters: Json };
        Returns: Database["public"]["Tables"]["listings"]["Row"][];
      };
    };
    Enums: {
      ad_slot:
        | "home_hero"
        | "listing_top"
        | "listing_sidebar"
        | "search_inline";
      alert_frequency: "instant" | "daily" | "weekly" | "never";
      boost_type:
        | "top_list"
        | "highlight"
        | "refresh"
        | "coup_de_coeur"
        | "urgent"
        | "exclusif";
      conversation_status: "active" | "archived" | "blocked";
      currency_code: "TND" | "EUR" | "USD" | "MAD" | "DZD";
      kyc_status: "none" | "pending" | "verified" | "rejected";
      lead_status: "pending" | "sent" | "accepted" | "rejected" | "converted";
      lead_type: "credit" | "insurance" | "notary" | "diagnostic" | "mover";
      listing_category:
        | "apartment"
        | "villa"
        | "house"
        | "land"
        | "office"
        | "shop"
        | "parking"
        | "other";
      listing_pack: "free" | "essential" | "comfort" | "premium";
      listing_status:
        | "draft"
        | "pending"
        | "active"
        | "sold"
        | "rented"
        | "expired"
        | "rejected";
      listing_type: "sale" | "rent";
      locale_code: "fr" | "ar" | "en";
      partner_type:
        | "bank"
        | "notary"
        | "insurer"
        | "mover"
        | "diagnostician"
        | "photographer";
      payment_gateway: "konnect" | "paymee" | "d17" | "stripe";
      report_status: "open" | "reviewing" | "resolved" | "rejected";
      subscription_status: "active" | "cancelled" | "expired" | "pending";
      transaction_status: "pending" | "completed" | "failed" | "refunded";
      transaction_type: "subscription" | "boost" | "service" | "lead" | "ad";
      user_role: "user" | "admin" | "moderator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  Name extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[Name] extends {
  Row: infer R;
}
  ? R
  : never;

export type TablesInsert<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name] extends { Insert: infer I } ? I : never;

export type TablesUpdate<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name] extends { Update: infer U } ? U : never;

export type Enums<Name extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][Name];
