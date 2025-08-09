import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = async (
    activityType: string, 
    description: string, 
    subaccountId: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recent_activities')
        .insert({
          subaccount_id: subaccountId,
          activity_type: activityType,
          description: description,
          created_by: user.id,
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error tracking activity:', error);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return { trackActivity };
};