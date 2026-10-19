-- GIG ECONOMY App - Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  type TEXT CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  client_id TEXT,
  platform TEXT,
  category_name TEXT,
  payment_method TEXT,
  date DATE DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS category_name TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
UPDATE public.transactions
SET client_id = id::TEXT
WHERE client_id IS NULL;
UPDATE public.transactions
SET updated_at = created_at
WHERE updated_at IS NULL;
ALTER TABLE public.transactions ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Savings Goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0,
  deadline DATE,
  frequency TEXT CHECK (frequency IN ('weekly', 'monthly', 'yearly', 'custom')),
  auto_save BOOLEAN DEFAULT false,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own savings goals"
  ON public.savings_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
  ON public.savings_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
  ON public.savings_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
  ON public.savings_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Tax Records table
CREATE TABLE IF NOT EXISTS public.tax_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)),
  total_income NUMERIC(12, 2) DEFAULT 0,
  total_deductions NUMERIC(12, 2) DEFAULT 0,
  estimated_tax NUMERIC(12, 2) DEFAULT 0,
  paid_tax NUMERIC(12, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue')),
  due_date DATE,
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tax records"
  ON public.tax_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax records"
  ON public.tax_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax records"
  ON public.tax_records FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tax preparation checklist progress is separate from calculated tax records.
CREATE TABLE IF NOT EXISTS public.tax_checklist_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_items JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT tax_checklist_progress_checked_items_object
    CHECK (jsonb_typeof(checked_items) = 'object')
);

ALTER TABLE public.tax_checklist_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tax checklist progress"
  ON public.tax_checklist_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tax checklist progress"
  ON public.tax_checklist_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tax checklist progress"
  ON public.tax_checklist_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tax checklist progress"
  ON public.tax_checklist_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Insurance Plans table
CREATE TABLE IF NOT EXISTS public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  client_id TEXT,
  plan_name TEXT NOT NULL,
  provider TEXT,
  type TEXT CHECK (type IN ('health', 'life', 'disability', 'other')),
  premium_amount NUMERIC(12, 2) NOT NULL,
  monthly_cost NUMERIC(12, 2),
  coverage_amount NUMERIC(12, 2),
  coverage_details TEXT,
  policy_number TEXT,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE,
  end_date DATE,
  renewal_date DATE,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS monthly_cost NUMERIC(12, 2);
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS coverage_details TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS policy_number TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS renewal_date DATE;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
UPDATE public.insurance_plans
SET client_id = id::TEXT
WHERE client_id IS NULL;
UPDATE public.insurance_plans
SET updated_at = created_at
WHERE updated_at IS NULL;
ALTER TABLE public.insurance_plans ALTER COLUMN updated_at SET DEFAULT NOW();
ALTER TABLE public.insurance_plans
  DROP CONSTRAINT IF EXISTS insurance_plans_type_check;
ALTER TABLE public.insurance_plans
  ADD CONSTRAINT insurance_plans_type_check
  CHECK (type IN (
    'health', 'auto', 'liability', 'disability', 'life',
    'equipment', 'professional', 'cyber', 'umbrella', 'other'
  ));
ALTER TABLE public.insurance_plans
  DROP CONSTRAINT IF EXISTS insurance_plans_status_check;
UPDATE public.insurance_plans
SET status = CASE
  WHEN status = 'inactive' THEN 'cancelled'
  WHEN status IN ('active', 'expired', 'cancelled', 'pending') THEN status
  ELSE 'active'
END;
ALTER TABLE public.insurance_plans
  ADD CONSTRAINT insurance_plans_status_check
  CHECK (status IN ('active', 'expired', 'cancelled', 'pending'));

ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insurance plans"
  ON public.insurance_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insurance plans"
  ON public.insurance_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insurance plans"
  ON public.insurance_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own insurance plans"
  ON public.insurance_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Linked Banks table (for Plaid integration)
CREATE TABLE IF NOT EXISTS public.linked_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT,
  plaid_access_token TEXT,
  plaid_item_id TEXT,
  last_synced TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'disconnected', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.linked_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own linked banks"
  ON public.linked_banks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linked banks"
  ON public.linked_banks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own linked banks"
  ON public.linked_banks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own linked banks"
  ON public.linked_banks FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_user_client_id
  ON public.transactions(user_id, client_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_records_user_id ON public.tax_records(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_insurance_plans_user_client_id
  ON public.insurance_plans(user_id, client_id);

-- Views for quick access to financial summaries
CREATE OR REPLACE VIEW public.user_financial_summary AS
SELECT
  u.id AS user_id,
  u.full_name,
  COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS net_savings
FROM public.users u
LEFT JOIN public.transactions t ON u.id = t.user_id
GROUP BY u.id, u.full_name;

-- Grant access to view
GRANT SELECT ON public.user_financial_summary TO authenticated;

-- Sample data for testing (optional - comment out for production)
/*
INSERT INTO public.categories (user_id, name, icon, color, type) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Groceries', 'shopping-cart', '#ef4444', 'expense'),
  ((SELECT id FROM auth.users LIMIT 1), 'Freelance Income', 'work', '#10b981', 'income'),
  ((SELECT id FROM auth.users LIMIT 1), 'Tax Payments', 'account-balance', '#f59e0b', 'expense');
*/
