import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Plus,
  ArrowUpRight,
  Brain,
  Zap,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      title: "Total Leads",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Campaigns",
      value: "0",
      change: "+0",
      trend: "up", 
      icon: Target,
      color: "text-accent"
    },
    {
      title: "Revenue This Month",
      value: "$0",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-accent"
    }
  ]);
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to create a recent activity
  const createActivity = async (activityType: string, description: string, subaccountId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recent_activities')
        .insert({
          subaccount_id: subaccountId,
          activity_type: activityType,
          description: description,
          created_by: user.id
        });

      if (error) {
        console.error('Error creating activity:', error);
        return;
      }

      // Refresh activities
      fetchRecentActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's subaccounts
      const { data: userSubaccounts } = await supabase
        .from('user_subaccounts')
        .select('subaccount_id')
        .eq('user_id', user.id);

      if (!userSubaccounts || userSubaccounts.length === 0) {
        setLoading(false);
        return;
      }

      const subaccountIds = userSubaccounts.map(us => us.subaccount_id);

      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .in('subaccount_id', subaccountIds);

      // Fetch active campaigns count
      const { count: campaignsCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .in('subaccount_id', subaccountIds)
        .eq('status', 'active');

      // Update stats with real data
      setStats(prevStats => [
        { ...prevStats[0], value: contactsCount?.toString() || "0" },
        { ...prevStats[1], value: campaignsCount?.toString() || "0" },
        { ...prevStats[2], value: "$0" }, // Revenue will be calculated from campaigns
        { ...prevStats[3], value: "0%" } // Conversion rate calculation
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    if (!user) return;

    try {
      // Get user's subaccounts
      const { data: userSubaccounts } = await supabase
        .from('user_subaccounts')
        .select('subaccount_id')
        .eq('user_id', user.id);

      if (!userSubaccounts || userSubaccounts.length === 0) {
        return;
      }

      const subaccountIds = userSubaccounts.map(us => us.subaccount_id);

      // Fetch recent activities
      const { data: activities, error } = await supabase
        .from('recent_activities')
        .select('*')
        .in('subaccount_id', subaccountIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      // Get creator profiles separately
      const creatorIds = activities?.map(a => a.created_by) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', creatorIds);

      // Format activities for display
      const formattedActivities = activities?.map(activity => {
        const creator = profiles?.find(p => p.user_id === activity.created_by);
        return {
          action: activity.description,
          details: `By ${creator?.first_name || 'Unknown'} ${creator?.last_name || 'User'}`,
          time: new Date(activity.created_at).toLocaleString(),
          type: activity.activity_type
        };
      }) || [];

      setRecentActivities(formattedActivities);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchRecentActivities();
    }
  }, [user]);


  const quickActions = [
    {
      title: "Create Campaign",
      description: "Launch a new marketing campaign with AI assistance",
      icon: Plus,
      variant: "neon" as const,
      action: () => {}
    },
    {
      title: "Add Contact",
      description: "Import or manually add new leads",
      icon: Users,
      variant: "glass" as const,
      action: () => {}
    },
    {
      title: "AI Assistant",
      description: "Get marketing insights and suggestions",
      icon: Brain,
      variant: "accent" as const,
      action: () => {}
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your CRM performance and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Activity className="h-3 w-3 mr-1" />
            All Systems Active
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-accent">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription>
            Latest updates across your CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading activities...</p>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activities</p>
                <p className="text-xs text-muted-foreground">Activities will appear here when you start using the CRM</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      <Card className="glass border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Powered by artificial intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg glass">
              <h4 className="font-medium text-foreground mb-2">Performance Tip</h4>
              <p className="text-sm text-muted-foreground">
                Your Facebook campaigns are performing 23% better on weekends. 
                Consider increasing budget allocation for Saturday-Sunday.
              </p>
            </div>
            <div className="p-4 rounded-lg glass">
              <h4 className="font-medium text-foreground mb-2">Content Suggestion</h4>
              <p className="text-sm text-muted-foreground">
                Video content is generating 3x more engagement. 
                AI can help generate video scripts for your next campaign.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;