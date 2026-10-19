-- Apply to an existing project whose base schema is already installed.
-- This extends the existing user-scoped tables; it does not replace user data.

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

ALTER TABLE public.transactions
  ALTER COLUMN updated_at SET DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_user_client_id
  ON public.transactions(user_id, client_id);

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

ALTER TABLE public.insurance_plans
  DROP CONSTRAINT IF EXISTS insurance_plans_status_check;

UPDATE public.insurance_plans
SET status = CASE
  WHEN status = 'inactive' THEN 'cancelled'
  WHEN status = 'pending' THEN 'pending'
  WHEN status IS NULL THEN 'active'
  WHEN status IN ('active', 'expired', 'cancelled') THEN status
  ELSE 'active'
END;

ALTER TABLE public.insurance_plans
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE public.insurance_plans
  DROP CONSTRAINT IF EXISTS insurance_plans_type_check;

ALTER TABLE public.insurance_plans
  ADD CONSTRAINT insurance_plans_type_check
  CHECK (type IN (
    'health', 'auto', 'liability', 'disability', 'life',
    'equipment', 'professional', 'cyber', 'umbrella', 'other'
  ));

ALTER TABLE public.insurance_plans
  ADD CONSTRAINT insurance_plans_status_check
  CHECK (status IN ('active', 'expired', 'cancelled', 'pending'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_insurance_plans_user_client_id
  ON public.insurance_plans(user_id, client_id);

ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own insurance plans"
  ON public.insurance_plans;
DROP POLICY IF EXISTS "Users can insert own insurance plans"
  ON public.insurance_plans;
DROP POLICY IF EXISTS "Users can update own insurance plans"
  ON public.insurance_plans;
DROP POLICY IF EXISTS "Users can delete own insurance plans"
  ON public.insurance_plans;

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

CREATE TABLE IF NOT EXISTS public.tax_checklist_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_items JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT tax_checklist_progress_checked_items_object
    CHECK (jsonb_typeof(checked_items) = 'object')
);

ALTER TABLE public.tax_checklist_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tax checklist progress"
  ON public.tax_checklist_progress;
DROP POLICY IF EXISTS "Users can insert own tax checklist progress"
  ON public.tax_checklist_progress;
DROP POLICY IF EXISTS "Users can update own tax checklist progress"
  ON public.tax_checklist_progress;
DROP POLICY IF EXISTS "Users can delete own tax checklist progress"
  ON public.tax_checklist_progress;

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
