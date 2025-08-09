-- Create a table for tracking recent activities (if not exists)
CREATE TABLE IF NOT EXISTS public.recent_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subaccount_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS on recent_activities (if not already enabled)
ALTER TABLE public.recent_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for recent_activities (if not exists)
DROP POLICY IF EXISTS "Users can access activities in their subaccounts" ON public.recent_activities;
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
DROP TRIGGER IF EXISTS activity_notification_trigger ON public.recent_activities;
CREATE TRIGGER activity_notification_trigger
  AFTER INSERT ON public.recent_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.send_activity_notification();