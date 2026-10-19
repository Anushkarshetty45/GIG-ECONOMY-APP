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
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE public.insurance_plans
  DROP CONSTRAINT IF EXISTS insurance_plans_type_check;

ALTER TABLE public.insurance_plans
  ADD CONSTRAINT insurance_plans_type_check
  CHECK (type IN (
    'health', 'auto', 'liability', 'disability', 'life',
    'equipment', 'professional', 'cyber', 'umbrella', 'other'
  ));

CREATE UNIQUE INDEX IF NOT EXISTS idx_insurance_plans_user_client_id
  ON public.insurance_plans(user_id, client_id);
