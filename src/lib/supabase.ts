import { createClient } from '@supabase/supabase-js';

// These should be configured in the AI Studio Secrets or .env
// We strip out any invisible invalid characters (like non-ISO-8859-1 code points)
// that sometimes get copied from the Supabase dashboard into Vercel.
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/[^\x20-\x7E]/g, '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/[^\x20-\x7E]/g, '').trim();

// Fallbacks to prevent instant crash on blank screen, 
// so the Login/Signup pages can show the "Missing Config" error instead.
const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey ? rawKey : 'placeholder_anon_key';

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
