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

-- Create a table for tracking recent activities
CREATE TABLE IF NOT EXISTS public.recent_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subaccount_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS on recent_activities
ALTER TABLE public.recent_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for recent_activities
CREATE POLICY "Users can access activities in their subaccounts" 
ON public.recent_activities 
FOR ALL 
USING (has_subaccount_access(subaccount_id));

-- Create function to send activity notification emails
CREATE OR REPLACE FUNCTION public.send_activity_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- This will trigger an edge function to send emails
  PERFORM pg_notify('activity_notification', json_build_object(
    'activity_id', NEW.id,
    'activity_type', NEW.activity_type,
    'description', NEW.description,
    'subaccount_id', NEW.subaccount_id,
    'created_by', NEW.created_by
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for activity notifications
CREATE TRIGGER activity_notification_trigger
  AFTER INSERT ON public.recent_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.send_activity_notification();