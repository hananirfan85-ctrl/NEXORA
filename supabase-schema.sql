-- Run this entire script in your Supabase SQL Editor.
-- It will create the tables, enable RLS, set up policies, and create a helper function for processing sales.

-- 1. Create Tables (Using IF NOT EXISTS so it doesn't fail if you run it twice)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  unit_cost NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  total_profit NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (Safely dropping them first if they exist to avoid duplication errors)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;
  DROP POLICY IF EXISTS "Users can manage their own sales" ON public.sales;
  DROP POLICY IF EXISTS "Users can manage their own sale_items" ON public.sale_items;
  DROP POLICY IF EXISTS "Users can manage their own activity logs" ON public.activity_logs;
END $$;

CREATE POLICY "Users can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sales" ON public.sales
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sale_items" ON public.sale_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activity logs" ON public.activity_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Create an RPC (Remote Procedure Call) for atomic transaction when completing a POS sale
-- This ensures stock decreases correctly and logs are created safely in one database transaction.
CREATE OR REPLACE FUNCTION process_sale(
  p_user_id UUID,
  p_total_amount NUMERIC(10, 2),
  p_total_profit NUMERIC(10, 2),
  p_items JSONB
) RETURNS UUID AS $$
DECLARE
  v_sale_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_quantity INT;
  v_unit_price NUMERIC(10, 2);
  v_unit_cost NUMERIC(10, 2);
  v_total_price NUMERIC(10, 2);
  v_total_profit NUMERIC(10, 2);
  v_product_name TEXT;
BEGIN
  -- Insert the main sale record
  INSERT INTO public.sales (user_id, total_amount, total_profit)
  VALUES (p_user_id, p_total_amount, p_total_profit)
  RETURNING id INTO v_sale_id;

  -- Loop through items and insert them, while updating stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    v_unit_price := (v_item->>'unit_price')::NUMERIC;
    v_unit_cost := (v_item->>'unit_cost')::NUMERIC;
    v_total_price := (v_item->>'total_price')::NUMERIC;
    v_total_profit := (v_item->>'total_profit')::NUMERIC;

    -- Insert sale item
    INSERT INTO public.sale_items (sale_id, user_id, product_id, quantity, unit_price, unit_cost, total_price, total_profit)
    VALUES (v_sale_id, p_user_id, v_product_id, v_quantity, v_unit_price, v_unit_cost, v_total_price, v_total_profit);

    -- Update product stock
    UPDATE public.products
    SET stock = stock - v_quantity
    WHERE id = v_product_id AND user_id = p_user_id;

    -- Get product name for activity log
    SELECT name INTO v_product_name FROM public.products WHERE id = v_product_id;

    -- Alternatively, log item individually, but we'll log summary at the end.
  END LOOP;

  -- Create Activity Log
  INSERT INTO public.activity_logs (user_id, action, description)
  VALUES (p_user_id, 'SALE', 'Completed sale for PKR ' || p_total_amount || ' with ' || jsonb_array_length(p_items) || ' items.');

  RETURN v_sale_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
