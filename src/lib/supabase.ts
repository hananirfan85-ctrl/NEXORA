import { createClient } from '@supabase/supabase-js';

// These should be configured in the AI Studio Secrets or .env.example
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  created_at: string;
};

export type Sale = {
  id: string;
  user_id: string;
  total_amount: number;
  total_profit: number;
  created_at: string;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total_price: number;
  total_profit: number;
  created_at: string;
  product?: Product;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  action: string;
  description: string;
  created_at: string;
};
