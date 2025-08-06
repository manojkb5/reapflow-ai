-- Fix RLS policies to handle first-time subaccount creation and workflows

-- Drop the existing subaccounts INSERT policy and create a simpler one
DROP POLICY IF EXISTS "Authenticated users can create subaccounts" ON public.subaccounts;
CREATE POLICY "Users can create subaccounts" 
ON public.subaccounts 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

-- Allow workflow creation with a special default subaccount ID or when user has access
DROP POLICY IF EXISTS "Users can create workflows in their subaccounts" ON public.workflows;
CREATE POLICY "Users can create workflows" 
ON public.workflows 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() AND 
  (subaccount_id = '00000000-0000-0000-0000-000000000000'::uuid OR has_subaccount_access(subaccount_id))
);

-- Update the workflow view policy to handle the default case
DROP POLICY IF EXISTS "Users can view workflows in their subaccounts" ON public.workflows;
CREATE POLICY "Users can view workflows" 
ON public.workflows 
FOR SELECT 
USING (
  created_by = auth.uid() OR 
  subaccount_id = '00000000-0000-0000-0000-000000000000'::uuid OR 
  has_subaccount_access(subaccount_id)
);

-- Update workflow update policy
DROP POLICY IF EXISTS "Users can update workflows in their subaccounts" ON public.workflows;
CREATE POLICY "Users can update workflows" 
ON public.workflows 
FOR UPDATE 
USING (
  created_by = auth.uid() AND 
  (subaccount_id = '00000000-0000-0000-0000-000000000000'::uuid OR has_subaccount_access(subaccount_id))
);

-- Update workflow delete policy  
DROP POLICY IF EXISTS "Users can delete workflows in their subaccounts" ON public.workflows;
CREATE POLICY "Users can delete workflows" 
ON public.workflows 
FOR DELETE 
USING (
  created_by = auth.uid() AND 
  (subaccount_id = '00000000-0000-0000-0000-000000000000'::uuid OR has_subaccount_access(subaccount_id))
);