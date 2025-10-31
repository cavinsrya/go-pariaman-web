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
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: number
          product_id: number
        }
        Insert: {
          category_id: number
          product_id: number
        }
        Update: {
          category_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          created_at: string
          id: number
          media_path: string
          media_type: string
          product_id: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          media_path: string
          media_type?: string
          product_id: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          media_path?: string
          media_type?: string
          product_id?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          body: string | null
          created_at: string
          id: number
          is_published: boolean
          job_title: string | null
          product_id: number
          rating: number
          reviewer_name: string
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          is_published?: boolean
          job_title?: string | null
          product_id: number
          rating: number
          reviewer_name: string
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          is_published?: boolean
          job_title?: string | null
          product_id?: number
          rating?: number
          reviewer_name?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          id: number
          product_id: number
          viewed_at: string
        }
        Insert: {
          id?: number
          product_id: number
          viewed_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_published: boolean
          price: number
          slug: string
          store_id: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_published?: boolean
          price?: number
          slug: string
          store_id: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_published?: boolean
          price?: number
          slug?: string
          store_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_social_links: {
        Row: {
          created_at: string
          id: number
          is_enabled: boolean
          platform: string
          store_id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_enabled?: boolean
          platform: string
          store_id: number
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          is_enabled?: boolean
          platform?: string
          store_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_social_links_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          district_id: number | null
          id: number
          is_published: boolean
          logo_url: string | null
          name: string | null
          owner_user_id: string
          phone: string | null
          slug: string
          sub_district_id: number | null
          updated_at: string
          village_id: number | null
        }
        Insert: {
          address?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          district_id?: number | null
          id?: number
          is_published?: boolean
          logo_url?: string | null
          name?: string | null
          owner_user_id: string
          phone?: string | null
          slug: string
          sub_district_id?: number | null
          updated_at?: string
          village_id?: number | null
        }
        Update: {
          address?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          district_id?: number | null
          id?: number
          is_published?: boolean
          logo_url?: string | null
          name?: string | null
          owner_user_id?: string
          phone?: string | null
          slug?: string
          sub_district_id?: number | null
          updated_at?: string
          village_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_sub_district_id_fkey"
            columns: ["sub_district_id"]
            isOneToOne: false
            referencedRelation: "sub_districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_districts: {
        Row: {
          district_id: number
          id: number
          name: string
        }
        Insert: {
          district_id: number
          id?: number
          name: string
        }
        Update: {
          district_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_districts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      villages: {
        Row: {
          created_at: string
          id: number
          name: string
          sub_district_id: number
          type: Database["public"]["Enums"]["village_type"]
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          sub_district_id: number
          type?: Database["public"]["Enums"]["village_type"]
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          sub_district_id?: number
          type?: Database["public"]["Enums"]["village_type"]
        }
        Relationships: [
          {
            foreignKeyName: "villages_kecamatan_id_fkey"
            columns: ["sub_district_id"]
            isOneToOne: false
            referencedRelation: "sub_districts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_product_views_analytics: {
        Args: {
          p_group_by?: string
          p_product_id?: number
          p_start_date?: string
          p_store_id: number
        }
        Returns: {
          count: number
          product_title: string
          view_date: string
        }[]
      }
      increment_product_view: {
        Args: { product_id_to_increment: number }
        Returns: undefined
      }
    }
    Enums: {
      village_type: "desa" | "kelurahan"
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
      village_type: ["desa", "kelurahan"],
    },
  },
} as const
