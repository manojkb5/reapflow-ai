-- Add missing columns and improve existing tables for CRM modules

-- Analytics improvements
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS revenue NUMERIC DEFAULT 0;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS cost_per_conversion NUMERIC DEFAULT 0;

-- Add campaign performance tracking table
CREATE TABLE IF NOT EXISTS campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Enable RLS on campaign_performance
ALTER TABLE campaign_performance ENABLE ROW LEVEL SECURITY;

-- Create policy for campaign_performance
CREATE POLICY "Users can access campaign performance in their subaccounts"
ON campaign_performance
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = campaign_performance.campaign_id 
    AND has_subaccount_access(campaigns.subaccount_id)
  )
);

-- Add AI insights table for analytics
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subaccount_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on ai_insights
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policy for ai_insights
CREATE POLICY "Users can access AI insights in their subaccounts"
ON ai_insights
FOR ALL
USING (has_subaccount_access(subaccount_id));

-- Add workflow execution logs
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  trigger_data JSONB DEFAULT '{}',
  execution_status TEXT DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  steps_completed INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0
);

-- Enable RLS on workflow_executions
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policy for workflow_executions
CREATE POLICY "Users can access workflow executions in their subaccounts"
ON workflow_executions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM workflows 
    WHERE workflows.id = workflow_executions.workflow_id 
    AND has_subaccount_access(workflows.subaccount_id)
  )
);

-- Add post analytics table for social planner
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on post_analytics
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for post_analytics
CREATE POLICY "Users can access post analytics in their subaccounts"
ON post_analytics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM scheduled_posts 
    WHERE scheduled_posts.id = post_analytics.post_id 
    AND has_subaccount_access(scheduled_posts.subaccount_id)
  )
);

-- Add integration logs for tracking connection status
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_message TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on integration_logs
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for integration_logs
CREATE POLICY "Users can access integration logs in their subaccounts"
ON integration_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM integrations 
    WHERE integrations.id = integration_logs.integration_id 
    AND has_subaccount_access(integrations.subaccount_id)
  )
);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to new tables that have updated_at
CREATE TRIGGER update_campaign_performance_updated_at
  BEFORE UPDATE ON campaign_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaign_performance_date ON campaign_performance(date);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign_id ON campaign_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_subaccount_id ON ai_insights(subaccount_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated_at ON ai_insights(generated_at);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_integration_id ON integration_logs(integration_id);