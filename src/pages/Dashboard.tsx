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

const Dashboard = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: "Total Leads",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Campaigns",
      value: "23",
      change: "+4",
      trend: "up", 
      icon: Target,
      color: "text-accent"
    },
    {
      title: "Revenue This Month",
      value: "$45,890",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  const recentActivities = [
    {
      action: "New lead created",
      details: "John Smith from Facebook Ad Campaign",
      time: "2 minutes ago",
      type: "lead"
    },
    {
      action: "Campaign launched",
      details: "Instagram Ad - Real Estate Listings",
      time: "1 hour ago",
      type: "campaign"
    },
    {
      action: "AI generated content",
      details: "5 new ad variations created",
      time: "3 hours ago",
      type: "ai"
    },
    {
      action: "Workflow triggered",
      details: "Welcome email sent to 12 new leads",
      time: "5 hours ago",
      type: "workflow"
    }
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to boost your productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="w-full justify-start h-auto p-4 flex-col items-start"
                onClick={action.action}
              >
                <div className="flex items-center gap-2 w-full">
                  <action.icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs opacity-80 mt-1">
                  {action.description}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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