-- Add plan_type to profiles table
ALTER TABLE public.profiles 
ADD COLUMN plan_type TEXT DEFAULT 'solo' CHECK (plan_type IN ('solo', 'agency'));