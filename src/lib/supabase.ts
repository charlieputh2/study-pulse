import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
const validateEnv = () => {
  const requiredVars = {
    'VITE_SUPABASE_URL': supabaseUrl,
    'VITE_SUPABASE_ANON_KEY': supabaseAnonKey
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Initialize Supabase client
try {
  validateEnv();
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          base_price: number;
          discount_price: number | null;
          discount_start_date: string | null;
          discount_end_date: string | null;
          discount_active: boolean;
          purity_percentage: number;
          molecular_weight: string | null;
          cas_number: string | null;
          sequence: string | null;
          storage_conditions: string;
          inclusions: string[] | null;
          stock_quantity: number;
          available: boolean;
          featured: boolean;
          image_url: string | null;
          safety_sheet_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: string;
          base_price: number;
          discount_price?: number | null;
          discount_start_date?: string | null;
          discount_end_date?: string | null;
          discount_active?: boolean;
          purity_percentage?: number;
          molecular_weight?: string | null;
          cas_number?: string | null;
          sequence?: string | null;
          storage_conditions?: string;
          inclusions?: string[] | null;
          stock_quantity?: number;
          available?: boolean;
          featured?: boolean;
          image_url?: string | null;
          safety_sheet_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          base_price?: number;
          discount_price?: number | null;
          discount_start_date?: string | null;
          discount_end_date?: string | null;
          discount_active?: boolean;
          purity_percentage?: number;
          molecular_weight?: string | null;
          cas_number?: string | null;
          sequence?: string | null;
          storage_conditions?: string;
          inclusions?: string[] | null;
          stock_quantity?: number;
          available?: boolean;
          featured?: boolean;
          image_url?: string | null;
          safety_sheet_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variations: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          quantity_mg: number;
          price: number;
          stock_quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          quantity_mg: number;
          price: number;
          stock_quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          quantity_mg?: number;
          price?: number;
          stock_quantity?: number;
          created_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          name: string;
          account_number: string;
          account_name: string;
          qr_code_url: string;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          account_number: string;
          account_name: string;
          qr_code_url: string;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          account_number?: string;
          account_name?: string;
          qr_code_url?: string;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          value: string;
          type: string;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          value: string;
          type?: string;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          value?: string;
          type?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_barangay: string;
          shipping_city: string;
          shipping_state: string;
          shipping_zip_code: string;
          order_items: any[];
          total_price: number;
          shipping_fee: number;
          shipping_location: string;
          courier: string;
          is_cod: boolean;
          courier_fee: number;
          payment_method_id: string | null;
          payment_method_name: string | null;
          payment_proof_url: string | null;
          contact_method: string | null;
          notes: string | null;
          order_status: string;
          payment_status: string;
          promo_code_id: string | null;
          promo_code: string | null;
          discount_applied: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_barangay: string;
          shipping_city: string;
          shipping_state: string;
          shipping_zip_code: string;
          order_items: any[];
          total_price: number;
          shipping_fee: number;
          shipping_location: string;
          courier: string;
          is_cod: boolean;
          courier_fee: number;
          payment_method_id?: string | null;
          payment_method_name?: string | null;
          payment_proof_url?: string | null;
          contact_method?: string | null;
          notes?: string | null;
          order_status?: string;
          payment_status?: string;
          promo_code_id?: string | null;
          promo_code?: string | null;
          discount_applied?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          shipping_barangay?: string;
          shipping_city?: string;
          shipping_state?: string;
          shipping_zip_code?: string;
          order_items?: any[];
          total_price?: number;
          shipping_fee?: number;
          shipping_location?: string;
          courier?: string;
          is_cod?: boolean;
          courier_fee?: number;
          payment_method_id?: string | null;
          payment_method_name?: string | null;
          payment_proof_url?: string | null;
          contact_method?: string | null;
          notes?: string | null;
          order_status?: string;
          payment_status?: string;
          promo_code_id?: string | null;
          promo_code?: string | null;
          discount_applied?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          first_name: string;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          first_name: string;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          first_name?: string;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
