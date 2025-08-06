-- Fix RLS policies for subaccounts and workflows

-- Allow users to insert into user_subaccounts when they create a subaccount
CREATE POLICY "Users can create subaccount relationships" 
ON public.user_subaccounts 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to manage their own subaccount relationships  
CREATE POLICY "Users can update their own subaccount relationships"
ON public.user_subaccounts
FOR UPDATE
USING (user_id = auth.uid());

-- Allow users to delete their own subaccount relationships
CREATE POLICY "Users can delete their own subaccount relationships"
ON public.user_subaccounts
FOR DELETE
USING (user_id = auth.uid());

-- Update the subaccounts INSERT policy to be more permissive
DROP POLICY IF EXISTS "Authenticated users can create subaccounts" ON public.subaccounts;
CREATE POLICY "Authenticated users can create subaccounts" 
ON public.subaccounts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Update workflows policy to allow creation when user has access
DROP POLICY IF EXISTS "Users can access workflows in their subaccounts" ON public.workflows;
CREATE POLICY "Users can view workflows in their subaccounts" 
ON public.workflows 
FOR SELECT 
USING (has_subaccount_access(subaccount_id));

CREATE POLICY "Users can create workflows in their subaccounts" 
ON public.workflows 
FOR INSERT 
WITH CHECK (has_subaccount_access(subaccount_id) AND created_by = auth.uid());

CREATE POLICY "Users can update workflows in their subaccounts" 
ON public.workflows 
FOR UPDATE 
USING (has_subaccount_access(subaccount_id));

CREATE POLICY "Users can delete workflows in their subaccounts" 
ON public.workflows 
FOR DELETE 
USING (has_subaccount_access(subaccount_id));