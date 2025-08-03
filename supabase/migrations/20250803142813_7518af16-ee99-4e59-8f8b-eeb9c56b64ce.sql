-- Add plan_type to profiles table
ALTER TABLE public.profiles 
ADD COLUMN plan_type TEXT DEFAULT 'solo' CHECK (plan_type IN ('solo', 'agency'));

-- Update existing users to have solo plan by default
UPDATE public.profiles SET plan_type = 'solo' WHERE plan_type IS NULL;

-- Create workflows table
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subaccount_id UUID REFERENCES public.subaccounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_blocks table
CREATE TABLE public.workflow_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('trigger', 'action', 'delay', 'condition')),
  block_data JSONB NOT NULL DEFAULT '{}',
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  connections JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflows
CREATE POLICY "Users can access workflows in their subaccounts or personal workflows" 
ON public.workflows 
FOR ALL 
USING (
  (subaccount_id IS NOT NULL AND has_subaccount_access(subaccount_id)) OR
  (subaccount_id IS NULL AND user_id = auth.uid())
);

-- Enable RLS on workflow_blocks  
ALTER TABLE public.workflow_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflow_blocks
CREATE POLICY "Users can access workflow blocks through workflow access" 
ON public.workflow_blocks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.workflows 
    WHERE workflows.id = workflow_blocks.workflow_id 
    AND (
      (workflows.subaccount_id IS NOT NULL AND has_subaccount_access(workflows.subaccount_id)) OR
      (workflows.subaccount_id IS NULL AND workflows.user_id = auth.uid())
    )
  )
);

-- Add updated_at trigger for workflows
CREATE TRIGGER update_workflows_updated_at
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();