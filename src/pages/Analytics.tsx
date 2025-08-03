import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Eye, MousePointer } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const performanceData = [
    { name: 'Jan', spend: 4000, revenue: 12000, leads: 240 },
    { name: 'Feb', spend: 3000, revenue: 9000, leads: 180 },
    { name: 'Mar', spend: 5000, revenue: 15000, leads: 300 },
    { name: 'Apr', spend: 4500, revenue: 13500, leads: 270 },
    { name: 'May', spend: 6000, revenue: 18000, leads: 360 },
    { name: 'Jun', spend: 5500, revenue: 16500, leads: 330 },
  ];

  const platformData = [
    { name: 'Facebook', value: 45, color: '#1877F2' },
    { name: 'Instagram', value: 30, color: '#E4405F' },
    { name: 'Google', value: 20, color: '#4285F4' },
    { name: 'YouTube', value: 5, color: '#FF0000' },
  ];

  const metrics = [
    { title: "Total Spend", value: "$28,000", change: "+12%", icon: DollarSign },
    { title: "Total Revenue", value: "$84,000", change: "+18%", icon: TrendingUp },
    { title: "Impressions", value: "2.4M", change: "+25%", icon: Eye },
    { title: "CTR", value: "3.2%", change: "+0.5%", icon: MousePointer },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Analytics</h1>
          <p className="text-muted-foreground">Track your campaign performance and ROI</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 glass border-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-primary/20">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-accent">{metric.change} from last period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#00ff94" strokeWidth={2} />
                <Line type="monotone" dataKey="spend" stroke="#ff6b6b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;