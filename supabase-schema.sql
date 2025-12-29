-- ============================================================
-- CalGeo Database Schema
-- Run this in Supabase SQL Editor to set up your database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends auth.users with app-specific data)
-- ============================================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'expert')),
  scan_count INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', NULL)),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CALCULATION HISTORY TABLE
-- ============================================================
CREATE TABLE public.calculation_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gold', 'jade')),

  -- JSON column to store all calculation inputs
  inputs JSONB NOT NULL,

  -- JSON column to store calculation results
  results JSONB NOT NULL,

  -- Optional metadata
  notes TEXT,
  favorited BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX calculation_history_user_id_idx ON public.calculation_history(user_id);
CREATE INDEX calculation_history_created_at_idx ON public.calculation_history(created_at DESC);

-- ============================================================
-- SHOPPING COMPARISONS TABLE
-- ============================================================
CREATE TABLE public.shopping_comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  shop_address TEXT,
  shop_rating NUMERIC(2,1),

  -- JSON array of items being compared
  items JSONB NOT NULL DEFAULT '[]'::jsonb,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX shopping_comparisons_user_id_idx ON public.shopping_comparisons(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_comparisons ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Calculation history policies
CREATE POLICY "Users can view their own history"
  ON public.calculation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
  ON public.calculation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history"
  ON public.calculation_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON public.calculation_history FOR DELETE
  USING (auth.uid() = user_id);

-- Shopping comparisons policies
CREATE POLICY "Users can view their own comparisons"
  ON public.shopping_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons"
  ON public.shopping_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
  ON public.shopping_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON public.shopping_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for shopping_comparisons table
CREATE TRIGGER update_shopping_comparisons_updated_at
  BEFORE UPDATE ON public.shopping_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile when auth.users entry is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.calculation_history TO authenticated;
GRANT ALL ON public.shopping_comparisons TO authenticated;

-- Grant access to sequences (for auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
-- Your database is now ready for CalGeo
--
-- Next steps:
-- 1. Enable Email Auth in Supabase Dashboard → Authentication → Providers
-- 2. Configure email templates if needed
-- 3. Test signup/login in your app
-- ============================================================
