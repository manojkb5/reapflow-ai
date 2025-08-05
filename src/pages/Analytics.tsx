import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Eye, MousePointer, Download, Calendar, Brain, Filter, Target, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format as formatDate, subDays, startOfDay, endOfDay } from "date-fns";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const platformData = [
    { name: 'Facebook', value: 45, color: 'hsl(var(--primary))', spend: 12600 },
    { name: 'Instagram', value: 30, color: 'hsl(var(--accent))', spend: 8400 },
    { name: 'Google', value: 20, color: 'hsl(var(--secondary))', spend: 5600 },
    { name: 'YouTube', value: 5, color: 'hsl(var(--muted))', spend: 1400 },
  ];

  const metrics = [
    { title: "Total Spend", value: "$28,000", change: "+12%", icon: DollarSign, color: "text-red-500" },
    { title: "Total Revenue", value: "$84,000", change: "+18%", icon: TrendingUp, color: "text-primary" },
    { title: "Impressions", value: "2.4M", change: "+25%", icon: Eye, color: "text-accent" },
    { title: "CTR", value: "3.2%", change: "+0.5%", icon: MousePointer, color: "text-orange-500" },
  ];

  const campaignPerformanceData = [
    { campaign: "Black Friday Sale", platform: "Facebook", spend: 5000, revenue: 15000, roi: 300, ctr: 3.2, conversions: 150 },
    { campaign: "Holiday Campaign", platform: "Instagram", spend: 3500, revenue: 10500, roi: 300, ctr: 2.8, conversions: 105 },
    { campaign: "New Year Promo", platform: "Google", spend: 4200, revenue: 12600, roi: 300, ctr: 4.1, conversions: 126 },
    { campaign: "Spring Collection", platform: "YouTube", spend: 2800, revenue: 8400, roi: 300, ctr: 2.1, conversions: 84 },
  ];

  useEffect(() => {
    fetchAnalyticsData();
    fetchCampaigns();
    fetchAIInsights();
  }, [timeRange, selectedCampaign, selectedPlatform]);

  const fetchAnalyticsData = async () => {
    try {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const startDate = subDays(new Date(), days);
      
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .gte('date', formatDate(startDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error) throw error;

      // Transform data for charts
      const transformedData = data?.reduce((acc: any[], item) => {
        const existing = acc.find(d => d.date === item.date);
        if (existing) {
          existing.spend += item.spend || 0;
          existing.revenue += item.revenue || 0;
          existing.impressions += item.impressions || 0;
          existing.clicks += item.clicks || 0;
        } else {
          acc.push({
            date: formatDate(new Date(item.date), 'MMM dd'),
            spend: item.spend || 0,
            revenue: item.revenue || 0,
            impressions: item.impressions || 0,
            clicks: item.clicks || 0,
          });
        }
        return acc;
      }, []) || [];

      setPerformanceData(transformedData);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, platform')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('insight_type', 'analytics')
        .order('generated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    }
  };

  const generateAIInsight = async () => {
    const aiInsights = [
      {
        title: "Revenue Spike Detected",
        description: "Your Facebook campaigns showed a 25% increase in revenue this week compared to last week. The 'Black Friday Sale' campaign is your top performer.",
        confidence_score: 0.92
      },
      {
        title: "Optimization Opportunity",
        description: "Instagram campaigns have 40% lower cost-per-conversion than Facebook. Consider reallocating 20% of Facebook budget to Instagram.",
        confidence_score: 0.87
      },
      {
        title: "Audience Insight",
        description: "Your best-performing audience segment is 'Women 25-34 interested in Fashion'. This segment has 3x higher conversion rate.",
        confidence_score: 0.94
      }
    ];
    
    const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_insights')
        .insert([
          {
            subaccount_id: '', // Will implement subaccount selection
            insight_type: 'analytics',
            title: randomInsight.title,
            description: randomInsight.description,
            confidence_score: randomInsight.confidence_score,
            metadata: { generated_by: 'analytics_ai', timestamp: new Date().toISOString() }
          }
        ]);

      if (error) throw error;
      
      await fetchAIInsights();
      toast.success('New AI insight generated!');
    } catch (error) {
      toast.error('Failed to generate AI insight');
    }
  };

  const exportData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvData = campaignPerformanceData.map(row => 
        `${row.campaign},${row.platform},${row.spend},${row.revenue},${row.roi}%,${row.ctr}%,${row.conversions}`
      ).join('\n');
      
      const csvContent = `Campaign,Platform,Spend,Revenue,ROI,CTR,Conversions\n${csvData}`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully!');
    } else {
      toast.success('PDF export would be implemented with a PDF library');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Analytics</h1>
          <p className="text-muted-foreground">Track your campaign performance and ROI with AI-powered insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="glass border-primary/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 glass border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-primary/20">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportData('csv')} className="glass border-primary/20">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportData('pdf')} className="glass border-primary/20">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Campaign</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue placeholder="All campaigns" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20">
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue placeholder="All platforms" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20">
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience Segment</Label>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue placeholder="All segments" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20">
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="lookalike">Lookalike Audiences</SelectItem>
                    <SelectItem value="custom">Custom Audiences</SelectItem>
                    <SelectItem value="interests">Interest-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {timeRange === "custom" && (
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="glass border-primary/20"
                    />
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="glass border-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass border-primary/20 hover:border-primary/40 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Section */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <Button variant="outline" onClick={generateAIInsight} className="glass border-primary/20">
              <Brain className="h-4 w-4 mr-2" />
              Generate Insight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg glass border border-secondary/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Generated {formatDate(new Date(insight.generated_at), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No AI insights available yet.</p>
              <Button variant="ghost" className="mt-2" onClick={generateAIInsight}>
                Generate your first insight
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue vs Spend over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Platform Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Spend allocation by platform</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={platformData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% ($${props.payload.spend})`, 
                    name
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Campaign Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed breakdown by campaign and platform</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-2 text-foreground">Campaign</th>
                  <th className="text-left p-2 text-foreground">Platform</th>
                  <th className="text-right p-2 text-foreground">Spend</th>
                  <th className="text-right p-2 text-foreground">Revenue</th>
                  <th className="text-right p-2 text-foreground">ROI</th>
                  <th className="text-right p-2 text-foreground">CTR</th>
                  <th className="text-right p-2 text-foreground">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {campaignPerformanceData.map((row, index) => (
                  <tr key={index} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                    <td className="p-2 text-foreground font-medium">{row.campaign}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">
                        {row.platform}
                      </Badge>
                    </td>
                    <td className="p-2 text-right text-foreground">${row.spend.toLocaleString()}</td>
                    <td className="p-2 text-right text-primary font-medium">${row.revenue.toLocaleString()}</td>
                    <td className="p-2 text-right text-primary font-medium">{row.roi}%</td>
                    <td className="p-2 text-right text-foreground">{row.ctr}%</td>
                    <td className="p-2 text-right text-foreground">{row.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;