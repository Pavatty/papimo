export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
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
      amenities: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          icon_name: string | null;
          id: string;
          is_active: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar?: string;
          label_en?: string;
          label_fr?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
      availability_calendars: {
        Row: {
          available: boolean;
          created_at: string;
          date: string;
          id: string;
          listing_id: string;
          min_nights_override: number | null;
          price_override: number | null;
        };
        Insert: {
          available?: boolean;
          created_at?: string;
          date: string;
          id?: string;
          listing_id: string;
          min_nights_override?: number | null;
          price_override?: number | null;
        };
        Update: {
          available?: boolean;
          created_at?: string;
          date?: string;
          id?: string;
          listing_id?: string;
          min_nights_override?: number | null;
          price_override?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "availability_calendars_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      booking_payments: {
        Row: {
          amount: number;
          booking_id: string;
          created_at: string;
          currency: string;
          id: string;
          paid_at: string | null;
          payment_intent_id: string | null;
          payment_method: string;
          refunded_at: string | null;
          status: string;
        };
        Insert: {
          amount: number;
          booking_id: string;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          payment_intent_id?: string | null;
          payment_method: string;
          refunded_at?: string | null;
          status?: string;
        };
        Update: {
          amount?: number;
          booking_id?: string;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          payment_intent_id?: string | null;
          payment_method?: string;
          refunded_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          base_price: number;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          check_in_date: string;
          check_out_date: string;
          created_at: string;
          currency: string;
          guest_id: string;
          host_id: string;
          id: string;
          listing_id: string;
          num_guests: number;
          payment_intent_id: string | null;
          payment_status: string | null;
          service_fee: number;
          status: string;
          total_price: number;
          updated_at: string;
        };
        Insert: {
          base_price: number;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          check_in_date: string;
          check_out_date: string;
          created_at?: string;
          currency?: string;
          guest_id: string;
          host_id: string;
          id?: string;
          listing_id: string;
          num_guests: number;
          payment_intent_id?: string | null;
          payment_status?: string | null;
          service_fee: number;
          status?: string;
          total_price: number;
          updated_at?: string;
        };
        Update: {
          base_price?: number;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          check_in_date?: string;
          check_out_date?: string;
          created_at?: string;
          currency?: string;
          guest_id?: string;
          host_id?: string;
          id?: string;
          listing_id?: string;
          num_guests?: number;
          payment_intent_id?: string | null;
          payment_status?: string | null;
          service_fee?: number;
          status?: string;
          total_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
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
      cms_home_sections: {
        Row: {
          active: boolean;
          content_json: Json;
          created_at: string;
          id: string;
          section_key: string;
          section_type: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          content_json?: Json;
          created_at?: string;
          id?: string;
          section_key: string;
          section_type: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          content_json?: Json;
          created_at?: string;
          id?: string;
          section_key?: string;
          section_type?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
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
      feature_flags: {
        Row: {
          description: string | null;
          enabled: boolean;
          key: string;
          rollout_pct: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          description?: string | null;
          enabled?: boolean;
          key: string;
          rollout_pct?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          description?: string | null;
          enabled?: boolean;
          key?: string;
          rollout_pct?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feature_flags_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      geo_cities: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          label_ar: string | null;
          label_en: string | null;
          label_fr: string;
          latitude: number | null;
          longitude: number | null;
          region_id: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar?: string | null;
          label_en?: string | null;
          label_fr: string;
          latitude?: number | null;
          longitude?: number | null;
          region_id: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar?: string | null;
          label_en?: string | null;
          label_fr?: string;
          latitude?: number | null;
          longitude?: number | null;
          region_id?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "geo_cities_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "geo_regions";
            referencedColumns: ["id"];
          },
        ];
      };
      geo_countries: {
        Row: {
          code: string;
          created_at: string;
          flag_emoji: string | null;
          id: string;
          is_active: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          level1_label_fr: string;
          level2_label_fr: string | null;
          level3_label_fr: string | null;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          flag_emoji?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          level1_label_fr: string;
          level2_label_fr?: string | null;
          level3_label_fr?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          flag_emoji?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar?: string;
          label_en?: string;
          label_fr?: string;
          level1_label_fr?: string;
          level2_label_fr?: string | null;
          level3_label_fr?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      geo_regions: {
        Row: {
          code: string;
          country_id: string;
          created_at: string;
          id: string;
          is_active: boolean;
          label_ar: string | null;
          label_en: string | null;
          label_fr: string;
          level: number;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          country_id: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar?: string | null;
          label_en?: string | null;
          label_fr: string;
          level?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          country_id?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar?: string | null;
          label_en?: string | null;
          label_fr?: string;
          level?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "geo_regions_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "geo_countries";
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
          amenities: string[] | null;
          base_price_per_night: number | null;
          bathrooms: number | null;
          bedrooms: number | null;
          cancellation_policy: string | null;
          category: Database["public"]["Enums"]["listing_category"];
          check_in_time: string | null;
          check_out_time: string | null;
          city: string;
          condition: string | null;
          construction_year: number | null;
          contacts_count: number;
          country: string;
          country_code: string;
          created_at: string;
          currency: Database["public"]["Enums"]["currency_code"];
          description: string | null;
          dpe_rating: string | null;
          expires_at: string | null;
          favorites_count: number;
          floor: number | null;
          furnished_level: string | null;
          governorate: string | null;
          heating_type: string | null;
          house_rules: string | null;
          id: string;
          instant_booking: boolean | null;
          latitude: number | null;
          location: unknown;
          longitude: number | null;
          main_photo: string | null;
          max_guests: number | null;
          max_nights: number | null;
          min_nights: number | null;
          neighborhood: string | null;
          orientation: string | null;
          owner_id: string;
          pack: Database["public"]["Enums"]["listing_pack"];
          pack_type: string;
          photos: string[] | null;
          price: number;
          price_currency: string;
          property_type: string;
          published_at: string | null;
          region: string | null;
          rental_type: string | null;
          rooms: number | null;
          rooms_total: number | null;
          search_vector: unknown;
          slug: string | null;
          status: Database["public"]["Enums"]["listing_status"];
          surface_area: number | null;
          surface_m2: number | null;
          title: string;
          total_floors: number | null;
          transaction_type: string;
          type: Database["public"]["Enums"]["listing_type"];
          updated_at: string;
          video_url: string | null;
          view_count: number;
          views_count: number;
          virtual_tour_url: string | null;
          year_built: number | null;
        };
        Insert: {
          address?: string | null;
          amenities?: string[] | null;
          base_price_per_night?: number | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          cancellation_policy?: string | null;
          category: Database["public"]["Enums"]["listing_category"];
          check_in_time?: string | null;
          check_out_time?: string | null;
          city: string;
          condition?: string | null;
          construction_year?: number | null;
          contacts_count?: number;
          country?: string;
          country_code?: string;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string | null;
          dpe_rating?: string | null;
          expires_at?: string | null;
          favorites_count?: number;
          floor?: number | null;
          furnished_level?: string | null;
          governorate?: string | null;
          heating_type?: string | null;
          house_rules?: string | null;
          id?: string;
          instant_booking?: boolean | null;
          latitude?: number | null;
          location?: unknown;
          longitude?: number | null;
          main_photo?: string | null;
          max_guests?: number | null;
          max_nights?: number | null;
          min_nights?: number | null;
          neighborhood?: string | null;
          orientation?: string | null;
          owner_id: string;
          pack?: Database["public"]["Enums"]["listing_pack"];
          pack_type?: string;
          photos?: string[] | null;
          price: number;
          price_currency?: string;
          property_type?: string;
          published_at?: string | null;
          region?: string | null;
          rental_type?: string | null;
          rooms?: number | null;
          rooms_total?: number | null;
          search_vector?: unknown;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          surface_area?: number | null;
          surface_m2?: number | null;
          title: string;
          total_floors?: number | null;
          transaction_type?: string;
          type: Database["public"]["Enums"]["listing_type"];
          updated_at?: string;
          video_url?: string | null;
          view_count?: number;
          views_count?: number;
          virtual_tour_url?: string | null;
          year_built?: number | null;
        };
        Update: {
          address?: string | null;
          amenities?: string[] | null;
          base_price_per_night?: number | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          cancellation_policy?: string | null;
          category?: Database["public"]["Enums"]["listing_category"];
          check_in_time?: string | null;
          check_out_time?: string | null;
          city?: string;
          condition?: string | null;
          construction_year?: number | null;
          contacts_count?: number;
          country?: string;
          country_code?: string;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string | null;
          dpe_rating?: string | null;
          expires_at?: string | null;
          favorites_count?: number;
          floor?: number | null;
          furnished_level?: string | null;
          governorate?: string | null;
          heating_type?: string | null;
          house_rules?: string | null;
          id?: string;
          instant_booking?: boolean | null;
          latitude?: number | null;
          location?: unknown;
          longitude?: number | null;
          main_photo?: string | null;
          max_guests?: number | null;
          max_nights?: number | null;
          min_nights?: number | null;
          neighborhood?: string | null;
          orientation?: string | null;
          owner_id?: string;
          pack?: Database["public"]["Enums"]["listing_pack"];
          pack_type?: string;
          photos?: string[] | null;
          price?: number;
          price_currency?: string;
          property_type?: string;
          published_at?: string | null;
          region?: string | null;
          rental_type?: string | null;
          rooms?: number | null;
          rooms_total?: number | null;
          search_vector?: unknown;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          surface_area?: number | null;
          surface_m2?: number | null;
          title?: string;
          total_floors?: number | null;
          transaction_type?: string;
          type?: Database["public"]["Enums"]["listing_type"];
          updated_at?: string;
          video_url?: string | null;
          view_count?: number;
          views_count?: number;
          virtual_tour_url?: string | null;
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
      moderation_logs: {
        Row: {
          ai_raw_response: string | null;
          ai_score: number | null;
          created_at: string;
          decision: string;
          id: string;
          listing_id: string;
          reasons: Json;
          source: string;
          user_id: string;
        };
        Insert: {
          ai_raw_response?: string | null;
          ai_score?: number | null;
          created_at?: string;
          decision: string;
          id?: string;
          listing_id: string;
          reasons?: Json;
          source?: string;
          user_id: string;
        };
        Update: {
          ai_raw_response?: string | null;
          ai_score?: number | null;
          created_at?: string;
          decision?: string;
          id?: string;
          listing_id?: string;
          reasons?: Json;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "moderation_logs_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
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
      pricing_packs: {
        Row: {
          active_days: number;
          code: string;
          created_at: string;
          features: Json;
          id: string;
          is_active: boolean;
          is_recommended: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          max_active_listings: number;
          max_photos_per_listing: number;
          price_monthly_tnd: number;
          price_yearly_tnd: number;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active_days?: number;
          code: string;
          created_at?: string;
          features?: Json;
          id?: string;
          is_active?: boolean;
          is_recommended?: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          max_active_listings?: number;
          max_photos_per_listing?: number;
          price_monthly_tnd?: number;
          price_yearly_tnd?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active_days?: number;
          code?: string;
          created_at?: string;
          features?: Json;
          id?: string;
          is_active?: boolean;
          is_recommended?: boolean;
          label_ar?: string;
          label_en?: string;
          label_fr?: string;
          max_active_listings?: number;
          max_photos_per_listing?: number;
          price_monthly_tnd?: number;
          price_yearly_tnd?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pricing_rules: {
        Row: {
          created_at: string;
          discount_percent: number | null;
          end_date: string | null;
          id: string;
          listing_id: string;
          min_nights: number | null;
          price_increase_percent: number | null;
          rule_type: string;
          start_date: string | null;
        };
        Insert: {
          created_at?: string;
          discount_percent?: number | null;
          end_date?: string | null;
          id?: string;
          listing_id: string;
          min_nights?: number | null;
          price_increase_percent?: number | null;
          rule_type: string;
          start_date?: string | null;
        };
        Update: {
          created_at?: string;
          discount_percent?: number | null;
          end_date?: string | null;
          id?: string;
          listing_id?: string;
          min_nights?: number | null;
          price_increase_percent?: number | null;
          rule_type?: string;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pricing_rules_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          account_type: string;
          avatar_url: string | null;
          bio: string | null;
          company_name: string | null;
          country_code: string;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_verified: boolean;
          kyc_status: Database["public"]["Enums"]["kyc_status"];
          last_seen_at: string | null;
          member_since: string;
          notifications_email: boolean;
          notifications_push: boolean;
          phone: string | null;
          preferred_currency: Database["public"]["Enums"]["currency_code"];
          preferred_language: Database["public"]["Enums"]["locale_code"];
          pro_address: string | null;
          pro_rib: string | null;
          role: Database["public"]["Enums"]["user_role"];
          sector: string | null;
          tax_id: string | null;
          totp_secret: string | null;
          updated_at: string;
          verified_email: boolean;
          verified_phone: boolean;
        };
        Insert: {
          account_type?: string;
          avatar_url?: string | null;
          bio?: string | null;
          company_name?: string | null;
          country_code?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_verified?: boolean;
          kyc_status?: Database["public"]["Enums"]["kyc_status"];
          last_seen_at?: string | null;
          member_since?: string;
          notifications_email?: boolean;
          notifications_push?: boolean;
          phone?: string | null;
          preferred_currency?: Database["public"]["Enums"]["currency_code"];
          preferred_language?: Database["public"]["Enums"]["locale_code"];
          pro_address?: string | null;
          pro_rib?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          sector?: string | null;
          tax_id?: string | null;
          totp_secret?: string | null;
          updated_at?: string;
          verified_email?: boolean;
          verified_phone?: boolean;
        };
        Update: {
          account_type?: string;
          avatar_url?: string | null;
          bio?: string | null;
          company_name?: string | null;
          country_code?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_verified?: boolean;
          kyc_status?: Database["public"]["Enums"]["kyc_status"];
          last_seen_at?: string | null;
          member_since?: string;
          notifications_email?: boolean;
          notifications_push?: boolean;
          phone?: string | null;
          preferred_currency?: Database["public"]["Enums"]["currency_code"];
          preferred_language?: Database["public"]["Enums"]["locale_code"];
          pro_address?: string | null;
          pro_rib?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          sector?: string | null;
          tax_id?: string | null;
          totp_secret?: string | null;
          updated_at?: string;
          verified_email?: boolean;
          verified_phone?: boolean;
        };
        Relationships: [];
      };
      property_types: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          icon_name: string | null;
          id: string;
          is_active: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category?: string;
          code: string;
          created_at?: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          label_ar?: string;
          label_en?: string;
          label_fr?: string;
          sort_order?: number;
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
      reviews: {
        Row: {
          accuracy_rating: number | null;
          booking_id: string;
          cleanliness_rating: number | null;
          comment: string | null;
          communication_rating: number | null;
          created_at: string;
          id: string;
          listing_id: string;
          location_rating: number | null;
          private_feedback: string | null;
          rating: number;
          response: string | null;
          response_at: string | null;
          review_type: string;
          reviewee_id: string;
          reviewer_id: string;
          value_rating: number | null;
        };
        Insert: {
          accuracy_rating?: number | null;
          booking_id: string;
          cleanliness_rating?: number | null;
          comment?: string | null;
          communication_rating?: number | null;
          created_at?: string;
          id?: string;
          listing_id: string;
          location_rating?: number | null;
          private_feedback?: string | null;
          rating: number;
          response?: string | null;
          response_at?: string | null;
          review_type: string;
          reviewee_id: string;
          reviewer_id: string;
          value_rating?: number | null;
        };
        Update: {
          accuracy_rating?: number | null;
          booking_id?: string;
          cleanliness_rating?: number | null;
          comment?: string | null;
          communication_rating?: number | null;
          created_at?: string;
          id?: string;
          listing_id?: string;
          location_rating?: number | null;
          private_feedback?: string | null;
          rating?: number;
          response?: string | null;
          response_at?: string | null;
          review_type?: string;
          reviewee_id?: string;
          reviewer_id?: string;
          value_rating?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
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
      spatial_ref_sys: {
        Row: {
          auth_name: string | null;
          auth_srid: number | null;
          proj4text: string | null;
          srid: number;
          srtext: string | null;
        };
        Insert: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid: number;
          srtext?: string | null;
        };
        Update: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid?: number;
          srtext?: string | null;
        };
        Relationships: [];
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
      transaction_types: {
        Row: {
          badge_color: string;
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          badge_color?: string;
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar: string;
          label_en: string;
          label_fr: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          badge_color?: string;
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label_ar?: string;
          label_en?: string;
          label_fr?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
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
      user_rate_limits: {
        Row: {
          day: string;
          last_publish_at: string | null;
          publish_count: number;
          user_id: string;
        };
        Insert: {
          day?: string;
          last_publish_at?: string | null;
          publish_count?: number;
          user_id: string;
        };
        Update: {
          day?: string;
          last_publish_at?: string | null;
          publish_count?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      verification_documents: {
        Row: {
          created_at: string;
          document_type: string;
          document_url: string;
          id: string;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_type: string;
          document_url: string;
          id?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          document_type?: string;
          document_url?: string;
          id?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null;
          f_geography_column: unknown;
          f_table_catalog: unknown;
          f_table_name: unknown;
          f_table_schema: unknown;
          srid: number | null;
          type: string | null;
        };
        Relationships: [];
      };
      geometry_columns: {
        Row: {
          coord_dimension: number | null;
          f_geometry_column: unknown;
          f_table_catalog: string | null;
          f_table_name: unknown;
          f_table_schema: unknown;
          srid: number | null;
          type: string | null;
        };
        Insert: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown;
          f_table_catalog?: string | null;
          f_table_name?: unknown;
          f_table_schema?: unknown;
          srid?: number | null;
          type?: string | null;
        };
        Update: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown;
          f_table_catalog?: string | null;
          f_table_name?: unknown;
          f_table_schema?: unknown;
          srid?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string };
        Returns: undefined;
      };
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown };
        Returns: unknown;
      };
      _postgis_pgsql_version: { Args: never; Returns: string };
      _postgis_scripts_pgsql_version: { Args: never; Returns: string };
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown };
        Returns: number;
      };
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown };
        Returns: string;
      };
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_sortablehash: { Args: { geom: unknown }; Returns: number };
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_voronoi: {
        Args: {
          clip?: unknown;
          g1: unknown;
          return_polygons?: boolean;
          tolerance?: number;
        };
        Returns: unknown;
      };
      _st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      addauth: { Args: { "": string }; Returns: boolean };
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string;
              column_name: string;
              new_dim: number;
              new_srid_in: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          };
      admin_stats: { Args: never; Returns: Json };
      disablelongtransactions: { Args: never; Returns: string };
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string;
              column_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          }
        | {
            Args: {
              column_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          }
        | {
            Args: { column_name: string; table_name: string };
            Returns: string;
          };
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string };
      enablelongtransactions: { Args: never; Returns: string };
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      geometry: { Args: { "": string }; Returns: unknown };
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geomfromewkt: { Args: { "": string }; Returns: unknown };
      gettransactionid: { Args: never; Returns: unknown };
      increment_listing_view: {
        Args: { listing_id: string };
        Returns: undefined;
      };
      is_admin: { Args: { _uid: string }; Returns: boolean };
      log_audit_event: {
        Args: {
          p_action: string;
          p_after_data: Json;
          p_before_data: Json;
          p_target_id: string;
          p_target_type: string;
        };
        Returns: string;
      };
      longtransactionsenabled: { Args: never; Returns: boolean };
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string };
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: string;
      };
      postgis_extensions_upgrade: { Args: never; Returns: string };
      postgis_full_version: { Args: never; Returns: string };
      postgis_geos_version: { Args: never; Returns: string };
      postgis_lib_build_date: { Args: never; Returns: string };
      postgis_lib_revision: { Args: never; Returns: string };
      postgis_lib_version: { Args: never; Returns: string };
      postgis_libjson_version: { Args: never; Returns: string };
      postgis_liblwgeom_version: { Args: never; Returns: string };
      postgis_libprotobuf_version: { Args: never; Returns: string };
      postgis_libxml_version: { Args: never; Returns: string };
      postgis_proj_version: { Args: never; Returns: string };
      postgis_scripts_build_date: { Args: never; Returns: string };
      postgis_scripts_installed: { Args: never; Returns: string };
      postgis_scripts_released: { Args: never; Returns: string };
      postgis_svn_version: { Args: never; Returns: string };
      postgis_type_name: {
        Args: {
          coord_dimension: number;
          geomname: string;
          use_new_name?: boolean;
        };
        Returns: string;
      };
      postgis_version: { Args: never; Returns: string };
      postgis_wagyu_version: { Args: never; Returns: string };
      search_listings: {
        Args: { filters?: Json };
        Returns: {
          amenities: string[];
          bathrooms: number;
          bedrooms: number;
          city: string;
          country: string;
          description: string;
          id: string;
          latitude: number;
          longitude: number;
          main_photo: string;
          neighborhood: string;
          owner_id: string;
          photos: string[];
          price: number;
          price_currency: string;
          property_type: string;
          published_at: string;
          region: string;
          rooms_total: number;
          slug: string;
          status: string;
          surface_area: number;
          title: string;
          total_count: number;
          transaction_type: string;
          view_count: number;
        }[];
      };
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown };
            Returns: number;
          };
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number };
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number };
        Returns: string;
      };
      st_asewkt: { Args: { "": string }; Returns: string };
      st_asgeojson:
        | {
            Args: {
              geog: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geom_column?: string;
              maxdecimaldigits?: number;
              pretty_bool?: boolean;
              r: Record<string, unknown>;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_asgml:
        | {
            Args: {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            };
            Returns: string;
          };
      st_askml:
        | {
            Args: {
              geog: unknown;
              maxdecimaldigits?: number;
              nprefix?: string;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              nprefix?: string;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string };
        Returns: string;
      };
      st_asmarc21: {
        Args: { format?: string; geom: unknown };
        Returns: string;
      };
      st_asmvtgeom: {
        Args: {
          bounds: unknown;
          buffer?: number;
          clip_geom?: boolean;
          extent?: number;
          geom: unknown;
        };
        Returns: unknown;
      };
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number };
            Returns: string;
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_astext: { Args: { "": string }; Returns: string };
      st_astwkb:
        | {
            Args: {
              geom: unknown;
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown[];
              ids: number[];
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            };
            Returns: string;
          };
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number };
        Returns: string;
      };
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number };
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown };
        Returns: unknown;
      };
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number };
            Returns: unknown;
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number };
            Returns: unknown;
          };
      st_centroid: { Args: { "": string }; Returns: unknown };
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown };
        Returns: unknown;
      };
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_collect: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean;
          param_geom: unknown;
          param_pctconvex: number;
        };
        Returns: unknown;
      };
      st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_coorddim: { Args: { geometry: unknown }; Returns: number };
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number };
        Returns: unknown;
      };
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean };
            Returns: number;
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number };
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number };
            Returns: number;
          };
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number };
            Returns: unknown;
          }
        | {
            Args: {
              dm?: number;
              dx: number;
              dy: number;
              dz?: number;
              geom: unknown;
            };
            Returns: unknown;
          };
      st_force3d: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number };
        Returns: unknown;
      };
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number };
        Returns: unknown;
      };
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number };
            Returns: unknown;
          };
      st_geogfromtext: { Args: { "": string }; Returns: unknown };
      st_geographyfromtext: { Args: { "": string }; Returns: unknown };
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string };
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown };
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean;
          g: unknown;
          max_iter?: number;
          tolerance?: number;
        };
        Returns: unknown;
      };
      st_geometryfromtext: { Args: { "": string }; Returns: unknown };
      st_geomfromewkt: { Args: { "": string }; Returns: unknown };
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown };
      st_geomfromgml: { Args: { "": string }; Returns: unknown };
      st_geomfromkml: { Args: { "": string }; Returns: unknown };
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown };
      st_geomfromtext: { Args: { "": string }; Returns: unknown };
      st_gmltosql: { Args: { "": string }; Returns: unknown };
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean };
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_hexagon: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_hexagongrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown };
        Returns: number;
      };
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown };
        Returns: Database["public"]["CompositeTypes"]["valid_detail"];
        SetofOptions: {
          from: "*";
          to: "valid_detail";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number };
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown };
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string };
        Returns: unknown;
      };
      st_linefromtext: { Args: { "": string }; Returns: unknown };
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown };
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number };
        Returns: unknown;
      };
      st_locatebetween: {
        Args: {
          frommeasure: number;
          geometry: unknown;
          leftrightoffset?: number;
          tomeasure: number;
        };
        Returns: unknown;
      };
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number };
        Returns: unknown;
      };
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makevalid: {
        Args: { geom: unknown; params: string };
        Returns: unknown;
      };
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number };
        Returns: unknown;
      };
      st_mlinefromtext: { Args: { "": string }; Returns: unknown };
      st_mpointfromtext: { Args: { "": string }; Returns: unknown };
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown };
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown };
      st_multipointfromtext: { Args: { "": string }; Returns: unknown };
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown };
      st_node: { Args: { g: unknown }; Returns: unknown };
      st_normalize: { Args: { geom: unknown }; Returns: unknown };
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string };
        Returns: unknown;
      };
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_pointfromtext: { Args: { "": string }; Returns: unknown };
      st_pointm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
        };
        Returns: unknown;
      };
      st_pointz: {
        Args: {
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_pointzm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_polyfromtext: { Args: { "": string }; Returns: unknown };
      st_polygonfromtext: { Args: { "": string }; Returns: unknown };
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown };
        Returns: unknown;
      };
      st_quantizecoordinates: {
        Args: {
          g: unknown;
          prec_m?: number;
          prec_x: number;
          prec_y?: number;
          prec_z?: number;
        };
        Returns: unknown;
      };
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number };
        Returns: unknown;
      };
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string };
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number };
        Returns: unknown;
      };
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown };
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number };
        Returns: unknown;
      };
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown };
      st_square: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_squaregrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number };
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number };
        Returns: unknown[];
      };
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown };
        Returns: unknown;
      };
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_tileenvelope: {
        Args: {
          bounds?: unknown;
          margin?: number;
          x: number;
          y: number;
          zoom: number;
        };
        Returns: unknown;
      };
      st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string };
            Returns: unknown;
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number };
            Returns: unknown;
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown };
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown };
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number };
            Returns: unknown;
          };
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown };
      st_wkttosql: { Args: { "": string }; Returns: unknown };
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number };
        Returns: unknown;
      };
      unlockrows: { Args: { "": string }; Returns: number };
      updategeometrysrid: {
        Args: {
          catalogn_name: string;
          column_name: string;
          new_srid_in: number;
          schema_name: string;
          table_name: string;
        };
        Returns: string;
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
      geometry_dump: {
        path: number[] | null;
        geom: unknown;
      };
      valid_detail: {
        valid: boolean | null;
        reason: string | null;
        location: unknown;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      ad_slot: ["home_hero", "listing_top", "listing_sidebar", "search_inline"],
      alert_frequency: ["instant", "daily", "weekly", "never"],
      boost_type: [
        "top_list",
        "highlight",
        "refresh",
        "coup_de_coeur",
        "urgent",
        "exclusif",
      ],
      conversation_status: ["active", "archived", "blocked"],
      currency_code: ["TND", "EUR", "USD", "MAD", "DZD"],
      kyc_status: ["none", "pending", "verified", "rejected"],
      lead_status: ["pending", "sent", "accepted", "rejected", "converted"],
      lead_type: ["credit", "insurance", "notary", "diagnostic", "mover"],
      listing_category: [
        "apartment",
        "villa",
        "house",
        "land",
        "office",
        "shop",
        "parking",
        "other",
      ],
      listing_pack: ["free", "essential", "comfort", "premium"],
      listing_status: [
        "draft",
        "pending",
        "active",
        "sold",
        "rented",
        "expired",
        "rejected",
      ],
      listing_type: ["sale", "rent"],
      locale_code: ["fr", "ar", "en"],
      partner_type: [
        "bank",
        "notary",
        "insurer",
        "mover",
        "diagnostician",
        "photographer",
      ],
      payment_gateway: ["konnect", "paymee", "d17", "stripe"],
      report_status: ["open", "reviewing", "resolved", "rejected"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      transaction_type: ["subscription", "boost", "service", "lead", "ad"],
      user_role: ["user", "admin", "moderator"],
    },
  },
} as const;
