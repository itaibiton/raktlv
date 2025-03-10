export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          air_conditioner: boolean | null;
          balcony: boolean | null;
          bedrooms: number | null;
          condition: Database["public"]["Enums"]["property_condition"];
          contact_email: string | null;
          contact_full_name: string | null;
          contact_phone: string | null;
          description: string | null;
          disabled_access: boolean | null;
          elevator: boolean | null;
          entry_date_from: string | null;
          entry_date_to: string | null;
          floor: number | null;
          latitude: number | null;
          longitude: number | null;
          mapbox_data: Json | null;
          parking: boolean | null;
          pet_friendly: boolean | null;
          photos: string[] | null;
          place_name: string | null;
          price: number | null;
          property_id: number;
          protected_space: boolean | null;
          square_feet: number | null;
          title: string;
          type: Database["public"]["Enums"]["property_type"];
          user_id: string;
          warehouse: boolean | null;
        };
        Insert: {
          air_conditioner?: boolean | null;
          balcony?: boolean | null;
          bedrooms?: number | null;
          condition: Database["public"]["Enums"]["property_condition"];
          contact_email?: string | null;
          contact_full_name?: string | null;
          contact_phone?: string | null;
          description?: string | null;
          disabled_access?: boolean | null;
          elevator?: boolean | null;
          entry_date_from?: string | null;
          entry_date_to?: string | null;
          floor?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          mapbox_data?: Json | null;
          parking?: boolean | null;
          pet_friendly?: boolean | null;
          photos?: string[] | null;
          place_name?: string | null;
          price?: number | null;
          property_id?: number;
          protected_space?: boolean | null;
          square_feet?: number | null;
          title: string;
          type: Database["public"]["Enums"]["property_type"];
          user_id: string;
          warehouse?: boolean | null;
        };
        Update: {
          air_conditioner?: boolean | null;
          balcony?: boolean | null;
          bedrooms?: number | null;
          condition?: Database["public"]["Enums"]["property_condition"];
          contact_email?: string | null;
          contact_full_name?: string | null;
          contact_phone?: string | null;
          description?: string | null;
          disabled_access?: boolean | null;
          elevator?: boolean | null;
          entry_date_from?: string | null;
          entry_date_to?: string | null;
          floor?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          mapbox_data?: Json | null;
          parking?: boolean | null;
          pet_friendly?: boolean | null;
          photos?: string[] | null;
          place_name?: string | null;
          price?: number | null;
          property_id?: number;
          protected_space?: boolean | null;
          square_feet?: number | null;
          title?: string;
          type?: Database["public"]["Enums"]["property_type"];
          user_id?: string;
          warehouse?: boolean | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      property_condition: "new" | "used";
      property_type: "rental" | "sublet" | "for sale";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
